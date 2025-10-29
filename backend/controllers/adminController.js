import Admin from '../models/Admin.js';
import Canteen from '../models/Canteen.js';
import Student from '../models/Student.js';
import Order from '../models/Order.js';
import MenuItem from '../models/MenuItem.js';
import jwt from 'jsonwebtoken';

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id, role: 'admin' }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Register new admin (super admin only)
// @route   POST /api/admin/register
// @access  Super Admin
export const registerAdmin = async (req, res) => {
  try {
    const { username, email, password, name, role, permissions } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ $or: [{ email }, { username }] });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists with this email or username' });
    }

    // Create admin
    const admin = await Admin.create({
      username,
      email,
      password,
      name,
      role: role || 'admin',
      permissions: permissions || {}
    });

    res.status(201).json({
      _id: admin._id,
      username: admin.username,
      email: admin.email,
      name: admin.name,
      role: admin.role,
      permissions: admin.permissions,
      token: generateToken(admin._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login admin
// @route   POST /api/admin/login
// @access  Public
export const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find admin
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if active
    if (!admin.isActive) {
      return res.status(403).json({ message: 'Account is deactivated' });
    }

    // Verify password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    res.json({
      _id: admin._id,
      username: admin.username,
      email: admin.email,
      name: admin.name,
      role: admin.role,
      permissions: admin.permissions,
      token: generateToken(admin._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get admin profile
// @route   GET /api/admin/profile
// @access  Private (Admin)
export const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id).select('-password');
    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard/stats
// @access  Private (Admin)
export const getDashboardStats = async (req, res) => {
  try {
    console.log('Dashboard stats requested by:', req.user);
    
    // Get counts
    const totalCanteens = await Canteen.countDocuments();
    console.log('Total Canteens:', totalCanteens);
    
    const activeCanteens = await Canteen.countDocuments({ status: 'active', approvalStatus: 'approved' });
    console.log('Active Canteens:', activeCanteens);
    
    const pendingCanteens = await Canteen.countDocuments({ approvalStatus: 'pending' });
    console.log('Pending Canteens:', pendingCanteens);
    
    const totalStudents = await Student.countDocuments();
    console.log('Total Students:', totalStudents);
    
    const totalOrders = await Order.countDocuments();
    console.log('Total Orders:', totalOrders);

    // Get today's orders
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayOrders = await Order.countDocuments({
      createdAt: { $gte: today }
    });

    // Calculate total revenue
    const revenueResult = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    // Calculate today's revenue
    const todayRevenueResult = await Order.aggregate([
      { 
        $match: { 
          createdAt: { $gte: today },
          status: { $ne: 'cancelled' }
        } 
      },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const todayRevenue = todayRevenueResult.length > 0 ? todayRevenueResult[0].total : 0;

    // Get recent orders with manual lookups (since refs are Strings, not ObjectIds)
    const recentOrders = await Order.aggregate([
      { $sort: { createdAt: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'canteens',
          localField: 'canteenId',
          foreignField: 'canteenId',
          as: 'canteenInfo'
        }
      },
      {
        $lookup: {
          from: 'students',
          localField: 'studentUSN',
          foreignField: 'usn',
          as: 'studentInfo'
        }
      },
      {
        $addFields: {
          canteenId: { $arrayElemAt: ['$canteenInfo', 0] },
          studentId: { $arrayElemAt: ['$studentInfo', 0] }
        }
      },
      {
        $project: {
          canteenInfo: 0,
          studentInfo: 0
        }
      }
    ]);

    // Get canteen-wise revenue with lookup
    const populatedCanteenRevenue = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      {
        $group: {
          _id: '$canteenId',
          revenue: { $sum: '$totalAmount' },
          orders: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'canteens',
          localField: '_id',
          foreignField: 'canteenId',
          as: 'canteenInfo'
        }
      },
      {
        $addFields: {
          _id: { $arrayElemAt: ['$canteenInfo', 0] }
        }
      },
      {
        $project: {
          canteenInfo: 0
        }
      },
      { $sort: { revenue: -1 } },
      { $limit: 10 }
    ]);

    const responseData = {
      totalCanteens,
      activeCanteens,
      pendingCanteens,
      totalStudents,
      totalOrders,
      todayOrders,
      totalRevenue,
      todayRevenue,
      recentOrders,
      topCanteens: populatedCanteenRevenue
    };
    
    console.log('Sending dashboard stats:', responseData);
    res.json(responseData);
  } catch (error) {
    console.error('Error in getDashboardStats:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all canteens with filters
// @route   GET /api/admin/canteens
// @access  Private (Admin)
export const getAllCanteens = async (req, res) => {
  try {
    const { approvalStatus, status } = req.query;
    
    const filter = {};
    if (approvalStatus) filter.approvalStatus = approvalStatus;
    if (status) filter.status = status;

    console.log('getAllCanteens filter:', filter);
    const canteens = await Canteen.find(filter)
      .populate('approvedBy', 'name username')
      .sort({ createdAt: -1 });
    
    console.log(`Found ${canteens.length} canteens`);

    // Calculate revenue for each canteen with daily/monthly breakdown
    const canteensWithStats = await Promise.all(
      canteens.map(async (canteen) => {
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        
        // Total orders (all time)
        const allOrders = await Order.find({ 
          canteenId: canteen.canteenId,
          status: { $ne: 'cancelled' }
        });
        
        // Today's orders
        const todayOrders = allOrders.filter(o => new Date(o.createdAt) >= todayStart);
        
        // This month's orders
        const monthOrders = allOrders.filter(o => new Date(o.createdAt) >= monthStart);
        
        const totalRevenue = allOrders.reduce((sum, order) => sum + order.totalAmount, 0);
        const todayRevenue = todayOrders.reduce((sum, order) => sum + order.totalAmount, 0);
        const monthRevenue = monthOrders.reduce((sum, order) => sum + order.totalAmount, 0);

        console.log(`Canteen ${canteen.name}: Total: ₹${totalRevenue}, Month: ₹${monthRevenue}, Today: ₹${todayRevenue}`);

        return {
          ...canteen.toObject(),
          calculatedRevenue: totalRevenue,
          calculatedOrderCount: allOrders.length,
          todayRevenue,
          todayOrders: todayOrders.length,
          monthRevenue,
          monthOrders: monthOrders.length
        };
      })
    );

    console.log('Sending canteen data with stats');
    res.json(canteensWithStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve canteen registration
// @route   PUT /api/admin/canteens/:id/approve
// @access  Private (Admin)
export const approveCanteen = async (req, res) => {
  try {
    const canteen = await Canteen.findById(req.params.id);
    
    if (!canteen) {
      return res.status(404).json({ message: 'Canteen not found' });
    }

    canteen.approvalStatus = 'approved';
    canteen.approvedBy = req.user.id;
    canteen.approvedAt = new Date();
    canteen.status = 'active';

    await canteen.save();

    res.json({
      message: 'Canteen approved successfully',
      canteen
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reject canteen registration
// @route   PUT /api/admin/canteens/:id/reject
// @access  Private (Admin)
export const rejectCanteen = async (req, res) => {
  try {
    const { reason } = req.body;
    const canteen = await Canteen.findById(req.params.id);
    
    if (!canteen) {
      return res.status(404).json({ message: 'Canteen not found' });
    }

    canteen.approvalStatus = 'rejected';
    canteen.rejectionReason = reason || 'No reason provided';
    canteen.status = 'inactive';

    await canteen.save();

    res.json({
      message: 'Canteen rejected',
      canteen
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Suspend/Activate canteen
// @route   PUT /api/admin/canteens/:id/toggle-status
// @access  Private (Admin)
export const toggleCanteenStatus = async (req, res) => {
  try {
    const canteen = await Canteen.findById(req.params.id);
    
    if (!canteen) {
      return res.status(404).json({ message: 'Canteen not found' });
    }

    canteen.status = canteen.status === 'active' ? 'inactive' : 'active';
    await canteen.save();

    res.json({
      message: `Canteen ${canteen.status === 'active' ? 'activated' : 'suspended'}`,
      canteen
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all students
// @route   GET /api/admin/students
// @access  Private (Admin)
export const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });

    // Get order statistics for each student with daily/monthly breakdown
    const studentsWithStats = await Promise.all(
      students.map(async (student) => {
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        
        const allOrders = await Order.find({ studentUSN: student.usn }).sort({ createdAt: -1 });
        const validOrders = allOrders.filter(o => o.status !== 'cancelled');
        
        // Filter by time periods
        const todayOrders = validOrders.filter(o => new Date(o.createdAt) >= todayStart);
        const monthOrders = validOrders.filter(o => new Date(o.createdAt) >= monthStart);
        
        const totalSpent = validOrders.reduce((sum, order) => sum + order.totalAmount, 0);
        const todaySpent = todayOrders.reduce((sum, order) => sum + order.totalAmount, 0);
        const monthSpent = monthOrders.reduce((sum, order) => sum + order.totalAmount, 0);
        
        return {
          ...student.toObject(),
          totalOrders: validOrders.length,
          totalSpent,
          todaySpent,
          todayOrders: todayOrders.length,
          monthSpent,
          monthOrders: monthOrders.length,
          lastOrder: validOrders.length > 0 ? validOrders[0].createdAt : null
        };
      })
    );

    res.json(studentsWithStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get student details with order history
// @route   GET /api/admin/students/:id
// @access  Private (Admin)
export const getStudentDetails = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Use aggregation with $lookup since refs are Strings
    const orders = await Order.aggregate([
      { $match: { studentUSN: student.usn } },
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: 'canteens',
          localField: 'canteenId',
          foreignField: 'canteenId',
          as: 'canteenInfo'
        }
      },
      {
        $addFields: {
          canteenId: { $arrayElemAt: ['$canteenInfo', 0] }
        }
      },
      {
        $project: {
          canteenInfo: 0
        }
      }
    ]);

    const totalSpent = orders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, order) => sum + order.totalAmount, 0);

    res.json({
      student,
      orders,
      statistics: {
        totalOrders: orders.length,
        totalSpent,
        pendingOrders: orders.filter(o => o.status === 'pending' || o.status === 'confirmed').length,
        completedOrders: orders.filter(o => o.status === 'served').length
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders with filters
// @route   GET /api/admin/orders
// @access  Private (Admin)
export const getAllOrders = async (req, res) => {
  try {
    const { status, canteenId, startDate, endDate } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    if (canteenId) filter.canteenId = canteenId;
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    // Use aggregation with $lookup since refs are Strings
    const orders = await Order.aggregate([
      { $match: filter },
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: 'canteens',
          localField: 'canteenId',
          foreignField: 'canteenId',
          as: 'canteenInfo'
        }
      },
      {
        $lookup: {
          from: 'students',
          localField: 'studentUSN',
          foreignField: 'usn',
          as: 'studentInfo'
        }
      },
      {
        $addFields: {
          canteenId: { $arrayElemAt: ['$canteenInfo', 0] },
          studentId: { $arrayElemAt: ['$studentInfo', 0] }
        }
      },
      {
        $project: {
          canteenInfo: 0,
          studentInfo: 0
        }
      }
    ]);

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get revenue report data
// @route   GET /api/admin/reports/revenue
// @access  Private (Admin)
export const getRevenueReport = async (req, res) => {
  try {
    const { startDate, endDate, groupBy = 'day' } = req.query;
    
    const matchStage = {
      status: { $ne: 'cancelled' }
    };

    if (startDate || endDate) {
      matchStage.createdAt = {};
      if (startDate) matchStage.createdAt.$gte = new Date(startDate);
      if (endDate) matchStage.createdAt.$lte = new Date(endDate);
    }

    let groupByFormat;
    switch (groupBy) {
      case 'month':
        groupByFormat = { $dateToString: { format: '%Y-%m', date: '$createdAt' } };
        break;
      case 'week':
        groupByFormat = { $dateToString: { format: '%Y-W%V', date: '$createdAt' } };
        break;
      default: // day
        groupByFormat = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } };
    }

    const revenueByPeriod = await Order.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: groupByFormat,
          revenue: { $sum: '$totalAmount' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Get revenue by canteen
    const revenueByCanteen = await Order.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$canteenId',
          revenue: { $sum: '$totalAmount' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { revenue: -1 } }
    ]);

    const populatedRevenueByCanteen = await Canteen.populate(revenueByCanteen, {
      path: '_id',
      select: 'name canteenId'
    });

    res.json({
      revenueByPeriod,
      revenueByCanteen: populatedRevenueByCanteen,
      totalRevenue: revenueByPeriod.reduce((sum, item) => sum + item.revenue, 0),
      totalOrders: revenueByPeriod.reduce((sum, item) => sum + item.orders, 0)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Export canteen data to CSV
// @route   GET /api/admin/export/canteens
// @access  Private (Admin)
export const exportCanteensData = async (req, res) => {
  try {
    const canteens = await Canteen.find();

    const csvData = await Promise.all(
      canteens.map(async (canteen) => {
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        
        const allOrders = await Order.find({ canteenId: canteen.canteenId, status: { $ne: 'cancelled' } });
        const todayOrders = allOrders.filter(o => new Date(o.createdAt) >= todayStart);
        const monthOrders = allOrders.filter(o => new Date(o.createdAt) >= monthStart);
        
        const totalRevenue = allOrders.reduce((sum, order) => sum + order.totalAmount, 0);
        const todayRevenue = todayOrders.reduce((sum, order) => sum + order.totalAmount, 0);
        const monthRevenue = monthOrders.reduce((sum, order) => sum + order.totalAmount, 0);

        return {
          'Canteen ID': canteen.canteenId,
          'Name': canteen.name,
          'Email': canteen.email,
          'Status': canteen.status,
          'Approval Status': canteen.approvalStatus,
          'Phone': canteen.contactPhone || 'N/A',
          'Address': canteen.address || 'N/A',
          'Total Orders': allOrders.length,
          'Today Orders': todayOrders.length,
          'Month Orders': monthOrders.length,
          'Total Revenue': totalRevenue,
          'Today Revenue': todayRevenue,
          'Month Revenue': monthRevenue,
          'Operating Hours': canteen.operatingHours?.enabled ? `${canteen.operatingHours.openTime}-${canteen.operatingHours.closeTime}` : 'Manual',
          'Created At': canteen.createdAt.toISOString(),
          'Approved At': canteen.approvedAt ? canteen.approvedAt.toISOString() : 'N/A'
        };
      })
    );

    res.json(csvData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Export student data to CSV
// @route   GET /api/admin/export/students
// @access  Private (Admin)
export const exportStudentsData = async (req, res) => {
  try {
    const students = await Student.find();

    const csvData = await Promise.all(
      students.map(async (student) => {
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        
        const allOrders = await Order.find({ studentUSN: student.usn }).sort({ createdAt: -1 });
        const validOrders = allOrders.filter(o => o.status !== 'cancelled');
        const todayOrders = validOrders.filter(o => new Date(o.createdAt) >= todayStart);
        const monthOrders = validOrders.filter(o => new Date(o.createdAt) >= monthStart);
        
        const totalSpent = validOrders.reduce((sum, order) => sum + order.totalAmount, 0);
        const todaySpent = todayOrders.reduce((sum, order) => sum + order.totalAmount, 0);
        const monthSpent = monthOrders.reduce((sum, order) => sum + order.totalAmount, 0);

        return {
          'USN': student.usn,
          'Name': student.name,
          'Email': student.email,
          'Phone': student.phone || 'N/A',
          'Department': student.department || 'N/A',
          'Total Orders': validOrders.length,
          'Today Orders': todayOrders.length,
          'Month Orders': monthOrders.length,
          'Total Spent': totalSpent,
          'Today Spent': todaySpent,
          'Month Spent': monthSpent,
          'Last Order': validOrders.length > 0 ? validOrders[0].createdAt.toISOString() : 'N/A',
          'Registered At': student.createdAt.toISOString()
        };
      })
    );

    res.json(csvData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Export orders data to CSV
// @route   GET /api/admin/export/orders
// @access  Private (Admin)
export const exportOrdersData = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const filter = {};
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    // Use aggregation with $lookup since refs are Strings
    const orders = await Order.aggregate([
      { $match: filter },
      {
        $lookup: {
          from: 'canteens',
          localField: 'canteenId',
          foreignField: 'canteenId',
          as: 'canteenInfo'
        }
      },
      {
        $lookup: {
          from: 'students',
          localField: 'studentUSN',
          foreignField: 'usn',
          as: 'studentInfo'
        }
      },
      {
        $addFields: {
          canteenId: { $arrayElemAt: ['$canteenInfo', 0] },
          studentId: { $arrayElemAt: ['$studentInfo', 0] }
        }
      },
      {
        $project: {
          canteenInfo: 0,
          studentInfo: 0
        }
      }
    ]);

    const csvData = orders.map(order => ({
      'Order ID': order.orderId,
      'Order Number': order.orderNumber,
      'Canteen': order.canteenId?.name || 'N/A',
      'Canteen ID': order.canteenId?.canteenId || 'N/A',
      'Student Name': order.studentId?.name || 'N/A',
      'Student USN': order.studentId?.usn || order.studentUSN,
      'Items Count': order.items.length,
      'Total Amount': order.totalAmount,
      'Status': order.status,
      'Order Date': new Date(order.createdAt).toISOString(),
      'Updated At': new Date(order.updatedAt).toISOString()
    }));

    res.json(csvData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
