const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

// @desc    Register user
// @access  Public
const signup = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { name, email, password } = req.body;

    console.log('Signup attempt:', { name, email, passwordLength: password?.length });

    // Check if user exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email',
      });
    }

    // Create user - let the model handle password hashing
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password, // Don't hash here - let the pre-save middleware handle it
    });

    console.log('User created successfully:', user._id);

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      message: 'User registered successfully',
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Login user
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('Login attempt:', { 
      email, 
      passwordProvided: !!password,
      passwordLength: password?.length 
    });

    // Basic validation
    if (!email || !password) {
      console.log('Missing email or password');
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
      });
    }

    // Check for user (explicitly select password field)
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    
    if (!user) {
      console.log('User not found for email:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    console.log('User found:', { id: user._id, email: user.email });

    // Check password using the model method only
    const isPasswordCorrect = await user.comparePassword(password);
    
    if (!isPasswordCorrect) {
      console.log('Password incorrect for user:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Generate token
    const token = generateToken(user._id);

    console.log('Login successful for user:', user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      message: 'Login successful',
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get current user
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user'
    });
  }
};

module.exports = {
  signup,
  login,
  getMe,
};
       