import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Link,
  CircularProgress,
  Grid,
  CardContent,
  Avatar,
  Chip,
} from '@mui/material';
import {
  FitnessCenter,
  Restaurant,
  MonitorWeight,
  Psychology,
} from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AnimatedCard from '../../components/Common/AnimatedCard';
import AnimatedSection from '../../components/Common/AnimatedSection';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData.username, formData.password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const features = [
    { icon: <FitnessCenter />, text: 'Fitness Tracking', color: '#4CAF50' },
    { icon: <Restaurant />, text: 'Nutrition Planning', color: '#FF9800' },
    { icon: <MonitorWeight />, text: 'Weight Management', color: '#2196F3' },
    { icon: <Psychology />, text: 'Mental Wellness', color: '#9C27B0' },
  ];

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4} alignItems="center" sx={{ minHeight: '100vh' }}>
          {/* Left Side - Features */}
          <Grid item xs={12} md={6}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Box
                sx={{
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #4CAF50, #FF9800)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px',
                  color: 'white',
                  fontSize: '48px',
                  fontWeight: 'bold',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                }}
              >
                FL
              </Box>
              <Typography variant="h3" component="h1" fontWeight="bold" color="white" gutterBottom>
                FitLife360
              </Typography>
              <Typography variant="h6" color="rgba(255,255,255,0.9)" sx={{ mb: 4 }}>
                Your Complete Health & Wellness Platform
              </Typography>
            </Box>

            <Grid container spacing={3}>
              {features.map((feature, index) => (
                <Grid item xs={6} key={index}>
                  <AnimatedCard
                    delay={index * 200}
                    animation="fadeInLeft"
                    sx={{
                      background: 'rgba(255,255,255,0.1)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: 3,
                    }}
                  >
                    <CardContent sx={{ textAlign: 'center', p: 2 }}>
                      <Avatar
                        sx={{
                          backgroundColor: feature.color,
                          width: 48,
                          height: 48,
                          margin: '0 auto 12px',
                          transition: 'transform 0.3s ease',
                          '&:hover': {
                            transform: 'scale(1.1) rotate(5deg)',
                          },
                        }}
                      >
                        {feature.icon}
                      </Avatar>
                      <Typography variant="body2" color="white" fontWeight="500">
                        {feature.text}
                      </Typography>
                    </CardContent>
                  </AnimatedCard>
                </Grid>
              ))}
            </Grid>

            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Typography variant="body1" color="rgba(255,255,255,0.8)" sx={{ mb: 2 }}>
                Join thousands of users transforming their health
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Chip label="10K+ Users" color="primary" variant="outlined" />
                <Chip label="500+ Experts" color="primary" variant="outlined" />
                <Chip label="99% Satisfaction" color="primary" variant="outlined" />
              </Box>
            </Box>
          </Grid>

          {/* Right Side - Login Form */}
          <Grid item xs={12} md={6}>
            <AnimatedSection animation="fadeInRight" delay={500}>
              <Paper
                elevation={24}
                sx={{
                  p: 4,
                  borderRadius: 4,
                  background: 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  maxWidth: 480,
                  mx: 'auto',
                }}
              >
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
                  Welcome Back!
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Sign in to continue your health journey
                </Typography>
              </Box>

              {error && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                  {typeof error === 'string' ? error : JSON.stringify(error)}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  autoFocus
                  value={formData.username}
                  onChange={handleChange}
                  disabled={loading}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  sx={{
                    mt: 3,
                    mb: 2,
                    py: 1.5,
                    borderRadius: 2,
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    background: 'linear-gradient(135deg, #4CAF50, #45a049)',
                    boxShadow: '0 4px 20px rgba(76, 175, 80, 0.4)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #45a049, #4CAF50)',
                      boxShadow: '0 6px 25px rgba(76, 175, 80, 0.5)',
                    },
                  }}
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Sign In'
                  )}
                </Button>
                
                <Box textAlign="center" sx={{ mt: 2, mb: 2 }}>
                  <Link
                    component={RouterLink}
                    to="/forgot-password"
                    variant="body2"
                    sx={{
                      color: 'primary.main',
                      fontWeight: 'bold',
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    Forgot your password?
                  </Link>
                </Box>
                
                <Box textAlign="center" sx={{ mt: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    Don't have an account?{' '}
                    <Link
                      component={RouterLink}
                      to="/register"
                      variant="body2"
                      sx={{
                        color: 'primary.main',
                        fontWeight: 'bold',
                        textDecoration: 'none',
                        '&:hover': {
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      Create one now
                    </Link>
                  </Typography>
                </Box>
              </Box>
            </Paper>
            </AnimatedSection>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Login;
