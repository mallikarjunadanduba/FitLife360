import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  IconButton,
  Menu,
  MenuItem as MenuItemComponent,
  Box,
  Grid,
} from '@mui/material';
import { 
  Event, 
  Star, 
  MoreVert, 
  Edit, 
  Delete, 
  CheckCircle, 
  Cancel,
  Schedule,
  Visibility
} from '@mui/icons-material';
import axios from 'axios';

const AdminConsultations = () => {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingConsultation, setEditingConsultation] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [formData, setFormData] = useState({
    status: '',
    notes: '',
    consultant_plan: '',
  });

  useEffect(() => {
    fetchConsultations();
  }, []);

  const fetchConsultations = async () => {
    try {
      const response = await axios.get('/api/admin/consultations');
      setConsultations(response.data);
    } catch (error) {
      console.error('Error fetching consultations:', error);
      setError('Failed to fetch consultations');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (consultationId, newStatus) => {
    try {
      await axios.put(`/api/admin/consultations/${consultationId}/status`, { status: newStatus });
      setSuccess('Consultation status updated successfully');
      fetchConsultations();
    } catch (error) {
      console.error('Error updating consultation status:', error);
      setError('Failed to update consultation status');
    }
  };

  const handleOpenDialog = (consultation = null) => {
    if (consultation) {
      setEditingConsultation(consultation);
      setFormData({
        status: consultation.status,
        notes: consultation.notes || '',
        consultant_plan: consultation.consultant_plan || '',
      });
    } else {
      setEditingConsultation(null);
      setFormData({
        status: '',
        notes: '',
        consultant_plan: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingConsultation(null);
    setFormData({
      status: '',
      notes: '',
      consultant_plan: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/admin/consultations/${editingConsultation.id}`, formData);
      setSuccess('Consultation updated successfully');
      fetchConsultations();
      handleCloseDialog();
    } catch (error) {
      console.error('Error updating consultation:', error);
      setError('Failed to update consultation');
    }
  };

  const handleDelete = async (consultationId) => {
    if (window.confirm('Are you sure you want to delete this consultation?')) {
      try {
        await axios.delete(`/api/admin/consultations/${consultationId}`);
        setSuccess('Consultation deleted successfully');
        fetchConsultations();
      } catch (error) {
        console.error('Error deleting consultation:', error);
        setError('Failed to delete consultation');
      }
    }
    setAnchorEl(null);
  };

  const handleMenuOpen = (event, consultation) => {
    setAnchorEl(event.currentTarget);
    setSelectedConsultation(consultation);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedConsultation(null);
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
      <Typography variant="h4" component="h1" gutterBottom>
        Consultation Management
      </Typography>
      <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
        Monitor and manage all consultations across the platform
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {typeof error === 'string' ? error : JSON.stringify(error)}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      <Card>
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Consultation</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Consultant</TableCell>
                  <TableCell>Date & Time</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Rating</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {consultations.map((consultation) => (
                  <TableRow key={consultation.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Event sx={{ mr: 1 }} />
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            Consultation #{consultation.id}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {consultation.duration_minutes} minutes
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {consultation.user.first_name} {consultation.user.last_name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {consultation.user.email}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {consultation.consultant.user.first_name} {consultation.consultant.user.last_name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {consultation.consultant.specialization}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {new Date(consultation.scheduled_time).toLocaleString()}
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
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<CheckCircle />}
                          onClick={() => handleUpdateStatus(consultation.id, 'completed')}
                          disabled={consultation.status === 'completed'}
                        >
                          Complete
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<Cancel />}
                          onClick={() => handleUpdateStatus(consultation.id, 'cancelled')}
                          disabled={consultation.status === 'cancelled'}
                          color="error"
                        >
                          Cancel
                        </Button>
                        <IconButton
                          onClick={(e) => handleMenuOpen(e, consultation)}
                          size="small"
                        >
                          <MoreVert />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Edit Consultation Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          Edit Consultation Details
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    label="Status"
                  >
                    <MenuItem value="scheduled">Scheduled</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="cancelled">Cancelled</MenuItem>
                    <MenuItem value="rescheduled">Rescheduled</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notes"
                  name="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Consultant Plan"
                  name="consultant_plan"
                  value={formData.consultant_plan}
                  onChange={(e) => setFormData({ ...formData, consultant_plan: e.target.value })}
                  multiline
                  rows={4}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              Update Consultation
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItemComponent onClick={() => {
          handleOpenDialog(selectedConsultation);
          handleMenuClose();
        }}>
          <Edit sx={{ mr: 1 }} />
          Edit Details
        </MenuItemComponent>
        <MenuItemComponent onClick={() => handleDelete(selectedConsultation?.id)}>
          <Delete sx={{ mr: 1 }} />
          Delete Consultation
        </MenuItemComponent>
      </Menu>
    </Container>
  );
};

export default AdminConsultations;
