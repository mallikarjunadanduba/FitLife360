#!/usr/bin/env python3
"""
FitLife360 Setup Script
This script helps you set up the FitLife360 application with your credentials.
"""

import os
import subprocess
import sys

def create_env_file():
    """Create .env file with the provided credentials"""
    env_content = """# Database Configuration
DATABASE_URL=postgresql://postgres:root@localhost:5432/fitlife

# JWT Secret Key
SECRET_KEY=fitlife360-super-secret-jwt-key-2024

# Twilio Configuration (for SMS)
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=your-twilio-phone-number

# Razorpay Configuration (for payments)
RAZORPAY_KEY_ID=rzp_test_RIaOOBUcPzqnqM
RAZORPAY_KEY_SECRET=F7SucDajhR0B7Ryofiilmm9L

# Email Configuration
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
EMAIL_USER=mempty238@gmail.com
EMAIL_PASSWORD=uxtatjqrichxfmls

# Redis Configuration (for caching)
REDIS_URL=redis://localhost:6379

# Application Configuration
DEBUG=True
HOST=0.0.0.0
PORT=8000
"""
    
    with open('backend/.env', 'w') as f:
        f.write(env_content)
    
    print("✅ Created backend/.env file with your credentials")

def install_backend_dependencies():
    """Install Python dependencies"""
    print("📦 Installing backend dependencies...")
    try:
        subprocess.run([sys.executable, '-m', 'pip', 'install', '-r', 'requirements.txt'], check=True)
        print("✅ Backend dependencies installed successfully")
    except subprocess.CalledProcessError:
        print("❌ Failed to install backend dependencies")
        return False
    return True

def install_frontend_dependencies():
    """Install Node.js dependencies"""
    print("📦 Installing frontend dependencies...")
    try:
        subprocess.run(['npm', 'install'], cwd='frontend', check=True)
        print("✅ Frontend dependencies installed successfully")
    except subprocess.CalledProcessError:
        print("❌ Failed to install frontend dependencies")
        return False
    return True

def create_database():
    """Create PostgreSQL database"""
    print("🗄️ Creating PostgreSQL database...")
    try:
        # Create database using psql
        subprocess.run([
            'psql', '-U', 'postgres', '-c', 'CREATE DATABASE fitlife;'
        ], check=True)
        print("✅ Database 'fitlife' created successfully")
    except subprocess.CalledProcessError:
        print("⚠️ Database creation failed. Please create it manually:")
        print("   psql -U postgres -c 'CREATE DATABASE fitlife;'")
    except FileNotFoundError:
        print("⚠️ PostgreSQL not found. Please install PostgreSQL and create the database manually:")
        print("   psql -U postgres -c 'CREATE DATABASE fitlife;'")

def main():
    """Main setup function"""
    print("🚀 Setting up FitLife360...")
    print("=" * 50)
    
    # Create .env file
    create_env_file()
    
    # Install dependencies
    if not install_backend_dependencies():
        return
    
    if not install_frontend_dependencies():
        return
    
    # Create database
    create_database()
    
    print("=" * 50)
    print("🎉 Setup completed successfully!")
    print("\n📋 Next steps:")
    print("1. Start the backend server:")
    print("   cd backend && python main.py")
    print("\n2. Start the frontend server:")
    print("   cd frontend && npm start")
    print("\n3. Visit http://localhost:3000")
    print("\n🔑 Your credentials are configured:")
    print("   Database: postgresql://postgres:root@localhost:5432/fitlife")
    print("   Razorpay: rzp_test_RIaOOBUcPzqnqM")
    print("   Email: mempty238@gmail.com")

if __name__ == "__main__":
    main()
