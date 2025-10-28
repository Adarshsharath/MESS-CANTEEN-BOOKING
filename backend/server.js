import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import canteenRoutes from './routes/canteen.js';
import menuRoutes from './routes/menu.js';
import orderRoutes from './routes/order.js';
import { initScheduler } from './services/scheduler.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize scheduler for automatic canteen status updates
initScheduler();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/canteens', canteenRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'Canteen Booking System API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
