const db = require("../config/db"); // Nhập kết nối từ db.js

class OrderModel {
  static async createDraftOrder(userId, bookId, quantity, shippingAddress) {
    try {
      console.log("Bắt đầu tạo đơn tạm cho userId:", userId, "bookId:", bookId);

      // Lấy giá sách
      const [bookRows] = await db
        .promise()
        .query("SELECT price FROM books WHERE book_id = ? LIMIT 1", [bookId]);
      if (!bookRows.length) throw new Error("Sản phẩm không tồn tại");
      const price = bookRows[0].price;
      const totalAmount = quantity * price;

      // Tạo đơn tạm (pending) - sử dụng status hợp lệ
      const [orderResult] = await db
        .promise()
        .query(
          "INSERT INTO orders (user_id, status, total_price, shipping_address) VALUES (?, ?, ?, ?)",
          [userId, "pending", totalAmount, shippingAddress || ""]
        );
      const orderId = orderResult.insertId;

      // Thêm item vào order_items
      console.log(
        `Thêm order_item: order_id=${orderId}, book_id=${bookId}, quantity=${quantity}, price=${price}`
      );
      await db
        .promise()
        .query(
          "INSERT INTO order_items (order_id, book_id, quantity, price_at_order) VALUES (?, ?, ?, ?)",
          [orderId, bookId, quantity, price]
        );
      console.log(
        `Thêm order_item thành công: order_id=${orderId}, book_id=${bookId}, quantity=${quantity}, price=${price}`
      );
      // Cập nhật total_price cho đơn mua ngay
      await db.promise().query(
        `UPDATE orders 
         SET total_price = (
           SELECT COALESCE(SUM(oi.quantity * oi.price_at_order), 0)
           FROM order_items oi
           WHERE oi.order_id = ?
         )
         WHERE order_id = ?`,
        [orderId, orderId]
      );
      console.log(`Đã cập nhật total_price cho đơn mua ngay #${orderId}`);

      console.log("Tạo đơn tạm thành công, orderId:", orderId);
      
      // Track purchase ngay khi đặt hàng
      try {
        const TrackingService = require('../services/TrackingService');
        const [bookInfo] = await db.promise().query(
          "SELECT title FROM books WHERE book_id = ? LIMIT 1",
          [bookId]
        );
        const bookTitle = bookInfo.length > 0 ? bookInfo[0].title : `Book ${bookId}`;
        const sessionId = `user:${userId}`;
        
        await TrackingService.logPurchase({
          userId: String(userId),
          sessionId: sessionId,
          productId: String(bookId),
          productName: bookTitle,
          quantity: quantity,
          orderId: orderId
        });
        console.log(`[OrderModel] Đã track purchase khi tạo đơn: orderId=${orderId}, bookId=${bookId}, quantity=${quantity}`);
      } catch (trackError) {
        // Không throw error để không ảnh hưởng đến việc tạo order
        console.error('[OrderModel] Lỗi khi track purchase (createDraftOrder):', trackError.message);
      }
      
      return { order_id: orderId, total_amount: totalAmount };
    } catch (err) {
      console.error("Lỗi tạo đơn tạm:", err.message);
      throw err;
    }
  }
  static async createOrderFromCart(
    userId,
    selectedCartItemIds,
    shippingAddress,
    itemsInfo = null
  ) {
    try {
      console.log("Bắt đầu tạo đơn từ giỏ hàng cho userId:", userId);

      // Lấy hoặc tạo cart_id
      let [cartRows] = await db
        .promise()
        .query("SELECT cart_id FROM carts WHERE user_id = ? LIMIT 1", [userId]);

      let cartId;
      if (!cartRows.length) {
        // Tạo giỏ hàng mới nếu chưa có
        const [cartResult] = await db
          .promise()
          .query("INSERT INTO carts (user_id) VALUES (?)", [userId]);
        cartId = cartResult.insertId;
        console.log("Tạo giỏ hàng mới cho userId:", userId, "cartId:", cartId);
      } else {
        cartId = cartRows[0].cart_id;
        console.log("Sử dụng giỏ hàng hiện có, cartId:", cartId);
      }

      if (
        !selectedCartItemIds ||
        !Array.isArray(selectedCartItemIds) ||
        selectedCartItemIds.length === 0
      ) {
        throw new Error("Không có sản phẩm nào được chọn");
      }

      // Tính total_amount từ cart_items đã chọn (nếu có)
      let totalAmount = 0;
      let cartItemsData = [];

      try {
        // Thử tìm cart_items với cart_item_id trước
        const [totalResult] = await db
          .promise()
          .query(
            "SELECT SUM(ci.quantity * b.price) as total FROM cart_items ci JOIN books b ON ci.book_id = b.book_id WHERE ci.cart_id = ? AND ci.cart_item_id IN (?)",
            [cartId, selectedCartItemIds]
          );
        totalAmount = totalResult[0].total || 0;

        // Lấy dữ liệu cart_items
        const [cartItemsRows] = await db
          .promise()
          .query(
            "SELECT ci.cart_item_id, ci.book_id, ci.quantity, b.price FROM cart_items ci JOIN books b ON ci.book_id = b.book_id WHERE ci.cart_id = ? AND ci.cart_item_id IN (?)",
            [cartId, selectedCartItemIds]
          );
        cartItemsData = cartItemsRows;
        console.log("Tìm thấy cart_items:", cartItemsData.length);
      } catch (err) {
        console.log(
          "Không tìm thấy cart_items với cart_item_id, thử tìm với book_id"
        );

        // Fallback: tìm cart_items với book_id
        try {
          const [totalResult] = await db
            .promise()
            .query(
              "SELECT SUM(ci.quantity * b.price) as total FROM cart_items ci JOIN books b ON ci.book_id = b.book_id WHERE ci.cart_id = ? AND ci.book_id IN (?)",
              [cartId, selectedCartItemIds]
            );
          totalAmount = totalResult[0].total || 0;

          // Lấy dữ liệu cart_items với book_id
          const [cartItemsRows] = await db
            .promise()
            .query(
              "SELECT ci.cart_item_id, ci.book_id, ci.quantity, b.price FROM cart_items ci JOIN books b ON ci.book_id = b.book_id WHERE ci.cart_id = ? AND ci.book_id IN (?)",
              [cartId, selectedCartItemIds]
            );
          cartItemsData = cartItemsRows;
          console.log("Tìm thấy cart_items với book_id:", cartItemsData.length);
        } catch (err2) {
          console.log("Không tìm thấy cart_items, sử dụng fallback method");
          totalAmount = 0; // Sẽ được tính lại dưới đây
        }
      }

      // Tạo đơn hàng (pending)
      const [orderResult] = await db
        .promise()
        .query(
          "INSERT INTO orders (user_id, status, total_price, shipping_address) VALUES (?, ?, ?, ?)",
          [userId, "pending", totalAmount, shippingAddress || ""]
        );
      const orderId = orderResult.insertId;

      // Chuyển cart_items sang order_items hoặc tạo từ dữ liệu frontend
      if (cartItemsData.length > 0) {
        try {
          // Sử dụng dữ liệu cart_items đã lấy được
          for (const item of cartItemsData) {
            await db
              .promise()
              .query(
                "INSERT INTO order_items (order_id, book_id, quantity, price_at_order) VALUES (?, ?, ?, ?)",
                [orderId, item.book_id, item.quantity, item.price]
              );
          }
          console.log(
            "Đã chuyển cart_items sang order_items:",
            cartItemsData.length,
            "items"
          );
        } catch (err) {
          console.error("Lỗi khi chuyển cart_items sang order_items:", err);
          throw err;
        }
      } else {
        console.log("Không có cart_items data, sử dụng fallback method");

        if (itemsInfo && itemsInfo.length > 0) {
          // Sử dụng thông tin từ frontend
          console.log("Sử dụng items_info từ frontend:", itemsInfo);
          for (const item of itemsInfo) {
            await db
              .promise()
              .query(
                "INSERT INTO order_items (order_id, book_id, quantity, price_at_order) VALUES (?, ?, ?, ?)",
                [orderId, item.book_id, item.quantity, item.price]
              );
            totalAmount += item.quantity * item.price;
          }
          console.log(
            "Đã tạo order_items từ items_info:",
            itemsInfo.length,
            "items"
          );
        } else {
          // Fallback: tạo order_items trực tiếp từ selectedCartItemIds (có thể là book_ids)
          // Trong trường hợp này, chúng ta cần dữ liệu từ frontend
          // Tạm thời tạo một order_item mặc định
          const [bookRows] = await db
            .promise()
            .query(
              "SELECT book_id, price FROM books WHERE book_id = ? LIMIT 1",
              [selectedCartItemIds[0]]
            );

          if (bookRows.length > 0) {
            const book = bookRows[0];
            await db
              .promise()
              .query(
                "INSERT INTO order_items (order_id, book_id, quantity, price_at_order) VALUES (?, ?, ?, ?)",
                [orderId, book.book_id, 1, book.price]
              );
            totalAmount = book.price;
            console.log(
              "Đã tạo order_item fallback cho book_id:",
              book.book_id
            );
          } else {
            throw new Error("Không tìm thấy sản phẩm để tạo đơn hàng");
          }
        }
      }
      // Xóa cart_items đã chọn
      if (cartItemsData.length > 0) {
        // Xóa bằng cart_item_id
        const cartItemIds = cartItemsData.map((item) => item.cart_item_id);
        await db
          .promise()
          .query(
            "DELETE FROM cart_items WHERE cart_id = ? AND cart_item_id IN (?)",
            [cartId, cartItemIds]
          );
        console.log("Đã xóa cart_items:", cartItemIds.length, "items");
      } else {
        // Fallback: xóa bằng book_id
        await db
          .promise()
          .query(
            "DELETE FROM cart_items WHERE cart_id = ? AND book_id IN (?)",
            [cartId, selectedCartItemIds]
          );
        console.log(
          "Đã xóa cart_items bằng book_id:",
          selectedCartItemIds.length,
          "items"
        );
      }

      // Xóa cart nếu trống
      const [remainingItems] = await db
        .promise()
        .query("SELECT COUNT(*) as count FROM cart_items WHERE cart_id = ?", [
          cartId,
        ]);
      if (remainingItems[0].count === 0) {
        await db
          .promise()
          .query("DELETE FROM carts WHERE cart_id = ?", [cartId]);
      }
      // Cập nhật total_price cho đơn hàng
      await db.promise().query(
        `UPDATE orders 
         SET total_price = (
           SELECT COALESCE(SUM(oi.quantity * oi.price_at_order), 0)
           FROM order_items oi
           WHERE oi.order_id = ?
         )
         WHERE order_id = ?`,
        [orderId, orderId]
      );
      console.log(` Đã cập nhật total_price cho order #${orderId}`);

      // Track purchase ngay khi đặt hàng từ giỏ hàng
      try {
        const TrackingService = require('../services/TrackingService');
        const sessionId = `user:${userId}`;
        
        // Lấy thông tin order_items với book title
        const [orderItems] = await db.promise().query(
          `SELECT oi.book_id, oi.quantity, b.title 
           FROM order_items oi 
           JOIN books b ON oi.book_id = b.book_id 
           WHERE oi.order_id = ?`,
          [orderId]
        );
        
        let trackedCount = 0;
        for (const item of orderItems) {
          await TrackingService.logPurchase({
            userId: String(userId),
            sessionId: sessionId,
            productId: String(item.book_id),
            productName: item.title || `Book ${item.book_id}`,
            quantity: item.quantity,
            orderId: orderId
          });
          trackedCount++;
          console.log(`[OrderModel] Đã track purchase khi tạo đơn từ giỏ: orderId=${orderId}, bookId=${item.book_id}, quantity=${item.quantity}`);
        }
        console.log(`[OrderModel] Tổng số sách đã track khi tạo đơn: ${trackedCount}/${orderItems.length}`);
      } catch (trackError) {
        // Không throw error để không ảnh hưởng đến việc tạo order
        console.error('[OrderModel] Lỗi khi track purchase (createOrderFromCart):', trackError.message);
      }

      console.log("Tạo đơn từ giỏ hàng thành công, orderId:", orderId);
      return { order_id: orderId, total_amount: totalAmount };

    } catch (err) {
      console.error("Lỗi tạo đơn từ giỏ hàng:", err.message);
      throw err;
    }
  }

