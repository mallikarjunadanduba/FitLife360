from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import User, ProgressRecord
from schemas import UserUpdate, UserResponse, ProgressRecordCreate, ProgressRecordResponse
from auth import get_current_active_user
from routers.calculators import calculate_bmi, calculate_calories, calculate_body_fat

router = APIRouter()

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
