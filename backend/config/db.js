const mysql = require('mysql2');

// Cấu hình kết nối cơ sở dữ liệu
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || 'trung123',
    database: process.env.DB_NAME || 'smart_book',
    port: process.env.DB_PORT || 3300
});

// Kiểm tra kết nối cơ sở dữ liệu
db.connect((err) => {
    if (err) {
        console.error('Kết nối MySQL thất bại:', err.message);
        process.exit(1); // Thoát nếu kết nối thất bại
    }
    console.log('Kết nối MySQL thành công');
});

module.exports = db;