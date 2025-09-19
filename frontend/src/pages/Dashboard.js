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
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, backgroundColor: '#f8f9fa' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ color: '#374151' }}>
                  Recent Consultations
                </Typography>
                <Button 
                  size="small" 
                  variant="text"
                  onClick={() => navigate('/consultations')}
                  endIcon={<ArrowForward />}
                  sx={{ 
                    textTransform: 'none',
                    color: '#3b82f6',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    px: 2,
                    py: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(59, 130, 246, 0.1)',
                      color: '#1e40af'
                    }
                  }}
                >
                  View All
                </Button>
              </Box>
              
              {dashboardData.recentConsultations.length > 0 ? (
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    '&:hover': {
                      backgroundColor: '#f9fafb',
                      cursor: 'pointer',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ 
                      width: 40, 
                      height: 40, 
                      backgroundColor: '#10b981',
                      color: 'white',
                      fontWeight: 'bold'
                    }}>
                      {dashboardData.recentConsultations[0].consultant?.user?.first_name?.[0]}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#374151', mb: 0.5 }}>
                        {dashboardData.recentConsultations[0].consultant?.user?.first_name} {dashboardData.recentConsultations[0].consultant?.user?.last_name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#6b7280', mb: 1 }}>
                        {dashboardData.recentConsultations[0].type}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AccessTime fontSize="small" sx={{ color: '#9ca3af' }} />
                        <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                          {new Date(dashboardData.recentConsultations[0].scheduled_time).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>
                    <Chip
                      label={dashboardData.recentConsultations[0].status}
                      size="small"
                      sx={{
                        backgroundColor: dashboardData.recentConsultations[0].status === 'completed' ? '#d1fae5' : 
                                        dashboardData.recentConsultations[0].status === 'scheduled' ? '#dbeafe' : '#fef2f2',
                        color: dashboardData.recentConsultations[0].status === 'completed' ? '#065f46' : 
                              dashboardData.recentConsultations[0].status === 'scheduled' ? '#1e40af' : '#dc2626',
                        fontWeight: 'bold',
                        fontSize: '11px',
                        height: '24px'
                      }}
                    />
                  </Box>
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body2" sx={{ color: '#6b7280' }}>
                    No recent consultations
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Orders */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, backgroundColor: '#f8f9fa' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ color: '#374151' }}>
                  Recent Orders
                </Typography>
                <Button 
                  size="small" 
                  variant="text"
                  onClick={() => navigate('/orders')}
                  endIcon={<ArrowForward />}
                  sx={{ 
                    textTransform: 'none',
                    color: '#3b82f6',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    px: 2,
                    py: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(59, 130, 246, 0.1)',
                      color: '#1e40af'
                    }
                  }}
                >
                  View All
                </Button>
              </Box>
              
              {dashboardData.recentOrders.length > 0 ? (
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    '&:hover': {
                      backgroundColor: '#f9fafb',
                      cursor: 'pointer',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ 
                      width: 40, 
                      height: 40, 
                      backgroundColor: '#f59e0b',
                      color: 'white',
                      fontWeight: 'bold'
                    }}>
                      <AttachMoney />
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#374151', mb: 0.5 }}>
                        Order
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#6b7280', mb: 0.5 }}>
                        #{dashboardData.recentOrders[0].order_number}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#6b7280', mb: 1, fontSize: '13px' }}>
                        {dashboardData.recentOrders[0].items.join(', ')}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="h6" fontWeight="bold" sx={{ color: '#374151' }}>
                          ${dashboardData.recentOrders[0].total_amount}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                          {new Date(dashboardData.recentOrders[0].created_at).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>
                    <Chip
                      label={dashboardData.recentOrders[0].status}
                      size="small"
                      sx={{
                        backgroundColor: dashboardData.recentOrders[0].status === 'delivered' ? '#d1fae5' : 
                                        dashboardData.recentOrders[0].status === 'shipped' ? '#dbeafe' : 
                                        dashboardData.recentOrders[0].status === 'confirmed' ? '#f3f4f6' : '#fef2f2',
                        color: dashboardData.recentOrders[0].status === 'delivered' ? '#065f46' : 
                              dashboardData.recentOrders[0].status === 'shipped' ? '#1e40af' : 
                              dashboardData.recentOrders[0].status === 'confirmed' ? '#374151' : '#dc2626',
                        fontWeight: 'bold',
                        fontSize: '11px',
                        height: '24px'
                      }}
                    />
                  </Box>
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body2" sx={{ color: '#6b7280' }}>
                    No recent orders
                  </Typography>
                </Box>
              )}
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
