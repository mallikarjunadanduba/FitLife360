import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Button,
  Stack,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  CalendarToday,
  CheckCircle,
  Cancel,
  Schedule,
  People,
  Event,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../utils/axiosConfig';

const ConsultantAppointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [rescheduleData, setRescheduleData] = useState({
    scheduled_time: '',
    notes: '',
  });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await apiClient.get('/api/consultants/dashboard');
      
      // Combine upcoming and recent consultations
      const allAppointments = [
        ...response.data.upcomingConsultations.map(apt => ({ ...apt, type: 'upcoming' })),
        ...response.data.recentConsultations.map(apt => ({ ...apt, type: 'recent' }))
      ];
      
      setAppointments(allAppointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReschedule = (appointment) => {
    setSelectedAppointment(appointment);
    setRescheduleData({
      scheduled_time: appointment.scheduled_at,
      notes: '',
    });
    setShowRescheduleDialog(true);
  };

  const handleComplete = async (appointmentId) => {
    try {
      // Update consultation status to completed
      await apiClient.put(`/api/consultations/${appointmentId}`, {
        status: 'completed'
      });
      fetchAppointments();
    } catch (error) {
      console.error('Error completing appointment:', error);
    }
  };

  const handleRescheduleSubmit = async () => {
    try {
      await apiClient.put(`/api/consultations/${selectedAppointment.id}`, {
        scheduled_time: rescheduleData.scheduled_time,
        status: 'rescheduled',
        notes: rescheduleData.notes,
      });
      setShowRescheduleDialog(false);
      setSelectedAppointment(null);
      fetchAppointments();
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
    }
  };

  const getStatusColor = (status, type) => {
    if (type === 'recent') return 'success';
    switch (status) {
      case 'scheduled': return 'primary';
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      case 'rescheduled': return 'warning';
      default: return 'default';
    }
  };

  const getStatusLabel = (status, type) => {
    if (type === 'recent') return 'Completed';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Appointments
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Manage your consultation appointments and schedules
        </Typography>
      </Box>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #00bcd4, #0097a7)',
            color: 'white',
            borderRadius: 3,
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ backgroundColor: 'rgba(255,255,255,0.2)', mr: 2 }}>
                  <CalendarToday />
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    Today's Appointments
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Scheduled sessions
                  </Typography>
                </Box>
              </Box>
              <Typography variant="h3" fontWeight="bold">
                {appointments.filter(apt => 
                  new Date(apt.scheduled_at).toDateString() === new Date().toDateString()
                ).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #ff5722, #d84315)',
            color: 'white',
            borderRadius: 3,
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ backgroundColor: 'rgba(255,255,255,0.2)', mr: 2 }}>
                  <Event />
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    Upcoming
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Future appointments
                  </Typography>
                </Box>
              </Box>
              <Typography variant="h3" fontWeight="bold">
                {appointments.filter(apt => apt.type === 'upcoming').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #00bcd4, #0097a7)',
            color: 'white',
            borderRadius: 3,
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ backgroundColor: 'rgba(255,255,255,0.2)', mr: 2 }}>
                  <CheckCircle />
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    Completed
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Past sessions
                  </Typography>
                </Box>
              </Box>
              <Typography variant="h3" fontWeight="bold">
                {appointments.filter(apt => apt.type === 'recent').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #ff5722, #d84315)',
            color: 'white',
            borderRadius: 3,
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ backgroundColor: 'rgba(255,255,255,0.2)', mr: 2 }}>
                  <People />
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    Total Clients
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Unique clients
                  </Typography>
                </Box>
              </Box>
              <Typography variant="h3" fontWeight="bold">
                {new Set(appointments.map(apt => apt.client_name)).size}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Appointments Table */}
      {appointments.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <CalendarToday sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              No appointments yet
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Appointments will appear here once clients book consultations with you
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Client</TableCell>
                <TableCell>Date & Time</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ width: 40, height: 40, mr: 2, backgroundColor: 'primary.main' }}>
                        {appointment.client_name?.[0]}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {appointment.client_name}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {new Date(appointment.scheduled_at).toLocaleDateString()}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(appointment.scheduled_at).toLocaleTimeString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {appointment.type}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusLabel(appointment.status, appointment.type)}
                      color={getStatusColor(appointment.status, appointment.type)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      {appointment.type === 'upcoming' && appointment.status === 'scheduled' && (
                        <>
                          <Button
                            size="small"
                            color="success"
                            startIcon={<CheckCircle />}
                            onClick={() => handleComplete(appointment.id)}
                          >
                            Complete
                          </Button>
                          <Button
                            size="small"
                            color="warning"
                            startIcon={<Schedule />}
                            onClick={() => handleReschedule(appointment)}
                          >
                            Reschedule
                          </Button>
                        </>
                      )}
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Reschedule Dialog */}
      <Dialog open={showRescheduleDialog} onClose={() => setShowRescheduleDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Reschedule Appointment</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="New Date & Time"
              name="scheduled_time"
              type="datetime-local"
              value={rescheduleData.scheduled_time}
              onChange={(e) => setRescheduleData({ ...rescheduleData, scheduled_time: e.target.value })}
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Notes (Optional)"
              name="notes"
              multiline
              rows={3}
              value={rescheduleData.notes}
              onChange={(e) => setRescheduleData({ ...rescheduleData, notes: e.target.value })}
              placeholder="Reason for rescheduling..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowRescheduleDialog(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleRescheduleSubmit}
            variant="contained"
            disabled={!rescheduleData.scheduled_time}
          >
            Reschedule
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ConsultantAppointments;