  static async getOrderDetails(orderId, userId) {
    try {
      const [rows] = await db.promise().query(
        `
        SELECT 
          o.order_id,
          o.user_id,
          o.shipping_address,
          COALESCE(SUM(oi.quantity * oi.price_at_order), 0) AS total_price,
          o.status,
          o.created_at,
          o.updated_at,
          u.name AS user_name,
          u.email AS user_email,
          u.phone AS user_phone
        FROM orders o
        JOIN users u ON o.user_id = u.user_id
        LEFT JOIN order_items oi ON o.order_id = oi.order_id
        WHERE o.order_id = ? AND o.user_id = ?
        GROUP BY o.order_id`,
        [orderId, userId]
      );

      if (!rows.length) throw new Error("Đơn hàng không tồn tại");
      const order = rows[0];

      const [items] = await db.promise().query(
        `SELECT 
          oi.order_item_id, 
          oi.order_id, 
          oi.book_id, 
          oi.quantity, 
          oi.price_at_order, 
          b.title AS book_title, 
          b.cover_image, 
          b.price
        FROM order_items oi
        JOIN books b ON oi.book_id = b.book_id
        WHERE oi.order_id = ?`,
        [orderId]
      );
      order.items = items;
      console.log("Order details:", order);
      return order;
    } catch (err) {
      console.error("Lỗi lấy chi tiết đơn hàng:", err.message);
      throw err;
    }
  }

