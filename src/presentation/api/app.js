/**
 * Express Application Setup
 * Presentation layer - API entry point
 */
const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize database connections
require('../../infrastructure/config/database');

// Import routes
const apiRoutes = require('./routes');

// Initialize Express app
const app = express();
const port = process.env.PORT || 5000;

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[API] ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'API is running',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    architecture: 'Clean Architecture',
  });
});

// API routes
app.use('/api', apiRoutes);

// Serve AI assets
app.use(
  '/assets/ai',
  express.static(path.resolve(__dirname, '../../../ai'), {
    maxAge: '1d',
    setHeaders: (res) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
    },
  })
);

// Error handling middleware
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// Start server
if (require.main === module) {
  app.listen(port, () => {
    console.log('----------------------------------------');
    console.log(`[Server] Running on port: ${port}`);
    console.log(`[Server] API Base URL: http://localhost:${port}/api`);
    console.log(`[Server] Health check: http://localhost:${port}/api/health`);
    console.log(' Architecture: Clean Architecture');
    console.log('----------------------------------------');
  });
}

module.exports = app;

