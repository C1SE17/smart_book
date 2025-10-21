const mysql = require('mysql2');

console.log('🗄️ [Database] Đang khởi tạo kết nối MySQL...');

// Cấu hình kết nối cơ sở dữ liệu
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '123456',
    database: process.env.DB_NAME || 'smart_book',
    port: process.env.DB_PORT || 3300
};

console.log('🔧 [Database] Cấu hình database:', {
    host: dbConfig.host,
    user: dbConfig.user,
    database: dbConfig.database,
    port: dbConfig.port
});

const db = mysql.createConnection(dbConfig);

// Kiểm tra kết nối cơ sở dữ liệu
db.connect((err) => {
    if (err) {
        console.error('❌ [Database] Kết nối MySQL thất bại:', {
            message: err.message,
            code: err.code,
            errno: err.errno,
            sqlState: err.sqlState
        });
        console.error('🔧 [Database] Cấu hình đã sử dụng:', dbConfig);
        process.exit(1); // Thoát nếu kết nối thất bại
    }
    console.log('✅ [Database] Kết nối MySQL thành công!');
    console.log('📊 [Database] Database:', dbConfig.database);
    console.log('🏠 [Database] Host:', dbConfig.host + ':' + dbConfig.port);
});

// Xử lý lỗi kết nối
db.on('error', (err) => {
    console.error('💥 [Database] Database connection error:', {
        message: err.message,
        code: err.code,
        errno: err.errno,
        sqlState: err.sqlState
    });

    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.log('🔄 [Database] Database connection lost, attempting to reconnect...');
        db.connect();
    } else {
        throw err;
    }
});

module.exports = db;