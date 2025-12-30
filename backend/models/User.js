// Nhập kết nối cơ sở dữ liệu
const db = require('../config/db');
// Nhập bcrypt để mã hóa mật khẩu
const bcrypt = require('bcrypt');

class User {
    // Tạo người dùng mới, kiểm tra email Gmail
    static create(userData, callback) {
        const { name, email, password, phone, address, role = 'customer' } = userData;
        
        // Normalize email thành lowercase để đảm bảo consistency
        const normalizedEmail = email.trim().toLowerCase();
        
        console.log('Bắt đầu tạo user:', { name, email: normalizedEmail, phone, address, role });
        
        if (!normalizedEmail.endsWith('@gmail.com') && !normalizedEmail.endsWith('@yahoo.com') &&!normalizedEmail.endsWith('@edu.vn')) {
            return callback(new Error('Email phải là @gmail.com, @yahoo.com hoặc @edu.vn'), null);
        }
        
        // Mã hóa mật khẩu
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                console.error('Lỗi mã hóa mật khẩu:', err);
                return callback(err, null);
            }
            
            console.log('Mật khẩu đã được mã hóa');
            
            const query = 'INSERT INTO users (name, email, password_hash, phone, address, role) VALUES (?, ?, ?, ?, ?, ?)';
            const values = [name, normalizedEmail, hash, phone, address, role];
            
            console.log('Thực hiện query:', query);
            console.log('Values:', values);
            
            db.query(query, values, (err, result) => {
                if (err) {
                    console.error('Lỗi database khi tạo user:', err);
                    // Xử lý lỗi cụ thể
                    if (err.code === 'ER_DUP_ENTRY') {
                        return callback(new Error('Email đã tồn tại'), null);
                    }
                    return callback(err, null);
                }
                
                // Kiểm tra result có insertId không
                if (!result || !result.insertId) {
                    console.error('Không thể lấy ID của user vừa tạo:', result);
                    return callback(new Error('Không thể tạo user. Vui lòng thử lại.'), null);
                }
                
                console.log('User đã được tạo thành công:', result);
                console.log('User ID:', result.insertId);
                
                // Lấy thông tin user vừa tạo từ database để đảm bảo chính xác
                User.getById(result.insertId, (getErr, createdUser) => {
                    if (getErr || !createdUser) {
                        console.error('Lỗi khi lấy thông tin user vừa tạo:', getErr);
                        // Vẫn trả về thông tin từ insertId nếu không lấy được từ DB
                        const newUser = {
                            user_id: result.insertId,
                            name: name,
                            email: normalizedEmail,
                            phone: phone || null,
                            address: address || null,
                            role: role
                        };
                        return callback(null, newUser);
                    }
                    
                    console.log('Thông tin user từ database:', createdUser);
                    callback(null, createdUser);
                });
            });
        });
    }

    // Tìm người dùng theo email
    static findByEmail(email, callback) {
        if (!email) {
            return callback(null, null);
        }

        const query = 'SELECT * FROM users WHERE LOWER(email) = ? LIMIT 1';
        db.query(query, [email.toLowerCase()], (err, results) => {
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
    static getAllPaged(page = 1, limit = 10, search = '', sortBy = 'created_at', sortOrder = 'DESC', callback) {
        const offset = (page - 1) * limit;
        
        // Build search conditions
        let searchConditions = [];
        let searchParams = [];
        
        if (search) {
            searchConditions.push(`(
                name LIKE ? OR 
                email LIKE ? OR 
                phone LIKE ? OR 
                address LIKE ?
            )`);
            const searchPattern = `%${search}%`;
            searchParams.push(searchPattern, searchPattern, searchPattern, searchPattern);
        }
        
        const whereClause = searchConditions.length > 0 ? `WHERE ${searchConditions.join(' AND ')}` : '';
        
        // Build sort clause
        const allowedSortFields = ['user_id', 'name', 'email', 'created_at', 'updated_at'];
        const allowedSortOrders = ['ASC', 'DESC'];
        
        const validSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'created_at';
        const validSortOrder = allowedSortOrders.includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'DESC';
        
        const orderClause = `ORDER BY ${validSortBy} ${validSortOrder}`;
        
        // Query for data
        const dataQuery = `
            SELECT user_id, name, email, phone, address, role, created_at, updated_at 
            FROM users 
            ${whereClause} 
            ${orderClause} 
            LIMIT ? OFFSET ?
        `;
        const dataParams = [...searchParams, limit, offset];
        
        // Query for count
        const countQuery = `SELECT COUNT(*) AS total FROM users ${whereClause}`;
        const countParams = searchParams;
        
        // Execute both queries
        db.query(dataQuery, dataParams, (err, results) => {
            if (err) return callback(err);
            
            db.query(countQuery, countParams, (countErr, countRes) => {
                if (countErr) return callback(countErr);
                
                const total = countRes[0].total;
                const totalPages = Math.ceil(total / limit);
                
                callback(null, { 
                    users: results, 
                    total: total,
                    pagination: {
                        currentPage: page,
                        totalPages: totalPages,
                        totalItems: total,
                        itemsPerPage: limit,
                        hasNextPage: page < totalPages,
                        hasPrevPage: page > 1
                    }
                });
            });
        });
    }
}


// Xuất class User
module.exports = User;