/**
 * Cart Repository Interface
 * Defines the contract for cart data access
 */
class ICartRepository {
  async findByUserId(userId) {
    throw new Error('Method findByUserId() must be implemented');
  }

  async findById(cartId) {
    throw new Error('Method findById() must be implemented');
  }

  async create(cartData) {
    throw new Error('Method create() must be implemented');
  }

  async update(cartId, cartData) {
    throw new Error('Method update() must be implemented');
  }

  async addItem(userId, bookId, quantity, price) {
    throw new Error('Method addItem() must be implemented');
  }

  async updateItem(userId, bookId, quantity) {
    throw new Error('Method updateItem() must be implemented');
  }

  async removeItem(userId, bookId) {
    throw new Error('Method removeItem() must be implemented');
  }

  async clear(userId) {
    throw new Error('Method clear() must be implemented');
  }
}

module.exports = ICartRepository;

