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
    static getAllPaged(page = 1, limit = 10, callback) {
    const offset = (page - 1) * limit;
    const query = 'SELECT * FROM users LIMIT ? OFFSET ?';
    db.query(query, [limit, offset], (err, results) => {
        if (err) return callback(err);
        // Đếm tổng số user để trả về cho client
        db.query('SELECT COUNT(*) AS total FROM users', (countErr, countRes) => {
            if (countErr) return callback(countErr);
            callback(null, { users: results, total: countRes[0].total });
            });
        });
    }
}


// Xuất class User
module.exports = User;