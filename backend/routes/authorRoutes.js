/**
 * Author Routes - Định tuyến cho các API liên quan đến tác giả
 */

const express = require('express');
const router = express.Router();
const { getAllAuthors, getAuthorById } = require('../controllers/AuthorController');

// Middleware để log tất cả request đến author routes
router.use((req, res, next) => {
    console.log('🛣️ [Author Routes] ===========================================');
    console.log('📡 [Author Routes] Method:', req.method);
    console.log('🌐 [Author Routes] URL:', req.originalUrl);
    console.log('⏰ [Author Routes] Thời gian:', new Date().toISOString());
    console.log('🔍 [Author Routes] Params:', req.params);
    console.log('📋 [Author Routes] Query:', req.query);
    console.log('🛣️ [Author Routes] ===========================================');
    next();
});

// GET /api/authors - Lấy danh sách tất cả tác giả
router.get('/', (req, res, next) => {
    console.log('📋 [Author Routes] Route: GET /api/authors - Lấy danh sách tác giả');
    next();
}, getAllAuthors);

// GET /api/authors/:id - Lấy thông tin chi tiết tác giả
router.get('/:id', (req, res, next) => {
    console.log('📋 [Author Routes] Route: GET /api/authors/:id - Lấy chi tiết tác giả ID:', req.params.id);
    next();
}, getAuthorById);

module.exports = router;
