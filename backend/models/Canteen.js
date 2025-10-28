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
    default: 'active'
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
