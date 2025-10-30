import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`, {
      headers: config.headers,
      token: token ? 'Present' : 'Missing'
    });
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to log errors
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    console.error('API Response Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  studentLogin: (credentials) => api.post('/auth/student/login', credentials),
  studentRegister: (data) => api.post('/auth/student/register', data),
  canteenLogin: (credentials) => api.post('/auth/canteen/login', credentials),
  canteenRegister: (data) => api.post('/auth/canteen/register', data),
  adminLogin: (credentials) => api.post('/admin/login', credentials),
  adminRegister: (data) => api.post('/admin/register', data),
};

// Canteen API
export const canteenAPI = {
  getActiveCanteens: () => api.get('/canteens/active'),
  toggleStatus: () => api.patch('/canteens/toggle'),
  getProfile: () => api.get('/canteens/profile'),
  getTodayOrders: () => api.get('/canteens/orders/today'),
  getAllOrders: () => api.get('/canteens/orders'),
  markOrderReady: (orderId) => api.patch(`/canteens/orders/${orderId}/ready`),
  verifyOrder: (orderIdentifier) => api.post('/canteens/verify', { orderIdentifier }),
  getOperatingHours: () => api.get('/canteens/operating-hours'),
  updateOperatingHours: (data) => api.patch('/canteens/operating-hours', data),
};

// Menu API
export const menuAPI = {
  getMenuByCanteen: (canteenId) => api.get(`/menu/${canteenId}`),
  getMyMenuItems: () => api.get('/menu/my/items'),
  addMenuItem: (data) => api.post('/menu/add', data),
  updateMenuItem: (itemId, data) => api.put(`/menu/update/${itemId}`, data),
  deleteMenuItem: (itemId) => api.delete(`/menu/delete/${itemId}`),
};

// Order API
export const orderAPI = {
  createOrder: (data) => api.post('/orders/create', data),
  getMyOrders: () => api.get('/orders/my-orders'),
  getOrderById: (orderId) => api.get(`/orders/${orderId}`),
};

// Notification API
export const notificationAPI = {
  getMyNotifications: () => api.get('/notifications/my-notifications'),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markAsRead: (notificationId) => api.patch(`/notifications/${notificationId}/read`),
  markAllAsRead: () => api.patch('/notifications/mark-all-read'),
};

// Admin API
export const adminAPI = {
  // Dashboard & Analytics
  getProfile: () => api.get('/admin/profile'),
  getDashboardStats: () => api.get('/admin/dashboard/stats'),
  
  // Canteen Management
  getAllCanteens: (params) => api.get('/admin/canteens', { params }),
  approveCanteen: (id) => api.put(`/admin/canteens/${id}/approve`),
  rejectCanteen: (id, data) => api.put(`/admin/canteens/${id}/reject`, data),
  toggleCanteenStatus: (id) => api.put(`/admin/canteens/${id}/toggle-status`),
  
  // Student Management
  getAllStudents: () => api.get('/admin/students'),
  getStudentDetails: (id) => api.get(`/admin/students/${id}`),
  
  // Order Management
  getAllOrders: (params) => api.get('/admin/orders', { params }),
  
  // Reports
  getRevenueReport: (params) => api.get('/admin/reports/revenue', { params }),
  
  // Export Data
  exportCanteens: () => api.get('/admin/export/canteens'),
  exportStudents: () => api.get('/admin/export/students'),
  exportOrders: (params) => api.get('/admin/export/orders', { params }),
};

export default api;
