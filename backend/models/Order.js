import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  orderNumber: {
    type: Number,
    required: true
  },
  canteenId: {
    type: String,
    required: true,
    ref: 'Canteen'
  },
  studentUSN: {
    type: String,
    required: true,
    ref: 'Student'
  },
  items: [{
    menuItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MenuItem'
    },
    name: String,
    price: Number,
    quantity: Number
  }],
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'ready', 'served', 'cancelled'],
    default: 'pending'
  },
  readyAt: {
    type: Date
  },
  servedAt: {
    type: Date
  },
  date: {
    type: String,
    required: true
  },
  qrCode: {
    type: String
  }
}, {
  timestamps: true
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
