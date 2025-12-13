/**
 * PublisherView - View cho Publisher entity
 * Chịu trách nhiệm format dữ liệu nhà xuất bản trước khi trả về cho client
 */
const BaseView = require('./BaseView');

class PublisherView extends BaseView {
  /**
   * Format một nhà xuất bản
   * @param {object} publisher - Dữ liệu nhà xuất bản từ database
   * @returns {object} Formatted publisher object
   */
  static formatPublisher(publisher) {
    if (!publisher) return null;

    return {
      publisher_id: publisher.publisher_id,
      id: publisher.publisher_id, // Alias cho compatibility
      name: publisher.name,
      description: publisher.description || null,
      address: publisher.address || null,
      phone: publisher.phone || null,
      email: publisher.email || null,
      website: publisher.website || null
    };
  }

  /**
   * Format danh sách nhà xuất bản
   * @param {Array} publishers - Mảng nhà xuất bản từ database
   * @returns {Array} Mảng nhà xuất bản đã được format
   */
  static formatPublishers(publishers) {
    if (!Array.isArray(publishers)) return [];
    return publishers.map(publisher => this.formatPublisher(publisher));
  }

  /**
   * Response thành công với danh sách nhà xuất bản
   * @param {Array} publishers - Mảng nhà xuất bản
   * @param {string} message - Thông báo (tùy chọn)
   * @returns {object} Response object
   */
  static list(publishers, message = null) {
    return this.success(this.formatPublishers(publishers), message);
  }

  /**
   * Response thành công với một nhà xuất bản
   * @param {object} publisher - Dữ liệu nhà xuất bản
   * @param {string} message - Thông báo (tùy chọn)
   * @returns {object} Response object
   */
  static detail(publisher, message = null) {
    if (!publisher) {
      return this.notFound('Nhà xuất bản');
    }
    
    return this.success(this.formatPublisher(publisher), message);
  }

  /**
   * Response thành công khi tạo nhà xuất bản
   * @param {object} publisher - Dữ liệu nhà xuất bản vừa tạo
   * @returns {object} Response object
   */
  static created(publisher) {
    return this.success(
      this.formatPublisher(publisher),
      'Nhà xuất bản đã được tạo thành công'
    );
  }

  /**
   * Response thành công khi cập nhật nhà xuất bản
   * @param {object} publisher - Dữ liệu nhà xuất bản đã cập nhật
   * @returns {object} Response object
   */
  static updated(publisher) {
    return this.success(
      this.formatPublisher(publisher),
      'Nhà xuất bản đã được cập nhật thành công'
    );
  }

  /**
   * Response thành công khi xóa nhà xuất bản
   * @returns {object} Response object
   */
  static deleted() {
    return this.success(null, 'Nhà xuất bản đã được xóa thành công');
  }
}

module.exports = PublisherView;

