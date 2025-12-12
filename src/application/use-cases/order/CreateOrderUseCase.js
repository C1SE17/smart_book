/**
 * Create Order Use Case
 * Application layer orchestrates order creation workflow
 */
const Order = require('../../../domain/entities/Order');

class CreateOrderUseCase {
  constructor(orderRepository, bookRepository, warehouseRepository) {
    this.orderRepository = orderRepository;
    this.bookRepository = bookRepository;
    this.warehouseRepository = warehouseRepository;
  }

  async execute(orderData) {
    try {
      const { user_id, book_id, quantity, shipping_address } = orderData;

      // Validate input
      if (!user_id || !book_id || !quantity || quantity <= 0) {
        throw new Error('Invalid order data');
      }

      // Get book information
      const book = await this.bookRepository.findById(book_id);
      if (!book) {
        throw new Error('Book not found');
      }

      // Check stock availability
      if (!book.isInStock() || book.stock < quantity) {
        throw new Error('Insufficient stock');
      }

      // Create draft order
      const order = await this.orderRepository.createDraftOrder(
        user_id,
        book_id,
        quantity,
        shipping_address || ''
      );

      return {
        success: true,
        data: order.toJSON(),
      };
    } catch (error) {
      throw new Error(`Failed to create order: ${error.message}`);
    }
  }
}

module.exports = CreateOrderUseCase;

