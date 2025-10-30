import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  studentUSN: {
    type: String,
    required: true,
    ref: 'Student'
  },
  orderId: {
    type: String,
    required: true
  },
  canteenName: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['order_ready', 'order_served'],
    default: 'order_ready'
  },
  read: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
