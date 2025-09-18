import React, { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  useMediaQuery,
  useTheme,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Chip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  Person,
  Calculate,
  TrendingUp,
  Event,
  Store,
  ShoppingCart,
  AdminPanelSettings,
  People,
  Analytics,
  Assessment,
  Notifications,
  Settings,
  Feedback,
  Logout,
  AccountCircle,
  LocalShipping,
  Support,
  Schedule,
  CalendarToday,
  FitnessCenter,
  Restaurant,
  MonitorWeight,
  Psychology,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

const drawerWidth = 280;

const ModernLayout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { getCartItemCount } = useCart();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    handleClose();
  };

  // Dynamic navigation items based on user role
  const getNavigationItems = () => {
    const roleBasedNavigation = {
      USER: [
        { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
        { text: 'Profile', icon: <Person />, path: '/profile' },
        { text: 'Health Calculators', icon: <Calculate />, path: '/calculators' },
        { text: 'Progress Tracking', icon: <TrendingUp />, path: '/progress' },
        { text: 'Book Consultation', icon: <Event />, path: '/consultations' },
        { text: 'Products', icon: <Store />, path: '/products' },
      ],
      CONSULTANT: [
        { text: 'Dashboard', icon: <Dashboard />, path: '/consultant' },
        { text: 'Profile', icon: <Person />, path: '/profile' },
        { text: 'My Consultations', icon: <Event />, path: '/consultations' },
        { text: 'Set Availability', icon: <Schedule />, path: '/consultant/availability' },
        { text: 'My Clients', icon: <People />, path: '/consultant/clients' },
        { text: 'Appointments', icon: <CalendarToday />, path: '/consultant/appointments' },
      ],
      ADMIN: [
        { text: 'Admin Dashboard', icon: <AdminPanelSettings />, path: '/admin' },
        { text: 'Profile', icon: <Person />, path: '/profile' },
        { text: 'User Management', icon: <People />, path: '/admin/users' },
        { text: 'Consultant Management', icon: <Support />, path: '/admin/consultants' },
        { text: 'Product Management', icon: <Store />, path: '/admin/products' },
        { text: 'Order Management', icon: <LocalShipping />, path: '/admin/orders' },
        { text: 'Analytics', icon: <Analytics />, path: '/admin/analytics' },
        { text: 'Reports', icon: <Assessment />, path: '/admin/reports' },
        { text: 'Notifications', icon: <Notifications />, path: '/admin/notifications' },
        { text: 'Settings', icon: <Settings />, path: '/admin/settings' },
        { text: 'Feedback', icon: <Feedback />, path: '/admin/feedback' },
      ]
    };

    return roleBasedNavigation[user?.role] || roleBasedNavigation.USER;
  };

  const navigationItems = getNavigationItems();

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo Section */}
      <Box sx={{ p: 3, textAlign: 'center', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Box
          sx={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            color: 'white',
            fontSize: '24px',
            fontWeight: 'bold',
          }}
        >
          FL
        </Box>
        <Typography variant="h6" fontWeight="bold" color="primary">
          FitLife360
        </Typography>
        <Chip
          label={user?.role || 'USER'}
          size="small"
          color="primary"
          variant="outlined"
          sx={{ mt: 1 }}
        />
      </Box>

      {/* Navigation Items */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <List sx={{ px: 2, py: 1 }}>
          {navigationItems.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => {
                  navigate(item.path);
                  if (isMobile) setMobileOpen(false);
                }}
                selected={location.pathname === item.path}
                sx={{
                  borderRadius: 2,
                  '&.Mui-selected': {
                    backgroundColor: theme.palette.primary.main,
                    color: 'white',
                    '&:hover': {
                      backgroundColor: theme.palette.primary.dark,
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'white',
                    },
                  },
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* User Info Section */}
      <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ width: 40, height: 40, mr: 2 }}>
            {user?.first_name?.[0]}{user?.last_name?.[0]}
          </Avatar>
          <Box>
            <Typography variant="subtitle2" fontWeight="bold">
              {user?.first_name} {user?.last_name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user?.email}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          backgroundColor: 'background.paper',
          color: 'text.primary',
          boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {location.pathname === '/dashboard' && 'Dashboard'}
            {location.pathname === '/profile' && 'Profile'}
            {location.pathname === '/calculators' && 'Health Calculators'}
            {location.pathname === '/progress' && 'Progress Tracking'}
            {location.pathname === '/consultations' && 'Consultations'}
            {location.pathname === '/products' && 'Products'}
            {location.pathname === '/admin' && 'Admin Dashboard'}
            {location.pathname === '/consultant' && 'Consultant Dashboard'}
            {location.pathname.startsWith('/admin/') && 'Admin Panel'}
          </Typography>

          {/* Cart Icon - Only for Users */}
          {user?.role === 'USER' && (
            <IconButton
              color="inherit"
              onClick={() => navigate('/cart')}
              sx={{ mr: 2 }}
            >
              <Badge badgeContent={getCartItemCount()} color="primary">
                <ShoppingCart />
              </Badge>
            </IconButton>
          )}

          {/* User Menu */}
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <Avatar sx={{ width: 32, height: 32 }}>
              {user?.first_name?.[0]}{user?.last_name?.[0]}
            </Avatar>
          </IconButton>

          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={() => { navigate('/profile'); handleClose(); }}>
              <AccountCircle sx={{ mr: 1 }} />
              Profile
            </MenuItem>
            <MenuItem onClick={() => { navigate('/orders'); handleClose(); }}>
              <LocalShipping sx={{ mr: 1 }} />
              Orders
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <Logout sx={{ mr: 1 }} />
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: '64px',
          backgroundColor: 'background.default',
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default ModernLayout;
