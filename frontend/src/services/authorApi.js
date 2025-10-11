/**
 * Author API Service - Quản lý các API liên quan đến tác giả
 */

import BaseApiService from './baseApi.js';

class AuthorApiService extends BaseApiService {
  // ==================== AUTHORS ====================
  async getAuthors() {
    try {
      console.log(`✍️ [AuthorAPI] Đang lấy danh sách tác giả`);
      const result = await this.apiCall('/authors');
      console.log(`✍️ [AuthorAPI] Kết quả lấy danh sách tác giả:`, result);
      return result;
    } catch (error) {
      console.error(`💥 [AuthorAPI] Lỗi khi lấy danh sách tác giả:`, error);
      throw error;
    }
  }

  async getAuthorById(id) {
    try {
      console.log(`✍️ [AuthorAPI] Đang lấy thông tin tác giả theo ID: ${id}`);
      const result = await this.apiCall(`/authors/${id}`);
      console.log(`✍️ [AuthorAPI] Kết quả lấy thông tin tác giả:`, result);
      return result;
    } catch (error) {
      console.error(`💥 [AuthorAPI] Lỗi khi lấy thông tin tác giả ID ${id}:`, error);
      throw error;
    }
  }

  async createAuthor(authorData) {
    try {
      console.log(`✍️ [AuthorAPI] Đang tạo tác giả mới với dữ liệu:`, authorData);
      const result = await this.apiCall('/authors', {
        method: 'POST',
        body: JSON.stringify(authorData)
      });
      console.log(`✍️ [AuthorAPI] Kết quả tạo tác giả:`, result);
      return result;
    } catch (error) {
      console.error(`💥 [AuthorAPI] Lỗi khi tạo tác giả:`, error);
      throw error;
    }
  }

  async updateAuthor(id, authorData) {
    try {
      console.log(`✍️ [AuthorAPI] Đang cập nhật tác giả ID ${id} với dữ liệu:`, authorData);
      const result = await this.apiCall(`/authors/${id}`, {
        method: 'PUT',
        body: JSON.stringify(authorData)
      });
      console.log(`✍️ [AuthorAPI] Kết quả cập nhật tác giả:`, result);
      return result;
    } catch (error) {
      console.error(`💥 [AuthorAPI] Lỗi khi cập nhật tác giả ID ${id}:`, error);
      throw error;
    }
  }

  async deleteAuthor(id) {
    try {
      console.log(`✍️ [AuthorAPI] Đang xóa tác giả ID: ${id}`);
      const result = await this.apiCall(`/authors/${id}`, {
        method: 'DELETE'
      });
      console.log(`✍️ [AuthorAPI] Kết quả xóa tác giả:`, result);
      return result;
    } catch (error) {
      console.error(`💥 [AuthorAPI] Lỗi khi xóa tác giả ID ${id}:`, error);
      throw error;
    }
  }
}

export default new AuthorApiService();
