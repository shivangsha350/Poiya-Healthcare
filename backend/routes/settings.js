const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const Settings = require('../models/Settings');
const User = require('../models/User');
const { protect, admin } = require('../middleware/auth');

// Multer storage setup for settings files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, 'site-logo-' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images allowed'), false);
    }
  },
});

// @desc    Get website settings
// @route   GET /api/settings
// @access  Public
router.get('/', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      // Create default settings if they do not exist
      settings = await Settings.create({});
    }
    res.json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update website settings
// @route   PUT /api/settings
// @access  Private/Admin
router.put('/', protect, admin, upload.single('logo'), async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
    }

    const { websiteName, contactEmail, contactPhone, address, facebook, twitter, linkedin, instagram } = req.body;

    settings.websiteName = websiteName || settings.websiteName;
    settings.contactEmail = contactEmail || settings.contactEmail;
    settings.contactPhone = contactPhone || settings.contactPhone;
    settings.address = address || settings.address;

    // Parse social links
    settings.socialLinks = {
      facebook: facebook !== undefined ? facebook : settings.socialLinks.facebook,
      twitter: twitter !== undefined ? twitter : settings.socialLinks.twitter,
      linkedin: linkedin !== undefined ? linkedin : settings.socialLinks.linkedin,
      instagram: instagram !== undefined ? instagram : settings.socialLinks.instagram,
    };

    if (req.file) {
      // Delete old logo file if it exists and is custom
      if (settings.logo && settings.logo.startsWith('/uploads/site-logo')) {
        const oldLogoPath = path.join(__dirname, '..', settings.logo);
        if (fs.existsSync(oldLogoPath)) {
          fs.unlinkSync(oldLogoPath);
        }
      }
      settings.logo = `/uploads/${req.file.filename}`;
    }

    const updatedSettings = await settings.save();
    res.json({ success: true, settings: updatedSettings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Change admin password
// @route   PUT /api/settings/password
// @access  Private/Admin
router.put('/password', protect, admin, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ success: false, message: 'Please provide current and new password' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ success: false, message: 'New password must be at least 6 characters long' });
  }

  try {
    const user = await User.findById(req.user.id).select('+password');

    // Verify current password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
