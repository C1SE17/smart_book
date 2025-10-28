const express = require('express');
const router = express.Router();
const TrackingController = require('../controllers/TrackingController');

// Cho phép tracking không yêu cầu đăng nhập (dựa vào sessionId)
router.post('/search', (req, res) => TrackingController.trackSearch(req, res));
router.post('/product-view', (req, res) => TrackingController.trackProductView(req, res));
router.post('/cart', (req, res) => TrackingController.trackCartAction(req, res));

module.exports = router;