USE smart_book;
-- 1. USERS (Người dùng)
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID người dùng',
    name VARCHAR(100) NOT NULL COMMENT 'Tên người dùng',
    email VARCHAR(100) UNIQUE NOT NULL COMMENT 'Email duy nhất (dùng để đăng nhập)',
    password_hash VARCHAR(255) NOT NULL COMMENT 'Mật khẩu mã hóa (bcrypt)',
    phone VARCHAR(20) COMMENT 'Số điện thoại',
    address TEXT COMMENT 'Địa chỉ giao hàng mặc định',
    role ENUM('customer', 'admin') DEFAULT 'customer' COMMENT 'Phân quyền người dùng',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) COMMENT='Người dùng của hệ thống';

-- 2. CATEGORIES (Danh mục sách)
CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID danh mục',
    name VARCHAR(100) NOT NULL COMMENT 'Tên danh mục sách',
    description TEXT COMMENT 'Mô tả danh mục',
    parent_category_id INT NULL COMMENT 'Danh mục cha (nếu có)',
    slug VARCHAR(150) NOT NULL UNIQUE COMMENT 'Đường dẫn thân thiện với SEO',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_category_id) REFERENCES categories(category_id) ON DELETE SET NULL
) COMMENT='Danh mục sách (hỗ trợ phân cấp)';

-- 3. AUTHORS (Tác giả)
CREATE TABLE authors (
    author_id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID tác giả',
    name VARCHAR(150) NOT NULL COMMENT 'Tên tác giả',
    bio TEXT COMMENT 'Tiểu sử / giới thiệu về tác giả',
    slug VARCHAR(150) NOT NULL UNIQUE COMMENT 'Slug SEO cho tác giả',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) COMMENT='Danh sách tác giả';

-- 4. PUBLISHERS (Nhà xuất bản)
CREATE TABLE publishers (
    publisher_id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID nhà xuất bản',
    name VARCHAR(150) NOT NULL COMMENT 'Tên NXB',
    address TEXT COMMENT 'Địa chỉ NXB',
    contact_email VARCHAR(150) COMMENT 'Email liên hệ',
    slug VARCHAR(150) NOT NULL UNIQUE COMMENT 'Slug SEO cho NXB',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) COMMENT='Danh sách nhà xuất bản';

-- 5. BOOKS (Sách)
CREATE TABLE books (
    book_id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID sách',
    title VARCHAR(250) NOT NULL COMMENT 'Tên sách',
    description TEXT COMMENT 'Mô tả chi tiết',
    price DECIMAL(10,2) NOT NULL COMMENT 'Giá bán',
    stock INT DEFAULT 0 COMMENT 'Số lượng tồn',
    category_id INT COMMENT 'Danh mục sách',
    author_id INT COMMENT 'Tác giả',
    publisher_id INT COMMENT 'Nhà xuất bản',
    published_date DATE COMMENT 'Ngày xuất bản',
    cover_image VARCHAR(255) COMMENT 'Ảnh bìa',
    slug VARCHAR(200) NOT NULL UNIQUE COMMENT 'Slug SEO cho sách',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE SET NULL,
    FOREIGN KEY (author_id) REFERENCES authors(author_id) ON DELETE SET NULL,
    FOREIGN KEY (publisher_id) REFERENCES publishers(publisher_id) ON DELETE SET NULL
) COMMENT='Danh sách sách';

-- 6. CARTS (Giỏ hàng)
CREATE TABLE carts (
    cart_id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID giỏ hàng',
    user_id INT NOT NULL COMMENT 'Chủ sở hữu giỏ hàng',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) COMMENT='Giỏ hàng của người dùng';