  // Method for admin to get order details (no userId restriction)
  static async getAdminOrderDetails(orderId) {
    try {
      const [rows] = await db
        .promise()
        .query(
          "SELECT o.*, u.name AS user_name, u.email AS user_email, u.phone AS user_phone FROM orders o JOIN users u ON o.user_id = u.user_id WHERE o.order_id = ?",
          [orderId]
        );
      if (!rows.length) throw new Error("Đơn hàng không tồn tại");
      const order = rows[0];
      const [items] = await db
        .promise()
        .query(
          "SELECT oi.order_item_id, oi.order_id, oi.book_id, oi.quantity, oi.price_at_order, b.title AS book_title, b.price FROM order_items oi JOIN books b ON oi.book_id = b.book_id WHERE oi.order_id = ?",
          [orderId]
        );
      order.items = items;
      return order;
    } catch (err) {
      console.error("Lỗi lấy chi tiết đơn hàng cho admin:", err.message);
      throw err;
    }
  }

  static async confirmOrder(orderId, userId) {
    try {
      const [result] = await db
        .promise()
        .query(
          "UPDATE orders SET status = ? WHERE order_id = ? AND user_id = ?",
          ["pending", orderId, userId]
        );
      if (result.affectedRows === 0)
        throw new Error("Đơn hàng không tồn tại hoặc không thể xác nhận");
      console.log("Xác nhận đơn hàng thành công, orderId:", orderId);
    } catch (err) {
      console.error("Lỗi xác nhận đơn hàng:", err.message);
      throw err;
    }
  }

