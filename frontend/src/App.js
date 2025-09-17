import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { useAuth } from './contexts/AuthContext';
import { CustomThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/Layout/Navbar';
import ModernLayout from './components/Layout/ModernLayout';
import Footer from './components/Layout/Footer';
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Calculators from './pages/Calculators';
import Progress from './pages/Progress';
import Consultants from './pages/Consultants';
import Consultations from './pages/Consultations';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminUsers from './pages/Admin/AdminUsers';
import AdminConsultants from './pages/Admin/AdminConsultants';
import AdminProducts from './pages/Admin/AdminProducts';
import AdminOrders from './pages/Admin/AdminOrders';
import AdminAnalytics from './pages/Admin/AdminAnalytics';
import AdminReports from './pages/Admin/AdminReports';
import AdminNotifications from './pages/Admin/AdminNotifications';
import AdminSettings from './pages/Admin/AdminSettings';
import AdminFeedback from './pages/Admin/AdminFeedback';
import ConsultantDashboard from './pages/ConsultantDashboard';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import LoadingSpinner from './components/Common/LoadingSpinner';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  // Check if current route should use modern layout
  const useModernLayout = (pathname) => {
    const modernLayoutRoutes = [
      '/dashboard', '/profile', '/calculators', '/progress', '/consultations', 
      '/cart', '/checkout', '/orders', '/admin', '/consultant'
    ];
    return modernLayoutRoutes.some(route => pathname.startsWith(route));
  };

  return (
    <CustomThemeProvider>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <Navbar />
              <Box sx={{ flex: 1 }}>
                <Home />
              </Box>
              <Footer />
            </Box>
          } />
          <Route 
            path="/login" 
            element={user ? <Navigate to={user.role === 'ADMIN' ? '/admin' : user.role === 'CONSULTANT' ? '/consultant' : '/dashboard'} /> : <Login />} 
          />
          <Route 
            path="/register" 
            element={user ? <Navigate to={user.role === 'ADMIN' ? '/admin' : user.role === 'CONSULTANT' ? '/consultant' : '/dashboard'} /> : <Register />} 
          />
          <Route path="/products" element={
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <Navbar />
              <Box sx={{ flex: 1 }}>
                <Products />
              </Box>
              <Footer />
            </Box>
          } />
          <Route path="/products/:id" element={
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <Navbar />
              <Box sx={{ flex: 1 }}>
                <ProductDetail />
              </Box>
              <Footer />
            </Box>
          } />
          <Route path="/consultants" element={
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <Navbar />
              <Box sx={{ flex: 1 }}>
                <Consultants />
              </Box>
              <Footer />
            </Box>
          } />

          {/* Protected Routes with Modern Layout */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <ModernLayout>
                <Dashboard />
              </ModernLayout>
            </ProtectedRoute>
          } />
          <Route path="/consultant" element={
            <ProtectedRoute requiredRole="CONSULTANT">
              <ModernLayout>
                <ConsultantDashboard />
              </ModernLayout>
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <ModernLayout>
                <Profile />
              </ModernLayout>
            </ProtectedRoute>
          } />
          <Route path="/calculators" element={
            <ProtectedRoute>
              <ModernLayout>
                <Calculators />
              </ModernLayout>
            </ProtectedRoute>
          } />
          <Route path="/progress" element={
            <ProtectedRoute>
              <ModernLayout>
                <Progress />
              </ModernLayout>
            </ProtectedRoute>
          } />
          <Route path="/consultations" element={
            <ProtectedRoute>
              <ModernLayout>
                <Consultations />
              </ModernLayout>
            </ProtectedRoute>
          } />
          <Route path="/cart" element={
            <ProtectedRoute>
              <ModernLayout>
                <Cart />
              </ModernLayout>
            </ProtectedRoute>
          } />
          <Route path="/checkout" element={
            <ProtectedRoute>
              <ModernLayout>
                <Checkout />
              </ModernLayout>
            </ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute>
              <ModernLayout>
                <Orders />
              </ModernLayout>
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute requiredRole="ADMIN">
              <ModernLayout>
                <AdminDashboard />
              </ModernLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute requiredRole="ADMIN">
              <ModernLayout>
                <AdminUsers />
              </ModernLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/consultants" element={
            <ProtectedRoute requiredRole="ADMIN">
              <ModernLayout>
                <AdminConsultants />
              </ModernLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/products" element={
            <ProtectedRoute requiredRole="ADMIN">
              <ModernLayout>
                <AdminProducts />
              </ModernLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/orders" element={
            <ProtectedRoute requiredRole="ADMIN">
              <ModernLayout>
                <AdminOrders />
              </ModernLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/analytics" element={
            <ProtectedRoute requiredRole="ADMIN">
              <ModernLayout>
                <AdminAnalytics />
              </ModernLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/reports" element={
            <ProtectedRoute requiredRole="ADMIN">
              <ModernLayout>
                <AdminReports />
              </ModernLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/notifications" element={
            <ProtectedRoute requiredRole="ADMIN">
              <ModernLayout>
                <AdminNotifications />
              </ModernLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/settings" element={
            <ProtectedRoute requiredRole="ADMIN">
              <ModernLayout>
                <AdminSettings />
              </ModernLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/feedback" element={
            <ProtectedRoute requiredRole="ADMIN">
              <ModernLayout>
                <AdminFeedback />
              </ModernLayout>
            </ProtectedRoute>
          } />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Box>
    </CustomThemeProvider>
  );
}

export default App;
