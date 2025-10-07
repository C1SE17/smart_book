// Nhập model User
const User = require('../models/User');
// Nhập bcrypt để so sánh mật khẩu
const bcrypt = require('bcrypt');
// Nhập jsonwebtoken để tạo token
const jwt = require('jsonwebtoken');
// Nhập hàm addToBlacklist từ middleware
const { addToBlacklist } = require('../middleware/auth');

class UserController {
    // Đăng ký người dùng
    static register(req, res) {
        console.log('req.body:', req.body);
        if (!req.body) {
            return res.status(400).json({ error: 'Body yêu cầu không hợp lệ' });
        }
        const { name, email, password, phone, address, role = 'customer' } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Thiếu tên, email hoặc mật khẩu' });
        }
        User.findByEmail(email, (err, existingUser) => {
            if (err) return res.status(500).json({ error: 'Lỗi cơ sở dữ liệu' });
            if (existingUser) return res.status(400).json({ error: 'Email đã tồn tại' });
            User.create({ name, email, password, phone, address, role }, (err, result) => {
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

    // Đăng nhập người dùng
    static login(req, res) {
        console.log('req.body:', req.body);
        if (!req.body) {
            return res.status(400).json({ error: 'Body yêu cầu không hợp lệ' });
        }
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Thiếu email hoặc mật khẩu' });
        }
        User.findByEmail(email, (err, user) => {
            if (err) return res.status(500).json({ error: 'Lỗi cơ sở dữ liệu' });
            if (!user) return res.status(401).json({ error: 'Email không tồn tại' });
            bcrypt.compare(password, user.password_hash, (err, match) => {
                if (err) return res.status(500).json({ error: 'Lỗi xác thực' });
                if (!match) return res.status(401).json({ error: 'Mật khẩu không đúng' });
                const token = jwt.sign({ userId: user.user_id, role: user.role }, process.env.JWT_SECRET, {
                    expiresIn: '1h'
                });
                res.json({ 
                    token, 
                    user: {
                        user_id: user.user_id,
                        name: user.name,
                        email: user.email,
                        phone: user.phone,
                        address: user.address,
                        role: user.role
                    },
                    message: 'Đăng nhập thành công' 
                });
            });
        });
    }

    // Cập nhật thông tin người dùng
    static updateUser(req, res) {
        console.log('req.body:', req.body);
        if (!req.body) {
            return res.status(400).json({ error: 'Body yêu cầu không hợp lệ' });
        }
        const { user_id, name, phone, address } = req.body;
        const userIdFromToken = req.user.userId;
        if (!userIdFromToken || (!name && !phone && !address)) {
            return res.status(400).json({ error: 'Thiếu thông tin cần cập nhật' });
        }
        // Chỉ cho phép sửa bản thân
        if (user_id && userIdFromToken != user_id) {
            return res.status(403).json({ error: 'Không đủ quyền để sửa thông tin người khác' });
        }
        User.update(userIdFromToken, { name, phone, address }, (err, result) => {
            if (err) return res.status(500).json({ error: 'Lỗi cập nhật người dùng' });
            if (result.affectedRows === 0) return res.status(404).json({ error: 'Người dùng không tồn tại' });
            res.json({ message: 'Cập nhật thông tin thành công' });
        });
    }

    // Lấy thông tin người dùng
    static getUser(req, res) {
        const userId = req.params.user_id;
        if (!userId) {
            return res.status(400).json({ error: 'Thiếu user_id' });
        }
        // User chỉ lấy bản thân, admin lấy bất kỳ
        const targetUserId = req.user.role === 'admin' ? userId : req.user.userId;
        User.getById(targetUserId, (err, user) => {
            if (err) return res.status(500).json({ error: 'Lỗi truy vấn cơ sở dữ liệu' });
            if (!user) return res.status(404).json({ error: 'Người dùng không tồn tại' });
            res.json(user);
        });
    }

    // Lấy toàn bộ người dùng (chỉ admin)
    static getAllUsers(req, res) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    User.getAllPaged(page, limit, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Lỗi truy vấn cơ sở dữ liệu' });
        }
        res.json({
            users: result.users,
            total: result.total,
            page,
            limit,
            totalPages: Math.ceil(result.total / limit)
            });
        });
    }

    // Xóa người dùng
    static deleteUser(req, res) {
        const userId = req.params.user_id;
        if (!userId) {
            return res.status(400).json({ error: 'Thiếu user_id' });
        }
        User.delete(userId, (err, result) => {
            if (err) return res.status(500).json({ error: 'Lỗi xóa người dùng' });
            if (result.affectedRows === 0) return res.status(404).json({ error: 'Người dùng không tồn tại' });
            res.json({ message: 'Xóa người dùng thành công' });
        });
    }

    // Đăng xuất
    static logout(req, res) {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(400).json({ error: 'Thiếu token' });
        }
        const token = authHeader.split(' ')[1];
        addToBlacklist(token); // Thêm token vào blacklist
        res.json({ message: 'Đăng xuất thành công, vui lòng xóa token khỏi client' });
    }
}

// Xuất class UserController
module.exports = UserController;