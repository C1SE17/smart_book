const db = require('../config/db');

class CartModel {
    // Hàm thêm sản phẩm vào giỏ hàng
    static addToCart(userId, bookId, quantity, callback) {
        console.log('🛒 [CartModel] ===========================================');
        console.log('🛒 [CartModel] Bắt đầu thêm sản phẩm vào giỏ hàng...');
        console.log('🛒 [CartModel] Input:', { userId, bookId, quantity });

        db.query('SELECT cart_id FROM carts WHERE user_id = ?', [userId], (err, cart) => { // Lấy cart_id của user
            if (err) {
                console.error('💥 [CartModel] Lỗi khi lấy cart_id:', err);
                return callback(err);
            }
            console.log('🛒 [CartModel] Cart query result:', cart);
            let cartId = cart[0]?.cart_id;

            if (!cartId) { // Nếu chưa có giỏ hàng, tạo mới
                console.log('🛒 [CartModel] Tạo cart mới cho user:', userId);
                db.query('INSERT INTO carts (user_id) VALUES (?)', [userId], (err, result) => {
                    if (err) {
                        console.error('💥 [CartModel] Lỗi khi tạo cart mới:', err);
                        return callback(err);
                    }
                    cartId = result.insertId;
                    console.log('✅ [CartModel] Đã tạo cart mới với ID:', cartId);
                    checkExistingItem();
                });
            } else {
                console.log('🛒 [CartModel] Sử dụng cart hiện có với ID:', cartId);
                checkExistingItem();
            }

            function checkExistingItem() { // Kiểm tra sản phẩm đã tồn tại trong giỏ chưa
                console.log('🛒 [CartModel] Kiểm tra item đã tồn tại trong cart:', { cartId, bookId });
                db.query('SELECT * FROM cart_items WHERE cart_id = ? AND book_id = ?', [cartId, bookId], (err, existingItem) => {
                    if (err) {
                        console.error('💥 [CartModel] Lỗi khi kiểm tra existing item:', err);
                        return callback(err);
                    }
                    console.log('🛒 [CartModel] Existing item result:', existingItem);

                    if (existingItem.length > 0) { // Nếu tồn tại, cập nhật quantity
                        console.log('🛒 [CartModel] Cập nhật quantity cho item hiện có');
                        db.query('UPDATE cart_items SET quantity = quantity + ? WHERE cart_item_id = ?', [quantity, existingItem[0].cart_item_id], (err, result) => {
                            if (err) {
                                console.error('💥 [CartModel] Lỗi khi cập nhật quantity:', err);
                                return callback(err);
                            }
                            console.log('✅ [CartModel] Đã cập nhật quantity thành công:', result);
                            callback(null, result);
                        });
                    } else { // Nếu không, thêm mới
                        console.log('🛒 [CartModel] Thêm item mới vào cart');
                        db.query('INSERT INTO cart_items (cart_id, book_id, quantity) VALUES (?, ?, ?)', [cartId, bookId, quantity], (err, result) => {
                            if (err) {
                                console.error('💥 [CartModel] Lỗi khi thêm item mới:', err);
                                return callback(err);
                            }
                            console.log('✅ [CartModel] Đã thêm item mới thành công:', result);
                            callback(null, result);
                        });
                    }
                });
            }
        });
    }

    // Hàm xóa sản phẩm khỏi giỏ hàng
    static removeFromCart(userId, cartItemId, callback) {
        // Bước 1: Lấy cart_id của user
        db.query('SELECT cart_id FROM carts WHERE user_id = ?', [userId], (err, cartResult) => {
            if (err) return callback(err);
            if (!cartResult.length) return callback(new Error('Giỏ hàng không tồn tại'));

            const cartId = cartResult[0].cart_id;
            
            // Bước 2: Kiểm tra sản phẩm có thuộc giỏ hàng của user không
            db.query('SELECT * FROM cart_items WHERE cart_item_id = ? AND cart_id = ?', [cartItemId, cartId], (err, itemResult) => {
                if (err) return callback(err);
                if (!itemResult.length) return callback(new Error('Sản phẩm không tồn tại trong giỏ hàng của bạn'));

                // Bước 3: Xóa sản phẩm khỏi cart_items
                db.query('DELETE FROM cart_items WHERE cart_item_id = ?', [cartItemId], (err) => {
                    if (err) return callback(err);
                    
                    // Bước 4: Kiểm tra xem giỏ hàng còn sản phẩm nào không
                    db.query('SELECT COUNT(*) as count FROM cart_items WHERE cart_id = ?', [cartId], (err, countResult) => {
                        if (err) return callback(err);
                        
                        // Bước 5: Nếu giỏ hàng trống, xóa luôn giỏ hàng
                        if (countResult[0].count === 0) {
                            db.query('DELETE FROM carts WHERE cart_id = ?', [cartId], (err) => {
                                if (err) return callback(err);
                                return callback(null, { message: 'Sản phẩm đã được xóa và giỏ hàng trống' });
                            });
                        } else {
                            return callback(null, { message: 'Sản phẩm đã được xóa khỏi giỏ hàng' });
                        }
                    });
                });
            });
        });
    }

