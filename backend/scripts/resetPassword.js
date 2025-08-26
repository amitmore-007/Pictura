const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import User model
const User = require('../models/User');

async function resetUserPassword(email, newPassword) {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      console.log('❌ User not found:', email);
      return;
    }

    console.log('📧 Found user:', user.email);
    console.log('🔍 Current password hash:', user.password);

    // Use the model's rehashing method for consistency
    await user.rehashPassword(newPassword);
    
    console.log('✅ Password updated successfully using model method!');
    
    // Verify the new password works
    const verification = await user.comparePassword(newPassword);
    console.log('✅ Password verification:', verification ? 'SUCCESS' : 'FAILED');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Usage
const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.log('Usage: node resetPassword.js <email> <password>');
  console.log('Example: node resetPassword.js a@gmail.com Amit@123');
  process.exit(1);
}

resetUserPassword(email, password);
if (!email || !password) {
  console.log('Usage: node resetPassword.js <email> <password>');
  console.log('Example: node resetPassword.js a@gmail.com Amit@123');
  process.exit(1);
}

resetUserPassword(email, password);
