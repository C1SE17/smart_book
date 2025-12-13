/**
 * Validation Error
 * Error for validation failures
 */
const DomainError = require('./DomainError');

class ValidationError extends DomainError {
  constructor(message, field = null) {
    super(message, 'VALIDATION_ERROR', 400);
    this.field = field;
  }
}

module.exports = ValidationError;

