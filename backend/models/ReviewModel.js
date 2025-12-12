const db = require('../config/db');

const ReviewModel = {
    // Kiểm tra user đã đánh giá chưa
    hasReviewed: async (user_id, book_id) => {
        const [rows] = await db.promise().query(
            'SELECT review_id FROM reviews WHERE user_id = ? AND book_id = ?', [user_id, book_id]
        );
        return rows.length > 0;
    },
    // Thêm đánh giá
    create: async (user_id, book_id, rating, review_text) => {
        console.log('Tạo đánh giá mới - User ID:', user_id, 'Book ID:', book_id, 'Rating:', rating);
        try {
            const [result] = await db.promise().query(
                'INSERT INTO reviews (user_id, book_id, rating, review_text) VALUES (?, ?, ?, ?)',
                [user_id, book_id, rating, review_text]
            );
            console.log('Tạo đánh giá thành công - Review ID:', result.insertId);
            return result.insertId;
        } catch (error) {
            console.error('Lỗi khi tạo đánh giá:', error);
            throw error;
        }
    },
    // Sửa đánh giá
    update: async (review_id, user_id, rating, review_text) => {
        const [result] = await db.promise().query(
            'UPDATE reviews SET rating = ?, review_text = ? WHERE review_id = ? AND user_id = ?',
            [rating, review_text, review_id, user_id]
        );
        return result.affectedRows;
    },
    // Xóa đánh giá
    delete: async (review_id, user_id) => {
        const [result] = await db.promise().query(
            'DELETE FROM reviews WHERE review_id = ? AND user_id = ?', [review_id, user_id]
        );
        return result.affectedRows;
    },
    // Admin xóa đánh giá
    adminDelete: async (review_id) => {
        const [result] = await db.promise().query(
            'DELETE FROM reviews WHERE review_id = ?', [review_id]
        );
        return result.affectedRows;
    },
    // Lấy tất cả đánh giá của sách
    getByBook: async (book_id) => {
        console.log('Lấy đánh giá theo sách - Book ID:', book_id);
        try {
            const [rows] = await db.promise().query(
                `SELECT r.*, u.name AS username, u.email AS user_email
                 FROM reviews r
                 JOIN users u ON r.user_id = u.user_id
                 WHERE r.book_id = ?
                 ORDER BY r.created_at DESC`, [book_id]
            );
            console.log('Tìm thấy', rows.length, 'đánh giá cho sách');
            return rows;
        } catch (error) {
            console.error(' Lỗi khi lấy đánh giá theo sách:', error);
            throw error;
        }
    },
    // Lấy đánh giá theo id
    getById: async (review_id) => {
        const [rows] = await db.promise().query(
            'SELECT * FROM reviews WHERE review_id = ?', [review_id]
        );
        return rows[0];
    },
    // Lấy tất cả đánh giá (chỉ admin)
    getAllReviews: async () => {
        console.log('Lấy tất cả đánh giá - Admin request');
        try {
            const [rows] = await db.promise().query(
                `SELECT r.*, u.name AS username, u.email AS user_email, b.title AS book_title, a.name AS book_author
                 FROM reviews r
                 JOIN users u ON r.user_id = u.user_id
                 JOIN books b ON r.book_id = b.book_id
                 LEFT JOIN authors a ON b.author_id = a.author_id
                 ORDER BY r.created_at DESC`
            );
            console.log('Tìm thấy', rows.length, 'đánh giá tổng cộng');
            return rows;
        } catch (error) {
            console.error(' Lỗi khi lấy tất cả đánh giá:', error);
            throw error;
        }
    },

    // số sao trung bình vào Model
    getAverageRating: async (book_id) => {
        console.log('Tính đánh giá trung bình - Book ID:', book_id);
        try {
            const [rows] = await db.promise().query(
                'SELECT AVG(rating) AS avg_rating, COUNT(*) AS total_reviews FROM reviews WHERE book_id = ?', [book_id]
            );
            console.log('Kết quả đánh giá trung bình:', rows[0]);
            return rows[0];
        } catch (error) {
            console.error(' Lỗi khi tính đánh giá trung bình:', error);
            throw error;
        }
    }
};

const ReplyModel = {
    // Thêm phản hồi
    create: async (review_id, user_id, reply_text) => {
        const [result] = await db.promise().query(
            'INSERT INTO review_replies (review_id, user_id, reply_text) VALUES (?, ?, ?)',
            [review_id, user_id, reply_text]
        );
        return result.insertId;
    },
    // Lấy phản hồi của bình luận
    getByReview: async (review_id) => {
    const [rows] = await db.promise().query(
        `SELECT rr.*, u.name AS username, u.email AS user_email
         FROM review_replies rr
         JOIN users u ON rr.user_id = u.user_id
         WHERE rr.review_id = ?
         ORDER BY rr.created_at ASC`, [review_id]
        );
    return rows;
    },
    // Xóa phản hồi (user hoặc admin)
    delete: async (reply_id, user_id, isAdmin = false) => {
        let query = 'DELETE FROM review_replies WHERE reply_id = ?';
        let params = [reply_id];
        if (!isAdmin) {
            query += ' AND user_id = ?';
            params.push(user_id);
        }
        const [result] = await db.promise().query(query, params);
        return result.affectedRows;
    },
    // Sửa phản hồi (chỉ admin)
    update: async (reply_id, reply_text) => {
    const [result] = await db.promise().query(
        'UPDATE review_replies SET reply_text = ? WHERE reply_id = ?',
        [reply_text, reply_id]
        );
    return result.affectedRows;
    }
};

module.exports = { ReviewModel, ReplyModel };