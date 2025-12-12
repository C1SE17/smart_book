/**
 * Unauthorized Error
 * Error for authentication/authorization failures
 */
const DomainError = require('./DomainError');

class UnauthorizedError extends DomainError {
  constructor(message = 'Unauthorized') {
    super(message, 'UNAUTHORIZED', 401);
  }
}

module.exports = UnauthorizedError;

