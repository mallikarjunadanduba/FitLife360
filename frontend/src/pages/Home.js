import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Chip,
  Paper,
  Avatar,
  Stack,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import {
  TrendingUp,
  People,
  Store,
  Calculate,
  Event,
  LocalShipping,
  FitnessCenter,
  Restaurant,
  MonitorWeight,
  Psychology,
  Star,
  ArrowForward,
  PlayArrow,
  CheckCircle,
  AccessTime,
  AttachMoney,
  ShoppingCart,
  Login,
  Visibility,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import AnimatedCard from '../components/Common/AnimatedCard';
import AnimatedSection from '../components/Common/AnimatedSection';
import AnimatedCounter from '../components/Common/AnimatedCounter';
import FloatingActionButton from '../components/Common/FloatingActionButton';
import apiClient from '../utils/axiosConfig';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [initialDisplayCount] = useState(8); // Show only 8 products initially (2 rows of 4)

  // Fetch featured products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/api/products/featured/');
        setProducts(response.data); // Get all featured products
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    if (!user) {
      setSelectedProduct(product);
      setLoginDialogOpen(true);
      return;
    }
    
    addToCart(product);
    // You could add a toast notification here
  };

  const handleLoginAndAddToCart = () => {
    setLoginDialogOpen(false);
    navigate('/login');
  };

  const handleViewProduct = (product) => {
    if (!user) {
      setSelectedProduct(product);
      setLoginDialogOpen(true);
      return;
    }
    
    navigate(`/products/${product.id}`);
  };

  const handleViewMore = () => {
    setShowAllProducts(!showAllProducts);
  };

  // Get products to display based on showAllProducts state
  const displayedProducts = showAllProducts 
    ? products 
    : products.slice(0, initialDisplayCount);

  const features = [
    {
      icon: <People />,
      title: 'Expert Consultations',
      description: 'Connect with certified dietitians and fitness experts for personalized guidance.',
      color: '#4CAF50',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
    },
    {
      icon: <Calculate />,
      title: 'Health Calculators',
      description: 'Calculate BMI, body fat percentage, and calorie needs with our advanced tools.',
      color: '#FF9800',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    },
    {
      icon: <TrendingUp />,
      title: 'Progress Tracking',
      description: 'Monitor your health journey with detailed progress charts and analytics.',
      color: '#2196F3',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    },
    {
      icon: <Store />,
      title: 'Health Products',
      description: 'Shop for supplements, fitness equipment, and healthy snacks.',
      color: '#9C27B0',
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
    },
    {
      icon: <Event />,
      title: 'Appointment Booking',
      description: 'Schedule and manage consultations with our easy booking system.',
      color: '#F44336',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop&auto=format',
    },
    {
      icon: <LocalShipping />,
      title: 'Fast Delivery',
      description: 'Get your health products delivered quickly and safely.',
      color: '#4CAF50',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop',
    },
  ];

  const stats = [
    { number: '10,000+', label: 'Active Users', icon: <People /> },
    { number: '500+', label: 'Certified Experts', icon: <Star /> },
    { number: '50,000+', label: 'Consultations Completed', icon: <Event /> },
    { number: '99%', label: 'Customer Satisfaction', icon: <CheckCircle /> },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Lost 30 lbs',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      rating: 5,
      text: 'FitLife360 helped me lose 30 pounds in 6 months. The expert consultations and progress tracking made all the difference!',
    },
    {
      name: 'Mike Chen',
      role: 'Gained 15 lbs muscle',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      rating: 5,
      text: 'The convenience of having consultations, tracking, and shopping all in one place is amazing. Highly recommended!',
    },
    {
      name: 'Emily Davis',
      role: 'Maintained healthy weight',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      rating: 5,
      text: 'The health calculators are incredibly accurate and the expert advice is personalized and practical.',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 12,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1920&h=1080&fit=crop") center/cover',
            opacity: 0.1,
            zIndex: 0,
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Box
              sx={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #4CAF50, #FF9800)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
                color: 'white',
                fontSize: '48px',
                fontWeight: 'bold',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              }}
            >
              FL
            </Box>
            <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
              Transform Your Health Journey
            </Typography>
            <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
              Connect with experts, track your progress, and achieve your weight management goals
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap', mb: 6 }}>
            <Button
              variant="contained"
              size="large"
              sx={{
                backgroundColor: 'white',
                color: 'primary.main',
                '&:hover': { backgroundColor: 'grey.100' },
                px: 4,
                py: 1.5,
                borderRadius: 3,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
              }}
              onClick={() => navigate(user ? '/dashboard' : '/register')}
            >
              {user ? 'Go to Dashboard' : 'Get Started'}
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                borderColor: 'white',
                color: 'white',
                '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255,255,255,0.1)' },
                px: 4,
                py: 1.5,
                borderRadius: 3,
                fontSize: '1.1rem',
                fontWeight: 'bold',
              }}
              onClick={() => navigate('/consultants')}
            >
              Find Experts
            </Button>
          </Box>

          {/* Video Preview */}
          <Box sx={{ textAlign: 'center' }}>
            <Paper
              sx={{
                p: 2,
                borderRadius: 3,
                backgroundColor: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                display: 'inline-flex',
                alignItems: 'center',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.2)',
                },
              }}
            >
              <IconButton sx={{ color: 'white', mr: 2 }}>
                <PlayArrow fontSize="large" />
              </IconButton>
              <Typography variant="h6" fontWeight="bold">
                Watch Demo Video
              </Typography>
            </Paper>
          </Box>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box sx={{ py: 8, backgroundColor: 'background.default' }}>
        <Container maxWidth="lg">
          <AnimatedSection animation="fadeInUp" delay={0}>
            <Typography variant="h3" component="h2" textAlign="center" gutterBottom fontWeight="bold">
              Trusted by Thousands
            </Typography>
            <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
              Join our growing community of health-conscious individuals
            </Typography>
          </AnimatedSection>
          <Grid container spacing={4}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <AnimatedCard
                  delay={index * 200}
                  animation="scaleIn"
                  sx={{
                    textAlign: 'center',
                    p: 3,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
                    border: '1px solid',
                    borderColor: 'divider',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                >
                  <Avatar
                    sx={{
                      backgroundColor: 'primary.main',
                      width: 64,
                      height: 64,
                      margin: '0 auto 16px',
                      fontSize: '24px',
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.1) rotate(5deg)',
                      },
                    }}
                  >
                    {stat.icon}
                  </Avatar>
                  <AnimatedCounter
                    end={stat.number}
                    duration={2000}
                    delay={index * 200 + 500}
                    variant="h3"
                    color="primary"
                    fontWeight="bold"
                    sx={{ mb: 1 }}
                  />
                  <Typography variant="h6" color="text.secondary" fontWeight="500">
                    {stat.label}
                  </Typography>
                </AnimatedCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 8, backgroundColor: 'background.paper' }}>
        <Container maxWidth="lg">
          <AnimatedSection animation="fadeInUp" delay={0}>
            <Typography variant="h3" component="h2" textAlign="center" gutterBottom fontWeight="bold">
              Why Choose FitLife360?
            </Typography>
            <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
              Everything you need for successful weight management in one platform
            </Typography>
          </AnimatedSection>
          
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <AnimatedCard
                  delay={index * 150}
                  animation="fadeInUp"
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 3,
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      height: 200,
                      backgroundImage: `url(${feature.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      position: 'relative',
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.05)',
                      },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: `linear-gradient(135deg, ${feature.color}80, ${feature.color}40)`,
                        transition: 'opacity 0.3s ease',
                      },
                      '&:hover::before': {
                        opacity: 0.7,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 1,
                        transition: 'transform 0.3s ease',
                      }}
                    >
                      <Avatar
                        sx={{
                          backgroundColor: 'white',
                          color: feature.color,
                          width: 80,
                          height: 80,
                          fontSize: '32px',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                          transition: 'transform 0.3s ease',
                          '&:hover': {
                            transform: 'scale(1.1) rotate(5deg)',
                          },
                        }}
                      >
                        {feature.icon}
                      </Avatar>
                    </Box>
                  </Box>
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography variant="h5" component="h3" gutterBottom fontWeight="bold">
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </AnimatedCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Featured Products Section */}
      <Box sx={{ 
        py: 8, 
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1920&h=1080&fit=crop") center/cover',
          opacity: 0.03,
          zIndex: 0,
        },
      }}>
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
          <AnimatedSection animation="fadeInUp" delay={0}>
            <Box sx={{ textAlign: 'center', mb: 8 }}>
              <Typography 
                variant="h2" 
                component="h2" 
                gutterBottom 
                fontWeight="bold"
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 2,
                }}
              >
                Featured Health Products
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: '600px', mx: 'auto' }}>
                Discover our top-rated supplements, fitness equipment, and healthy snacks
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                {['Supplements', 'Equipment', 'Snacks'].map((category, index) => (
                  <Chip
                    key={category}
                    label={category}
                    sx={{
                      backgroundColor: 'rgba(102, 126, 234, 0.1)',
                      color: 'primary.main',
                      fontWeight: 'bold',
                      px: 2,
                      py: 1,
                      fontSize: '0.9rem',
                    }}
                  />
                ))}
              </Box>
            </Box>
          </AnimatedSection>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress size={60} />
            </Box>
          ) : (
            <Grid container spacing={3}>
              {displayedProducts.map((product, index) => (
                <Grid item xs={12} sm={6} md={3} key={product.id}>
                  <AnimatedCard
                    delay={index * 100}
                    animation="fadeInUp"
                    sx={{
                      height: '480px',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 4,
                      overflow: 'hidden',
                      background: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        transform: 'translateY(-12px) scale(1.02)',
                        boxShadow: '0 20px 60px rgba(102, 126, 234, 0.3)',
                        border: '1px solid rgba(102, 126, 234, 0.3)',
                      },
                    }}
                  >
                    {/* Product Image */}
                    <Box
                      sx={{
                        height: 180,
                        backgroundImage: product.image_url 
                          ? `url(${product.image_url})` 
                          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                          opacity: 0,
                          transition: 'opacity 0.3s ease',
                        },
                        '&:hover::before': {
                          opacity: 1,
                        },
                      }}
                    >
                      {!product.image_url && (
                        <Avatar
                          sx={{
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            width: 60,
                            height: 60,
                            fontSize: '24px',
                          }}
                        >
                          <Store />
                        </Avatar>
                      )}
                      <Chip
                        label={product.category}
                        sx={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                          backgroundColor: 'rgba(255,255,255,0.95)',
                          color: 'text.primary',
                          fontWeight: 'bold',
                          fontSize: '0.75rem',
                          height: '24px',
                        }}
                      />
                    </Box>
                    
                    {/* Product Content */}
                    <CardContent sx={{ flexGrow: 1, p: 2.5, display: 'flex', flexDirection: 'column' }}>
                      <Typography 
                        variant="h6" 
                        component="h3" 
                        fontWeight="bold" 
                        sx={{ 
                          mb: 1,
                          fontSize: '1rem',
                          lineHeight: 1.3,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {product.name}
                      </Typography>
                      
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ 
                          mb: 2, 
                          flexGrow: 1,
                          fontSize: '0.85rem',
                          lineHeight: 1.4,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {product.description?.substring(0, 80)}...
                      </Typography>
                      
                      {/* Rating */}
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              sx={{
                                color: i < Math.floor(product.rating || 0) ? '#FFD700' : '#E0E0E0',
                                fontSize: '14px',
                              }}
                            />
                          ))}
                        </Box>
                        <Typography variant="body2" sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
                          ({product.rating?.toFixed(1) || '0.0'})
                        </Typography>
                      </Box>
                      
                      {/* Price and Stock */}
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="h6" color="primary" fontWeight="bold" sx={{ fontSize: '1.1rem' }}>
                          ${product.price?.toFixed(2)}
                        </Typography>
                        <Chip
                          label={product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
                          color={product.stock_quantity > 0 ? 'success' : 'error'}
                          size="small"
                          sx={{ fontSize: '0.7rem', height: '20px' }}
                        />
                      </Box>
                    </CardContent>
                    
                    {/* Action Buttons */}
                    <CardActions sx={{ p: 2.5, pt: 0, gap: 1 }}>
                      <Button
                        fullWidth
                        variant="outlined"
                        size="small"
                        startIcon={<Visibility />}
                        onClick={() => handleViewProduct(product)}
                        sx={{
                          borderRadius: 2,
                          fontSize: '0.8rem',
                          height: '36px',
                          borderColor: 'primary.main',
                          color: 'primary.main',
                          '&:hover': {
                            borderColor: 'primary.dark',
                            backgroundColor: 'primary.main',
                            color: 'white',
                          },
                        }}
                      >
                        View
                      </Button>
                      <Button
                        fullWidth
                        variant="contained"
                        size="small"
                        startIcon={<ShoppingCart />}
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock_quantity <= 0}
                        sx={{
                          borderRadius: 2,
                          fontSize: '0.8rem',
                          height: '36px',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                          },
                        }}
                      >
                        Add
                      </Button>
                    </CardActions>
                  </AnimatedCard>
                </Grid>
              ))}
            </Grid>
          )}
          
          {!loading && products.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary">
                No featured products available at the moment.
              </Typography>
            </Box>
          )}
          
          {/* View More / View Less Button */}
          {!loading && products.length > initialDisplayCount && (
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleViewMore}
                endIcon={showAllProducts ? <ArrowForward sx={{ transform: 'rotate(180deg)' }} /> : <ArrowForward />}
                sx={{
                  borderRadius: 3,
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                  },
                }}
              >
                {showAllProducts ? 'View Less' : `View More (${products.length - initialDisplayCount} more)`}
              </Button>
            </Box>
          )}
          
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/products')}
              sx={{
                borderRadius: 3,
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 'bold',
              }}
            >
              Browse All Products
            </Button>
          </Box>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #FF6F00 0%, #FF9800 100%)',
          color: 'white',
          py: 8,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1920&h=1080&fit=crop") center/cover',
            opacity: 0.1,
            zIndex: 0,
          },
        }}
      >
        <Container maxWidth="lg" sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <Typography variant="h3" component="h2" gutterBottom fontWeight="bold">
            Ready to Start Your Journey?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Join thousands of users who have transformed their health with FitLife360
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              backgroundColor: 'white',
              color: 'secondary.main',
              '&:hover': { backgroundColor: 'grey.100' },
              px: 6,
              py: 2,
              borderRadius: 3,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            }}
            onClick={() => navigate(user ? '/dashboard' : '/register')}
          >
            {user ? 'Continue Your Journey' : 'Start Free Today'}
          </Button>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box sx={{ py: 8, backgroundColor: 'background.default' }}>
        <Container maxWidth="lg">
          <AnimatedSection animation="fadeInUp" delay={0}>
            <Typography variant="h3" component="h2" textAlign="center" gutterBottom fontWeight="bold">
              What Our Users Say
            </Typography>
            <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
              Real stories from real people who transformed their lives
            </Typography>
          </AnimatedSection>
          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <AnimatedCard
                  delay={index * 200}
                  animation="fadeInUp"
                  sx={{
                    p: 3,
                    height: '100%',
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #ffffff, #f8f9fa)',
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar
                      src={testimonial.image}
                      sx={{ 
                        width: 60, 
                        height: 60, 
                        mr: 2,
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.1)',
                        },
                      }}
                    />
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {testimonial.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {testimonial.role}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', mb: 2 }}>
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star 
                        key={i} 
                        sx={{ 
                          color: '#FFD700', 
                          fontSize: '20px',
                          transition: 'transform 0.3s ease',
                          '&:hover': {
                            transform: 'scale(1.2)',
                          },
                        }} 
                      />
                    ))}
                  </Box>
                  <Typography variant="body1" sx={{ fontStyle: 'italic', color: 'text.primary' }}>
                    "{testimonial.text}"
                  </Typography>
                </AnimatedCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Floating Action Button */}
      <FloatingActionButton
        icon={<ArrowForward />}
        tooltip={user ? "Go to Dashboard" : "Get Started"}
        onClick={() => navigate(user ? '/dashboard' : '/register')}
        delay={2000}
        color="primary"
      />

      {/* Login Required Dialog */}
      <Dialog
        open={loginDialogOpen}
        onClose={() => setLoginDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 2,
          },
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
          <Avatar
            sx={{
              bgcolor: 'primary.main',
              width: 60,
              height: 60,
              mx: 'auto',
              mb: 2,
            }}
          >
            <Login />
          </Avatar>
          <Typography variant="h5" fontWeight="bold">
            Login Required
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', py: 2 }}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            You need to be logged in to {selectedProduct ? 'add products to cart' : 'view product details'}.
          </Typography>
          {selectedProduct && (
            <Card sx={{ p: 2, mb: 2, backgroundColor: 'background.default' }}>
              <Typography variant="subtitle1" fontWeight="bold">
                {selectedProduct.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ${selectedProduct.price?.toFixed(2)}
              </Typography>
            </Card>
          )}
          <Typography variant="body2" color="text.secondary">
            Sign in to your account or create a new one to continue shopping.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 3 }}>
          <Button
            variant="outlined"
            onClick={() => setLoginDialogOpen(false)}
            sx={{ borderRadius: 2, px: 3 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleLoginAndAddToCart}
            startIcon={<Login />}
            sx={{
              borderRadius: 2,
              px: 4,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
              },
            }}
          >
            Sign In
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Home;
