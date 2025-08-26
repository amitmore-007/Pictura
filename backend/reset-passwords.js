const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');

const resetPasswords = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get all users
    const users = await User.find({});
    console.log(`Found ${users.length} users`);

    for (const user of users) {
      // Create new password hash with correct salt rounds
      const salt = await bcrypt.genSalt(12);
      let newPassword;
      
      // Set default passwords for testing
      if (user.email === 'test@test.com') {
        newPassword = 'test123';
      } else if (user.email === 'amore@gmail.com') {
        newPassword = 'password123'; // Set a default password
      } else {
        newPassword = 'password123'; // Default for other users
      }

      const hashedPassword = await bcrypt.hash(newPassword, salt);
      
      // Update user with new password
      await User.findByIdAndUpdate(user._id, { 
        password: hashedPassword 
      });

      console.log(`Updated password for ${user.email} - new password: ${newPassword}`);
      
      // Test the password immediately
      const testUser = await User.findById(user._id).select('+password');
      const isPasswordCorrect = await bcrypt.compare(newPassword, testUser.password);
      console.log(`Password test for ${user.email}: ${isPasswordCorrect ? 'PASS' : 'FAIL'}`);
    }

    await mongoose.disconnect();
    console.log('Password reset complete. Disconnected from MongoDB');
    
    console.log('\n=== Test Credentials ===');
    console.log('Email: test@test.com');
    console.log('Password: test123');
    console.log('Email: amore@gmail.com');
    console.log('Password: password123');
    
  } catch (error) {
    console.error('Error resetting passwords:', error);
    process.exit(1);
  }
};

resetPasswords();
