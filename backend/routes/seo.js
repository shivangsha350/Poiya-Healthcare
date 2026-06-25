const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Seo = require('../models/Seo');
const { protect, admin } = require('../middleware/auth');

// Multer storage setup for OG share images
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
    cb(null, 'seo-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// @desc    Get all SEO page configurations
// @route   GET /api/seo
// @access  Public
router.get('/', async (req, res) => {
  try {
    const configs = await Seo.find();
    res.json({ success: true, seoConfigs: configs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get SEO config for a specific page name
// @route   GET /api/seo/:pageName
// @access  Public
router.get('/:pageName', async (req, res) => {
  try {
    const config = await Seo.findOne({ pageName: req.params.pageName });
    if (!config) {
      return res.status(404).json({ success: false, message: 'SEO config not found for this page' });
    }
    res.json({ success: true, seoConfig: config });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Create/Update SEO configuration (Upsert)
// @route   POST /api/seo
// @access  Private/Admin
router.post('/', protect, admin, upload.single('ogImage'), async (req, res) => {
  const { pageName, slug, metaTitle, metaDescription } = req.body;

  if (!pageName || !slug || !metaTitle || !metaDescription) {
    return res.status(400).json({ success: false, message: 'Page name, slug, meta title, and description are required' });
  }

  try {
    let seo = await Seo.findOne({ pageName });
    let ogImagePath = seo ? seo.ogImage : '';

    if (req.file) {
      // Delete old OG image if it exists
      if (seo && seo.ogImage) {
        const oldPath = path.join(__dirname, '..', seo.ogImage);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      ogImagePath = `/uploads/${req.file.filename}`;
    }

    if (seo) {
      // Update
      seo.slug = slug;
      seo.metaTitle = metaTitle;
      seo.metaDescription = metaDescription;
      seo.ogImage = ogImagePath;
      await seo.save();
    } else {
      // Create new
      seo = await Seo.create({
        pageName,
        slug,
        metaTitle,
        metaDescription,
        ogImage: ogImagePath,
      });
    }

    res.json({ success: true, seoConfig: seo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
