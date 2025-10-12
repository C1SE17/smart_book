const db = require('../config/db');

class Category {
    static async getAll() { // Lấy tất cả danh mục
        const [rows] = await db.promise().query('SELECT * FROM categories ORDER BY category_id ASC');
        return rows;
    }

    static async search(query) { // Tìm kiếm danh mục
        if (!query || query.trim() === '') {
            return await this.getAll();
        }

        const [rows] = await db.promise().query(
            'SELECT * FROM categories WHERE name LIKE ? OR description LIKE ? ORDER BY category_id ASC',
            [`%${query}%`, `%${query}%`]
        );
        return rows;
    }

    static async getById(id) { // Lấy chi tiết danh mục
        const [rows] = await db.promise().query('SELECT * FROM categories WHERE category_id = ?', [id]);
        return rows[0];
    }

    static async create(categoryData) { // Tạo danh mục mới
        const { name, description, parent_category_id } = categoryData;

        // Tạo slug từ name
        const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Date.now();

        const [result] = await db.promise().query(
            'INSERT INTO categories (name, description, parent_category_id, slug) VALUES (?, ?, ?, ?)',
            [name, description, parent_category_id, slug]
        );
        return { id: result.insertId, category_id: result.insertId, ...categoryData, slug };
    }

    static async update(id, categoryData) { // Cập nhật danh mục
        const fields = [];
        const params = [];
        for (const [key, value] of Object.entries(categoryData)) {
            fields.push(`${key} = ?`);
            params.push(value);
        }
        params.push(id);

        const query = `UPDATE categories SET ${fields.join(', ')} WHERE category_id = ?`;
        await db.promise().query(query, params);
        return { id, ...categoryData };
    }

    static async delete(id) { // Xóa danh mục
        await db.promise().query('DELETE FROM categories WHERE category_id = ?', [id]);
        return { id };
    }
}

module.exports = Category;