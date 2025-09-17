import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Button,
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
  Add,
  Edit,
  Visibility,
  Assessment,
  Notifications,
  Settings,
  Star,
  Security,
  Dashboard,
  Analytics,
  Feedback,
  ArrowForward,
  TrendingDown,
  CheckCircle,
  Warning,
  Error,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  // Dummy data for demonstration
  const [dashboardData] = useState({
    users: { total: 1247, active: 1189, new: 23 },
    consultants: { total: 156, active: 142, pending: 8 },
    products: { total: 89, active: 76, lowStock: 12 },
    orders: { total: 3421, pending: 45, completed: 3376 },
    consultations: { total: 892, scheduled: 67, completed: 825 },
    revenue: { total: 45678, monthly: 12345, growth: 15.2 },
    platformHealth: {
      userGrowth: 12.5,
      consultationSuccess: 94.2,
      orderFulfillment: 98.1,
      systemUptime: 99.8,
    },
    recentActivity: [
      { type: 'user_registration', count: 5, time: '2 hours ago' },
      { type: 'consultation_completed', count: 12, time: '4 hours ago' },
      { type: 'new_order', count: 8, time: '6 hours ago' },
      { type: 'product_added', count: 3, time: '8 hours ago' },
    ],
    alerts: [
      { type: 'warning', message: 'Low stock on 12 products', icon: <Warning /> },
      { type: 'info', message: '8 consultant applications pending', icon: <Notifications /> },
      { type: 'success', message: 'System backup completed', icon: <CheckCircle /> },
    ],
  });

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
      description: 'Add, edit, delete consultant profiles',
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

  const stats = [
    {
      title: 'Total Users',
      value: dashboardData.users.total,
      subtitle: `${dashboardData.users.active} active`,
      icon: <People />,
      color: '#7c4dff',
      trend: '+12.5%',
      trendUp: true,
    },
    {
      title: 'Consultants',
      value: dashboardData.consultants.total,
      subtitle: `${dashboardData.consultants.active} active`,
      icon: <AdminPanelSettings />,
      color: '#2196f3',
      trend: '+8.2%',
      trendUp: true,
    },
    {
      title: 'Products',
      value: dashboardData.products.total,
      subtitle: `${dashboardData.products.active} active`,
      icon: <Store />,
      color: '#7c4dff',
      trend: '+3.1%',
      trendUp: true,
    },
    {
      title: 'Orders',
      value: dashboardData.orders.total,
      subtitle: `${dashboardData.orders.pending} pending`,
      icon: <LocalShipping />,
      color: '#2196f3',
      trend: '+15.7%',
      trendUp: true,
    },
    {
      title: 'Consultations',
      value: dashboardData.consultations.total,
      subtitle: `${dashboardData.consultations.scheduled} scheduled`,
      icon: <Event />,
      color: '#7c4dff',
      trend: '+22.3%',
      trendUp: true,
    },
    {
      title: 'Revenue',
      value: `$${dashboardData.revenue.total.toLocaleString()}`,
      subtitle: `$${dashboardData.revenue.monthly.toLocaleString()} this month`,
      icon: <TrendingUp />,
      color: '#2196f3',
      trend: `+${dashboardData.revenue.growth}%`,
      trendUp: true,
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
              Admin Dashboard 👑
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
                      +{dashboardData.platformHealth.userGrowth}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={dashboardData.platformHealth.userGrowth} 
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