    // Hàm xem chi tiết giỏ hàng
    static getCartDetails(userId, callback) {
        console.log('🛒 [CartModel] ===========================================');
        console.log('🛒 [CartModel] Bắt đầu lấy chi tiết giỏ hàng...');
        console.log('🛒 [CartModel] User ID:', userId);

        // Bước 1: Lấy cart_id của user
        db.query('SELECT cart_id FROM carts WHERE user_id = ?', [userId], (err, cartResult) => {
            if (err) {
                console.error('💥 [CartModel] Lỗi khi lấy cart_id:', err);
                return callback(err);
            }
            console.log('🛒 [CartModel] Cart result:', cartResult);
            
            if (!cartResult.length) {
                console.log('🛒 [CartModel] User chưa có cart, trả về giỏ hàng trống');
                return callback(null, { cart: [], totalItems: 0, totalPrice: 0 }); // Trả về giỏ hàng trống
            }

            const cartId = cartResult[0].cart_id;
            console.log('🛒 [CartModel] Cart ID:', cartId);
            
            // Bước 2: Lấy danh sách sản phẩm trong giỏ hàng và join với bảng books
            db.query(`
                SELECT 
                    ci.cart_item_id, 
                    ci.cart_id, 
                    ci.book_id, 
                    ci.quantity, 
                    b.title AS book_title, 
                    b.price,
                    (ci.quantity * b.price) AS total_price
                FROM cart_items ci 
                JOIN books b ON ci.book_id = b.book_id 
                WHERE ci.cart_id = ?
                ORDER BY ci.created_at DESC
            `, [cartId], (err, cartItems) => {
                if (err) {
                    console.error('💥 [CartModel] Lỗi khi lấy cart items:', err);
                    return callback(err);
                }
                
                console.log('🛒 [CartModel] Cart items:', cartItems);
                
                // Bước 3: Tính tổng số lượng và tổng giá
                const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
                const totalPrice = cartItems.reduce((sum, item) => sum + item.total_price, 0);
                
                const result = { 
                    cart: cartItems, 
                    totalItems, 
                    totalPrice,
                    cartId 
                };
                
                console.log('✅ [CartModel] Kết quả getCartDetails:', result);
                callback(null, result);
            });
        });
    }

    // Hàm cập nhật số lượng sản phẩm trong giỏ hàng
    static updateQuantity(userId, cartItemId, quantity, callback) {
        if (quantity <= 0) return callback(new Error('Số lượng phải lớn hơn 0'));

        db.query('SELECT cart_id FROM carts WHERE user_id = ?', [userId], (err, cart) => { // Lấy cart_id
            if (err) return callback(err);
            if (!cart.length) return callback(new Error('Giỏ hàng không tồn tại'));

            const cartId = cart[0].cart_id;
            db.query('SELECT * FROM cart_items WHERE cart_item_id = ? AND cart_id = ?', [cartItemId, cartId], (err, item) => { // Kiểm tra sản phẩm
                if (err) return callback(err);
                if (!item.length) return callback(new Error('Sản phẩm không tồn tại trong giỏ hàng'));

                db.query('UPDATE cart_items SET quantity = ? WHERE cart_item_id = ?', [quantity, cartItemId], callback); // Cập nhật quantity
            });
        });
    }

    // Hàm xóa toàn bộ giỏ hàng
    static clearCart(userId, callback) {
        // Bước 1: Lấy cart_id của user
        db.query('SELECT cart_id FROM carts WHERE user_id = ?', [userId], (err, cartResult) => {
            if (err) return callback(err);
            if (!cartResult.length) return callback(null, { message: 'Giỏ hàng đã trống' });

            const cartId = cartResult[0].cart_id;
            
            // Bước 2: Xóa tất cả sản phẩm trong giỏ hàng
            db.query('DELETE FROM cart_items WHERE cart_id = ?', [cartId], (err) => {
                if (err) return callback(err);
                
                // Bước 3: Xóa giỏ hàng
                db.query('DELETE FROM carts WHERE cart_id = ?', [cartId], (err) => {
                    if (err) return callback(err);
                    callback(null, { message: 'Giỏ hàng đã được xóa hoàn toàn' });
                });
            });
        });
    }
}

module.exports = CartModel; // Xuất model để sử dụng trong controller