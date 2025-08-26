const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Test Cloudinary connection
const testCloudinaryConnection = async () => {
  try {
    const result = await cloudinary.api.ping();
    console.log('✅ Cloudinary connection successful:', {
      status: result.status,
      rate_limit_allowed: result.rate_limit_allowed,
      rate_limit_reset_at: new Date(result.rate_limit_reset_at * 1000),
      rate_limit_remaining: result.rate_limit_remaining
    });
    return true;
  } catch (error) {
    console.error('❌ Cloudinary connection failed:', error.message);
    return false;
  }
};

// Call test on module load
testCloudinaryConnection();

module.exports = cloudinary;
