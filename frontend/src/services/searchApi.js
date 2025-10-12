/**
 * Search API Service - Quản lý các API liên quan đến tìm kiếm
 */

import BaseApiService from './baseApi.js';

class SearchApiService extends BaseApiService {
  // ==================== SEARCH SUGGESTIONS ====================
  async getSearchSuggestions(query) {
    try {
      console.log(`🔍 [SearchAPI] Đang lấy gợi ý tìm kiếm cho: "${query}"`);
      
      const response = await this.apiCall(`/search/suggestions?q=${encodeURIComponent(query)}`);
      console.log(`🔍 [SearchAPI] Kết quả gợi ý tìm kiếm:`, response);
      
      return response;
    } catch (error) {
      console.error(`💥 [SearchAPI] Lỗi khi lấy gợi ý tìm kiếm:`, error);
      throw error;
    }
  }

  // ==================== POPULAR KEYWORDS ====================
  async getPopularKeywords() {
    try {
      console.log(`🔍 [SearchAPI] Đang lấy từ khóa phổ biến`);
      
      const response = await this.apiCall('/search/popular-keywords');
      console.log(`🔍 [SearchAPI] Kết quả từ khóa phổ biến:`, response);
      
      return response;
    } catch (error) {
      console.error(`💥 [SearchAPI] Lỗi khi lấy từ khóa phổ biến:`, error);
      throw error;
    }
  }

  // ==================== SEARCH HISTORY ====================
  async getSearchHistory(userId) {
    try {
      console.log(`🔍 [SearchAPI] Đang lấy lịch sử tìm kiếm cho user: ${userId}`);
      
      const response = await this.apiCall(`/search/history/${userId}`);
      console.log(`🔍 [SearchAPI] Kết quả lịch sử tìm kiếm:`, response);
      
      return response;
    } catch (error) {
      console.error(`💥 [SearchAPI] Lỗi khi lấy lịch sử tìm kiếm:`, error);
      throw error;
    }
  }

  async saveSearchHistory(userId, query) {
    try {
      console.log(`🔍 [SearchAPI] Đang lưu lịch sử tìm kiếm: "${query}" cho user: ${userId}`);
      
      const response = await this.apiCall('/search/history', {
        method: 'POST',
        body: JSON.stringify({
          user_id: userId,
          query: query
        })
      });
      console.log(`🔍 [SearchAPI] Kết quả lưu lịch sử tìm kiếm:`, response);
      
      return response;
    } catch (error) {
      console.error(`💥 [SearchAPI] Lỗi khi lưu lịch sử tìm kiếm:`, error);
      throw error;
    }
  }

  // ==================== ADVANCED SEARCH ====================
  async advancedSearch(params) {
    try {
      console.log(`🔍 [SearchAPI] Đang thực hiện tìm kiếm nâng cao với tham số:`, params);
      
      const queryParams = new URLSearchParams();
      
      if (params.query) queryParams.append('q', params.query);
      if (params.category_id) queryParams.append('category_id', params.category_id);
      if (params.author_id) queryParams.append('author_id', params.author_id);
      if (params.publisher_id) queryParams.append('publisher_id', params.publisher_id);
      if (params.min_price) queryParams.append('min_price', params.min_price);
      if (params.max_price) queryParams.append('max_price', params.max_price);
      if (params.min_rating) queryParams.append('min_rating', params.min_rating);
      if (params.sort) queryParams.append('sort', params.sort);
      if (params.order) queryParams.append('order', params.order);
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);

      const queryString = queryParams.toString();
      const endpoint = `/search/advanced${queryString ? `?${queryString}` : ''}`;
      
      const response = await this.apiCall(endpoint);
      console.log(`🔍 [SearchAPI] Kết quả tìm kiếm nâng cao:`, response);
      
      return response;
    } catch (error) {
      console.error(`💥 [SearchAPI] Lỗi khi thực hiện tìm kiếm nâng cao:`, error);
      throw error;
    }
  }
}

// Tạo instance duy nhất
const searchApi = new SearchApiService();

export { searchApi };
export default searchApi;
