const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, admin } = require('../middleware/auth');

// @desc    Get all users (with search filter)
// @route   GET /api/users
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
  try {
    const query = { role: 'user' }; // Fetch customers/standard users only (protect admin accounts)

    if (req.query.search) {
      const searchRegex = { $regex: req.query.search, $options: 'i' };
      query.$or = [
        { name: searchRegex },
        { email: searchRegex },
      ];
    }

    const users = await User.find(query).sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Block or Unblock user
// @route   PUT /api/users/:id/status
// @access  Private/Admin
router.put('/:id/status', protect, admin, async (req, res) => {
  const { status } = req.body;

  if (!status || !['active', 'blocked'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status value' });
  }

  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Do not block admin accounts
    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Administrator accounts cannot be blocked' });
    }

    user.status = status;
    const updatedUser = await user.save();

    res.json({ success: true, user: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Prevent deletion of administrators
    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Administrator accounts cannot be deleted' });
    }

    await user.deleteOne();
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
