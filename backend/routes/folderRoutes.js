const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const {
  createFolder,
  getFolders,
  getFolderById,
  updateFolder,
  deleteFolder,
} = require('../controllers/folderController');

// Validation middleware
const folderValidation = [
  body('name').trim().notEmpty().withMessage('Folder name is required'),
  body('name')
    .isLength({ max: 100 })
    .withMessage('Folder name must be less than 100 characters'),
  body('color')
    .optional()
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .withMessage('Color must be a valid hex color'),
];

// All routes are protected
router.use(auth);

// @route   POST /api/folders
// @desc    Create a new folder
// @access  Private
router.post('/', folderValidation, createFolder);

// @route   GET /api/folders
// @desc    Get all folders for user
// @access  Private
router.get('/', getFolders);

// @route   GET /api/folders/:id
// @desc    Get folder by ID
// @access  Private
router.get('/:id', getFolderById);

// @route   PUT /api/folders/:id
// @desc    Update folder
// @access  Private
router.put('/:id', folderValidation, updateFolder);

// @route   DELETE /api/folders/:id
// @desc    Delete folder
// @access  Private
router.delete('/:id', deleteFolder);

module.exports = router;
