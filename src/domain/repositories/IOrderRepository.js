/**
 * Order Repository Interface
 * Defines the contract for order data access
 */
class IOrderRepository {
  async findById(id) {
    throw new Error('Method findById() must be implemented');
  }

  async findByUserId(userId, filters = {}) {
    throw new Error('Method findByUserId() must be implemented');
  }

  async findAll(filters = {}) {
    throw new Error('Method findAll() must be implemented');
  }

  async create(orderData) {
    throw new Error('Method create() must be implemented');
  }

  async update(id, orderData) {
    throw new Error('Method update() must be implemented');
  }

  async updateStatus(id, status) {
    throw new Error('Method updateStatus() must be implemented');
  }

  async createDraftOrder(userId, bookId, quantity, shippingAddress) {
    throw new Error('Method createDraftOrder() must be implemented');
  }
}

module.exports = IOrderRepository;

