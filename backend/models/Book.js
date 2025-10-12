const db = require("../config/db");

class Book {
  static async getAll({
    page = 1,
    limit = 10,
    category_id,
    author_id,
    publisher_id,
    search,
  }) {
    const offset = (page - 1) * limit; // Tính offset cho phân trang
    
    // Query để lấy dữ liệu sách
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
                c.name as category_name
            FROM books b
            LEFT JOIN authors a ON b.author_id = a.author_id
            LEFT JOIN publishers p ON b.publisher_id = p.publisher_id
            LEFT JOIN categories c ON b.category_id = c.category_id
        `;
    
    // Query để đếm tổng số sách
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
      // Lọc theo danh mục
      conditions.push("b.category_id = ?");
      params.push(category_id);
    }
    if (author_id) {
      // Lọc theo tác giả
      conditions.push("b.author_id = ?");
      params.push(author_id);
    }
    if (publisher_id) {
      // Lọc theo nhà xuất bản
      conditions.push("b.publisher_id = ?");
      params.push(publisher_id);
    }
    if (search) {
      // Tìm kiếm theo tên sách và tên tác giả
      conditions.push(`(
        b.title LIKE ? OR 
        a.name LIKE ?
      )`);
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern);
    }

    if (conditions.length > 0) {
      const whereClause = " WHERE " + conditions.join(" AND ");
      dataQuery += whereClause;
      countQuery += whereClause;
    }

    dataQuery += " ORDER BY b.book_id ASC LIMIT ? OFFSET ?"; // Thêm phân trang và sắp xếp
    const dataParams = [...params, limit, offset];

    // Thực hiện cả hai query song song
    const [dataRows] = await db.promise().query(dataQuery, dataParams);
    const [countRows] = await db.promise().query(countQuery, params);
    
    const total = countRows[0].total;
    const totalPages = Math.ceil(total / limit);
    
    return {
      books: dataRows,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    };
  }

  static async getById(id) {
    // Lấy chi tiết sản phẩm
    const [rows] = await db.promise().query(
      `SELECT 
            b.book_id,
            b.title,
            b.description,
            b.price,
            b.stock,
            c.name AS category_name,
            a.name AS author_name,
            p.name AS publisher_name
        FROM books b
        LEFT JOIN categories c ON b.category_id = c.category_id
        LEFT JOIN authors a ON b.author_id = a.author_id
        LEFT JOIN publishers p ON b.publisher_id = p.publisher_id
        WHERE b.book_id = ?
        ORDER BY b.book_id ASC;
        `,
      [id]
    );
    return rows[0];
  }

  static async create(bookData) {
    // Tạo sản phẩm mới
    const {
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
    } = bookData;
    const [result] = await db.promise().query(
      `
            INSERT INTO books 
            (title, description, price, stock, category_id, author_id, publisher_id, cover_image) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `,
      [
        title,
        description,
        price,
        stock,
        category_id,
        author_id,
        publisher_id,
        cover_image,
      ]
    );
    console.log("✅ [Book Model] Sách đã được tạo thành công:", result);
    return { id: result.insertId, ...bookData };
  }

  static async update(id, bookData) {
    // Cập nhật sản phẩm
    const fields = [];
    const params = [];
    for (const [key, value] of Object.entries(bookData)) {
      fields.push(`${key} = ?`);
      params.push(value);
    }
    params.push(id);

    const query = `UPDATE books SET ${fields.join(", ")} WHERE book_id = ?`;
    await db.promise().query(query, params);
    return { id, ...bookData };
  }

  static async delete(id) {
    // Xóa sản phẩm
    await db.promise().query("DELETE FROM books WHERE book_id = ?", [id]);
    return { id };
  }

  // ==================== SEARCH SUGGESTIONS ====================
  static async getSearchSuggestions(query) {
    try {
      const searchTerm = `%${query}%`;
      
      // Get suggestions from books, authors, and categories separately
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

      // Combine all suggestions and sort by title
      const allSuggestions = [...books, ...authors, ...categories];
      allSuggestions.sort((a, b) => a.title.localeCompare(b.title));

      // Return first 10 suggestions
      return allSuggestions.slice(0, 10);
    } catch (error) {
      console.error('Error getting search suggestions:', error);
      throw error;
    }
  }

  // ==================== POPULAR KEYWORDS ====================
  static async getPopularKeywords() {
    try {
      // Lấy từ khóa phổ biến từ tên sách, tác giả, danh mục
      const [keywords] = await db.promise().query(`
        SELECT DISTINCT
          SUBSTRING_INDEX(SUBSTRING_INDEX(b.title, ' ', numbers.n), ' ', -1) as keyword,
          COUNT(*) as frequency
        FROM books b
        CROSS JOIN (
          SELECT 1 n UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5
        ) numbers
        WHERE CHAR_LENGTH(b.title) - CHAR_LENGTH(REPLACE(b.title, ' ', '')) >= numbers.n - 1
          AND SUBSTRING_INDEX(SUBSTRING_INDEX(b.title, ' ', numbers.n), ' ', -1) != ''
          AND CHAR_LENGTH(SUBSTRING_INDEX(SUBSTRING_INDEX(b.title, ' ', numbers.n), ' ', -1)) > 2
        GROUP BY keyword
        HAVING frequency > 1
        ORDER BY frequency DESC
        LIMIT 10
      `);

      // Nếu không có từ khóa từ sách, trả về từ khóa mặc định
      if (keywords.length === 0) {
        return ['tiểu thuyết', 'khoa học', 'lịch sử', 'văn học', 'kinh tế', 'toán học', 'vật lý', 'hóa học', 'sinh học', 'địa lý'];
      }

      return keywords.map(item => item.keyword);
    } catch (error) {
      console.error('Error getting popular keywords:', error);
      // Trả về từ khóa mặc định nếu có lỗi
      return ['tiểu thuyết', 'khoa học', 'lịch sử', 'văn học', 'kinh tế', 'toán học', 'vật lý', 'hóa học', 'sinh học', 'địa lý'];
    }
  }

  // ==================== ADVANCED SEARCH ====================
  static async advancedSearch({
    query,
    category_id,
    author_id,
    publisher_id,
    min_price,
    max_price,
    min_rating,
    sort = 'created_at',
    order = 'DESC',
    page = 1,
    limit = 20
  }) {
    try {
      const offset = (page - 1) * limit;
      
      // Build WHERE conditions
      let whereConditions = [];
      let queryParams = [];

      if (query) {
        whereConditions.push(`(
          b.title LIKE ? OR 
          a.name LIKE ?
        )`);
        const searchTerm = `%${query}%`;
        queryParams.push(searchTerm, searchTerm);
      }

      if (category_id) {
        whereConditions.push('b.category_id = ?');
        queryParams.push(category_id);
      }

      if (author_id) {
        whereConditions.push('b.author_id = ?');
        queryParams.push(author_id);
      }

      if (publisher_id) {
        whereConditions.push('b.publisher_id = ?');
        queryParams.push(publisher_id);
      }

      if (min_price) {
        whereConditions.push('b.price >= ?');
        queryParams.push(min_price);
      }

      if (max_price) {
        whereConditions.push('b.price <= ?');
        queryParams.push(max_price);
      }

      if (min_rating) {
        whereConditions.push('COALESCE(avg_rating.rating, 0) >= ?');
        queryParams.push(min_rating);
      }

      const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

      // Count query
      const countQuery = `
        SELECT COUNT(*) as total
        FROM books b
        LEFT JOIN authors a ON b.author_id = a.author_id
        LEFT JOIN categories c ON b.category_id = c.category_id
        LEFT JOIN publishers p ON b.publisher_id = p.publisher_id
        LEFT JOIN (
          SELECT book_id, AVG(rating) as rating
          FROM reviews
          GROUP BY book_id
        ) avg_rating ON b.book_id = avg_rating.book_id
        ${whereClause}
      `;

      const [countResult] = await db.promise().query(countQuery, queryParams);
      const totalItems = countResult[0].total;
      const totalPages = Math.ceil(totalItems / limit);

      // Data query
      const dataQuery = `
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
          COALESCE(avg_rating.rating, 0) as rating,
          COALESCE(review_count.count, 0) as review_count
        FROM books b
        LEFT JOIN authors a ON b.author_id = a.author_id
        LEFT JOIN categories c ON b.category_id = c.category_id
        LEFT JOIN publishers p ON b.publisher_id = p.publisher_id
        LEFT JOIN (
          SELECT book_id, AVG(rating) as rating
          FROM reviews
          GROUP BY book_id
        ) avg_rating ON b.book_id = avg_rating.book_id
        LEFT JOIN (
          SELECT book_id, COUNT(*) as count
          FROM reviews
          GROUP BY book_id
        ) review_count ON b.book_id = review_count.book_id
        ${whereClause}
        ORDER BY b.${sort} ${order}
        LIMIT ? OFFSET ?
      `;

      const [books] = await db.promise().query(dataQuery, [...queryParams, limit, offset]);

      return {
        books,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems,
          itemsPerPage: limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      };
    } catch (error) {
      console.error('Error in advanced search:', error);
      throw error;
    }
  }
}

module.exports = Book;
