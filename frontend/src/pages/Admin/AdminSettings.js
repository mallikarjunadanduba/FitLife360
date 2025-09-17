import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Paper
} from '@mui/material';
import {
  Save,
  Settings,
  Notifications,
  Security,
  Payment
} from '@mui/icons-material';
import axios from 'axios';

const AdminSettings = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  
  // General Settings
  const [generalSettings, setGeneralSettings] = useState({
    site_name: 'FitLife360',
    site_description: 'Comprehensive weight management platform',
    maintenance_mode: false,
    registration_enabled: true,
    consultation_booking_enabled: true
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    email_notifications: true,
    sms_notifications: false,
    consultation_reminders: true,
    order_updates: true,
    promotional_emails: false
  });

  // Payment Settings
  const [paymentSettings, setPaymentSettings] = useState({
    razorpay_enabled: true,
    razorpay_key_id: '',
    razorpay_key_secret: '',
    currency: 'INR',
    min_order_amount: 100
  });

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    session_timeout: 24,
    max_login_attempts: 5,
    password_min_length: 8,
    two_factor_auth: false,
    ip_whitelist: ''
  });

  useEffect(() => {
    // In a real app, you would fetch these settings from the backend
    // For now, we'll use default values
  }, []);

  const handleSaveGeneral = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, you would send this to the backend
      console.log('Saving general settings:', generalSettings);
      
      setSuccess('General settings saved successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to save general settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Saving notification settings:', notificationSettings);
      
      setSuccess('Notification settings saved successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to save notification settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePayment = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Saving payment settings:', paymentSettings);
      
      setSuccess('Payment settings saved successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to save payment settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSecurity = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Saving security settings:', securitySettings);
      
      setSuccess('Security settings saved successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to save security settings');
    } finally {
      setLoading(false);
    }
  };

  const TabPanel = ({ children, value, index, ...other }) => (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        System Settings
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      <Paper sx={{ width: '100%' }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          aria-label="settings tabs"
        >
          <Tab icon={<Settings />} label="General" />
          <Tab icon={<Notifications />} label="Notifications" />
          <Tab icon={<Payment />} label="Payments" />
          <Tab icon={<Security />} label="Security" />
        </Tabs>

        {/* General Settings Tab */}
        <TabPanel value={activeTab} index={0}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                General Settings
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Site Name"
                    value={generalSettings.site_name}
                    onChange={(e) => setGeneralSettings({
                      ...generalSettings,
                      site_name: e.target.value
                    })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Site Description"
                    value={generalSettings.site_description}
                    onChange={(e) => setGeneralSettings({
                      ...generalSettings,
                      site_description: e.target.value
                    })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle1" gutterBottom>
                    Feature Toggles
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={generalSettings.maintenance_mode}
                        onChange={(e) => setGeneralSettings({
                          ...generalSettings,
                          maintenance_mode: e.target.checked
                        })}
                      />
                    }
                    label="Maintenance Mode"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={generalSettings.registration_enabled}
                        onChange={(e) => setGeneralSettings({
                          ...generalSettings,
                          registration_enabled: e.target.checked
                        })}
                      />
                    }
                    label="Allow User Registration"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={generalSettings.consultation_booking_enabled}
                        onChange={(e) => setGeneralSettings({
                          ...generalSettings,
                          consultation_booking_enabled: e.target.checked
                        })}
                      />
                    }
                    label="Allow Consultation Booking"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={handleSaveGeneral}
                    disabled={loading}
                  >
                    Save General Settings
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </TabPanel>

        {/* Notification Settings Tab */}
        <TabPanel value={activeTab} index={1}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Notification Settings
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Notification Channels
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationSettings.email_notifications}
                        onChange={(e) => setNotificationSettings({
                          ...notificationSettings,
                          email_notifications: e.target.checked
                        })}
                      />
                    }
                    label="Email Notifications"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationSettings.sms_notifications}
                        onChange={(e) => setNotificationSettings({
                          ...notificationSettings,
                          sms_notifications: e.target.checked
                        })}
                      />
                    }
                    label="SMS Notifications"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle1" gutterBottom>
                    Notification Types
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationSettings.consultation_reminders}
                        onChange={(e) => setNotificationSettings({
                          ...notificationSettings,
                          consultation_reminders: e.target.checked
                        })}
                      />
                    }
                    label="Consultation Reminders"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationSettings.order_updates}
                        onChange={(e) => setNotificationSettings({
                          ...notificationSettings,
                          order_updates: e.target.checked
                        })}
                      />
                    }
                    label="Order Updates"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationSettings.promotional_emails}
                        onChange={(e) => setNotificationSettings({
                          ...notificationSettings,
                          promotional_emails: e.target.checked
                        })}
                      />
                    }
                    label="Promotional Emails"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={handleSaveNotifications}
                    disabled={loading}
                  >
                    Save Notification Settings
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </TabPanel>

        {/* Payment Settings Tab */}
        <TabPanel value={activeTab} index={2}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Payment Settings
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={paymentSettings.razorpay_enabled}
                        onChange={(e) => setPaymentSettings({
                          ...paymentSettings,
                          razorpay_enabled: e.target.checked
                        })}
                      />
                    }
                    label="Enable Razorpay Payments"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Razorpay Key ID"
                    type="password"
                    value={paymentSettings.razorpay_key_id}
                    onChange={(e) => setPaymentSettings({
                      ...paymentSettings,
                      razorpay_key_id: e.target.value
                    })}
                    disabled={!paymentSettings.razorpay_enabled}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Razorpay Key Secret"
                    type="password"
                    value={paymentSettings.razorpay_key_secret}
                    onChange={(e) => setPaymentSettings({
                      ...paymentSettings,
                      razorpay_key_secret: e.target.value
                    })}
                    disabled={!paymentSettings.razorpay_enabled}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Currency"
                    value={paymentSettings.currency}
                    onChange={(e) => setPaymentSettings({
                      ...paymentSettings,
                      currency: e.target.value
                    })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Minimum Order Amount"
                    type="number"
                    value={paymentSettings.min_order_amount}
                    onChange={(e) => setPaymentSettings({
                      ...paymentSettings,
                      min_order_amount: parseFloat(e.target.value)
                    })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={handleSavePayment}
                    disabled={loading}
                  >
                    Save Payment Settings
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </TabPanel>

        {/* Security Settings Tab */}
        <TabPanel value={activeTab} index={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Security Settings
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Session Timeout (hours)"
                    type="number"
                    value={securitySettings.session_timeout}
                    onChange={(e) => setSecuritySettings({
                      ...securitySettings,
                      session_timeout: parseInt(e.target.value)
                    })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Max Login Attempts"
                    type="number"
                    value={securitySettings.max_login_attempts}
                    onChange={(e) => setSecuritySettings({
                      ...securitySettings,
                      max_login_attempts: parseInt(e.target.value)
                    })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Minimum Password Length"
                    type="number"
                    value={securitySettings.password_min_length}
                    onChange={(e) => setSecuritySettings({
                      ...securitySettings,
                      password_min_length: parseInt(e.target.value)
                    })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={securitySettings.two_factor_auth}
                        onChange={(e) => setSecuritySettings({
                          ...securitySettings,
                          two_factor_auth: e.target.checked
                        })}
                      />
                    }
                    label="Two-Factor Authentication"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="IP Whitelist (comma-separated)"
                    multiline
                    rows={3}
                    value={securitySettings.ip_whitelist}
                    onChange={(e) => setSecuritySettings({
                      ...securitySettings,
                      ip_whitelist: e.target.value
                    })}
                    placeholder="192.168.1.1, 10.0.0.1"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={handleSaveSecurity}
                    disabled={loading}
                  >
                    Save Security Settings
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default AdminSettings;