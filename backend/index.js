// Nhập thư viện
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const bookRoutes = require('./routes/bookRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const publisherRoutes = require('./routes/publisherRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const warehouseRoutes = require('./routes/warehouseRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const searchRoutes = require('./routes/searchRoutes');
const authorRoutes = require('./routes/authorRoutes');
 const trackingRoutes = require('./routes/trackingRoutes');
 const recommendationRoutes = require('./routes/recommendationRoutes');
 const connectDB = require('./config/mongodb');

// Tải biến môi trường
dotenv.config();
console.log('🔧 [Server] Đã tải biến môi trường');

// Khởi tạo ứng dụng Express
const app = express(); // Đảm bảo app được khai báo trước khi sử dụng
const port = process.env.PORT || 3306;
console.log('🚀 [Server] Khởi tạo Express app');
console.log('📡 [Server] Port:', port);


// Cấu hình CORS
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
console.log('🌐 [Server] Đã cấu hình CORS');
console.log('🌐 [Server] CORS origins:', ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174']);

// Phân tích JSON từ body
app.use(express.json());
console.log('📝 [Server] Đã cấu hình JSON parser');

// Middleware kiểm tra header
app.use((req, res, next) => {
    console.log(`📨 [Request] ${req.method} ${req.path}`);
    console.log('📋 [Request] Origin:', req.headers.origin);
    console.log('📋 [Request] User-Agent:', req.headers['user-agent']);
    // Tạm thời comment middleware kiểm tra Content-Type
    if (req.method === 'POST' && req.headers['content-type'] && !req.headers['content-type'].includes('application/json')) {
        console.log('❌ [Request] Invalid Content-Type');
        return res.status(400).json({ error: 'Yêu cầu phải có Content-Type: application/json' });
    }
    console.log('📦 [Request] Body:', req.body);
    next();
});

// Tuyến gốc
app.get('/', (req, res) => {
    res.send('Xin chào đén với smart book!');
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Backend is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// Gắn tuyến API
console.log('🔗 [Server] Đang gắn routes...');
app.use('/api/users', userRoutes);
console.log('✅ [Server] Users routes loaded');
app.use('/api/books', bookRoutes);
console.log('✅ [Server] Books routes loaded');
app.use('/api/categories', categoryRoutes);
console.log('✅ [Server] Categories routes loaded');
app.use('/api/publishers', publisherRoutes);
console.log('✅ [Server] Publishers routes loaded');
app.use('/api/cart', cartRoutes);
console.log('✅ [Server] Cart routes loaded');
app.use('/api/order', orderRoutes);
console.log('✅ [Server] Order routes loaded');
app.use('/api/warehouse', warehouseRoutes);
console.log('✅ [Server] Warehouse routes loaded');
app.use('/api/reviews', reviewRoutes);
console.log('✅ [Server] Reviews routes loaded');
app.use('/api/search', searchRoutes);
console.log('✅ [Server] Search routes loaded');
app.use('/api/authors', authorRoutes);
console.log('✅ [Server] Authors routes loaded');
console.log('📋 [Server] Author endpoints available:');
console.log('   - GET /api/authors - Lấy danh sách tất cả tác giả');
console.log('   - GET /api/authors/:id - Lấy thông tin chi tiết tác giả');
app.use('/api/tracking', trackingRoutes);
console.log('✅ [Server] Tracking routes loaded');
app.use('/api/recommendations', recommendationRoutes);
console.log('✅ [Server] Recommendations routes loaded');

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('💥 [Error] Unhandled error:', {
        message: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
        body: req.body
    });
    res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: err.message
    });
});

// 404 handler - phải đặt cuối cùng
app.use((req, res) => {
    console.log('❌ [404] Route not found:', req.method, req.originalUrl);
    res.status(404).json({
        success: false,
        error: 'Route not found',
        message: `Cannot ${req.method} ${req.originalUrl}`
    });
});

// Chạy máy chủ
app.listen(port, () => {
    console.log('🎉 [Server] ===========================================');
    console.log(`🚀 [Server] Máy chủ chạy tại cổng: ${port}`);
    console.log(`📡 [Server] API Base URL: http://localhost:${port}/api`);
    console.log(`🔍 [Server] Health check: http://localhost:${port}/api/health`);
    console.log('🎉 [Server] ===========================================');
});