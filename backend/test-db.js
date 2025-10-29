import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Canteen from './models/Canteen.js';
import Student from './models/Student.js';
import Order from './models/Order.js';

dotenv.config();

const testDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/canteen-booking');
    console.log('✅ Connected to MongoDB');

    // Count documents
    const canteenCount = await Canteen.countDocuments();
    const studentCount = await Student.countDocuments();
    const orderCount = await Order.countDocuments();

    console.log('\n📊 Database Counts:');
    console.log('Canteens:', canteenCount);
    console.log('Students:', studentCount);
    console.log('Orders:', orderCount);

    // List all canteens
    if (canteenCount > 0) {
      console.log('\n🏪 Canteens in database:');
      const canteens = await Canteen.find().select('name canteenId approvalStatus status');
      canteens.forEach(c => {
        console.log(`  - ${c.name} (${c.canteenId}) - ${c.approvalStatus}, ${c.status}`);
      });
    }

    // List all students
    if (studentCount > 0) {
      console.log('\n🎓 Students in database:');
      const students = await Student.find().select('name usn email');
      students.forEach(s => {
        console.log(`  - ${s.name} (${s.usn}) - ${s.email}`);
      });
    }

    // List all orders
    if (orderCount > 0) {
      console.log('\n📦 Orders in database:');
      const orders = await Order.find().select('orderNumber status totalAmount createdAt').limit(5);
      orders.forEach(o => {
        console.log(`  - Order #${o.orderNumber} - ${o.status} - ₹${o.totalAmount} - ${o.createdAt}`);
      });
    }

    if (canteenCount === 0 && studentCount === 0 && orderCount === 0) {
      console.log('\n⚠️  Database is empty! Register canteens and students first.');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

testDatabase();
