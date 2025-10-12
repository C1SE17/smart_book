# Sửa lỗi HTTP 500 khi tạo danh mục mới

## Vấn đề hiện tại
Khi thêm danh mục mới trong admin, gặp lỗi:
```
HTTP error! status: 500 - Server Error: Lỗi máy chủ
```

## Nguyên nhân đã xác định
1. **Database connection**: ✅ Hoạt động bình thường
2. **Database schema**: ✅ Có đúng cấu trúc bảng `categories`
3. **JSON parsing**: ❌ Có vấn đề với middleware

## Các bước đã thực hiện

### ✅ Đã sửa:
1. **Category Model**: Thêm tự động tạo `slug` từ `name`
2. **Category Controller**: Cập nhật response format
3. **Database Schema**: Xác nhận có field `slug` NOT NULL UNIQUE

### ❌ Vấn đề còn lại:
- JSON parsing middleware có thể gây lỗi
- Cần kiểm tra backend logs để xác định nguyên nhân chính xác

## Cách debug tiếp theo

### 1. Kiểm tra backend logs
Mở terminal backend và xem logs khi thực hiện tạo danh mục:
```bash
cd backend
npm start
```

### 2. Kiểm tra database connection
Database đã hoạt động bình thường:
- Host: localhost:3300
- Database: smart_book
- Table: categories (có đúng cấu trúc)

### 3. Test API trực tiếp
Sử dụng Postman hoặc curl để test API:
```bash
curl -X POST http://localhost:3306/api/categories \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Category","description":"Test Description","parent_category_id":null}'
```

### 4. Kiểm tra middleware
Middleware JSON parsing có thể gây lỗi. Đã tạm thời comment middleware kiểm tra Content-Type.

## Giải pháp tạm thời

### Sử dụng frontend để test:
1. Mở admin panel
2. Thử tạo danh mục mới
3. Kiểm tra console logs trong Developer Tools
4. Kiểm tra Network tab để xem request/response

### Nếu vẫn lỗi:
1. Kiểm tra backend logs
2. Kiểm tra database connection
3. Kiểm tra middleware JSON parsing

## Cấu trúc database đã xác nhận
```sql
CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    parent_category_id INT NULL,
    slug VARCHAR(150) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Các file đã sửa
1. `backend/models/Category.js` - Thêm tự động tạo slug
2. `backend/controllers/CategoryController.js` - Cập nhật response format
3. `backend/index.js` - Tạm thời comment middleware kiểm tra Content-Type

## Liên hệ hỗ trợ
Nếu vẫn không hoạt động, hãy cung cấp:
1. Backend logs đầy đủ
2. Network requests từ Developer Tools
3. Error messages chi tiết
4. Steps to reproduce
