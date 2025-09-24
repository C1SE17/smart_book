const db = require('../config/db'); // Nhập kết nối từ db.js

class OrderModel {
    static async createDraftOrder(userId, bookId, quantity, shippingAddress) {
        try {
            console.log('Bắt đầu tạo đơn tạm cho userId:', userId, 'bookId:', bookId);

            // Lấy giá sách
            const [bookRows] = await db.promise().query('SELECT price FROM books WHERE book_id = ? LIMIT 1', [bookId]);
            if (!bookRows.length) throw new Error('Sản phẩm không tồn tại');
            const price = bookRows[0].price;
            const totalAmount = quantity * price;

            // Tạo đơn tạm (draft) - sử dụng status là chuỗi
            const [orderResult] = await db.promise().query(
                'INSERT INTO orders (user_id, status, total_price, shipping_address) VALUES (?, ?, ?, ?)',
                [userId, 'draft', totalAmount, shippingAddress || '']
            );
            const orderId = orderResult.insertId;

            // Thêm item vào order_items
            await db.promise().query(
                'INSERT INTO order_items (order_id, book_id, quantity, price_at_order) VALUES (?, ?, ?, ?)',
                [orderId, bookId, quantity, price]
            );

            console.log('Tạo đơn tạm thành công, orderId:', orderId);
            return { order_id: orderId, total_amount: totalAmount };
        } catch (err) {
            console.error('Lỗi tạo đơn tạm:', err.message);
            throw err;
        }
    }

    static async createOrderFromCart(userId, selectedCartItemIds, shippingAddress) {
        try {
            console.log('Bắt đầu tạo đơn từ giỏ hàng cho userId:', userId);

            // Lấy cart_id
            const [cartRows] = await db.promise().query('SELECT cart_id FROM carts WHERE user_id = ? LIMIT 1', [userId]);
            if (!cartRows.length) throw new Error('Giỏ hàng không tồn tại');
            const cartId = cartRows[0].cart_id;

            if (!selectedCartItemIds || !Array.isArray(selectedCartItemIds) || selectedCartItemIds.length === 0) {
                throw new Error('Không có sản phẩm nào được chọn');
            }

            // Tính total_amount từ cart_items đã chọn
            const [totalResult] = await db.promise().query(
                'SELECT SUM(ci.quantity * b.price) as total FROM cart_items ci JOIN books b ON ci.book_id = b.book_id WHERE ci.cart_id = ? AND ci.cart_item_id IN (?)',
                [cartId, selectedCartItemIds]
            );
            const totalAmount = totalResult[0].total || 0;

            // Tạo đơn hàng (pending)
            const [orderResult] = await db.promise().query(
                'INSERT INTO orders (user_id, status, total_price, shipping_address) VALUES (?, ?, ?, ?)',
                [userId, 'pending', totalAmount, shippingAddress || '']
            );
            const orderId = orderResult.insertId;

            // Chuyển cart_items sang order_items - chỉ định rõ ci.book_id
            await db.promise().query(
                'INSERT INTO order_items (order_id, book_id, quantity, price_at_order) SELECT ?, ci.book_id, quantity, b.price FROM cart_items ci JOIN books b ON ci.book_id = b.book_id WHERE ci.cart_id = ? AND ci.cart_item_id IN (?)',
                [orderId, cartId, selectedCartItemIds]
            );

            // Xóa cart_items đã chọn
            await db.promise().query('DELETE FROM cart_items WHERE cart_id = ? AND cart_item_id IN (?)', [cartId, selectedCartItemIds]);

            // Xóa cart nếu trống
            const [remainingItems] = await db.promise().query('SELECT COUNT(*) as count FROM cart_items WHERE cart_id = ?', [cartId]);
            if (remainingItems[0].count === 0) {
                await db.promise().query('DELETE FROM carts WHERE cart_id = ?', [cartId]);
            }

            console.log('Tạo đơn từ giỏ hàng thành công, orderId:', orderId);
            return { order_id: orderId, total_amount: totalAmount };
        } catch (err) {
            console.error('Lỗi tạo đơn từ giỏ hàng:', err.message);
            throw err;
        }
    }

    static async getOrderDetails(orderId, userId) {
        try {
            const [rows] = await db.promise().query(
                'SELECT * FROM orders WHERE order_id = ? AND user_id = ?', [orderId, userId]
            );
            if (!rows.length) throw new Error('Đơn hàng không tồn tại');
            const order = rows[0];
            const [items] = await db.promise().query(
                'SELECT oi.order_item_id, oi.order_id, oi.book_id, oi.quantity, b.title AS book_title, b.price FROM order_items oi JOIN books b ON oi.book_id = b.book_id WHERE oi.order_id = ?',
                [orderId]
            );
            order.items = items;
            return order;
        } catch (err) {
            console.error('Lỗi lấy chi tiết đơn hàng:', err.message);
            throw err;
        }
    }

    static async confirmOrder(orderId, userId) {
        try {
            const [result] = await db.promise().query(
                'UPDATE orders SET status = ? WHERE order_id = ? AND user_id = ?', ['pending', orderId, userId]
            );
            if (result.affectedRows === 0) throw new Error('Đơn hàng không tồn tại hoặc không thể xác nhận');
            console.log('Xác nhận đơn hàng thành công, orderId:', orderId);
        } catch (err) {
            console.error('Lỗi xác nhận đơn hàng:', err.message);
            throw err;
        }
    }

    static async getPendingOrders() {
        try {
            const [rows] = await db.promise().query(
                'SELECT o.order_id, o.user_id, o.shipping_address, o.total_price, o.status, u.email AS user_email FROM orders o JOIN users u ON o.user_id = u.user_id WHERE o.status = ?',
                ['pending']
            );
            return rows;
        } catch (err) {
            console.error('Lỗi lấy danh sách đơn hàng cần giao:', err.message);
            throw err;
        }
    }

    static async updateOrderStatus(orderId, status) {
        try {
            const [result] = await db.promise().query(
                'UPDATE orders SET status = ? WHERE order_id = ?', [status, orderId]
            );
            if (result.affectedRows === 0) throw new Error('Đơn hàng không tồn tại');
            console.log('Cập nhật trạng thái đơn hàng thành công, orderId:', orderId);
        } catch (err) {
            console.error('Lỗi cập nhật trạng thái đơn hàng:', err.message);
            throw err;
        }
    }
}

module.exports = OrderModel;