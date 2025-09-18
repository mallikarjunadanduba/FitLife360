import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Schedule,
  CheckCircle,
  Cancel,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../utils/axiosConfig';

const ConsultantAvailability = () => {
  const { user } = useAuth();
  const [availabilitySlots, setAvailabilitySlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);
  const [slotData, setSlotData] = useState({
    start_time: '',
    end_time: '',
  });

  useEffect(() => {
    fetchAvailabilitySlots();
  }, []);

  const fetchAvailabilitySlots = async () => {
    try {
      // Get consultant ID from user's consultant profile
      const consultantsResponse = await apiClient.get('/api/consultants/');
      const userConsultant = consultantsResponse.data.find(c => c.user_id === user.id);
      
      if (userConsultant) {
        const response = await apiClient.get(`/api/consultants/${userConsultant.id}/availability`);
        setAvailabilitySlots(response.data);
      }
    } catch (error) {
      console.error('Error fetching availability slots:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setSlotData({
      ...slotData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      // Get consultant ID from user's consultant profile
      const consultantsResponse = await apiClient.get('/api/consultants/');
      const userConsultant = consultantsResponse.data.find(c => c.user_id === user.id);
      
      if (!userConsultant) {
        console.error('Consultant profile not found');
        return;
      }
      
      if (editingSlot) {
        await apiClient.put(`/api/consultants/availability/${editingSlot.id}`, slotData);
      } else {
        await apiClient.post(`/api/consultants/${userConsultant.id}/availability`, slotData);
      }
      
      setShowDialog(false);
      setSlotData({
        start_time: '',
        end_time: '',
      });
      setEditingSlot(null);
      fetchAvailabilitySlots();
    } catch (error) {
      console.error('Error saving availability slot:', error);
    }
  };

  const handleEdit = (slot) => {
    setEditingSlot(slot);
    setSlotData({
      start_time: slot.start_time,
      end_time: slot.end_time,
    });
    setShowDialog(true);
  };

  const handleDelete = async (slotId) => {
    try {
      await apiClient.delete(`/api/consultants/availability/${slotId}`);
      fetchAvailabilitySlots();
    } catch (error) {
      console.error('Error deleting availability slot:', error);
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
            Set Availability
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Manage your available time slots for consultations
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setShowDialog(true)}
        >
          Add Time Slot
        </Button>
      </Box>

      {availabilitySlots.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <Schedule sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              No availability slots set
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Add your available time slots so clients can book consultations with you
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<Add />}
              onClick={() => setShowDialog(true)}
            >
              Add Time Slot
            </Button>
          </CardContent>
        </Card>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Start Date & Time</TableCell>
                <TableCell>End Date & Time</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {availabilitySlots.map((slot) => (
                <TableRow key={slot.id}>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {new Date(slot.start_time).toLocaleDateString()}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(slot.start_time).toLocaleTimeString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {new Date(slot.end_time).toLocaleDateString()}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(slot.end_time).toLocaleTimeString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={slot.is_booked ? 'Booked' : 'Available'}
                      color={slot.is_booked ? 'error' : 'success'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleEdit(slot)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(slot.id)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={showDialog} onClose={() => setShowDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingSlot ? 'Edit Time Slot' : 'Add Time Slot'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Start Date & Time"
              name="start_time"
              type="datetime-local"
              value={slotData.start_time}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="End Date & Time"
              name="end_time"
              type="datetime-local"
              value={slotData.end_time}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDialog(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!slotData.start_time || !slotData.end_time}
          >
            {editingSlot ? 'Update' : 'Add'} Time Slot
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ConsultantAvailability;
