/**
 * SearchView - View cho Search operations
 * Chịu trách nhiệm format dữ liệu tìm kiếm trước khi trả về cho client
 */
const BaseView = require('./BaseView');
const BookView = require('./BookView');

class SearchView extends BaseView {
  /**
   * Response thành công với gợi ý tìm kiếm
   * @param {Array} suggestions - Mảng gợi ý tìm kiếm
   * @returns {object} Response object
   */
  static suggestions(suggestions) {
    if (!Array.isArray(suggestions)) return this.success([]);
    return this.success(suggestions);
  }

  /**
   * Response thành công với từ khóa phổ biến
   * @param {Array} keywords - Mảng từ khóa phổ biến
   * @returns {object} Response object
   */
  static popularKeywords(keywords) {
    if (!Array.isArray(keywords)) return this.success([]);
    return this.success(keywords);
  }

  /**
   * Response thành công với kết quả tìm kiếm nâng cao
   * @param {Array} books - Mảng sách tìm được
   * @param {object} pagination - Thông tin pagination
   * @returns {object} Response object
   */
  static advancedSearch(books, pagination) {
    const formattedBooks = BookView.formatBooks(books);
    return this.paginated(formattedBooks, pagination);
  }
}

module.exports = SearchView;

