const db = require('../config/db');

class Publisher {
    static async getAll() { // Lấy tất cả nhà xuất bản
        const [rows] = await db.promise().query('SELECT * FROM publishers');
        return rows;
    }

    static async getById(id) { // Lấy chi tiết nhà xuất bản
        const [rows] = await db.promise().query('SELECT * FROM publishers WHERE publisher_id = ?', [id]);
        return rows[0];
    }

    static async create(publisherData) { // Tạo nhà xuất bản mới
        const { name, address, contact_email, slug } = publisherData;
        const [result] = await db.promise().query(
            'INSERT INTO publishers (name, address, contact_email, slug) VALUES (?, ?, ?, ?)',
            [name, address, contact_email, slug]
        );
        return { id: result.insertId, ...publisherData };
    }

    static async update(id, publisherData) { // Cập nhật nhà xuất bản
        const fields = [];
        const params = [];
        for (const [key, value] of Object.entries(publisherData)) {
            fields.push(`${key} = ?`);
            params.push(value);
        }
        params.push(id);

        const query = `UPDATE publishers SET ${fields.join(', ')} WHERE publisher_id = ?`;
        await db.promise().query(query, params);
        return { id, ...publisherData };
    }

    static async delete(id) { // Xóa nhà xuất bản
        await db.promise().query('DELETE FROM publishers WHERE publisher_id = ?', [id]);
        return { id };
    }
}

module.exports = Publisher;