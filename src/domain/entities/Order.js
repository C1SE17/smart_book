/**
 * Order Entity - Domain Model
 * Represents the core business concept of an Order
 */
class Order {
  constructor({
    order_id,
    user_id,
    status,
    total_price,
    shipping_address,
    created_at,
    updated_at,
    items = [],
  }) {
    this.order_id = order_id;
    this.user_id = user_id;
    this.status = status;
    this.total_price = total_price;
    this.shipping_address = shipping_address;
    this.created_at = created_at;
    this.updated_at = updated_at;
    this.items = items;
  }

  /**
   * Business logic: Check if order can be cancelled
   */
  canBeCancelled() {
    return ['pending', 'confirmed'].includes(this.status);
  }

  /**
   * Business logic: Check if order is completed
   */
  isCompleted() {
    return this.status === 'completed';
  }

  /**
   * Business logic: Calculate total from items
   */
  calculateTotal() {
    if (!this.items || this.items.length === 0) {
      return 0;
    }
    return this.items.reduce((total, item) => {
      return total + (item.quantity * item.price_at_order);
    }, 0);
  }

  /**
   * Business logic: Update order status
   */
  updateStatus(newStatus) {
    const validStatuses = ['pending', 'confirmed', 'shipping', 'completed', 'cancelled'];
    if (!validStatuses.includes(newStatus)) {
      throw new Error(`Invalid order status: ${newStatus}`);
    }
    this.status = newStatus;
    this.updated_at = new Date();
  }

  /**
   * Business logic: Add item to order
   */
  addItem(item) {
    if (!this.items) {
      this.items = [];
    }
    this.items.push(item);
    this.total_price = this.calculateTotal();
  }

  /**
   * Convert to plain object
   */
  toJSON() {
    return {
      order_id: this.order_id,
      user_id: this.user_id,
      status: this.status,
      total_price: this.total_price,
      shipping_address: this.shipping_address,
      created_at: this.created_at,
      updated_at: this.updated_at,
      items: this.items,
    };
  }
}

module.exports = Order;

