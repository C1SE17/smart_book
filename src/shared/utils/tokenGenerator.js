/**
 * Token Generator Utility
 * Abstraction for JWT token generation
 */
const jwt = require('jsonwebtoken');

class TokenGenerator {
  constructor() {
    this.secret = process.env.JWT_SECRET || 'your-secret-key';
    this.expiresIn = process.env.JWT_EXPIRES_IN || '24h';
  }

  /**
   * Generate JWT token
   * @param {Object} payload - Token payload
   * @returns {string} JWT token
   */
  generate(payload) {
    if (!payload) {
      throw new Error('Payload is required');
    }
    return jwt.sign(payload, this.secret, {
      expiresIn: this.expiresIn,
    });
  }

  /**
   * Verify JWT token
   * @param {string} token - JWT token
   * @returns {Object} Decoded token payload
   */
  verify(token) {
    if (!token) {
      throw new Error('Token is required');
    }
    return jwt.verify(token, this.secret);
  }

  /**
   * Decode token without verification (for debugging)
   * @param {string} token - JWT token
   * @returns {Object} Decoded token payload
   */
  decode(token) {
    return jwt.decode(token);
  }
}

module.exports = new TokenGenerator();

