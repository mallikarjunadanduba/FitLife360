import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Rating,
  Chip,
  Avatar,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import { Person, Star, Schedule, Search } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Consultants = () => {
  const navigate = useNavigate();
  const [consultants, setConsultants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    specialization: '',
  });

  useEffect(() => {
    fetchConsultants();
  }, [filters]);

  const fetchConsultants = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.specialization) params.append('specialization', filters.specialization);
      
      const response = await axios.get(`/api/consultants?${params.toString()}`);
      setConsultants(response.data);
    } catch (error) {
      console.error('Error fetching consultants:', error);
    } finally {
      setLoading(false);
    }
  };

  const specializations = [
    'Dietitian',
    'Fitness Trainer',
    'Nutritionist',
    'Weight Loss Specialist',
    'Sports Nutritionist',
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Our Expert Consultants
      </Typography>
      <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
        Connect with certified professionals for personalized health guidance
      </Typography>

      {/* Filters */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Search consultants"
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth>
                <InputLabel>Specialization</InputLabel>
                <Select
                  value={filters.specialization}
                  onChange={(e) => setFilters(prev => ({ ...prev, specialization: e.target.value }))}
                  label="Specialization"
                >
                  <MenuItem value="">All Specializations</MenuItem>
                  {specializations.map((spec) => (
                    <MenuItem key={spec} value={spec}>
                      {spec}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Consultants Grid */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {consultants
            .filter(consultant => 
              !filters.search || 
              consultant.user.first_name.toLowerCase().includes(filters.search.toLowerCase()) ||
              consultant.user.last_name.toLowerCase().includes(filters.search.toLowerCase()) ||
              consultant.specialization.toLowerCase().includes(filters.search.toLowerCase())
            )
            .map((consultant) => (
            <Grid item xs={12} sm={6} md={4} key={consultant.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-4px)' },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      sx={{
                        width: 60,
                        height: 60,
                        mr: 2,
                        backgroundColor: 'primary.main',
                      }}
                    >
                      {consultant.user.first_name[0]}{consultant.user.last_name[0]}
                    </Avatar>
                    <Box>
                      <Typography variant="h6">
                        {consultant.user.first_name} {consultant.user.last_name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {consultant.specialization}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Rating
                        value={consultant.rating}
                        readOnly
                        size="small"
                        sx={{ mr: 1 }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        ({consultant.total_consultations} consultations)
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="primary" fontWeight="bold">
                      ${consultant.hourly_rate}/hour
                    </Typography>
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {consultant.bio?.substring(0, 150)}...
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Experience: {consultant.experience_years} years
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {consultant.qualifications}
                    </Typography>
                  </Box>

                  <Chip
                    label={consultant.is_available ? 'Available' : 'Unavailable'}
                    color={consultant.is_available ? 'success' : 'default'}
                    size="small"
                    sx={{ mb: 2 }}
                  />
                </CardContent>

                <Box sx={{ p: 2, pt: 0 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<Schedule />}
                    onClick={() => navigate('/consultations')}
                    disabled={!consultant.is_available}
                  >
                    {consultant.is_available ? 'Book Consultation' : 'Currently Unavailable'}
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {consultants.length === 0 && !loading && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No consultants found matching your criteria
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default Consultants;
