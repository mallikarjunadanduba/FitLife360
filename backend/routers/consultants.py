from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import Consultant, AvailabilitySlot, User, Consultation
from schemas import ConsultantCreate, ConsultantResponse, AvailabilitySlotCreate, AvailabilitySlotResponse
from auth import get_current_active_user, get_consultant_user

router = APIRouter()

@router.get("/", response_model=List[ConsultantResponse])
async def get_consultants(
    specialization: str = None,
    db: Session = Depends(get_db)
):
    """Get all available consultants, optionally filtered by specialization"""
    query = db.query(Consultant).filter(Consultant.is_available == True)
    
    if specialization:
        query = query.filter(Consultant.specialization.ilike(f"%{specialization}%"))
    
    consultants = query.all()
    return consultants

@router.get("/{consultant_id}", response_model=ConsultantResponse)
async def get_consultant(consultant_id: int, db: Session = Depends(get_db)):
    """Get a specific consultant by ID"""
    consultant = db.query(Consultant).filter(Consultant.id == consultant_id).first()
    
    if not consultant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Consultant not found"
        )
    
    return consultant

@router.post("/", response_model=ConsultantResponse)
async def create_consultant(
    consultant_data: ConsultantCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create a new consultant profile (for users who want to become consultants)"""
    # Check if user already has a consultant profile
    existing_consultant = db.query(Consultant).filter(Consultant.user_id == current_user.id).first()
    if existing_consultant:
        raise HTTPException(
            status_code=400,
            detail="Consultant profile already exists"
        )
    
    # Create consultant profile
    consultant = Consultant(
        user_id=current_user.id,
        **consultant_data.dict()
    )
    
    db.add(consultant)
    db.commit()
    db.refresh(consultant)
    
    return consultant

@router.put("/{consultant_id}", response_model=ConsultantResponse)
async def update_consultant(
    consultant_id: int,
    consultant_data: ConsultantCreate,
    current_user: User = Depends(get_consultant_user),
    db: Session = Depends(get_db)
):
    """Update consultant profile"""
    consultant = db.query(Consultant).filter(Consultant.id == consultant_id).first()
    
    if not consultant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Consultant not found"
        )
    
    # Check if user owns this consultant profile or is admin
    if consultant.user_id != current_user.id and current_user.role.value != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    # Update consultant data
    update_data = consultant_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(consultant, field, value)
    
    db.commit()
    db.refresh(consultant)
    
    return consultant

@router.get("/{consultant_id}/availability", response_model=List[AvailabilitySlotResponse])
async def get_consultant_availability(
    consultant_id: int,
    db: Session = Depends(get_db)
):
    """Get available time slots for a consultant"""
    availability_slots = db.query(AvailabilitySlot).filter(
        AvailabilitySlot.consultant_id == consultant_id,
        AvailabilitySlot.is_booked == False
    ).order_by(AvailabilitySlot.start_time).all()
    
    return availability_slots

@router.post("/{consultant_id}/availability", response_model=AvailabilitySlotResponse)
async def create_availability_slot(
    consultant_id: int,
    slot_data: AvailabilitySlotCreate,
    current_user: User = Depends(get_consultant_user),
    db: Session = Depends(get_db)
):
    """Create a new availability slot for a consultant"""
    consultant = db.query(Consultant).filter(Consultant.id == consultant_id).first()
    
    if not consultant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Consultant not found"
        )
    
    # Check if user owns this consultant profile or is admin
    if consultant.user_id != current_user.id and current_user.role.value != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    # Create availability slot
    availability_slot = AvailabilitySlot(
        consultant_id=consultant_id,
        **slot_data.dict()
    )
    
    db.add(availability_slot)
    db.commit()
    db.refresh(availability_slot)
    
    return availability_slot

@router.delete("/availability/{slot_id}")
async def delete_availability_slot(
    slot_id: int,
    current_user: User = Depends(get_consultant_user),
    db: Session = Depends(get_db)
):
    """Delete an availability slot"""
    slot = db.query(AvailabilitySlot).filter(AvailabilitySlot.id == slot_id).first()
    
    if not slot:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Availability slot not found"
        )
    
    # Check if user owns this slot or is admin
    consultant = db.query(Consultant).filter(Consultant.id == slot.consultant_id).first()
    if consultant.user_id != current_user.id and current_user.role.value != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    db.delete(slot)
    db.commit()
    
    return {"message": "Availability slot deleted successfully"}

@router.get("/dashboard")
async def get_consultant_dashboard(
    current_user: User = Depends(get_consultant_user),
    db: Session = Depends(get_db)
):
    """Get consultant dashboard data"""
    # Get consultant profile
    consultant = db.query(Consultant).filter(Consultant.user_id == current_user.id).first()
    if not consultant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Consultant profile not found"
        )
    
    # Get consultation statistics
    total_consultations = db.query(Consultation).filter(Consultation.consultant_id == consultant.id).count()
    completed_consultations = db.query(Consultation).filter(
        Consultation.consultant_id == consultant.id,
        Consultation.status == "completed"
    ).count()
    pending_consultations = db.query(Consultation).filter(
        Consultation.consultant_id == consultant.id,
        Consultation.status.in_(["scheduled", "pending"])
    ).count()
    
    # Calculate total earnings (assuming hourly_rate * completed consultations)
    total_earnings = completed_consultations * consultant.hourly_rate if consultant.hourly_rate else 0
    
    # Get average rating (simplified - you might want to implement a proper rating system)
    average_rating = 4.5  # Placeholder - implement actual rating calculation
    
    # Get recent consultations
    recent_consultations = db.query(Consultation).filter(
        Consultation.consultant_id == consultant.id
    ).order_by(Consultation.scheduled_at.desc()).limit(5).all()
    
    # Get upcoming consultations
    upcoming_consultations = db.query(Consultation).filter(
        Consultation.consultant_id == consultant.id,
        Consultation.status.in_(["scheduled", "pending"])
    ).order_by(Consultation.scheduled_at.asc()).limit(5).all()
    
    return {
        "totalConsultations": total_consultations,
        "completedConsultations": completed_consultations,
        "pendingConsultations": pending_consultations,
        "totalEarnings": total_earnings,
        "averageRating": average_rating,
        "recentConsultations": [
            {
                "id": c.id,
                "client_name": c.user.name if c.user else "Unknown Client",
                "scheduled_at": c.scheduled_at,
                "status": c.status,
                "notes": c.notes
            } for c in recent_consultations
        ],
        "upcomingConsultations": [
            {
                "id": c.id,
                "client_name": c.user.name if c.user else "Unknown Client",
                "scheduled_at": c.scheduled_at,
                "status": c.status,
                "notes": c.notes
            } for c in upcoming_consultations
        ]
    }
