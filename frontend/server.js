const express = require('express');
const next = require('next');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./backend/config/db');

// Load environment variables
dotenv.config();

const port = process.env.PORT || 5000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// Connect to MongoDB Database
connectDB();

app.prepare().then(() => {
  const server = express();

  // Standard API Middlewares
  server.use(cors());
  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));

  // Serve static uploaded files under /uploads
  server.use('/uploads', express.static(path.join(__dirname, 'backend/uploads')));

  // Express API Endpoint Handlers
  server.use('/api/auth', require('./backend/routes/auth'));
  server.use('/api/categories', require('./backend/routes/categories'));
  server.use('/api/products', require('./backend/routes/products'));
  server.use('/api/orders', require('./backend/routes/orders'));
  server.use('/api/users', require('./backend/routes/users'));
  server.use('/api/messages', require('./backend/routes/messages'));
  server.use('/api/settings', require('./backend/routes/settings'));
  server.use('/api/careers', require('./backend/routes/careers'));
  server.use('/api/admin/applications', require('./backend/routes/applications'));
  server.use('/api/media', require('./backend/routes/media'));
  server.use('/api/seo', require('./backend/routes/seo'));
  server.use('/api/dashboard', require('./backend/routes/dashboard'));
  server.use('/api/jobs', require('./backend/routes/jobs'));

  // Fallback handler: Delegate all other page requests to Next.js engine
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Server ready on http://localhost:${port} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}).catch((err) => {
  console.error('Error preparing Next.js application:', err);
  process.exit(1);
});
