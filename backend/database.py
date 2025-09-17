from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

# Try to load .env file, but don't fail if it doesn't exist or has encoding issues
try:
    load_dotenv()
except (UnicodeDecodeError, FileNotFoundError):
    # If .env file doesn't exist or has encoding issues, continue with default values
    pass

# Database URL
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://username:password@localhost/fitlife360")

# Create engine
engine = create_engine(DATABASE_URL)

# Create session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()

# Dependency to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
