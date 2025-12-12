/**
 * Cart Entity - Domain Model
 * Represents the core business concept of a Shopping Cart
 */
class Cart {
  constructor({
    cart_id,
    user_id,
    items = [],
    created_at,
    updated_at,
  }) {
    this.cart_id = cart_id;
    this.user_id = user_id;
    this.items = items;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  /**
   * Business logic: Calculate total price
   */
  calculateTotal() {
    if (!this.items || this.items.length === 0) {
      return 0;
    }
    return this.items.reduce((total, item) => {
      return total + (item.quantity * item.price);
    }, 0);
  }

  /**
   * Business logic: Get total items count
   */
  getTotalItems() {
    if (!this.items || this.items.length === 0) {
      return 0;
    }
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  /**
   * Business logic: Check if cart is empty
   */
  isEmpty() {
    return !this.items || this.items.length === 0;
  }

  /**
   * Business logic: Find item by book_id
   */
  findItem(book_id) {
    if (!this.items) return null;
    return this.items.find(item => item.book_id === book_id);
  }

  /**
   * Business logic: Add item to cart
   */
  addItem(book_id, quantity, price) {
    if (!this.items) {
      this.items = [];
    }
    
    const existingItem = this.findItem(book_id);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push({
        book_id,
        quantity,
        price,
      });
    }
    this.updated_at = new Date();
  }

  /**
   * Business logic: Update item quantity
   */
  updateItemQuantity(book_id, quantity) {
    const item = this.findItem(book_id);
    if (!item) {
      throw new Error('Item not found in cart');
    }
    if (quantity <= 0) {
      this.removeItem(book_id);
    } else {
      item.quantity = quantity;
      this.updated_at = new Date();
    }
  }

  /**
   * Business logic: Remove item from cart
   */
  removeItem(book_id) {
    if (!this.items) return;
    this.items = this.items.filter(item => item.book_id !== book_id);
    this.updated_at = new Date();
  }

  /**
   * Business logic: Clear cart
   */
  clear() {
    this.items = [];
    this.updated_at = new Date();
  }

  /**
   * Convert to plain object
   */
  toJSON() {
    return {
      cart_id: this.cart_id,
      user_id: this.user_id,
      items: this.items,
      total: this.calculateTotal(),
      total_items: this.getTotalItems(),
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}

module.exports = Cart;

