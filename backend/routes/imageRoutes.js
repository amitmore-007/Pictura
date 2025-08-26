const express = require('express');
const router = express.Router();
const multer = require('multer');
const auth = require('../middleware/auth');
const {
  uploadImage,
  getImages,
  getImageById,
  updateImage,
  deleteImage,
  searchImages,
} = require('../controllers/imageController');

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
});

// All routes are protected
router.use(auth);

// @route   POST /api/images/upload
// @desc    Upload an image
// @access  Private
router.post('/upload', upload.single('image'), uploadImage);

// @route   GET /api/images
// @desc    Get all images for user
// @access  Private
router.get('/', getImages);

// @route   GET /api/images/search
// @desc    Search images
// @access  Private
router.get('/search', searchImages);

// @route   GET /api/images/:id
// @desc    Get image by ID
// @access  Private
router.get('/:id', getImageById);

// @route   PUT /api/images/:id
// @desc    Update image
// @access  Private
router.put('/:id', updateImage);

// @route   DELETE /api/images/:id
// @desc    Delete image
// @access  Private
router.delete('/:id', deleteImage);

module.exports = router;
module.exports = router;
