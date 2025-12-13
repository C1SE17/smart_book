const mongoose = require('../config/mongodb');
const SearchTrack = require('../models/SearchTrack');
const ProductTrack = require('../models/ProductTrack');
const CartTrack = require('../models/CartTrack');
const PurchaseTrack = require('../models/PurchaseTrack');

class TrackingService {
  // Kiểm tra kết nối MongoDB
  static checkConnection() {
    const db = mongoose.connection;
    if (db.readyState !== 1) {
      console.warn('[TrackingService] MongoDB chưa kết nối. ReadyState:', db.readyState);
      return false;
    }
    return true;
  }
    
  // Ghi log tìm kiếm
  static async logSearch(data) {
    try {
      // Kiểm tra kết nối
      if (!this.checkConnection()) {
        console.error('[TrackingService] Không thể lưu log tìm kiếm: MongoDB chưa kết nối');
        return false;
      }

      const searchTrack = new SearchTrack(data);
      const saved = await searchTrack.save();
      console.log('[TrackingService] Đã lưu log tìm kiếm:', saved._id);
      return true;
    } catch (error) {
      console.error('[TrackingService] Lỗi lưu log tìm kiếm:', error.message);
      console.error('[TrackingService] Error details:', error);
      throw error;
    }
  }

  // Ghi log xem sản phẩm
  static async logProductView(data) {
    try {
      console.log('[TrackingService] logProductView - Dữ liệu nhận được:', JSON.stringify(data));
      
      // Kiểm tra kết nối
      if (!this.checkConnection()) {
        console.error('[TrackingService] Không thể lưu log xem sản phẩm: MongoDB chưa kết nối');
        return false;
      }

      // Validate dữ liệu
      if (!data.sessionId) {
        console.error('[TrackingService] Thiếu sessionId trong dữ liệu');
        throw new Error('sessionId is required');
      }
      if (!data.productId) {
        console.error('[TrackingService] Thiếu productId trong dữ liệu');
        throw new Error('productId is required');
      }
      if (!data.productName) {
        console.error('[TrackingService] Thiếu productName trong dữ liệu');
        throw new Error('productName is required');
      }
      if (typeof data.viewDuration !== 'number') {
        console.error('[TrackingService] viewDuration phải là số:', data.viewDuration);
        throw new Error('viewDuration must be a number');
      }

      // Đảm bảo dữ liệu đúng format
      const trackData = {
        userId: data.userId ? String(data.userId) : undefined,
        sessionId: String(data.sessionId),
        productId: String(data.productId),
        productName: String(data.productName),
        viewDuration: Number(data.viewDuration)
      };

      console.log('[TrackingService] Dữ liệu đã format:', JSON.stringify(trackData));

      const productTrack = new ProductTrack(trackData);
      const saved = await productTrack.save();
      console.log('[TrackingService]  Đã lưu log xem sản phẩm thành công. ID:', saved._id);
      console.log('[TrackingService] Document saved:', JSON.stringify(saved.toObject()));
      return true;
    } catch (error) {
      console.error('[TrackingService] ❌ Lỗi lưu log xem sản phẩm:', error.message);
      console.error('[TrackingService] Error name:', error.name);
      console.error('[TrackingService] Error stack:', error.stack);
      if (error.errors) {
        console.error('[TrackingService] Validation errors:', JSON.stringify(error.errors));
      }
      throw error;
    }
  }

  // Ghi log giỏ hàng
  static async logCartAction(data) {
    try {
      // Kiểm tra kết nối
      if (!this.checkConnection()) {
        console.error('[TrackingService] Không thể lưu log giỏ hàng: MongoDB chưa kết nối');
        return false;
      }

      const cartTrack = new CartTrack(data);
      const saved = await cartTrack.save();
      console.log('[TrackingService] Đã lưu log giỏ hàng:', saved._id);
      return true;
    } catch (error) {
      console.error('[TrackingService] Lỗi lưu log giỏ hàng:', error.message);
      console.error('[TrackingService] Error details:', error);
      throw error;
    }
  }

  // Ghi log mua hàng với số lượng lớn
  static async logPurchase(data) {
    try {
      console.log('[TrackingService] logPurchase - Dữ liệu nhận được:', JSON.stringify(data));
      
      // Kiểm tra kết nối
      if (!this.checkConnection()) {
        console.error('[TrackingService] Không thể lưu log mua hàng: MongoDB chưa kết nối');
        return false;
      }

      // Validate dữ liệu
      if (!data.sessionId) {
        console.error('[TrackingService] Thiếu sessionId trong dữ liệu');
        throw new Error('sessionId is required');
      }
      if (!data.productId) {
        console.error('[TrackingService] Thiếu productId trong dữ liệu');
        throw new Error('productId is required');
      }
      if (!data.productName) {
        console.error('[TrackingService] Thiếu productName trong dữ liệu');
        throw new Error('productName is required');
      }
      if (typeof data.quantity !== 'number') {
        console.error('[TrackingService] quantity phải là số:', data.quantity);
        throw new Error('quantity must be a number');
      }

      // Đảm bảo dữ liệu đúng format
      const trackData = {
        userId: data.userId ? String(data.userId) : undefined,
        sessionId: String(data.sessionId),
        productId: String(data.productId),
        productName: String(data.productName),
        quantity: Number(data.quantity),
        orderId: data.orderId ? Number(data.orderId) : undefined
      };

      console.log('[TrackingService] Dữ liệu đã format:', JSON.stringify(trackData));

      const purchaseTrack = new PurchaseTrack(trackData);
      const saved = await purchaseTrack.save();
      console.log('[TrackingService]  Đã lưu log mua hàng thành công. ID:', saved._id);
      console.log('[TrackingService] Document saved:', JSON.stringify(saved.toObject()));
      return true;
    } catch (error) {
      console.error('[TrackingService] ❌ Lỗi lưu log mua hàng:', error.message);
      console.error('[TrackingService] Error name:', error.name);
      console.error('[TrackingService] Error stack:', error.stack);
      if (error.errors) {
        console.error('[TrackingService] Validation errors:', JSON.stringify(error.errors));
      }
      throw error;
    }
  }
}

module.exports = TrackingService;