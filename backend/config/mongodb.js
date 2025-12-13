const mongoose = require('mongoose');

// Lấy MongoDB URI từ biến môi trường hoặc dùng mặc định
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/customer_tracking';

// Kiểm tra nếu đã kết nối rồi thì không kết nối lại
if (mongoose.connection.readyState === 0) {
  // Kết nối tới MongoDB
  mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).catch((err) => {
    console.error('[MongoDB] Lỗi kết nối ban đầu:', err.message);
  });
}

const db = mongoose.connection;

db.on('error', (error) => {
  console.error('[MongoDB] Lỗi kết nối:', error.message);
  console.error('[MongoDB] Error details:', error);
});

db.on('connected', () => {
  console.log('[MongoDB] Đã kết nối thành công tới MongoDB');
  console.log('[MongoDB] Database:', db.name);
  console.log('[MongoDB] Host:', db.host);
  console.log('[MongoDB] Port:', db.port);
});

db.on('disconnected', () => {
  console.warn('[MongoDB] Đã ngắt kết nối MongoDB');
});

db.once('open', () => {
  console.log('[MongoDB] Connection opened successfully');
});

// Xử lý khi ứng dụng tắt
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('[MongoDB] Kết nối MongoDB đã đóng do ứng dụng tắt');
  process.exit(0);
});

module.exports = mongoose;