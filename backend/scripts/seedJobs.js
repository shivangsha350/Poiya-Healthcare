const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Job = require('../models/Job');

dotenv.config({ path: path.join(__dirname, '../.env') });

const jobsData = [
  {
    title: 'Sales Executive – Medical Equipment',
    department: 'Sales',
    location: 'Delhi / Mumbai / Bengaluru',
    type: 'Full-Time',
    experience: '2–5 years',
    description: 'We are looking for a result-driven Sales Executive to seek new business opportunities and sell diagnostic equipment (X-Ray systems, C-Arms) to hospitals and clinics.',
    requirements: [
      'Proven work experience as a Sales Executive or similar role in medical devices',
      'Knowledge of radiology medical equipment is a strong plus',
      'Strong communication, negotiation, and interpersonal skills',
      'Willingness to travel locally and regionally'
    ],
    status: 'Open'
  },
  {
    title: 'Service Engineer – X-Ray Systems',
    department: 'Service',
    location: 'Pan India',
    type: 'Full-Time',
    experience: '1–3 years',
    description: 'Responsible for installing, maintaining, calibrating, and repairing diagnostic x-ray equipment at client installations (hospitals and healthcare centers).',
    requirements: [
      'Diploma/Degree in Biomedical Engineering, Electronics, or related fields',
      'Hands-on experience installing or repairing medical imaging devices',
      'Basic electrical and troubleshooting skills',
      'Customer-oriented mindset'
    ],
    status: 'Open'
  },
  {
    title: 'Regional Sales Manager',
    department: 'Sales',
    location: 'Hyderabad',
    type: 'Full-Time',
    experience: '5–10 years',
    description: 'Lead sales teams, manage regional dealer networks, and coordinate institution purchases through government portals (GeM) in South India.',
    requirements: [
      'MBA or equivalent in Sales/Biomedical',
      '5+ years experience in radiography/imaging equipment sales leadership',
      'Established connections with hospital boards and procurement keys'
    ],
    status: 'Open'
  },
  {
    title: 'Software Developer – Radiology AI',
    department: 'Technology',
    location: 'New Delhi (On-site)',
    type: 'Full-Time',
    experience: '2–4 years',
    description: 'Develop and refine clinical lung screening and TB analysis computer vision software integrations for high frequency radiography systems.',
    requirements: [
      'Strong Python programming skills and experience with PyTorch/TensorFlow',
      'Familiarity with DICOM clinical data models and PACS integrations',
      'Experience building React web clients and FastAPI endpoints'
    ],
    status: 'Open'
  }
];

const seedJobs = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/medivision');
    console.log('Connected to MongoDB for seeding jobs.');

    // Clear existing jobs
    await Job.deleteMany();
    console.log('Cleared existing jobs.');

    // Seed jobs
    const jobs = await Job.create(jobsData);
    console.log(`Successfully seeded ${jobs.length} job openings!`);
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding jobs: ${error.message}`);
    process.exit(1);
  }
};

seedJobs();
