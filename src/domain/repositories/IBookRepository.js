/**
 * Book Repository Interface
 * Defines the contract for book data access
 * Implementation should be in infrastructure layer
 */
class IBookRepository {
  /**
   * Find all books with pagination and filters
   * @param {Object} filters - Filter criteria
   * @param {number} filters.page - Page number
   * @param {number} filters.limit - Items per page
   * @param {number} filters.category_id - Category filter
   * @param {number} filters.author_id - Author filter
   * @param {number} filters.publisher_id - Publisher filter
   * @param {string} filters.search - Search query
   * @returns {Promise<{books: Array, pagination: Object}>}
   */
  async findAll(filters) {
    throw new Error('Method findAll() must be implemented');
  }

  /**
   * Find book by ID
   * @param {number} id - Book ID
   * @returns {Promise<Book|null>}
   */
  async findById(id) {
    throw new Error('Method findById() must be implemented');
  }

  /**
   * Find books by IDs
   * @param {Array<number>} ids - Book IDs
   * @returns {Promise<Array<Book>>}
   */
  async findByIds(ids) {
    throw new Error('Method findByIds() must be implemented');
  }

  /**
   * Find books by category
   * @param {number} categoryId - Category ID
   * @param {Object} options - Query options
   * @returns {Promise<Array<Book>>}
   */
  async findByCategory(categoryId, options = {}) {
    throw new Error('Method findByCategory() must be implemented');
  }

  /**
   * Find books by author
   * @param {number} authorId - Author ID
   * @param {Object} options - Query options
   * @returns {Promise<Array<Book>>}
   */
  async findByAuthor(authorId, options = {}) {
    throw new Error('Method findByAuthor() must be implemented');
  }

  /**
   * Create a new book
   * @param {Object} bookData - Book data
   * @returns {Promise<Book>}
   */
  async create(bookData) {
    throw new Error('Method create() must be implemented');
  }

  /**
   * Update an existing book
   * @param {number} id - Book ID
   * @param {Object} bookData - Updated book data
   * @returns {Promise<Book>}
   */
  async update(id, bookData) {
    throw new Error('Method update() must be implemented');
  }

  /**
   * Delete a book
   * @param {number} id - Book ID
   * @returns {Promise<void>}
   */
  async delete(id) {
    throw new Error('Method delete() must be implemented');
  }

  /**
   * Search books with advanced filters
   * @param {Object} searchParams - Search parameters
   * @returns {Promise<{books: Array, pagination: Object}>}
   */
  async advancedSearch(searchParams) {
    throw new Error('Method advancedSearch() must be implemented');
  }

  /**
   * Get search suggestions
   * @param {string} query - Search query
   * @returns {Promise<Array>}
   */
  async getSearchSuggestions(query) {
    throw new Error('Method getSearchSuggestions() must be implemented');
  }
}

module.exports = IBookRepository;

