import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Chip,
  IconButton
} from '@mui/material';
import {
  Send,
  Notifications,
  Email,
  Sms,
  Delete,
  Visibility
} from '@mui/icons-material';
import apiClient from '../../utils/axiosConfig';

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [notificationForm, setNotificationForm] = useState({
    title: '',
    message: '',
    type: 'general',
    send_email: false,
    send_sms: false,
    user_id: null
  });

  useEffect(() => {
    fetchNotifications();
    fetchUsers();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/api/notifications/admin/all');
      setNotifications(response.data);
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

  const fetchUsers = async () => {
    try {
      const response = await apiClient.get('/api/admin/users');
      setUsers(response.data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  const handleSendNotification = async () => {
    try {
      setLoading(true);
      
      if (notificationForm.user_id) {
        // Send to specific user
        await apiClient.post('/api/notifications/send', {
          user_id: notificationForm.user_id,
          title: notificationForm.title,
          message: notificationForm.message,
          notification_type: notificationForm.type,
          send_email: notificationForm.send_email,
          send_sms: notificationForm.send_sms
        });
      } else {
        // Broadcast to all users
        await apiClient.post('/api/notifications/broadcast', {
          title: notificationForm.title,
          message: notificationForm.message,
          notification_type: notificationForm.type,
          send_email: notificationForm.send_email,
          send_sms: notificationForm.send_sms
        });
      }

      setOpenDialog(false);
      setNotificationForm({
        title: '',
        message: '',
        type: 'general',
        send_email: false,
        send_sms: false,
        user_id: null
      });
      fetchNotifications();
    } catch (err) {
      console.error('Error sending notification:', err.response?.data);
      const errorMessage = err.response?.data?.detail || 
                          (Array.isArray(err.response?.data) ? err.response.data.map(e => e.msg).join(', ') : null) ||
                          'Failed to send notification';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await apiClient.put(`/api/notifications/admin/${notificationId}/read`);
      fetchNotifications();
    } catch (err) {
      console.error('Error marking notification as read:', err.response?.data);
      const errorMessage = err.response?.data?.detail || 
                          (Array.isArray(err.response?.data) ? err.response.data.map(e => e.msg).join(', ') : null) ||
                          'Failed to mark notification as read';
      setError(errorMessage);
    }
  };

  const markAllAsRead = async () => {
    try {
      await apiClient.put('/api/notifications/admin/read-all');
      fetchNotifications();
    } catch (err) {
      console.error('Error marking all notifications as read:', err.response?.data);
      const errorMessage = err.response?.data?.detail || 
                          (Array.isArray(err.response?.data) ? err.response.data.map(e => e.msg).join(', ') : null) ||
                          'Failed to mark all notifications as read';
      setError(errorMessage);
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'consultation':
        return 'primary';
      case 'order':
        return 'success';
      case 'reminder':
        return 'warning';
      case 'promotion':
        return 'info';
      default:
        return 'default';
    }
  };

  if (loading && notifications.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Notification Management
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Send Notification Button */}
      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<Send />}
          onClick={() => setOpenDialog(true)}
          sx={{ mr: 2 }}
        >
          Send Notification
        </Button>
        <Button
          variant="outlined"
          startIcon={<Notifications />}
          onClick={markAllAsRead}
        >
          Mark All as Read
        </Button>
      </Box>

      {/* Notifications Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            All Notifications ({notifications.length})
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Message</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Channels</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {notifications.map((notification) => (
                  <TableRow key={notification.id}>
                    <TableCell>{notification.id}</TableCell>
                    <TableCell>{notification.title}</TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          maxWidth: 200,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {notification.message}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={notification.type}
                        color={getTypeColor(notification.type)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {notification.user ? 
                        `${notification.user.first_name} ${notification.user.last_name} (${notification.user.username})` : 
                        `User #${notification.user_id}`
                      }
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={notification.is_read ? 'Read' : 'Unread'}
                        color={notification.is_read ? 'success' : 'warning'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box display="flex" gap={1}>
                        {notification.sent_via_email && (
                          <Email color="primary" fontSize="small" />
                        )}
                        {notification.sent_via_sms && (
                          <Sms color="success" fontSize="small" />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      {new Date(notification.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {!notification.is_read && (
                        <IconButton
                          size="small"
                          onClick={() => markAsRead(notification.id)}
                          title="Mark as Read"
                        >
                          <Visibility />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Send Notification Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Send Notification</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                value={notificationForm.title}
                onChange={(e) => setNotificationForm({
                  ...notificationForm,
                  title: e.target.value
                })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Message"
                multiline
                rows={4}
                value={notificationForm.message}
                onChange={(e) => setNotificationForm({
                  ...notificationForm,
                  message: e.target.value
                })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={notificationForm.type}
                  label="Type"
                  onChange={(e) => setNotificationForm({
                    ...notificationForm,
                    type: e.target.value
                  })}
                >
                  <MenuItem value="general">General</MenuItem>
                  <MenuItem value="consultation">Consultation</MenuItem>
                  <MenuItem value="order">Order</MenuItem>
                  <MenuItem value="reminder">Reminder</MenuItem>
                  <MenuItem value="promotion">Promotion</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Send To</InputLabel>
                <Select
                  value={notificationForm.user_id || ''}
                  label="Send To"
                  onChange={(e) => setNotificationForm({
                    ...notificationForm,
                    user_id: e.target.value || null
                  })}
                >
                  <MenuItem value="">All Users (Broadcast)</MenuItem>
                  {users.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.username} ({user.first_name} {user.last_name})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={notificationForm.send_email}
                    onChange={(e) => setNotificationForm({
                      ...notificationForm,
                      send_email: e.target.checked
                    })}
                  />
                }
                label="Send via Email"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={notificationForm.send_sms}
                    onChange={(e) => setNotificationForm({
                      ...notificationForm,
                      send_sms: e.target.checked
                    })}
                  />
                }
                label="Send via SMS"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={handleSendNotification}
            variant="contained"
            disabled={!notificationForm.title || !notificationForm.message}
          >
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminNotifications;