# Hướng dẫn sử dụng Admin Quản lý Danh Mục

## Tổng quan
Hệ thống admin quản lý danh mục đã được cập nhật với đầy đủ chức năng CRUD (Create, Read, Update, Delete) và tìm kiếm, kết nối trực tiếp với database MySQL.

## Các chức năng đã được triển khai

### 1. Thêm danh mục mới
- **Cách sử dụng**: Nhấn nút "Thêm danh mục" (màu xanh) ở góc trên bên phải
- **Thông tin bắt buộc**:
  - Tên danh mục (ít nhất 2 ký tự)
- **Thông tin tùy chọn**:
  - Mô tả
  - Danh mục cha (để tạo danh mục con)
- **Validation**: Hệ thống sẽ kiểm tra và hiển thị lỗi nếu thông tin không hợp lệ

### 2. Sửa thông tin danh mục
- **Cách sử dụng**: Nhấn nút "Sửa" (biểu tượng bút chì màu xanh) trong cột "Thao tác"
- **Chức năng**: Mở modal với thông tin danh mục hiện tại đã được điền sẵn
- **Lưu thay đổi**: Nhấn "Cập nhật" để lưu các thay đổi

### 3. Xóa danh mục
- **Cách sử dụng**: Nhấn nút "Xóa" (biểu tượng thùng rác màu đỏ) trong cột "Thao tác"
- **Xác nhận**: Hệ thống sẽ hiển thị hộp thoại xác nhận trước khi xóa
- **Lưu ý**: Hành động này không thể hoàn tác

### 4. Tìm kiếm danh mục
- **Cách sử dụng**: Nhập từ khóa vào ô "Tìm kiếm danh mục..." và nhấn nút tìm kiếm
- **Chức năng**: Tìm kiếm theo tên danh mục và mô tả (không phân biệt hoa thường)
- **Xóa tìm kiếm**: Nhấn nút "X" để xóa tìm kiếm và hiển thị lại tất cả danh mục

## Cấu trúc dữ liệu

### Bảng danh mục hiển thị:
- **Tên danh mục**: Tên đầy đủ của danh mục
- **Mô tả**: Mô tả chi tiết về danh mục
- **Danh mục cha**: Danh mục cha (nếu có) hoặc "Danh mục gốc"
- **Số sách**: Số lượng sách trong danh mục
- **Ngày tạo**: Ngày tạo danh mục
- **Thao tác**: Các nút sửa và xóa

### Hỗ trợ danh mục phân cấp:
- Danh mục gốc (không có danh mục cha)
- Danh mục con (có danh mục cha)
- Hiển thị với icon phân cấp và indent

## API Endpoints

### Backend APIs:
- `GET /api/categories` - Lấy danh sách danh mục
- `GET /api/categories/search?q={query}` - Tìm kiếm danh mục
- `GET /api/categories/:id` - Lấy chi tiết danh mục
- `POST /api/categories` - Tạo danh mục mới (chỉ admin)
- `PUT /api/categories/:id` - Cập nhật danh mục (chỉ admin)
- `DELETE /api/categories/:id` - Xóa danh mục (chỉ admin)

## Cải tiến đã thực hiện

### Backend:
1. **CategoryController**: Cập nhật response format với `success`, `data`, `message`
2. **Category Model**: Thêm method `search()` cho tìm kiếm
3. **Search API**: Thêm endpoint `/categories/search` cho tìm kiếm
4. **Error Handling**: Cải thiện xử lý lỗi và thông báo

### Frontend:
1. **CategoryManagement Component**: Đã có đầy đủ UI cho tất cả chức năng
2. **Search Functionality**: Tìm kiếm real-time với API backend
3. **Form Validation**: Validation phía client với thông báo lỗi rõ ràng
4. **Hierarchical Display**: Hiển thị danh mục phân cấp với icon và indent
5. **CRUD Operations**: Đầy đủ chức năng thêm, sửa, xóa

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
2. **"Có lỗi xảy ra khi tạo danh mục"**: Kiểm tra validation và database connection
3. **Tìm kiếm không hoạt động**: Kiểm tra endpoint `/categories/search`

### Debug:
- Mở Developer Tools (F12) để xem console logs
- Kiểm tra Network tab để xem API calls
- Backend logs sẽ hiển thị chi tiết lỗi nếu có

## Test Cases

### Test 1: Tìm kiếm với từ khóa có kết quả
- Nhập: "Sách"
- Kỳ vọng: Hiển thị danh mục có tên chứa "Sách"

### Test 2: Tìm kiếm với từ khóa không có kết quả
- Nhập: "xyz123"
- Kỳ vọng: Hiển thị "Không có dữ liệu danh mục"

### Test 3: Tìm kiếm với từ khóa rỗng
- Nhập: ""
- Kỳ vọng: Hiển thị tất cả danh mục

### Test 4: Xóa tìm kiếm
- Nhập từ khóa, sau đó nhấn nút X
- Kỳ vọng: Hiển thị tất cả danh mục

### Test 5: Tạo danh mục con
- Tạo danh mục mới và chọn danh mục cha
- Kỳ vọng: Hiển thị với icon phân cấp và indent

## Liên hệ hỗ trợ
Nếu vẫn không hoạt động, hãy cung cấp:
1. Console logs đầy đủ
2. Network requests
3. Error messages
4. Steps to reproduce

Hệ thống đã sẵn sàng sử dụng với đầy đủ chức năng quản lý danh mục!
