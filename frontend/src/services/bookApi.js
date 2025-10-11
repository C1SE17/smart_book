/**
 * Book API Service - Quản lý các API liên quan đến sách
 */

import BaseApiService from './baseApi.js';

class BookApiService extends BaseApiService {
  // ==================== BOOKS ====================
  async getBooks(params = {}) {
    try {
      console.log(`📚 [BookAPI] Đang lấy danh sách sách với tham số:`, params);
      
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.category_id) queryParams.append('category_id', params.category_id);
      if (params.author_id) queryParams.append('author_id', params.author_id);
      if (params.publisher_id) queryParams.append('publisher_id', params.publisher_id);
      if (params.search) queryParams.append('search', params.search);
      if (params.sort) queryParams.append('sort', params.sort);
      if (params.order) queryParams.append('order', params.order);
      if (params.min_price) queryParams.append('min_price', params.min_price);
      if (params.max_price) queryParams.append('max_price', params.max_price);

      const queryString = queryParams.toString();
      const endpoint = `/books${queryString ? `?${queryString}` : ''}`;
      
      console.log(`📚 [BookAPI] Endpoint cuối cùng: ${endpoint}`);
      const result = await this.apiCall(endpoint);
      console.log(`📚 [BookAPI] Kết quả lấy danh sách sách:`, result);
      return result;
    } catch (error) {
      console.error(`💥 [BookAPI] Lỗi khi lấy danh sách sách:`, error);
      throw error;
    }
  }

  async getBookById(id) {
    try {
      console.log(`📚 [BookAPI] Đang lấy thông tin sách theo ID: ${id}`);
      const result = await this.apiCall(`/books/${id}`);
      console.log(`📚 [BookAPI] Kết quả lấy thông tin sách:`, result);
      return result;
    } catch (error) {
      console.error(`💥 [BookAPI] Lỗi khi lấy thông tin sách ID ${id}:`, error);
      throw error;
    }
  }

  async createBook(bookData) {
    try {
      console.log(`📚 [BookAPI] Đang tạo sách mới với dữ liệu:`, bookData);
      const result = await this.apiCall('/books', {
        method: 'POST',
        body: JSON.stringify(bookData)
      });
      console.log(`📚 [BookAPI] Kết quả tạo sách:`, result);
      return result;
    } catch (error) {
      console.error(`💥 [BookAPI] Lỗi khi tạo sách:`, error);
      throw error;
    }
  }

  async updateBook(id, bookData) {
    try {
      console.log(`📚 [BookAPI] Đang cập nhật sách ID ${id} với dữ liệu:`, bookData);
      const result = await this.apiCall(`/books/${id}`, {
        method: 'PUT',
        body: JSON.stringify(bookData)
      });
      console.log(`📚 [BookAPI] Kết quả cập nhật sách:`, result);
      return result;
    } catch (error) {
      console.error(`💥 [BookAPI] Lỗi khi cập nhật sách ID ${id}:`, error);
      throw error;
    }
  }

  async deleteBook(id) {
    try {
      console.log(`📚 [BookAPI] Đang xóa sách ID: ${id}`);
      const result = await this.apiCall(`/books/${id}`, {
        method: 'DELETE'
      });
      console.log(`📚 [BookAPI] Kết quả xóa sách:`, result);
      return result;
    } catch (error) {
      console.error(`💥 [BookAPI] Lỗi khi xóa sách ID ${id}:`, error);
      throw error;
    }
  }

  async searchBooks(query, params = {}) {
    try {
      console.log(`📚 [BookAPI] Đang tìm kiếm sách với từ khóa: "${query}" và tham số:`, params);
      
      const searchParams = new URLSearchParams({ q: query });
      
      Object.keys(params).forEach(key => {
        if (params[key]) searchParams.append(key, params[key]);
      });

      const endpoint = `/books/search?${searchParams.toString()}`;
      console.log(`📚 [BookAPI] Endpoint tìm kiếm: ${endpoint}`);
      
      const result = await this.apiCall(endpoint);
      console.log(`📚 [BookAPI] Kết quả tìm kiếm sách:`, result);
      return result;
    } catch (error) {
      console.error(`💥 [BookAPI] Lỗi khi tìm kiếm sách:`, error);
      throw error;
    }
  }
}

export default new BookApiService();
