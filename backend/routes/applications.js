const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const Application = require('../models/Application');
const { protect, admin } = require('../middleware/auth');

// Protect all routes
router.use(protect);
router.use(admin);

// @desc    Get all applications (with search & status filter)
// @route   GET /api/admin/applications
// @access  Private/Admin
router.get('/', async (req, res) => {
  try {
    const { search, status } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { appliedPosition: { $regex: search, $options: 'i' } },
      ];
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    const applications = await Application.find(query).sort({ createdAt: -1 });
    res.json({ success: true, applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get single application
// @route   GET /api/admin/applications/:id
// @access  Private/Admin
router.get('/:id', async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    res.json({ success: true, application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update application status
// @route   PATCH /api/admin/applications/:id/status
// @access  Private/Admin
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['Pending', 'Reviewed', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected'];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid or missing status' });
    }

    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    application.status = status;
    await application.save();

    res.json({ success: true, application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Delete job application
// @route   DELETE /api/admin/applications/:id
// @access  Private/Admin
router.delete('/:id', async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    // Delete uploaded resume from disk
    if (application.resumeUrl) {
      const resumePath = path.join(__dirname, '..', application.resumeUrl);
      if (fs.existsSync(resumePath)) {
        try {
          fs.unlinkSync(resumePath);
        } catch (err) {
          console.error('Error deleting resume file:', err);
        }
      }
    }

    await application.deleteOne();
    res.json({ success: true, message: 'Application deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
