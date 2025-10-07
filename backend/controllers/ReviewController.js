const { ReviewModel, ReplyModel } = require('../models/ReviewModel');

class ReviewController {
    // Thêm đánh giá (user chỉ 1 lần)
    static async createReview(req, res) {
        const user_id = req.user.userId;
        const { book_id, rating, review_text } = req.body;
        if (!book_id || !rating) return res.status(400).json({ error: 'Thiếu thông tin' });
        if (req.user.role !== 'admin' && await ReviewModel.hasReviewed(user_id, book_id))
            return res.status(400).json({ error: 'Bạn đã đánh giá sản phẩm này' });
        const review_id = await ReviewModel.create(user_id, book_id, rating, review_text || '');
        res.status(201).json({ message: 'Đã đánh giá', review_id });
    }

    // Sửa đánh giá (chỉ user chủ sở hữu)
    static async updateReview(req, res) {
        const user_id = req.user.userId;
        const review_id = req.params.review_id;
        const { rating, review_text } = req.body;
        const review = await ReviewModel.getById(review_id);
        if (!review) return res.status(404).json({ error: 'Đánh giá không tồn tại' });
        if (review.user_id !== user_id) return res.status(403).json({ error: 'Không có quyền sửa' });
        const affected = await ReviewModel.update(review_id, user_id, rating, review_text || '');
        res.json({ message: 'Đã sửa đánh giá' });
    }

    // Xóa đánh giá (chỉ user chủ sở hữu)
    static async deleteReview(req, res) {
        const user_id = req.user.userId;
        const review_id = req.params.review_id;
        const review = await ReviewModel.getById(review_id);
        if (!review) return res.status(404).json({ error: 'Đánh giá không tồn tại' });
        if (review.user_id !== user_id) return res.status(403).json({ error: 'Không có quyền xóa' });
        await ReviewModel.delete(review_id, user_id);
        res.json({ message: 'Đã xóa đánh giá' });
    }

    // Admin xóa đánh giá
    static async adminDeleteReview(req, res) {
        if (req.user.role !== 'admin') return res.status(403).json({ error: 'Chỉ admin được xóa' });
        const review_id = req.params.review_id;
        await ReviewModel.adminDelete(review_id);
        res.json({ message: 'Admin đã xóa đánh giá' });
    }

    // Lấy tất cả đánh giá của sách (ai cũng xem được)
    static async getReviews(req, res) {
        const book_id = req.params.book_id;
        const reviews = await ReviewModel.getByBook(book_id);
        for (const review of reviews) {
            review.replies = await ReplyModel.getByReview(review.review_id);
        }
        res.json(reviews);
    }

    // Thêm phản hồi cho bình luận (chỉ admin)
    static async createReply(req, res) {
        if (req.user.role !== 'admin') return res.status(403).json({ error: 'Chỉ admin được phản hồi' });
        const user_id = req.user.userId;
        const { reply_text } = req.body;
        const review_id = req.params.review_id;
        if (!reply_text) return res.status(400).json({ error: 'Thiếu nội dung phản hồi' });
        const reply_id = await ReplyModel.create(review_id, user_id, reply_text);
        res.status(201).json({ message: 'Admin đã phản hồi', reply_id });
    }

    // Sửa phản hồi (chỉ admin)
    static async updateReply(req, res) {
        if (req.user.role !== 'admin') return res.status(403).json({ error: 'Chỉ admin được sửa phản hồi' });
        const reply_id = req.params.reply_id;
        const { reply_text } = req.body;
        const affected = await ReplyModel.update(reply_id, reply_text);
        if (!affected) return res.status(404).json({ error: 'Phản hồi không tồn tại' });
        res.json({ message: 'Admin đã sửa phản hồi' });
    }

    // Xóa phản hồi (chỉ admin)
    static async deleteReply(req, res) {
        if (req.user.role !== 'admin') return res.status(403).json({ error: 'Chỉ admin được xóa phản hồi' });
        const reply_id = req.params.reply_id;
        const affected = await ReplyModel.delete(reply_id, null, true);
        if (!affected) return res.status(404).json({ error: 'Phản hồi không tồn tại' });
        res.json({ message: 'Admin đã xóa phản hồi' });
    }

    // Số sao trung bình
    static async getAverageRating(req, res) {
        const book_id = req.params.book_id;
        const result = await ReviewModel.getAverageRating(book_id);
        res.json({
            book_id,
            average_rating: result.avg_rating ? Number(result.avg_rating).toFixed(2) : null,
            total_reviews: result.total_reviews
        });
    }
}

module.exports = ReviewController;