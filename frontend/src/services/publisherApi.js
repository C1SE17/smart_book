/**
 * Publisher API Service - Quản lý các API liên quan đến nhà xuất bản
 */

import BaseApiService from './baseApi.js';

class PublisherApiService extends BaseApiService {
  // ==================== PUBLISHERS ====================
  async getPublishers() {
    try {
      console.log(`🏢 [PublisherAPI] Đang lấy danh sách nhà xuất bản`);
      const result = await this.apiCall('/publishers');
      console.log(`🏢 [PublisherAPI] Kết quả lấy danh sách nhà xuất bản:`, result);
      return result;
    } catch (error) {
      console.error(`💥 [PublisherAPI] Lỗi khi lấy danh sách nhà xuất bản:`, error);
      throw error;
    }
  }

  async getPublisherById(id) {
    try {
      console.log(`🏢 [PublisherAPI] Đang lấy thông tin nhà xuất bản theo ID: ${id}`);
      const result = await this.apiCall(`/publishers/${id}`);
      console.log(`🏢 [PublisherAPI] Kết quả lấy thông tin nhà xuất bản:`, result);
      return result;
    } catch (error) {
      console.error(`💥 [PublisherAPI] Lỗi khi lấy thông tin nhà xuất bản ID ${id}:`, error);
      throw error;
    }
  }

  async createPublisher(publisherData) {
    try {
      console.log(`🏢 [PublisherAPI] Đang tạo nhà xuất bản mới với dữ liệu:`, publisherData);
      const result = await this.apiCall('/publishers', {
        method: 'POST',
        body: JSON.stringify(publisherData)
      });
      console.log(`🏢 [PublisherAPI] Kết quả tạo nhà xuất bản:`, result);
      return result;
    } catch (error) {
      console.error(`💥 [PublisherAPI] Lỗi khi tạo nhà xuất bản:`, error);
      throw error;
    }
  }

  async updatePublisher(id, publisherData) {
    try {
      console.log(`🏢 [PublisherAPI] Đang cập nhật nhà xuất bản ID ${id} với dữ liệu:`, publisherData);
      const result = await this.apiCall(`/publishers/${id}`, {
        method: 'PUT',
        body: JSON.stringify(publisherData)
      });
      console.log(`🏢 [PublisherAPI] Kết quả cập nhật nhà xuất bản:`, result);
      return result;
    } catch (error) {
      console.error(`💥 [PublisherAPI] Lỗi khi cập nhật nhà xuất bản ID ${id}:`, error);
      throw error;
    }
  }

  async deletePublisher(id) {
    try {
      console.log(`🏢 [PublisherAPI] Đang xóa nhà xuất bản ID: ${id}`);
      const result = await this.apiCall(`/publishers/${id}`, {
        method: 'DELETE'
      });
      console.log(`🏢 [PublisherAPI] Kết quả xóa nhà xuất bản:`, result);
      return result;
    } catch (error) {
      console.error(`💥 [PublisherAPI] Lỗi khi xóa nhà xuất bản ID ${id}:`, error);
      throw error;
    }
  }
}

export default new PublisherApiService();
