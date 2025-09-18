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

from models import Base, User, UserRole, Consultant, Consultation, ConsultationStatus, Product
from auth import get_password_hash
from datetime import datetime, timedelta

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
        
        # Create consultant profile for the consultant user
        consultant_profile = db.query(Consultant).filter(Consultant.user_id == consultant_user.id).first()
        
        if not consultant_profile:
            print("👨‍⚕️ Creating consultant profile...")
            consultant_profile = Consultant(
                user_id=consultant_user.id,
                specialization="Nutrition & Weight Management",
                bio="Experienced nutritionist specializing in weight management and healthy lifestyle coaching.",
                hourly_rate=75.0,
                experience_years=8,
                qualifications="MS in Nutrition Science, Certified Nutritionist, Weight Management Specialist",
                is_available=True
            )
            db.add(consultant_profile)
            db.commit()
            print("✅ Consultant profile created successfully")
        else:
            print("ℹ️ Consultant profile already exists")
        
        # Create sample consultations
        sample_consultations = db.query(Consultation).filter(Consultation.consultant_id == consultant_profile.id).count()
        
        if sample_consultations == 0:
            print("📅 Creating sample consultations...")
            
            # Create some past consultations (completed)
            past_consultations = [
                Consultation(
                    user_id=regular_user.id,
                    consultant_id=consultant_profile.id,
                    scheduled_time=datetime.now() - timedelta(days=7),
                    duration_minutes=60,
                    status=ConsultationStatus.COMPLETED,
                    notes="Initial consultation - discussed weight loss goals and current eating habits",
                    rating=5,
                    feedback="Very helpful session, great advice!"
                ),
                Consultation(
                    user_id=regular_user.id,
                    consultant_id=consultant_profile.id,
                    scheduled_time=datetime.now() - timedelta(days=3),
                    duration_minutes=60,
                    status=ConsultationStatus.COMPLETED,
                    notes="Follow-up session - reviewed progress and adjusted meal plan",
                    rating=4,
                    feedback="Good follow-up, made some adjustments to my plan"
                )
            ]
            
            # Create some upcoming consultations
            upcoming_consultations = [
                Consultation(
                    user_id=regular_user.id,
                    consultant_id=consultant_profile.id,
                    scheduled_time=datetime.now() + timedelta(days=2),
                    duration_minutes=60,
                    status=ConsultationStatus.SCHEDULED,
                    notes="Weekly check-in - review progress and discuss challenges"
                ),
                Consultation(
                    user_id=regular_user.id,
                    consultant_id=consultant_profile.id,
                    scheduled_time=datetime.now() + timedelta(days=5),
                    duration_minutes=60,
                    status=ConsultationStatus.SCHEDULED,
                    notes="Monthly review - assess overall progress and set new goals"
                )
            ]
            
            # Add all consultations to database
            for consultation in past_consultations + upcoming_consultations:
                db.add(consultation)
            
            db.commit()
            print("✅ Sample consultations created successfully")
        else:
            print("ℹ️ Sample consultations already exist")
        
        # Create sample products
        sample_products = db.query(Product).count()
        
        if sample_products == 0:
            print("🛍️ Creating sample products...")
            
            products = [
                Product(
                    name="Premium Whey Protein Powder",
                    description="High-quality whey protein isolate for muscle building and recovery. Contains 25g protein per serving with minimal carbs and fat.",
                    category="Supplements",
                    price=49.99,
                    stock_quantity=50,
                    image_url="https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&h=300&fit=crop",
                    ingredients="Whey Protein Isolate, Natural Vanilla Flavor, Stevia, Xanthan Gum",
                    nutritional_info='{"protein": "25g", "carbs": "3g", "fat": "1g", "calories": "120"}',
                    rating=4.8,
                    total_reviews=156,
                    is_active=True
                ),
                Product(
                    name="Organic Green Tea Extract",
                    description="Pure organic green tea extract capsules for antioxidant support and metabolism boost. Contains EGCG and catechins.",
                    category="Supplements",
                    price=24.99,
                    stock_quantity=75,
                    image_url="https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop",
                    ingredients="Organic Green Tea Extract, Vegetable Cellulose Capsule",
                    nutritional_info='{"egcg": "200mg", "catechins": "500mg", "caffeine": "25mg"}',
                    rating=4.6,
                    total_reviews=89,
                    is_active=True
                ),
                Product(
                    name="Resistance Bands Set",
                    description="Complete set of resistance bands for home workouts. Includes 5 different resistance levels and door anchor.",
                    category="Equipment",
                    price=29.99,
                    stock_quantity=30,
                    image_url="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
                    ingredients="Natural Latex Rubber, Door Anchor, Exercise Guide",
                    nutritional_info='{"resistance_levels": "5", "material": "Natural Latex", "length": "48 inches"}',
                    rating=4.7,
                    total_reviews=203,
                    is_active=True
                ),
                Product(
                    name="Protein Energy Bars",
                    description="Delicious protein bars with 20g protein and natural ingredients. Perfect for pre or post workout nutrition.",
                    category="Snacks",
                    price=19.99,
                    stock_quantity=100,
                    image_url="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
                    ingredients="Whey Protein, Dates, Almonds, Dark Chocolate, Natural Flavors",
                    nutritional_info='{"protein": "20g", "carbs": "22g", "fat": "8g", "calories": "220"}',
                    rating=4.5,
                    total_reviews=134,
                    is_active=True
                ),
                Product(
                    name="Multivitamin Complex",
                    description="Comprehensive multivitamin with 25 essential vitamins and minerals. Supports overall health and energy levels.",
                    category="Supplements",
                    price=34.99,
                    stock_quantity=60,
                    image_url="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop",
                    ingredients="Vitamin A, B-Complex, C, D, E, Zinc, Iron, Magnesium, and more",
                    nutritional_info='{"vitamins": "25", "minerals": "15", "serving_size": "2 capsules"}',
                    rating=4.4,
                    total_reviews=78,
                    is_active=True
                ),
                Product(
                    name="Yoga Mat Premium",
                    description="High-quality non-slip yoga mat with excellent cushioning and durability. Perfect for yoga, pilates, and stretching.",
                    category="Equipment",
                    price=39.99,
                    stock_quantity=40,
                    image_url="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
                    ingredients="TPE Material, Non-slip Surface, Eco-friendly",
                    nutritional_info='{"thickness": "6mm", "length": "72 inches", "width": "24 inches", "weight": "2.5 lbs"}',
                    rating=4.9,
                    total_reviews=267,
                    is_active=True
                ),
                Product(
                    name="Omega-3 Fish Oil",
                    description="High-potency omega-3 fish oil capsules for heart and brain health. Contains EPA and DHA.",
                    category="Supplements",
                    price=27.99,
                    stock_quantity=80,
                    image_url="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop",
                    ingredients="Fish Oil, EPA, DHA, Vitamin E",
                    nutritional_info='{"epa": "500mg", "dha": "300mg", "omega3": "1000mg"}',
                    rating=4.3,
                    total_reviews=92,
                    is_active=True
                ),
                Product(
                    name="Smart Water Bottle",
                    description="Insulated stainless steel water bottle with smart tracking features. Keeps drinks cold for 24 hours.",
                    category="Equipment",
                    price=22.99,
                    stock_quantity=55,
                    image_url="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
                    ingredients="Stainless Steel, BPA-free, Insulated",
                    nutritional_info='{"capacity": "32oz", "material": "Stainless Steel", "insulation": "24 hours"}',
                    rating=4.6,
                    total_reviews=145,
                    is_active=True
                )
            ]
            
            # Add all products to database
            for product in products:
                db.add(product)
            
            db.commit()
            print("✅ Sample products created successfully")
        else:
            print("ℹ️ Sample products already exist")
        
        db.close()
        
        print("\n🎉 Database initialization completed successfully!")
        print("\n📋 Sample Accounts Created:")
        print("   Admin: admin / admin123")
        print("   Consultant: consultant / consultant123")
        print("   User: user / user123")
        print("\n📊 Sample Data Created:")
        print("   - Consultant profile for Dr. Sarah Wilson")
        print("   - 2 completed consultations")
        print("   - 2 upcoming consultations")
        
    except Exception as e:
        print(f"❌ Database initialization failed: {str(e)}")
        print("\n🔧 Troubleshooting:")
        print("1. Ensure PostgreSQL is running")
        print("2. Check database connection string")
        print("3. Verify database 'fitlife' exists")
        print("4. Check user permissions")

if __name__ == "__main__":
    init_database()
