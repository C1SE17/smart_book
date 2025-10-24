// const mongoose = require('mongoose');

// // Schema theo dõi hành vi xem sản phẩm
// const productTrackSchema = new mongoose.Schema({
//   userId: {
//     type: String,
//     required: false
//   },

//   sessionId: {
//     type: String, 
//     required: true
//   },

//   // ID sản phẩm được xem
//   productId: {
//     type: String,
//     required: true
//   },

//   // Tên sản phẩm
//   productName: {
//     type: String,
//     required: true
//   },

//   // Thời gian xem sản phẩm (tính bằng giây)
//   viewDuration: {
//     type: Number,
//     required: true
//   },

//   timestamp: {
//     type: Date,
//     default: Date.now
//   }
// });

// module.exports = mongoose.model('ProductTrack', productTrackSchema);