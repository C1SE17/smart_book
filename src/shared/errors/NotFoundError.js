/**
 * Not Found Error
 * Error for resource not found scenarios
 */
const DomainError = require('./DomainError');

class NotFoundError extends DomainError {
  constructor(resource = 'Resource', id = null) {
    const message = id 
      ? `${resource} with id ${id} not found`
      : `${resource} not found`;
    super(message, 'NOT_FOUND', 404);
  }
}

module.exports = NotFoundError;

