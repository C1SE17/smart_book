const mongoose = require('mongoose');

// Kết nối tới MongoDB
mongoose.connect('mongodb://localhost:27017/customer_tracking', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', (error) => {
  console.error('❌ Lỗi kết nối Mon goDB:', error);
});

db.once('open', () => {
  console.log('✅ Đã kết nối thành công tới MongoDB');
});

module.exports = mongoose;