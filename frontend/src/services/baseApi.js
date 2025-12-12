/**
 * Base API Service - Chứa các method chung cho tất cả API services
 */

const DEFAULT_BASE_URL = 'http://localhost:5000/api';

class BaseApiService {
  constructor() {
    const runtimeBaseUrl = typeof window !== 'undefined' ? window.__SMART_BOOK_API_BASE_URL__ : null;
    this.baseURL =
      runtimeBaseUrl ||
      import.meta?.env?.VITE_API_BASE_URL ||
      DEFAULT_BASE_URL;
    console.log(`[BaseAPI] Using base URL: ${this.baseURL}`);
  }

  // Utility method để delay (giả lập network delay)
  async delay(ms = 100) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Generic method để gọi API
  async apiCall(endpoint, options = {}) {
    try {
      console.log(`[BaseAPI] Đang gọi API: ${this.baseURL}${endpoint}`);
      console.log(`[BaseAPI] Options:`, options);
      
      await this.delay();
      
      // Lấy token từ localStorage
      const token = localStorage.getItem('token');
      console.log(`[BaseAPI] Token có sẵn:`, token ? 'Có' : 'Không');
      
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
          ...options.headers
        },
        ...options
      });

      console.log(`[BaseAPI] Response status:`, response.status);
      console.log(`[BaseAPI] Response ok:`, response.ok);

      if (!response.ok) {
        // Try to get error message from response body
        let errorMessage = '';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || '';
        } catch (e) {
          console.log('Không thể parse error response body');
        }

        // Handle specific HTTP status codes
        if (response.status === 403) {
          console.error(`🚫 [BaseAPI] Lỗi 403 - Không có quyền truy cập endpoint: ${endpoint}`);
          throw new Error(errorMessage || `HTTP error! status: ${response.status} - Forbidden: Bạn không có quyền truy cập`);
        } else if (response.status === 401) {
          console.error(`[BaseAPI] Lỗi 401 - Chưa đăng nhập hoặc token hết hạn cho endpoint: ${endpoint}`);
          throw new Error(errorMessage || `HTTP error! status: ${response.status} - Unauthorized: Vui lòng đăng nhập lại`);
        } else if (response.status === 404) {
          console.error(`[BaseAPI] Lỗi 404 - Không tìm thấy endpoint: ${endpoint}`);
          throw new Error(errorMessage || `HTTP error! status: ${response.status} - Not Found: Endpoint không tồn tại`);
        } else if (response.status === 500) {
          console.error(`[BaseAPI] Lỗi 500 - Lỗi server cho endpoint: ${endpoint}`);
          throw new Error(errorMessage || `HTTP error! status: ${response.status} - Server Error: Lỗi máy chủ`);
        } else {
          console.error(`⚠️ [BaseAPI] Lỗi HTTP ${response.status} cho endpoint: ${endpoint}`);
          throw new Error(errorMessage || `HTTP error! status: ${response.status}`);
        }
      }

      const data = await response.json();
      console.log(`[BaseAPI] API call thành công cho ${endpoint}:`, data);
      
      // Return the data as-is if it already has success field, otherwise wrap it
      if (data && typeof data === 'object' && 'success' in data) {
        return data;
      } else {
        return {
          success: true,
          data: data,
          message: 'Success'
        };
      }
    } catch (error) {
      console.error(`[BaseAPI] API call thất bại cho ${endpoint}:`, error);
      console.error(`[BaseAPI] Chi tiết lỗi:`, {
        message: error.message,
        stack: error.stack,
        endpoint: endpoint,
        options: options
      });
      return {
        success: false,
        data: null,
        message: error.message
      };
    }
  }

  // Health check method
  async healthCheck() {
    try {
      return await this.apiCall('/health');
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }
}

export default BaseApiService;
