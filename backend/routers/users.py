from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import User, ProgressRecord, Order, OrderItem, Consultation, Consultant
from schemas import UserUpdate, UserResponse, ProgressRecordCreate, ProgressRecordResponse
from auth import get_current_active_user
from routers.calculators import calculate_bmi, calculate_calories, calculate_body_fat

router = APIRouter()

@router.get("/dashboard")
async def get_user_dashboard(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get user dashboard data"""
    from models import Notification
    
    # Get consultation statistics
    total_consultations = db.query(Consultation).filter(Consultation.user_id == current_user.id).count()
    completed_consultations = db.query(Consultation).filter(
        Consultation.user_id == current_user.id,
        Consultation.status == "completed"
    ).count()
    
    # Get order statistics
    total_orders = db.query(Order).filter(Order.user_id == current_user.id).count()
    completed_orders = db.query(Order).filter(
        Order.user_id == current_user.id,
        Order.status == "delivered"
    ).count()
    
    # Get progress records count
    progress_entries = db.query(ProgressRecord).filter(ProgressRecord.user_id == current_user.id).count()
    
    # Calculate current streak (simplified - consecutive days with progress entries)
    current_streak = 7  # Placeholder - implement actual streak calculation
    
    # Get recent consultations
    from sqlalchemy.orm import joinedload
    recent_consultations = db.query(Consultation).options(
        joinedload(Consultation.consultant).joinedload(Consultant.user)
    ).filter(
        Consultation.user_id == current_user.id
    ).order_by(Consultation.scheduled_time.desc()).limit(3).all()
    
    # Get recent orders
    recent_orders = db.query(Order).options(
        joinedload(Order.order_items).joinedload(OrderItem.product)
    ).filter(
        Order.user_id == current_user.id
    ).order_by(Order.created_at.desc()).limit(3).all()
    
    # Get recent progress records
    recent_progress = db.query(ProgressRecord).filter(
        ProgressRecord.user_id == current_user.id
    ).order_by(ProgressRecord.date_recorded.desc()).limit(3).all()
    
    # Get recent notifications
    recent_notifications = db.query(Notification).filter(
        Notification.user_id == current_user.id
    ).order_by(Notification.created_at.desc()).limit(5).all()
    
    return {
        "stats": {
            "totalConsultations": total_consultations,
            "totalOrders": total_orders,
            "progressEntries": progress_entries,
            "currentStreak": current_streak,
        },
        "recentConsultations": [
            {
                "id": c.id,
                "consultant": {"user": {"first_name": c.consultant.user.first_name, "last_name": c.consultant.user.last_name}},
                "scheduled_time": c.scheduled_time.isoformat(),
                "status": c.status.value if hasattr(c.status, 'value') else str(c.status),
                "type": c.consultant.specialization,
            }
            for c in recent_consultations
        ],
        "recentOrders": [
            {
                "id": o.id,
                "order_number": o.order_number,
                "total_amount": o.total_amount,
                "created_at": o.created_at.isoformat(),
                "status": o.status.value if hasattr(o.status, 'value') else str(o.status),
                "items": [item.product.name if item.product else f"Product {item.product_id}" for item in o.order_items],
            }
            for o in recent_orders
        ],
        "progressRecords": [
            {
                "date": p.date_recorded.strftime("%Y-%m-%d"),
                "weight": p.weight,
                "bodyFat": p.body_fat_percentage,
                "muscle": p.muscle_mass,
            }
            for p in recent_progress
        ],
        "notifications": [
            {
                "id": n.id,
                "title": n.title,
                "message": n.message,
                "type": n.type,
                "is_read": n.is_read,
                "created_at": n.created_at.isoformat(),
            }
            for n in recent_notifications
        ],
    }

@router.get("/profile", response_model=UserResponse)
async def get_user_profile(current_user: User = Depends(get_current_active_user)):
    """Get current user's profile"""
    return current_user

@router.put("/profile", response_model=UserResponse)
async def update_user_profile(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update current user's profile"""
    update_data = user_update.dict(exclude_unset=True)
    
    for field, value in update_data.items():
        setattr(current_user, field, value)
    
    db.commit()
    db.refresh(current_user)
    
    return current_user

@router.get("/progress", response_model=List[ProgressRecordResponse])
async def get_user_progress(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get user's progress records"""
    progress_records = db.query(ProgressRecord).filter(
        ProgressRecord.user_id == current_user.id
    ).order_by(ProgressRecord.date_recorded.desc()).all()
    
    return progress_records

@router.post("/progress", response_model=ProgressRecordResponse)
async def add_progress_record(
    progress_data: ProgressRecordCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Add a new progress record"""
    progress_record = ProgressRecord(
        user_id=current_user.id,
        **progress_data.dict()
    )
    
    db.add(progress_record)
    db.commit()
    db.refresh(progress_record)
    
    return progress_record

@router.get("/calculators/bmi")
async def get_bmi_calculation(
    height: float,
    weight: float,
    current_user: User = Depends(get_current_active_user)
):
    """Calculate BMI for current user or provided values"""
    if height and weight:
        return calculate_bmi(height, weight)
    elif current_user.height and current_user.weight:
        return calculate_bmi(current_user.height, current_user.weight)
    else:
        raise HTTPException(
            status_code=400,
            detail="Height and weight are required"
        )

@router.get("/calculators/calories")
async def get_calorie_calculation(
    current_user: User = Depends(get_current_active_user)
):
    """Calculate calorie needs for current user"""
    if not all([current_user.age, current_user.gender, current_user.height, 
                current_user.weight, current_user.activity_level, current_user.goal]):
        raise HTTPException(
            status_code=400,
            detail="Complete profile information required for calorie calculation"
        )
    
    return calculate_calories(
        current_user.age,
        current_user.gender,
        current_user.height,
        current_user.weight,
        current_user.activity_level,
        current_user.goal
    )

@router.get("/calculators/body-fat")
async def get_body_fat_calculation(
    waist: float,
    neck: float,
    hip: float = None,
    current_user: User = Depends(get_current_active_user)
):
    """Calculate body fat percentage"""
    if not all([current_user.age, current_user.gender, current_user.height, 
                current_user.weight]):
        raise HTTPException(
            status_code=400,
            detail="Complete profile information required for body fat calculation"
        )
    
    return calculate_body_fat(
        current_user.age,
        current_user.gender,
        current_user.height,
        current_user.weight,
        waist,
        neck,
        hip
    )
