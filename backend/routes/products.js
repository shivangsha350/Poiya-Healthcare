const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');
const { protect, admin } = require('../middleware/auth');

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
    const prefix = file.fieldname === 'brochure' ? 'pdf-' : 'product-';
    cb(null, prefix + uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter (images & PDFs)
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'brochure') {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Brochure must be a PDF file!'), false);
    }
  } else if (file.fieldname === 'thumbnail' || file.fieldname === 'gallery') {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Thumbnail and gallery files must be images!'), false);
    }
  } else {
    cb(null, true);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

const uploadFields = upload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'gallery', maxCount: 10 },
  { name: 'brochure', maxCount: 1 },
]);

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

const safeJsonParse = (str, fallback = []) => {
  try {
    return str ? JSON.parse(str) : fallback;
  } catch (e) {
    return fallback;
  }
};

// @desc    Get all products (with pagination, search & category filter)
// @route   GET /api/products
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {};

    // Apply filters
    if (req.query.search) {
      query.name = { $regex: req.query.search, $options: 'i' };
    }

    if (req.query.category && req.query.category !== 'all') {
      query.category = req.query.category;
    }

    if (req.query.subcategory && req.query.subcategory !== 'all') {
      query.subcategory = req.query.subcategory;
    }

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .populate('subcategory', 'name slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get a single product (by ID or Slug) with related products
// @route   GET /api/products/:idOrSlug
// @access  Public
router.get('/:idOrSlug', async (req, res) => {
  try {
    const isObjectId = mongoose.Types.ObjectId.isValid(req.params.idOrSlug);
    let product;

    if (isObjectId) {
      product = await Product.findById(req.params.idOrSlug).populate('category', 'name slug').populate('subcategory', 'name slug');
    } else {
      product = await Product.findOne({ slug: req.params.idOrSlug }).populate('category', 'name slug').populate('subcategory', 'name slug');
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Fetch related products in the same category
    const relatedProducts = await Product.find({
      category: product.category?._id,
      _id: { $ne: product._id },
    }).limit(4);

    res.json({ success: true, product, relatedProducts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
router.post('/', protect, admin, uploadFields, async (req, res) => {
  try {
    const { name, description, price, category, subcategory, stock, shortDescription, videoUrl, metaTitle, metaDescription } = req.body;

    if (!name || !description || !category) {
      return res.status(400).json({ success: false, message: 'Required fields are missing' });
    }

    // Verify category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ success: false, message: 'Invalid category selection' });
    }

    if (subcategory) {
      const subcategoryExists = await Category.findById(subcategory);
      if (!subcategoryExists) {
        return res.status(400).json({ success: false, message: 'Invalid subcategory selection' });
      }
    }

    const calculatedSlug = req.body.slug ? slugify(req.body.slug) : slugify(name);
    const slugExists = await Product.findOne({ slug: calculatedSlug });
    if (slugExists) {
      return res.status(400).json({ success: false, message: 'Product slug already exists, please choose a unique name' });
    }

    let thumbnailPath = '/uploads/default-product.png';
    if (req.files && req.files['thumbnail']) {
      thumbnailPath = `/uploads/${req.files['thumbnail'][0].filename}`;
    }

    let brochurePath = '';
    if (req.files && req.files['brochure']) {
      brochurePath = `/uploads/${req.files['brochure'][0].filename}`;
    }

    let galleryPaths = [];
    if (req.files && req.files['gallery']) {
      galleryPaths = req.files['gallery'].map(file => `/uploads/${file.filename}`);
    }

    // Parse array-based specifications and features
    const specifications = safeJsonParse(req.body.specifications);
    const keyFeatures = safeJsonParse(req.body.keyFeatures);

    const product = await Product.create({
      name,
      slug: calculatedSlug,
      category,
      subcategory: subcategory || null,
      thumbnail: thumbnailPath,
      image: thumbnailPath, // alias
      gallery: galleryPaths,
      shortDescription: shortDescription || '',
      description,
      keyFeatures,
      brochureUrl: brochurePath,
      videoUrl: videoUrl || '',
      specifications,
      price: parseFloat(price) || 0,
      stock: parseInt(stock) || 0,
      metaTitle: metaTitle || '',
      metaDescription: metaDescription || '',
    });

    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
router.put('/:id', protect, admin, uploadFields, async (req, res) => {
  try {
    const { name, description, price, category, subcategory, stock, shortDescription, videoUrl, metaTitle, metaDescription } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(400).json({ success: false, message: 'Invalid category selection' });
      }
      product.category = category;
    }

    if (subcategory !== undefined) {
      if (subcategory) {
        const subcategoryExists = await Category.findById(subcategory);
        if (!subcategoryExists) {
          return res.status(400).json({ success: false, message: 'Invalid subcategory selection' });
        }
        product.subcategory = subcategory;
      } else {
        product.subcategory = null;
      }
    }

    if (name && name !== product.name) {
      product.name = name;
    }

    if (req.body.slug) {
      const calculatedSlug = slugify(req.body.slug);
      if (calculatedSlug !== product.slug) {
        const slugExists = await Product.findOne({ slug: calculatedSlug });
        if (slugExists) {
          return res.status(400).json({ success: false, message: 'Product slug already exists' });
        }
        product.slug = calculatedSlug;
      }
    } else if (name) {
      product.slug = slugify(name);
    }

    product.description = description !== undefined ? description : product.description;
    product.shortDescription = shortDescription !== undefined ? shortDescription : product.shortDescription;
    product.videoUrl = videoUrl !== undefined ? videoUrl : product.videoUrl;
    product.metaTitle = metaTitle !== undefined ? metaTitle : product.metaTitle;
    product.metaDescription = metaDescription !== undefined ? metaDescription : product.metaDescription;

    if (price !== undefined) product.price = parseFloat(price) || 0;
    if (stock !== undefined) product.stock = parseInt(stock) || 0;

    // Handle single thumbnail image file upload
    if (req.files && req.files['thumbnail']) {
      if (product.thumbnail && product.thumbnail !== '/uploads/default-product.png') {
        const oldPath = path.join(__dirname, '..', product.thumbnail);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      const newThumbnail = `/uploads/${req.files['thumbnail'][0].filename}`;
      product.thumbnail = newThumbnail;
      product.image = newThumbnail; // sync alias
    }

    // Handle brochure PDF file upload
    if (req.files && req.files['brochure']) {
      if (product.brochureUrl) {
        const oldPath = path.join(__dirname, '..', product.brochureUrl);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      product.brochureUrl = `/uploads/${req.files['brochure'][0].filename}`;
    }

    // Handle adding files to gallery
    if (req.files && req.files['gallery']) {
      const newGalleryPaths = req.files['gallery'].map(file => `/uploads/${file.filename}`);
      product.gallery = [...product.gallery, ...newGalleryPaths];
    }

    // Allow deleting specific gallery images by passing left-over list
    if (req.body.existingGallery) {
      const remainingGallery = safeJsonParse(req.body.existingGallery);
      
      // Delete removed images from disk
      product.gallery.forEach(img => {
        if (!remainingGallery.includes(img)) {
          const imgPath = path.join(__dirname, '..', img);
          if (fs.existsSync(imgPath)) {
            fs.unlinkSync(imgPath);
          }
        }
      });

      product.gallery = remainingGallery;
    }

    // Parse array-based specifications and features
    if (req.body.specifications) {
      product.specifications = safeJsonParse(req.body.specifications);
    }
    if (req.body.keyFeatures) {
      product.keyFeatures = safeJsonParse(req.body.keyFeatures);
    }

    const updatedProduct = await product.save();
    const populatedProduct = await Product.findById(updatedProduct._id).populate('category', 'name');

    res.json({ success: true, product: populatedProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Delete thumbnail image file from disk
    if (product.thumbnail && product.thumbnail !== '/uploads/default-product.png') {
      const imagePath = path.join(__dirname, '..', product.thumbnail);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Delete brochure PDF from disk
    if (product.brochureUrl) {
      const brochurePath = path.join(__dirname, '..', product.brochureUrl);
      if (fs.existsSync(brochurePath)) {
        fs.unlinkSync(brochurePath);
      }
    }

    // Delete gallery images from disk
    if (product.gallery && product.gallery.length > 0) {
      product.gallery.forEach(img => {
        const imgPath = path.join(__dirname, '..', img);
        if (fs.existsSync(imgPath)) {
          fs.unlinkSync(imgPath);
        }
      });
    }

    await product.deleteOne();
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
