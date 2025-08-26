const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email',
    ],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
  },
  role: {
    type: String,
    default: 'user',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Index for email
userSchema.index({ email: 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    console.log('🔐 Hashing password for user:', this.email);
    const salt = await bcrypt.genSalt(12); // Use consistent salt rounds
    this.password = await bcrypt.hash(this.password, salt);
    console.log('✅ Password hashed successfully');
    next();
  } catch (error) {
    console.error('❌ Password hashing error:', error);
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    console.log('🔍 Comparing password for user:', this.email);
    const result = await bcrypt.compare(candidatePassword, this.password);
    console.log('🔍 Password comparison result:', result);
    return result;
  } catch (error) {
    console.error('❌ Password comparison error:', error);
    return false;
  }
};

// Method to manually rehash password for existing users (keep for migration)
userSchema.methods.rehashPassword = async function(plainPassword) {
  console.log('🔄 Rehashing password for user:', this.email);
  this.password = plainPassword; // Set plain password
  await this.save(); // This will trigger the pre-save middleware
  console.log('✅ Password rehashed successfully');
};

module.exports = mongoose.model('User', userSchema);
    
   