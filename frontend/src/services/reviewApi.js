/**
 * Review API Service - Quản lý các API liên quan đến đánh giá
 */

import BaseApiService from './baseApi.js';

class ReviewApiService extends BaseApiService {
  // ==================== REVIEWS ====================
  async getReviews(params = {}) {
    try {
      console.log(`[ReviewAPI] Đang lấy danh sách đánh giá với tham số:`, params);

      // Nếu có book_id thì gọi endpoint RESTful /book/:book_id
      let endpoint = '/reviews';
      if (params.book_id) {
        endpoint = `/reviews/book/${params.book_id}`;
      }

      // (Nếu cần thêm phân trang hoặc filter, bạn có thể nối thêm query phía sau)
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (queryParams.toString()) {
        endpoint += `?${queryParams.toString()}`;
      }

      console.log(`[ReviewAPI] Endpoint cuối cùng: ${endpoint}`);
      const result = await this.apiCall(endpoint);
      console.log(`[ReviewAPI] Kết quả lấy danh sách đánh giá:`, result);
      return result;
    } catch (error) {
      console.error(`[ReviewAPI] Lỗi khi lấy danh sách đánh giá:`, error);
      throw error;
    }
  }

  async getReviewById(id) {
    try {
      console.log(`[ReviewAPI] Đang lấy đánh giá theo ID: ${id}`);
      const result = await this.apiCall(`/reviews/${id}`);
      console.log(`[ReviewAPI] Kết quả lấy đánh giá:`, result);
      return result;
    } catch (error) {
      console.error(`[ReviewAPI] Lỗi khi lấy đánh giá ID ${id}:`, error);
      throw error;
    }
  }

  async createReview(reviewData) {
    try {
      console.log(`[ReviewAPI] Đang tạo đánh giá mới với dữ liệu:`, reviewData);
      const result = await this.apiCall('/reviews', {
        method: 'POST',
        body: JSON.stringify(reviewData)
      });
      console.log(`[ReviewAPI] Kết quả tạo đánh giá:`, result);
      return result;
    } catch (error) {
      console.error(`[ReviewAPI] Lỗi khi tạo đánh giá:`, error);
      throw error;
    }
  }

  async updateReview(id, reviewData) {
    try {
      console.log(`[ReviewAPI] Đang cập nhật đánh giá ID ${id} với dữ liệu:`, reviewData);
      const result = await this.apiCall(`/reviews/${id}`, {
        method: 'PUT',
        body: JSON.stringify(reviewData)
      });
      console.log(`[ReviewAPI] Kết quả cập nhật đánh giá:`, result);
      return result;
    } catch (error) {
      console.error(`[ReviewAPI] Lỗi khi cập nhật đánh giá ID ${id}:`, error);
      throw error;
    }
  }

  async deleteReview(id) {
    try {
      console.log(`[ReviewAPI] Đang xóa đánh giá ID: ${id}`);
      const result = await this.apiCall(`/reviews/${id}`, {
        method: 'DELETE'
      });
      console.log(`[ReviewAPI] Kết quả xóa đánh giá:`, result);
      return result;
    } catch (error) {
      console.error(`[ReviewAPI] Lỗi khi xóa đánh giá ID ${id}:`, error);
      throw error;
    }
  }

  async adminDeleteReview(id) {
    try {
      console.log(`[ReviewAPI] Đang xóa đánh giá ID (admin): ${id}`);
      const result = await this.apiCall(`/reviews/admin/${id}`, {
        method: 'DELETE'
      });
      console.log(`[ReviewAPI] Kết quả xóa đánh giá (admin):`, result);
      return result;
    } catch (error) {
      console.error(`[ReviewAPI] Lỗi khi xóa đánh giá ID ${id} (admin):`, error);
      throw error;
    }
  }

  async getAverageRating(bookId) {
    try {
      console.log(`[ReviewAPI] Đang lấy đánh giá trung bình cho book ID: ${bookId}`);
      const result = await this.apiCall(`/reviews/book/${bookId}/average`);
      console.log(`[ReviewAPI] Kết quả đánh giá trung bình:`, result);
      return result;
    } catch (error) {
      console.error(`[ReviewAPI] Lỗi khi lấy đánh giá trung bình cho book ${bookId}:`, error);
      throw error;
    }
  }

  async getAllReviews() {
    try {
      console.log(`[ReviewAPI] Đang lấy tất cả đánh giá (admin)`);
      const result = await this.apiCall('/reviews/all');
      console.log(`[ReviewAPI] Kết quả lấy tất cả đánh giá:`, result);
      return result;
    } catch (error) {
      console.error(`[ReviewAPI] Lỗi khi lấy tất cả đánh giá:`, error);
      throw error;
    }
  }

  // ==================== REVIEW REPLIES ====================
  async createReply(reviewId, replyData) {
    try {
      console.log(`[ReviewAPI] Đang tạo phản hồi cho review ID ${reviewId} với dữ liệu:`, replyData);
      const result = await this.apiCall(`/reviews/${reviewId}/reply`, {
        method: 'POST',
        body: JSON.stringify(replyData)
      });
      console.log(`[ReviewAPI] Kết quả tạo phản hồi:`, result);
      return result;
    } catch (error) {
      console.error(`[ReviewAPI] Lỗi khi tạo phản hồi cho review ${reviewId}:`, error);
      throw error;
    }
  }

  async updateReply(replyId, replyData) {
    try {
      console.log(`[ReviewAPI] Đang cập nhật phản hồi ID ${replyId} với dữ liệu:`, replyData);
      const result = await this.apiCall(`/reviews/reply/${replyId}`, {
        method: 'PUT',
        body: JSON.stringify(replyData)
      });
      console.log(`[ReviewAPI] Kết quả cập nhật phản hồi:`, result);
      return result;
    } catch (error) {
      console.error(`[ReviewAPI] Lỗi khi cập nhật phản hồi ID ${replyId}:`, error);
      throw error;
    }
  }

  async deleteReply(replyId) {
    try {
      console.log(`[ReviewAPI] Đang xóa phản hồi ID: ${replyId}`);
      const result = await this.apiCall(`/reviews/reply/${replyId}`, {
        method: 'DELETE'
      });
      console.log(`[ReviewAPI] Kết quả xóa phản hồi:`, result);
      return result;
    } catch (error) {
      console.error(`[ReviewAPI] Lỗi khi xóa phản hồi ID ${replyId}:`, error);
      throw error;
    }
  }

}

export default new ReviewApiService();
