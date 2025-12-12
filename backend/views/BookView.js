/**
 * BookView - View cho Book entity
 * Chịu trách nhiệm format dữ liệu sách trước khi trả về cho client
 */
const BaseView = require('./BaseView');

class BookView extends BaseView {
  /**
   * Format một cuốn sách
   * @param {object} book - Dữ liệu sách từ database
   * @returns {object} Formatted book object
   */
  static formatBook(book) {
    if (!book) return null;

    return {
      book_id: book.book_id,
      id: book.book_id, // Alias cho compatibility
      title: book.title,
      description: book.description,
      price: Number(book.price) || 0,
      stock: Number(book.stock) || 0,
      category_id: book.category_id,
      author_id: book.author_id,
      publisher_id: book.publisher_id,
      published_date: book.published_date,
      cover_image: book.cover_image,
      slug: book.slug,
      // Thông tin liên quan
      author_name: book.author_name,
      publisher_name: book.publisher_name,
      category_name: book.category_name,
      // Rating và reviews
      rating: Number(book.rating) || 0,
      review_count: Number(book.review_count) || 0,
      avg_rating: Number(book.rating) || 0 // Alias cho compatibility
    };
  }

  /**
   * Format danh sách sách
   * @param {Array} books - Mảng sách từ database
   * @returns {Array} Mảng sách đã được format
   */
  static formatBooks(books) {
    if (!Array.isArray(books)) return [];
    return books.map(book => this.formatBook(book));
  }

  /**
   * Response thành công với danh sách sách
   * @param {Array} books - Mảng sách
   * @param {object} pagination - Thông tin pagination (tùy chọn)
   * @param {string} message - Thông báo (tùy chọn)
   * @returns {object} Response object
   */
  static list(books, pagination = null, message = null) {
    const formattedBooks = this.formatBooks(books);
    
    if (pagination) {
      return this.paginated(formattedBooks, pagination, message);
    }
    
    return this.success(formattedBooks, message);
  }

  /**
   * Response thành công với một cuốn sách
   * @param {object} book - Dữ liệu sách
   * @param {string} message - Thông báo (tùy chọn)
   * @returns {object} Response object
   */
  static detail(book, message = null) {
    if (!book) {
      return this.notFound('Sách');
    }
    
    return this.success(this.formatBook(book), message);
  }

  /**
   * Response thành công khi tạo sách
   * @param {object} book - Dữ liệu sách vừa tạo
   * @returns {object} Response object
   */
  static created(book) {
    return this.success(
      this.formatBook(book),
      'Sách đã được tạo thành công'
    );
  }

  /**
   * Response thành công khi cập nhật sách
   * @param {object} book - Dữ liệu sách đã cập nhật
   * @returns {object} Response object
   */
  static updated(book) {
    return this.success(
      this.formatBook(book),
      'Sách đã được cập nhật thành công'
    );
  }

  /**
   * Response thành công khi xóa sách
   * @returns {object} Response object
   */
  static deleted() {
    return this.success(null, 'Sách đã được xóa thành công');
  }

  /**
   * Response tìm kiếm
   * @param {Array} books - Mảng sách tìm được
   * @param {object} pagination - Thông tin pagination
   * @returns {object} Response object
   */
  static search(books, pagination) {
    const formattedBooks = this.formatBooks(books);
    const message = `Tìm thấy ${pagination?.totalItems || formattedBooks.length} kết quả`;
    return this.paginated(formattedBooks, pagination, message);
  }
}

module.exports = BookView;

