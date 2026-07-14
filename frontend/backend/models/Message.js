const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    phone: {
      type: String,
      default: '',
    },
    product: {
      type: String,
      default: '',
    },
    subject: {
      type: String,
      default: 'Inquiry',
    },
    message: {
      type: String,
      required: [true, 'Please add a message'],
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    isContacted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Message', MessageSchema);
