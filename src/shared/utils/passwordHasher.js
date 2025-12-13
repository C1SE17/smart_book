/**
 * Password Hasher Utility
 * Abstraction for password hashing operations
 */
const bcrypt = require('bcrypt');

class PasswordHasher {
  /**
   * Hash a password
   * @param {string} password - Plain text password
   * @returns {Promise<string>} Hashed password
   */
  async hash(password) {
    if (!password) {
      throw new Error('Password is required');
    }
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  /**
   * Compare password with hash
   * @param {string} password - Plain text password
   * @param {string} hash - Hashed password
   * @returns {Promise<boolean>} True if password matches
   */
  async compare(password, hash) {
    if (!password || !hash) {
      return false;
    }
    return bcrypt.compare(password, hash);
  }
}

module.exports = new PasswordHasher();

