import express from 'express';
import Canteen from '../models/Canteen.js';
import MenuItem from '../models/MenuItem.js';
import Order from '../models/Order.js';
import { authenticateCanteen } from '../middleware/auth.js';

const router = express.Router();

// Get all active canteens (public route for students)
router.get('/active', async (req, res) => {
  try {
    const canteens = await Canteen.find({ status: 'active' }).select('-passwordHash');
    res.json(canteens);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Toggle canteen status (active/inactive)
router.patch('/toggle', authenticateCanteen, async (req, res) => {
  try {
    const canteen = await Canteen.findById(req.userId);
    
    if (!canteen) {
      return res.status(404).json({ message: 'Canteen not found' });
    }

    canteen.status = canteen.status === 'active' ? 'inactive' : 'active';
    await canteen.save();

    res.json({
      message: `Canteen status changed to ${canteen.status}`,
      status: canteen.status
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get canteen profile
router.get('/profile', authenticateCanteen, async (req, res) => {
  try {
    const canteen = await Canteen.findById(req.userId).select('-passwordHash');
    res.json(canteen);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get today's orders for canteen
router.get('/orders/today', authenticateCanteen, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const canteen = await Canteen.findById(req.userId);
    
    const orders = await Order.find({
      canteenId: canteen.canteenId,
      date: today
    }).sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all orders for canteen
router.get('/orders', authenticateCanteen, async (req, res) => {
  try {
    const canteen = await Canteen.findById(req.userId);
    
    const orders = await Order.find({
      canteenId: canteen.canteenId
    }).sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Verify order by order number or full order ID
router.post('/verify', authenticateCanteen, async (req, res) => {
  try {
    const { orderIdentifier } = req.body; // Can be order number (23) or full ID (M1-20251015-23)
    const canteen = await Canteen.findById(req.userId);
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '');

    let order;

    // Check if it's just a number (order number)
    if (/^\d+$/.test(orderIdentifier)) {
      const fullOrderId = `${canteen.canteenId}-${today}-${orderIdentifier}`;
      order = await Order.findOne({ orderId: fullOrderId });
    } else {
      // It's a full order ID
      order = await Order.findOne({ orderId: orderIdentifier });
    }

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.canteenId !== canteen.canteenId) {
      return res.status(403).json({ message: 'This order belongs to a different canteen' });
    }

    if (order.status === 'served') {
      return res.status(400).json({ message: 'Order already served' });
    }

    // Mark order as served
    order.status = 'served';
    await order.save();

    res.json({
      message: 'Order verified and marked as served',
      order
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
