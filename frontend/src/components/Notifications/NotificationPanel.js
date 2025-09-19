import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Avatar,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  CircularProgress,
  Alert,
  DialogContentText,
  Select,
  MenuItem,
  FormControl,
} from '@mui/material';
import {
  Notifications,
  MarkEmailRead,
  Delete,
  Close,
  CheckCircle,
  Warning,
  Info,
  Error,
  Schedule,
  LocalShipping,
  Event,
  Star,
  Store,
  Mail,
  Person,
} from '@mui/icons-material';
import apiClient from '../../utils/axiosConfig';

const NotificationPanel = ({ onClose, showMarkAll = true }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/api/notifications');
      setNotifications(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching notifications:', err.response?.data);
      const errorMessage = err.response?.data?.detail || 
                          (Array.isArray(err.response?.data) ? err.response.data.map(e => e.msg).join(', ') : null) ||
                          'Failed to fetch notifications';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await apiClient.put(`/api/notifications/${notificationId}/read`);
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, is_read: true }
            : notification
        )
      );
    } catch (err) {
      console.error('Error marking notification as read:', err.response?.data);
    }
  };

  const markAllAsRead = async () => {
    try {
      await apiClient.put('/api/notifications/read-all');
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, is_read: true }))
      );
    } catch (err) {
      console.error('Error marking all notifications as read:', err.response?.data);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await apiClient.delete(`/api/notifications/${notificationId}`);
      setNotifications(prev => 
        prev.filter(notification => notification.id !== notificationId)
      );
    } catch (err) {
      console.error('Error deleting notification:', err.response?.data);
      const errorMessage = err.response?.data?.detail || 
                          (Array.isArray(err.response?.data) ? err.response.data.map(e => e.msg).join(', ') : null) ||
                          'Failed to delete notification';
      setError(errorMessage);
    }
  };

  const deleteAllNotifications = async () => {
    try {
      await apiClient.delete('/api/notifications');
      setNotifications([]);
      setOpenDeleteDialog(false);
    } catch (err) {
      console.error('Error deleting all notifications:', err.response?.data);
      const errorMessage = err.response?.data?.detail || 
                          (Array.isArray(err.response?.data) ? err.response.data.map(e => e.msg).join(', ') : null) ||
                          'Failed to delete all notifications';
      setError(errorMessage);
    }
  };

  const getNotificationIcon = (type, title) => {
    // Check title for specific icons
    if (title?.toLowerCase().includes('admin')) return <Person />;
    if (title?.toLowerCase().includes('store')) return <Store />;
    if (title?.toLowerCase().includes('mail')) return <Mail />;
    
    // Fallback to type-based icons
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
        return '#3b82f6'; // blue
      case 'order':
        return '#10b981'; // green
      case 'reminder':
        return '#f59e0b'; // yellow
      case 'promotion':
        return '#8b5cf6'; // purple
      case 'system':
        return '#6b7280'; // gray
      case 'warning':
        return '#f59e0b'; // yellow
      case 'error':
        return '#ef4444'; // red
      default:
        return '#3b82f6'; // blue
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

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
    setOpenDialog(true);
    if (!notification.is_read) {
      markAsRead(notification.id);
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;
  const filteredNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(n => n.type === filter);

  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: 400, maxHeight: 600, backgroundColor: 'white', borderRadius: 2 }}>
      {/* Header */}
      <Box sx={{ 
        p: 2, 
        borderBottom: 1, 
        borderColor: '#e5e7eb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
        <Box sx={{ display: 'flex', gap: 1 }}>
          {showMarkAll && unreadCount > 0 && (
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#3b82f6', 
                textDecoration: 'underline',
                cursor: 'pointer',
                fontSize: '14px'
              }}
              onClick={markAllAsRead}
            >
              Mark as all read
            </Typography>
          )}
          <IconButton size="small" onClick={onClose} sx={{ color: '#6b7280' }}>
            <Close />
          </IconButton>
        </Box>
      </Box>

      {/* Filter Dropdown */}
      <Box sx={{ p: 2, pb: 1 }}>
        <FormControl fullWidth size="small">
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            sx={{
              backgroundColor: 'white',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#d1d5db',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#9ca3af',
              },
            }}
          >
            <MenuItem value="all">All Notification</MenuItem>
            <MenuItem value="system">System</MenuItem>
            <MenuItem value="order">Order</MenuItem>
            <MenuItem value="consultation">Consultation</MenuItem>
            <MenuItem value="reminder">Reminder</MenuItem>
            <MenuItem value="promotion">Promotion</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ m: 2 }} onClose={() => setError(null)}>
          {typeof error === 'string' ? error : JSON.stringify(error)}
        </Alert>
      )}

      {/* Notifications List */}
      <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
        {filteredNotifications.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Notifications sx={{ fontSize: 48, color: '#9ca3af', mb: 1 }} />
            <Typography variant="body2" sx={{ color: '#6b7280' }}>
              No notifications yet
            </Typography>
          </Box>
        ) : (
          <Box sx={{ px: 2 }}>
            {filteredNotifications.map((notification, index) => (
              <React.Fragment key={notification.id}>
                <Box
                  sx={{
                    cursor: 'pointer',
                    p: 2,
                    borderRadius: 1,
                    '&:hover': {
                      backgroundColor: '#f9fafb',
                    },
                  }}
                  onClick={() => handleNotificationClick(notification)}
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
                          mb: 1,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {notification.message}
                      </Typography>
                      
                      {/* Tags */}
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {!notification.is_read && (
                          <Chip
                            label="Unread"
                            size="small"
                            sx={{
                              backgroundColor: '#fef2f2',
                              color: '#dc2626',
                              fontSize: '11px',
                              height: '20px',
                              '& .MuiChip-label': {
                                px: 1
                              }
                            }}
                          />
                        )}
                        {notification.type === 'system' && (
                          <Chip
                            label="New"
                            size="small"
                            sx={{
                              backgroundColor: '#fffbeb',
                              color: '#d97706',
                              fontSize: '11px',
                              height: '20px',
                              '& .MuiChip-label': {
                                px: 1
                              }
                            }}
                          />
                        )}
                        {notification.title?.toLowerCase().includes('mail') && (
                          <Button
                            variant="contained"
                            size="small"
                            sx={{
                              backgroundColor: '#3b82f6',
                              color: 'white',
                              fontSize: '11px',
                              height: '24px',
                              px: 2,
                              borderRadius: 1,
                              textTransform: 'none',
                              '&:hover': {
                                backgroundColor: '#2563eb'
                              }
                            }}
                            startIcon={<Mail sx={{ fontSize: 14 }} />}
                          >
                            Mail
                          </Button>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </Box>
                {index < filteredNotifications.length - 1 && (
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

      {/* Notification Detail Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {selectedNotification && (
            <Avatar
              sx={{
                backgroundColor: getNotificationColor(selectedNotification.type),
                color: 'white',
              }}
            >
              {getNotificationIcon(selectedNotification.type, selectedNotification.title)}
            </Avatar>
          )}
          <Typography variant="h6">
            {selectedNotification?.title}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ color: '#6b7280', mb: 1 }}>
              {formatDate(selectedNotification?.created_at)}
            </Typography>
          </Box>
          <Typography variant="body1">
            {selectedNotification?.message}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete All Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Delete All Notifications</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete all notifications? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>
            Cancel
          </Button>
          <Button onClick={deleteAllNotifications} color="error" variant="contained">
            Delete All
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NotificationPanel;