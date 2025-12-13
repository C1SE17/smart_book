/**
 * Get Book By ID Use Case
 */
class GetBookByIdUseCase {
  constructor(bookRepository) {
    this.bookRepository = bookRepository;
  }

  async execute(bookId) {
    try {
      const id = parseInt(bookId);
      if (!id || id <= 0) {
        throw new Error('Invalid book ID');
      }

      const book = await this.bookRepository.findById(id);
      
      if (!book) {
        return {
          success: false,
          message: 'Book not found',
          data: null,
        };
      }

      return {
        success: true,
        data: book,
      };
    } catch (error) {
      throw new Error(`Failed to get book: ${error.message}`);
    }
  }
}

module.exports = GetBookByIdUseCase;

