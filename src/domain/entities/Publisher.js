/**
 * Publisher Entity - Domain Model
 * Represents the core business concept of a Publisher
 */
class Publisher {
  constructor({
    publisher_id,
    name,
    address,
    phone,
    email,
    created_at,
    updated_at,
  }) {
    this.publisher_id = publisher_id;
    this.name = name;
    this.address = address;
    this.phone = phone;
    this.email = email;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  /**
   * Business logic: Validate publisher name
   */
  static validateName(name) {
    if (!name || name.trim().length === 0) {
      throw new Error('Publisher name is required');
    }
    return true;
  }

  /**
   * Convert to plain object
   */
  toJSON() {
    return {
      publisher_id: this.publisher_id,
      name: this.name,
      address: this.address,
      phone: this.phone,
      email: this.email,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}

module.exports = Publisher;

