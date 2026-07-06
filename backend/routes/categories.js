const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Category = require('../models/Category');
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/auth');

// Multer storage setup for category images
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
    cb(null, 'category-' + uniqueSuffix + path.extname(file.originalname));
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

// Helper for slug generation
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ order: 1, name: 1 }).populate('parent', 'name slug');
    res.json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Reorder categories
// @route   PUT /api/categories/reorder
// @access  Private/Admin
router.put('/reorder', protect, admin, async (req, res) => {
  const { categoryIds } = req.body;

  if (!categoryIds || !Array.isArray(categoryIds)) {
    return res.status(400).json({ success: false, message: 'Invalid category IDs list' });
  }

  try {
    const promises = categoryIds.map((id, index) =>
      Category.findByIdAndUpdate(id, { order: index })
    );
    await Promise.all(promises);
    res.json({ success: true, message: 'Categories order updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Create category
// @route   POST /api/categories
// @access  Private/Admin
router.post('/', protect, admin, upload.single('image'), async (req, res) => {
  const { name, description, status, order, parent } = req.body;

  if (!name) {
    return res.status(400).json({ success: false, message: 'Category name is required' });
  }

  try {
    // Check if category name exists under same parent
    const categoryExists = await Category.findOne({ name, parent: parent || null });
    if (categoryExists) {
      return res.status(400).json({ success: false, message: 'Category name already exists under this parent' });
    }

    const calculatedSlug = req.body.slug ? slugify(req.body.slug) : slugify(name);
    
    // Check slug uniqueness under same parent
    const slugExists = await Category.findOne({ slug: calculatedSlug, parent: parent || null });
    if (slugExists) {
      return res.status(400).json({ success: false, message: 'Category slug already exists under this parent, please choose a unique name' });
    }

    let imagePath = '';
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    }

    const category = await Category.create({
      name,
      slug: calculatedSlug,
      image: imagePath,
      description,
      status: status || 'Active',
      order: parseInt(order) || 0,
      parent: parent || null,
    });

    const populatedCategory = await Category.findById(category._id).populate('parent', 'name slug');

    res.status(201).json({ success: true, category: populatedCategory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
router.put('/:id', protect, admin, upload.single('image'), async (req, res) => {
  const { name, description, status, order, parent } = req.body;

  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    if (name && name !== category.name) {
      const categoryExists = await Category.findOne({ name, parent: parent !== undefined ? (parent || null) : category.parent });
      if (categoryExists) {
        return res.status(400).json({ success: false, message: 'Category name already exists under this parent' });
      }
      category.name = name;
    }

    if (req.body.slug) {
      const calculatedSlug = slugify(req.body.slug);
      if (calculatedSlug !== category.slug) {
        const slugExists = await Category.findOne({ slug: calculatedSlug, parent: parent !== undefined ? (parent || null) : category.parent });
        if (slugExists) {
          return res.status(400).json({ success: false, message: 'Category slug already exists under this parent' });
        }
        category.slug = calculatedSlug;
      }
    } else if (name) {
      category.slug = slugify(name);
    }

    category.description = description !== undefined ? description : category.description;
    category.status = status || category.status;
    category.order = order !== undefined ? parseInt(order) : category.order;
    
    if (parent !== undefined) {
      // Prevent setting self as parent
      if (parent && parent.toString() === category._id.toString()) {
        return res.status(400).json({ success: false, message: 'A category cannot be its own parent' });
      }
      category.parent = parent || null;
    }

    if (req.file) {
      // Delete old image file if it exists
      if (category.image) {
        const oldPath = path.join(__dirname, '..', category.image);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      category.image = `/uploads/${req.file.filename}`;
    }

    const updatedCategory = await category.save();
    const populatedCategory = await Category.findById(updatedCategory._id).populate('parent', 'name slug');
    res.json({ success: true, category: populatedCategory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    // Check if category has active subcategories
    const subcategoryCount = await Category.countDocuments({ parent: req.params.id });
    if (subcategoryCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category: ${subcategoryCount} subcategory(ies) are currently assigned under it.`,
      });
    }

    // Check if category is used in products (either as main category or subcategory)
    const productCount = await Product.countDocuments({
      $or: [{ category: req.params.id }, { subcategory: req.params.id }]
    });
    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category: ${productCount} product(s) are currently assigned to it.`,
      });
    }

    // Delete image file if exists
    if (category.image) {
      const imagePath = path.join(__dirname, '..', category.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await category.deleteOne();
    res.json({ success: true, message: 'Category removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
