const { mysql } = require('../../../config/database');
const db = mysql;
const Book = require('../../../../domain/entities/Book');

/**
 * Book Repository Implementation
 * Infrastructure layer - MySQL implementation
 */
class BookRepository {
  static mapBookRow(row) {
    return new Book({
      ...row,
      rating: Number(row.rating ?? 0),
      review_count: Number(row.review_count ?? 0),
    });
  }

  async findAll({
    page = 1,
    limit = 10,
    category_id,
    author_id,
    publisher_id,
    search,
  }) {
    const offset = (page - 1) * limit;
    
    let dataQuery = `
      SELECT 
        b.book_id,
        b.title,
        b.description,
        b.price,
        b.stock,
        b.category_id,
        b.author_id,
        b.publisher_id,
        b.published_date,
        b.cover_image,
        b.slug,
        a.name as author_name,
        p.name as publisher_name,
        c.name as category_name,
        COALESCE(r.avg_rating, 0) AS rating,
        COALESCE(r.review_count, 0) AS review_count
      FROM books b
      LEFT JOIN authors a ON b.author_id = a.author_id
      LEFT JOIN publishers p ON b.publisher_id = p.publisher_id
      LEFT JOIN categories c ON b.category_id = c.category_id
      LEFT JOIN (
        SELECT 
          book_id, 
          AVG(rating) AS avg_rating, 
          COUNT(*) AS review_count
        FROM reviews
        GROUP BY book_id
      ) r ON b.book_id = r.book_id
    `;
    
    let countQuery = `
      SELECT COUNT(*) as total
      FROM books b
      LEFT JOIN authors a ON b.author_id = a.author_id
      LEFT JOIN publishers p ON b.publisher_id = p.publisher_id
      LEFT JOIN categories c ON b.category_id = c.category_id
    `;
    
    let conditions = [];
    let params = [];

    if (category_id) {
      conditions.push('b.category_id = ?');
      params.push(category_id);
    }
    if (author_id) {
      conditions.push('b.author_id = ?');
      params.push(author_id);
    }
    if (publisher_id) {
      conditions.push('b.publisher_id = ?');
      params.push(publisher_id);
    }
    if (search) {
      conditions.push(`(b.title LIKE ? OR a.name LIKE ?)`);
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern);
    }

    if (conditions.length > 0) {
      const whereClause = ' WHERE ' + conditions.join(' AND ');
      dataQuery += whereClause;
      countQuery += whereClause;
    }

    dataQuery += ' ORDER BY b.book_id ASC LIMIT ? OFFSET ?';
    const dataParams = [...params, limit, offset];

    const [dataRows] = await db.query(dataQuery, dataParams);
    const books = dataRows.map(row => BookRepository.mapBookRow(row));
    
    const [countRows] = await db.query(countQuery, params);
    const total = countRows[0].total;
    const totalPages = Math.ceil(total / limit);
    
