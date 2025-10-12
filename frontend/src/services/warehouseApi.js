/**
 * Warehouse API Service - Quản lý các API liên quan đến kho
 */

import BaseApiService from './baseApi.js';

class WarehouseApiService extends BaseApiService {
  // ==================== WAREHOUSE ====================
  async getWarehouseItems(params = {}) {
    try {
      console.log(`📦 [WarehouseAPI] Đang lấy danh sách sản phẩm trong kho với tham số:`, params);

      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.search) queryParams.append('search', params.search);

      const queryString = queryParams.toString();
      const endpoint = `/warehouse${queryString ? `?${queryString}` : ''}`;

      console.log(`📦 [WarehouseAPI] Endpoint cuối cùng: ${endpoint}`);
      const result = await this.apiCall(endpoint);
      console.log(`📦 [WarehouseAPI] Kết quả lấy danh sách kho:`, result);
      return result;
    } catch (error) {
      console.error(`💥 [WarehouseAPI] Lỗi khi lấy danh sách kho:`, error);
      throw error;
    }
  }

  async getWarehouseItemByBookId(bookId) {
    try {
      console.log(`📦 [WarehouseAPI] Đang lấy thông tin kho theo book ID: ${bookId}`);
      const result = await this.apiCall(`/warehouse/${bookId}`);
      console.log(`📦 [WarehouseAPI] Kết quả lấy thông tin kho:`, result);
      return result;
    } catch (error) {
      console.error(`💥 [WarehouseAPI] Lỗi khi lấy thông tin kho cho book ID ${bookId}:`, error);
      throw error;
    }
  }

  async createWarehouseItem(warehouseData) {
    try {
      console.log(`📦 [WarehouseAPI] Đang tạo mục kho mới với dữ liệu:`, warehouseData);
      const result = await this.apiCall('/warehouse', {
        method: 'POST',
        body: JSON.stringify(warehouseData)
      });
      console.log(`📦 [WarehouseAPI] Kết quả tạo mục kho:`, result);
      return result;
    } catch (error) {
      console.error(`💥 [WarehouseAPI] Lỗi khi tạo mục kho:`, error);
      throw error;
    }
  }

  async updateWarehouseItem(bookId, warehouseData) {
    try {
      console.log(`📦 [WarehouseAPI] Đang cập nhật kho cho book ID ${bookId} với dữ liệu:`, warehouseData);
      const result = await this.apiCall(`/warehouse/${bookId}`, {
        method: 'PUT',
        body: JSON.stringify(warehouseData)
      });
      console.log(`📦 [WarehouseAPI] Kết quả cập nhật kho:`, result);
      return result;
    } catch (error) {
      console.error(`💥 [WarehouseAPI] Lỗi khi cập nhật kho cho book ID ${bookId}:`, error);
      throw error;
    }
  }

  async deleteWarehouseItem(bookId) {
    try {
      console.log(`📦 [WarehouseAPI] Đang xóa mục kho cho book ID: ${bookId}`);
      const result = await this.apiCall(`/warehouse/${bookId}`, {
        method: 'DELETE'
      });
      console.log(`📦 [WarehouseAPI] Kết quả xóa mục kho:`, result);
      return result;
    } catch (error) {
      console.error(`💥 [WarehouseAPI] Lỗi khi xóa mục kho cho book ID ${bookId}:`, error);
      throw error;
    }
  }
}

export default new WarehouseApiService();
