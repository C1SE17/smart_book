/**
 * Category Entity - Domain Model
 * Represents the core business concept of a Category
 */
class Category {
  constructor({
    category_id,
    name,
    description,
    parent_id,
    slug,
    created_at,
    updated_at,
  }) {
    this.category_id = category_id;
    this.name = name;
    this.description = description;
    this.parent_id = parent_id;
    this.slug = slug;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  /**
   * Business logic: Check if category is root (no parent)
   */
  isRoot() {
    return !this.parent_id;
  }

  /**
   * Business logic: Check if category has parent
   */
  hasParent() {
    return !!this.parent_id;
  }

  /**
   * Business logic: Validate category name
   */
  static validateName(name) {
    if (!name || name.trim().length === 0) {
      throw new Error('Category name is required');
    }
    if (name.length > 100) {
      throw new Error('Category name must be less than 100 characters');
    }
    return true;
  }

  /**
   * Convert to plain object
   */
  toJSON() {
    return {
      category_id: this.category_id,
      name: this.name,
      description: this.description,
      parent_id: this.parent_id,
      slug: this.slug,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}

module.exports = Category;

