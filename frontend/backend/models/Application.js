const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add candidate name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please add candidate email'],
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    phone: {
      type: String,
      required: [true, 'Please add candidate phone number'],
      trim: true,
    },
    location: {
      type: String,
      trim: true,
      default: '',
    },
    experience: {
      type: String,
      trim: true,
      default: '',
    },
    appliedPosition: {
      type: String,
      required: [true, 'Please specify the applied position'],
      trim: true,
    },
    resumeUrl: {
      type: String,
      required: [true, 'Please add candidate resume URL'],
    },
    coverLetter: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['Pending', 'Reviewed', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Application', ApplicationSchema);
