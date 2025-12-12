/**
 * Publisher Repository Interface
 * Defines the contract for publisher data access
 */
class IPublisherRepository {
  async findById(id) {
    throw new Error('Method findById() must be implemented');
  }

  async findAll(filters = {}) {
    throw new Error('Method findAll() must be implemented');
  }

  async findByName(name) {
    throw new Error('Method findByName() must be implemented');
  }

  async create(publisherData) {
    throw new Error('Method create() must be implemented');
  }

  async update(id, publisherData) {
    throw new Error('Method update() must be implemented');
  }

  async delete(id) {
    throw new Error('Method delete() must be implemented');
  }
}

module.exports = IPublisherRepository;

