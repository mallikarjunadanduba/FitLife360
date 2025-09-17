import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Rating,
  Chip,
  TextField,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import { ShoppingCart, Star, Reviews } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../utils/axiosConfig';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [reviewData, setReviewData] = useState({
    rating: 5,
    review_text: '',
  });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await apiClient.get(`/api/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await apiClient.get(`/api/products/${id}/reviews`);
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setMessage('Product added to cart!');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    setMessage('');

    try {
      await apiClient.post(`/api/products/${id}/reviews`, reviewData);
      setMessage('Review submitted successfully!');
      setReviewData({ rating: 5, review_text: '' });
      fetchReviews();
      fetchProduct(); // Refresh product to update rating
    } catch (error) {
      setMessage(error.response?.data?.detail || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">Product not found</Alert>
        <Button onClick={() => navigate('/products')} sx={{ mt: 2 }}>
          Back to Products
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={4}>
        {/* Product Image and Basic Info */}
        <Grid item xs={12} md={6}>
          <Card>
            <Box
              component="img"
              src={product.image_url || '/placeholder-product.jpg'}
              alt={product.name}
              sx={{
                width: '100%',
                height: 400,
                objectFit: 'cover',
                borderRadius: 1,
              }}
            />
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h4" component="h1" gutterBottom>
                {product.name}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Rating
                  value={product.rating}
                  readOnly
                  sx={{ mr: 1 }}
                />
                <Typography variant="body2" color="text.secondary">
                  ({product.total_reviews} reviews)
                </Typography>
              </Box>

              <Chip
                label={product.category}
                color="primary"
                variant="outlined"
                sx={{ mb: 2 }}
              />

              <Typography variant="h4" color="primary" gutterBottom>
                ${product.price}
              </Typography>

              <Typography variant="body1" sx={{ mb: 3 }}>
                {product.description}
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Stock: {product.stock_quantity} available
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <TextField
                  type="number"
                  label="Quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  inputProps={{ min: 1, max: product.stock_quantity }}
                  sx={{ width: 100 }}
                />
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<ShoppingCart />}
                  onClick={handleAddToCart}
                  disabled={product.stock_quantity === 0}
                  sx={{ flexGrow: 1 }}
                >
                  {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                </Button>
              </Box>

              {message && (
                <Alert severity={message.includes('success') ? 'success' : 'error'} sx={{ mb: 2 }}>
                  {message}
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Product Details */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Product Details
              </Typography>
              
              {product.ingredients && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Ingredients:
                  </Typography>
                  <Typography variant="body2">
                    {product.ingredients}
                  </Typography>
                </Box>
              )}

              {product.nutritional_info && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Nutritional Information:
                  </Typography>
                  <Typography variant="body2">
                    {product.nutritional_info}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Reviews Section */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Reviews sx={{ mr: 1 }} />
                <Typography variant="h6">
                  Customer Reviews ({reviews.length})
                </Typography>
              </Box>

              {/* Add Review Form */}
              <Box component="form" onSubmit={handleReviewSubmit} sx={{ mb: 4 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Write a Review
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body2" sx={{ mr: 2 }}>
                    Rating:
                  </Typography>
                  <Rating
                    value={reviewData.rating}
                    onChange={(e) => setReviewData({ ...reviewData, rating: e.target.value })}
                  />
                </Box>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Your Review"
                  value={reviewData.review_text}
                  onChange={(e) => setReviewData({ ...reviewData, review_text: e.target.value })}
                  sx={{ mb: 2 }}
                />
                <Button
                  type="submit"
                  variant="outlined"
                  disabled={submittingReview}
                >
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </Button>
              </Box>

              <Divider sx={{ mb: 3 }} />

              {/* Reviews List */}
              {reviews.length > 0 ? (
                <Box>
                  {reviews.map((review) => (
                    <Box key={review.id} sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Typography variant="subtitle2" sx={{ mr: 2 }}>
                          {review.user.first_name} {review.user.last_name}
                        </Typography>
                        <Rating value={review.rating} readOnly size="small" />
                        <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                          {new Date(review.created_at).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Typography variant="body2">
                        {review.review_text}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography color="text.secondary">
                  No reviews yet. Be the first to review this product!
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductDetail;
