/**
 * Cart API Service - Quản lý các API liên quan đến giỏ hàng
 */

import BaseApiService from './baseApi.js';

class CartApiService extends BaseApiService {
  // ==================== CART ====================
  async getCart(userId) {
    try {
      console.log(`🛒 [CartAPI] Đang lấy giỏ hàng của user ID: ${userId}`);
      const result = await this.apiCall(`/cart/${userId}`);
      console.log(`🛒 [CartAPI] Kết quả lấy giỏ hàng:`, result);
      return result;
    } catch (error) {
      console.error(`💥 [CartAPI] Lỗi khi lấy giỏ hàng của user ID ${userId}:`, error);
      throw error;
    }
  }

  async getCartDetails() {
    try {
      console.log(`🛒 [CartAPI] Đang lấy chi tiết giỏ hàng`);
      const result = await this.apiCall('/cart/details');
      console.log(`🛒 [CartAPI] Kết quả lấy chi tiết giỏ hàng:`, result);
      return result;
    } catch (error) {
      console.error(`💥 [CartAPI] Lỗi khi lấy chi tiết giỏ hàng:`, error);
      throw error;
    }
  }

  async addToCart(cartData) {
    try {
      console.log(`🛒 [CartAPI] Đang thêm sản phẩm vào giỏ hàng với dữ liệu:`, cartData);
      const result = await this.apiCall('/cart/add', {
        method: 'POST',
        body: JSON.stringify(cartData)
      });
      console.log(`🛒 [CartAPI] Kết quả thêm vào giỏ hàng:`, result);
      return result;
    } catch (error) {
      console.error(`💥 [CartAPI] Lỗi khi thêm sản phẩm vào giỏ hàng:`, error);
      throw error;
    }
  }

  async updateCartItem(cartItemId, quantity) {
    try {
      console.log(`🛒 [CartAPI] Đang cập nhật số lượng sản phẩm ID ${cartItemId} thành ${quantity}`);
      const result = await this.apiCall(`/cart/update/${cartItemId}`, {
        method: 'PUT',
        body: JSON.stringify({ quantity })
      });
      console.log(`🛒 [CartAPI] Kết quả cập nhật giỏ hàng:`, result);
      return result;
    } catch (error) {
      console.error(`💥 [CartAPI] Lỗi khi cập nhật giỏ hàng ID ${cartItemId}:`, error);
      throw error;
    }
  }

  async removeFromCart(cartItemId) {
    try {
      console.log(`🛒 [CartAPI] Đang xóa sản phẩm ID ${cartItemId} khỏi giỏ hàng`);
      const result = await this.apiCall(`/cart/remove/${cartItemId}`, {
        method: 'DELETE'
      });
      console.log(`🛒 [CartAPI] Kết quả xóa khỏi giỏ hàng:`, result);
      return result;
    } catch (error) {
      console.error(`💥 [CartAPI] Lỗi khi xóa sản phẩm khỏi giỏ hàng ID ${cartItemId}:`, error);
      throw error;
    }
  }

  async clearCart() {
    try {
      console.log(`🛒 [CartAPI] Đang xóa toàn bộ giỏ hàng`);
      const result = await this.apiCall('/cart/clear', {
        method: 'DELETE'
      });
      console.log(`🛒 [CartAPI] Kết quả xóa giỏ hàng:`, result);
      return result;
    } catch (error) {
      console.error(`💥 [CartAPI] Lỗi khi xóa giỏ hàng:`, error);
      throw error;
    }
  }
}

export default new CartApiService();