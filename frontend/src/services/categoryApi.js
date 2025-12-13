/**
 * Category API Service - Quản lý các API liên quan đến danh mục
 */

import BaseApiService from './baseApi.js';

class CategoryApiService extends BaseApiService {
  // ==================== CATEGORIES ====================
  async getCategories() {
    try {
      console.log(` [CategoryAPI] Đang lấy danh sách danh mục`);
      const result = await this.apiCall('/categories');
      console.log(` [CategoryAPI] Kết quả lấy danh sách danh mục:`, result);
      return result;
    } catch (error) {
      console.error(`[CategoryAPI] Lỗi khi lấy danh sách danh mục:`, error);
      throw error;
    }
  }

  async getCategoryById(id) {
    try {
      console.log(` [CategoryAPI] Đang lấy thông tin danh mục theo ID: ${id}`);
      const result = await this.apiCall(`/categories/${id}`);
      console.log(` [CategoryAPI] Kết quả lấy thông tin danh mục:`, result);
      return result;
    } catch (error) {
      console.error(`[CategoryAPI] Lỗi khi lấy thông tin danh mục ID ${id}:`, error);
      throw error;
    }
  }

  async createCategory(categoryData) {
    try {
      console.log(` [CategoryAPI] Đang tạo danh mục mới với dữ liệu:`, categoryData);
      const result = await this.apiCall('/categories', {
        method: 'POST',
        body: JSON.stringify(categoryData)
      });
      console.log(` [CategoryAPI] Kết quả tạo danh mục:`, result);
      return result;
    } catch (error) {
      console.error(`[CategoryAPI] Lỗi khi tạo danh mục:`, error);
      throw error;
    }
  }

  async updateCategory(id, categoryData) {
    try {
      console.log(` [CategoryAPI] Đang cập nhật danh mục ID ${id} với dữ liệu:`, categoryData);
      const result = await this.apiCall(`/categories/${id}`, {
        method: 'PUT',
        body: JSON.stringify(categoryData)
      });
      console.log(` [CategoryAPI] Kết quả cập nhật danh mục:`, result);
      return result;
    } catch (error) {
      console.error(`[CategoryAPI] Lỗi khi cập nhật danh mục ID ${id}:`, error);
      throw error;
    }
  }

  async deleteCategory(id) {
    try {
      console.log(` [CategoryAPI] Đang xóa danh mục ID: ${id}`);
      const result = await this.apiCall(`/categories/${id}`, {
        method: 'DELETE'
      });
      console.log(` [CategoryAPI] Kết quả xóa danh mục:`, result);
      return result;
    } catch (error) {
      console.error(`[CategoryAPI] Lỗi khi xóa danh mục ID ${id}:`, error);
      throw error;
    }
  }

  async searchCategories(query) {
    try {
      console.log(` [CategoryAPI] Đang tìm kiếm danh mục với từ khóa: "${query}"`);

      const searchParams = new URLSearchParams();
      if (query) {
        searchParams.append('q', query);
      }

      const endpoint = `/categories/search?${searchParams.toString()}`;
      console.log(` [CategoryAPI] Endpoint tìm kiếm: ${endpoint}`);

      const result = await this.apiCall(endpoint);
      console.log(` [CategoryAPI] Kết quả tìm kiếm danh mục:`, result);
      return result;
    } catch (error) {
      console.error(`[CategoryAPI] Lỗi khi tìm kiếm danh mục:`, error);
      throw error;
    }
  }
}

export default new CategoryApiService();
