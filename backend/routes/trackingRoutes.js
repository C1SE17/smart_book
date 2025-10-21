const express = require('express');
const router = express.Router();
const TrackingController = require('../controllers/TrackingController');
const { auth } = require('../middleware/auth'); // middleware xác thực JWT

// API ghi nhận tìm kiếm
router.post('/search', auth, (req, res) => TrackingController.trackSearch(req, res));

// API ghi nhận xem sản phẩm
router.post('/product-view', auth, (req, res) => TrackingController.trackProductView(req, res));

// API ghi nhận giỏ hàng
router.post('/cart', auth, (req, res) => TrackingController.trackCartAction(req, res));

module.exports = router;