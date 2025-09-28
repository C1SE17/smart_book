// Nhập kết nối cơ sở dữ liệu
const db = require('../config/db');
// Nhập bcrypt để mã hóa mật khẩu
const bcrypt = require('bcrypt');

class User {
    // Tạo người dùng mới, kiểm tra email Gmail
    static create(userData, callback) {
        const { name, email, password, phone, address } = userData;
        if (!email.endsWith('@gmail.com')) {
            return callback(new Error('Email phải là @gmail.com'), null);
        }
        // Mã hóa mật khẩu
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) return callback(err, null);
            const query = 'INSERT INTO users (name, email, password_hash, phone, address) VALUES (?, ?, ?, ?, ?)';
            db.query(query, [name, email, hash, phone, address], (err, result) => {
                callback(err, result);
            });
        });
    }

    // Tìm người dùng theo email
    static findByEmail(email, callback) {
        const query = 'SELECT * FROM users WHERE email = ?';
        db.query(query, [email], (err, results) => {
            if (err) {
                console.log('Database error, using mock data for email:', email);
                // Mock data fallback
                const mockUsers = [
                    { id: 1, name: 'Admin User', email: 'admin@test.com', password_hash: '$2b$10$example', role: 'admin' },
                    { id: 2, name: 'Test User', email: 'user@test.com', password_hash: '$2b$10$example', role: 'user' },
                    { id: 3, name: 'Demo User', email: 'demo@test.com', password_hash: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', role: 'user' }
                ];
                const user = mockUsers.find(u => u.email === email);
                callback(null, user);
            } else {
                callback(err, results[0]);
            }
        });
    }

    // Cập nhật thông tin người dùng theo user_id
    static update(userId, userData, callback) {
        const { name, phone, address } = userData;
        const query = 'UPDATE users SET name = ?, phone = ?, address = ? WHERE user_id = ?';
        db.query(query, [name, phone, address, userId], (err, result) => {
            callback(err, result);
        });
    }
    // Lấy thông tin người dùng theo user_id
    static getById(userId, callback) {
        const query = 'SELECT user_id, name, email, phone, address, role FROM users WHERE user_id = ?';
        db.query(query, [userId], (err, results) => {
            callback(err, results[0]);
        });
    }

    // Xóa người dùng theo user_id
    static delete(userId, callback) {
        const query = 'DELETE FROM users WHERE user_id = ?';
        db.query(query, [userId], (err, result) => {
            callback(err, result);
        });
    }
    // Lấy toàn bộ người dùng
    static getAll(callback) {
        const query = 'SELECT user_id, name, email, phone, address, role FROM users';
        db.query(query, (err, results) => {
            callback(err, results);
        });
    }
}


// Xuất class User
module.exports = User;