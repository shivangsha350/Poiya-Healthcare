const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');

dotenv.config({ path: path.join(__dirname, '../.env') });

const resetAdmin = async () => {
  try {
    console.log('Connecting to MONGO_URI:', process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/medivision');
    console.log('Connected to MongoDB.');

    let admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      console.log('Admin not found, creating one...');
      admin = new User({
        name: 'Poiya Healthcare Administrator',
        email: 'admin@poiyahealthcare.com',
        role: 'admin',
        status: 'active'
      });
    } else {
      console.log('Admin found, updating credentials...');
      admin.email = 'admin@poiyahealthcare.com';
    }
    admin.password = 'AdminPassword123';
    await admin.save();
    console.log('Admin account has been reset/created successfully!');
    console.log('Email: admin@poiyahealthcare.com');
    console.log('Password: AdminPassword123');
    process.exit(0);
  } catch (error) {
    console.error('Error resetting admin:', error.message);
    process.exit(1);
  }
};

resetAdmin();
