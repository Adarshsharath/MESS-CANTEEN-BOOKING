import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema({
  canteenId: {
    type: String,
    required: true,
    ref: 'Canteen'
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  available: {
    type: Boolean,
    default: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Beverages', 'Other'],
    default: 'Other'
  },
  description: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

export default MenuItem;
