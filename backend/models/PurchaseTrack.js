const mongoose = require('../config/mongodb');

// Schema theo dõi hành vi mua hàng với số lượng lớn
const purchaseTrackSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: false
  },

  sessionId: {
    type: String,
    required: true
  },

  // ID sản phẩm được mua
  productId: {
    type: String,
    required: true
  },

  // Tên sản phẩm
  productName: {
    type: String,
    required: true
  },

  // Số lượng mua
  quantity: {
    type: Number,
    required: true
  },

  // ID đơn hàng
  orderId: {
    type: Number,
    required: false
  },

  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Index để tìm kiếm nhanh theo userId và productId
purchaseTrackSchema.index({ userId: 1, productId: 1, timestamp: -1 });
purchaseTrackSchema.index({ productId: 1, quantity: -1 });

module.exports = mongoose.model('PurchaseTrack', purchaseTrackSchema);

