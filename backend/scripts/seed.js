const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Message = require('../models/Message');
const Settings = require('../models/Settings');
const Seo = require('../models/Seo');

// Load env variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const categoriesData = [
  {
    name: 'Handheld Portable X-Ray Solutions',
    slug: 'handheld-portable-x-ray-solutions',
    description: 'Advanced portable x-ray imaging devices for flexible clinical diagnostics.',
    status: 'Active',
    order: 0,
    image: '/uploads/default-product.png',
  },
  {
    name: 'Mobile X-Ray Solutions',
    slug: 'mobile-x-ray-solutions',
    description: 'High-performance mobile radiography systems offering versatility and bedside power.',
    status: 'Active',
    order: 1,
    image: '/uploads/default-product.png',
  },
  {
    name: 'Digital Radiography Solutions',
    slug: 'digital-radiography-solutions',
    description: 'State-of-the-art flat panel detectors and complete DR imaging retrofits.',
    status: 'Active',
    order: 2,
    image: '/uploads/default-product.png',
  },
  {
    name: 'Surgical C-Arms',
    slug: 'surgical-c-arms',
    description: 'Precision fluoroscopic surgical C-Arms guiding minimally invasive procedures.',
    status: 'Active',
    order: 3,
    image: '/uploads/default-product.png',
  },
];

const messagesData = [
  {
    name: 'Dr. Ramesh Patel',
    email: 'ramesh.patel@apollo.com',
    phone: '+91 98765 43210',
    product: 'ERAY SMART 5HS',
    subject: 'Inquiry on ERAY SMART 5HS',
    message: 'We are looking to purchase 3 units of ERAY SMART 5HS handheld portable X-Ray systems for our home healthcare services team. Please provide a formal quotation and details regarding domestic warranty and technical support in Mumbai.',
    isRead: false,
    isContacted: false,
  },
  {
    name: 'Sarah Connor',
    email: 'sarah.c@gmail.com',
    phone: '+1 (555) 321-9988',
    product: 'Carestream DRX-Revolution',
    subject: 'Carestream DRX-Revolution bulk quotation',
    message: 'Hello, our community hospital in California is expanding. We are interested in getting a quotation for 2 units of the Carestream DRX-Revolution Mobile X-Ray. What is the shipping time to the US?',
    isRead: true,
    isContacted: true,
  },
  {
    name: 'Dr. John Watson',
    email: 'watson.clinic@yahoo.com',
    phone: '+44 20 7946 0958',
    product: 'ERAY SMART 3HS',
    subject: 'AED & X-Ray annual calibrations',
    message: 'Do you offer annual calibration and safety certificates for the ERAY SMART 3HS portable units? We bought 2 units last year and they are due for review.',
    isRead: false,
    isContacted: false,
  },
];


