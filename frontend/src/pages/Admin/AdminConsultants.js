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
  Switch,
  FormControlLabel,
  Rating,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Alert,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Person,
  Star,
  Add,
  Edit,
  Delete,
  MoreVert,
  CheckCircle,
  Cancel,
} from '@mui/icons-material';
import axios from 'axios';

const AdminConsultants = () => {
  const [consultants, setConsultants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingConsultant, setEditingConsultant] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedConsultant, setSelectedConsultant] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [formData, setFormData] = useState({
    user_id: '',
    specialization: '',
    experience_years: '',
    qualifications: '',
    bio: '',
    hourly_rate: '',
  });

  useEffect(() => {
    fetchConsultants();
  }, []);

  const fetchConsultants = async () => {
    try {
      const response = await axios.get('/api/admin/consultants');
      setConsultants(response.data);
    } catch (error) {
      console.error('Error fetching consultants:', error);
      setError('Failed to fetch consultants');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleConsultantStatus = async (consultantId, isAvailable) => {
    try {
      await axios.put(`/api/admin/consultants/${consultantId}/status`, { is_available: !isAvailable });
      fetchConsultants();
      setSuccess('Consultant status updated successfully');
    } catch (error) {
      console.error('Error updating consultant status:', error);
      setError('Failed to update consultant status');
    }
  };

  const handleOpenDialog = (consultant = null) => {
    if (consultant) {
      setEditingConsultant(consultant);
      setFormData({
        user_id: consultant.user_id,
        specialization: consultant.specialization,
        experience_years: consultant.experience_years,
        qualifications: consultant.qualifications,
        bio: consultant.bio,
        hourly_rate: consultant.hourly_rate,
      });
    } else {
      setEditingConsultant(null);
      setFormData({
        user_id: '',
        specialization: '',
        experience_years: '',
        qualifications: '',
        bio: '',
        hourly_rate: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingConsultant(null);
    setFormData({
      user_id: '',
      specialization: '',
      experience_years: '',
      qualifications: '',
      bio: '',
      hourly_rate: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingConsultant) {
        await axios.put(`/api/admin/consultants/${editingConsultant.id}`, formData);
        setSuccess('Consultant updated successfully');
      } else {
        await axios.post('/api/admin/consultants', formData);
        setSuccess('Consultant created successfully');
      }
      fetchConsultants();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving consultant:', error);
      setError('Failed to save consultant');
    }
  };

  const handleDelete = async (consultantId) => {
    if (window.confirm('Are you sure you want to delete this consultant?')) {
      try {
        await axios.delete(`/api/admin/consultants/${consultantId}`);
        setSuccess('Consultant deleted successfully');
        fetchConsultants();
      } catch (error) {
        console.error('Error deleting consultant:', error);
        setError('Failed to delete consultant');
      }
    }
    setAnchorEl(null);
  };

  const handleMenuOpen = (event, consultant) => {
    setAnchorEl(event.currentTarget);
    setSelectedConsultant(consultant);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedConsultant(null);
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
            Consultant Management
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Manage consultant profiles and availability
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
          sx={{ height: 'fit-content' }}
        >
          Add Consultant
        </Button>
      </Box>

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

      <Card>
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Consultant</TableCell>
                  <TableCell>Specialization</TableCell>
                  <TableCell>Experience</TableCell>
                  <TableCell>Rating</TableCell>
                  <TableCell>Rate</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {consultants.map((consultant) => (
                  <TableRow key={consultant.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Person sx={{ mr: 1 }} />
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            {consultant.user.first_name} {consultant.user.last_name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {consultant.user.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={consultant.specialization}
                        color="primary"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {consultant.experience_years} years
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Rating
                          value={consultant.rating}
                          readOnly
                          size="small"
                          sx={{ mr: 1 }}
                        />
                        <Typography variant="body2">
                          ({consultant.total_consultations})
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      ${consultant.hourly_rate}/hr
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={consultant.is_available ? 'Available' : 'Unavailable'}
                        color={consultant.is_available ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={consultant.is_available}
                              onChange={() => handleToggleConsultantStatus(consultant.id, consultant.is_available)}
                              color="primary"
                            />
                          }
                          label=""
                        />
                        <IconButton
                          onClick={(e) => handleMenuOpen(e, consultant)}
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

      {/* Add/Edit Consultant Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingConsultant ? 'Edit Consultant' : 'Add New Consultant'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="User ID"
                  name="user_id"
                  value={formData.user_id}
                  onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                  required
                  type="number"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Specialization"
                  name="specialization"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Experience (Years)"
                  name="experience_years"
                  value={formData.experience_years}
                  onChange={(e) => setFormData({ ...formData, experience_years: e.target.value })}
                  required
                  type="number"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Hourly Rate ($)"
                  name="hourly_rate"
                  value={formData.hourly_rate}
                  onChange={(e) => setFormData({ ...formData, hourly_rate: e.target.value })}
                  required
                  type="number"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Qualifications"
                  name="qualifications"
                  value={formData.qualifications}
                  onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
                  required
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Bio"
                  name="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  required
                  multiline
                  rows={3}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingConsultant ? 'Update' : 'Create'}
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
        <MenuItem onClick={() => {
          handleOpenDialog(selectedConsultant);
          handleMenuClose();
        }}>
          <Edit sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={() => handleDelete(selectedConsultant?.id)}>
          <Delete sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>
    </Container>
  );
};

export default AdminConsultants;
