/**
 * Review Entity - Domain Model
 * Represents the core business concept of a Review
 */
class Review {
  constructor({
    review_id,
    book_id,
    user_id,
    rating,
    comment,
    created_at,
    updated_at,
    user_name,
  }) {
    this.review_id = review_id;
    this.book_id = book_id;
    this.user_id = user_id;
    this.rating = rating;
    this.comment = comment;
    this.created_at = created_at;
    this.updated_at = updated_at;
    this.user_name = user_name;
  }

  /**
   * Business logic: Validate rating
   */
  static validateRating(rating) {
    const numRating = Number(rating);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }
    return true;
  }

  /**
   * Business logic: Check if review has comment
   */
  hasComment() {
    return !!this.comment && this.comment.trim().length > 0;
  }

  /**
   * Business logic: Check if review can be edited
   */
  canBeEdited(editedAt) {
    const editTime = editedAt || new Date();
    const createdTime = new Date(this.created_at);
    const hoursDiff = (editTime - createdTime) / (1000 * 60 * 60);
    return hoursDiff < 24; // Can edit within 24 hours
  }

  /**
   * Convert to plain object
   */
  toJSON() {
    return {
      review_id: this.review_id,
      book_id: this.book_id,
      user_id: this.user_id,
      rating: this.rating,
      comment: this.comment,
      created_at: this.created_at,
      updated_at: this.updated_at,
      user_name: this.user_name,
    };
  }
}

module.exports = Review;

