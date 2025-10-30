import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Student from '../models/Student.js';
import Canteen from '../models/Canteen.js';

const router = express.Router();

// Student Registration
router.post('/student/register', async (req, res) => {
  try {
    const { usn, name, email, password } = req.body;

    // Check if student already exists
    const existingStudent = await Student.findOne({ $or: [{ usn }, { email }] });
    if (existingStudent) {
      return res.status(400).json({ message: 'Student with this USN or email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create new student
    const student = new Student({
      usn,
      name,
      email,
      passwordHash
    });

    await student.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: student._id, role: 'student' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Student registered successfully',
      token,
      student: {
        id: student._id,
        usn: student.usn,
        name: student.name,
        email: student.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Student Login
router.post('/student/login', async (req, res) => {
  try {
    const { usn, email, password } = req.body;

    // Find student by USN or email
    const student = await Student.findOne({ $or: [{ usn }, { email }] });
    if (!student) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, student.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: student._id, role: 'student' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      student: {
        id: student._id,
        usn: student.usn,
        name: student.name,
        email: student.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Canteen Registration
router.post('/canteen/register', async (req, res) => {
  try {
    const { canteenId, name, email, password } = req.body;

    // Check if canteen already exists
    const existingCanteen = await Canteen.findOne({ $or: [{ canteenId }, { email }] });
    if (existingCanteen) {
      return res.status(400).json({ message: 'Canteen with this ID or email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create new canteen (approvalStatus defaults to 'pending', status to 'inactive')
    const canteen = new Canteen({
      canteenId,
      name,
      email,
      passwordHash
      // Don't set status - let it default to 'inactive' until admin approves
    });

    await canteen.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: canteen._id, role: 'canteen' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Canteen registered successfully! Your registration is pending admin approval.',
      token,
      canteen: {
        id: canteen._id,
        canteenId: canteen.canteenId,
        name: canteen.name,
        email: canteen.email,
        status: canteen.status,
        approvalStatus: canteen.approvalStatus
      },
      pendingApproval: true
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Canteen Login
router.post('/canteen/login', async (req, res) => {
  try {
    const { canteenId, email, password } = req.body;

    // Find canteen by canteenId or email
    const canteen = await Canteen.findOne({ $or: [{ canteenId }, { email }] });
    if (!canteen) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, canteen.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: canteen._id, role: 'canteen' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      canteen: {
        id: canteen._id,
        canteenId: canteen.canteenId,
        name: canteen.name,
        email: canteen.email,
        status: canteen.status
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
