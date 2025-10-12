# Hướng dẫn Debug Chức năng Tìm kiếm

## Vấn đề hiện tại
Chức năng tìm kiếm sách trong admin không hoạt động.

## Các bước debug đã thực hiện

### ✅ Backend API hoạt động bình thường
- Test API search: `http://localhost:3306/api/books/search?q=test` ✅
- Test API books: `http://localhost:3306/api/books` ✅
- CORS đã được cấu hình đúng ✅

### ✅ Code đã được sửa
1. **useBookManagement.js**: Sửa lỗi gọi API searchBooks
2. **BookManagement.jsx**: Thêm debug logs chi tiết
3. **Backend**: API search hoạt động bình thường

## Cách debug tiếp theo

### 1. Kiểm tra Console Logs
Mở Developer Tools (F12) và kiểm tra Console tab khi thực hiện tìm kiếm:

```javascript
// Các logs sẽ hiển thị:
🔍 [BookManagement] Starting search with query: [từ khóa]
🔍 [BookManagement] Calling searchBooks with: [từ khóa]
📚 [BookAPI] Đang tìm kiếm sách với từ khóa: "[từ khóa]"
🌐 [BaseAPI] Đang gọi API: http://localhost:3306/api/books/search?q=[từ khóa]
✅ [BaseAPI] API call thành công
✅ [BookManagement] Search successful, found [số lượng] books
```

### 2. Kiểm tra Network Tab
Trong Developer Tools, chuyển sang Network tab và thực hiện tìm kiếm:
- Tìm request đến `/api/books/search`
- Kiểm tra Status Code (phải là 200)
- Kiểm tra Response data

### 3. Kiểm tra lỗi có thể xảy ra

#### Lỗi CORS:
```
Access to fetch at 'http://localhost:3306/api/books/search' from origin 'http://localhost:5173' has been blocked by CORS policy
```
**Giải pháp**: Backend đã cấu hình CORS đúng

#### Lỗi 404:
```
HTTP error! status: 404 - Not Found: Endpoint không tồn tại
```
**Giải pháp**: Kiểm tra backend có chạy không

#### Lỗi 500:
```
HTTP error! status: 500 - Server Error: Lỗi máy chủ
```
**Giải pháp**: Kiểm tra database connection

### 4. Test thủ công
Mở Console trong Developer Tools và chạy:

```javascript
// Test API trực tiếp
fetch('http://localhost:3306/api/books/search?q=test')
  .then(response => response.json())
  .then(data => console.log('Search result:', data))
  .catch(error => console.error('Error:', error));
```

### 5. Kiểm tra State
Trong Console, kiểm tra state của component:

```javascript
// Kiểm tra searchQuery
console.log('Search query:', document.querySelector('input[placeholder="Tìm kiếm sách..."]').value);

// Kiểm tra books state (nếu có React DevTools)
// Hoặc thêm console.log trong component
```

## Các nguyên nhân có thể

1. **Frontend không gọi API**: Kiểm tra event handler
2. **API call bị lỗi**: Kiểm tra Network tab
3. **State không cập nhật**: Kiểm tra React state
4. **Backend không chạy**: Kiểm tra terminal backend
5. **Database không có dữ liệu**: Kiểm tra database

## Cách khắc phục

### Nếu không thấy logs:
- Kiểm tra event handler có được gọi không
- Kiểm tra form submit có preventDefault không

### Nếu thấy lỗi API:
- Kiểm tra backend có chạy không
- Kiểm tra database connection
- Kiểm tra CORS configuration

### Nếu API thành công nhưng UI không cập nhật:
- Kiểm tra React state
- Kiểm tra component re-render
- Kiểm tra error handling

## Test Cases

### Test 1: Tìm kiếm với từ khóa có kết quả
- Nhập: "Python"
- Kỳ vọng: Hiển thị sách có tên chứa "Python"

### Test 2: Tìm kiếm với từ khóa không có kết quả
- Nhập: "xyz123"
- Kỳ vọng: Hiển thị "Không có dữ liệu sách"

### Test 3: Tìm kiếm với từ khóa rỗng
- Nhập: ""
- Kỳ vọng: Hiển thị tất cả sách

### Test 4: Xóa tìm kiếm
- Nhập từ khóa, sau đó nhấn nút X
- Kỳ vọng: Hiển thị tất cả sách

## Liên hệ hỗ trợ
Nếu vẫn không hoạt động, hãy cung cấp:
1. Console logs đầy đủ
2. Network requests
3. Error messages
4. Steps to reproduce
