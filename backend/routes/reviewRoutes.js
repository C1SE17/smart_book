const express = require('express');
const router = express.Router();
const ReviewController = require('../controllers/ReviewController');
const { auth, adminOnly } = require('../middleware/auth');

// Lấy tất cả đánh giá của sách
router.get('/book/:book_id', ReviewController.getReviews);

// Thêm đánh giá (user, chỉ 1 lần)
router.post('/', auth, ReviewController.createReview);

// Sửa đánh giá (user)
router.put('/:review_id', auth, ReviewController.updateReview);

// Xóa đánh giá (user)
router.delete('/:review_id', auth, ReviewController.deleteReview);

// Admin xóa đánh giá
router.delete('/admin/:review_id', auth, adminOnly, ReviewController.adminDeleteReview);

// Thêm phản hồi cho bình luận
router.post('/:review_id/reply', auth, ReviewController.createReply);

// Xóa phản hồi (user hoặc admin)
router.delete('/reply/:reply_id', auth, ReviewController.deleteReply);

//số sao trung bình
router.get('/book/:book_id/average', ReviewController.getAverageRating);

// // Admin lấy tất cả đánh giá
// router.get('/admin/all', auth, adminOnly, ReviewController.getAllReviews);

module.exports = router;