import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Avatar,
  Stack,
  Paper,
  IconButton,
  LinearProgress,
  CircularProgress,
} from '@mui/material';
import {
  TrendingUp,
  People,
  Event,
  Schedule,
  CheckCircle,
  Star,
  Message,
  Assessment,
  ArrowForward,
  AccessTime,
  AttachMoney,
  Psychology,
  FitnessCenter,
  Restaurant,
  MonitorWeight,
  Notifications,
  Support,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const ConsultantDashboard = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    totalConsultations: 0,
    completedConsultations: 0,
    pendingConsultations: 0,
    totalEarnings: 0,
    averageRating: 0,
    monthlyEarnings: 0,
    clientSatisfaction: 0,
    responseTime: 0,
    recentConsultations: [],
    upcomingConsultations: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && token && user.role === 'CONSULTANT') {
      fetchDashboardData();
    } else if (user?.role !== 'CONSULTANT') {
      navigate('/dashboard');
    }
  }, [user, token, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/consultants/dashboard');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const achievements = [
    { title: 'Top Performer', description: `${dashboardData.averageRating} average rating`, icon: <Star />, color: '#FFD700' },
    { title: 'Client Champion', description: `${dashboardData.clientSatisfaction}% satisfaction rate`, icon: <People />, color: '#00bcd4' },
    { title: 'Quick Responder', description: `${dashboardData.responseTime}h average response time`, icon: <AccessTime />, color: '#ff5722' },
  ];

  const quickActions = [
    {
      title: 'My Consultations',
      description: 'View consultations you provide to clients',
      icon: <Event />,
      color: '#00bcd4',
      action: () => navigate('/consultations'),
    },
    {
      title: 'Update Profile',
      description: 'Manage your consultant profile',
      icon: <People />,
      color: '#ff5722',
      action: () => navigate('/profile'),
    },
    {
      title: 'Set Availability',
      description: 'Manage your available time slots',
      icon: <Schedule />,
      color: '#00bcd4',
      action: () => navigate('/consultant/availability'),
    },
    {
      title: 'Client Messages',
      description: 'Communicate with your clients',
      icon: <Message />,
      color: '#ff5722',
      action: () => navigate('/consultant/clients'),
    },
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

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
              {getGreeting()}, {user?.first_name}! 🎯
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Welcome to your consultant dashboard. Here's your performance overview.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <IconButton sx={{ backgroundColor: 'primary.main', color: 'white' }}>
              <Support />
            </IconButton>
            <IconButton sx={{ backgroundColor: 'secondary.main', color: 'white' }}>
              <Notifications />
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #00bcd4, #0097a7)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 3,
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              right: 0,
              width: '80px',
              height: '80px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '50%',
              transform: 'translate(25px, -25px)',
            }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ backgroundColor: 'rgba(255,255,255,0.2)', mr: 2, width: 48, height: 48 }}>
                  <Event />
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    Consultations
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Total sessions
                  </Typography>
                </Box>
              </Box>
              <Typography variant="h3" fontWeight="bold" sx={{ mb: 1 }}>
                {dashboardData.totalConsultations}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {dashboardData.completedConsultations} completed
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #ff5722, #d84315)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 3,
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              right: 0,
              width: '80px',
              height: '80px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '50%',
              transform: 'translate(25px, -25px)',
            }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ backgroundColor: 'rgba(255,255,255,0.2)', mr: 2, width: 48, height: 48 }}>
                  <AttachMoney />
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    Earnings
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    This month
                  </Typography>
                </Box>
              </Box>
              <Typography variant="h3" fontWeight="bold" sx={{ mb: 1 }}>
                ${dashboardData.monthlyEarnings}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                ${dashboardData.totalEarnings} total
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #00bcd4, #0097a7)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 3,
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              right: 0,
              width: '80px',
              height: '80px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '50%',
              transform: 'translate(25px, -25px)',
            }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ backgroundColor: 'rgba(255,255,255,0.2)', mr: 2, width: 48, height: 48 }}>
                  <Star />
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    Rating
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Average rating
                  </Typography>
                </Box>
              </Box>
              <Typography variant="h3" fontWeight="bold" sx={{ mb: 1 }}>
                {dashboardData.averageRating}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {dashboardData.clientSatisfaction}% satisfaction
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #ff5722, #d84315)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 3,
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              right: 0,
              width: '80px',
              height: '80px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '50%',
              transform: 'translate(25px, -25px)',
            }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ backgroundColor: 'rgba(255,255,255,0.2)', mr: 2, width: 48, height: 48 }}>
                  <Schedule />
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    Pending
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Upcoming sessions
                  </Typography>
                </Box>
              </Box>
              <Typography variant="h3" fontWeight="bold" sx={{ mb: 1 }}>
                {dashboardData.pendingConsultations}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {dashboardData.responseTime}h response time
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Quick Actions
        </Typography>
        <Grid container spacing={3}>
          {quickActions.map((action, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  '&:hover': { 
                    transform: 'translateY(-8px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                    borderColor: action.color,
                  },
                }}
                onClick={action.action}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      sx={{
                        backgroundColor: action.color,
                        width: 48,
                        height: 48,
                        mr: 2,
                        fontSize: '20px',
                      }}
                    >
                      {action.icon}
                    </Avatar>
                    <Typography variant="h6" fontWeight="bold">
                      {action.title}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {action.description}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', color: action.color }}>
                    <Typography variant="body2" fontWeight="bold" sx={{ mr: 1 }}>
                      Access
                    </Typography>
                    <ArrowForward fontSize="small" />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Grid container spacing={3}>
        {/* Upcoming Consultations */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight="bold">Upcoming Consultations</Typography>
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
                {dashboardData.upcomingConsultations.map((consultation, index) => (
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
                        {consultation.client_name?.[0]}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {consultation.client_name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {consultation.type}
                        </Typography>
                      </Box>
                      <Chip
                        label={consultation.status}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                      <AccessTime fontSize="small" sx={{ mr: 1 }} />
                      <Typography variant="caption">
                        {new Date(consultation.scheduled_at).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Paper>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

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
                      <Avatar sx={{ width: 40, height: 40, mr: 2, backgroundColor: 'secondary.main' }}>
                        {consultation.client_name?.[0]}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {consultation.client_name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {consultation.type}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Star sx={{ color: '#FFD700', mr: 0.5, fontSize: '16px' }} />
                        <Typography variant="body2" fontWeight="bold">
                          {consultation.rating}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                        <AccessTime fontSize="small" sx={{ mr: 1 }} />
                        <Typography variant="caption">
                          {new Date(consultation.scheduled_at).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Chip
                        label={consultation.status}
                        size="small"
                        color="success"
                        variant="outlined"
                      />
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

export default ConsultantDashboard;
