const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Media = require('../models/Media');
const { protect, admin } = require('../middleware/auth');

// Multer storage setup for Media Manager
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'media-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, WEBP, GIF images and PDF brochures are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// @desc    Get all media assets (with search and type filter)
// @route   GET /api/media
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
  try {
    const query = {};

    if (req.query.search) {
      query.filename = { $regex: req.query.search, $options: 'i' };
    }

    if (req.query.fileType && req.query.fileType !== 'all') {
      query.fileType = req.query.fileType;
    }

    const mediaList = await Media.find(query).sort({ createdAt: -1 });
    res.json({ success: true, media: mediaList });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Upload new files to media
// @route   POST /api/media
// @access  Private/Admin
router.post('/', protect, admin, upload.array('files', 10), async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ success: false, message: 'Please select one or more files to upload' });
  }

  try {
    const promises = req.files.map(file => {
      const fileType = file.mimetype === 'application/pdf' ? 'pdf' : 'image';
      return Media.create({
        filename: file.originalname,
        url: `/uploads/${file.filename}`,
        fileType,
        size: file.size,
      });
    });

    const mediaRecords = await Promise.all(promises);
    res.status(201).json({ success: true, message: 'Files uploaded successfully', media: mediaRecords });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Delete media asset
// @route   DELETE /api/media/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) {
      return res.status(404).json({ success: false, message: 'Media record not found' });
    }

    // Delete local file from uploads
    const filePath = path.join(__dirname, '..', media.url);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await media.deleteOne();
    res.json({ success: true, message: 'Media asset deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
