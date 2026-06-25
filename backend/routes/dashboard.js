const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Product = require('../models/Product');
const Message = require('../models/Message');
const Application = require('../models/Application');
const { protect, admin } = require('../middleware/auth');

// @desc    Get dashboard metrics & combined recent activities
// @route   GET /api/dashboard/stats
// @access  Private/Admin
router.get('/stats', protect, admin, async (req, res) => {
  try {
    const [categoriesCount, productsCount, inquiriesCount, totalApps, newApps, shortlistedApps] = await Promise.all([
      Category.countDocuments(),
      Product.countDocuments(),
      Message.countDocuments(),
      Application.countDocuments(),
      Application.countDocuments({ status: 'Pending' }),
      Application.countDocuments({ status: 'Shortlisted' }),
    ]);

    // Fetch latest creations for activities mapping
    const [latestCategories, latestProducts, latestInquiries, latestApps] = await Promise.all([
      Category.find().sort({ createdAt: -1 }).limit(5),
      Product.find().sort({ createdAt: -1 }).limit(5),
      Message.find().sort({ createdAt: -1 }).limit(5),
      Application.find().sort({ createdAt: -1 }).limit(5),
    ]);

    const activities = [];

    // Map categories
    latestCategories.forEach(cat => {
      activities.push({
        type: 'category',
        title: 'New Category Created',
        description: `Category "${cat.name}" was added to catalog.`,
        time: cat.createdAt,
      });
    });

    // Map products
    latestProducts.forEach(prod => {
      activities.push({
        type: 'product',
        title: 'New Product Registered',
        description: `Product "${prod.name}" was added.`,
        time: prod.createdAt,
      });
    });

    // Map inquiries
    latestInquiries.forEach(inq => {
      activities.push({
        type: 'inquiry',
        title: 'Contact Inquiry Received',
        description: `Form submitted by ${inq.name} (${inq.email}).`,
        time: inq.createdAt,
      });
    });

    // Map applications
    latestApps.forEach(app => {
      activities.push({
        type: 'application',
        title: 'New Job Application',
        description: `${app.name} applied for "${app.appliedPosition}".`,
        time: app.createdAt,
      });
    });

    // Sort combined activities by date desc, slice top 8
    activities.sort((a, b) => new Date(b.time) - new Date(a.time));
    const recentActivities = activities.slice(0, 8);

    res.json({
      success: true,
      stats: {
        totalCategories: categoriesCount,
        totalProducts: productsCount,
        totalInquiries: inquiriesCount,
        totalApplications: totalApps,
        newApplications: newApps,
        shortlistedCandidates: shortlistedApps,
      },
      recentActivities,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
