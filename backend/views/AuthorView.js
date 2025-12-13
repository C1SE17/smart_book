/**
 * AuthorView - View cho Author entity
 * Chịu trách nhiệm format dữ liệu tác giả trước khi trả về cho client
 */
const BaseView = require('./BaseView');

class AuthorView extends BaseView {
  /**
   * Format một tác giả
   * @param {object} author - Dữ liệu tác giả từ database
   * @returns {object} Formatted author object
   */
  static formatAuthor(author) {
    if (!author) return null;

    return {
      author_id: author.author_id,
      id: author.author_id, // Alias cho compatibility
      name: author.name,
      bio: author.bio || null,
      birth_date: author.birth_date || null,
      nationality: author.nationality || null,
      image: author.image || null
    };
  }

  /**
   * Format danh sách tác giả
   * @param {Array} authors - Mảng tác giả từ database
   * @returns {Array} Mảng tác giả đã được format
   */
  static formatAuthors(authors) {
    if (!Array.isArray(authors)) return [];
    return authors.map(author => this.formatAuthor(author));
  }

  /**
   * Response thành công với danh sách tác giả
   * @param {Array} authors - Mảng tác giả
   * @param {string} message - Thông báo (tùy chọn)
   * @returns {object} Response object
   */
  static list(authors, message = null) {
    return this.success(this.formatAuthors(authors), message);
  }

  /**
   * Response thành công với một tác giả
   * @param {object} author - Dữ liệu tác giả
   * @param {string} message - Thông báo (tùy chọn)
   * @returns {object} Response object
   */
  static detail(author, message = null) {
    if (!author) {
      return this.notFound('Tác giả');
    }
    
    return this.success(this.formatAuthor(author), message);
  }

  /**
   * Response thành công khi tạo tác giả
   * @param {object} author - Dữ liệu tác giả vừa tạo
   * @returns {object} Response object
   */
  static created(author) {
    return this.success(
      this.formatAuthor(author),
      'Tác giả đã được tạo thành công'
    );
  }

  /**
   * Response thành công khi cập nhật tác giả
   * @param {object} author - Dữ liệu tác giả đã cập nhật
   * @returns {object} Response object
   */
  static updated(author) {
    return this.success(
      this.formatAuthor(author),
      'Tác giả đã được cập nhật thành công'
    );
  }

  /**
   * Response thành công khi xóa tác giả
   * @returns {object} Response object
   */
  static deleted() {
    return this.success(null, 'Tác giả đã được xóa thành công');
  }
}

module.exports = AuthorView;