-- 7. CART ITEMS (Chi tiết giỏ hàng)
CREATE TABLE cart_items (
    cart_item_id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID item trong giỏ',
    cart_id INT NOT NULL COMMENT 'Giỏ hàng',
    book_id INT NOT NULL COMMENT 'Sách',
    quantity INT DEFAULT 1 COMMENT 'Số lượng',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (cart_id) REFERENCES carts(cart_id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(book_id) ON DELETE CASCADE
) COMMENT='Các sản phẩm trong giỏ hàng';

-- 8. ORDERS (Đơn hàng)
CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID đơn hàng',
    user_id INT NOT NULL COMMENT 'Người đặt hàng',
    status ENUM('pending', 'paid', 'shipped', 'completed', 'cancelled') DEFAULT 'pending' COMMENT 'Trạng thái',
    total_price DECIMAL(10,2) NOT NULL COMMENT 'Tổng tiền',
    shipping_address TEXT COMMENT 'Địa chỉ giao hàng',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) COMMENT='Đơn hàng của người dùng';

-- 9. ORDER ITEMS (Chi tiết đơn hàng)
CREATE TABLE order_items (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID dòng sản phẩm',
    order_id INT NOT NULL COMMENT 'Đơn hàng',
    book_id INT NULL COMMENT 'Sách',
    quantity INT NOT NULL COMMENT 'Số lượng đặt',
    price_at_order DECIMAL(10,2) NOT NULL COMMENT 'Giá tại thời điểm đặt',
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(book_id) ON DELETE SET NULL
) COMMENT='Sản phẩm trong đơn hàng';

-- 10. PAYMENTS (Thanh toán)
CREATE TABLE payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID thanh toán',
    order_id INT NOT NULL COMMENT 'Đơn hàng được thanh toán',
    payment_method ENUM('momo', 'stripe', 'cod') NOT NULL COMMENT 'Phương thức thanh toán',
    amount DECIMAL(10,2) NOT NULL COMMENT 'Số tiền',
    status ENUM('pending', 'success', 'failed') DEFAULT 'pending' COMMENT 'Trạng thái',
    transaction_id VARCHAR(255) COMMENT 'Mã giao dịch cổng thanh toán',
    paid_at TIMESTAMP NULL COMMENT 'Thời gian thanh toán',
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
) COMMENT='Thông tin thanh toán';

-- 11 . review (bình luận + đánh giá sao)
CREATE TABLE reviews (
    review_id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID đánh giá',
    user_id INT NOT NULL COMMENT 'Người đánh giá',
    book_id INT NOT NULL COMMENT 'Sách được đánh giá',
    rating TINYINT NOT NULL COMMENT 'Số sao đánh giá (1-5)',
    review_text TEXT NULL COMMENT 'Nội dung đánh giá (tùy chọn)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Ngày đánh giá',
    CONSTRAINT chk_rating CHECK (rating BETWEEN 1 AND 5),
    CONSTRAINT fk_review_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_review_book FOREIGN KEY (book_id) REFERENCES books(book_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
USE smart_book;
-- 12. review_replies (phản hồi bình luận)
CREATE TABLE review_replies (
    reply_id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID phản hồi',
    review_id INT NOT NULL COMMENT 'Bình luận được phản hồi',
    user_id INT NOT NULL COMMENT 'Người phản hồi',
    reply_text TEXT NOT NULL COMMENT 'Nội dung phản hồi',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Ngày phản hồi',
    CONSTRAINT fk_reply_review FOREIGN KEY (review_id) REFERENCES reviews(review_id) ON DELETE CASCADE,
    CONSTRAINT fk_reply_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

USE smart_book;
-- bảng warehouse (ràng buộc với books)
CREATE TABLE warehouse (
    warehouse_id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID kho',
    book_id INT NOT NULL COMMENT 'ID sách',
    quantity INT DEFAULT 0 COMMENT 'Số lượng sách trong kho',
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (book_id) REFERENCES books(book_id) ON DELETE CASCADE,
    UNIQUE KEY uq_warehouse_book (book_id) -- mỗi sách chỉ có 1 dòng trong kho
) COMMENT='Kho sách (liên kết chặt với bảng books)';

