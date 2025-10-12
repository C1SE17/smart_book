# Thêm phân trang cho trang Shop

## Tổng quan
Đã thêm chức năng phân trang (pagination) cho trang shop để hiển thị sản phẩm theo từng trang thay vì hiển thị tất cả cùng lúc.

## Vấn đề trước đây
- Trang shop hiển thị tất cả sản phẩm cùng lúc (có thể lên đến 292 sản phẩm)
- Trang quá dài, khó duyệt
- Không có phân trang, người dùng phải scroll rất nhiều

## Giải pháp đã triển khai

### ✅ **Thêm Pagination States**
```javascript
// Pagination states for products
const [currentProductPage, setCurrentProductPage] = useState(1);
const [productsPerPage] = useState(12); // 12 products per page (3 rows x 4 columns)
```

### ✅ **Thêm Pagination Logic**
```javascript
// Pagination logic for products
const paginatedProducts = useMemo(() => {
  if (!filteredProducts || !Array.isArray(filteredProducts)) return [];
  
  const startIndex = (currentProductPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  return filteredProducts.slice(startIndex, endIndex);
}, [filteredProducts, currentProductPage, productsPerPage]);

const totalProductPages = useMemo(() => {
  if (!filteredProducts || !Array.isArray(filteredProducts)) return 0;
  return Math.ceil(filteredProducts.length / productsPerPage);
}, [filteredProducts, productsPerPage]);
```

### ✅ **Thêm Page Change Handler**
```javascript
// Handle product page change
const handleProductPageChange = (page) => {
  setCurrentProductPage(page);
};
```

### ✅ **Cập nhật UI để sử dụng Paginated Products**
```javascript
// Trước: Hiển thị tất cả filteredProducts
{filteredProducts.map((product) => (...))}

// Sau: Hiển thị chỉ paginatedProducts
{paginatedProducts.map((product) => (...))}
```

### ✅ **Thêm Pagination UI**
```javascript
{/* Products Pagination */}
{totalProductPages > 1 && (
  <div className="d-flex justify-content-center mt-4">
    <nav aria-label="Products pagination">
      <ul className="pagination">
        <li className={`page-item ${currentProductPage === 1 ? 'disabled' : ''}`}>
          <button
            className="page-link"
            onClick={() => handleProductPageChange(currentProductPage - 1)}
            disabled={currentProductPage === 1}
          >
            Trước
          </button>
        </li>
        
        {Array.from({ length: totalProductPages }, (_, i) => i + 1).map((page) => (
          <li key={page} className={`page-item ${currentProductPage === page ? 'active' : ''}`}>
            <button
              className="page-link"
              onClick={() => handleProductPageChange(page)}
            >
              {page}
            </button>
          </li>
        ))}
        
        <li className={`page-item ${currentProductPage === totalProductPages ? 'disabled' : ''}`}>
          <button
            className="page-link"
            onClick={() => handleProductPageChange(currentProductPage + 1)}
            disabled={currentProductPage === totalProductPages}
          >
            Sau
          </button>
        </li>
      </ul>
    </nav>
  </div>
)}
```

### ✅ **Thêm Product Count Info**
```javascript
{/* Product count info */}
<div className="text-center mt-3">
  <small className="text-muted">
    Hiển thị {((currentProductPage - 1) * productsPerPage) + 1}-{Math.min(currentProductPage * productsPerPage, filteredProducts.length)} 
    trong tổng số {filteredProducts.length} sản phẩm
  </small>
</div>
```

### ✅ **Reset Page khi Filter thay đổi**
```javascript
// Reset page khi search thay đổi
onChange={(e) => {
  setSearchQuery(e.target.value);
  setCurrentProductPage(1); // Reset to first page when searching
}}

// Reset page khi sort thay đổi
onChange={(e) => {
  const [newSortBy, newSortOrder] = e.target.value.split('-');
  setSortBy(newSortBy);
  setSortOrder(newSortOrder);
  setCurrentProductPage(1); // Reset to first page when sorting
}}

// Reset page khi category/author thay đổi
const handleCategorySelect = (categoryName) => {
  setSelectedCategory(categoryName);
  setShowCategoryCards(false);
  setCurrentProductPage(1); // Reset to first page
};

// Reset page khi reset filters
const handleResetFilters = () => {
  setSelectedCategory('');
  setSelectedAuthor('');
  setShowAllCategories(false);
  setSearchQuery('');
  setPriceRange({ min: 0, max: 1000000 });
  setSortBy('created_at');
  setSortOrder('desc');
  setCurrentProductPage(1); // Reset to first page
};
```

