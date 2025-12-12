/**
 * User Entity - Domain Model
 * Represents the core business concept of a User
 */
class User {
  constructor({
    user_id,
    name,
    email,
    phone,
    address,
    role = 'customer',
    created_at,
    updated_at,
  }) {
    this.user_id = user_id;
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.address = address;
    this.role = role;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  /**
   * Business logic: Check if user is admin
   */
  isAdmin() {
    return this.role === 'admin';
  }

  /**
   * Business logic: Check if user is customer
   */
  isCustomer() {
    return this.role === 'customer';
  }

  /**
   * Business logic: Validate email format
   */
  static validateEmail(email) {
    if (!email) return false;
    return email.includes('@') && email.endsWith('@gmail.com');
  }

  /**
   * Business logic: Validate user data
   */
  static validate(userData) {
    const { name, email, password } = userData;
    if (!name || !email || !password) {
      throw new Error('Name, email, and password are required');
    }
    if (!User.validateEmail(email)) {
      throw new Error('Email must be a valid Gmail address');
    }
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }
    return true;
  }

  /**
   * Convert to plain object (without sensitive data)
   */
  toJSON() {
    return {
      user_id: this.user_id,
      name: this.name,
      email: this.email,
      phone: this.phone,
      address: this.address,
      role: this.role,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}

module.exports = User;

