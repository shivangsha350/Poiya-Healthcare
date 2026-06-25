const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const { protect, admin } = require('../middleware/auth');

// @desc    Get all open jobs
// @route   GET /api/jobs
// @access  Public
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find({ status: 'Open' }).sort({ createdAt: -1 });
    res.json({ success: true, jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get all jobs (including Closed) for Admin dashboard
// @route   GET /api/jobs/admin
// @access  Private/Admin
router.get('/admin', protect, admin, async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json({ success: true, jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Create a job opening
// @route   POST /api/jobs
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  const { title, department, location, type, experience, description, requirements, status } = req.body;

  if (!title || !department || !location) {
    return res.status(400).json({ success: false, message: 'Title, department, and location are required' });
  }

  try {
    const job = await Job.create({
      title,
      department,
      location,
      type: type || 'Full-Time',
      experience: experience || '',
      description: description || '',
      requirements: requirements || [],
      status: status || 'Open',
    });

    res.status(201).json({ success: true, job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update a job opening
// @route   PUT /api/jobs/:id
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  const { title, department, location, type, experience, description, requirements, status } = req.body;

  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job opening not found' });
    }

    job.title = title || job.title;
    job.department = department || job.department;
    job.location = location || job.location;
    job.type = type || job.type;
    job.experience = experience !== undefined ? experience : job.experience;
    job.description = description !== undefined ? description : job.description;
    job.requirements = requirements || job.requirements;
    job.status = status || job.status;

    const updatedJob = await job.save();
    res.json({ success: true, job: updatedJob });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Delete a job opening
// @route   DELETE /api/jobs/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job opening not found' });
    }

    await job.deleteOne();
    res.json({ success: true, message: 'Job opening deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
