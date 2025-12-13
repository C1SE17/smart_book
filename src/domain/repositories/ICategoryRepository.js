/**
 * Category Repository Interface
 * Defines the contract for category data access
 */
class ICategoryRepository {
  async findById(id) {
    throw new Error('Method findById() must be implemented');
  }

  async findAll(filters = {}) {
    throw new Error('Method findAll() must be implemented');
  }

  async findByParentId(parentId) {
    throw new Error('Method findByParentId() must be implemented');
  }

  async create(categoryData) {
    throw new Error('Method create() must be implemented');
  }

  async update(id, categoryData) {
    throw new Error('Method update() must be implemented');
  }

  async delete(id) {
    throw new Error('Method delete() must be implemented');
  }
}

module.exports = ICategoryRepository;

