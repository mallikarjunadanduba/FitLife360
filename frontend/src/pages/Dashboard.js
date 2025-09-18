import React, { useState, useEffect, useCallback } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  Avatar,
  IconButton,
  Paper,
  Stack,
  CircularProgress,
} from '@mui/material';
import {
  TrendingUp,
  Store,
  Event,
  Calculate,
  LocalShipping,
  FitnessCenter,
  ArrowForward,
  Notifications,
  Star,
  AccessTime,
  AttachMoney,
  MonitorWeight,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AnimatedCard from '../components/Common/AnimatedCard';
import AnimatedSection from '../components/Common/AnimatedSection';
import AnimatedCounter from '../components/Common/AnimatedCounter';
import apiClient from '../utils/axiosConfig';
import NotificationPanel from '../components/Notifications/NotificationPanel';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalConsultations: 0,
      totalOrders: 0,
      progressEntries: 0,
      currentStreak: 0,
    },
    recentConsultations: [],
    recentOrders: [],
    progressRecords: [],
    notifications: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/api/users/dashboard');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Redirect admin and consultant users to their respective dashboards
  useEffect(() => {
    if (user?.role === 'ADMIN') {
      navigate('/admin');
    } else if (user?.role === 'CONSULTANT') {
      navigate('/consultant');
    } else if (user && token) {
      fetchDashboardData();
    }
  }, [user, token, navigate, fetchDashboardData]);

  const achievements = [
    { title: `${dashboardData.stats.currentStreak}-Day Streak`, description: 'Consistent logging', icon: <Star />, color: '#FFD700' },
    { title: 'Active User', description: `${dashboardData.stats.progressEntries} progress entries`, icon: <FitnessCenter />, color: '#2196F3' },
    { title: 'Health Focused', description: `${dashboardData.stats.totalConsultations} consultations`, icon: <TrendingUp />, color: '#4CAF50' },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      </Box>
    );
  }

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
      description: 'Schedule consultations with certified experts',
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
        <Grid item xs={12} md={4}>
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
        <Grid item xs={12} md={4}>
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

      {/* User Notifications Section */}
      <Box sx={{ mt: 4, mb: 4 }}>
        <Card sx={{ 
          borderRadius: 4,
          background: 'linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%)',
          color: '#ea580c',
          boxShadow: '0 4px 20px rgba(234, 88, 12, 0.15)',
          border: '1px solid rgba(234, 88, 12, 0.2)',
          backdropFilter: 'blur(10px)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(45deg, transparent 30%, rgba(234, 88, 12, 0.05) 50%, transparent 70%)',
            animation: 'shimmer 3s infinite',
          }
        }}>
          {/* Animated fitness icons */}
          <Box sx={{
            position: 'absolute',
            top: 20,
            right: 20,
            animation: 'bounce 2s infinite',
            opacity: 0.4
          }}>
            <MonitorWeight sx={{ color: '#ea580c', fontSize: 32 }} />
          </Box>
          <Box sx={{
            position: 'absolute',
            bottom: 20,
            left: 20,
            animation: 'bounce 2s infinite 1s',
            opacity: 0.3
          }}>
            <FitnessCenter sx={{ color: '#ea580c', fontSize: 28 }} />
          </Box>
          
          <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box sx={{ 
                backgroundColor: 'rgba(234, 88, 12, 0.1)', 
                borderRadius: '50%', 
                p: 1.5, 
                mr: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'pulse 2s infinite'
              }}>
                <Notifications sx={{ color: '#ea580c', fontSize: 24 }} />
              </Box>
              <Typography variant="h5" fontWeight="bold" sx={{ color: '#c2410c' }}>
                Fitness Updates
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#9a3412', mb: 2 }}>
              Stay motivated with workout reminders, progress updates, and fitness tips
            </Typography>
            <Box sx={{ 
              maxHeight: 400, 
              overflow: 'auto',
              backgroundColor: 'rgba(255, 255, 255, 0.6)',
              borderRadius: 3,
              p: 2,
              backdropFilter: 'blur(5px)',
              border: '1px solid rgba(234, 88, 12, 0.1)'
            }}>
              <NotificationPanel showMarkAll={true} />
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Achievements Section */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Your Achievements
        </Typography>
        <Grid container spacing={3}>
          {achievements.map((achievement, index) => (
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
