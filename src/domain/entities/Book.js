/**
 * Book Entity - Domain Model
 * Represents the core business concept of a Book
 */
class Book {
  constructor({
    book_id,
    title,
    description,
    price,
    stock,
    category_id,
    author_id,
    publisher_id,
    published_date,
    cover_image,
    slug,
    rating = 0,
    review_count = 0,
    author_name,
    publisher_name,
    category_name,
  }) {
    this.book_id = book_id;
    this.title = title;
    this.description = description;
    this.price = price;
    this.stock = stock;
    this.category_id = category_id;
    this.author_id = author_id;
    this.publisher_id = publisher_id;
    this.published_date = published_date;
    this.cover_image = cover_image;
    this.slug = slug;
    this.rating = Number(rating) || 0;
    this.review_count = Number(review_count) || 0;
    this.author_name = author_name;
    this.publisher_name = publisher_name;
    this.category_name = category_name;
  }

  /**
   * Business logic: Check if book is in stock
   */
  isInStock() {
    return this.stock > 0;
  }

  /**
   * Business logic: Check if book is available for purchase
   */
  isAvailable() {
    return this.isInStock() && this.price > 0;
  }

  /**
   * Business logic: Calculate discount price
   */
  calculateDiscountPrice(discountPercent) {
    if (discountPercent <= 0 || discountPercent >= 100) {
      return this.price;
    }
    return this.price * (1 - discountPercent / 100);
  }

  /**
   * Business logic: Update stock after order
   */
  reduceStock(quantity) {
    if (quantity <= 0) {
      throw new Error('Quantity must be positive');
    }
    if (this.stock < quantity) {
      throw new Error('Insufficient stock');
    }
    this.stock -= quantity;
  }

  /**
   * Business logic: Add stock
   */
  addStock(quantity) {
    if (quantity <= 0) {
      throw new Error('Quantity must be positive');
    }
    this.stock += quantity;
  }

  /**
   * Convert to plain object
   */
  toJSON() {
    return {
      book_id: this.book_id,
      title: this.title,
      description: this.description,
      price: this.price,
      stock: this.stock,
      category_id: this.category_id,
      author_id: this.author_id,
      publisher_id: this.publisher_id,
      published_date: this.published_date,
      cover_image: this.cover_image,
      slug: this.slug,
      rating: this.rating,
      review_count: this.review_count,
      author_name: this.author_name,
      publisher_name: this.publisher_name,
      category_name: this.category_name,
    };
  }
}

module.exports = Book;

