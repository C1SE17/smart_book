const express = require('express');
const AnalyticsController = require('../controllers/AnalyticsController');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, adminOnly, AnalyticsController.getDashboard);
router.post('/logs', auth, adminOnly, AnalyticsController.createLog);
router.get('/logs', auth, adminOnly, AnalyticsController.getLogs);

module.exports = router;

