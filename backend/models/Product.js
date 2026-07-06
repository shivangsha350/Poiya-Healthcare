const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a product name'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Please add a product slug'],
      unique: true,
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Please select a category'],
    },
    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },
    thumbnail: {
      type: String,
      default: '/uploads/default-product.png',
    },
    image: {
      type: String,
      default: '/uploads/default-product.png',
    },
    gallery: {
      type: [String],
      default: [],
    },
    shortDescription: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    keyFeatures: {
      type: [String],
      default: [],
    },
    brochureUrl: {
      type: String,
      default: '',
    },
    videoUrl: {
      type: String,
      default: '',
    },
    specifications: [
      {
        name: { type: String, required: true },
        value: { type: String, required: true },
        order: { type: Number, default: 0 },
      }
    ],
    price: {
      type: Number,
      default: 0,
      min: [0, 'Price must be positive'],
    },
    stock: {
      type: Number,
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    metaTitle: {
      type: String,
      default: '',
    },
    metaDescription: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', ProductSchema);
