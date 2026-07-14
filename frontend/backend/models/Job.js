const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a job title'],
      trim: true,
    },
    department: {
      type: String,
      required: [true, 'Please add a department'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Please add a location'],
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Please add a job type'],
      default: 'Full-Time',
    },
    experience: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    requirements: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['Open', 'Closed'],
      default: 'Open',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', JobSchema);
