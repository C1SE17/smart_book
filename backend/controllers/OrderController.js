const OrderModel = require('../models/OrderModel');

class OrderController {
    static async purchase(req, res) {
        const userId = req.user.userId;
        const { book_id, quantity, shipping_address } = req.body;

        try {
            if (!book_id) throw new Error('Thiếu book_id');
            const result = await OrderModel.createDraftOrder(userId, book_id, quantity || 1, shipping_address || '');
            res.status(200).json({ message: 'Đơn hàng tạm đã được tạo', order_id: result.order_id, total_amount: result.total_amount });
        } catch (err) {
            console.error('Lỗi khi đặt hàng:', err.message);
            res.status(500).json({ error: 'Lỗi khi đặt hàng: ' + err.message });
        }
    }

    static async checkout(req, res) {
        const userId = req.user.userId;
        const { selected_cart_item_ids, shipping_address } = req.body;

        try {
            if (!selected_cart_item_ids || !Array.isArray(selected_cart_item_ids)) throw new Error('Thiếu hoặc định dạng selected_cart_item_ids không hợp lệ');
            const result = await OrderModel.createOrderFromCart(userId, selected_cart_item_ids, shipping_address || '');
            res.status(200).json({ message: 'Đơn hàng đã được đặt thành công, đang chờ xử lý', order_id: result.order_id, total_amount: result.total_amount });
        } catch (err) {
            console.error('Lỗi khi đặt hàng từ giỏ:', err.message);
            res.status(500).json({ error: 'Lỗi khi đặt hàng: ' + err.message });
        }
    }

    static async getOrderConfirmation(req, res) {
        const { order_id } = req.params;
        const userId = req.user.userId;

        try {
            const order = await OrderModel.getOrderDetails(order_id, userId);
            res.status(200).json(order);
        } catch (err) {
            console.error('Lỗi khi lấy chi tiết đơn hàng:', err.message);
            res.status(500).json({ error: 'Lỗi khi lấy chi tiết đơn hàng: ' + err.message });
        }
    }

    static async confirmOrder(req, res) {
        const { order_id } = req.params;
        const userId = req.user.userId;

        try {
            await OrderModel.confirmOrder(order_id, userId);
            res.status(200).json({ message: 'Đơn hàng đã được xác nhận và gửi đến admin' });
        } catch (err) {
            console.error('Lỗi khi xác nhận đơn hàng:', err.message);
            res.status(500).json({ error: 'Lỗi khi xác nhận đơn hàng: ' + err.message });
        }
    }

    static async getPendingOrders(req, res) {
        try {
            const orders = await OrderModel.getPendingOrders();
            res.status(200).json(orders);
        } catch (err) {
            console.error('Lỗi khi lấy danh sách đơn hàng cần giao:', err.message);
            res.status(500).json({ error: 'Lỗi khi lấy danh sách đơn hàng cần giao: ' + err.message });
        }
    }

    static async updateOrderStatus(req, res) {
        const { order_id } = req.params;
        const { status } = req.body;

        if (!['pending', 'paid', 'shipped', 'completed', 'cancelled'].includes(status)) {
            return res.status(400).json({ error: 'Trạng thái không hợp lệ' });
        }

        try {
            await OrderModel.updateOrderStatus(order_id, status);
            res.status(200).json({ message: 'Cập nhật trạng thái đơn hàng thành công' });
        } catch (err) {
            console.error('Lỗi khi cập nhật trạng thái đơn hàng:', err.message);
            res.status(500).json({ error: 'Lỗi khi cập nhật trạng thái đơn hàng: ' + err.message });
        }
    }
}

module.exports = OrderController;