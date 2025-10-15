import express from 'express';
import QRCode from 'qrcode';
import Order from '../models/Order.js';
import DailyCounter from '../models/DailyCounter.js';
import Student from '../models/Student.js';
import { authenticateStudent } from '../middleware/auth.js';

const router = express.Router();

// Create new order
router.post('/create', authenticateStudent, async (req, res) => {
  try {
    const { canteenId, items, totalAmount } = req.body;
    const student = await Student.findById(req.userId);

    // Get current date in YYYYMMDD format
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '');

    // Get or create daily counter for this canteen
    let counter = await DailyCounter.findOne({ canteenId, date: today });

    if (!counter) {
      counter = new DailyCounter({
        canteenId,
        date: today,
        lastOrderCount: 0
      });
    }

    // Increment counter
    counter.lastOrderCount += 1;
    await counter.save();

    // Generate order ID: canteenId-YYYYMMDD-orderNumber
    const orderId = `${canteenId}-${today}-${counter.lastOrderCount}`;

    // Create order
    const order = new Order({
      orderId,
      orderNumber: counter.lastOrderCount,
      canteenId,
      studentUSN: student.usn,
      items,
      totalAmount,
      status: 'confirmed',
      date: today
    });

    // Generate QR code
    const qrData = JSON.stringify({
      orderId: order.orderId,
      canteenId: order.canteenId,
      studentUSN: order.studentUSN,
      totalAmount: order.totalAmount,
      items: order.items
    });

    const qrCodeDataURL = await QRCode.toDataURL(qrData);
    order.qrCode = qrCodeDataURL;

    await order.save();

    res.status(201).json({
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get student's orders
router.get('/my-orders', authenticateStudent, async (req, res) => {
  try {
    const student = await Student.findById(req.userId);
    const orders = await Order.find({ studentUSN: student.usn }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get specific order by ID
router.get('/:orderId', authenticateStudent, async (req, res) => {
  try {
    const { orderId } = req.params;
    const student = await Student.findById(req.userId);
    
    const order = await Order.findOne({ orderId, studentUSN: student.usn });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
