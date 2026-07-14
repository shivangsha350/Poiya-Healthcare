const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema(
  {
    websiteName: {
      type: String,
      default: 'Poiya Healthcare',
    },
    contactEmail: {
      type: String,
      default: 'poiyahealthcure99@gmail.com',
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
      facebook: { type: String, default: 'https://facebook.com/poiyahealthcare' },
      twitter: { type: String, default: 'https://twitter.com/poiyahealthcare' },
      linkedin: { type: String, default: 'https://linkedin.com/company/poiyahealthcare' },
      instagram: { type: String, default: 'https://instagram.com/poiyahealthcare' },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Settings', SettingsSchema);
