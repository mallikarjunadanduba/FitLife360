from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import User, Consultant, Product, Order, OrderItem, Consultation, Notification, ProductReview
from schemas import UserResponse, ConsultantResponse, ConsultantCreate, ConsultantUpdate, ProductResponse, OrderResponse, ConsultationResponse, ProductReviewResponse
from auth import get_admin_user
from routers.notifications import create_notification

router = APIRouter()

@router.get("/dashboard")
async def get_admin_dashboard(
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Get admin dashboard statistics"""
    # Count users
    total_users = db.query(User).count()
    active_users = db.query(User).filter(User.is_active == True).count()
    
    # Count consultants
    total_consultants = db.query(Consultant).count()
    active_consultants = db.query(Consultant).filter(Consultant.is_available == True).count()
    
    # Count products
    total_products = db.query(Product).count()
    active_products = db.query(Product).filter(Product.is_active == True).count()
    
    # Count orders
    total_orders = db.query(Order).count()
    pending_orders = db.query(Order).filter(Order.status == "pending").count()
    
    # Count consultations
    total_consultations = db.query(Consultation).count()
    scheduled_consultations = db.query(Consultation).filter(Consultation.status == "scheduled").count()
    
    return {
        "users": {
            "total": total_users,
            "active": active_users
        },
        "consultants": {
            "total": total_consultants,
            "active": active_consultants
        },
        "products": {
            "total": total_products,
            "active": active_products
        },
        "orders": {
            "total": total_orders,
            "pending": pending_orders
        },
        "consultations": {
            "total": total_consultations,
            "scheduled": scheduled_consultations
        }
    }

@router.get("/users", response_model=List[UserResponse])
async def get_all_users(
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Get all users"""
    users = db.query(User).order_by(User.created_at.desc()).all()
    return users

@router.put("/users/{user_id}/status")
async def update_user_status(
    user_id: int,
    is_active: bool,
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Update user active status"""
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    user.is_active = is_active
    db.commit()
    
    return {"message": f"User status updated to {'active' if is_active else 'inactive'}"}

@router.put("/users/{user_id}/role")
async def update_user_role(
    user_id: int,
    role: str,
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Update user role (approve dietitian)"""
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    user.role = role
    db.commit()
    
    return {"message": f"User role updated to {role}"}

@router.post("/users", response_model=UserResponse)
async def create_user(
    user_data: dict,
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Create a new user (Admin only)"""
    from auth import get_password_hash
    
    # Check if username already exists
    existing_user = db.query(User).filter(User.username == user_data.get("username")).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already exists"
        )
    
    # Check if email already exists
    existing_email = db.query(User).filter(User.email == user_data.get("email")).first()
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already exists"
        )
    
    # Create user
    user = User(
        username=user_data.get("username"),
        email=user_data.get("email"),
        hashed_password=get_password_hash("defaultpassword123"),  # Default password
        first_name=user_data.get("first_name"),
        last_name=user_data.get("last_name"),
        phone=user_data.get("phone"),
        role=user_data.get("role", "USER"),
        is_active=user_data.get("is_active", True),
        is_verified=True
    )
    
    db.add(user)
    db.commit()
    db.refresh(user)
    
    return user

@router.put("/users/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: int,
    user_data: dict,
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Update user information"""
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Update fields
    user.username = user_data.get("username", user.username)
    user.email = user_data.get("email", user.email)
    user.first_name = user_data.get("first_name", user.first_name)
    user.last_name = user_data.get("last_name", user.last_name)
    user.phone = user_data.get("phone", user.phone)
    user.role = user_data.get("role", user.role)
    user.is_active = user_data.get("is_active", user.is_active)
    
    db.commit()
    db.refresh(user)
    
    return user

@router.delete("/users/{user_id}")
async def delete_user(
    user_id: int,
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Delete a user"""
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Prevent deleting admin users
    if user.role == "ADMIN":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete admin users"
        )
    
    db.delete(user)
    db.commit()
    
    return {"message": "User deleted successfully"}

@router.get("/consultants", response_model=List[ConsultantResponse])
async def get_all_consultants(
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Get all consultants"""
    consultants = db.query(Consultant).order_by(Consultant.created_at.desc()).all()
    return consultants

@router.put("/consultants/{consultant_id}/status")
async def update_consultant_status(
    consultant_id: int,
    is_available: bool,
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Update consultant availability status"""
    consultant = db.query(Consultant).filter(Consultant.id == consultant_id).first()
    
    if not consultant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Consultant not found"
        )
    
    consultant.is_available = is_available
    db.commit()
    
    return {"message": f"Consultant status updated to {'available' if is_available else 'unavailable'}"}

@router.post("/consultants", response_model=ConsultantResponse)
async def create_consultant(
    consultant_data: ConsultantCreate,
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Create a new consultant"""
    # Check if user exists
    user = db.query(User).filter(User.id == consultant_data.user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Check if user is already a consultant
    existing_consultant = db.query(Consultant).filter(Consultant.user_id == consultant_data.user_id).first()
    if existing_consultant:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User is already a consultant"
        )
    
    # Create consultant
    consultant = Consultant(
        user_id=consultant_data.user_id,
        specialization=consultant_data.specialization,
        experience_years=consultant_data.experience_years,
        qualifications=consultant_data.qualifications,
        bio=consultant_data.bio,
        hourly_rate=consultant_data.hourly_rate,
        rating=0.0,
        total_consultations=0,
        is_available=True
    )
    
    db.add(consultant)
    db.commit()
    db.refresh(consultant)
    
    return consultant

@router.put("/consultants/{consultant_id}", response_model=ConsultantResponse)
async def update_consultant(
    consultant_id: int,
    consultant_data: ConsultantUpdate,
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Update consultant information"""
    consultant = db.query(Consultant).filter(Consultant.id == consultant_id).first()
    
    if not consultant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Consultant not found"
        )
    
    # Update fields
    if consultant_data.specialization is not None:
        consultant.specialization = consultant_data.specialization
    if consultant_data.experience_years is not None:
        consultant.experience_years = consultant_data.experience_years
    if consultant_data.qualifications is not None:
        consultant.qualifications = consultant_data.qualifications
    if consultant_data.bio is not None:
        consultant.bio = consultant_data.bio
    if consultant_data.hourly_rate is not None:
        consultant.hourly_rate = consultant_data.hourly_rate
    
    db.commit()
    db.refresh(consultant)
    
    return consultant

@router.delete("/consultants/{consultant_id}")
async def delete_consultant(
    consultant_id: int,
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Delete a consultant"""
    consultant = db.query(Consultant).filter(Consultant.id == consultant_id).first()
    
    if not consultant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Consultant not found"
        )
    
    db.delete(consultant)
    db.commit()
    
    return {"message": "Consultant deleted successfully"}

@router.get("/products", response_model=List[ProductResponse])
async def get_all_products(
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Get all products including inactive ones"""
    products = db.query(Product).order_by(Product.created_at.desc()).all()
    return products

@router.get("/orders", response_model=List[OrderResponse])
async def get_all_orders(
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Get all orders"""
    orders = db.query(Order).order_by(Order.created_at.desc()).all()
    return orders

@router.get("/consultations", response_model=List[ConsultationResponse])
async def get_all_consultations(
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Get all consultations"""
    consultations = db.query(Consultation).order_by(Consultation.created_at.desc()).all()
    return consultations

@router.put("/consultations/{consultation_id}/status")
async def update_consultation_status(
    consultation_id: int,
    status: str,
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Update consultation status"""
    consultation = db.query(Consultation).filter(Consultation.id == consultation_id).first()
    
    if not consultation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Consultation not found"
        )
    
    consultation.status = status
    db.commit()
    
    return {"message": f"Consultation status updated to {status}"}

@router.put("/consultations/{consultation_id}")
async def update_consultation(
    consultation_id: int,
    consultation_data: dict,
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Update consultation details"""
    consultation = db.query(Consultation).filter(Consultation.id == consultation_id).first()
    
    if not consultation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Consultation not found"
        )
    
    # Update fields
    consultation.status = consultation_data.get("status", consultation.status)
    consultation.notes = consultation_data.get("notes", consultation.notes)
    consultation.consultant_plan = consultation_data.get("consultant_plan", consultation.consultant_plan)
    
    db.commit()
    db.refresh(consultation)
    
    return consultation

@router.delete("/consultations/{consultation_id}")
async def delete_consultation(
    consultation_id: int,
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Delete a consultation"""
    consultation = db.query(Consultation).filter(Consultation.id == consultation_id).first()
    
    if not consultation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Consultation not found"
        )
    
    db.delete(consultation)
    db.commit()
    
    return {"message": "Consultation deleted successfully"}

@router.get("/reviews", response_model=List[ProductReviewResponse])
async def get_all_reviews(
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Get all product reviews"""
    reviews = db.query(ProductReview).order_by(ProductReview.created_at.desc()).all()
    return reviews

@router.delete("/reviews/{review_id}")
async def delete_review(
    review_id: int,
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Delete a product review (Admin only)"""
    review = db.query(ProductReview).filter(ProductReview.id == review_id).first()
    
    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Review not found"
        )
    
    # Update product rating after deletion
    product = db.query(Product).filter(Product.id == review.product_id).first()
    if product:
        remaining_reviews = db.query(ProductReview).filter(
            ProductReview.product_id == product.id
        ).filter(ProductReview.id != review_id).all()
        
        if remaining_reviews:
            total_rating = sum(r.rating for r in remaining_reviews)
            product.rating = total_rating / len(remaining_reviews)
            product.total_reviews = len(remaining_reviews)
        else:
            product.rating = 0.0
            product.total_reviews = 0
    
    db.delete(review)
    db.commit()
    
    return {"message": "Review deleted successfully"}

@router.get("/analytics")
async def get_analytics(
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Get detailed analytics for admin dashboard"""
    from sqlalchemy import func
    from datetime import datetime, timedelta
    
    # Get data for last 30 days
    thirty_days_ago = datetime.now() - timedelta(days=30)
    
    # Revenue analytics
    total_revenue = db.query(func.sum(Order.total_amount)).filter(
        Order.payment_status == "completed"
    ).scalar() or 0
    
    monthly_revenue = db.query(func.sum(Order.total_amount)).filter(
        Order.payment_status == "completed",
        Order.created_at >= thirty_days_ago
    ).scalar() or 0
    
    # Order analytics
    total_orders = db.query(Order).count()
    completed_orders = db.query(Order).filter(Order.payment_status == "completed").count()
    pending_orders = db.query(Order).filter(Order.status == "pending").count()
    
    # User analytics
    new_users_this_month = db.query(User).filter(
        User.created_at >= thirty_days_ago
    ).count()
    
    # Consultation analytics
    total_consultations = db.query(Consultation).count()
    completed_consultations = db.query(Consultation).filter(
        Consultation.status == "completed"
    ).count()
    
    # Top products by sales
    top_products = db.query(
        Product.name,
        func.sum(OrderItem.quantity).label('total_sold'),
        func.sum(OrderItem.total_price).label('total_revenue')
    ).join(OrderItem).join(Order).filter(
        Order.payment_status == "completed"
    ).group_by(Product.id, Product.name).order_by(
        func.sum(OrderItem.total_price).desc()
    ).limit(5).all()
    
    # Top consultants by rating
    top_consultants = db.query(
        Consultant.id,
        Consultant.specialization,
        Consultant.rating,
        Consultant.total_consultations
    ).filter(
        Consultant.total_consultations > 0
    ).order_by(Consultant.rating.desc()).limit(5).all()
    
    return {
        "revenue": {
            "total": float(total_revenue),
            "monthly": float(monthly_revenue)
        },
        "orders": {
            "total": total_orders,
            "completed": completed_orders,
            "pending": pending_orders
        },
        "users": {
            "new_this_month": new_users_this_month
        },
        "consultations": {
            "total": total_consultations,
            "completed": completed_consultations
        },
        "top_products": [
            {
                "name": product.name,
                "total_sold": product.total_sold,
                "total_revenue": float(product.total_revenue)
            }
            for product in top_products
        ],
        "top_consultants": [
            {
                "id": consultant.id,
                "specialization": consultant.specialization,
                "rating": consultant.rating,
                "total_consultations": consultant.total_consultations
            }
            for consultant in top_consultants
        ]
    }