    return {
      books,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  async findById(id) {
    const [rows] = await db.query(
      `SELECT 
        b.book_id,
        b.title,
        b.description,
        b.price,
        b.stock,
        b.cover_image,
        c.name AS category_name,
        a.name AS author_name,
        p.name AS publisher_name,
        COALESCE(r.avg_rating, 0) AS rating,
        COALESCE(r.review_count, 0) AS review_count
      FROM books b
      LEFT JOIN categories c ON b.category_id = c.category_id
      LEFT JOIN authors a ON b.author_id = a.author_id
      LEFT JOIN publishers p ON b.publisher_id = p.publisher_id
      LEFT JOIN (
        SELECT 
          book_id, 
          AVG(rating) AS avg_rating, 
          COUNT(*) AS review_count
        FROM reviews
        GROUP BY book_id
      ) r ON b.book_id = r.book_id
      WHERE b.book_id = ?`,
      [id]
    );
    
    if (!rows[0]) return null;
    return BookRepository.mapBookRow(rows[0]);
  }

  async findByIds(ids = []) {
    if (!Array.isArray(ids) || ids.length === 0) {
      return [];
    }
    const placeholders = ids.map(() => '?').join(',');
    const [rows] = await db.query(
      `SELECT 
        b.book_id,
        b.title,
        b.description,
        b.price,
        b.stock,
        b.category_id,
        b.author_id,
        b.publisher_id,
        b.published_date,
        b.cover_image,
        a.name as author_name,
        p.name as publisher_name,
        c.name as category_name,
        COALESCE(r.avg_rating, 0) AS rating,
        COALESCE(r.review_count, 0) AS review_count
      FROM books b
      LEFT JOIN authors a ON b.author_id = a.author_id
      LEFT JOIN publishers p ON b.publisher_id = p.publisher_id
      LEFT JOIN categories c ON b.category_id = c.category_id
      LEFT JOIN (
        SELECT 
          book_id, 
          AVG(rating) AS avg_rating, 
          COUNT(*) AS review_count
        FROM reviews
        GROUP BY book_id
      ) r ON b.book_id = r.book_id
      WHERE b.book_id IN (${placeholders})
      ORDER BY FIELD(b.book_id, ${placeholders})`,
      [...ids, ...ids]
    );
    return rows.map(row => BookRepository.mapBookRow(row));
  }

  async findByCategory(categoryId, options = {}) {
    return this.findRelatedByField('category_id', categoryId, options);
  }

  async findByAuthor(authorId, options = {}) {
    return this.findRelatedByField('author_id', authorId, options);
  }

  async findRelatedByField(field, value, { excludeIds = [], limit = 5, fetchLimit } = {}) {
    if (value === undefined || value === null) {
      return [];
    }

    const excludes = Array.isArray(excludeIds)
      ? excludeIds.filter((id) => id !== undefined && id !== null)
      : [];
    const internalLimit = fetchLimit || Math.max(limit * 3, limit + 5);

    const params = [value];
    let notInClause = '';
    if (excludes.length > 0) {
      notInClause = ` AND b.book_id NOT IN (${excludes.map(() => '?').join(',')})`;
      params.push(...excludes);
    }
    params.push(internalLimit);

    const [rows] = await db.query(
      `SELECT 
        b.book_id,
        b.title,
        b.description,
        b.price,
        b.stock,
        b.category_id,
        b.author_id,
        b.publisher_id,
        b.published_date,
        b.cover_image,
        a.name AS author_name,
        p.name AS publisher_name,
        c.name AS category_name,
        COALESCE(r.avg_rating, 0) AS rating,
        COALESCE(r.review_count, 0) AS review_count
      FROM books b
      LEFT JOIN authors a ON b.author_id = a.author_id
      LEFT JOIN publishers p ON b.publisher_id = p.publisher_id
      LEFT JOIN categories c ON b.category_id = c.category_id
      LEFT JOIN (
        SELECT 
          book_id, 
          AVG(rating) AS avg_rating, 
          COUNT(*) AS review_count
        FROM reviews
        GROUP BY book_id
      ) r ON b.book_id = r.book_id
      WHERE b.${field} = ?${notInClause}
      ORDER BY r.avg_rating DESC, b.book_id DESC
      LIMIT ?`,
      params
    );

    return rows.map(row => BookRepository.mapBookRow(row));
  }

  async create(bookData) {
    const {
      title,
      description,
      price,
      stock,
      category_id,
      author_id,
      publisher_id,
      cover_image,
    } = bookData;
    
    const [result] = await db.promise().query(
      `INSERT INTO books 
        (title, description, price, stock, category_id, author_id, publisher_id, cover_image) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, price, stock, category_id, author_id, publisher_id, cover_image]
    );
    
    return this.findById(result.insertId);
  }

  async update(id, bookData) {
    const fields = [];
    const params = [];
    for (const [key, value] of Object.entries(bookData)) {
      fields.push(`${key} = ?`);
      params.push(value);
    }
    params.push(id);

    const query = `UPDATE books SET ${fields.join(', ')} WHERE book_id = ?`;
    await db.query(query, params);
    return this.findById(id);
  }

  async delete(id) {
    await db.query('DELETE FROM books WHERE book_id = ?', [id]);
  }

  async advancedSearch(searchParams) {
    // Implementation from original Book model
    // This is a simplified version - full implementation should be migrated
    return this.findAll(searchParams);
  }

  async getSearchSuggestions(query) {
    const searchTerm = `%${query}%`;
    
    const [books] = await db.promise().query(`
      SELECT DISTINCT
        'book' as type,
        b.book_id as id,
        b.title as title,
        CONCAT('Sách: ', b.title) as subtitle
      FROM books b
      WHERE b.title LIKE ?
      LIMIT 5
    `, [searchTerm]);

    const [authors] = await db.promise().query(`
      SELECT DISTINCT
        'author' as type,
        a.author_id as id,
        a.name as title,
        CONCAT('Tác giả: ', a.name) as subtitle
      FROM authors a
      WHERE a.name LIKE ?
      LIMIT 3
    `, [searchTerm]);

    const [categories] = await db.promise().query(`
      SELECT DISTINCT
        'category' as type,
        c.category_id as id,
        c.name as title,
        CONCAT('Danh mục: ', c.name) as subtitle
      FROM categories c
      WHERE c.name LIKE ?
      LIMIT 3
    `, [searchTerm]);

    const allSuggestions = [...books, ...authors, ...categories];
    allSuggestions.sort((a, b) => a.title.localeCompare(b.title));
    return allSuggestions.slice(0, 10);
  }
}

module.exports = BookRepository;

