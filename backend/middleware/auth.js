import jwt from 'jsonwebtoken';
import Student from '../models/Student.js';
import Canteen from '../models/Canteen.js';
import Admin from '../models/Admin.js';

// Middleware to verify JWT token for students
export const authenticateStudent = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.role !== 'student') {
      return res.status(403).json({ message: 'Access denied. Student role required.' });
    }

    const student = await Student.findById(decoded.id).select('-passwordHash');
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    req.student = student;
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Middleware to verify JWT token for canteens
export const authenticateCanteen = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.role !== 'canteen') {
      return res.status(403).json({ message: 'Access denied. Canteen role required.' });
    }

    const canteen = await Canteen.findById(decoded.id).select('-passwordHash');
    
    if (!canteen) {
      return res.status(404).json({ message: 'Canteen not found' });
    }

    req.canteen = canteen;
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Middleware to verify JWT token for admins
export const authenticateAdmin = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }

    const admin = await Admin.findById(decoded.id).select('-password');
    
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    if (!admin.isActive) {
      return res.status(403).json({ message: 'Admin account is deactivated' });
    }

    req.admin = admin;
    req.user = { id: decoded.id, role: 'admin' };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Generic protect middleware (works for all roles)
export const protect = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    let user;
    if (decoded.role === 'student') {
      user = await Student.findById(decoded.id).select('-passwordHash');
    } else if (decoded.role === 'canteen') {
      user = await Canteen.findById(decoded.id).select('-passwordHash');
    } else if (decoded.role === 'admin') {
      user = await Admin.findById(decoded.id).select('-password');
    }
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = { id: decoded.id, role: decoded.role };
    req[decoded.role] = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Admin-only authorization middleware
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  }
};
