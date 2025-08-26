const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Image name is required'],
    trim: true,
    maxlength: [200, 'Image name cannot be more than 200 characters'],
  },
  cloudinaryUrl: {
    type: String,
    required: [true, 'Cloudinary URL is required'],
  },
  cloudinaryId: {
    type: String,
    required: [true, 'Cloudinary ID is required'],
  },
  folder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Folder',
    default: null, // null means root folder
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  size: {
    type: Number,
    default: 0,
  },
  format: {
    type: String,
    default: 'jpg',
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Index for better query performance
imageSchema.index({ user: 1, folder: 1 });
imageSchema.index({ user: 1, tags: 1 });
imageSchema.index({ user: 1, name: 'text', tags: 'text' });

module.exports = mongoose.model('Image', imageSchema);
