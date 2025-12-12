/**
 * Auth API Service - Quản lý các API xác thực
 */

import BaseApiService from './baseApi.js';

class AuthApiService extends BaseApiService {
  // ==================== AUTH ====================
  async login(credentials) {
    try {
      console.log(`[AuthAPI] Đang đăng nhập với thông tin:`, credentials);
      const result = await this.apiCall('/users/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
      });
      console.log(`[AuthAPI] Kết quả đăng nhập:`, result);
      return result;
    } catch (error) {
      console.error(`[AuthAPI] Lỗi khi đăng nhập:`, error);
      throw error;
    }
  }

  async register(userData) {
    try {
      console.log(`[AuthAPI] Đang đăng ký tài khoản mới với dữ liệu:`, userData);
      const result = await this.apiCall('/users/register', {
        method: 'POST',
        body: JSON.stringify(userData)
      });
      console.log(`[AuthAPI] Kết quả đăng ký:`, result);
      return result;
    } catch (error) {
      console.error(`[AuthAPI] Lỗi khi đăng ký:`, error);
      throw error;
    }
  }

  async logout() {
    try {
      console.log(`[AuthAPI] Đang đăng xuất`);
      const result = await this.apiCall('/users/logout', {
        method: 'POST'
      });
      console.log(`[AuthAPI] Kết quả đăng xuất:`, result);
      return result;
    } catch (error) {
      console.error(`[AuthAPI] Lỗi khi đăng xuất:`, error);
      throw error;
    }
  }

  async refreshToken() {
    try {
      console.log(`[AuthAPI] Đang làm mới token`);
      const result = await this.apiCall('/users/refresh', {
        method: 'POST'
      });
      console.log(`[AuthAPI] Kết quả làm mới token:`, result);
      return result;
    } catch (error) {
      console.error(`[AuthAPI] Lỗi khi làm mới token:`, error);
      throw error;
    }
  }
}

export default new AuthApiService();
