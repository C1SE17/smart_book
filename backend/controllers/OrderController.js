const OrderModel = require("../models/OrderModel");

class OrderController {
  static async purchase(req, res) {
    console.log('🛒 [OrderController] purchase - Bắt đầu xử lý đơn hàng');
    const userId = req.user.userId;
    const { book_id, quantity, shipping_address } = req.body;

    console.log('📋 [OrderController] purchase - Dữ liệu đầu vào:', {
      userId,
      book_id,
      quantity,
      shipping_address
    });

    try {
      if (!book_id) {
        console.log('❌ [OrderController] purchase - Thiếu book_id');
        throw new Error("Thiếu book_id");
      }
      console.log('📞 [OrderController] purchase - Gọi OrderModel.createDraftOrder');
      const result = await OrderModel.createDraftOrder(
        userId,
        book_id,
        quantity || 1,
        shipping_address || ""
      );
      
      console.log('✅ [OrderController] purchase - Kết quả từ OrderModel:', result);
      
      res.status(200).json({
        success: true,
        message: "Đơn hàng tạm đã được tạo",
        data: {
          order_id: result.order_id,
          total_amount: result.total_amount
        }
      });
      
    } catch (err) {
      console.error('💥 [OrderController] purchase - Lỗi:', {
        message: err.message,
        stack: err.stack,
        userId,
        book_id,
        quantity,
        shipping_address
      });
      
      res.status(500).json({
        success: false,
        error: "Lỗi khi đặt hàng: " + err.message,
        data: null
      });
    }
  }

  static async checkout(req, res) {
    const userId = req.user.userId;
    const { selected_cart_item_ids, shipping_address } = req.body;

    try {
      if (!selected_cart_item_ids || !Array.isArray(selected_cart_item_ids))
        throw new Error(
          "Thiếu hoặc định dạng selected_cart_item_ids không hợp lệ"
        );
      const result = await OrderModel.createOrderFromCart(
        userId,
        selected_cart_item_ids,
        shipping_address || ""
      );
      res.status(200).json({
        success: true,
        message: "Đơn hàng đã được đặt thành công, đang chờ xử lý",
        data: {
          order_id: result.order_id,
          total_amount: result.total_amount
        }
      });
      
    } catch (err) {
      console.error("Lỗi khi đặt hàng từ giỏ:", err.message);
      res.status(500).json({ error: "Lỗi khi đặt hàng: " + err.message });
    }
  }

  static async getOrderConfirmation(req, res) {
    const { order_id } = req.params;
    const userId = req.user.userId;

    try {
      const order = await OrderModel.getOrderDetails(order_id, userId);
      res.status(200).json({ success: true, data: order });
    } catch (err) {
      console.error("Lỗi khi lấy chi tiết đơn hàng:", err.message);
      res
        .status(500)
        .json({ error: "Lỗi khi lấy chi tiết đơn hàng: " + err.message });
    }
  }

