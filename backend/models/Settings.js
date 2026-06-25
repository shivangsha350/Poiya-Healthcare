const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema(
  {
    websiteName: {
      type: String,
      default: 'MediVision Healthcare',
    },
    contactEmail: {
      type: String,
      default: 'info@medivision.com',
    },
    contactPhone: {
      type: String,
      default: '+1 (555) 019-2834',
    },
    logo: {
      type: String,
      default: '/logo.png',
    },
    address: {
      type: String,
      default: '123 Health Ave, Suite 100, Medical City',
    },
    socialLinks: {
      facebook: { type: String, default: 'https://facebook.com/medivision' },
      twitter: { type: String, default: 'https://twitter.com/medivision' },
      linkedin: { type: String, default: 'https://linkedin.com/company/medivision' },
      instagram: { type: String, default: 'https://instagram.com/medivision' },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Settings', SettingsSchema);
