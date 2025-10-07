// Nhập thư viện
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const bookRoutes = require('./routes/bookRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const authorRoutes = require('./routes/authorRoutes');
const publisherRoutes = require('./routes/publisherRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const warehouseRoutes = require('./routes/warehouseRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

// Tải biến môi trường
dotenv.config();

// Khởi tạo ứng dụng Express
const app = express(); // Đảm bảo app được khai báo trước khi sử dụng
const port = process.env.PORT || 3306;

// Cấu hình CORS
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Phân tích JSON từ body
app.use(express.json());

// Middleware kiểm tra header
app.use((req, res, next) => {
    console.log('Headers:', req.headers); // In header
    if (req.method === 'POST' && req.headers['content-type'] !== 'application/json') {
        return res.status(400).json({ error: 'Yêu cầu phải có Content-Type: application/json' });
    }
    console.log('Parsed body:', req.body); // In body sau khi phân tích
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
app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/authors', authorRoutes);
app.use('/api/publishers', publisherRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/warehouse', warehouseRoutes);
app.use('/api/reviews', reviewRoutes);

// Chạy máy chủ
app.listen(port, () => {
    console.log(`Máy chủ chạy tại cổng: ${port}`);
});