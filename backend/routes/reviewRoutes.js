const express = require('express');
const router = express.Router();
const ReviewController = require('../controllers/ReviewController');
const { auth, adminOnly } = require('../middleware/auth');

// Lấy tất cả đánh giá (chỉ admin)
router.get('/all', auth, adminOnly, ReviewController.getAllReviews);

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

// Admin phản hồi bình luận
router.post('/:review_id/reply', auth, adminOnly, ReviewController.createReply);

// Admin sửa phản hồi
router.put('/reply/:reply_id', auth, adminOnly, ReviewController.updateReply);

// Admin xóa phản hồi
router.delete('/reply/:reply_id', auth, adminOnly, ReviewController.deleteReply);

// Số sao trung bình
router.get('/book/:book_id/average', ReviewController.getAverageRating);

module.exports = router;