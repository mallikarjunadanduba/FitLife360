import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Stack,
} from '@mui/material';
import { Add, Event, Cancel, Star, CheckCircle, Schedule, People } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../utils/axiosConfig';

const Consultations = () => {
  const { user } = useAuth();
  const [consultations, setConsultations] = useState([]);
  const [consultants, setConsultants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [bookingData, setBookingData] = useState({
    consultant_id: '',
    scheduled_time: '',
    duration_minutes: 60,
    user_health_data: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchConsultations();
    if (user?.role === 'USER') {
      fetchConsultants();
    }
  }, [user]);

  const fetchConsultations = async () => {
    try {
      let endpoint = '/api/consultations';
      if (user?.role === 'CONSULTANT') {
        endpoint = '/api/consultants/dashboard';
        const response = await apiClient.get(endpoint);
        // Combine recent and upcoming consultations
        const allConsultations = [
          ...response.data.recentConsultations,
          ...response.data.upcomingConsultations
        ];
        setConsultations(allConsultations);
      } else {
        const response = await apiClient.get(endpoint);
        setConsultations(response.data);
      }
    } catch (error) {
      console.error('Error fetching consultations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchConsultants = async () => {
    try {
      const response = await apiClient.get('/api/consultants');
      setConsultants(response.data);
    } catch (error) {
      console.error('Error fetching consultants:', error);
    }
  };

  const handleBookingChange = (e) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value,
    });
  };

  const handleBookConsultation = async () => {
    setSubmitting(true);
    try {
      await apiClient.post('/api/consultations', bookingData);
      setShowBookingDialog(false);
      setBookingData({
        consultant_id: '',
        scheduled_time: '',
        duration_minutes: 60,
        user_health_data: '',
      });
      fetchConsultations();
    } catch (error) {
      console.error('Error booking consultation:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelConsultation = async (consultationId) => {
    try {
      await apiClient.delete(`/api/consultations/${consultationId}`);
      fetchConsultations();
    } catch (error) {
      console.error('Error cancelling consultation:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'primary';
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      case 'rescheduled': return 'warning';
      default: return 'default';
    }
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            {user?.role === 'CONSULTANT' ? 'My Consultations' : 'My Consultations'}
          </Typography>
          <Typography variant="h6" color="text.secondary">
            {user?.role === 'CONSULTANT' 
              ? 'Manage consultations you provide to clients' 
              : 'Book and manage your expert consultations'
            }
          </Typography>
        </Box>
        {user?.role === 'USER' && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setShowBookingDialog(true)}
          >
            Book Consultation
          </Button>
        )}
      </Box>

      {consultations.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <Event sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              {user?.role === 'CONSULTANT' ? 'No consultations yet' : 'No consultations yet'}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              {user?.role === 'CONSULTANT' 
                ? 'You haven\'t provided any consultations yet. Clients will book sessions with you.'
                : 'Book your first consultation with our expert professionals'
              }
            </Typography>
            {user?.role === 'USER' && (
              <Button
                variant="contained"
                size="large"
                startIcon={<Add />}
                onClick={() => setShowBookingDialog(true)}
              >
                Book Consultation
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{user?.role === 'CONSULTANT' ? 'Client' : 'Consultant'}</TableCell>
                <TableCell>Date & Time</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {consultations.map((consultation) => (
                <TableRow key={consultation.id}>
                  <TableCell>
                    {user?.role === 'CONSULTANT' ? (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ width: 32, height: 32, mr: 2, backgroundColor: 'primary.main' }}>
                          {consultation.client_name?.[0]}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            {consultation.client_name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {consultation.type}
                          </Typography>
                        </Box>
                      </Box>
                    ) : (
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {consultation.consultant?.user?.first_name} {consultation.consultant?.user?.last_name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {consultation.consultant?.specialization}
                        </Typography>
                      </Box>
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(consultation.scheduled_time).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {consultation.duration_minutes} minutes
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={consultation.status}
                      color={getStatusColor(consultation.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {consultation.rating ? (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Star sx={{ fontSize: 16, color: 'orange', mr: 0.5 }} />
                        <Typography variant="body2">
                          {consultation.rating}/5
                        </Typography>
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Not rated
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    {user?.role === 'CONSULTANT' ? (
                      <Stack direction="row" spacing={1}>
                        {consultation.status === 'scheduled' && (
                          <Button
                            size="small"
                            color="success"
                            startIcon={<CheckCircle />}
                            onClick={() => {/* Mark as completed */}}
                          >
                            Complete
                          </Button>
                        )}
                        {consultation.status === 'scheduled' && (
                          <Button
                            size="small"
                            color="warning"
                            startIcon={<Schedule />}
                            onClick={() => {/* Reschedule */}}
                          >
                            Reschedule
                          </Button>
                        )}
                      </Stack>
                    ) : (
                      consultation.status === 'scheduled' && (
                        <Button
                          size="small"
                          color="error"
                          startIcon={<Cancel />}
                          onClick={() => handleCancelConsultation(consultation.id)}
                        >
                          Cancel
                        </Button>
                      )
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Booking Dialog - Only for Users */}
      {user?.role === 'USER' && (
        <Dialog open={showBookingDialog} onClose={() => setShowBookingDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Book New Consultation</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Consultant</InputLabel>
              <Select
                name="consultant_id"
                value={bookingData.consultant_id}
                label="Consultant"
                onChange={handleBookingChange}
              >
                {consultants.map((consultant) => (
                  <MenuItem key={consultant.id} value={consultant.id}>
                    {consultant.user.first_name} {consultant.user.last_name} - {consultant.specialization}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Scheduled Time"
              name="scheduled_time"
              type="datetime-local"
              value={bookingData.scheduled_time}
              onChange={handleBookingChange}
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Duration (minutes)"
              name="duration_minutes"
              type="number"
              value={bookingData.duration_minutes}
              onChange={handleBookingChange}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Health Data (Optional)"
              name="user_health_data"
              multiline
              rows={3}
              value={bookingData.user_health_data}
              onChange={handleBookingChange}
              placeholder="Share any relevant health information..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowBookingDialog(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleBookConsultation}
            variant="contained"
            disabled={submitting || !bookingData.consultant_id || !bookingData.scheduled_time}
          >
            {submitting ? 'Booking...' : 'Book Consultation'}
          </Button>
        </DialogActions>
        </Dialog>
      )}
    </Container>
  );
};

export default Consultations;