  // Method for admin to get order details
  static async getAdminOrderDetails(req, res) {
    const { order_id } = req.params;

    try {
      const order = await OrderModel.getAdminOrderDetails(order_id);
      res.status(200).json({ success: true, data: order });
    } catch (err) {
      console.error("Lỗi khi lấy chi tiết đơn hàng cho admin:", err.message);
      res
        .status(500)
        .json({ error: "Lỗi khi lấy chi tiết đơn hàng: " + err.message });
    }
  }
  //lấy danh sách đơn hàng của user
  static async getUserOrders(req, res) {
    console.log('📋 [OrderController] getUserOrders - Bắt đầu lấy đơn hàng của user');
    
    try {
      // Kiểm tra req.user
      if (!req.user) {
        console.log('❌ [OrderController] getUserOrders - Thiếu thông tin xác thực người dùng');
        return res.status(401).json({
          success: false,
          error: "Thiếu thông tin xác thực người dùng"
        });
      }

      const userId = req.user.userId;
      console.log('👤 [OrderController] getUserOrders - userId:', userId);
      console.log('👤 [OrderController] getUserOrders - req.user:', req.user);

      if (!userId) {
        console.log('❌ [OrderController] getUserOrders - Thiếu thông tin user ID');
        return res.status(400).json({
          success: false,
          error: "Thiếu thông tin user ID"
        });
      }

      console.log('📞 [OrderController] getUserOrders - Gọi OrderModel.getUserOrders');
      const orders = await OrderModel.getUserOrders(userId);
      
      console.log('✅ [OrderController] getUserOrders - Kết quả từ OrderModel:', {
        ordersCount: orders ? orders.length : 0,
        orders: orders
      });
      
      res.status(200).json({
        success: true,
        data: orders,
        message: "Lấy danh sách đơn hàng thành công"
      });
    } catch (err) {
      console.error('💥 [OrderController] getUserOrders - Lỗi:', {
        message: err.message,
        stack: err.stack,
        userId: req.user ? req.user.userId : 'unknown'
      });
      
      res.status(500).json({
        success: false,
        error: "Lỗi khi lấy danh sách đơn hàng của bạn: " + err.message,
        data: null
      });
    }
  }
  // API tổng doanh thu và tổng đơn theo ngày/tháng
  static async getRevenueStats(req, res) {
    const { type, date } = req.query; // type: 'day' hoặc 'month', date: '2025-10-07' hoặc '2025-10'
    if (!type || !date)
      return res.status(400).json({ error: "Thiếu tham số type hoặc date" });
    try {
      const stats = await OrderModel.getRevenue({ type, date });
      res.json(stats);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // API thống kê số lượng sản phẩm bán được theo ngày/tháng
  static async getProductStats(req, res) {
    const { type, date } = req.query;
    if (!type || !date)
      return res.status(400).json({ error: "Thiếu tham số type hoặc date" });
    try {
      const stats = await OrderModel.getProductStats({ type, date });
      res.json(stats);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // API doanh thu từng ngày trong tháng (cho biểu đồ)
  static async getDailyRevenueOfMonth(req, res) {
    const { month } = req.query; // month: '2025-10'
    if (!month) return res.status(400).json({ error: "Thiếu tham số month" });
    try {
      const stats = await OrderModel.getDailyRevenueOfMonth(month);
      res.json(stats);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // API doanh thu từng tháng trong năm (cho biểu đồ)
  static async getMonthlyRevenueOfYear(req, res) {
    const { year } = req.query; // year: '2025'
    if (!year) return res.status(400).json({ error: "Thiếu tham số year" });
    try {
      const stats = await OrderModel.getMonthlyRevenueOfYear(year);
      res.json(stats);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
  static async confirmOrder(req, res) {
    const { order_id } = req.params;
    const userId = req.user.userId;

    try {
      await OrderModel.confirmOrder(order_id, userId);
      res
        .status(200)
        .json({ message: "Đơn hàng đã được xác nhận và gửi đến admin" });
    } catch (err) {
      console.error("Lỗi khi xác nhận đơn hàng:", err.message);
      res
        .status(500)
        .json({ error: "Lỗi khi xác nhận đơn hàng: " + err.message });
    }
  }

  static async getPendingOrders(req, res) {
    try {
      const orders = await OrderModel.getPendingOrders();
      res.status(200).json(orders);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách đơn hàng cần giao:", err.message);
      res.status(500).json({
        error: "Lỗi khi lấy danh sách đơn hàng cần giao: " + err.message,
      });
    }
  }

  static async getAllOrders(req, res) {
    try {
      const orders = await OrderModel.getAllOrders();
      res.status(200).json(orders);
    } catch (err) {
      res
        .status(500)
        .json({ error: "Lỗi khi lấy danh sách đơn hàng: " + err.message });
    }
  }

  static async updateOrderStatus(req, res) {
    const { order_id } = req.params;
    const { status } = req.body;

    if (
      !["pending", "paid", "shipped", "completed", "cancelled"].includes(status)
    ) {
      return res.status(400).json({ error: "Trạng thái không hợp lệ" });
    }

    try {
      await OrderModel.updateOrderStatus(order_id, status);
      res
        .status(200)
        .json({ message: "Cập nhật trạng thái đơn hàng thành công" });
    } catch (err) {
      console.error("Lỗi khi cập nhật trạng thái đơn hàng:", err.message);
      res.status(500).json({
        error: "Lỗi khi cập nhật trạng thái đơn hàng: " + err.message,
      });
    }
  }

  static async deleteOrder(req, res) {
    const { order_id } = req.params;

    try {
      const result = await OrderModel.deleteOrder(order_id);
      res.status(200).json(result);
    } catch (err) {
      console.error("Lỗi khi xóa đơn hàng:", err.message);
      res.status(500).json({ error: "Lỗi khi xóa đơn hàng: " + err.message });
    }
  }
}

module.exports = OrderController;
