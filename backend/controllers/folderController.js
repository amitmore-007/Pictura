const Folder = require('../models/Folder');
const Image = require('../models/Image');
const { validationResult } = require('express-validator');

// @desc    Create a new folder
// @access  Private
const createFolder = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, color, parent } = req.body;

    // Check if folder with same name exists in same parent
    const existingFolder = await Folder.findOne({
      name,
      user: req.user.id,
      parent: parent || null
    });

    if (existingFolder) {
      return res.status(400).json({
        success: false,
        message: 'A folder with this name already exists in this location'
      });
    }

    const folder = new Folder({
      name,
      color: color || '#3B82F6',
      parent: parent || null,
      user: req.user.id
    });

    await folder.save();

    // Populate the parent folder information if it exists
    await folder.populate('parent', 'name color');

    // Add imageCount (initially 0 for new folders)
    const folderWithCount = {
      ...folder.toObject(),
      imageCount: 0
    };

    res.status(201).json({
      success: true,
      data: folderWithCount,
      message: 'Folder created successfully'
    });
  } catch (error) {
    console.error('Create folder error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating folder'
    });
  }
};

// @desc    Get all folders for user
// @access  Private
const getFolders = async (req, res) => {
  try {
    const { parent } = req.query;
    
    const query = {
      user: req.user.id,
      parent: parent || null
    };

    const folders = await Folder.find(query).sort({ createdAt: -1 });

    // Add imageCount for each folder
    const foldersWithCounts = await Promise.all(
      folders.map(async (folder) => {
        const imageCount = await require('../models/Image').countDocuments({
          folder: folder._id,
          user: req.user.id
        });
        
        return {
          ...folder.toObject(),
          imageCount: imageCount || 0
        };
      })
    );

    res.json({
      success: true,
      data: foldersWithCounts
    });
  } catch (error) {
    console.error('Get folders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching folders',
      data: [] // Return empty array on error
    });
  }
};

// @desc    Get folder by ID
// @access  Private
const getFolderById = async (req, res) => {
  try {
    const folder = await Folder.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!folder) {
      return res.status(404).json({
        success: false,
        message: 'Folder not found'
      });
    }

    res.json({
      success: true,
      data: folder
    });
  } catch (error) {
    console.error('Get folder error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching folder'
    });
  }
};

// @desc    Update folder
// @access  Private
const updateFolder = async (req, res) => {
  try {
    const { name, color } = req.body;

    const folder = await Folder.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { name, color },
      { new: true, runValidators: true }
    );

    if (!folder) {
      return res.status(404).json({
        success: false,
        message: 'Folder not found'
      });
    }

    res.json({
      success: true,
      data: folder,
      message: 'Folder updated successfully'
    });
  } catch (error) {
    console.error('Update folder error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating folder'
    });
  }
};

// @desc    Delete folder
// @access  Private
const deleteFolder = async (req, res) => {
  try {
    const folder = await Folder.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!folder) {
      return res.status(404).json({
        success: false,
        message: 'Folder not found'
      });
    }

    // Check if folder has subfolders or images
    const subfolders = await Folder.countDocuments({
      parent: folder._id,
      user: req.user.id,
    });

    const images = await Image.countDocuments({
      folder: folder._id,
      user: req.user.id,
    });

    if (subfolders > 0 || images > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete folder that contains subfolders or images',
      });
    }

    res.json({
      success: true,
      message: 'Folder deleted successfully',
    });
  } catch (error) {
    console.error('Delete folder error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting folder'
    });
  }
};

module.exports = {
  createFolder,
  getFolders,
  getFolderById,
  updateFolder,
  deleteFolder
};

