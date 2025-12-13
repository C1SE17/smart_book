/**
 * Forbidden Error
 * Error for authorization failures
 */
const DomainError = require('./DomainError');

class ForbiddenError extends DomainError {
  constructor(message = 'Forbidden') {
    super(message, 'FORBIDDEN', 403);
  }
}

module.exports = ForbiddenError;

