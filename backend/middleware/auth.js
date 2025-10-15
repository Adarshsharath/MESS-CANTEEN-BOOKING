import jwt from 'jsonwebtoken';
import Student from '../models/Student.js';
import Canteen from '../models/Canteen.js';

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
