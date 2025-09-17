from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from models import UserRole, ConsultationStatus, OrderStatus, PaymentStatus

# Base schemas
class UserBase(BaseModel):
    username: str
    email: EmailStr
    first_name: str
    last_name: str
    phone: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    height: Optional[float] = None
    weight: Optional[float] = None
    activity_level: Optional[str] = None
    goal: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    height: Optional[float] = None
    weight: Optional[float] = None
    activity_level: Optional[str] = None
    goal: Optional[str] = None

class UserResponse(UserBase):
    id: int
    role: UserRole
    is_active: bool
    is_verified: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Authentication schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class LoginRequest(BaseModel):
    username: str
    password: str

# Consultant schemas
class ConsultantBase(BaseModel):
    specialization: str
    experience_years: int
    qualifications: str
    bio: str
    hourly_rate: float

class ConsultantCreate(ConsultantBase):
    user_id: int

class ConsultantUpdate(BaseModel):
    specialization: Optional[str] = None
    experience_years: Optional[int] = None
    qualifications: Optional[str] = None
    bio: Optional[str] = None
    hourly_rate: Optional[float] = None

class ConsultantResponse(ConsultantBase):
    id: int
    user_id: int
    rating: float
    total_consultations: int
    is_available: bool
    created_at: datetime
    user: UserResponse

    class Config:
        from_attributes = True

# Availability schemas
class AvailabilitySlotCreate(BaseModel):
    start_time: datetime
    end_time: datetime

class AvailabilitySlotResponse(BaseModel):
    id: int
    consultant_id: int
    start_time: datetime
    end_time: datetime
    is_booked: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Consultation schemas
class ConsultationCreate(BaseModel):
    consultant_id: int
    scheduled_time: datetime
    duration_minutes: int = 60
    user_health_data: Optional[str] = None

class ConsultationUpdate(BaseModel):
    scheduled_time: Optional[datetime] = None
    notes: Optional[str] = None
    status: Optional[ConsultationStatus] = None
    rating: Optional[int] = None
    feedback: Optional[str] = None

class ConsultationResponse(BaseModel):
    id: int
    user_id: int
    consultant_id: int
    scheduled_time: datetime
    duration_minutes: int
    status: ConsultationStatus
    notes: Optional[str] = None
    user_health_data: Optional[str] = None
    consultant_plan: Optional[str] = None
    rating: Optional[int] = None
    feedback: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    user: UserResponse
    consultant: ConsultantResponse

    class Config:
        from_attributes = True

# Product schemas
class ProductBase(BaseModel):
    name: str
    description: str
    category: str
    price: float
    stock_quantity: int
    image_url: Optional[str] = None
    ingredients: Optional[str] = None
    nutritional_info: Optional[str] = None

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    price: Optional[float] = None
    stock_quantity: Optional[int] = None
    image_url: Optional[str] = None
    ingredients: Optional[str] = None
    nutritional_info: Optional[str] = None
    is_active: Optional[bool] = None

class ProductResponse(ProductBase):
    id: int
    rating: float
    total_reviews: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Order schemas
class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int

class OrderCreate(BaseModel):
    items: List[OrderItemCreate]
    shipping_address: str
    billing_address: str
    payment_method: str
    notes: Optional[str] = None

class OrderItemResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    unit_price: float
    total_price: float
    product: ProductResponse

    class Config:
        from_attributes = True

class OrderResponse(BaseModel):
    id: int
    user_id: int
    order_number: str
    total_amount: float
    status: OrderStatus
    payment_status: PaymentStatus
    payment_method: Optional[str] = None
    shipping_address: Optional[str] = None
    billing_address: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    order_items: List[OrderItemResponse]

    class Config:
        from_attributes = True

# Progress tracking schemas
class ProgressRecordCreate(BaseModel):
    weight: Optional[float] = None
    body_fat_percentage: Optional[float] = None
    muscle_mass: Optional[float] = None
    measurements: Optional[str] = None
    notes: Optional[str] = None

class ProgressRecordResponse(BaseModel):
    id: int
    user_id: int
    weight: Optional[float] = None
    body_fat_percentage: Optional[float] = None
    muscle_mass: Optional[float] = None
    measurements: Optional[str] = None
    notes: Optional[str] = None
    date_recorded: datetime

    class Config:
        from_attributes = True

# Calculator schemas
class BMICalculation(BaseModel):
    height: float  # in cm
    weight: float  # in kg

class BMIResponse(BaseModel):
    bmi: float
    category: str
    ideal_weight_range: dict

class CalorieCalculation(BaseModel):
    age: int
    gender: str
    height: float  # in cm
    weight: float  # in kg
    activity_level: str
    goal: str

class CalorieResponse(BaseModel):
    bmr: float  # Basal Metabolic Rate
    tdee: float  # Total Daily Energy Expenditure
    calorie_goal: float
    macronutrient_breakdown: dict

class BodyFatCalculation(BaseModel):
    age: int
    gender: str
    height: float  # in cm
    weight: float  # in kg
    waist: float  # in cm
    neck: float  # in cm (for men)
    hip: Optional[float] = None  # in cm (for women)

class BodyFatResponse(BaseModel):
    body_fat_percentage: float
    category: str
    ideal_range: dict

# Review schemas
class ProductReviewCreate(BaseModel):
    product_id: int
    rating: int
    review_text: Optional[str] = None

class ProductReviewResponse(BaseModel):
    id: int
    product_id: int
    user_id: int
    rating: int
    review_text: Optional[str] = None
    created_at: datetime
    user: UserResponse

    class Config:
        from_attributes = True

# Notification schemas
class NotificationResponse(BaseModel):
    id: int
    user_id: int
    title: str
    message: str
    type: str
    is_read: bool
    sent_via_email: bool
    sent_via_sms: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Payment verification schema
class PaymentVerificationRequest(BaseModel):
    payment_id: str
    order_id: str
    signature: str

# Payment processing schema
class PaymentProcessRequest(BaseModel):
    payment_id: str