/**
 * Routes Index
 * Centralized route registration
 */
const express = require('express');
const router = express.Router();

// Import all route modules
const bookRoutes = require('./bookRoutes');

// Register routes
router.use('/books', bookRoutes);

module.exports = router;

