const express = require('express'); // Nhập thư viện Express để tạo route
const router = express.Router(); // Tạo router để định nghĩa các endpoint
const CartController = require('../controllers/CartController'); // Nhập controller giỏ hàng
const { auth, userOnly } = require('../middleware/auth'); // Nhập middleware xác thực và phân quyền

// Định nghĩa endpoint thêm sản phẩm vào giỏ hàng, yêu cầu xác thực và chỉ cho người dùng
router.post('/add', auth, userOnly, CartController.addToCart);

// Định nghĩa endpoint xóa sản phẩm khỏi giỏ hàng, yêu cầu xác thực và chỉ cho người dùng
router.delete('/remove/:cart_item_id', auth, userOnly, CartController.removeFromCart);

// Định nghĩa endpoint xem chi tiết giỏ hàng, yêu cầu xác thực và chỉ cho người dùng
router.get('/details', auth, userOnly, CartController.getCartDetails);

// Định nghĩa endpoint lấy danh sách sản phẩm trong giỏ hàng, yêu cầu xác thực và chỉ cho người dùng
router.get('/items', auth, userOnly, CartController.getCartDetails);

// Định nghĩa endpoint cập nhật số lượng sản phẩm trong giỏ hàng, yêu cầu xác thực và chỉ cho người dùng
router.put('/update/:cart_item_id', auth, userOnly, CartController.updateQuantity);

// Định nghĩa endpoint xóa toàn bộ giỏ hàng, yêu cầu xác thực và chỉ cho người dùng
router.delete('/clear', auth, userOnly, CartController.clearCart);

module.exports = router; // Xuất router để sử dụng trong index.js