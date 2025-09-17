import React from 'react';
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
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AnimatedCard from '../components/Common/AnimatedCard';
import AnimatedSection from '../components/Common/AnimatedSection';
import AnimatedCounter from '../components/Common/AnimatedCounter';
import FloatingActionButton from '../components/Common/FloatingActionButton';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

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
    </Box>
  );
};

export default Home;
