import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';

// Student Pages
import StudentLogin from './pages/student/StudentLogin';
import StudentRegister from './pages/student/StudentRegister';
import StudentDashboard from './pages/student/StudentDashboard';
import MenuPage from './pages/student/MenuPage';
import CartPage from './pages/student/CartPage';
import OrderConfirmation from './pages/student/OrderConfirmation';
import MyOrders from './pages/student/MyOrders';

// Canteen Pages
import CanteenLogin from './pages/canteen/CanteenLogin';
import CanteenRegister from './pages/canteen/CanteenRegister';
import CanteenDashboard from './pages/canteen/CanteenDashboard';
import ManageMenu from './pages/canteen/ManageMenu';
import VerifyOrder from './pages/canteen/VerifyOrder';
import OperatingHours from './pages/canteen/OperatingHours';
import ScanAndVerify from './pages/canteen/ScanAndVerify';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageCanteens from './pages/admin/ManageCanteens';
import ManageStudents from './pages/admin/ManageStudents';
import Reports from './pages/admin/Reports';
import Settings from './pages/admin/Settings';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            
            {/* Student Routes */}
            <Route path="/student/login" element={<StudentLogin />} />
            <Route path="/student/register" element={<StudentRegister />} />
            <Route
              path="/student/dashboard"
              element={
                <ProtectedRoute requiredRole="student">
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/menu/:canteenId"
              element={
                <ProtectedRoute requiredRole="student">
                  <MenuPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/cart"
              element={
                <ProtectedRoute requiredRole="student">
                  <CartPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/order-confirmation"
              element={
                <ProtectedRoute requiredRole="student">
                  <OrderConfirmation />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/orders"
              element={
                <ProtectedRoute requiredRole="student">
                  <MyOrders />
                </ProtectedRoute>
              }
            />

            {/* Canteen Routes */}
            <Route path="/canteen/login" element={<CanteenLogin />} />
            <Route path="/canteen/register" element={<CanteenRegister />} />
            <Route
              path="/canteen/dashboard"
              element={
                <ProtectedRoute requiredRole="canteen">
                  <CanteenDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/canteen/menu"
              element={
                <ProtectedRoute requiredRole="canteen">
                  <ManageMenu />
                </ProtectedRoute>
              }
            />
            <Route
              path="/canteen/verify"
              element={
                <ProtectedRoute requiredRole="canteen">
                  <VerifyOrder />
                </ProtectedRoute>
              }
            />
            <Route
              path="/canteen/operating-hours"
              element={
                <ProtectedRoute requiredRole="canteen">
                  <OperatingHours />
                </ProtectedRoute>
              }
            />
            <Route
              path="/canteen/scan-verify"
              element={
                <ProtectedRoute requiredRole="canteen">
                  <ScanAndVerify />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/canteens"
              element={
                <ProtectedRoute requiredRole="admin">
                  <ManageCanteens />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/students"
              element={
                <ProtectedRoute requiredRole="admin">
                  <ManageStudents />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/reports"
              element={
                <ProtectedRoute requiredRole="admin">
                  <Reports />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <ProtectedRoute requiredRole="admin">
                  <Settings />
                </ProtectedRoute>
              }
            />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
