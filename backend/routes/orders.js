const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/auth');

// @desc    Get all orders (with status and search filters)
// @route   GET /api/orders
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
  try {
    const query = {};

    // Filter by status
    if (req.query.status && req.query.status !== 'All') {
      query.status = req.query.status;
    }

    // Search by customer name, customer email, or Order ID
    if (req.query.search) {
      const searchRegex = { $regex: req.query.search, $options: 'i' };
      
      // Check if it looks like a valid MongoDB ObjectId to search by ID
      const isObjectId = /^[0-9a-fA-F]{24}$/.test(req.query.search);

      if (isObjectId) {
        query.$or = [
          { _id: req.query.search },
          { customerName: searchRegex },
          { customerEmail: searchRegex },
        ];
      } else {
        query.$or = [
          { customerName: searchRegex },
          { customerEmail: searchRegex },
        ];
      }
    }

    const orders = await Order.find(query)
      .populate('products.product')
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
router.put('/:id/status', protect, admin, async (req, res) => {
  const { status } = req.body;

  const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status value' });
  }

  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // If status is updated to Cancelled, we could restore stock, or if Pending -> Processing we can adjust stock.
    // Let's do a simple adjust: if status transitions from non-Cancelled to Cancelled, add stock back.
    if (status === 'Cancelled' && order.status !== 'Cancelled') {
      for (const item of order.products) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity },
        });
      }
    } else if (order.status === 'Cancelled' && status !== 'Cancelled') {
      // Transitioning out of Cancelled, subtract stock back
      for (const item of order.products) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.quantity },
        });
      }
    }

    order.status = status;
    const updatedOrder = await order.save();
    
    // Fetch populated order to return to frontend
    const populatedOrder = await Order.findById(updatedOrder._id).populate('products.product');

    res.json({ success: true, order: populatedOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
