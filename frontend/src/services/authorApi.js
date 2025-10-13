/**
 * Author API Service - Xử lý các API call liên quan đến tác giả
 */

import BaseApiService from './baseApi.js';

class AuthorApiService extends BaseApiService {
  constructor() {
    super();
    this.baseEndpoint = '/authors';
  }

  // Lấy danh sách tất cả tác giả
  async getAllAuthors() {
    try {
      console.log('[AuthorApi] Lấy danh sách tác giả...');
      const response = await this.apiCall(this.baseEndpoint, { method: 'GET' });
      console.log('[AuthorApi] Lấy được', response.data?.length || 0, 'tác giả');
      return response;
    } catch (error) {
      console.error('[AuthorApi] Lỗi khi lấy danh sách tác giả:', error);
      throw error;
    }
  }

  // Lấy thông tin chi tiết tác giả
  async getAuthorById(id) {
    try {
      console.log('[AuthorApi] Lấy thông tin tác giả ID:', id);
      const response = await this.apiCall(`${this.baseEndpoint}/${id}`, { method: 'GET' });
      console.log('[AuthorApi] Lấy được thông tin tác giả:', response.data?.name);
      return response;
    } catch (error) {
      console.error('[AuthorApi] Lỗi khi lấy thông tin tác giả:', error);
      throw error;
    }
  }
}

// Tạo instance và export
const authorApi = new AuthorApiService();
export default authorApi;
