const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');

dotenv.config({ path: path.join(__dirname, '../.env') });

const checkAdmin = async () => {
  try {
    console.log('Connecting to MONGO_URI:', process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/medivision');
    console.log('Connected to MongoDB.');

    const adminUsers = await User.find({ role: 'admin' });
    console.log('Admin users count:', adminUsers.length);
    if (adminUsers.length > 0) {
      adminUsers.forEach(u => {
        console.log(`- ID: ${u._id}, Name: ${u.name}, Email: ${u.email}, Status: ${u.status}`);
      });
    } else {
      console.log('No admin users found! You might need to run: npm run seed');
    }
    process.exit(0);
  } catch (error) {
    console.error('Error checking admin:', error.message);
    process.exit(1);
  }
};

checkAdmin();
