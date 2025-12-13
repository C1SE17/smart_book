/**
 * Get All Books Use Case
 * Application layer orchestrates the business workflow
 */
class GetAllBooksUseCase {
  constructor(bookRepository) {
    this.bookRepository = bookRepository;
  }

  async execute(filters = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        category_id,
        author_id,
        publisher_id,
        search,
      } = filters;

      // Validate inputs
      const validatedPage = Math.max(1, parseInt(page) || 1);
      const validatedLimit = Math.min(100, Math.max(1, parseInt(limit) || 10));

      // Execute repository query
      const result = await this.bookRepository.findAll({
        page: validatedPage,
        limit: validatedLimit,
        category_id: category_id ? parseInt(category_id) : undefined,
        author_id: author_id ? parseInt(author_id) : undefined,
        publisher_id: publisher_id ? parseInt(publisher_id) : undefined,
        search: search ? String(search).trim() : undefined,
      });

      return {
        success: true,
        data: result.books,
        pagination: result.pagination,
      };
    } catch (error) {
      throw new Error(`Failed to get books: ${error.message}`);
    }
  }
}

module.exports = GetAllBooksUseCase;

