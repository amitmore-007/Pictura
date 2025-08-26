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
    validate: {
      validator: function(v) {
        return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(v);
      },
      message: 'Color must be a valid hex color',
    },
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Folder',
    default: null,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  path: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Virtual for image count
FolderSchema.virtual('imageCount', {
  ref: 'Image',
  localField: '_id',
  foreignField: 'folder',
  count: true,
});

// Index for faster queries
FolderSchema.index({ user: 1, parent: 1 });
FolderSchema.index({ user: 1, name: 1, parent: 1 }, { unique: true });

// Pre-save middleware to generate path
FolderSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('name') || this.isModified('parent')) {
    try {
      let pathArray = [this.name];
      let currentParent = this.parent;
      
      while (currentParent) {
        const parentFolder = await this.constructor.findById(currentParent);
        if (parentFolder) {
          pathArray.unshift(parentFolder.name);
          currentParent = parentFolder.parent;
        } else {
          break;
        }
      }
      
      this.path = pathArray.join('/');
    } catch (error) {
      return next(error);
    }
  }
  next();
});

module.exports = mongoose.model('Folder', FolderSchema);
