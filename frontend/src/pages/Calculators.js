import React, { useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Chip,
  Divider,
} from '@mui/material';
import { Calculate, TrendingUp, Restaurant } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const Calculators = () => {
  const { user } = useAuth();
  const [calculations, setCalculations] = useState({});
  const [loading, setLoading] = useState({});

  const calculateBMI = async () => {
    setLoading(prev => ({ ...prev, bmi: true }));
    try {
      const response = await axios.get('/api/users/calculators/bmi');
      setCalculations(prev => ({ ...prev, bmi: response.data }));
    } catch (error) {
      console.error('BMI calculation error:', error);
    } finally {
      setLoading(prev => ({ ...prev, bmi: false }));
    }
  };

  const calculateCalories = async () => {
    setLoading(prev => ({ ...prev, calories: true }));
    try {
      const response = await axios.get('/api/users/calculators/calories');
      setCalculations(prev => ({ ...prev, calories: response.data }));
    } catch (error) {
      console.error('Calorie calculation error:', error);
    } finally {
      setLoading(prev => ({ ...prev, calories: false }));
    }
  };

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return { label: 'Underweight', color: 'warning' };
    if (bmi < 25) return { label: 'Normal weight', color: 'success' };
    if (bmi < 30) return { label: 'Overweight', color: 'warning' };
    return { label: 'Obese', color: 'error' };
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Health Calculators
      </Typography>
      <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
        Calculate your BMI, calorie needs, and body fat percentage
      </Typography>

      <Grid container spacing={3}>
        {/* BMI Calculator */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Calculate color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">BMI Calculator</Typography>
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Body Mass Index (BMI) is a measure of body fat based on height and weight.
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Height: {user?.height ? `${user.height} cm` : 'Not set in profile'}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Weight: {user?.weight ? `${user.weight} kg` : 'Not set in profile'}
                </Typography>
              </Box>

              <Button
                variant="contained"
                fullWidth
                onClick={calculateBMI}
                disabled={loading.bmi || !user?.height || !user?.weight}
                sx={{ mb: 2 }}
              >
                {loading.bmi ? 'Calculating...' : 'Calculate BMI'}
              </Button>

              {calculations.bmi && (
                <Box>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h3" color="primary" gutterBottom>
                      {calculations.bmi.bmi}
                    </Typography>
                    <Chip
                      label={calculations.bmi.category}
                      color={getBMICategory(calculations.bmi.bmi).color}
                      sx={{ mb: 2 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      Ideal weight range: {calculations.bmi.ideal_weight_range.min} - {calculations.bmi.ideal_weight_range.max} kg
                    </Typography>
                  </Box>
                </Box>
              )}

              {(!user?.height || !user?.weight) && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  Please complete your profile with height and weight to use this calculator.
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Calorie Calculator */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Restaurant color="secondary" sx={{ mr: 1 }} />
                <Typography variant="h6">Calorie Calculator</Typography>
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Calculate your daily calorie needs based on your activity level and goals.
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Age: {user?.age || 'Not set'} • Gender: {user?.gender || 'Not set'}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Height: {user?.height ? `${user.height} cm` : 'Not set'} • Weight: {user?.weight ? `${user.weight} kg` : 'Not set'}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Activity: {user?.activity_level?.replace('_', ' ') || 'Not set'}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Goal: {user?.goal?.replace('_', ' ') || 'Not set'}
                </Typography>
              </Box>

              <Button
                variant="contained"
                fullWidth
                onClick={calculateCalories}
                disabled={loading.calories || !user?.age || !user?.gender || !user?.height || !user?.weight || !user?.activity_level || !user?.goal}
                sx={{ mb: 2 }}
              >
                {loading.calories ? 'Calculating...' : 'Calculate Calories'}
              </Button>

              {calculations.calories && (
                <Box>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ textAlign: 'center', mb: 2 }}>
                    <Typography variant="h4" color="secondary" gutterBottom>
                      {calculations.calories.calorie_goal} cal/day
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Daily calorie goal
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>Macronutrient Breakdown:</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Protein:</Typography>
                      <Typography variant="body2">{calculations.calories.macronutrient_breakdown.protein.grams}g ({calculations.calories.macronutrient_breakdown.protein.calories} cal)</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Carbs:</Typography>
                      <Typography variant="body2">{calculations.calories.macronutrient_breakdown.carbohydrates.grams}g ({calculations.calories.macronutrient_breakdown.carbohydrates.calories} cal)</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Fat:</Typography>
                      <Typography variant="body2">{calculations.calories.macronutrient_breakdown.fat.grams}g ({calculations.calories.macronutrient_breakdown.fat.calories} cal)</Typography>
                    </Box>
                  </Box>
                </Box>
              )}

              {(!user?.age || !user?.gender || !user?.height || !user?.weight || !user?.activity_level || !user?.goal) && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  Please complete your profile to use this calculator.
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Body Fat Calculator */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUp color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">Body Fat Calculator</Typography>
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Calculate your body fat percentage using the Navy method. Requires waist, neck, and hip measurements.
              </Typography>

              <Alert severity="info" sx={{ mt: 2 }}>
                This calculator requires manual measurements. Please visit your profile to add body measurements.
              </Alert>
            </CardContent>
          </Card>
        </Grid>

        {/* Tips Card */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                💡 Health Tips
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2">
                  • BMI is a screening tool, not a diagnostic tool
                </Typography>
                <Typography variant="body2">
                  • Consult healthcare professionals for personalized advice
                </Typography>
                <Typography variant="body2">
                  • Focus on sustainable lifestyle changes
                </Typography>
                <Typography variant="body2">
                  • Track progress consistently for best results
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Calculators;