const seoData = [
  { pageName: 'Home', slug: '/', metaTitle: 'MediVision Healthcare | Advanced Medical Equipment & Imaging', metaDescription: 'Official distributor of Carestream Health and ERAY SMART portable X-Ray units in India. High quality diagnostic imaging systems and surgical C-arms.' },
  { pageName: 'About', slug: '/about', metaTitle: 'About Us | MediVision Healthcare Group', metaDescription: 'Providing medical imaging products, pan-India maintenance services, and institutional procurement on GeM marketplace.' },
  { pageName: 'Products', slug: '/products', metaTitle: 'Medical Equipment Catalog | MediVision Radiography', metaDescription: 'Browse handheld X-rays, mobile digital radiography scanners, flat panel detectors, and surgical fluoroscopic C-arms.' },
  { pageName: 'Blogs', slug: '/blogs', metaTitle: 'Knowledge Hub & Insights | MediVision Healthcare', metaDescription: 'Expert radiology articles, industry tech updates, and medical imaging guides.' },
  { pageName: 'Contact', slug: '/contact', metaTitle: 'Contact Our Radiology Experts | MediVision India', metaDescription: 'Speak with our technicians, request a customized C-Arm or portable X-Ray quotation, or request on-site servicing support.' },
  { pageName: 'Career', slug: '/career', metaTitle: 'Join Our Team | Medical Imaging Careers', metaDescription: 'Grow your career as a medical equipment service engineer, sales lead, or service manager at MediVision.' },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/medivision');
    console.log('Connected to MongoDB for seeding.');

    // Clear collections
    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();
    await Message.deleteMany();
    await Settings.deleteMany();
    await Seo.deleteMany();

    console.log('Cleared existing database collections.');

    // Create Admin User
    await User.create({
      name: 'MediVision Administrator',
      email: 'admin@medivision.com',
      password: 'AdminPassword123',
      role: 'admin',
      status: 'active',
    });
    console.log('Admin account created: admin@medivision.com / AdminPassword123');

    // Seed Categories
    const categories = await Category.create(categoriesData);
    console.log(`Seeded ${categories.length} product categories.`);

    // Seed Products
    const productsData = [
      {
        name: 'ERAY SMART 5HS',
        slug: 'eray-smart-5hs',
        description: 'High-frequency smart handheld portable X-Ray solution. Perfect for dental diagnostics, limb radiography, and point-of-care screening. Equipped with a lead double-shielding system to completely isolate the operator from radiation leakage.',
        shortDescription: 'Dental & limb handheld portable x-ray generator with double shield safety.',
        price: 3499.00,
        category: categories[0]._id, // Handheld
        thumbnail: '/uploads/default-product.png',
        image: '/uploads/default-product.png',
        gallery: [],
        keyFeatures: [
          'High frequency generator (60 kV / 2 mA)',
          'Double radiation shielding backscatter protection',
          'Lightweight at just 1.8 kg for easy single-hand operation',
          'Rechargeable battery (up to 300 scans per charge)',
        ],
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        brochureUrl: '',
        specifications: [
          { name: 'kV Range', value: '60 kV', order: 0 },
          { name: 'mA Range', value: '2 mA', order: 1 },
          { name: 'Weight', value: '1.8 Kg', order: 2 },
          { name: 'Battery', value: '950 mAh', order: 3 },
          { name: 'Warranty', value: '2 Years', order: 4 },
        ],
        stock: 12,
        metaTitle: 'ERAY SMART 5HS Handheld Portable Dental & Limb X-Ray',
        metaDescription: 'Buy ERAY SMART 5HS handheld portable X-ray unit. 60kV, 2mA, double-lead shielded for operator protection during point-of-care radiography.',
      },
      {
        name: 'ERAY SMART 3HS',
        slug: 'eray-smart-3hs',
        description: 'Compact ultralight portable medical X-Ray generator. Designed specifically for field hospitals, disaster relief camps, and mobile veterinary clinics. Operates on a highly collimated beam.',
        shortDescription: 'Ultralight portable medical x-ray solution for field clinics.',
        price: 2899.00,
        category: categories[0]._id, // Handheld
        thumbnail: '/uploads/default-product.png',
        image: '/uploads/default-product.png',
        gallery: [],
        keyFeatures: [
          'kV Range adjustable (50-70 kV)',
          'Highly collimated micro-beam',
          'Rechargeable lithium battery pack',
          'Includes heavy-duty carrying case',
        ],
        videoUrl: '',
        brochureUrl: '',
        specifications: [
          { name: 'kV Range', value: '50-70 kV', order: 0 },
          { name: 'mA Range', value: '1.5 mA', order: 1 },
          { name: 'Weight', value: '2.1 Kg', order: 2 },
          { name: 'Warranty', value: '1 Year', order: 3 },
        ],
        stock: 8,
        metaTitle: 'ERAY SMART 3HS Ultralight Field X-Ray Generator',
        metaDescription: 'Shop ERAY SMART 3HS ultralight portable field X-ray system. Rechargeable battery, 50-70kV adjustability, suitable for veterinary and disaster clinics.',
      },
      {
        name: 'ERAY SMART 6HS',
        slug: 'eray-smart-6hs',
        description: 'Ultimate power smart handheld point-of-care medical radiography system. Features continuous power output, HD screen selection, and direct digital radiography WiFi integration.',
        shortDescription: 'Smart point-of-care handheld X-ray with DR panel WiFi sync.',
        price: 4200.00,
        category: categories[0]._id, // Handheld
        thumbnail: '/uploads/default-product.png',
        image: '/uploads/default-product.png',
        gallery: [],
        keyFeatures: [
          'High output (70 kV / 3 mA)',
          'Color touch TFT clinical control display',
          'WIFI sync with flat panel detectors',
          'Ergonomic dual grip design',
        ],
        videoUrl: '',
        brochureUrl: '',
        specifications: [
          { name: 'kV Range', value: '70 kV', order: 0 },
          { name: 'mA Range', value: '3 mA', order: 1 },
          { name: 'Weight', value: '2.4 Kg', order: 2 },
          { name: 'Battery', value: '1450 mAh', order: 3 },
        ],
        stock: 5,
        metaTitle: 'ERAY SMART 6HS Smart Handheld Point-Of-Care X-Ray',
        metaDescription: 'Experience high-power bedside imaging with ERAY SMART 6HS. 70kV, color touch TFT controller, WiFi flat panel sync for immediate digital radiology.',
      },
      {
        name: 'Carestream DRX-Revolution',
        slug: 'carestream-drx-revolution',
        description: 'High-power motorized mobile X-ray system. The first mobile system with a collapsible column for safe navigation in hospital corridors. High clinical image details equivalent to static radiography systems.',
        shortDescription: 'Premium motorized mobile DR radiography with collapsible column.',
        price: 19500.00,
        category: categories[1]._id, // Mobile X-Ray
        thumbnail: '/uploads/default-product.png',
        image: '/uploads/default-product.png',
        gallery: [],
        keyFeatures: [
          'Motorized drive with collapsible column',
          'Dual touchscreen controls for bedside edits',
          'Compatible with DRX-1 detector wireless links',
          'Secure lockable storage drawers',
        ],
        videoUrl: '',
        brochureUrl: '',
        specifications: [
          { name: 'Output power', value: '32 kW', order: 0 },
          { name: 'Weight', value: '480 Kg', order: 1 },
          { name: 'Tube Rotation', value: '270 degrees', order: 2 },
        ],
        stock: 3,
        metaTitle: 'Carestream DRX-Revolution Motorized Bedside DR System',
        metaDescription: 'MediVision distributes Carestream DRX-Revolution Mobile X-ray. Collapsible column, dual touchscreens, wireless DR digital radiography detector compatible.',
      },
      {
        name: 'Zen-7000 Surgical C-Arm',
        slug: 'zen-7000-surgical-c-arm',
        description: 'High-resolution fluoroscopic imaging system for surgical guidance. Equipped with active cooling systems, rotating anode tubes, and low-dose pulsed fluoroscopy controls.',
        shortDescription: 'High resolution fluoroscopy surgical C-Arm system.',
        price: 25000.00,
        category: categories[3]._id, // C-Arms
        thumbnail: '/uploads/default-product.png',
        image: '/uploads/default-product.png',
        gallery: [],
        keyFeatures: [
          'Rotating anode tube with active thermal cooling',
          'High resolution 9-inch image intensifier',
          'Pulsed fluoroscopy modes for dosage control',
          'Dual LCD surgical viewing screens',
        ],
        videoUrl: '',
        brochureUrl: '',
        specifications: [
          { name: 'Generator power', value: '15 kW', order: 0 },
          { name: 'kV Range', value: '40-120 kV', order: 1 },
          { name: 'C-Arm Depth', value: '700 mm', order: 2 },
        ],
        stock: 2,
        metaTitle: 'Zen-7000 Surgical C-Arm Fluoroscopic Imaging System',
        metaDescription: 'Order Zen-7000 surgical C-arm fluoroscopy system. 15kW, low-dose pulsed fluoroscopy, rotating anode, dual display cart for operating rooms.',
      },
    ];

    const products = await Product.create(productsData);
    console.log(`Seeded ${products.length} products.`);

    // Seed Messages
    await Message.create(messagesData);
    console.log('Seeded customer contact inquiries.');


    // Seed SEO static page settings
    await Seo.create(seoData);
    console.log('Seeded static pages SEO meta configurations.');

    // Seed Settings
    await Settings.create({
      websiteName: 'MediVision Healthcare',
      contactEmail: 'info@medivision.com',
      contactPhone: '+1 (555) 019-2834',
      logo: '/uploads/default-product.png',
      address: '123 Health Ave, Suite 100, Medical City',
      socialLinks: {
        facebook: 'https://facebook.com/medivision',
        twitter: 'https://twitter.com/medivision',
        linkedin: 'https://linkedin.com/company/medivision',
        instagram: 'https://instagram.com/medivision',
      },
    });
    console.log('Seeded default website settings.');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

seedDB();
