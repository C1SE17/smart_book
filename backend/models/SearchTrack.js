// const mongoose = require('mongoose');

// // Schema theo dõi hành vi tìm kiếm
// const searchTrackSchema = new mongoose.Schema({
//   // ID người dùng (nếu đã đăng nhập)
//   userId: {
//     type: String,
//     required: false
//   },
  
//   // ID phiên làm việc (dùng để track user chưa đăng nhập)
//   sessionId: {
//     type: String,
//     required: true
//   },

//   // Từ khóa tìm kiếm
//   keyword: {
//     type: String,
//     required: true
//   },

//   // Thời gian tìm kiếm
//   timestamp: {
//     type: Date,
//     default: Date.now
//   }
// });

// module.exports = mongoose.model('SearchTrack', searchTrackSchema);