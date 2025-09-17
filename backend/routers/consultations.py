from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from database import get_db
from models import Consultation, Consultant, AvailabilitySlot, User
from schemas import ConsultationCreate, ConsultationUpdate, ConsultationResponse
from auth import get_current_active_user, get_consultant_user, get_user_or_consultant

router = APIRouter()

@router.get("/", response_model=List[ConsultationResponse])
async def get_consultations(
    current_user: User = Depends(get_user_or_consultant),
    db: Session = Depends(get_db)
):
    """Get consultations for current user"""
    if current_user.role.value == "consultant":
        # Get consultations for this consultant
        consultations = db.query(Consultation).filter(
            Consultation.consultant_id == current_user.id
        ).order_by(Consultation.scheduled_time.desc()).all()
    else:
        # Get consultations for this user
        consultations = db.query(Consultation).filter(
            Consultation.user_id == current_user.id
        ).order_by(Consultation.scheduled_time.desc()).all()
    
    return consultations

@router.get("/{consultation_id}", response_model=ConsultationResponse)
async def get_consultation(
    consultation_id: int,
    current_user: User = Depends(get_user_or_consultant),
    db: Session = Depends(get_db)
):
    """Get a specific consultation"""
    consultation = db.query(Consultation).filter(Consultation.id == consultation_id).first()
    
    if not consultation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Consultation not found"
        )
    
    # Check if user has access to this consultation
    if (consultation.user_id != current_user.id and 
        consultation.consultant_id != current_user.id and 
        current_user.role.value != "admin"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    return consultation

@router.post("/", response_model=ConsultationResponse)
async def create_consultation(
    consultation_data: ConsultationCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Book a new consultation"""
    # Verify consultant exists
    consultant = db.query(Consultant).filter(Consultant.id == consultation_data.consultant_id).first()
    if not consultant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Consultant not found"
        )
    
    if not consultant.is_available:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Consultant is not available"
        )
    
    # Check if the time slot is available
    conflicting_consultation = db.query(Consultation).filter(
        Consultation.consultant_id == consultation_data.consultant_id,
        Consultation.scheduled_time == consultation_data.scheduled_time,
        Consultation.status.in_(["scheduled", "rescheduled"])
    ).first()
    
    if conflicting_consultation:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Time slot is already booked"
        )
    
    # Create consultation
    consultation = Consultation(
        user_id=current_user.id,
        **consultation_data.dict()
    )
    
    db.add(consultation)
    db.commit()
    db.refresh(consultation)
    
    return consultation

@router.put("/{consultation_id}", response_model=ConsultationResponse)
async def update_consultation(
    consultation_id: int,
    consultation_data: ConsultationUpdate,
    current_user: User = Depends(get_user_or_consultant),
    db: Session = Depends(get_db)
):
    """Update a consultation"""
    consultation = db.query(Consultation).filter(Consultation.id == consultation_id).first()
    
    if not consultation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Consultation not found"
        )
    
    # Check permissions
    if (consultation.user_id != current_user.id and 
        consultation.consultant_id != current_user.id and 
        current_user.role.value != "admin"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    # Update consultation
    update_data = consultation_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(consultation, field, value)
    
    db.commit()
    db.refresh(consultation)
    
    return consultation

@router.delete("/{consultation_id}")
async def cancel_consultation(
    consultation_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Cancel a consultation"""
    consultation = db.query(Consultation).filter(Consultation.id == consultation_id).first()
    
    if not consultation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Consultation not found"
        )
    
    # Check permissions
    if (consultation.user_id != current_user.id and 
        consultation.consultant_id != current_user.id and 
        current_user.role.value != "admin"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    # Check if consultation can be cancelled
    if consultation.status.value in ["completed", "cancelled"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot cancel this consultation"
        )
    
    # Cancel consultation
    consultation.status = "cancelled"
    db.commit()
    
    return {"message": "Consultation cancelled successfully"}

@router.post("/{consultation_id}/complete")
async def complete_consultation(
    consultation_id: int,
    consultant_plan: str,
    current_user: User = Depends(get_consultant_user),
    db: Session = Depends(get_db)
):
    """Mark consultation as completed and add consultant plan"""
    consultation = db.query(Consultation).filter(Consultation.id == consultation_id).first()
    
    if not consultation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Consultation not found"
        )
    
    # Check if user is the consultant for this consultation
    if consultation.consultant_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    # Update consultation
    consultation.status = "completed"
    consultation.consultant_plan = consultant_plan
    
    db.commit()
    
    return {"message": "Consultation completed successfully"}

@router.post("/{consultation_id}/rate")
async def rate_consultation(
    consultation_id: int,
    rating: int,
    feedback: str = None,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Rate a completed consultation"""
    if rating < 1 or rating > 5:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Rating must be between 1 and 5"
        )
    
    consultation = db.query(Consultation).filter(Consultation.id == consultation_id).first()
    
    if not consultation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Consultation not found"
        )
    
    # Check if user is the one who booked this consultation
    if consultation.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    # Check if consultation is completed
    if consultation.status.value != "completed":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Can only rate completed consultations"
        )
    
    # Update consultation rating
    consultation.rating = rating
    consultation.feedback = feedback
    
    # Update consultant's average rating
    consultant = db.query(Consultant).filter(Consultant.id == consultation.consultant_id).first()
    if consultant:
        # Recalculate average rating
        all_ratings = db.query(Consultation).filter(
            Consultation.consultant_id == consultant.id,
            Consultation.rating.isnot(None)
        ).all()
        
        if all_ratings:
            total_rating = sum(c.rating for c in all_ratings)
            consultant.rating = total_rating / len(all_ratings)
            consultant.total_consultations = len(all_ratings)
    
    db.commit()
    
    return {"message": "Consultation rated successfully"}
