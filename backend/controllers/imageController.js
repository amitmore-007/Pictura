const cloudinary = require('../config/cloudinary');
const Image = require('../models/Image');
const Folder = require('../models/Folder');
const multer = require('multer');

const uploadImage = async (req, res) => {
  try {
    const { name, folderId, tags } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        message: 'No image file provided' 
      });
    }

    // Check Cloudinary configuration
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error('Cloudinary configuration missing');
      return res.status(500).json({
        success: false,
        message: 'Server configuration error: Cloudinary not configured'
      });
    }

    // Verify folder belongs to user if folderId is provided
    let folder = null;
    if (folderId && folderId !== 'root') {
      folder = await Folder.findOne({
        _id: folderId,
        user: req.user.id
      });

      if (!folder) {
        return res.status(404).json({ 
          success: false,
          message: 'Folder not found' 
        });
      }
    }

    // Upload to Cloudinary
    const uploadPromise = new Promise((resolve, reject) => {
      const folderPath = folder ? `dobbt/${req.user.id}/${folder.name}` : `dobbt/${req.user.id}/root`;
      
      cloudinary.uploader.upload_stream(
        {
          folder: folderPath,
          transformation: [
            { quality: 'auto' },
            { fetch_format: 'auto' }
          ]
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      ).end(req.file.buffer);
    });

    const cloudinaryResult = await uploadPromise;

    // Save image metadata to database
    const image = await Image.create({
      name: name || req.file.originalname,
      cloudinaryUrl: cloudinaryResult.secure_url,
      cloudinaryId: cloudinaryResult.public_id,
      folder: folderId && folderId !== 'root' ? folderId : null,
      user: req.user.id,
      size: cloudinaryResult.bytes,
      format: cloudinaryResult.format,
      tags: tags ? tags.split(',').map(tag => tag.trim()).filter(Boolean) : []
    });

    await image.populate('folder', 'name color');

    res.status(201).json({
      success: true,
      data: image,
      message: 'Image uploaded successfully'
    });
  } catch (error) {
    console.error('Upload error:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Server error during upload';
    if (error.message && error.message.includes('API key')) {
      errorMessage = 'Server configuration error: Invalid Cloudinary credentials';
    } else if (error.http_code === 401) {
      errorMessage = 'Server configuration error: Cloudinary authentication failed';
    }
    
    res.status(500).json({ 
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const getImages = async (req, res) => {
  try {
    const { folderId, search, page = 1, limit = 20 } = req.query;
    
    let query = { user: req.user.id };
    
    if (folderId) {
      if (folderId === 'root') {
        query.folder = null; // Images in root (no folder)
      } else {
        // Verify folder belongs to user
        const folder = await Folder.findOne({
          _id: folderId,
          user: req.user.id
        });

        if (!folder) {
          return res.status(404).json({ 
            success: false,
            message: 'Folder not found',
            data: []
          });
        }

        query.folder = folderId;
      }
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const images = await Image.find(query)
      .populate('folder', 'name color')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean(); // Use lean() for better performance

    const total = await Image.countDocuments(query);

    // Ensure all images have required properties
    const sanitizedImages = images.map(image => ({
      ...image,
      name: image.name || 'Untitled Image',
      tags: Array.isArray(image.tags) ? image.tags : [],
      size: image.size || 0,
      format: image.format || 'unknown'
    }));

    res.json({
      success: true,
      data: sanitizedImages,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('Get images error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message,
      data: [] // Return empty array on error
    });
  }
};

const getImageById = async (req, res) => {
  try {
    const image = await Image.findOne({
      _id: req.params.id,
      user: req.user.id
    }).populate('folder', 'name path color');

    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    res.json({
      success: true,
      image
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateImage = async (req, res) => {
  try {
    const { name, tags } = req.body;
    
    const image = await Image.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    if (name) image.name = name;
    if (tags) image.tags = tags.split(',').map(tag => tag.trim());

    await image.save();
    await image.populate('folder', 'name path color');

    res.json({
      success: true,
      image
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteImage = async (req, res) => {
  try {
    const image = await Image.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(image.cloudinaryId);

    // Delete from database
    await Image.findByIdAndDelete(image._id);

    res.json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const searchImages = async (req, res) => {
  try {
    const { q, page = 1, limit = 20 } = req.query;
    
    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const query = {
      user: req.user.id,
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ]
    };

    const images = await Image.find(query)
      .populate('folder', 'name path color')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Image.countDocuments(query);

    res.json({
      success: true,
      images,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
      query: q
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  uploadImage,
  getImages,
  getImageById,
  updateImage,
  deleteImage,
  searchImages
};
