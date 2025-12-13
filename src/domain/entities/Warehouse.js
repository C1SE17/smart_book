/**
 * Warehouse Entity - Domain Model
 * Represents the core business concept of Warehouse/Inventory
 */
class Warehouse {
  constructor({
    warehouse_id,
    book_id,
    quantity,
    reserved_quantity = 0,
    location,
    created_at,
    updated_at,
  }) {
    this.warehouse_id = warehouse_id;
    this.book_id = book_id;
    this.quantity = quantity;
    this.reserved_quantity = reserved_quantity;
    this.location = location;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  /**
   * Business logic: Get available quantity
   */
  getAvailableQuantity() {
    return Math.max(0, this.quantity - this.reserved_quantity);
  }

  /**
   * Business logic: Check if stock is available
   */
  hasStock(requiredQuantity) {
    return this.getAvailableQuantity() >= requiredQuantity;
  }

  /**
   * Business logic: Reserve stock
   */
  reserve(quantity) {
    if (!this.hasStock(quantity)) {
      throw new Error('Insufficient stock available');
    }
    this.reserved_quantity += quantity;
    this.updated_at = new Date();
  }

  /**
   * Business logic: Release reserved stock
   */
  releaseReserved(quantity) {
    if (this.reserved_quantity < quantity) {
      throw new Error('Cannot release more than reserved');
    }
    this.reserved_quantity -= quantity;
    this.updated_at = new Date();
  }

  /**
   * Business logic: Add stock
   */
  addStock(quantity) {
    if (quantity <= 0) {
      throw new Error('Quantity must be positive');
    }
    this.quantity += quantity;
    this.updated_at = new Date();
  }

  /**
   * Business logic: Reduce stock
   */
  reduceStock(quantity) {
    if (quantity <= 0) {
      throw new Error('Quantity must be positive');
    }
    if (!this.hasStock(quantity)) {
      throw new Error('Insufficient stock');
    }
    this.quantity -= quantity;
    this.reserved_quantity = Math.max(0, this.reserved_quantity - quantity);
    this.updated_at = new Date();
  }

  /**
   * Convert to plain object
   */
  toJSON() {
    return {
      warehouse_id: this.warehouse_id,
      book_id: this.book_id,
      quantity: this.quantity,
      reserved_quantity: this.reserved_quantity,
      available_quantity: this.getAvailableQuantity(),
      location: this.location,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}

module.exports = Warehouse;

