/**
 * Domain Error
 * Base error class for domain-specific errors
 */
class DomainError extends Error {
  constructor(message, code = 'DOMAIN_ERROR', statusCode = 400) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = DomainError;

