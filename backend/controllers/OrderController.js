const OrderModel = require("../models/OrderModel");

// Controller điều phối toàn bộ nghiệp vụ đơn hàng (đặt, xác nhận, thống kê)
class OrderController {
  static async purchase(req, res) {
    console.log('purchase - Bắt đầu xử lý đơn hàng');
    const userId = req.user.userId;
    const { book_id, quantity, shipping_address } = req.body;

    console.log('purchase - Dữ liệu đầu vào:', {
      userId,
      book_id,
      quantity,
      shipping_address
    });

    try {
      if (!book_id) {
        console.log('purchase - Thiếu book_id');
        throw new Error("Thiếu book_id");
      }
      const validQuantity = Number.isInteger(quantity) && quantity > 0 ? quantity : 1;
      console.log('purchase - Gọi OrderModel.createDraftOrder');
      const result = await OrderModel.createDraftOrder(
        userId,
        book_id,
        validQuantity,
        shipping_address || ""
      );
      console.log("Số lượng nhận từ FE:", quantity);
      console.log('purchase - Kết quả từ OrderModel:', result);
      
      res.status(200).json({
        success: true,
        message: "Đơn hàng tạm đã được tạo",
        data: {
          order_id: result.order_id,
          total_amount: result.total_amount
        }
      });
      
    } catch (err) {
      console.error('purchase - Lỗi:', {
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
    const { selected_cart_item_ids, shipping_address, items_info } = req.body;

    try {
      if (!selected_cart_item_ids || !Array.isArray(selected_cart_item_ids))
        throw new Error(
          "Thiếu hoặc định dạng selected_cart_item_ids không hợp lệ"
        );
      const result = await OrderModel.createOrderFromCart(
        userId,
        selected_cart_item_ids,
        shipping_address || "",
        items_info
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

    console.log('getOrderConfirmation - order_id:', order_id);
    console.log('getOrderConfirmation - userId:', userId);

    try {
      const order = await OrderModel.getOrderDetails(order_id, userId);
      console.log('getOrderConfirmation - order found:', order);
      res.status(200).json({ success: true, data: order });
    } catch (err) {
      console.error('getOrderConfirmation - Lỗi:', {
        message: err.message,
        stack: err.stack,
        order_id,
        userId
      });
      res
        .status(500)
        .json({ error: "Lỗi khi lấy chi tiết đơn hàng: " + err.message });
    }
  }

  // Lấy chi tiết đơn hàng dành cho admin
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
  // Lấy danh sách đơn hàng gắn với người dùng hiện tại
  static async getUserOrders(req, res) {
    console.log('getUserOrders - Bắt đầu lấy đơn hàng của user');
    
    try {
      // Kiểm tra req.user
      if (!req.user) {
        console.log('getUserOrders - Thiếu thông tin xác thực người dùng');
        return res.status(401).json({
          success: false,
          error: "Thiếu thông tin xác thực người dùng"
        });
      }

      const userId = req.user.userId;
      console.log('getUserOrders - userId:', userId);
      console.log('getUserOrders - req.user:', req.user);

      if (!userId) {
        console.log('getUserOrders - Thiếu thông tin user ID');
        return res.status(400).json({
          success: false,
          error: "Thiếu thông tin user ID"
        });
      }

      console.log('getUserOrders - Gọi OrderModel.getUserOrders');
      const orders = await OrderModel.getUserOrders(userId);
      
      console.log('getUserOrders - Kết quả từ OrderModel:', {
        ordersCount: orders ? orders.length : 0,
        orders: orders
      });
      
      res.status(200).json({
        success: true,
        data: orders,
        message: "Lấy danh sách đơn hàng thành công"
      });
    } catch (err) {
      console.error('getUserOrders - Lỗi:', {
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
      const result = await OrderModel.updateOrderStatus(order_id, status);
      res.status(200).json({
        success: true,
        message:
          result && result.updated
            ? "Cập nhật trạng thái đơn hàng thành công"
            : "Trạng thái đơn hàng không thay đổi",
        data: {
          order_id,
          previous_status: result ? result.previousStatus : null,
          new_status: result ? result.newStatus : status,
          updated: result ? result.updated : true,
        },
      });
    } catch (err) {
      console.error("Lỗi khi cập nhật trạng thái đơn hàng:", err.message);
      res.status(500).json({
        error: "Lỗi khi cập nhật trạng thái đơn hàng: " + err.message,
      });
    }
  }

  static async cancelOrder(req, res) {
    const { order_id } = req.params;
    const userId = req.user.userId;

    try {
      const result = await OrderModel.cancelOrder(order_id, userId);
      res.status(200).json({
        success: true,
        message:
          result && result.updated
            ? "Đơn hàng đã được hủy thành công"
            : "Đơn hàng đã ở trạng thái hủy",
        data: {
          order_id,
          previous_status: result ? result.previousStatus : null,
          new_status: result ? result.newStatus : "cancelled",
          updated: result ? result.updated : true,
        },
      });
    } catch (err) {
      console.error("Lỗi khi hủy đơn hàng:", err.message);
      let statusCode = 500;
      if (err.message.includes("không tồn tại")) {
        statusCode = 404;
      } else if (err.message.includes("không thể hủy")) {
        statusCode = 400;
      }
      res.status(statusCode).json({
        success: false,
        error: err.message,
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

  static async getLifetimeSummary(req, res) {
    try {
      const summary = await OrderModel.getLifetimeStats();
      res.status(200).json({ success: true, data: summary });
    } catch (err) {
      console.error("Lỗi khi lấy thống kê tổng hợp đơn hàng:", err.message);
      res
        .status(500)
        .json({ success: false, error: "Không thể lấy thống kê: " + err.message });
    }
  }
}

module.exports = OrderController;
