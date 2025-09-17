#!/usr/bin/env python3
"""
Development startup script for FitLife360
This script starts both backend and frontend servers.
"""

import subprocess
import sys
import os
import time
import threading
from pathlib import Path

def start_backend():
    """Start the FastAPI backend server"""
    print("🚀 Starting FastAPI backend server...")
    try:
        # Change to backend directory
        backend_dir = Path("backend")
        if not backend_dir.exists():
            print("❌ Backend directory not found!")
            return
        
        # Start the server
        subprocess.run([
            sys.executable, "main.py"
        ], cwd=backend_dir, check=True)
    except subprocess.CalledProcessError as e:
        print(f"❌ Backend server failed to start: {e}")
    except KeyboardInterrupt:
        print("🛑 Backend server stopped")

def start_frontend():
    """Start the React frontend server"""
    print("🚀 Starting React frontend server...")
    try:
        # Change to frontend directory
        frontend_dir = Path("frontend")
        if not frontend_dir.exists():
            print("❌ Frontend directory not found!")
            return
        
        # Start the server
        subprocess.run([
            "npm", "start"
        ], cwd=frontend_dir, check=True)
    except subprocess.CalledProcessError as e:
        print(f"❌ Frontend server failed to start: {e}")
    except KeyboardInterrupt:
        print("🛑 Frontend server stopped")

def check_dependencies():
    """Check if required dependencies are installed"""
    print("🔍 Checking dependencies...")
    
    # Check Python dependencies
    try:
        import fastapi
        import uvicorn
        import sqlalchemy
        import razorpay
        print("✅ Python dependencies OK")
    except ImportError as e:
        print(f"❌ Missing Python dependency: {e}")
        print("   Run: pip install -r requirements.txt")
        return False
    
    # Check Node.js dependencies
    frontend_dir = Path("frontend")
    if frontend_dir.exists():
        node_modules = frontend_dir / "node_modules"
        if not node_modules.exists():
            print("❌ Node.js dependencies not installed")
            print("   Run: cd frontend && npm install")
            return False
        print("✅ Node.js dependencies OK")
    
    return True

def main():
    """Main function"""
    print("🎯 FitLife360 Development Server")
    print("=" * 40)
    
    # Check dependencies
    if not check_dependencies():
        print("\n❌ Please install dependencies first:")
        print("   Backend: pip install -r requirements.txt")
        print("   Frontend: cd frontend && npm install")
        return
    
    # Check if .env file exists
    env_file = Path("backend/.env")
    if not env_file.exists():
        print("⚠️ .env file not found!")
        print("   Please create backend/.env with your credentials")
        print("   You can copy from backend/env_example.txt")
        return
    
    print("\n🚀 Starting servers...")
    print("   Backend: http://localhost:8000")
    print("   Frontend: http://localhost:3000")
    print("   Press Ctrl+C to stop both servers")
    print("=" * 40)
    
    try:
        # Start backend in a separate thread
        backend_thread = threading.Thread(target=start_backend)
        backend_thread.daemon = True
        backend_thread.start()
        
        # Wait a bit for backend to start
        time.sleep(3)
        
        # Start frontend in main thread
        start_frontend()
        
    except KeyboardInterrupt:
        print("\n🛑 Shutting down servers...")
        print("✅ Development servers stopped")

if __name__ == "__main__":
    main()