  static async getPendingOrders() {
    try {
      const [rows] = await db.promise().query(
        `SELECT o.order_id, u.name AS user_name, o.shipping_address, o.total_price, o.status, u.email AS user_email
                 FROM orders o
                 JOIN users u ON o.user_id = u.user_id
                 WHERE o.status = ?`,
        ["pending"]
      );
      return rows;
    } catch (err) {
      console.error("Lỗi lấy danh sách đơn hàng cần giao:", err.message);
      throw err;
    }
  }

  static async getAllOrders() {
    try {
      const [rows] = await db.promise().query(
        `SELECT 
          o.order_id,
          o.user_id,
          o.shipping_address,
          COALESCE(SUM(oi.quantity * oi.price_at_order), 0) AS total_price, 
          o.status,
          o.created_at,
          o.updated_at,
          u.email AS user_email,
          u.name AS user_name,
          u.phone AS user_phone
        FROM orders o
        LEFT JOIN order_items oi ON o.order_id = oi.order_id
        JOIN users u ON o.user_id = u.user_id
        GROUP BY o.order_id
        ORDER BY o.created_at DESC`
      );
      console.log("Backend getAllOrders result:", rows);
      return rows;
    } catch (err) {
      console.error("Lỗi lấy danh sách tất cả đơn hàng:", err.message);
      throw err;
    }
  }

