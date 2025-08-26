const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Image name is required'],
    trim: true,
    maxlength: [200, 'Image name cannot exceed 200 characters'],
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
    required: false, // Allow images without folders (in root)
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  format: {
    type: String,
    required: true,
  },
  tags: [{
    type: String,
    trim: true,
  }],
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Index for faster queries
ImageSchema.index({ user: 1, folder: 1 });
ImageSchema.index({ user: 1, name: 'text', tags: 'text' });

module.exports = mongoose.model('Image', ImageSchema);
