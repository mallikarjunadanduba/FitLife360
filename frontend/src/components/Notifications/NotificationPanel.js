import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Avatar,
  Badge,
  Tooltip,
  CircularProgress,
  Alert,
  DialogContentText,
} from '@mui/material';
import {
  Notifications,
  NotificationsActive,
  MarkEmailRead,
  MarkEmailUnread,
  Delete,
  DeleteSweep,
  Close,
  CheckCircle,
  Warning,
  Info,
  Error,
  Schedule,
  LocalShipping,
  Event,
  Star,
} from '@mui/icons-material';
import apiClient from '../../utils/axiosConfig';

const NotificationPanel = ({ onClose, showMarkAll = true }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

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

  const getNotificationIcon = (type) => {
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
        return 'primary';
      case 'order':
        return 'success';
      case 'reminder':
        return 'warning';
      case 'promotion':
        return 'info';
      case 'system':
        return 'default';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
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

  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: 400, maxHeight: 600 }}>
      {/* Header */}
      <Box sx={{ 
        p: 2, 
        borderBottom: 1, 
        borderColor: 'divider',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsActive />
          </Badge>
          <Typography variant="h6" fontWeight="bold">
            Notifications
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {showMarkAll && unreadCount > 0 && (
            <Tooltip title="Mark all as read">
              <IconButton size="small" onClick={markAllAsRead}>
                <MarkEmailRead />
              </IconButton>
            </Tooltip>
          )}
          {notifications.length > 0 && (
            <Tooltip title="Delete all notifications">
              <IconButton size="small" onClick={() => setOpenDeleteDialog(true)}>
                <DeleteSweep />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Close">
            <IconButton size="small" onClick={onClose}>
              <Close />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ m: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Notifications List */}
      <Box sx={{ maxHeight: 500, overflow: 'auto' }}>
        {notifications.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Notifications sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
            <Typography variant="body2" color="text.secondary">
              No notifications yet
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {notifications.map((notification, index) => (
              <React.Fragment key={notification.id}>
                <ListItem
                  sx={{
                    cursor: 'pointer',
                    backgroundColor: notification.is_read ? 'transparent' : 'action.hover',
                    '&:hover': {
                      backgroundColor: 'action.selected',
                    },
                    py: 1.5,
                  }}
                  onClick={() => handleNotificationClick(notification)}
                  secondaryAction={
                    <Tooltip title="Delete notification">
                      <IconButton
                        edge="end"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                        sx={{ color: 'text.secondary' }}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  }
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        backgroundColor: `${getNotificationColor(notification.type)}.main`,
                        color: 'white',
                      }}
                    >
                      {getNotificationIcon(notification.type)}
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography
                          variant="subtitle2"
                          fontWeight={notification.is_read ? 'normal' : 'bold'}
                          sx={{ flexGrow: 1 }}
                        >
                          {notification.title}
                        </Typography>
                        {!notification.is_read && (
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              backgroundColor: 'primary.main',
                            }}
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            mb: 0.5,
                          }}
                        >
                          {notification.message}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip
                            label={notification.type}
                            size="small"
                            color={getNotificationColor(notification.type)}
                            variant="outlined"
                          />
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(notification.created_at)}
                          </Typography>
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
                {index < notifications.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
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
                backgroundColor: `${getNotificationColor(selectedNotification.type)}.main`,
                color: 'white',
              }}
            >
              {getNotificationIcon(selectedNotification.type)}
            </Avatar>
          )}
          <Typography variant="h6">
            {selectedNotification?.title}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Chip
              label={selectedNotification?.type}
              color={getNotificationColor(selectedNotification?.type)}
              variant="outlined"
              sx={{ mb: 1 }}
            />
            <Typography variant="body2" color="text.secondary">
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
