const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/OrderController');
const { auth, userOnly, adminOnly } = require('../middleware/auth');

// Route cho user
router.post('/purchase', auth, userOnly, OrderController.purchase); // Mua ngay
router.post('/checkout', auth, userOnly, OrderController.checkout); // Đặt từ giỏ hàng
router.get('/confirmation/:order_id', auth, userOnly, OrderController.getOrderConfirmation); // Lấy chi tiết để xác nhận
router.post('/confirmation/:order_id', auth, userOnly, OrderController.confirmOrder); // Xác nhận đơn

// Route cho admin
router.get('/pending', auth, adminOnly, OrderController.getPendingOrders); // Xem đơn cần giao
router.put('/update/:order_id', auth, adminOnly, OrderController.updateOrderStatus); // Cập nhật trạng thái

module.exports = router;