/**
 * Warehouse Repository Interface
 * Defines the contract for warehouse/inventory data access
 */
class IWarehouseRepository {
  async findById(id) {
    throw new Error('Method findById() must be implemented');
  }

  async findByBookId(bookId) {
    throw new Error('Method findByBookId() must be implemented');
  }

  async findAll(filters = {}) {
    throw new Error('Method findAll() must be implemented');
  }

  async create(warehouseData) {
    throw new Error('Method create() must be implemented');
  }

  async update(id, warehouseData) {
    throw new Error('Method update() must be implemented');
  }

  async updateStock(bookId, quantity) {
    throw new Error('Method updateStock() must be implemented');
  }

  async reserveStock(bookId, quantity) {
    throw new Error('Method reserveStock() must be implemented');
  }

  async releaseStock(bookId, quantity) {
    throw new Error('Method releaseStock() must be implemented');
  }
}

module.exports = IWarehouseRepository;