  static async updateOrderStatus(orderId, status) {
    const connection = db.promise();
    await connection.beginTransaction();

    try {
      const [[orderRow]] = await connection.query(
        "SELECT status FROM orders WHERE order_id = ?",
        [orderId]
      );

      if (!orderRow) {
        throw new Error("Đơn hàng không tồn tại");
      }

      const previousStatus = orderRow.status;
      console.log(
        `Đang cập nhật trạng thái đơn hàng #${orderId} từ ${previousStatus} -> ${status}`
      );

      if (previousStatus === status) {
        console.log(
          `Trạng thái đơn hàng #${orderId} không thay đổi (${status}), bỏ qua cập nhật`
        );
        await connection.commit();
        return {
          previousStatus,
          newStatus: status,
          updated: false,
        };
      }

      await connection.query(
        "UPDATE orders SET status = ?, updated_at = NOW() WHERE order_id = ?",
        [status, orderId]
      );

      const [[orderInfo]] = await connection.query(
        "SELECT user_id FROM orders WHERE order_id = ?",
        [orderId]
      );
      const userId = orderInfo ? orderInfo.user_id : null;

      const [items] = await connection.query(
        "SELECT oi.book_id, oi.quantity, b.title FROM order_items oi LEFT JOIN books b ON oi.book_id = b.book_id WHERE oi.order_id = ?",
        [orderId]
      );

      const deductionStatuses = new Set(["paid", "shipped", "completed"]);
      const shouldDeduct =
        deductionStatuses.has(status) &&
        !deductionStatuses.has(previousStatus);
      const shouldRestore =
        deductionStatuses.has(previousStatus) &&
        !deductionStatuses.has(status);

      if (shouldDeduct || shouldRestore) {
        const deltaSign = shouldDeduct ? -1 : 1;

        for (const item of items) {
          const [[stockRow]] = await connection.query(
            "SELECT quantity FROM warehouse WHERE book_id = ? FOR UPDATE",
            [item.book_id]
          );

          if (!stockRow) {
            await connection.query(
              "INSERT INTO warehouse (book_id, quantity) VALUES (?, ?)",
              [item.book_id, 0]
            );
          }

          if (shouldDeduct && stockRow && stockRow.quantity < item.quantity) {
            console.log(
              `Kho không đủ hàng cho book_id=${item.book_id} (hiện có ${stockRow.quantity}, cần ${item.quantity}) nhưng vẫn tiếp tục xác nhận đơn`
            );
          }

          await connection.query(
            "UPDATE warehouse SET quantity = quantity + ? WHERE book_id = ?",
            [deltaSign * item.quantity, item.book_id]
          );
        }

        if (shouldDeduct) {
          console.log(
            `Đã trừ kho cho đơn hàng #${orderId} do trạng thái chuyển sang ${status}`
          );
        } else {
          console.log(
            `Đã cộng lại kho cho đơn hàng #${orderId} do trạng thái chuyển từ ${previousStatus} sang ${status}`
          );
        }
      }

      // Track purchase với số lượng lớn khi đơn hàng completed
      if (status === 'completed' && previousStatus !== 'completed' && userId) {
        const LARGE_QUANTITY_THRESHOLD = 3; // Ngưỡng số lượng lớn
        console.log(`[OrderModel] Kiểm tra track purchase cho đơn hàng #${orderId}, userId=${userId}, items=${items.length}`);
        try {
          const TrackingService = require('../services/TrackingService');
          let trackedCount = 0;
          for (const item of items) {
            console.log(`[OrderModel] Kiểm tra item: book_id=${item.book_id}, quantity=${item.quantity}, threshold=${LARGE_QUANTITY_THRESHOLD}`);
            if (item.quantity >= LARGE_QUANTITY_THRESHOLD) {
              // Tạo sessionId từ userId nếu không có
              const sessionId = `user:${userId}`;
              await TrackingService.logPurchase({
                userId: String(userId),
                sessionId: sessionId,
                productId: String(item.book_id),
                productName: item.title || `Book ${item.book_id}`,
                quantity: item.quantity,
                orderId: orderId
              });
              trackedCount++;
              console.log(`[OrderModel] Đã track purchase: book_id=${item.book_id}, quantity=${item.quantity}, title=${item.title}`);
            }
          }
          console.log(`[OrderModel] Tổng số sách đã track: ${trackedCount}/${items.length}`);
        } catch (trackError) {
          // Không throw error để không ảnh hưởng đến việc cập nhật order status
          console.error('[OrderModel] Lỗi khi track purchase:', trackError.message);
          console.error('[OrderModel] Stack trace:', trackError.stack);
        }
      }

      await connection.commit();
      return {
        previousStatus,
        newStatus: status,
        updated: true,
      };
    } catch (err) {
      await connection.rollback();
      console.error("Lỗi cập nhật trạng thái đơn hàng:", err.message);
      throw err;
    }
  }

