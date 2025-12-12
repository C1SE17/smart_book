/**
 * Database Configuration
 * Centralized database connection management
 */
const mysql = require('mysql2');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

/**
 * MySQL Connection
 */
const mysqlConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'smart_book',
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

const mysqlPool = mysql.createPool(mysqlConfig);

mysqlPool.getConnection((err, connection) => {
  if (err) {
    console.error('[MySQL] Connection failed:', err.message);
    process.exit(1);
  }
  console.log('[MySQL] Connected successfully');
  connection.release();
});

mysqlPool.on('error', (err) => {
  console.error('[MySQL] Pool error:', err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.log('[MySQL] Attempting to reconnect...');
  } else {
    throw err;
  }
});

/**
 * MongoDB Connection
 * Sử dụng cùng một instance mongoose để tránh tạo nhiều kết nối
 * Nếu đã có kết nối từ backend/config/mongodb.js thì sử dụng lại
 */
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/customer_tracking';

// Chỉ kết nối nếu chưa có kết nối nào (readyState: 0 = disconnected)
if (mongoose.connection.readyState === 0) {
  mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).catch((err) => {
    console.error('[MongoDB] Lỗi kết nối ban đầu:', err.message);
  });
}

const mongoDb = mongoose.connection;

mongoDb.on('error', (error) => {
  console.error('[MongoDB] Connection error:', error);
});

mongoDb.on('connected', () => {
  console.log('[MongoDB] Connected successfully');
  console.log('[MongoDB] Database:', mongoDb.name);
});

mongoDb.once('open', () => {
  console.log('[MongoDB] Connection opened successfully');
});

module.exports = {
  mysql: mysqlPool.promise(),
  mongodb: mongoose,
  mysqlPool,
};

