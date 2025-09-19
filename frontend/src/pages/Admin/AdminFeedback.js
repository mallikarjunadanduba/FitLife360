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
  Box,
  Rating,
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
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import {
  Star,
  Delete,
  Visibility,
  MoreVert,
  ThumbUp,
  ThumbDown,
  Comment,
  Assessment,
} from '@mui/icons-material';
import axios from 'axios';

const AdminFeedback = () => {
  const [reviews, setReviews] = useState([]);
  const [consultationFeedback, setConsultationFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedReview, setSelectedReview] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const [reviewsResponse, consultationsResponse] = await Promise.all([
        axios.get('/api/admin/reviews'),
        axios.get('/api/admin/consultations')
      ]);
      
      setReviews(reviewsResponse.data);
      
      // Filter consultations with feedback
      const consultationsWithFeedback = consultationsResponse.data.filter(
        consultation => consultation.feedback || consultation.rating
      );
      setConsultationFeedback(consultationsWithFeedback);
      
    } catch (error) {
      console.error('Error fetching feedback:', error);
      setError('Failed to fetch feedback data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await axios.delete(`/api/admin/reviews/${reviewId}`);
        setSuccess('Review deleted successfully');
        fetchFeedback();
      } catch (error) {
        console.error('Error deleting review:', error);
        setError('Failed to delete review');
      }
    }
    setAnchorEl(null);
  };

  const handleViewDetails = (review) => {
    setSelectedReview(review);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedReview(null);
  };

  const handleMenuOpen = (event, review) => {
    setAnchorEl(event.currentTarget);
    setSelectedReview(review);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedReview(null);
  };

  const filteredReviews = reviews.filter(review => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'high') return review.rating >= 4;
    if (filterStatus === 'low') return review.rating <= 2;
    return true;
  });

  const getRatingColor = (rating) => {
    if (rating >= 4) return 'success';
    if (rating >= 3) return 'warning';
    return 'error';
  };

  const getRatingText = (rating) => {
    if (rating >= 4) return 'Excellent';
    if (rating >= 3) return 'Good';
    if (rating >= 2) return 'Fair';
    return 'Poor';
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
        Feedback Management
      </Typography>
      <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
        Monitor user feedback on consultations and products
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
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
              <Tab label={`Product Reviews (${reviews.length})`} />
              <Tab label={`Consultation Feedback (${consultationFeedback.length})`} />
            </Tabs>
          </Box>

          {activeTab === 0 && (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Filter by Rating</InputLabel>
                  <Select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    label="Filter by Rating"
                  >
                    <MenuItem value="all">All Reviews</MenuItem>
                    <MenuItem value="high">High Rating (4-5)</MenuItem>
                    <MenuItem value="low">Low Rating (1-2)</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell>User</TableCell>
                      <TableCell>Rating</TableCell>
                      <TableCell>Review</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredReviews.map((review) => (
                      <TableRow key={review.id}>
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold">
                            Product #{review.product_id}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="body2">
                              {review.user.first_name} {review.user.last_name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Rating value={review.rating} readOnly size="small" />
                            <Chip
                              label={getRatingText(review.rating)}
                              color={getRatingColor(review.rating)}
                              size="small"
                            />
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ maxWidth: 200 }}>
                            {review.review_text || 'No text review'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {new Date(review.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Button
                              size="small"
                              startIcon={<Visibility />}
                              onClick={() => handleViewDetails(review)}
                            >
                              View
                            </Button>
                            <IconButton
                              onClick={(e) => handleMenuOpen(e, review)}
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
            </>
          )}

          {activeTab === 1 && (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Consultation</TableCell>
                    <TableCell>User</TableCell>
                    <TableCell>Consultant</TableCell>
                    <TableCell>Rating</TableCell>
                    <TableCell>Feedback</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {consultationFeedback.map((consultation) => (
                    <TableRow key={consultation.id}>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold">
                          Consultation #{consultation.id}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(consultation.scheduled_time).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {consultation.user.first_name} {consultation.user.last_name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {consultation.consultant.user.first_name} {consultation.consultant.user.last_name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {consultation.rating ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Rating value={consultation.rating} readOnly size="small" />
                            <Chip
                              label={getRatingText(consultation.rating)}
                              color={getRatingColor(consultation.rating)}
                              size="small"
                            />
                          </Box>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            No rating
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ maxWidth: 200 }}>
                          {consultation.feedback || 'No feedback'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {new Date(consultation.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          startIcon={<Visibility />}
                          onClick={() => handleViewDetails(consultation)}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Review Details Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedReview?.product_id ? 'Product Review Details' : 'Consultation Feedback Details'}
        </DialogTitle>
        <DialogContent>
          {selectedReview && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  {selectedReview.product_id ? 'Product Review' : 'Consultation Feedback'}
                </Typography>
              </Grid>
              
              {selectedReview.product_id && (
                <>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Product ID: {selectedReview.product_id}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      User: {selectedReview.user.first_name} {selectedReview.user.last_name}
                    </Typography>
                  </Grid>
                </>
              )}
              
              {selectedReview.consultant && (
                <>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Consultant: {selectedReview.consultant.user.first_name} {selectedReview.consultant.user.last_name}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Scheduled: {new Date(selectedReview.scheduled_time).toLocaleString()}
                    </Typography>
                  </Grid>
                </>
              )}
              
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  Rating: 
                </Typography>
                <Rating value={selectedReview.rating} readOnly />
                <Chip
                  label={getRatingText(selectedReview.rating)}
                  color={getRatingColor(selectedReview.rating)}
                  size="small"
                  sx={{ ml: 1 }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  {selectedReview.product_id ? 'Review Text:' : 'Feedback:'}
                </Typography>
                <Typography variant="body1" sx={{ mt: 1, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  {selectedReview.review_text || selectedReview.feedback || 'No text provided'}
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  Date: {new Date(selectedReview.created_at).toLocaleString()}
                </Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
          {selectedReview?.product_id && (
            <Button 
              onClick={() => handleDeleteReview(selectedReview.id)} 
              color="error"
              startIcon={<Delete />}
            >
              Delete Review
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          handleViewDetails(selectedReview);
          handleMenuClose();
        }}>
          <Visibility sx={{ mr: 1 }} />
          View Details
        </MenuItem>
        <MenuItem onClick={() => handleDeleteReview(selectedReview?.id)}>
          <Delete sx={{ mr: 1 }} />
          Delete Review
        </MenuItem>
      </Menu>
    </Container>
  );
};

export default AdminFeedback;