  static async cancelOrder(orderId, userId) {
    const connection = db.promise();
    await connection.beginTransaction();

    try {
      const [[orderRow]] = await connection.query(
        "SELECT status FROM orders WHERE order_id = ? AND user_id = ?",
        [orderId, userId]
      );

      if (!orderRow) {
        throw new Error("Đơn hàng không tồn tại hoặc bạn không có quyền hủy");
      }

      const previousStatus = orderRow.status;

      if (previousStatus === "cancelled") {
        console.log(
          `Đơn hàng #${orderId} đã ở trạng thái cancelled, bỏ qua yêu cầu hủy`
        );
        await connection.commit();
        return {
          previousStatus,
          newStatus: "cancelled",
          updated: false,
        };
      }

      if (["shipped", "completed"].includes(previousStatus)) {
        throw new Error("Đơn hàng đã được xử lý, không thể hủy");
      }

      await connection.query(
        "UPDATE orders SET status = 'cancelled', updated_at = NOW() WHERE order_id = ?",
        [orderId]
      );

      const deductionStatuses = new Set(["paid", "shipped", "completed"]);

      if (deductionStatuses.has(previousStatus)) {
        const [items] = await connection.query(
          "SELECT book_id, quantity FROM order_items WHERE order_id = ?",
          [orderId]
        );

        for (const item of items) {
          const [[stockRow]] = await connection.query(
            "SELECT quantity FROM warehouse WHERE book_id = ? FOR UPDATE",
            [item.book_id]
          );

          if (!stockRow) {
            await connection.query(
              "INSERT INTO warehouse (book_id, quantity) VALUES (?, ?)",
              [item.book_id, 0]
            );
          }

          await connection.query(
            "UPDATE warehouse SET quantity = quantity + ? WHERE book_id = ?",
            [item.quantity, item.book_id]
          );
        }
      }

      await connection.commit();
      console.log(`User ${userId} đã hủy đơn hàng #${orderId}`);
      return {
        previousStatus,
        newStatus: "cancelled",
        updated: true,
      };
    } catch (err) {
      await connection.rollback();
      console.error("Lỗi khi hủy đơn hàng:", err.message);
      throw err;
    }
  }

