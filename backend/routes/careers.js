const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Application = require('../models/Application');

// Multer storage setup
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
    cb(null, 'resume-' + uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter (Only PDFs allowed)
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Resume must be a PDF file!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// @desc    Submit a job application
// @route   POST /api/careers/apply
// @access  Public
router.post('/apply', upload.single('resume'), async (req, res) => {
  try {
    const { name, email, phone, location, experience, appliedPosition, coverLetter } = req.body;

    if (!name || !email || !phone || !appliedPosition) {
      // If a file was uploaded, remove it since validation failed
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ success: false, message: 'Name, email, phone, and applied position are required' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload your resume (PDF)' });
    }

    const resumeUrl = `/uploads/${req.file.filename}`;

    const application = await Application.create({
      name,
      email,
      phone,
      location: location || '',
      experience: experience || '',
      appliedPosition,
      resumeUrl,
      coverLetter: coverLetter || '',
      status: 'Pending',
    });

    res.status(201).json({ success: true, application });
  } catch (error) {
    // If a file was uploaded, remove it since processing failed
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (err) {
        console.error('Error deleting file:', err);
      }
    }
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
