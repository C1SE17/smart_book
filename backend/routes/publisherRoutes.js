const express = require('express');
const router = express.Router();
const PublisherController = require('../controllers/PublisherController');
const { auth, adminOnly } = require('../middleware/auth');

// Lấy danh sách nhà xuất bản (công khai cho frontend)
router.get('/', PublisherController.getAllPublishers);

// Lấy chi tiết nhà xuất bản (chỉ admin)
router.get('/:id', auth, adminOnly, PublisherController.getPublisher);

// Tạo nhà xuất bản mới (chỉ admin)
router.post('/', auth, adminOnly, PublisherController.createPublisher);

// Cập nhật nhà xuất bản (chỉ admin)
router.put('/:id', auth, adminOnly, PublisherController.updatePublisher);

// Xóa nhà xuất bản (chỉ admin)
router.delete('/:id', auth, adminOnly, PublisherController.deletePublisher);

module.exports = router;