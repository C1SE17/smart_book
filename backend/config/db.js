const mysql = require('mysql2');
const dotenv = require('dotenv');

// Cấu hình kết nối MySQL dành cho toàn bộ backend
dotenv.config();

console.log('Đang khởi tạo kết nối MySQL...');

// Cấu hình kết nối cơ sở dữ liệu
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS !== undefined ? process.env.DB_PASS : 'trung123',
    database: process.env.DB_NAME || 'smart_book',
    port: Number(process.env.DB_PORT) || 3306
};

console.log('Cấu hình database:', {
    host: dbConfig.host,
    user: dbConfig.user,
    database: dbConfig.database,
    port: dbConfig.port
});

const db = mysql.createConnection(dbConfig);

// Kiểm tra kết nối cơ sở dữ liệu
db.connect((err) => {
    if (err) {
        console.error('[Database] Kết nối MySQL thất bại:', {
            message: err.message,
            code: err.code,
            errno: err.errno,
            sqlState: err.sqlState
        });
        console.error('[Database] Cấu hình đã sử dụng:', dbConfig);
        process.exit(1); // Thoát nếu kết nối thất bại
    }
    console.log('Kết nối MySQL thành công!');
    console.log('Database:', dbConfig.database);
    console.log('Host:', dbConfig.host + ':' + dbConfig.port);
});

// Xử lý lỗi kết nối
db.on('error', (err) => {
    console.error('[Database] Database connection error:', {
        message: err.message,
        code: err.code,
        errno: err.errno,
        sqlState: err.sqlState
    });

    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.log('Database connection lost, attempting to reconnect...');
        db.connect();
    } else {
        throw err;
    }
});

module.exports = db;