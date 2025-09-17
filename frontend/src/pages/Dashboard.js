import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Avatar,
  IconButton,
  Paper,
  Stack,
} from '@mui/material';
import {
  TrendingUp,
  People,
  Store,
  Event,
  Calculate,
  LocalShipping,
  CheckCircle,
  Schedule,
  FitnessCenter,
  Restaurant,
  MonitorWeight,
  Psychology,
  ArrowForward,
  Notifications,
  Star,
  AccessTime,
  AttachMoney,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AnimatedCard from '../components/Common/AnimatedCard';
import AnimatedSection from '../components/Common/AnimatedSection';
import AnimatedCounter from '../components/Common/AnimatedCounter';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect admin and consultant users to their respective dashboards
  useEffect(() => {
    if (user?.role === 'ADMIN') {
      navigate('/admin');
    } else if (user?.role === 'CONSULTANT') {
      navigate('/consultant');
    }
  }, [user, navigate]);

  // Dummy data for demonstration
  const [dashboardData] = useState({
    stats: {
      totalConsultations: 12,
      totalOrders: 8,
      progressEntries: 45,
      currentStreak: 7,
    },
    recentConsultations: [
      {
        id: 1,
        consultant: { user: { first_name: 'Dr. Sarah', last_name: 'Johnson' } },
        scheduled_time: '2024-01-15T10:00:00Z',
        status: 'completed',
        type: 'Nutrition Consultation',
      },
      {
        id: 2,
        consultant: { user: { first_name: 'Mike', last_name: 'Chen' } },
        scheduled_time: '2024-01-20T14:30:00Z',
        status: 'scheduled',
        type: 'Fitness Planning',
      },
      {
        id: 3,
        consultant: { user: { first_name: 'Emily', last_name: 'Davis' } },
        scheduled_time: '2024-01-18T09:15:00Z',
        status: 'completed',
        type: 'Weight Management',
      },
    ],
    recentOrders: [
      {
        id: 1,
        order_number: 'FL001234',
        total_amount: 89.99,
        created_at: '2024-01-15T10:00:00Z',
        status: 'delivered',
        items: ['Protein Powder', 'Multivitamin'],
      },
      {
        id: 2,
        order_number: 'FL001235',
        total_amount: 156.50,
        created_at: '2024-01-20T14:30:00Z',
        status: 'shipped',
        items: ['Fitness Tracker', 'Resistance Bands'],
      },
      {
        id: 3,
        order_number: 'FL001236',
        total_amount: 45.00,
        created_at: '2024-01-18T09:15:00Z',
        status: 'processing',
        items: ['Green Tea Extract'],
      },
    ],
    progressRecords: [
      { date: '2024-01-20', weight: 165, bodyFat: 18.5, muscle: 45.2 },
      { date: '2024-01-18', weight: 166, bodyFat: 18.8, muscle: 44.9 },
      { date: '2024-01-15', weight: 167, bodyFat: 19.1, muscle: 44.6 },
    ],
    achievements: [
      { title: '7-Day Streak', description: 'Consistent logging', icon: <Star />, color: '#FFD700' },
      { title: 'Weight Loss', description: 'Lost 5 lbs this month', icon: <TrendingUp />, color: '#4CAF50' },
      { title: 'Active User', description: 'Logged in 20 days', icon: <FitnessCenter />, color: '#2196F3' },
    ],
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const quickActions = [
    {
      title: 'Health Calculators',
      description: 'Calculate BMI, calories, and body fat',
      icon: <Calculate />,
      color: '#4CAF50',
      path: '/calculators',
    },
    {
      title: 'Book Consultation',
      description: 'Schedule with certified experts',
      icon: <Event />,
      color: '#FF9800',
      path: '/consultations',
    },
    {
      title: 'Track Progress',
      description: 'Log your health metrics',
      icon: <TrendingUp />,
      color: '#2196F3',
      path: '/progress',
    },
    {
      title: 'Shop Products',
      description: 'Browse health products',
      icon: <Store />,
      color: '#9C27B0',
      path: '/products',
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
              {getGreeting()}, {user?.first_name}! 👋
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Welcome to your health dashboard. Here's what's happening with your journey.
            </Typography>
          </Box>
          <IconButton sx={{ backgroundColor: 'primary.main', color: 'white' }}>
            <Notifications />
          </IconButton>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <AnimatedCard
            delay={0}
            animation="scaleIn"
            sx={{ 
              background: 'linear-gradient(135deg, #4CAF50, #45a049)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                right: 0,
                width: '100px',
                height: '100px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '50%',
                transform: 'translate(30px, -30px)',
              }
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ 
                  backgroundColor: 'rgba(255,255,255,0.2)', 
                  mr: 2,
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.1) rotate(5deg)',
                  },
                }}>
                  <Event />
                </Avatar>
                <Typography variant="h6" fontWeight="bold">Consultations</Typography>
              </Box>
              <AnimatedCounter
                end={dashboardData.stats.totalConsultations}
                duration={2000}
                delay={500}
                variant="h3"
                fontWeight="bold"
                sx={{ color: 'white' }}
              />
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Total consultations
              </Typography>
            </CardContent>
          </AnimatedCard>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <AnimatedCard
            delay={200}
            animation="scaleIn"
            sx={{ 
              background: 'linear-gradient(135deg, #FF9800, #F57C00)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                right: 0,
                width: '100px',
                height: '100px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '50%',
                transform: 'translate(30px, -30px)',
              }
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ 
                  backgroundColor: 'rgba(255,255,255,0.2)', 
                  mr: 2,
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.1) rotate(5deg)',
                  },
                }}>
                  <LocalShipping />
                </Avatar>
                <Typography variant="h6" fontWeight="bold">Orders</Typography>
              </Box>
              <AnimatedCounter
                end={dashboardData.stats.totalOrders}
                duration={2000}
                delay={700}
                variant="h3"
                fontWeight="bold"
                sx={{ color: 'white' }}
              />
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Total orders
              </Typography>
            </CardContent>
          </AnimatedCard>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <AnimatedCard
            delay={400}
            animation="scaleIn"
            sx={{ 
              background: 'linear-gradient(135deg, #2196F3, #1976D2)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                right: 0,
                width: '100px',
                height: '100px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '50%',
                transform: 'translate(30px, -30px)',
              }
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ 
                  backgroundColor: 'rgba(255,255,255,0.2)', 
                  mr: 2,
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.1) rotate(5deg)',
                  },
                }}>
                  <TrendingUp />
                </Avatar>
                <Typography variant="h6" fontWeight="bold">Progress</Typography>
              </Box>
              <AnimatedCounter
                end={dashboardData.stats.progressEntries}
                duration={2000}
                delay={900}
                variant="h3"
                fontWeight="bold"
                sx={{ color: 'white' }}
              />
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Progress entries
              </Typography>
            </CardContent>
          </AnimatedCard>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <AnimatedCard
            delay={600}
            animation="scaleIn"
            sx={{ 
              background: 'linear-gradient(135deg, #9C27B0, #7B1FA2)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                right: 0,
                width: '100px',
                height: '100px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '50%',
                transform: 'translate(30px, -30px)',
              }
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ 
                  backgroundColor: 'rgba(255,255,255,0.2)', 
                  mr: 2,
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.1) rotate(5deg)',
                  },
                }}>
                  <FitnessCenter />
                </Avatar>
                <Typography variant="h6" fontWeight="bold">Streak</Typography>
              </Box>
              <AnimatedCounter
                end={dashboardData.stats.currentStreak}
                duration={2000}
                delay={1100}
                variant="h3"
                fontWeight="bold"
                sx={{ color: 'white' }}
              />
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Day streak
              </Typography>
            </CardContent>
          </AnimatedCard>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <AnimatedSection animation="fadeInUp" delay={800}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Quick Actions
          </Typography>
          <Grid container spacing={3}>
            {quickActions.map((action, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <AnimatedCard
                  delay={index * 150 + 1000}
                  animation="fadeInUp"
                  sx={{
                    cursor: 'pointer',
                    borderRadius: 3,
                  }}
                  onClick={() => navigate(action.path)}
                >
                  <CardContent sx={{ textAlign: 'center', p: 3 }}>
                    <Avatar
                      sx={{
                        backgroundColor: action.color,
                        width: 64,
                        height: 64,
                        margin: '0 auto 16px',
                        fontSize: '28px',
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.1) rotate(5deg)',
                        },
                      }}
                    >
                      {action.icon}
                    </Avatar>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {action.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {action.description}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: action.color }}>
                      <Typography variant="body2" fontWeight="bold" sx={{ mr: 1 }}>
                        Get Started
                      </Typography>
                      <ArrowForward fontSize="small" />
                    </Box>
                  </CardContent>
                </AnimatedCard>
              </Grid>
            ))}
          </Grid>
        </Box>
      </AnimatedSection>

      <Grid container spacing={3}>
        {/* Recent Consultations */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight="bold">Recent Consultations</Typography>
                <Button 
                  size="small" 
                  onClick={() => navigate('/consultations')}
                  endIcon={<ArrowForward />}
                  sx={{ textTransform: 'none' }}
                >
                  View All
                </Button>
              </Box>
              
              <Stack spacing={2}>
                {dashboardData.recentConsultations.map((consultation, index) => (
                  <Paper
                    key={consultation.id}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'divider',
                      '&:hover': {
                        backgroundColor: 'action.hover',
                        cursor: 'pointer',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Avatar sx={{ width: 40, height: 40, mr: 2, backgroundColor: 'primary.main' }}>
                        {consultation.consultant?.user?.first_name?.[0]}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {consultation.consultant?.user?.first_name} {consultation.consultant?.user?.last_name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {consultation.type}
                        </Typography>
                      </Box>
                      <Chip
                        label={consultation.status}
                        size="small"
                        color={consultation.status === 'completed' ? 'success' : 'primary'}
                        variant="outlined"
                      />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                      <AccessTime fontSize="small" sx={{ mr: 1 }} />
                      <Typography variant="caption">
                        {new Date(consultation.scheduled_time).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Paper>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Orders */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight="bold">Recent Orders</Typography>
                <Button 
                  size="small" 
                  onClick={() => navigate('/orders')}
                  endIcon={<ArrowForward />}
                  sx={{ textTransform: 'none' }}
                >
                  View All
                </Button>
              </Box>
              
              <Stack spacing={2}>
                {dashboardData.recentOrders.map((order, index) => (
                  <Paper
                    key={order.id}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'divider',
                      '&:hover': {
                        backgroundColor: 'action.hover',
                        cursor: 'pointer',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Avatar sx={{ width: 40, height: 40, mr: 2, backgroundColor: 'secondary.main' }}>
                        <AttachMoney />
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          Order #{order.order_number}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {order.items.join(', ')}
                        </Typography>
                      </Box>
                      <Chip
                        label={order.status}
                        size="small"
                        color={order.status === 'delivered' ? 'success' : 'default'}
                        variant="outlined"
                      />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant="h6" color="primary" fontWeight="bold">
                        ${order.total_amount}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(order.created_at).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Paper>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Achievements Section */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Your Achievements
        </Typography>
        <Grid container spacing={3}>
          {dashboardData.achievements.map((achievement, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <Card sx={{ 
                borderRadius: 3,
                background: `linear-gradient(135deg, ${achievement.color}20, ${achievement.color}10)`,
                border: `2px solid ${achievement.color}40`,
              }}>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Avatar
                    sx={{
                      backgroundColor: achievement.color,
                      width: 56,
                      height: 56,
                      margin: '0 auto 16px',
                      fontSize: '24px',
                    }}
                  >
                    {achievement.icon}
                  </Avatar>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {achievement.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {achievement.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
