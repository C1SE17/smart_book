const db = require('../config/db');

class Author {
    static async getAll() { // Lấy tất cả tác giả
        const [rows] = await db.promise().query('SELECT * FROM authors');
        return rows;
    }

    static async getById(id) { // Lấy chi tiết tác giả
        const [rows] = await db.promise().query('SELECT * FROM authors WHERE author_id = ?', [id]);
        return rows[0];
    }

    static async create(authorData) { // Tạo tác giả mới
        const { name, bio, slug } = authorData;
        const [result] = await db.promise().query(
            'INSERT INTO authors (name, bio, slug) VALUES (?, ?, ?)',
            [name, bio, slug]
        );
        return { id: result.insertId, ...authorData };
    }

    static async update(id, authorData) { // Cập nhật tác giả
        const fields = [];
        const params = [];
        for (const [key, value] of Object.entries(authorData)) {
            fields.push(`${key} = ?`);
            params.push(value);
        }
        params.push(id);

        const query = `UPDATE authors SET ${fields.join(', ')} WHERE author_id = ?`;
        await db.promise().query(query, params);
        return { id, ...authorData };
    }

    static async delete(id) { // Xóa tác giả
        await db.promise().query('DELETE FROM authors WHERE author_id = ?', [id]);
        return { id };
    }
}

module.exports = Author;