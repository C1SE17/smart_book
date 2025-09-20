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
// Tuyến cập nhật thông tin người dùng
router.put('/update', auth, UserController.updateUser); // Chỉ sửa bản thân
// Tuyến lấy thông tin người dùng
router.get('/users/:user_id', auth, UserController.getUser); // User lấy bản thân, admin lấy bất kỳ
// Tuyến lấy toàn bộ người dùng (chỉ admin)
router.get('/users', auth, adminOnly, UserController.getAllUsers); // Chỉ admin
// Tuyến xóa người dùng
router.delete('/users/:user_id', auth, adminOnly, UserController.deleteUser); // Chỉ admin
// Tuyến đăng xuất
router.post('/logout', auth, UserController.logout); // Yêu cầu auth

// Xuất router
module.exports = router;