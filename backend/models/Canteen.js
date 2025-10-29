import mongoose from 'mongoose';

const canteenSchema = new mongoose.Schema({
  canteenId: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'inactive'  // New canteens start inactive until approved
  },
  approvalStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'  // New canteens need admin approval
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  approvedAt: {
    type: Date
  },
  rejectionReason: {
    type: String
  },
  contactPhone: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  totalRevenue: {
    type: Number,
    default: 0
  },
  totalOrders: {
    type: Number,
    default: 0
  },
  operatingHours: {
    enabled: {
      type: Boolean,
      default: false
    },
    openTime: {
      type: String, // Format: "HH:MM" (24-hour format)
      default: '09:00'
    },
    closeTime: {
      type: String, // Format: "HH:MM" (24-hour format)
      default: '17:00'
    }
  }
}, {
  timestamps: true
});

const Canteen = mongoose.model('Canteen', canteenSchema);

export default Canteen;
