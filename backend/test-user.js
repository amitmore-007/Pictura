const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');

const createTestUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if test user already exists
    const existingUser = await User.findOne({ email: 'test@test.com' });
    
    if (existingUser) {
      console.log('Test user already exists');
      await mongoose.disconnect();
      return;
    }

    // Create test user
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash('test123', salt);

    const testUser = await User.create({
      name: 'Test User',
      email: 'test@test.com',
      password: hashedPassword
    });

    console.log('Test user created:', {
      id: testUser._id,
      name: testUser.name,
      email: testUser.email
    });

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error creating test user:', error);
    process.exit(1);
  }
};

createTestUser();
