// Nhập model User
   const User = require('../models/User');
   // Nhập bcrypt để so sánh mật khẩu
   const bcrypt = require('bcrypt');
   // Nhập jsonwebtoken để tạo token
   const jwt = require('jsonwebtoken');

   class UserController {
       // Đăng ký người dùng, kiểm tra email và lưu vào cơ sở dữ liệu
       static register(req, res) {
           // Kiểm tra xem req.body có tồn tại không
           if (!req.body) {
               return res.status(400).json({ error: 'Body yêu cầu không hợp lệ' });
           }
           const { name, email, password, phone, address } = req.body;
           // Kiểm tra các trường bắt buộc
           if (!name || !email || !password) {
               return res.status(400).json({ error: 'Thiếu tên, email hoặc mật khẩu' });
           }
           // Kiểm tra email tồn tại
           User.findByEmail(email, (err, existingUser) => {
               if (err) return res.status(500).json({ error: 'Lỗi cơ sở dữ liệu' });
               if (existingUser) return res.status(400).json({ error: 'Email đã tồn tại' });
               // Tạo người dùng
               User.create({ name, email, password, phone, address }, (err, result) => {
                   if (err) {
                       if (err.message === 'Email phải là @gmail.com') {
                           return res.status(400).json({ error: err.message });
                       }
                       return res.status(500).json({ error: 'Lỗi tạo người dùng' });
                   }
                   res.status(201).json({ message: 'Đăng ký thành công' });
               });
           });
       }

       // Đăng nhập, xác thực email và mật khẩu, trả về token JWT
       static login(req, res) {
           // Kiểm tra xem req.body có tồn tại không
           if (!req.body) {
               return res.status(400).json({ error: 'Body yêu cầu không hợp lệ' });
           }
           const { email, password } = req.body;
           // Kiểm tra các trường bắt buộc
           if (!email || !password) {
               return res.status(400).json({ error: 'Thiếu email hoặc mật khẩu' });
           }
           // Tìm người dùng
           User.findByEmail(email, (err, user) => {
               if (err) return res.status(500).json({ error: 'Lỗi cơ sở dữ liệu' });
               if (!user) return res.status(401).json({ error: 'Email không tồn tại' });
               // So sánh mật khẩu
               bcrypt.compare(password, user.password_hash, (err, match) => {
                   if (err) return res.status(500).json({ error: 'Lỗi xác thực' });
                   if (!match) return res.status(401).json({ error: 'Mật khẩu không đúng' });
                   // Tạo token JWT
                   const token = jwt.sign({ userId: user.user_id, role: user.role }, process.env.JWT_SECRET, {
                       expiresIn: '1h'
                   });
                   res.json({ token, message: 'Đăng nhập thành công' });
               });
           });
       }
   }

   // Xuất class UserController
   module.exports = UserController;