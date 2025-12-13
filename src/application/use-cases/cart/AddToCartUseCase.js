/**
 * Add To Cart Use Case
 * Application layer orchestrates add to cart workflow
 */
class AddToCartUseCase {
  constructor(cartRepository, bookRepository) {
    this.cartRepository = cartRepository;
    this.bookRepository = bookRepository;
  }

  async execute(cartData) {
    try {
      const { user_id, book_id, quantity } = cartData;

      if (!user_id || !book_id || !quantity || quantity <= 0) {
        throw new Error('Invalid cart data');
      }

      // Get book information
      const book = await this.bookRepository.findById(book_id);
      if (!book) {
        throw new Error('Book not found');
      }

      if (!book.isInStock()) {
        throw new Error('Book is out of stock');
      }

      // Add item to cart
      const cart = await this.cartRepository.addItem(
        user_id,
        book_id,
        quantity,
        book.price
      );

      return {
        success: true,
        data: cart.toJSON(),
      };
    } catch (error) {
      throw new Error(`Failed to add to cart: ${error.message}`);
    }
  }
}

module.exports = AddToCartUseCase;

