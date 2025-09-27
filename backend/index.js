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

// Tải biến môi trường
dotenv.config();

// Khởi tạo ứng dụng Express
const app = express(); // Đảm bảo app được khai báo trước khi sử dụng
const port = process.env.PORT || 3001;

// CORS middleware
app.use(cors({
  origin: 'http://localhost:5173', // Frontend URL
  credentials: true
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

// Gắn tuyến API
app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);

app.use('/books', bookRoutes); // P
// ublic books route for frontend
app.use('/api/categories', categoryRoutes);
app.use('/categories', categoryRoutes); // Public categories route for frontend
app.use('/api/authors', authorRoutes);
app.use('/api/publishers', publisherRoutes);
app.use('/api/cart', cartRoutes); 
app.use('/api/order', orderRoutes);

// Chạy máy chủ
app.listen(port, () => {
    console.log(`Máy chủ chạy tại cổng: ${port}`);
});