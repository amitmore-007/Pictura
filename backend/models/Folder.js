const mongoose = require('mongoose');

const FolderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Folder name is required'],
    trim: true,
    maxlength: [100, 'Folder name cannot exceed 100 characters'],
  },
  color: {
    type: String,
    default: '#3B82F6',
    match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Please enter a valid hex color'],
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Folder',
    default: null, // null means root folder
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Index for better query performance
FolderSchema.index({ user: 1, parent: 1 });
FolderSchema.index({ user: 1, name: 1, parent: 1 }, { unique: true });

// Virtual for getting the folder path
FolderSchema.virtual('path').get(function() {
  // This would need to be populated in queries if needed
  return this.name;
});

module.exports = mongoose.model('Folder', FolderSchema);
  