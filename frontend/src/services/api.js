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
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  studentLogin: (credentials) => api.post('/auth/student/login', credentials),
  studentRegister: (data) => api.post('/auth/student/register', data),
  canteenLogin: (credentials) => api.post('/auth/canteen/login', credentials),
  canteenRegister: (data) => api.post('/auth/canteen/register', data),
};

// Canteen API
export const canteenAPI = {
  getActiveCanteens: () => api.get('/canteens/active'),
  toggleStatus: () => api.patch('/canteens/toggle'),
  getProfile: () => api.get('/canteens/profile'),
  getTodayOrders: () => api.get('/canteens/orders/today'),
  getAllOrders: () => api.get('/canteens/orders'),
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

export default api;
