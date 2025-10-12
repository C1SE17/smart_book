# Hướng dẫn sử dụng Admin Quản lý Sách

## Tổng quan
Hệ thống admin quản lý sách đã được cập nhật với đầy đủ chức năng CRUD (Create, Read, Update, Delete) và tìm kiếm, kết nối trực tiếp với database MySQL.

## Các chức năng đã được triển khai

### 1. Thêm sách mới
- **Cách sử dụng**: Nhấn nút "Thêm sách mới" (màu xanh) ở góc trên bên phải
- **Thông tin bắt buộc**:
  - Tên sách (ít nhất 2 ký tự)
  - Giá (phải lớn hơn 0)
  - Số lượng tồn kho (không được âm)
  - Danh mục
  - Tác giả
  - Nhà xuất bản
- **Thông tin tùy chọn**:
  - Mô tả
  - Ngày xuất bản
  - Hình ảnh bìa (URL)
- **Validation**: Hệ thống sẽ kiểm tra và hiển thị lỗi nếu thông tin không hợp lệ

### 2. Sửa thông tin sách
- **Cách sử dụng**: Nhấn nút "Sửa" (biểu tượng bút chì màu xanh) trong cột "Thao tác"
- **Chức năng**: Mở modal với thông tin sách hiện tại đã được điền sẵn
- **Lưu thay đổi**: Nhấn "Cập nhật" để lưu các thay đổi

### 3. Xóa sách
- **Cách sử dụng**: Nhấn nút "Xóa" (biểu tượng thùng rác màu đỏ) trong cột "Thao tác"
- **Xác nhận**: Hệ thống sẽ hiển thị hộp thoại xác nhận trước khi xóa
- **Lưu ý**: Hành động này không thể hoàn tác

### 4. Tìm kiếm sách
- **Cách sử dụng**: Nhập từ khóa vào ô "Tìm kiếm sách..." và nhấn nút tìm kiếm
- **Chức năng**: Tìm kiếm theo tên sách (không phân biệt hoa thường)
- **Xóa tìm kiếm**: Nhấn nút "X" để xóa tìm kiếm và hiển thị lại tất cả sách

## Cấu trúc dữ liệu

### Bảng sách hiển thị:
- **ID**: Mã định danh sách
- **Tên sách**: Tên đầy đủ của sách
- **Giá**: Giá bán (định dạng VND)
- **Tồn kho**: Số lượng sách còn lại
- **Danh mục**: Tên danh mục (thay vì ID)
- **Tác giả**: Tên tác giả (thay vì ID)
- **NXB**: Tên nhà xuất bản (thay vì ID)
- **Thao tác**: Các nút sửa và xóa

## API Endpoints

### Backend APIs:
- `GET /api/books` - Lấy danh sách sách
- `GET /api/books/search?q={query}` - Tìm kiếm sách
- `GET /api/books/:id` - Lấy chi tiết sách
- `POST /api/books` - Tạo sách mới (chỉ admin)
- `PUT /api/books/:id` - Cập nhật sách (chỉ admin)
- `DELETE /api/books/:id` - Xóa sách (chỉ admin)

### Supporting APIs:
- `GET /api/categories` - Lấy danh sách danh mục
- `GET /api/authors` - Lấy danh sách tác giả
- `GET /api/publishers` - Lấy danh sách nhà xuất bản

## Cải tiến đã thực hiện

### Backend:
1. **BookController**: Cập nhật response format với `success`, `data`, `message`
2. **Book Model**: Thêm JOIN queries để lấy tên thay vì ID
3. **Search API**: Thêm endpoint `/books/search` cho tìm kiếm
4. **Error Handling**: Cải thiện xử lý lỗi và thông báo

### Frontend:
1. **BookManagement Component**: Đã có đầy đủ UI cho tất cả chức năng
2. **useBookManagement Hook**: Kết nối với real API thay vì mock data
3. **Form Validation**: Validation phía client với thông báo lỗi rõ ràng
4. **Search Functionality**: Tìm kiếm real-time với API
5. **Data Display**: Hiển thị tên thay vì ID trong bảng

## Cách chạy hệ thống

### Backend:
```bash
cd backend
npm install
npm start
```

### Frontend:
```bash
cd frontend
npm install
npm run dev
```

## Lưu ý quan trọng

1. **Database**: Đảm bảo MySQL đang chạy và có dữ liệu mẫu
2. **Authentication**: Các API tạo/sửa/xóa yêu cầu quyền admin
3. **CORS**: Backend đã cấu hình CORS cho frontend
4. **Error Handling**: Tất cả lỗi đều được xử lý và hiển thị thông báo phù hợp

## Troubleshooting

### Lỗi thường gặp:
1. **"Đang tải danh mục..."**: Kiểm tra API categories có hoạt động
2. **"Có lỗi xảy ra khi tạo sách"**: Kiểm tra validation và database connection
3. **Tìm kiếm không hoạt động**: Kiểm tra endpoint `/books/search`

### Debug:
- Mở Developer Tools (F12) để xem console logs
- Kiểm tra Network tab để xem API calls
- Backend logs sẽ hiển thị chi tiết lỗi nếu có

Hệ thống đã sẵn sàng sử dụng với đầy đủ chức năng quản lý sách!
