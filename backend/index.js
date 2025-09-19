// Nhập thư viện
   const express = require('express');
   const dotenv = require('dotenv');
   const bookRoutes = require('./routes/bookRoutes');
   const userRoutes = require('./routes/userRoutes');

   // Tải biến môi trường
   dotenv.config();

   // Khởi tạo ứng dụng Express
   const app = express();
   const port = process.env.PORT || 3306;

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
       res.send('Xin chào Thế giới với MySQL và MVC!');
   });

   // Gắn tuyến API
   app.use('/api', bookRoutes);
   app.use('/api', userRoutes);

   // Chạy máy chủ
   app.listen(port, () => {
       console.log(`Máy chủ chạy tại cổng: ${port}`);
   });