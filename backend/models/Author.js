const db = require("../config/db");

class Author {
  static async getAll() {
    // Lấy tất cả tác giả
    try {
      console.log("📊 [Author Model] Bắt đầu query lấy tất cả tác giả...");
      const [rows] = await db
        .promise()
        .query("SELECT * FROM authors ORDER BY author_id ASC");
      console.log(
        "✅ [Author Model] Query thành công, lấy được",
        rows.length,
        "tác giả"
      );
      return rows;
    } catch (error) {
      console.error("💥 [Author Model] Lỗi khi lấy tất cả tác giả:", error);
      throw error;
    }
  }

  static async getById(id) {
    // Lấy chi tiết tác giả
    try {
      console.log("📊 [Author Model] Bắt đầu query lấy tác giả ID:", id);
      const [rows] = await db
        .promise()
        .query("SELECT * FROM authors WHERE author_id = ?", [id]);
      console.log(
        "✅ [Author Model] Query thành công, tìm thấy:",
        rows.length > 0 ? rows[0].name : "Không có"
      );
      return rows[0];
    } catch (error) {
      console.error("💥 [Author Model] Lỗi khi lấy tác giả theo ID:", error);
      throw error;
    }
  }

  static async getBooksByAuthorId(authorId) {
    // Lấy danh sách sách của tác giả
    try {
      console.log(
        "📚 [Author Model] Bắt đầu query lấy sách của tác giả ID:",
        authorId
      );
      const [rows] = await db.promise().query(
        `
            SELECT 
                b.book_id,
                b.title,
                b.price,
                b.cover_image,
                b.description,
                b.published_date,
                c.name AS category_name,
                p.name AS publisher_name,
                CAST(COALESCE(AVG(r.rating), 0) AS DECIMAL(3,1)) AS average_rating,
                COUNT(r.review_id) AS review_count
            FROM books b
            LEFT JOIN categories c ON b.category_id = c.category_id
            LEFT JOIN publishers p ON b.publisher_id = p.publisher_id
            LEFT JOIN reviews r ON b.book_id = r.book_id
            WHERE b.author_id = ?
            GROUP BY 
                b.book_id, b.title, b.price, b.cover_image, b.description, b.published_date,
                c.name, p.name
            ORDER BY b.published_date DESC;
            `,
        [authorId]
      );

      console.log(
        "✅ [Author Model] Query sách thành công, lấy được",
        rows.length,
        "cuốn sách"
      );
      if (rows.length > 0) {
        console.log("📖 [Author Model] Danh sách sách:");
        rows.forEach((book, index) => {
          console.log(
            `   ${index + 1}. ${book.title} - ${book.price}đ - Rating: ${
              book.average_rating
            } - Cover: ${book.cover_image || 'NULL'}`
          );
        });
      }

      return rows;
    } catch (error) {
      console.error("💥 [Author Model] Lỗi khi lấy sách của tác giả:", error);
      throw error;
    }
  }

  static async create(authorData) {
    // Tạo tác giả mới
    const { name, bio, slug } = authorData;
    const [result] = await db
      .promise()
      .query("INSERT INTO authors (name, bio, slug) VALUES (?, ?, ?)", [
        name,
        bio,
        slug,
      ]);
    return { id: result.insertId, ...authorData };
  }

  static async update(id, authorData) {
    // Cập nhật tác giả
    const fields = [];
    const params = [];
    for (const [key, value] of Object.entries(authorData)) {
      fields.push(`${key} = ?`);
      params.push(value);
    }
    params.push(id);

    const query = `UPDATE authors SET ${fields.join(", ")} WHERE author_id = ?`;
    await db.promise().query(query, params);
    return { id, ...authorData };
  }

  static async delete(id) {
    // Xóa tác giả
    await db.promise().query("DELETE FROM authors WHERE author_id = ?", [id]);
    return { id };
  }
}

module.exports = Author;
