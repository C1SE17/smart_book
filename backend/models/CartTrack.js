const mongoose = require('mongoose');

// Schema theo dõi hành vi giỏ hàng
const cartTrackSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: false
  },

  sessionId: {
    type: String,
    required: true
  },

  productId: {
    type: String,
    required: true
  },

  productName: {
    type: String,
    required: true
  },

  // Loại hành động với giỏ hàng: thêm/xóa/cập nhật
  action: {
    type: String,
    enum: ['add', 'remove', 'update'],
    required: true
  },

  // Số lượng sản phẩm
  quantity: {
    type: Number,
    required: true
  },

  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CartTrack', cartTrackSchema);