## Cấu hình Pagination

### 📊 **Số sản phẩm mỗi trang:**
- **12 sản phẩm/trang** (3 hàng x 4 cột)
- Có thể điều chỉnh bằng cách thay đổi `productsPerPage`

### 🎯 **Tính năng:**
- **Nút "Trước"**: Chuyển về trang trước (disabled ở trang đầu)
- **Nút số trang**: Chuyển trực tiếp đến trang cụ thể
- **Nút "Sau"**: Chuyển đến trang tiếp theo (disabled ở trang cuối)
- **Trang hiện tại**: Được highlight với class `active`

### 📈 **Thông tin hiển thị:**
- Hiển thị range sản phẩm hiện tại (VD: "Hiển thị 1-12 trong tổng số 292 sản phẩm")
- Chỉ hiển thị pagination khi có nhiều hơn 1 trang

## Lợi ích

### ✅ **Trải nghiệm người dùng:**
1. **Trang ngắn hơn**: Không cần scroll quá nhiều
2. **Tải nhanh hơn**: Chỉ render 12 sản phẩm mỗi lần
3. **Dễ duyệt**: Có thể chuyển trang dễ dàng
4. **Thông tin rõ ràng**: Biết được đang xem trang nào

### ✅ **Hiệu suất:**
1. **Render ít hơn**: Chỉ render 12 sản phẩm thay vì 292
2. **Memory usage thấp hơn**: Ít DOM elements
3. **Smooth scrolling**: Không bị lag khi scroll

### ✅ **Tương thích:**
1. **Hoạt động với tất cả filters**: Search, category, author, price range
2. **Hoạt động với sorting**: Tất cả các loại sắp xếp
3. **Reset tự động**: Tự động về trang 1 khi filter thay đổi

## Cách sử dụng

### 🔍 **Tìm kiếm:**
1. Gõ từ khóa vào ô tìm kiếm
2. Kết quả được filter và hiển thị từ trang 1
3. Sử dụng pagination để xem các trang khác

### 📂 **Lọc theo danh mục/tác giả:**
1. Chọn danh mục hoặc tác giả
2. Kết quả được filter và hiển thị từ trang 1
3. Sử dụng pagination để xem các trang khác

### 🔄 **Sắp xếp:**
1. Chọn tiêu chí sắp xếp
2. Kết quả được sắp xếp và hiển thị từ trang 1
3. Sử dụng pagination để xem các trang khác

### 📄 **Chuyển trang:**
1. **Nút "Trước"**: Về trang trước
2. **Nút số**: Chuyển trực tiếp đến trang
3. **Nút "Sau"**: Đến trang tiếp theo

## Test Cases

### Test 1: Pagination cơ bản
- Vào trang shop
- Kiểm tra hiển thị 12 sản phẩm đầu tiên
- Nhấn nút "Sau" → Hiển thị 12 sản phẩm tiếp theo
- Nhấn nút "Trước" → Về trang trước

### Test 2: Pagination với search
- Gõ từ khóa tìm kiếm
- Kiểm tra kết quả được hiển thị từ trang 1
- Sử dụng pagination để xem các trang khác

### Test 3: Pagination với filter
- Chọn danh mục hoặc tác giả
- Kiểm tra kết quả được hiển thị từ trang 1
- Sử dụng pagination để xem các trang khác

### Test 4: Pagination với sort
- Chọn tiêu chí sắp xếp
- Kiểm tra kết quả được sắp xếp và hiển thị từ trang 1
- Sử dụng pagination để xem các trang khác

## Kết luận

Chức năng phân trang đã được thêm thành công vào trang shop! Bây giờ:

- ✅ **Hiển thị 12 sản phẩm/trang** thay vì tất cả
- ✅ **Có nút chuyển trang** với UI đẹp
- ✅ **Hiển thị thông tin trang** rõ ràng
- ✅ **Tự động reset về trang 1** khi filter thay đổi
- ✅ **Hoạt động mượt mà** với tất cả tính năng hiện có

Trang shop bây giờ dễ duyệt hơn nhiều và không còn quá dài!
