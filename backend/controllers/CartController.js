const CartModel = require('../models/CartModel'); // Nhập model giỏ hàng

class CartController {
    // Hàm xử lý thêm sản phẩm vào giỏ hàng
    static addToCart(req, res) {
        const { book_id, quantity } = req.body; // Lấy book_id và quantity từ body request
        const userId = req.user.userId; // Lấy userId từ token đã giải mã

        CartModel.addToCart(userId, book_id, quantity, (err, result) => { // Gọi hàm model với callback
            if (err) { // Xử lý lỗi nếu có
                console.log(err); // In lỗi ra console để debug
                return res.status(500).json({ error: 'Lỗi khi thêm sản phẩm vào giỏ hàng' });
            }
            res.status(200).json({ message: 'Sản phẩm đã được thêm vào giỏ hàng' }); // Trả về thành công
        });
    }

    // Hàm xử lý xóa sản phẩm khỏi giỏ hàng
    static removeFromCart(req, res) {
        const { cart_item_id } = req.params; // Lấy cart_item_id từ URL params, sửa từ cartItemId thành cart_item_id
        const userId = req.user.userId; // Lấy userId từ token

        if (!cart_item_id) {
            return res.status(400).json({ error: 'Thiếu cart_item_id trong yêu cầu' }); // Kiểm tra nếu không có ID
        }

        console.log('Controller removeFromCart gọi với:', { userId, cart_item_id }); // Debug log
        CartModel.removeFromCart(userId, cart_item_id, (err, result) => { // Gọi model với callback
            if (err) { // Xử lý lỗi
                console.log('Lỗi từ model removeFromCart:', err.message); // Log lỗi chi tiết
                return res.status(500).json({ error: 'Lỗi khi xóa sản phẩm khỏi giỏ hàng: ' + err.message });
            }
            res.status(200).json(result || { message: 'Sản phẩm đã được xóa khỏi giỏ hàng' }); // Trả về thành công
        });
    }

    // Hàm xử lý xem chi tiết giỏ hàng
    static getCartDetails(req, res) {
        const userId = req.user.userId; // Lấy userId từ token

        CartModel.getCartDetails(userId, (err, cartDetails) => { // Gọi model với callback
            if (err) { // Xử lý lỗi
                console.log('Lỗi lấy chi tiết giỏ hàng:', err.message); // Log lỗi chi tiết
                return res.status(500).json({ error: 'Lỗi khi lấy chi tiết giỏ hàng: ' + err.message });
            }
            res.status(200).json(cartDetails); // Trả về chi tiết giỏ hàng
        });
    }

    // Hàm xử lý cập nhật số lượng sản phẩm trong giỏ hàng
    static updateQuantity(req, res) {
        const { cart_item_id } = req.params; // Lấy cart_item_id từ tham số URL
        const { quantity } = req.body; // Lấy quantity từ body request
        const userId = req.user.userId; // Lấy userId từ token

        CartModel.updateQuantity(userId, cart_item_id, quantity, (err, result) => { // Gọi hàm model với callback
            if (err) { // Xử lý lỗi nếu có
                console.log(err); // In lỗi ra console
                return res.status(500).json({ error: 'Lỗi khi cập nhật số lượng sản phẩm' });
            }
            res.status(200).json({ message: 'Số lượng sản phẩm đã được cập nhật' }); // Trả về thành công
        });
    }

    // Hàm xử lý xóa toàn bộ giỏ hàng
    static clearCart(req, res) {
        const userId = req.user.userId; // Lấy userId từ token

        CartModel.clearCart(userId, (err, result) => { // Gọi model với callback
            if (err) { // Xử lý lỗi
                console.log('Lỗi xóa giỏ hàng:', err.message); // Log lỗi chi tiết
                return res.status(500).json({ error: 'Lỗi khi xóa giỏ hàng: ' + err.message });
            }
            res.status(200).json(result || { message: 'Giỏ hàng đã được xóa hoàn toàn' }); // Trả về thành công
        });
    }
}

module.exports = CartController; // Xuất controller để sử dụng trong route