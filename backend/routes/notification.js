import express from 'express';
import Notification from '../models/Notification.js';
import { authenticateStudent } from '../middleware/auth.js';

const router = express.Router();

// Get all notifications for a student
router.get('/my-notifications', authenticateStudent, async (req, res) => {
  try {
    const notifications = await Notification.find({ 
      studentUSN: req.student.usn 
    }).sort({ createdAt: -1 });
    
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get unread notification count
router.get('/unread-count', authenticateStudent, async (req, res) => {
  try {
    const count = await Notification.countDocuments({ 
      studentUSN: req.student.usn,
      read: false
    });
    
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Mark notification as read
router.patch('/:notificationId/read', authenticateStudent, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.notificationId);
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    if (notification.studentUSN !== req.student.usn) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    notification.read = true;
    await notification.save();
    
    res.json({ message: 'Notification marked as read', notification });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Mark all notifications as read
router.patch('/mark-all-read', authenticateStudent, async (req, res) => {
  try {
    await Notification.updateMany(
      { studentUSN: req.student.usn, read: false },
      { read: true }
    );
    
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
