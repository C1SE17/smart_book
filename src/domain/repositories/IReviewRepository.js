/**
 * Review Repository Interface
 * Defines the contract for review data access
 */
class IReviewRepository {
  async findById(id) {
    throw new Error('Method findById() must be implemented');
  }

  async findByBookId(bookId, filters = {}) {
    throw new Error('Method findByBookId() must be implemented');
  }

  async findByUserId(userId, filters = {}) {
    throw new Error('Method findByUserId() must be implemented');
  }

  async findAll(filters = {}) {
    throw new Error('Method findAll() must be implemented');
  }

  async create(reviewData) {
    throw new Error('Method create() must be implemented');
  }

  async update(id, reviewData) {
    throw new Error('Method update() must be implemented');
  }

  async delete(id) {
    throw new Error('Method delete() must be implemented');
  }

  async getBookRatingStats(bookId) {
    throw new Error('Method getBookRatingStats() must be implemented');
  }
}

module.exports = IReviewRepository;

