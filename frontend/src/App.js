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
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
