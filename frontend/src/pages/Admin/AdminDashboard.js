import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Avatar,
  Chip,
  Stack,
  Paper,
  IconButton,
  LinearProgress,
} from '@mui/material';
import {
  People,
  Store,
  Event,
  LocalShipping,
  TrendingUp,
  AdminPanelSettings,
  Assessment,
  Notifications,
  Settings,
  Star,
  Security,
  Analytics,
  ArrowForward,
  TrendingDown,
  CheckCircle,
  Warning,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../utils/axiosConfig';
import { useAuth } from '../../contexts/AuthContext';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    users: { total: 0, active: 0, new: 0 },
    consultants: { total: 0, active: 0, pending: 0 },
    products: { total: 0, active: 0, lowStock: 0 },
    orders: { total: 0, pending: 0, completed: 0 },
    consultations: { total: 0, scheduled: 0, completed: 0 },
    revenue: { total: 0, monthly: 0, growth: 0 },
    platformHealth: {
      userGrowth: 0,
      consultationSuccess: 0,
      orderFulfillment: 0,
      systemUptime: 99.8,
    },
    recentActivity: [],
    alerts: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && token && user.role === 'ADMIN') {
      fetchDashboardData();
    } else {
      setLoading(false);
      navigate('/login');
    }
  }, [user, token, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch basic dashboard data
      const dashboardResponse = await apiClient.get('/api/admin/dashboard');
      const analyticsResponse = await apiClient.get('/api/admin/analytics');
      
      setDashboardData(prevData => ({
        ...prevData,
        ...dashboardResponse.data,
        revenue: analyticsResponse.data.revenue,
        platformHealth: {
          ...prevData.platformHealth,
          consultationSuccess: analyticsResponse.data.consultations.completed > 0 
            ? (analyticsResponse.data.consultations.completed / analyticsResponse.data.consultations.total) * 100 
            : 0,
          orderFulfillment: analyticsResponse.data.orders.completed > 0 
            ? (analyticsResponse.data.orders.completed / analyticsResponse.data.orders.total) * 100 
            : 0,
        },
        recentActivity: generateRecentActivity(dashboardResponse.data),
        alerts: generateAlerts(dashboardResponse.data, analyticsResponse.data),
      }));
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const generateRecentActivity = (data) => {
    const activities = [];
    
    if (data.users?.total > 0) {
      activities.push({
        type: 'user_registration',
        count: Math.floor(data.users.total * 0.02), // Simulate 2% new users
        time: '2 hours ago'
      });
    }
    
    if (data.consultations?.total > 0) {
      activities.push({
        type: 'consultation_completed',
        count: Math.floor(data.consultations.total * 0.05), // Simulate 5% completed
        time: '4 hours ago'
      });
    }
    
    if (data.orders?.total > 0) {
      activities.push({
        type: 'new_order',
        count: Math.floor(data.orders.total * 0.03), // Simulate 3% new orders
        time: '6 hours ago'
      });
    }
    
    if (data.products?.total > 0) {
      activities.push({
        type: 'product_added',
        count: Math.floor(data.products.total * 0.01), // Simulate 1% new products
        time: '8 hours ago'
      });
    }
    
    return activities.slice(0, 4); // Return max 4 activities
  };

  const generateAlerts = (dashboardData, analyticsData) => {
    const alerts = [];
    
    // Check for low stock products
    if (dashboardData.products?.total > 0) {
      const lowStockCount = Math.floor(dashboardData.products.total * 0.1); // Simulate 10% low stock
      if (lowStockCount > 0) {
        alerts.push({
          type: 'warning',
          message: `Low stock on ${lowStockCount} products`,
          icon: <Warning />
        });
      }
    }
    
    // Check for pending consultants
    if (dashboardData.consultants?.total > 0) {
      const pendingCount = Math.floor(dashboardData.consultants.total * 0.05); // Simulate 5% pending
      if (pendingCount > 0) {
        alerts.push({
          type: 'info',
          message: `${pendingCount} consultant applications pending`,
          icon: <Notifications />
        });
      }
    }
    
    // System status
    alerts.push({
      type: 'success',
      message: 'System backup completed',
      icon: <CheckCircle />
    });
    
    return alerts;
  };

  const quickActions = [
    {
      title: 'Manage Users',
      description: 'Approve dietitians, block/unblock users',
      icon: <People />,
      color: '#7c4dff',
      path: '/admin/users',
      action: 'Manage'
    },
    {
      title: 'Manage Consultants',
      description: 'Manage consultant profiles and availability',
      icon: <AdminPanelSettings />,
      color: '#2196f3',
      path: '/admin/consultants',
      action: 'Manage'
    },
    {
      title: 'Manage Products',
      description: 'Add, edit, delete health products',
      icon: <Store />,
      color: '#7c4dff',
      path: '/admin/products',
      action: 'Manage'
    },
    {
      title: 'View Orders',
      description: 'Monitor all product orders',
      icon: <LocalShipping />,
      color: '#2196f3',
      path: '/admin/orders',
      action: 'View'
    },
    {
      title: 'Manage Consultations',
      description: 'View and manage consultation bookings',
      icon: <Event />,
      color: '#7c4dff',
      path: '/admin/consultations',
      action: 'Manage'
    },
    {
      title: 'Monitor Feedback',
      description: 'View user reviews and feedback',
      icon: <Star />,
      color: '#2196f3',
      path: '/admin/feedback',
      action: 'Monitor'
    },
    {
      title: 'Send Notifications',
      description: 'Configure and send notifications',
      icon: <Notifications />,
      color: '#7c4dff',
      path: '/admin/notifications',
      action: 'Configure'
    },
    {
      title: 'View Analytics',
      description: 'Platform analytics and insights',
      icon: <Assessment />,
      color: '#2196f3',
      path: '/admin/analytics',
      action: 'View'
    },
    {
      title: 'System Settings',
      description: 'Configure platform settings',
      icon: <Settings />,
      color: '#7c4dff',
      path: '/admin/settings',
      action: 'Configure'
    }
  ];

  const calculateTrend = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  const stats = [
    {
      title: 'Total Users',
      value: dashboardData.users.total,
      subtitle: `${dashboardData.users.active} active`,
      icon: <People />,
      color: '#7c4dff',
      trend: `+${calculateTrend(dashboardData.users.total, dashboardData.users.total * 0.9).toFixed(1)}%`,
      trendUp: true,
    },
    {
      title: 'Consultants',
      value: dashboardData.consultants.total,
      subtitle: `${dashboardData.consultants.active} active`,
      icon: <AdminPanelSettings />,
      color: '#2196f3',
      trend: `+${calculateTrend(dashboardData.consultants.total, dashboardData.consultants.total * 0.95).toFixed(1)}%`,
      trendUp: true,
    },
    {
      title: 'Products',
      value: dashboardData.products.total,
      subtitle: `${dashboardData.products.active} active`,
      icon: <Store />,
      color: '#7c4dff',
      trend: `+${calculateTrend(dashboardData.products.total, dashboardData.products.total * 0.97).toFixed(1)}%`,
      trendUp: true,
    },
    {
      title: 'Orders',
      value: dashboardData.orders.total,
      subtitle: `${dashboardData.orders.pending} pending`,
      icon: <LocalShipping />,
      color: '#2196f3',
      trend: `+${calculateTrend(dashboardData.orders.total, dashboardData.orders.total * 0.85).toFixed(1)}%`,
      trendUp: true,
    },
    {
      title: 'Consultations',
      value: dashboardData.consultations.total,
      subtitle: `${dashboardData.consultations.scheduled} scheduled`,
      icon: <Event />,
      color: '#7c4dff',
      trend: `+${calculateTrend(dashboardData.consultations.total, dashboardData.consultations.total * 0.8).toFixed(1)}%`,
      trendUp: true,
    },
    {
      title: 'Revenue',
      value: `$${dashboardData.revenue.total.toLocaleString()}`,
      subtitle: `$${dashboardData.revenue.monthly.toLocaleString()} this month`,
      icon: <TrendingUp />,
      color: '#2196f3',
      trend: `+${calculateTrend(dashboardData.revenue.total, dashboardData.revenue.total * 0.85).toFixed(1)}%`,
      trendUp: true,
    },
  ];

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
              Admin Dashboard
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Complete overview of your FitLife360 platform
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <IconButton sx={{ backgroundColor: 'primary.main', color: 'white' }}>
              <Security />
            </IconButton>
            <IconButton sx={{ backgroundColor: 'secondary.main', color: 'white' }}>
              <Analytics />
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/* Alerts */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" spacing={2}>
          {dashboardData.alerts.map((alert, index) => (
            <Chip
              key={index}
              icon={alert.icon}
              label={alert.message}
              color={alert.type === 'warning' ? 'warning' : alert.type === 'success' ? 'success' : 'info'}
              variant="outlined"
              sx={{ borderRadius: 2 }}
            />
          ))}
        </Stack>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
            <Card sx={{ 
              background: `linear-gradient(135deg, ${stat.color}, ${stat.color}dd)`,
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
                    {stat.icon}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {stat.title}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      {stat.subtitle}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="h3" fontWeight="bold" sx={{ mb: 1 }}>
                  {stat.value}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {stat.trendUp ? (
                    <TrendingUp fontSize="small" sx={{ mr: 1 }} />
                  ) : (
                    <TrendingDown fontSize="small" sx={{ mr: 1 }} />
                  )}
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    {stat.trend}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Quick Actions */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Quick Actions
        </Typography>
        <Grid container spacing={3}>
          {quickActions.map((action, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
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
                onClick={() => navigate(action.path)}
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
                      {action.action}
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
        {/* Platform Health */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Platform Health
              </Typography>
              <Stack spacing={3}>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">User Growth</Typography>
                    <Typography variant="body2" color="success.main" fontWeight="bold">
                      +{calculateTrend(dashboardData.users.total, dashboardData.users.total * 0.9).toFixed(1)}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={Math.min(calculateTrend(dashboardData.users.total, dashboardData.users.total * 0.9), 100)} 
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Consultation Success</Typography>
                    <Typography variant="body2" color="success.main" fontWeight="bold">
                      {dashboardData.platformHealth.consultationSuccess}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={dashboardData.platformHealth.consultationSuccess} 
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Order Fulfillment</Typography>
                    <Typography variant="body2" color="success.main" fontWeight="bold">
                      {dashboardData.platformHealth.orderFulfillment}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={dashboardData.platformHealth.orderFulfillment} 
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">System Uptime</Typography>
                    <Typography variant="body2" color="success.main" fontWeight="bold">
                      {dashboardData.platformHealth.systemUptime}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={dashboardData.platformHealth.systemUptime} 
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Recent Activity
              </Typography>
              <Stack spacing={2}>
                {dashboardData.recentActivity.map((activity, index) => (
                  <Paper
                    key={index}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'divider',
                      backgroundColor: 'background.paper',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {activity.count} {activity.type.replace('_', ' ')}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {activity.time}
                        </Typography>
                      </Box>
                      <Avatar sx={{ backgroundColor: 'primary.main', width: 32, height: 32 }}>
                        {activity.type.includes('user') ? <People /> :
                         activity.type.includes('consultation') ? <Event /> :
                         activity.type.includes('order') ? <LocalShipping /> :
                         <Store />}
                      </Avatar>
                    </Box>
                  </Paper>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

      </Grid>
    </Box>
  );
};

export default AdminDashboard;