  static async getLifetimeStats() {
    const [overallRows] = await db
      .promise()
      .query(
        `SELECT 
           COUNT(*) AS total_orders, 
           COALESCE(SUM(total_price), 0) AS total_revenue
         FROM orders`
      );

    const [successfulRows] = await db
      .promise()
      .query(
        `SELECT 
           COUNT(*) AS total_orders, 
           COALESCE(SUM(total_price), 0) AS total_revenue
         FROM orders
         WHERE status IN ('paid', 'shipped', 'completed')`
      );

    const overall = overallRows[0] || {};
    const successful = successfulRows[0] || {};

    return {
      total_orders_all: Number(overall.total_orders || 0),
      total_revenue_all: Number(overall.total_revenue || 0),
      successful_orders: Number(successful.total_orders || 0),
      successful_revenue: Number(successful.total_revenue || 0),
    };
  }

  static async deleteOrder(orderId) {
    try {
      const [[orderRow]] = await db
        .promise()
        .query("SELECT status FROM orders WHERE order_id = ?", [orderId]);

      if (!orderRow) throw new Error("Đơn hàng không tồn tại");

      const deductionStatuses = new Set(["paid", "shipped", "completed"]);
      const shouldRestore = deductionStatuses.has(orderRow.status);

      const [orderItems] = await db
        .promise()
        .query("SELECT book_id, quantity FROM order_items WHERE order_id = ?", [
          orderId,
        ]);

      if (shouldRestore) {
        for (const item of orderItems) {
          const [[stockRow]] = await db
            .promise()
            .query(
              "SELECT quantity FROM warehouse WHERE book_id = ? FOR UPDATE",
              [item.book_id]
            );

          if (!stockRow) {
            await db
              .promise()
              .query(
                "INSERT INTO warehouse (book_id, quantity) VALUES (?, ?)",
                [item.book_id, 0]
              );
          }

          await db
            .promise()
            .query(
              "UPDATE warehouse SET quantity = quantity + ? WHERE book_id = ?",
              [item.quantity, item.book_id]
            );
        }
      }

      // Delete order items first (foreign key constraint)
      await db
        .promise()
        .query("DELETE FROM order_items WHERE order_id = ?", [orderId]);

      // Delete the order
      const [result] = await db
        .promise()
        .query("DELETE FROM orders WHERE order_id = ?", [orderId]);

      if (result.affectedRows === 0) throw new Error("Đơn hàng không tồn tại");

      console.log("Xóa đơn hàng thành công, orderId:", orderId);
      return { success: true, message: "Đơn hàng đã được xóa thành công" };
    } catch (err) {
      console.error("Lỗi xóa đơn hàng:", err.message);
      throw err;
    }
  }

  // Lấy đơn hàng của user
  static async getUserOrders(userId) {
  try {
    console.log("[OrderModel] getUserOrders - userId:", userId);

    if (!userId || isNaN(userId)) {
      throw new Error("User ID không hợp lệ");
    }

    // Lấy danh sách đơn hàng + tổng tiền chính xác
    const [orders] = await db.promise().query(
      `
      SELECT 
          o.order_id,
          o.user_id,
          o.shipping_address,
          COALESCE(SUM(oi.quantity * oi.price_at_order), 0) AS total_price,
          o.status,
          o.created_at,
          o.updated_at,
          u.name AS user_name,
          u.email AS user_email,
          u.phone AS user_phone
      FROM orders o
      LEFT JOIN order_items oi ON o.order_id = oi.order_id
      JOIN users u ON o.user_id = u.user_id
      WHERE o.user_id = ?
      GROUP BY o.order_id
      ORDER BY o.created_at DESC
      `,
      [userId]
    );

    // Lấy chi tiết từng sản phẩm theo order_id
    const [items] = await db.promise().query(
      `
      SELECT 
          oi.order_id,
          oi.book_id,
          oi.quantity,
          oi.price_at_order,
          b.title AS book_title,
          a.name AS book_author,
          b.cover_image AS book_image
      FROM order_items oi
      JOIN books b ON oi.book_id = b.book_id
      LEFT JOIN authors a ON b.author_id = a.author_id
      WHERE oi.order_id IN (
        SELECT order_id FROM orders WHERE user_id = ?
      )
      `,
      [userId]
    );

    // Gộp items vào từng đơn
    const result = orders.map(order => ({
      ...order,
      items: items.filter(i => i.order_id === order.order_id),
    }));

    console.log("[OrderModel] getUserOrders - Kết quả cuối:", result.length);
    return result;
  } catch (err) {
    console.error("[OrderModel] getUserOrders - Lỗi:", err.message);
    throw err;
  }
}


