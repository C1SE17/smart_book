/**
 * Routes Index
 * Centralized route registration
 */
const express = require('express');
const router = express.Router();

// Import all route modules
const bookRoutes = require('./bookRoutes');
const translationRoutes = require('./translationRoutes');

// Register routes
router.use('/books', bookRoutes);
router.use('/translation', translationRoutes);

module.exports = router;

