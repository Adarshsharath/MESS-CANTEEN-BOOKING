import express from 'express';
import {
  registerAdmin,
  loginAdmin,
  getAdminProfile,
  getDashboardStats,
  getAllCanteens,
  approveCanteen,
  rejectCanteen,
  toggleCanteenStatus,
  getAllStudents,
  getStudentDetails,
  getAllOrders,
  getRevenueReport,
  exportCanteensData,
  exportStudentsData,
  exportOrdersData
} from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', registerAdmin); // In production, protect this route
router.post('/login', loginAdmin);

// Protected routes (Admin only)
router.use(protect);
router.use(adminOnly);

// Profile
router.get('/profile', getAdminProfile);

// Dashboard
router.get('/dashboard/stats', getDashboardStats);

// Canteen Management
router.get('/canteens', getAllCanteens);
router.put('/canteens/:id/approve', approveCanteen);
router.put('/canteens/:id/reject', rejectCanteen);
router.put('/canteens/:id/toggle-status', toggleCanteenStatus);

// Student Management
router.get('/students', getAllStudents);
router.get('/students/:id', getStudentDetails);

// Order Management
router.get('/orders', getAllOrders);

// Reports
router.get('/reports/revenue', getRevenueReport);

// Export Data
router.get('/export/canteens', exportCanteensData);
router.get('/export/students', exportStudentsData);
router.get('/export/orders', exportOrdersData);

export default router;
