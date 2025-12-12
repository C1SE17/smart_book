// Controller tracking: Lấy userId từ req.user do middleware auth gán
const TrackingService = require('../services/TrackingService');

class TrackingController {
  // Helper function để check admin
  static async checkIfAdmin(userId) {
    if (!userId) return false;
    return new Promise((resolve) => {
      const User = require('../models/User');
      User.getById(userId, (err, user) => {
        if (err || !user) {
          resolve(false);
        } else {
          resolve(user.role === 'admin');
        }
      });
    });
  }

  // Ghi log tìm kiếm (userId lấy từ token)
  static async trackSearch(req, res) {
    try {
      // Lấy userId từ body hoặc từ req.user (middleware auth)
      const userId = req.body.userId || req.user?.userId || req.userId || null;
      
      // Kiểm tra nếu là admin thì không track
      if (userId && await TrackingController.checkIfAdmin(userId)) {
        return res.json({ success: true, message: 'Admin tracking skipped' });
      }
      
      const { keyword, sessionId } = req.body;
      if (!keyword || !sessionId) {
        return res.status(400).json({ success: false, message: 'Thiếu keyword' });
      }

      await TrackingService.logSearch({ userId: userId || null, sessionId: sessionId || null, keyword });
      return res.json({ success: true, message: 'Đã ghi nhận tìm kiếm' });
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Lỗi server', error: err.message });
    }
  }

  // Ghi log xem sản phẩm
  static async trackProductView(req, res) {
    try {
      console.log('[TrackingController] trackProductView - Request body:', JSON.stringify(req.body));
      
      // Lấy userId từ body hoặc từ req.user (middleware auth)
      const userId = req.body.userId || req.user?.userId || req.userId || null;
      
      console.log('[TrackingController] trackProductView - userId:', userId);
      
      // Kiểm tra nếu là admin thì không track
      if (userId && await TrackingController.checkIfAdmin(userId)) {
        console.log('[TrackingController] Admin tracking skipped');
        return res.json({ success: true, message: 'Admin tracking skipped' });
      }
      
      const { productId, productName, viewDuration, sessionId } = req.body;
      
      // Validate dữ liệu
      if (!sessionId) {
        console.error('[TrackingController] Thiếu sessionId');
        return res.status(400).json({ success: false, message: 'Thiếu sessionId' });
      }
      if (!productId) {
        console.error('[TrackingController] Thiếu productId');
        return res.status(400).json({ success: false, message: 'Thiếu productId' });
      }
      if (!productName) {
        console.error('[TrackingController] Thiếu productName');
        return res.status(400).json({ success: false, message: 'Thiếu productName' });
      }
      if (typeof viewDuration !== 'number') {
        console.error('[TrackingController] viewDuration không phải là số:', viewDuration, typeof viewDuration);
        return res.status(400).json({ success: false, message: 'viewDuration phải là số' });
      }

      console.log('[TrackingController] Gọi TrackingService.logProductView với dữ liệu:', {
        userId: userId || null,
        sessionId,
        productId,
        productName,
        viewDuration
      });

      await TrackingService.logProductView({
        userId: userId || null, // Lưu userId nếu có
        sessionId: sessionId || null,
        productId,
        productName,
        viewDuration
      });

      console.log('[TrackingController]  Đã ghi nhận xem sản phẩm thành công');
      return res.json({ success: true, message: 'Đã ghi nhận xem sản phẩm' });
    } catch (err) {
      console.error('[TrackingController] ❌ Lỗi trackProductView:', err.message);
      console.error('[TrackingController] Error stack:', err.stack);
      return res.status(500).json({ success: false, message: 'Lỗi server', error: err.message });
    }
  }

  // Ghi log thao tác giỏ hàng
  static async trackCartAction(req, res) {
    try {
      // Lấy userId từ body hoặc từ req.user (middleware auth)
      const userId = req.body.userId || req.user?.userId || req.userId || null;
      
      // Kiểm tra nếu là admin thì không track
      if (userId && await TrackingController.checkIfAdmin(userId)) {
        return res.json({ success: true, message: 'Admin tracking skipped' });
      }
      
      const { productId, productName, action, quantity, sessionId } = req.body;
      if (!sessionId || !productId || !productName || !action || typeof quantity !== 'number') {
        return res.status(400).json({ success: false, message: 'Thiếu thông tin productId/productName/action/quantity' });
      }

      await TrackingService.logCartAction({
        userId: userId || null, // Lưu userId nếu có
        sessionId: sessionId || null,
        productId,
        productName,
        action,
        quantity
      });

      return res.json({ success: true, message: 'Đã ghi nhận thao tác giỏ hàng' });
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Lỗi server', error: err.message });
    }
  }

  // Ghi log mua hàng với số lượng lớn
  static async trackPurchase(req, res) {
    try {
      console.log('[TrackingController] trackPurchase - Request body:', JSON.stringify(req.body));
      
      // Lấy userId từ body hoặc từ req.user (middleware auth)
      const userId = req.body.userId || req.user?.userId || req.userId || null;
      
      console.log('[TrackingController] trackPurchase - userId:', userId);
      
      // Kiểm tra nếu là admin thì không track
      if (userId && await TrackingController.checkIfAdmin(userId)) {
        console.log('[TrackingController] Admin tracking skipped');
        return res.json({ success: true, message: 'Admin tracking skipped' });
      }
      
      const { productId, productName, quantity, orderId, sessionId } = req.body;
      
      // Validate dữ liệu
      if (!sessionId) {
        console.error('[TrackingController] Thiếu sessionId');
        return res.status(400).json({ success: false, message: 'Thiếu sessionId' });
      }
      if (!productId) {
        console.error('[TrackingController] Thiếu productId');
        return res.status(400).json({ success: false, message: 'Thiếu productId' });
      }
      if (!productName) {
        console.error('[TrackingController] Thiếu productName');
        return res.status(400).json({ success: false, message: 'Thiếu productName' });
      }
      if (typeof quantity !== 'number') {
        console.error('[TrackingController] quantity không phải là số:', quantity, typeof quantity);
        return res.status(400).json({ success: false, message: 'quantity phải là số' });
      }

      console.log('[TrackingController] Gọi TrackingService.logPurchase với dữ liệu:', {
        userId: userId || null,
        sessionId,
        productId,
        productName,
        quantity,
        orderId: orderId || null
      });

      await TrackingService.logPurchase({
        userId: userId || null,
        sessionId: sessionId || null,
        productId,
        productName,
        quantity,
        orderId: orderId || null
      });

      console.log('[TrackingController]  Đã ghi nhận mua hàng thành công');
      return res.json({ success: true, message: 'Đã ghi nhận mua hàng' });
    } catch (err) {
      console.error('[TrackingController] ❌ Lỗi trackPurchase:', err.message);
      console.error('[TrackingController] Error stack:', err.stack);
      return res.status(500).json({ success: false, message: 'Lỗi server', error: err.message });
    }
  }
}

module.exports = TrackingController;