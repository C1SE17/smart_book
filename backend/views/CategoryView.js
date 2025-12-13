/**
 * CategoryView - View cho Category entity
 * Chịu trách nhiệm format dữ liệu thể loại trước khi trả về cho client
 */
const BaseView = require('./BaseView');

class CategoryView extends BaseView {
  /**
   * Format một thể loại
   * @param {object} category - Dữ liệu thể loại từ database
   * @returns {object} Formatted category object
   */
  static formatCategory(category) {
    if (!category) return null;

    return {
      category_id: category.category_id,
      id: category.category_id, // Alias cho compatibility
      name: category.name,
      description: category.description || null,
      parent_id: category.parent_id || category.parent_category_id || null,
      parent_category_id: category.parent_category_id || category.parent_id || null,
      slug: category.slug || null,
      image: category.image || null,
      book_count: category.book_count !== undefined ? Number(category.book_count) : 0,
      created_at: category.created_at || null,
      updated_at: category.updated_at || null
    };
  }

  /**
   * Format danh sách thể loại
   * @param {Array} categories - Mảng thể loại từ database
   * @returns {Array} Mảng thể loại đã được format
   */
  static formatCategories(categories) {
    if (!Array.isArray(categories)) return [];
    return categories.map(category => this.formatCategory(category));
  }

  /**
   * Response thành công với danh sách thể loại
   * @param {Array} categories - Mảng thể loại
   * @param {string} message - Thông báo (tùy chọn)
   * @returns {object} Response object
   */
  static list(categories, message = null) {
    return this.success(this.formatCategories(categories), message);
  }

  /**
   * Response thành công với một thể loại
   * @param {object} category - Dữ liệu thể loại
   * @param {string} message - Thông báo (tùy chọn)
   * @returns {object} Response object
   */
  static detail(category, message = null) {
    if (!category) {
      return this.notFound('Thể loại');
    }
    
    return this.success(this.formatCategory(category), message);
  }

  /**
   * Response thành công khi tạo thể loại
   * @param {object} category - Dữ liệu thể loại vừa tạo
   * @returns {object} Response object
   */
  static created(category) {
    return this.success(
      this.formatCategory(category),
      'Thể loại đã được tạo thành công'
    );
  }

  /**
   * Response thành công khi cập nhật thể loại
   * @param {object} category - Dữ liệu thể loại đã cập nhật
   * @returns {object} Response object
   */
  static updated(category) {
    return this.success(
      this.formatCategory(category),
      'Thể loại đã được cập nhật thành công'
    );
  }

  /**
   * Response thành công khi xóa thể loại
   * @returns {object} Response object
   */
  static deleted() {
    return this.success(null, 'Thể loại đã được xóa thành công');
  }
}

module.exports = CategoryView;

