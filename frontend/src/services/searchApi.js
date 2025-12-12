/**
 * Search API Service - Quản lý các API liên quan đến tìm kiếm
 */

import BaseApiService from './baseApi.js';

class SearchApiService extends BaseApiService {
  // ==================== SEARCH SUGGESTIONS ====================
  async getSearchSuggestions(query) {
    try {
      console.log(` [SearchAPI] Đang lấy gợi ý tìm kiếm cho: "${query}"`);
      
      const response = await this.apiCall(`/search/suggestions?q=${encodeURIComponent(query)}`);
      console.log(` [SearchAPI] Kết quả gợi ý tìm kiếm:`, response);
      
      return response;
    } catch (error) {
      console.error(`[SearchAPI] Lỗi khi lấy gợi ý tìm kiếm:`, error);
      throw error;
    }
  }

  // ==================== POPULAR KEYWORDS ====================
  async getPopularKeywords() {
    try {
      console.log(` [SearchAPI] Đang lấy từ khóa phổ biến`);
      
      const response = await this.apiCall('/search/popular-keywords');
      console.log(` [SearchAPI] Kết quả từ khóa phổ biến:`, response);
      
      return response;
    } catch (error) {
      console.error(`[SearchAPI] Lỗi khi lấy từ khóa phổ biến:`, error);
      throw error;
    }
  }

  // ==================== SEARCH HISTORY ====================
  async getSearchHistory(userId) {
    try {
      console.log(` [SearchAPI] Đang lấy lịch sử tìm kiếm cho user: ${userId}`);
      
      const response = await this.apiCall(`/search/history/${userId}`);
      console.log(` [SearchAPI] Kết quả lịch sử tìm kiếm:`, response);
      
      return response;
    } catch (error) {
      console.error(`[SearchAPI] Lỗi khi lấy lịch sử tìm kiếm:`, error);
      throw error;
    }
  }

  async saveSearchHistory(userId, query) {
    try {
      console.log(` [SearchAPI] Đang lưu lịch sử tìm kiếm: "${query}" cho user: ${userId}`);
      
      const response = await this.apiCall('/search/history', {
        method: 'POST',
        body: JSON.stringify({
          user_id: userId,
          query: query
        })
      });
      console.log(` [SearchAPI] Kết quả lưu lịch sử tìm kiếm:`, response);
      
      return response;
    } catch (error) {
      console.error(`[SearchAPI] Lỗi khi lưu lịch sử tìm kiếm:`, error);
      throw error;
    }
  }

  // ==================== ADVANCED SEARCH ====================
  async advancedSearch(params = {}) {
    try {
      console.log(` [SearchAPI] Đang thực hiện tìm kiếm nâng cao với tham số:`, params);

      const queryParams = new URLSearchParams();
      const appendIfPresent = (key, value) => {
        if (value === undefined || value === null || value === '') return;
        queryParams.append(key, value);
      };

      appendIfPresent('query', params.query);
      appendIfPresent('category_id', params.category_id);
      appendIfPresent('author_id', params.author_id);
      appendIfPresent('publisher_id', params.publisher_id);
      appendIfPresent('min_price', params.min_price);
      appendIfPresent('max_price', params.max_price);
      appendIfPresent('min_rating', params.min_rating);
      appendIfPresent('min_year', params.min_year);
      appendIfPresent('max_year', params.max_year);
      appendIfPresent('language', params.language);
      appendIfPresent('status', params.status);
      appendIfPresent('tags', params.tags);
      appendIfPresent('sort', params.sort);
      appendIfPresent('order', params.order);
      appendIfPresent('page', params.page);
      appendIfPresent('limit', params.limit);

      const queryString = queryParams.toString();
      const endpoint = `/search/advanced${queryString ? `?${queryString}` : ''}`;

      const response = await this.apiCall(endpoint);
      console.log(` [SearchAPI] Kết quả tìm kiếm nâng cao:`, response);

      return response;
    } catch (error) {
      console.error(`[SearchAPI] Lỗi khi thực hiện tìm kiếm nâng cao:`, error);
      throw error;
    }
  }
}

// Tạo instance duy nhất
const searchApi = new SearchApiService();

export { searchApi };
export default searchApi;