  // Tổng tiền thu được theo ngày/tháng
  static async getRevenue({ type = "day", date }) {
    let query = "";
    let params = [];
    if (type === "day") {
      query = `SELECT DATE(created_at) AS day, SUM(total_price) AS revenue, COUNT(order_id) AS total_orders
                     FROM orders
                     WHERE status IN ('paid','shipped','completed')
                     AND DATE(created_at) = ?
                     GROUP BY day`;
      params = [date];
    } else if (type === "month") {
      query = `SELECT DATE_FORMAT(created_at, '%Y-%m') AS month, SUM(total_price) AS revenue, COUNT(order_id) AS total_orders
                     FROM orders
                     WHERE status IN ('paid','shipped','completed')
                     AND DATE_FORMAT(created_at, '%Y-%m') = ?
                     GROUP BY month`;
      params = [date];
    }
    const [rows] = await db.promise().query(query, params);
    return rows[0] || {};
  }

  // Thống kê số lượng từng sản phẩm bán được theo ngày/tháng
  static async getProductStats({ type = "day", date }) {
    let query = "";
    let params = [];
    if (type === "day") {
      query = `SELECT oi.book_id, b.title, SUM(oi.quantity) AS sold_quantity
                     FROM order_items oi
                     JOIN orders o ON oi.order_id = o.order_id
                     JOIN books b ON oi.book_id = b.book_id
                     WHERE o.status IN ('paid','shipped','completed')
                     AND DATE(o.created_at) = ?
                     GROUP BY oi.book_id, b.title`;
      params = [date];
    } else if (type === "month") {
      query = `SELECT oi.book_id, b.title, SUM(oi.quantity) AS sold_quantity
                     FROM order_items oi
                     JOIN orders o ON oi.order_id = o.order_id
                     JOIN books b ON oi.book_id = b.book_id
                     WHERE o.status IN ('paid','shipped','completed')
                     AND DATE_FORMAT(o.created_at, '%Y-%m') = ?
                     GROUP BY oi.book_id, b.title`;
      params = [date];
    }
    const [rows] = await db.promise().query(query, params);
    return rows;
  }

  // Thống kê doanh thu từng ngày trong tháng (cho biểu đồ)
  static async getDailyRevenueOfMonth(month) {
    const query = `SELECT DATE(created_at) AS day, SUM(total_price) AS revenue, COUNT(order_id) AS total_orders
                       FROM orders
                       WHERE status IN ('paid','shipped','completed')
                       AND DATE_FORMAT(created_at, '%Y-%m') = ?
                       GROUP BY day
                       ORDER BY day ASC`;
    const [rows] = await db.promise().query(query, [month]);
    return rows;
  }

  // Thống kê doanh thu từng tháng trong năm (cho biểu đồ)
  static async getMonthlyRevenueOfYear(year) {
    const query = `SELECT DATE_FORMAT(created_at, '%Y-%m') AS month, SUM(total_price) AS revenue, COUNT(order_id) AS total_orders
                       FROM orders
                       WHERE status IN ('paid','shipped','completed')
                       AND YEAR(created_at) = ?
                       GROUP BY month
                       ORDER BY month ASC`;
    const [rows] = await db.promise().query(query, [year]);
    return rows;
  }
}

module.exports = OrderModel;
