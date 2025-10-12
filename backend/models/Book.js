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
    let query = `
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
      // Tìm kiếm theo tên sản phẩm
      conditions.push("b.title LIKE ?");
      params.push(`%${search}%`);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += " ORDER BY b.book_id ASC LIMIT ? OFFSET ?"; // Thêm phân trang và sắp xếp
    params.push(limit, offset);

    const [rows] = await db.promise().query(query, params);
    return rows;
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
}

module.exports = Book;
