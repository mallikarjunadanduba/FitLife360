import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Avatar,
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
} from '@mui/material';
import {
  People,
  Star,
  Event,
  Message,
  TrendingUp,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../utils/axiosConfig';

const ConsultantClients = () => {
  const { user } = useAuth();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalClients: 0,
    activeClients: 0,
    totalConsultations: 0,
    averageRating: 0,
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      // Get consultant dashboard data which includes client information
      const response = await apiClient.get('/api/consultants/dashboard');
      
      // Extract unique clients from consultations
      const consultations = [
        ...response.data.recentConsultations,
        ...response.data.upcomingConsultations
      ];
      
      const clientMap = new Map();
      consultations.forEach(consultation => {
        if (consultation.client_name && !clientMap.has(consultation.client_name)) {
          clientMap.set(consultation.client_name, {
            name: consultation.client_name,
            type: consultation.type,
            lastConsultation: consultation.scheduled_at,
            totalConsultations: consultations.filter(c => c.client_name === consultation.client_name).length,
            status: 'Active',
          });
        }
      });
      
      setClients(Array.from(clientMap.values()));
      
      // Calculate stats
      setStats({
        totalClients: clientMap.size,
        activeClients: clientMap.size,
        totalConsultations: response.data.totalConsultations,
        averageRating: response.data.averageRating,
      });
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
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
          My Clients
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Manage your client relationships and track their progress
        </Typography>
      </Box>

      {/* Stats Cards */}
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
                  <People />
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    Total Clients
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Active relationships
                  </Typography>
                </Box>
              </Box>
              <Typography variant="h3" fontWeight="bold">
                {stats.totalClients}
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
                    Consultations
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Total sessions
                  </Typography>
                </Box>
              </Box>
              <Typography variant="h3" fontWeight="bold">
                {stats.totalConsultations}
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
                  <Star />
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    Rating
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Average rating
                  </Typography>
                </Box>
              </Box>
              <Typography variant="h3" fontWeight="bold">
                {stats.averageRating}
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
                  <TrendingUp />
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    Active
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Current clients
                  </Typography>
                </Box>
              </Box>
              <Typography variant="h3" fontWeight="bold">
                {stats.activeClients}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Clients Table */}
      {clients.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <People sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              No clients yet
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Clients will appear here once they book consultations with you
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Client</TableCell>
                <TableCell>Consultation Type</TableCell>
                <TableCell>Total Sessions</TableCell>
                <TableCell>Last Consultation</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clients.map((client, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ width: 40, height: 40, mr: 2, backgroundColor: 'primary.main' }}>
                        {getInitials(client.name)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {client.name}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {client.type}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {client.totalConsultations}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(client.lastConsultation).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={client.status}
                      color="success"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Button
                        size="small"
                        color="primary"
                        startIcon={<Message />}
                        onClick={() => {/* Open message dialog */}}
                      >
                        Message
                      </Button>
                      <Button
                        size="small"
                        color="secondary"
                        startIcon={<Event />}
                        onClick={() => {/* Schedule consultation */}}
                      >
                        Schedule
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default ConsultantClients;
