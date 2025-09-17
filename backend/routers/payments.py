from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import razorpay
import os
from dotenv import load_dotenv
from database import get_db
from models import User, Order
from auth import get_current_active_user, get_admin_user
from schemas import PaymentVerificationRequest

try:
    load_dotenv()
except (UnicodeDecodeError, FileNotFoundError):
    # If .env file doesn't exist or has encoding issues, continue with default values
    pass

router = APIRouter()

# Initialize Razorpay client
razorpay_client = razorpay.Client(
    auth=(os.getenv("RAZORPAY_KEY_ID"), os.getenv("RAZORPAY_KEY_SECRET"))
)

async def create_payment_order(amount: float, order_number: str):
    """Create a Razorpay payment order"""
    try:
        # Convert amount to paise (Razorpay expects amount in smallest currency unit)
        amount_paise = int(amount * 100)
        
        payment_order = razorpay_client.order.create({
            'amount': amount_paise,
            'currency': 'INR',
            'receipt': order_number,
            'notes': {
                'order_number': order_number
            }
        })
        
        return {
            "success": True,
            "order_id": payment_order['id'],
            "amount": amount_paise,
            "currency": "INR",
            "receipt": order_number
        }
    
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

async def process_payment(amount: float, payment_id: str, order_number: str):
    """Process payment verification"""
    try:
        # For test payments, simulate success
        if payment_id.startswith("test_"):
            return {
                "success": True,
                "transaction_id": payment_id,
                "amount": amount,
                "currency": "INR"
            }
        
        # Verify payment with Razorpay
        payment = razorpay_client.payment.fetch(payment_id)
        
        if payment['status'] == 'captured':
            return {
                "success": True,
                "transaction_id": payment['id'],
                "amount": payment['amount'] / 100,  # Convert back from paise
                "currency": payment['currency']
            }
        else:
            return {
                "success": False,
                "error": f"Payment not captured. Status: {payment['status']}"
            }
    
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

@router.post("/create-order")
async def create_razorpay_order(
    amount: float,
    order_number: str,
    current_user: User = Depends(get_current_active_user)
):
    """Create a Razorpay payment order"""
    if amount <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Amount must be greater than 0"
        )
    
    result = await create_payment_order(amount, order_number)
    
    if result["success"]:
        return result
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to create payment order: {result['error']}"
        )

@router.post("/verify")
async def verify_payment(
    verification_data: PaymentVerificationRequest,
    current_user: User = Depends(get_current_active_user)
):
    """Verify payment signature"""
    try:
        # Verify payment signature
        params_dict = {
            'razorpay_order_id': verification_data.order_id,
            'razorpay_payment_id': verification_data.payment_id,
            'razorpay_signature': verification_data.signature
        }
        
        razorpay_client.utility.verify_payment_signature(params_dict)
        
        return {
            "success": True,
            "message": "Payment verified successfully",
            "payment_id": verification_data.payment_id,
            "order_id": verification_data.order_id
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Payment verification failed: {str(e)}"
        )

@router.get("/config")
async def get_payment_config():
    """Get payment configuration for frontend"""
    return {
        "key_id": os.getenv("RAZORPAY_KEY_ID"),
        "currency": "INR"
    }