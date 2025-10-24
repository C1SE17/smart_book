// // Controller tracking: Lấy userId từ req.user do middleware auth gán
// const TrackingService = require('../services/TrackingService');

// class TrackingController {
//   // Ghi log tìm kiếm (userId lấy từ token)
//   static async trackSearch(req, res) {
//     try {
//       const userId = req.user?.userId || req.userId || null; // phụ thuộc middleware auth
//       if (!userId) {
//         return res.status(401).json({ success: false, message: 'Unauthorized: thiếu token' });
//       }

//       const { keyword, sessionId } = req.body;
//       if (!keyword) {
//         return res.status(400).json({ success: false, message: 'Thiếu keyword' });
//       }

//       await TrackingService.logSearch({ userId, sessionId: sessionId || null, keyword });
//       return res.json({ success: true, message: 'Đã ghi nhận tìm kiếm' });
//     } catch (err) {
//       return res.status(500).json({ success: false, message: 'Lỗi server', error: err.message });
//     }
//   }

//   // Ghi log xem sản phẩm
//   static async trackProductView(req, res) {
//     try {
//       const userId = req.user?.userId || req.userId || null;
//       if (!userId) {
//         return res.status(401).json({ success: false, message: 'Unauthorized: thiếu token' });
//       }

//       const { productId, productName, viewDuration, sessionId } = req.body;
//       if (!productId || !productName || typeof viewDuration !== 'number') {
//         return res.status(400).json({ success: false, message: 'Thiếu thông tin productId/productName/viewDuration' });
//       }

//       await TrackingService.logProductView({
//         userId,
//         sessionId: sessionId || null,
//         productId,
//         productName,
//         viewDuration
//       });

//       return res.json({ success: true, message: 'Đã ghi nhận xem sản phẩm' });
//     } catch (err) {
//       return res.status(500).json({ success: false, message: 'Lỗi server', error: err.message });
//     }
//   }

//   // Ghi log thao tác giỏ hàng
//   static async trackCartAction(req, res) {
//     try {
//       const userId = req.user?.userId || req.userId || null;
//       if (!userId) {
//         return res.status(401).json({ success: false, message: 'Unauthorized: thiếu token' });
//       }

//       const { productId, productName, action, quantity, sessionId } = req.body;
//       if (!productId || !productName || !action || typeof quantity !== 'number') {
//         return res.status(400).json({ success: false, message: 'Thiếu thông tin productId/productName/action/quantity' });
//       }

//       await TrackingService.logCartAction({
//         userId,
//         sessionId: sessionId || null,
//         productId,
//         productName,
//         action,
//         quantity
//       });

//       return res.json({ success: true, message: 'Đã ghi nhận thao tác giỏ hàng' });
//     } catch (err) {
//       return res.status(500).json({ success: false, message: 'Lỗi server', error: err.message });
//     }
//   }
// }

// module.exports = TrackingController;