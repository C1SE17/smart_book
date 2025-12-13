/**
 * Author Entity - Domain Model
 * Represents the core business concept of an Author
 */
class Author {
  constructor({
    author_id,
    name,
    bio,
    birth_date,
    nationality,
    created_at,
    updated_at,
  }) {
    this.author_id = author_id;
    this.name = name;
    this.bio = bio;
    this.birth_date = birth_date;
    this.nationality = nationality;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  /**
   * Business logic: Validate author name
   */
  static validateName(name) {
    if (!name || name.trim().length === 0) {
      throw new Error('Author name is required');
    }
    return true;
  }

  /**
   * Convert to plain object
   */
  toJSON() {
    return {
      author_id: this.author_id,
      name: this.name,
      bio: this.bio,
      birth_date: this.birth_date,
      nationality: this.nationality,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}

module.exports = Author;

