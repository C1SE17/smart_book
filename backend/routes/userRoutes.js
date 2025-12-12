// Nhập Express
const express = require('express');
// Tạo router
const router = express.Router();
// Nhập UserController
const UserController = require('../controllers/UserController');
// Nhập middleware phân quyền
const { auth, adminOnly, userOnly } = require('../middleware/auth');

// Tuyến đăng ký người dùng
router.post('/register', UserController.register);
// Tuyến đăng nhập người dùng
router.post('/login', UserController.login);
// Tuyến quên mật khẩu
router.post('/forgot-password', UserController.requestPasswordReset);
router.post('/verify-reset-code', UserController.verifyResetCode);
router.post('/reset-password', UserController.resetPassword);
// Tuyến cập nhật thông tin người dùng
router.put('/update', auth, UserController.updateUser); // Chỉ sửa bản thân
// Tuyến đổi mật khẩu
router.put('/change-password', auth, UserController.changePassword); // Yêu cầu đăng nhập
// Tuyến lấy toàn bộ người dùng (chỉ admin)
router.get('/', auth, adminOnly, UserController.getAllUsers); // Chỉ admin
// Tuyến lấy tổng số người dùng cho dashboard (chỉ admin) - PHẢI ĐẶT TRƯỚC /:user_id
router.get('/count', auth, adminOnly, UserController.getTotalUsersCount); // Chỉ admin
// Tuyến lấy thông tin người dùng
router.get('/:user_id', auth, UserController.getUser); // User lấy bản thân, admin lấy bất kỳ
// Tuyến xóa người dùng
router.delete('/:user_id', auth, adminOnly, UserController.deleteUser); // Chỉ admin
// Tuyến đăng xuất
router.post('/logout', auth, UserController.logout); // Yêu cầu auth


console.log("Check UserController:", UserController);
console.log("Check Auth:", auth);
// Xuất router
module.exports = router;