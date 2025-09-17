from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
import uvicorn
from dotenv import load_dotenv
import os

from database import get_db, engine
from models import Base
from routers import auth, users, consultants, consultations, products, orders, admin, notifications, payments
from middleware import setup_middleware

# Load environment variables
try:
    load_dotenv()
except (UnicodeDecodeError, FileNotFoundError):
    # If .env file doesn't exist or has encoding issues, continue with default values
    pass

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="FitLife360 API",
    description="Comprehensive weight management platform with consultations and e-commerce",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Setup custom middleware
setup_middleware(app)

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Include routers with /api prefix
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(consultants.router, prefix="/api/consultants", tags=["Consultants"])
app.include_router(consultations.router, prefix="/api/consultations", tags=["Consultations"])
app.include_router(products.router, prefix="/api/products", tags=["Products"])
app.include_router(orders.router, prefix="/api/orders", tags=["Orders"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])
app.include_router(notifications.router, prefix="/api/notifications", tags=["Notifications"])
app.include_router(payments.router, prefix="/api/payments", tags=["Payments"])

# Include routers without /api prefix for frontend compatibility
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(consultants.router, prefix="/consultants", tags=["Consultants"])
app.include_router(consultations.router, prefix="/consultations", tags=["Consultations"])
app.include_router(products.router, prefix="/products", tags=["Products"])
app.include_router(orders.router, prefix="/orders", tags=["Orders"])
app.include_router(admin.router, prefix="/admin", tags=["Admin"])
app.include_router(notifications.router, prefix="/notifications", tags=["Notifications"])
app.include_router(payments.router, prefix="/payments", tags=["Payments"])

@app.get("/")
async def root():
    return {"message": "Welcome to FitLife360 API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "FitLife360 API is running"}

@app.get("/favicon.ico")
async def favicon():
    from fastapi.responses import FileResponse
    return FileResponse("static/favicon.ico")

@app.get("/manifest.json")
async def manifest():
    from fastapi.responses import FileResponse
    return FileResponse("static/manifest.json")

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
