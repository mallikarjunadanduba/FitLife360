#!/usr/bin/env python3
"""
Database initialization script for FitLife360
This script creates the database tables and initial data.
"""

import os
import sys
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from models import Base, User, UserRole
from auth import get_password_hash

# Load environment variables
try:
    load_dotenv()
except (UnicodeDecodeError, FileNotFoundError):
    # If .env file doesn't exist or has encoding issues, continue with default values
    pass

def init_database():
    """Initialize the database with tables and initial data"""
    
    # Get database URL
    database_url = os.getenv("DATABASE_URL", "postgresql://postgres:root@localhost:5432/fitlife")
    
    print(f"🔗 Connecting to database: {database_url}")
    
    try:
        # Create engine
        engine = create_engine(database_url)
        
        # Create all tables
        print("📋 Creating database tables...")
        Base.metadata.create_all(bind=engine)
        print("✅ Database tables created successfully")
        
        # Create session
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        db = SessionLocal()
        
        # Check if admin user exists
        admin_user = db.query(User).filter(User.username == "admin").first()
        
        if not admin_user:
            print("👤 Creating admin user...")
            admin_user = User(
                username="admin",
                email="admin@fitlife360.com",
                hashed_password=get_password_hash("admin123"),
                first_name="Admin",
                last_name="User",
                role=UserRole.ADMIN,
                is_active=True,
                is_verified=True
            )
            db.add(admin_user)
            db.commit()
            print("✅ Admin user created successfully")
            print("   Username: admin")
            print("   Password: admin123")
        else:
            print("ℹ️ Admin user already exists")
        
        # Create sample consultant
        consultant_user = db.query(User).filter(User.username == "consultant").first()
        
        if not consultant_user:
            print("👨‍⚕️ Creating sample consultant...")
            consultant_user = User(
                username="consultant",
                email="consultant@fitlife360.com",
                hashed_password=get_password_hash("consultant123"),
                first_name="Dr. Sarah",
                last_name="Wilson",
                role=UserRole.CONSULTANT,
                is_active=True,
                is_verified=True
            )
            db.add(consultant_user)
            db.commit()
            print("✅ Sample consultant created successfully")
            print("   Username: consultant")
            print("   Password: consultant123")
        else:
            print("ℹ️ Sample consultant already exists")
        
        # Create sample regular user
        regular_user = db.query(User).filter(User.username == "user").first()
        
        if not regular_user:
            print("👤 Creating sample user...")
            regular_user = User(
                username="user",
                email="user@fitlife360.com",
                hashed_password=get_password_hash("user123"),
                first_name="John",
                last_name="Doe",
                role=UserRole.USER,
                is_active=True,
                is_verified=True
            )
            db.add(regular_user)
            db.commit()
            print("✅ Sample user created successfully")
            print("   Username: user")
            print("   Password: user123")
        else:
            print("ℹ️ Sample user already exists")
        
        db.close()
        
        print("\n🎉 Database initialization completed successfully!")
        print("\n📋 Sample Accounts Created:")
        print("   Admin: admin / admin123")
        print("   Consultant: consultant / consultant123")
        print("   User: user / user123")
        
    except Exception as e:
        print(f"❌ Database initialization failed: {str(e)}")
        print("\n🔧 Troubleshooting:")
        print("1. Ensure PostgreSQL is running")
        print("2. Check database connection string")
        print("3. Verify database 'fitlife' exists")
        print("4. Check user permissions")

if __name__ == "__main__":
    init_database()
