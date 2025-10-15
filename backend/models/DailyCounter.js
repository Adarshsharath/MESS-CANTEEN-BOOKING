import mongoose from 'mongoose';

const dailyCounterSchema = new mongoose.Schema({
  canteenId: {
    type: String,
    required: true,
    ref: 'Canteen'
  },
  date: {
    type: String,
    required: true
  },
  lastOrderCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Compound index to ensure one counter per canteen per day
dailyCounterSchema.index({ canteenId: 1, date: 1 }, { unique: true });

const DailyCounter = mongoose.model('DailyCounter', dailyCounterSchema);

export default DailyCounter;
