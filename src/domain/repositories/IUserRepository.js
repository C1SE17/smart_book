/**
 * User Repository Interface
 * Defines the contract for user data access
 */
class IUserRepository {
  async findById(id) {
    throw new Error('Method findById() must be implemented');
  }

  async findByEmail(email) {
    throw new Error('Method findByEmail() must be implemented');
  }

  async findAll(filters = {}) {
    throw new Error('Method findAll() must be implemented');
  }

  async create(userData) {
    throw new Error('Method create() must be implemented');
  }

  async update(id, userData) {
    throw new Error('Method update() must be implemented');
  }

  async delete(id) {
    throw new Error('Method delete() must be implemented');
  }
}

module.exports = IUserRepository;

