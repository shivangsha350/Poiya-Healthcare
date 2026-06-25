const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { protect, admin } = require('../middleware/auth');

// @desc    Get all contact messages/inquiries
// @route   GET /api/messages
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Submit a new inquiry (Public contact form)
// @route   POST /api/messages
// @access  Public
router.post('/', async (req, res) => {
  const { name, email, phone, product, message, subject } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Name, email, and message are required' });
  }

  try {
    const inquiry = await Message.create({
      name,
      email,
      phone: phone || '',
      product: product || '',
      subject: subject || (product ? `Inquiry on ${product}` : 'General Inquiry'),
      message,
    });

    res.status(201).json({ success: true, message: 'Inquiry submitted successfully', inquiry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Mark message as read/unread (Backward compatibility)
// @route   PUT /api/messages/:id/read
// @access  Private/Admin
router.put('/:id/read', protect, admin, async (req, res) => {
  const { isRead } = req.body;

  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    message.isRead = isRead !== undefined ? isRead : true;
    message.isContacted = message.isRead; // Sync contacted status
    const updatedMessage = await message.save();

    res.json({ success: true, message: updatedMessage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Mark inquiry as Contacted/Pending
// @route   PUT /api/messages/:id/contacted
// @access  Private/Admin
router.put('/:id/contacted', protect, admin, async (req, res) => {
  const { isContacted } = req.body;

  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }

    message.isContacted = isContacted !== undefined ? isContacted : true;
    message.isRead = message.isContacted; // Sync read status
    const updatedMessage = await message.save();

    res.json({ success: true, message: updatedMessage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Delete message/inquiry
// @route   DELETE /api/messages/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    await message.deleteOne();
    res.json({ success: true, message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
