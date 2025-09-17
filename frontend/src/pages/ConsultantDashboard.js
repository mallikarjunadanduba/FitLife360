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

const ConsultantDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Dummy data for demonstration
  const [dashboardData] = useState({
    totalConsultations: 127,
    completedConsultations: 98,
    pendingConsultations: 12,
    totalEarnings: 4567,
    averageRating: 4.8,
    monthlyEarnings: 1234,
    clientSatisfaction: 96.5,
    responseTime: 2.3,
    recentConsultations: [
      {
        id: 1,
        client_name: 'Sarah Johnson',
        scheduled_at: '2024-01-20T10:00:00Z',
        status: 'completed',
        type: 'Nutrition Consultation',
        rating: 5,
      },
      {
        id: 2,
        client_name: 'Mike Chen',
        scheduled_at: '2024-01-19T14:30:00Z',
        status: 'completed',
        type: 'Fitness Planning',
        rating: 4,
      },
      {
        id: 3,
        client_name: 'Emily Davis',
        scheduled_at: '2024-01-18T09:15:00Z',
        status: 'completed',
        type: 'Weight Management',
        rating: 5,
      },
    ],
    upcomingConsultations: [
      {
        id: 4,
        client_name: 'John Smith',
        scheduled_at: '2024-01-22T11:00:00Z',
        status: 'scheduled',
        type: 'Nutrition Consultation',
      },
      {
        id: 5,
        client_name: 'Lisa Brown',
        scheduled_at: '2024-01-23T15:30:00Z',
        status: 'scheduled',
        type: 'Fitness Planning',
      },
      {
        id: 6,
        client_name: 'David Wilson',
        scheduled_at: '2024-01-24T09:00:00Z',
        status: 'scheduled',
        type: 'Weight Management',
      },
    ],
    achievements: [
      { title: 'Top Performer', description: 'Highest rated consultant this month', icon: <Star />, color: '#FFD700' },
      { title: 'Client Champion', description: '96.5% satisfaction rate', icon: <People />, color: '#00bcd4' },
      { title: 'Quick Responder', description: '2.3h average response time', icon: <AccessTime />, color: '#ff5722' },
    ],
  });

  const quickActions = [
    {
      title: 'View Consultations',
      description: 'Manage your consultation bookings',
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
      title: 'View Analytics',
      description: 'Track your performance metrics',
      icon: <Assessment />,
      color: '#00bcd4',
      action: () => navigate('/consultant/analytics'),
    },
    {
      title: 'Messages',
      description: 'Communicate with clients',
      icon: <Message />,
      color: '#ff5722',
      action: () => navigate('/consultant/messages'),
    },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

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

export default ConsultantDashboard;
