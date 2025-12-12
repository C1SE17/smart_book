/**
 * Book Controller
 * Presentation layer - handles HTTP requests/responses
 */
class BookController {
  constructor(getAllBooksUseCase, getBookByIdUseCase) {
    this.getAllBooksUseCase = getAllBooksUseCase;
    this.getBookByIdUseCase = getBookByIdUseCase;
  }

  /**
   * GET /api/books
   * Get all books with pagination and filters
   */
  async getAllBooks(req, res) {
    try {
      const filters = req.query;
      const result = await this.getAllBooksUseCase.execute(filters);
      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * GET /api/books/:id
   * Get book by ID
   */
  async getBookById(req, res) {
    try {
      const result = await this.getBookByIdUseCase.execute(req.params.id);
      
      if (!result.success) {
        return res.status(404).json(result);
      }
      
      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * GET /api/books/search
   * Search books
   */
  async searchBooks(req, res) {
    try {
      const filters = {
        ...req.query,
        search: req.query.q,
      };
      const result = await this.getAllBooksUseCase.execute(filters);
      
      res.json({
        ...result,
        message: `Tìm thấy ${result.pagination.totalItems} kết quả`,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
}

module.exports = BookController;

