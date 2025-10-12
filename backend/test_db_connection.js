const mysql = require('mysql2');

// Cấu hình kết nối cơ sở dữ liệu
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'smart_book',
    port: 3300
};

console.log('🔧 [Database] Cấu hình database:', dbConfig);

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
        process.exit(1);
    }
    console.log('✅ [Database] Kết nối MySQL thành công!');
    
    // Test query
    db.query('SELECT * FROM categories LIMIT 1', (err, results) => {
        if (err) {
            console.error('❌ [Database] Query thất bại:', err);
        } else {
            console.log('✅ [Database] Query thành công:', results);
        }
        db.end();
    });
});
