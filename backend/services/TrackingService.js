const SearchTrack = require('../models/SearchTrack');
const ProductTrack = require('../models/ProductTrack');
const CartTrack = require('../models/CartTrack');

class TrackingService {
    
  // Ghi log tìm kiếm
  static async logSearch(data) {
    try {
      const searchTrack = new SearchTrack(data);
      await searchTrack.save();
      console.log('✅ Đã lưu log tìm kiếm');
      return true;
    } catch (error) {
      console.error('❌ Lỗi lưu log tìm kiếm:', error);
      throw error;
    }
  }

  // Ghi log xem sản phẩm
  static async logProductView(data) {
    try {
      const productTrack = new ProductTrack(data);
      await productTrack.save();
      console.log('✅ Đã lưu log xem sản phẩm');
      return true;
    } catch (error) {
      console.error('❌ Lỗi lưu log xem sản phẩm:', error);
      throw error;
    }
  }

  // Ghi log giỏ hàng
  static async logCartAction(data) {
    try {
      const cartTrack = new CartTrack(data);
      await cartTrack.save();
      console.log('✅ Đã lưu log giỏ hàng');
      return true;
    } catch (error) {
      console.error('❌ Lỗi lưu log giỏ hàng:', error);
      throw error;
    }
  }
}

module.exports = TrackingService;