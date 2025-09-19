import React, { useState, useEffect } from 'react';
import {
  IconButton,
  Badge,
  Popper,
  Paper,
  ClickAwayListener,
  Box,
  Typography,
  CircularProgress,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Notifications,
  Person,
  Store,
  Mail,
  Event,
  LocalShipping,
  Schedule,
  Star,
  Info,
  Warning,
  Error,
} from '@mui/icons-material';
import apiClient from '../../utils/axiosConfig';

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/api/notifications');
      setNotifications(response.data);
    } catch (err) {
      console.error('Error fetching notifications:', err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setAnchorEl(null);
  };

  const getNotificationIcon = (type, title) => {
    if (title?.toLowerCase().includes('admin')) return <Person />;
    if (title?.toLowerCase().includes('store')) return <Store />;
    if (title?.toLowerCase().includes('mail')) return <Mail />;
    
    switch (type) {
      case 'consultation':
        return <Event />;
      case 'order':
        return <LocalShipping />;
      case 'reminder':
        return <Schedule />;
      case 'promotion':
        return <Star />;
      case 'system':
        return <Info />;
      case 'warning':
        return <Warning />;
      case 'error':
        return <Error />;
      default:
        return <Notifications />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'consultation':
        return '#3b82f6';
      case 'order':
        return '#10b981';
      case 'reminder':
        return '#f59e0b';
      case 'promotion':
        return '#8b5cf6';
      case 'system':
        return '#6b7280';
      case 'warning':
        return '#f59e0b';
      case 'error':
        return '#ef4444';
      default:
        return '#3b82f6';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = (now - date) / (1000 * 60);

    if (diffInMinutes < 1) {
      return 'Just now';
    } else if (diffInMinutes < 60) {
      return `${Math.floor(diffInMinutes)} min ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hours ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <>
      <IconButton
        onClick={handleClick}
        sx={{
          color: 'inherit',
          mr: 2,
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
        }}
      >
        <Badge badgeContent={unreadCount} color="error">
          <Notifications />
        </Badge>
      </IconButton>

      <Popper
        open={open}
        anchorEl={anchorEl}
        placement="bottom-end"
        sx={{
          zIndex: 1300,
          mt: 1,
        }}
      >
        <ClickAwayListener onClickAway={handleClose}>
          <Paper
            sx={{
              width: 400,
              maxHeight: 500,
              backgroundColor: 'white',
              borderRadius: 2,
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e5e7eb',
            }}
          >
            {/* Header */}
            <Box sx={{ 
              p: 2, 
              borderBottom: 1, 
              borderColor: '#e5e7eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <Typography variant="h6" fontWeight="bold" sx={{ color: '#374151' }}>
                All Notification
              </Typography>
              {unreadCount > 0 && (
                <Box sx={{
                  backgroundColor: '#fbbf24',
                  color: '#92400e',
                  borderRadius: '12px',
                  px: 1,
                  py: 0.5,
                  fontSize: '12px',
                  fontWeight: 'bold',
                  minWidth: '20px',
                  textAlign: 'center'
                }}>
                  {unreadCount.toString().padStart(2, '0')}
                </Box>
              )}
            </Box>

            {/* Content */}
            <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : notifications.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Notifications sx={{ fontSize: 48, color: '#9ca3af', mb: 1 }} />
                  <Typography variant="body2" sx={{ color: '#6b7280' }}>
                    No notifications yet
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ px: 2 }}>
                  {notifications.slice(0, 5).map((notification, index) => (
                    <React.Fragment key={notification.id}>
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: 1,
                          '&:hover': {
                            backgroundColor: '#f9fafb',
                          },
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                          {/* Icon */}
                          <Avatar
                            sx={{
                              width: 40,
                              height: 40,
                              backgroundColor: getNotificationColor(notification.type),
                              color: 'white',
                              flexShrink: 0
                            }}
                          >
                            {getNotificationIcon(notification.type, notification.title)}
                          </Avatar>
                          
                          {/* Content */}
                          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                            {/* Title and Time */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                              <Typography
                                variant="subtitle2"
                                fontWeight={notification.is_read ? 'normal' : 'bold'}
                                sx={{ color: '#374151', fontSize: '14px' }}
                              >
                                {notification.title}
                              </Typography>
                              <Typography variant="caption" sx={{ color: '#9ca3af', fontSize: '12px', flexShrink: 0, ml: 1 }}>
                                {formatDate(notification.created_at)}
                              </Typography>
                            </Box>
                            
                            {/* Message */}
                            <Typography
                              variant="body2"
                              sx={{
                                color: '#6b7280',
                                fontSize: '13px',
                                lineHeight: 1.4,
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                              }}
                            >
                              {notification.message}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      {index < Math.min(notifications.length, 5) - 1 && (
                        <Divider sx={{ borderColor: '#e5e7eb' }} />
                      )}
                    </React.Fragment>
                  ))}
                </Box>
              )}
            </Box>

            {/* Footer */}
            <Box sx={{ 
              p: 2, 
              borderTop: 1, 
              borderColor: '#e5e7eb',
              textAlign: 'center'
            }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#3b82f6', 
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                View All
              </Typography>
            </Box>
          </Paper>
        </ClickAwayListener>
      </Popper>
    </>
  );
};

export default NotificationDropdown;