from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from twilio.rest import Client
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv
from database import get_db
from models import Notification, User
from schemas import NotificationResponse
from auth import get_current_active_user, get_admin_user

try:
    load_dotenv()
except (UnicodeDecodeError, FileNotFoundError):
    # If .env file doesn't exist or has encoding issues, continue with default values
    pass

router = APIRouter()

# Initialize Twilio client
twilio_client = Client(
    os.getenv("TWILIO_ACCOUNT_SID"),
    os.getenv("TWILIO_AUTH_TOKEN")
)

def send_email_notification(to_email: str, subject: str, body: str):
    """Send email notification"""
    try:
        # Email configuration
        smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
        smtp_port = int(os.getenv("SMTP_PORT", "587"))
        email_user = os.getenv("EMAIL_USER")
        email_password = os.getenv("EMAIL_PASSWORD")
        
        if not email_user or not email_password:
            return False
        
        # Create message
        msg = MIMEMultipart()
        msg['From'] = email_user
        msg['To'] = to_email
        msg['Subject'] = subject
        
        msg.attach(MIMEText(body, 'html'))
        
        # Send email
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(email_user, email_password)
        text = msg.as_string()
        server.sendmail(email_user, to_email, text)
        server.quit()
        
        return True
    
    except Exception as e:
        print(f"Email sending error: {e}")
        return False

def send_sms_notification(to_phone: str, message: str):
    """Send SMS notification using Twilio"""
    try:
        twilio_phone = os.getenv("TWILIO_PHONE_NUMBER")
        
        if not twilio_phone:
            return False
        
        message = twilio_client.messages.create(
            body=message,
            from_=twilio_phone,
            to=to_phone
        )
        
        return True
    
    except Exception as e:
        print(f"SMS sending error: {e}")
        return False

async def create_notification(
    user_id: int,
    title: str,
    message: str,
    notification_type: str,
    send_email: bool = False,
    send_sms: bool = False,
    db: Session = None
):
    """Create a notification and optionally send via email/SMS"""
    notification = Notification(
        user_id=user_id,
        title=title,
        message=message,
        type=notification_type,
        sent_via_email=send_email,
        sent_via_sms=send_sms
    )
    
    db.add(notification)
    db.flush()
    
    # Send email if requested
    if send_email:
        user = db.query(User).filter(User.id == user_id).first()
        if user and user.email:
            email_sent = send_email_notification(
                user.email,
                title,
                f"<h2>{title}</h2><p>{message}</p>"
            )
            notification.sent_via_email = email_sent
    
    # Send SMS if requested
    if send_sms:
        user = db.query(User).filter(User.id == user_id).first()
        if user and user.phone:
            sms_sent = send_sms_notification(user.phone, f"{title}: {message}")
            notification.sent_via_sms = sms_sent
    
    db.commit()
    db.refresh(notification)
    
    return notification

@router.get("/", response_model=List[NotificationResponse])
async def get_user_notifications(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get notifications for current user"""
    notifications = db.query(Notification).filter(
        Notification.user_id == current_user.id
    ).order_by(Notification.created_at.desc()).all()
    
    return notifications

@router.put("/{notification_id}/read")
async def mark_notification_read(
    notification_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Mark a notification as read"""
    notification = db.query(Notification).filter(
        Notification.id == notification_id,
        Notification.user_id == current_user.id
    ).first()
    
    if not notification:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found"
        )
    
    notification.is_read = True
    db.commit()
    
    return {"message": "Notification marked as read"}

@router.put("/read-all")
async def mark_all_notifications_read(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Mark all notifications as read for current user"""
    db.query(Notification).filter(
        Notification.user_id == current_user.id,
        Notification.is_read == False
    ).update({"is_read": True})
    
    db.commit()
    
    return {"message": "All notifications marked as read"}

@router.post("/send")
async def send_notification(
    user_id: int,
    title: str,
    message: str,
    notification_type: str,
    send_email: bool = False,
    send_sms: bool = False,
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Send a notification to a specific user (Admin only)"""
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    notification = await create_notification(
        user_id=user_id,
        title=title,
        message=message,
        notification_type=notification_type,
        send_email=send_email,
        send_sms=send_sms,
        db=db
    )
    
    return {"message": "Notification sent successfully", "notification_id": notification.id}

@router.post("/broadcast")
async def broadcast_notification(
    title: str,
    message: str,
    notification_type: str,
    send_email: bool = False,
    send_sms: bool = False,
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Broadcast notification to all active users (Admin only)"""
    active_users = db.query(User).filter(User.is_active == True).all()
    
    sent_count = 0
    for user in active_users:
        try:
            await create_notification(
                user_id=user.id,
                title=title,
                message=message,
                notification_type=notification_type,
                send_email=send_email,
                send_sms=send_sms,
                db=db
            )
            sent_count += 1
        except Exception as e:
            print(f"Error sending notification to user {user.id}: {e}")
    
    return {"message": f"Notification broadcasted to {sent_count} users"}
