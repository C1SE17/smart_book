const { ReviewModel, ReplyModel } = require('../models/ReviewModel');

// Controller quản lý đánh giá và phản hồi của người dùng
class ReviewController {
    // Thêm đánh giá (user chỉ được đánh giá 1 lần cho mỗi sách, trừ admin)
    static async createReview(req, res) {
        const user_id = req.user.userId;
        const { book_id, rating, review_text } = req.body;
        console.log('Tạo đánh giá - User ID:', user_id, 'Book ID:', book_id, 'Rating:', rating);
        
        if (!book_id || !rating) {
            console.log('Thiếu thông tin bắt buộc - book_id hoặc rating');
            return res.status(400).json({ error: 'Thiếu thông tin' });
        }
        
        try {
            if (req.user.role !== 'admin' && await ReviewModel.hasReviewed(user_id, book_id)) {
                console.log('User đã đánh giá sản phẩm này rồi');
                return res.status(400).json({ error: 'Bạn đã đánh giá sản phẩm này' });
            }
            
            const review_id = await ReviewModel.create(user_id, book_id, rating, review_text || '');
            console.log('Tạo đánh giá thành công - Review ID:', review_id);
            res.status(201).json({ message: 'Đã đánh giá', review_id });
        } catch (error) {
            console.error('Lỗi khi tạo đánh giá:', error);
            res.status(500).json({ error: 'Lỗi khi tạo đánh giá' });
        }
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
        console.log('Lấy danh sách đánh giá - Book ID:', book_id);
        try {
            const reviews = await ReviewModel.getByBook(book_id);
            console.log('Tìm thấy', reviews.length, 'đánh giá');
            
            for (const review of reviews) {
                review.replies = await ReplyModel.getByReview(review.review_id);
            }
            
            console.log('Trả về danh sách đánh giá kèm phản hồi');
            res.json(reviews);
        } catch (error) {
            console.error('Lỗi khi lấy đánh giá:', error);
            res.status(500).json({ error: 'Lỗi khi lấy đánh giá' });
        }
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

    // Lấy tất cả đánh giá (chỉ admin)
    static async getAllReviews(req, res) {
        console.log('Lấy tất cả đánh giá - Admin request');
        try {
            const reviews = await ReviewModel.getAllReviews();
            console.log('Tìm thấy', reviews.length, 'đánh giá tổng cộng');
            
            // Không load replies để tránh lỗi và tăng performance
            // for (const review of reviews) {
            //     review.replies = await ReplyModel.getByReview(review.review_id);
            // }

            console.log('Trả về tất cả đánh giá');
            res.json(reviews);
        } catch (error) {
            console.error('Lỗi khi lấy tất cả đánh giá:', error);
            res.status(500).json({ error: 'Lỗi khi lấy danh sách đánh giá' });
        }
    }

    // Số sao trung bình
    static async getAverageRating(req, res) {
        const book_id = req.params.book_id;
        console.log('Lấy đánh giá trung bình - Book ID:', book_id);
        try {
            const result = await ReviewModel.getAverageRating(book_id);
            console.log('Kết quả đánh giá trung bình:', result);
            
            const response = {
                book_id,
                average_rating: result.avg_rating ? Number(result.avg_rating).toFixed(2) : null,
                total_reviews: result.total_reviews
            };
            
            console.log('Trả về đánh giá trung bình:', response);
            res.json(response);
        } catch (error) {
            console.error('Lỗi khi lấy đánh giá trung bình:', error);
            res.status(500).json({ error: 'Lỗi khi lấy đánh giá trung bình' });
        }
    }
}

module.exports = ReviewController;