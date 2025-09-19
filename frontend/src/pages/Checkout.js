import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  TextField,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { ShoppingCartCheckout } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../utils/axiosConfig';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [razorpayConfig, setRazorpayConfig] = useState(null);
  const [formData, setFormData] = useState({
    shipping_address: '',
    billing_address: '',
    payment_method: 'razorpay',
    notes: '',
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user || !token) {
      navigate('/login');
    }
  }, [user, token, navigate]);

  // Load Razorpay configuration
  useEffect(() => {
    const loadRazorpayConfig = async () => {
      try {
        const response = await apiClient.get('/api/payments/config');
        setRazorpayConfig(response.data);
      } catch (error) {
        console.error('Failed to load Razorpay config:', error);
      }
    };

    if (user && token) {
      loadRazorpayConfig();
    }
  }, [user, token]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const processRazorpayPayment = async (order) => {
    try {
      // Load Razorpay script if not already loaded
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay script');
      }

      // Create Razorpay payment order
      const paymentResponse = await apiClient.post(`/api/orders/${order.id}/create-payment`);
      const paymentOrder = paymentResponse.data;

      const options = {
        key: razorpayConfig.key_id,
        amount: paymentOrder.amount,
        currency: paymentOrder.currency,
        name: 'FitLife360',
        description: `Order #${order.order_number}`,
        order_id: paymentOrder.order_id,
        handler: async function (response) {
          try {
            // Verify payment
            await apiClient.post('/api/payments/verify', {
              payment_id: response.razorpay_payment_id,
              order_id: response.razorpay_order_id,
              signature: response.razorpay_signature,
            });

            // Process payment for the order
            await apiClient.post(`/api/orders/${order.id}/payment`, {
              payment_id: response.razorpay_payment_id,
            });

            // Clear cart and redirect
            clearCart();
            navigate('/orders');
          } catch (error) {
            setError('Payment verification failed');
            console.error('Payment verification error:', error);
          }
        },
        prefill: {
          name: user.full_name || user.username,
          email: user.email || '',
          contact: user.phone || '',
        },
        theme: {
          color: '#1976d2',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      setError('Payment initialization failed');
      console.error('Razorpay error:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check authentication
    if (!user || !token) {
      setError('Please log in to complete your order');
      navigate('/login');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const orderData = {
        items: cartItems.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
        shipping_address: formData.shipping_address,
        billing_address: formData.billing_address,
        payment_method: formData.payment_method,
        notes: formData.notes,
      };


      const response = await apiClient.post('/api/orders', orderData);
      const order = response.data;
      
      // Process payment based on selected method
      if (formData.payment_method === 'razorpay') {
        if (!razorpayConfig) {
          setError('Payment configuration not loaded. Please try again.');
          return;
        }
        await processRazorpayPayment(order);
      } else {
        // For other payment methods, show confirmation
        if (window.confirm(`Complete payment of ₹${getCartTotal()} for Order #${order.order_number}?`)) {
          try {
            // Process payment
            await apiClient.post(`/api/orders/${order.id}/payment`, {
              payment_id: `sim_${Date.now()}`,
              payment_method: formData.payment_method
            });
            
            // Clear cart and redirect to orders page
            clearCart();
            navigate('/orders');
          } catch (error) {
            setError('Payment processing failed');
          }
        }
      }
      
    } catch (error) {
      setError(error.response?.data?.detail || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="warning">
          Your cart is empty. Please add some products before checkout.
        </Alert>
        <Button
          variant="contained"
          onClick={() => navigate('/products')}
          sx={{ mt: 2 }}
        >
          Browse Products
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Checkout
      </Typography>
      <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
        Complete your order
      </Typography>

      <Grid container spacing={3}>
        {/* Checkout Form */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Information
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {typeof error === 'string' ? error : JSON.stringify(error)}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Shipping Address"
                  name="shipping_address"
                  value={formData.shipping_address}
                  onChange={handleChange}
                  required
                  multiline
                  rows={3}
                  sx={{ mb: 3 }}
                  disabled={loading}
                />

                <TextField
                  fullWidth
                  label="Billing Address"
                  name="billing_address"
                  value={formData.billing_address}
                  onChange={handleChange}
                  required
                  multiline
                  rows={3}
                  sx={{ mb: 3 }}
                  disabled={loading}
                />

                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Payment Method</InputLabel>
                  <Select
                    name="payment_method"
                    value={formData.payment_method}
                    onChange={handleChange}
                    disabled={loading}
                    label="Payment Method"
                  >
                    <MenuItem value="razorpay">Razorpay (Credit/Debit Card, UPI, Net Banking)</MenuItem>
                    <MenuItem value="card">Credit/Debit Card (Simulated)</MenuItem>
                    <MenuItem value="paypal">PayPal (Simulated)</MenuItem>
                    <MenuItem value="bank_transfer">Bank Transfer (Simulated)</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  label="Order Notes (Optional)"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  multiline
                  rows={2}
                  sx={{ mb: 3 }}
                  disabled={loading}
                />

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  startIcon={<ShoppingCartCheckout />}
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    `Place Order - ₹${getCartTotal().toFixed(2)}`
                  )}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Order Summary */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>

              {cartItems.map((item) => (
                <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">
                    {item.name} x{item.quantity}
                  </Typography>
                  <Typography variant="body2">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </Typography>
                </Box>
              ))}

              <Box sx={{ borderTop: '1px solid #e0e0e0', pt: 2, mt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Subtotal:</Typography>
                  <Typography>₹{getCartTotal().toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Shipping:</Typography>
                  <Typography>Free</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Tax:</Typography>
                  <Typography>₹0.00</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                  <Typography variant="h6">Total:</Typography>
                  <Typography variant="h6">₹{getCartTotal().toFixed(2)}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Checkout;
