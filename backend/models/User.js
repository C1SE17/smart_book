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
            callback(err, results[0]);
        });
    }
}

// Xuất class User
module.exports = User;