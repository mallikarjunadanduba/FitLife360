from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
from models import Product, ProductReview, User
from schemas import ProductCreate, ProductUpdate, ProductResponse, ProductReviewCreate, ProductReviewResponse
from auth import get_current_active_user, get_admin_user

router = APIRouter()

@router.get("/", response_model=List[ProductResponse])
async def get_products(
    category: Optional[str] = Query(None, description="Filter by product category"),
    search: Optional[str] = Query(None, description="Search products by name"),
    min_price: Optional[float] = Query(None, description="Minimum price filter"),
    max_price: Optional[float] = Query(None, description="Maximum price filter"),
    db: Session = Depends(get_db)
):
    """Get all active products with optional filters"""
    query = db.query(Product).filter(Product.is_active == True)
    
    if category:
        query = query.filter(Product.category.ilike(f"%{category}%"))
    
    if search:
        query = query.filter(Product.name.ilike(f"%{search}%"))
    
    if min_price is not None:
        query = query.filter(Product.price >= min_price)
    
    if max_price is not None:
        query = query.filter(Product.price <= max_price)
    
    products = query.order_by(Product.created_at.desc()).all()
    return products

@router.get("/categories")
async def get_product_categories(db: Session = Depends(get_db)):
    """Get all product categories"""
    categories = db.query(Product.category).filter(
        Product.is_active == True,
        Product.category.isnot(None)
    ).distinct().all()
    
    return [cat[0] for cat in categories]

@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(product_id: int, db: Session = Depends(get_db)):
    """Get a specific product by ID"""
    product = db.query(Product).filter(Product.id == product_id).first()
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    return product

@router.post("/", response_model=ProductResponse)
async def create_product(
    product_data: ProductCreate,
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Create a new product (Admin only)"""
    product = Product(**product_data.dict())
    
    db.add(product)
    db.commit()
    db.refresh(product)
    
    return product

@router.put("/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: int,
    product_data: ProductUpdate,
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Update a product (Admin only)"""
    product = db.query(Product).filter(Product.id == product_id).first()
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    # Update product data
    update_data = product_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(product, field, value)
    
    db.commit()
    db.refresh(product)
    
    return product

@router.delete("/{product_id}")
async def delete_product(
    product_id: int,
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Delete a product (Admin only)"""
    product = db.query(Product).filter(Product.id == product_id).first()
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    # Soft delete by setting is_active to False
    product.is_active = False
    db.commit()
    
    return {"message": "Product deleted successfully"}

@router.get("/{product_id}/reviews", response_model=List[ProductReviewResponse])
async def get_product_reviews(product_id: int, db: Session = Depends(get_db)):
    """Get reviews for a specific product"""
    reviews = db.query(ProductReview).filter(
        ProductReview.product_id == product_id
    ).order_by(ProductReview.created_at.desc()).all()
    
    return reviews

@router.post("/{product_id}/reviews", response_model=ProductReviewResponse)
async def create_product_review(
    product_id: int,
    review_data: ProductReviewCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create a review for a product"""
    if review_data.rating < 1 or review_data.rating > 5:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Rating must be between 1 and 5"
        )
    
    # Check if product exists
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    # Check if user already reviewed this product
    existing_review = db.query(ProductReview).filter(
        ProductReview.product_id == product_id,
        ProductReview.user_id == current_user.id
    ).first()
    
    if existing_review:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already reviewed this product"
        )
    
    # Create review
    review = ProductReview(
        product_id=product_id,
        user_id=current_user.id,
        rating=review_data.rating,
        review_text=review_data.review_text
    )
    
    db.add(review)
    
    # Update product rating
    all_reviews = db.query(ProductReview).filter(ProductReview.product_id == product_id).all()
    if all_reviews:
        total_rating = sum(r.rating for r in all_reviews)
        product.rating = total_rating / len(all_reviews)
        product.total_reviews = len(all_reviews)
    
    db.commit()
    db.refresh(review)
    
    return review

@router.get("/featured/", response_model=List[ProductResponse])
async def get_featured_products(db: Session = Depends(get_db)):
    """Get featured products (highest rated, or all products if none meet criteria)"""
    # First try to get products with rating >= 4.0
    products = db.query(Product).filter(
        Product.is_active == True,
        Product.rating >= 4.0
    ).order_by(Product.rating.desc()).limit(10).all()
    
    # If no high-rated products, get all active products
    if not products:
        products = db.query(Product).filter(
            Product.is_active == True
        ).order_by(Product.rating.desc(), Product.created_at.desc()).limit(10).all()
    
    return products
