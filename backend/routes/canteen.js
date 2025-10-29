import express from 'express';
import Canteen from '../models/Canteen.js';
import MenuItem from '../models/MenuItem.js';
import Order from '../models/Order.js';
import Notification from '../models/Notification.js';
import { authenticateCanteen } from '../middleware/auth.js';

const router = express.Router();

// Get all active canteens (public route for students)
// Only show canteens that are both active AND approved by admin
router.get('/active', async (req, res) => {
  try {
    const canteens = await Canteen.find({ 
      status: 'active',
      approvalStatus: 'approved'  // Only show admin-approved canteens
    }).select('-passwordHash');
    
    console.log(`Found ${canteens.length} active and approved canteens for students`);
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

// Mark order as ready (after cooking)
router.patch('/orders/:orderId/ready', authenticateCanteen, async (req, res) => {
  try {
    const { orderId } = req.params;
    const canteen = await Canteen.findById(req.userId);
    
    const order = await Order.findOne({ orderId });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    if (order.canteenId !== canteen.canteenId) {
      return res.status(403).json({ message: 'This order belongs to a different canteen' });
    }
    
    if (order.status === 'served') {
      return res.status(400).json({ message: 'Order already served' });
    }
    
    if (order.status === 'ready') {
      return res.status(400).json({ message: 'Order already marked as ready' });
    }
    
    if (order.status !== 'pending' && order.status !== 'confirmed') {
      return res.status(400).json({ message: 'Order cannot be marked as ready' });
    }
    
    // Mark order as ready
    order.status = 'ready';
    order.readyAt = new Date();
    await order.save();
    
    // Create notification for student
    const notification = new Notification({
      studentUSN: order.studentUSN,
      orderId: order.orderId,
      canteenName: canteen.name,
      message: `Your order #${order.orderNumber} is ready for pickup!`,
      type: 'order_ready'
    });
    await notification.save();
    
    res.json({
      message: 'Order marked as ready',
      order
    });
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
    order.servedAt = new Date();
    await order.save();

    res.json({
      message: 'Order verified and marked as served',
      order
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update operating hours
router.patch('/operating-hours', authenticateCanteen, async (req, res) => {
  try {
    const { enabled, openTime, closeTime } = req.body;
    const canteen = await Canteen.findById(req.userId);
    
    if (!canteen) {
      return res.status(404).json({ message: 'Canteen not found' });
    }

    // Validate time format (HH:MM)
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (openTime && !timeRegex.test(openTime)) {
      return res.status(400).json({ message: 'Invalid open time format. Use HH:MM' });
    }
    if (closeTime && !timeRegex.test(closeTime)) {
      return res.status(400).json({ message: 'Invalid close time format. Use HH:MM' });
    }

    // Update operating hours
    if (enabled !== undefined) canteen.operatingHours.enabled = enabled;
    if (openTime) canteen.operatingHours.openTime = openTime;
    if (closeTime) canteen.operatingHours.closeTime = closeTime;

    await canteen.save();

    res.json({
      message: 'Operating hours updated successfully',
      operatingHours: canteen.operatingHours
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get operating hours
router.get('/operating-hours', authenticateCanteen, async (req, res) => {
  try {
    const canteen = await Canteen.findById(req.userId);
    
    if (!canteen) {
      return res.status(404).json({ message: 'Canteen not found' });
    }

    res.json(canteen.operatingHours);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
