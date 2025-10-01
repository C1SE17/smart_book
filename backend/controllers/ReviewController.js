const { ReviewModel, ReplyModel } = require('../models/ReviewModel');

class ReviewController {
    // Thêm đánh giá (user chỉ 1 lần)
    static async createReview(req, res) {
        const user_id = req.user.userId;
        const { book_id, rating, review_text } = req.body;
        if (!book_id || !rating) return res.status(400).json({ error: 'Thiếu thông tin' });
        if (await ReviewModel.hasReviewed(user_id, book_id))
            return res.status(400).json({ error: 'Bạn đã đánh giá sản phẩm này' });
        const review_id = await ReviewModel.create(user_id, book_id, rating, review_text || '');
        res.status(201).json({ message: 'Đã đánh giá', review_id });
    }

    // Sửa đánh giá (chỉ user chủ sở hữu)
    static async updateReview(req, res) {
        const user_id = req.user.userId;
        const { rating, review_text } = req.body;
        const review_id = req.params.review_id;
        const affected = await ReviewModel.update(review_id, user_id, rating, review_text || '');
        if (!affected) return res.status(403).json({ error: 'Không có quyền sửa hoặc đánh giá không tồn tại' });
        res.json({ message: 'Đã sửa đánh giá' });
    }

    // Xóa đánh giá (chỉ user chủ sở hữu)
    static async deleteReview(req, res) {
        const user_id = req.user.userId;
        const review_id = req.params.review_id;
        const affected = await ReviewModel.delete(review_id, user_id);
        if (!affected) return res.status(403).json({ error: 'Không có quyền xóa hoặc đánh giá không tồn tại' });
        res.json({ message: 'Đã xóa đánh giá' });
    }

    // Admin xóa đánh giá
    static async adminDeleteReview(req, res) {
        const review_id = req.params.review_id;
        await ReviewModel.adminDelete(review_id);
        res.json({ message: 'Admin đã xóa đánh giá' });
    }

    // Lấy tất cả đánh giá của sách
    static async getReviews(req, res) {
        const book_id = req.params.book_id;
        const reviews = await ReviewModel.getByBook(book_id);
        // Lấy reply cho từng review
        for (const review of reviews) {
            review.replies = await ReplyModel.getByReview(review.review_id);
        }
        res.json(reviews);
    }

    // Thêm phản hồi cho bình luận
    static async createReply(req, res) {
        const user_id = req.user.userId;
        const { reply_text } = req.body;
        const review_id = req.params.review_id;
        if (!reply_text) return res.status(400).json({ error: 'Thiếu nội dung phản hồi' });
        const reply_id = await ReplyModel.create(review_id, user_id, reply_text);
        res.status(201).json({ message: 'Đã phản hồi', reply_id });
    }

    // Xóa phản hồi (user hoặc admin)
    static async deleteReply(req, res) {
        const user_id = req.user.userId;
        const reply_id = req.params.reply_id;
        const isAdmin = req.user.role === 'admin';
        const affected = await ReplyModel.delete(reply_id, user_id, isAdmin);
        if (!affected) return res.status(403).json({ error: 'Không có quyền xóa hoặc phản hồi không tồn tại' });
        res.json({ message: 'Đã xóa phản hồi' });
    }

    //  số sao trung bình 
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