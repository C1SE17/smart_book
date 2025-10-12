/**
 * User API Service - Quản lý các API liên quan đến người dùng
 */

import BaseApiService from './baseApi.js';

class UserApiService extends BaseApiService {
  // ==================== USERS ====================
  async getUsers() {
    try {
      console.log(`👥 [UserAPI] Đang lấy danh sách người dùng`);
      const result = await this.apiCall('/users');
      console.log(`👥 [UserAPI] Kết quả lấy danh sách người dùng:`, result);
      return result;
    } catch (error) {
      console.error(`💥 [UserAPI] Lỗi khi lấy danh sách người dùng:`, error);
      throw error;
    }
  }

  async getAllUsers(params = {}) {
    try {
      console.log(`👥 [UserAPI] Đang lấy danh sách người dùng với tham số:`, params);
      
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);

      const queryString = queryParams.toString();
      // Sử dụng endpoint chính thức với auth
      const endpoint = `/users${queryString ? `?${queryString}` : ''}`;
      
      console.log(`👥 [UserAPI] Endpoint cuối cùng: ${endpoint}`);
      const response = await this.apiCall(endpoint);
      
      // Backend trả về format {users: [...], total: ..., page: ..., limit: ..., totalPages: ...}
      // Cần convert thành format {success: true, data: [...]}
      if (response.success && response.data) {
        const result = {
          success: true,
          data: response.data.users || response.data,
          total: response.data.total,
          page: response.data.page,
          limit: response.data.limit,
          totalPages: response.data.totalPages,
          message: 'Success'
        };
        console.log(`👥 [UserAPI] Kết quả lấy danh sách người dùng với phân trang:`, result);
        return result;
      }
      
      console.log(`👥 [UserAPI] Kết quả lấy danh sách người dùng (raw):`, response);
      return response;
    } catch (error) {
      console.error(`💥 [UserAPI] Lỗi khi lấy danh sách người dùng:`, error);
      throw error;
    }
  }

  async getUserById(id) {
    try {
      console.log(`👥 [UserAPI] Đang lấy thông tin người dùng theo ID: ${id}`);
      const result = await this.apiCall(`/users/${id}`);
      console.log(`👥 [UserAPI] Kết quả lấy thông tin người dùng:`, result);
      return result;
    } catch (error) {
      console.error(`💥 [UserAPI] Lỗi khi lấy thông tin người dùng ID ${id}:`, error);
      throw error;
    }
  }

  async createUser(userData) {
    try {
      console.log(`👥 [UserAPI] Đang tạo người dùng mới với dữ liệu:`, userData);
      const result = await this.apiCall('/users', {
        method: 'POST',
        body: JSON.stringify(userData)
      });
      console.log(`👥 [UserAPI] Kết quả tạo người dùng:`, result);
      return result;
    } catch (error) {
      console.error(`💥 [UserAPI] Lỗi khi tạo người dùng:`, error);
      throw error;
    }
  }

  async updateUser(id, userData) {
    try {
      console.log(`👥 [UserAPI] Đang cập nhật người dùng ID ${id} với dữ liệu:`, userData);
      const result = await this.apiCall(`/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(userData)
      });
      console.log(`👥 [UserAPI] Kết quả cập nhật người dùng:`, result);
      return result;
    } catch (error) {
      console.error(`💥 [UserAPI] Lỗi khi cập nhật người dùng ID ${id}:`, error);
      throw error;
    }
  }

  async deleteUser(id) {
    try {
      console.log(`👥 [UserAPI] Đang xóa người dùng ID: ${id}`);
      const result = await this.apiCall(`/users/${id}`, {
        method: 'DELETE'
      });
      console.log(`👥 [UserAPI] Kết quả xóa người dùng:`, result);
      return result;
    } catch (error) {
      console.error(`💥 [UserAPI] Lỗi khi xóa người dùng ID ${id}:`, error);
      throw error;
    }
  }

  async getTotalUsersCount() {
    try {
      console.log(`👥 [UserAPI] Đang lấy tổng số người dùng`);
      const result = await this.apiCall('/users/count');
      console.log(`👥 [UserAPI] Kết quả lấy tổng số người dùng:`, result);
      return result;
    } catch (error) {
      console.error(`💥 [UserAPI] Lỗi khi lấy tổng số người dùng:`, error);
      throw error;
    }
  }
}

export default new UserApiService();
