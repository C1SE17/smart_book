// Nhập Express
const express = require('express');
// Tạo router
const router = express.Router();
// Nhập UserController
const UserController = require('../controllers/UserController');

// Tuyến đăng ký người dùng
router.post('/register', UserController.register);
// Tuyến đăng nhập người dùng
router.post('/login', UserController.login);

// Xuất router
module.exports = router;