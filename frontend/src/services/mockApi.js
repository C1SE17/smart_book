// Mock API Service dựa trên database schema
// Dữ liệu được lấy từ SQL files và mock cho các chức năng cần thiết

// Dữ liệu từ SQL - Categories
const categories = [
  { category_id: 1, name: "Sách truyện", description: "Tất cả sách truyện các thể loại", parent_category_id: null, slug: "sach-truyen" },
  { category_id: 2, name: "Sách ngoại văn", description: "Sách tiếng Anh & ngoại văn", parent_category_id: null, slug: "sach-ngoai-van" },
  { category_id: 3, name: "Sách Sale theo chủ đề", description: "Danh mục sách đang giảm giá", parent_category_id: null, slug: "sach-sale-theo-chu-de" },
  { category_id: 4, name: "Sách theo tác giả", description: "Danh mục sách theo tác giả", parent_category_id: null, slug: "sach-theo-tac-gia" },
  { category_id: 5, name: "Sách theo nhà cung cấp", description: "Danh mục sách theo nhà phát hành / NXB", parent_category_id: null, slug: "sach-theo-nha-cung-cap" },
  { category_id: 6, name: "Văn phòng phẩm", description: "Dụng cụ văn phòng, học tập", parent_category_id: null, slug: "van-phong-pham" },
  { category_id: 7, name: "Quà tặng", description: "Quà lưu niệm, thiệp, đồ handmade", parent_category_id: null, slug: "qua-tang" },
  { category_id: 8, name: "Đồ chơi", description: "Đồ chơi trẻ em", parent_category_id: null, slug: "do-choi" },
  { category_id: 9, name: "Sách Văn Học", description: "Văn học trong và ngoài nước", parent_category_id: 1, slug: "sach-van-hoc" },
  { category_id: 10, name: "Truyện Ngắn - Tản Văn", description: "Truyện ngắn, tản văn", parent_category_id: 9, slug: "truyen-ngan-tan-van" },
  { category_id: 11, name: "Tiểu thuyết", description: "Tiểu thuyết các thể loại", parent_category_id: 9, slug: "tieu-thuyet" },
  { category_id: 12, name: "Tác phẩm kinh điển", description: "Tác phẩm văn học kinh điển", parent_category_id: 9, slug: "tac-pham-kinh-dien" },
  { category_id: 13, name: "Truyện Ngôn Tình", description: "Truyện ngôn tình lãng mạn", parent_category_id: 9, slug: "truyen-ngon-tinh" },
  { category_id: 14, name: "Sách Thường Thức - Đời Sống", description: "Nấu ăn, sức khỏe, phong cách sống", parent_category_id: 1, slug: "sach-thuong-thuc-doi-song" },
  { category_id: 15, name: "Nấu ăn - Học làm bánh", description: "Sách dạy nấu ăn, làm bánh", parent_category_id: 14, slug: "nau-an-hoc-lam-banh" },
  { category_id: 16, name: "Chăm Sóc Sức Khỏe", description: "Sách về sức khỏe", parent_category_id: 14, slug: "cham-soc-suc-khoe" },
  { category_id: 17, name: "Phong Cách Sống - Làm Đẹp", description: "Phong cách sống, làm đẹp", parent_category_id: 14, slug: "phong-cach-song-lam-dep" },
  { category_id: 18, name: "Sách Kinh Tế", description: "Kinh tế, quản trị, kỹ năng", parent_category_id: 1, slug: "sach-kinh-te" },
  { category_id: 19, name: "Marketing - Bán Hàng", description: "Marketing và bán hàng", parent_category_id: 18, slug: "marketing-ban-hang" },
  { category_id: 20, name: "Kỹ Năng Làm Việc", description: "Kỹ năng mềm", parent_category_id: 18, slug: "ky-nang-lam-viec" },
  { category_id: 21, name: "Kinh tế - Kinh doanh", description: "Kinh tế và khởi nghiệp", parent_category_id: 18, slug: "kinh-te-kinh-doanh" },
  { category_id: 22, name: "Quản Trị - Lãnh Đạo", description: "Quản trị, lãnh đạo", parent_category_id: 18, slug: "quan-tri-lanh-dao" },
  { category_id: 23, name: "Sách Ôn Thi Đại Học", description: "Sách tham khảo ôn thi", parent_category_id: 1, slug: "sach-on-thi-dai-hoc" },
  { category_id: 24, name: "Ngữ văn", description: "Ôn thi môn Văn", parent_category_id: 23, slug: "ngu-van" },
  { category_id: 25, name: "Toán học", description: "Ôn thi môn Toán", parent_category_id: 23, slug: "toan-hoc" },
  { category_id: 26, name: "Truyện tranh - Manga", description: "Manga, comic", parent_category_id: 1, slug: "truyen-tranh-manga" },
  { category_id: 27, name: "Sách kỹ năng - Sống đẹp", description: "Kỹ năng sống, truyền cảm hứng", parent_category_id: 1, slug: "sach-ky-nang-song-dep" }
];

// Dữ liệu từ SQL - Authors
const authors = [
  { author_id: 1, name: "Nguyễn Nhật Ánh", slug: "nguyen-nhat-anh", bio: "Nhà văn Việt Nam nổi tiếng với các tác phẩm viết cho tuổi mới lớn." },
  { author_id: 2, name: "Vũ Trọng Phụng", slug: "vu-trong-phung", bio: "Nhà văn hiện thực phê phán Việt Nam." },
  { author_id: 3, name: "Nam Cao", slug: "nam-cao", bio: "Tác giả của Lão Hạc, Chí Phèo, hiện thực phê phán." },
  { author_id: 4, name: "Aoyama Gosho", slug: "aoyama-gosho", bio: "Tác giả manga Detective Conan." },
  { author_id: 5, name: "Akira Amano", slug: "akira-amano", bio: "Tác giả manga Reborn!." },
  { author_id: 6, name: "Akira Toriyama", slug: "akira-toriyama", bio: "Tác giả Dragon Ball." },
  { author_id: 7, name: "Eiichiro Oda", slug: "eiichiro-oda", bio: "Tác giả One Piece." },
  { author_id: 8, name: "Marc Levy", slug: "marc-levy", bio: "Nhà văn người Pháp, tác phẩm lãng mạn." },
  { author_id: 9, name: "Tony Hsieh", slug: "tony-hsieh", bio: "Doanh nhân, tác giả Delivering Happiness." },
  { author_id: 10, name: "Hiro Mashima", slug: "hiro-mashima", bio: "Tác giả Fairy Tail, Eden Zero." },
  { author_id: 11, name: "Etsumi Haruki", slug: "etsumi-haruki", bio: "Tác giả văn học Nhật Bản." },
  { author_id: 12, name: "J.K. Rowling", slug: "jk-rowling", bio: "Tác giả Harry Potter." },
  { author_id: 13, name: "Trang Hạ", slug: "trang-ha", bio: "Tác giả sách dành cho phụ nữ." },
  { author_id: 14, name: "Minh Nhật", slug: "minh-nhat", bio: "Nhà văn trẻ Việt Nam." },
  { author_id: 15, name: "Agatha Christie", slug: "agatha-christie", bio: "Nữ hoàng trinh thám, tác giả Hercule Poirot." }
];

// Dữ liệu từ SQL - Publishers
const publishers = [
  { publisher_id: 1, name: "Alphabooks", slug: "alphabooks", address: "Hà Nội, Việt Nam", contact_email: "contact@alphabooks.vn" },
  { publisher_id: 2, name: "Kim Đồng", slug: "kim-dong", address: "Hà Nội, Việt Nam", contact_email: "contact@nxbkimdong.com.vn" },
  { publisher_id: 3, name: "Minh Long", slug: "minh-long", address: "Hà Nội, Việt Nam", contact_email: null },
  { publisher_id: 4, name: "IPM", slug: "ipm", address: "Hà Nội, Việt Nam", contact_email: null },
  { publisher_id: 5, name: "Nhã Nam", slug: "nha-nam", address: "Hà Nội, Việt Nam", contact_email: "info@nhanam.vn" },
  { publisher_id: 6, name: "Skybooks", slug: "skybooks", address: "Hà Nội, Việt Nam", contact_email: null },
  { publisher_id: 7, name: "Người Trẻ Việt", slug: "nguoi-tre-viet", address: "TP.HCM, Việt Nam", contact_email: null },
  { publisher_id: 8, name: "Đông A", slug: "dong-a", address: "Hà Nội, Việt Nam", contact_email: null },
  { publisher_id: 9, name: "First News - Trí Việt", slug: "first-news-tri-viet", address: "TP.HCM, Việt Nam", contact_email: "info@firstnews.com.vn" },
  { publisher_id: 10, name: "Amun - Đinh Tị", slug: "amun-dinh-ti", address: "Hà Nội, Việt Nam", contact_email: null },
  { publisher_id: 11, name: "Hoa Học Trò", slug: "hoa-hoc-tro", address: "Hà Nội, Việt Nam", contact_email: null },
  { publisher_id: 12, name: "NXB Trẻ", slug: "nxb-tre", address: "TP.HCM, Việt Nam", contact_email: "nxbtre@nxbt.vn" },
  { publisher_id: 13, name: "NXB Phụ Nữ", slug: "nxb-phu-nu", address: "Hà Nội, Việt Nam", contact_email: null }
];

// Dữ liệu từ SQL - Books (một phần từ insert_data_5.sql)
const books = [
  {
    book_id: 1,
    title: "Đắc Nhân Tâm - Bản in 1",
    description: "Sách kỹ năng sống kinh điển",
    category_id: 1,
    publisher_id: 5,
    author_id: 1,
    price: 120000,
    stock: 100,
    published_date: "2020-01-01",
    cover_image: "/images/book1.jpg",
    slug: "ac-nhan-tam-ban-in-1",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    book_id: 2,
    title: "Tuổi Trẻ Đáng Giá Bao Nhiêu - Bản in 1",
    description: "Sách truyền cảm hứng dành cho giới trẻ",
    category_id: 1,
    publisher_id: 5,
    author_id: 1,
    price: 85000,
    stock: 80,
    published_date: "2020-01-01",
    cover_image: "/images/book2.jpg",
    slug: "tuoi-tre-ang-gia-bao-nhieu-ban-in-1",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    book_id: 3,
    title: "Harry Potter và Hòn Đá Phù Thủy - Bản in 1",
    description: "Tập 1 của bộ Harry Potter",
    category_id: 9,
    publisher_id: 12,
    author_id: 12,
    price: 150000,
    stock: 50,
    published_date: "2020-01-01",
    cover_image: "/images/book3.jpg",
    slug: "harry-potter-va-hon-a-phu-thuy-ban-in-1",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    book_id: 4,
    title: "Harry Potter và Phòng Chứa Bí Mật - Bản in 1",
    description: "Tập 2 của bộ Harry Potter",
    category_id: 9,
    publisher_id: 12,
    author_id: 12,
    price: 155000,
    stock: 50,
    published_date: "2020-01-01",
    cover_image: "/images/book4.jpg",
    slug: "harry-potter-va-phong-chua-bi-mat-ban-in-1",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    book_id: 5,
    title: "Doraemon Tập 1 - Bản in 1",
    description: "Truyện tranh Doraemon",
    category_id: 26,
    publisher_id: 4,
    author_id: 4,
    price: 22000,
    stock: 200,
    published_date: "2020-01-01",
    cover_image: "/images/book1.jpg",
    slug: "doraemon-tap-1-ban-in-1",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    book_id: 6,
    title: "Doraemon Tập 2 - Bản in 1",
    description: "Truyện tranh Doraemon",
    category_id: 26,
    publisher_id: 4,
    author_id: 4,
    price: 22000,
    stock: 200,
    published_date: "2020-01-01",
    cover_image: "/images/book2.jpg",
    slug: "doraemon-tap-2-ban-in-1",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    book_id: 7,
    title: "One Piece Tập 1 - Bản in 1",
    description: "Truyện tranh One Piece",
    category_id: 26,
    publisher_id: 4,
    author_id: 7,
    price: 25000,
    stock: 200,
    published_date: "2020-01-01",
    cover_image: "/images/book3.jpg",
    slug: "one-piece-tap-1-ban-in-1",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    book_id: 8,
    title: "One Piece Tập 2 - Bản in 1",
    description: "Truyện tranh One Piece",
    category_id: 26,
    publisher_id: 4,
    author_id: 7,
    price: 25000,
    stock: 200,
    published_date: "2020-01-01",
    cover_image: "/images/book4.jpg",
    slug: "one-piece-tap-2-ban-in-1",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    book_id: 9,
    title: "Sherlock Holmes Toàn Tập - Bản in 1",
    description: "Tuyển tập truyện trinh thám kinh điển",
    category_id: 11,
    publisher_id: 5,
    author_id: 15,
    price: 130000,
    stock: 40,
    published_date: "2020-01-01",
    cover_image: "/images/book1.jpg",
    slug: "sherlock-holmes-toan-tap-ban-in-1",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    book_id: 10,
    title: "Hành Trình Về Phương Đông - Bản in 1",
    description: "Sách tâm linh nổi tiếng",
    category_id: 14,
    publisher_id: 5,
    author_id: 8,
    price: 98000,
    stock: 70,
    published_date: "2020-01-01",
    cover_image: "/images/book2.jpg",
    slug: "hanh-trinh-ve-phuong-ong-ban-in-1",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  }
];

// Mock Users (có thể tạo bằng Postman)
const users = [
  {
    user_id: 1,
    name: "Admin",
    email: "admin@gmail.com",
    phone: "0909000111",
    address: "Hà Nội",
    role: "admin",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    user_id: 2,
    name: "Nguyen Van A",
    email: "nguyenvanb@gmail.com",
    phone: "0912000222",
    address: "TP.HCM",
    role: "customer",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  }
];

// Mock Reviews
const reviews = [
  {
    review_id: 1,
    user_id: 2,
    book_id: 1,
    rating: 5,
    review_text: "Sách rất hay và bổ ích!",
    created_at: "2024-01-01T00:00:00Z"
  },
  {
    review_id: 2,
    user_id: 2,
    book_id: 3,
    rating: 4,
    review_text: "Câu chuyện thú vị, phù hợp cho trẻ em.",
    created_at: "2024-01-01T00:00:00Z"
  }
];

// Mock Orders
const orders = [
  {
    order_id: 1,
    user_id: 2,
    status: "completed",
    total_price: 205000,
    shipping_address: "123 Đường ABC, Quận 1, TP.HCM",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  }
];

// Mock Order Items
const orderItems = [
  {
    order_item_id: 1,
    order_id: 1,
    book_id: 1,
    quantity: 1,
    price_at_order: 120000
  },
  {
    order_item_id: 2,
    order_id: 1,
    book_id: 2,
    quantity: 1,
    price_at_order: 85000
  }
];

// Mock Cart
const carts = [
  {
    cart_id: 1,
    user_id: 2,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  }
];

// Mock Cart Items
const cartItems = [
  {
    cart_item_id: 1,
    cart_id: 1,
    book_id: 3,
    quantity: 2,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  }
];

// Helper function để thêm thông tin author và publisher vào books
const enrichBooks = (books) => {
  return books.map(book => {
    const author = authors.find(a => a.author_id === book.author_id);
    const publisher = publishers.find(p => p.publisher_id === book.publisher_id);
    const category = categories.find(c => c.category_id === book.category_id);
    const bookReviews = reviews.filter(r => r.book_id === book.book_id);
    const averageRating = bookReviews.length > 0 
      ? bookReviews.reduce((sum, r) => sum + r.rating, 0) / bookReviews.length 
      : 0;

    return {
      ...book,
      author: author ? author.name : "Unknown",
      publisher: publisher ? publisher.name : "Unknown",
      category: category ? category.name : "Unknown",
      rating: Math.round(averageRating * 10) / 10,
      reviewCount: bookReviews.length
    };
  });
};

// API Functions
export const mockApi = {
  // Books API
  getBooks: async (params = {}) => {
    const { page = 1, limit = 10, category_id, author_id, search, sort = 'created_at', order = 'desc' } = params;
    
    let filteredBooks = [...books];
    
    // Filter by category
    if (category_id) {
      filteredBooks = filteredBooks.filter(book => book.category_id === parseInt(category_id));
    }
    
    // Filter by author
    if (author_id) {
      filteredBooks = filteredBooks.filter(book => book.author_id === parseInt(author_id));
    }
    
    // Search by title or description
    if (search) {
      const searchLower = search.toLowerCase();
      filteredBooks = filteredBooks.filter(book => 
        book.title.toLowerCase().includes(searchLower) || 
        book.description.toLowerCase().includes(searchLower)
      );
    }
    
    // Sort
    filteredBooks.sort((a, b) => {
      if (order === 'asc') {
        return a[sort] > b[sort] ? 1 : -1;
      } else {
        return a[sort] < b[sort] ? 1 : -1;
      }
    });
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedBooks = filteredBooks.slice(startIndex, endIndex);
    
    return {
      data: enrichBooks(paginatedBooks),
      pagination: {
        page,
        limit,
        total: filteredBooks.length,
        totalPages: Math.ceil(filteredBooks.length / limit)
      }
    };
  },

  getBookById: async (id) => {
    const book = books.find(b => b.book_id === parseInt(id));
    if (!book) {
      throw new Error('Book not found');
    }
    return enrichBooks([book])[0];
  },

  getNewBooks: async (limit = 4) => {
    const newBooks = books
      .sort((a, b) => new Date(b.published_date) - new Date(a.published_date))
      .slice(0, limit);
    return enrichBooks(newBooks);
  },

  getPopularBooks: async (limit = 4) => {
    const popularBooks = books
      .sort((a, b) => a.stock - b.stock) // Sách có stock thấp = bán nhiều
      .slice(0, limit);
    return enrichBooks(popularBooks);
  },

  // Categories API
  getCategories: async () => {
    return categories;
  },

  getCategoryById: async (id) => {
    return categories.find(c => c.category_id === parseInt(id));
  },

  // Authors API
  getAuthors: async () => {
    return authors;
  },

  getAuthorById: async (id) => {
    return authors.find(a => a.author_id === parseInt(id));
  },

  // Publishers API
  getPublishers: async () => {
    return publishers;
  },

  getPublisherById: async (id) => {
    return publishers.find(p => p.publisher_id === parseInt(id));
  },

  // Reviews API
  getReviewsByBookId: async (bookId) => {
    const bookReviews = reviews.filter(r => r.book_id === parseInt(bookId));
    return bookReviews.map(review => {
      const user = users.find(u => u.user_id === review.user_id);
      return {
        ...review,
        user: user ? { name: user.name, email: user.email } : null
      };
    });
  },

  addReview: async (reviewData) => {
    const newReview = {
      review_id: reviews.length + 1,
      ...reviewData,
      created_at: new Date().toISOString()
    };
    reviews.push(newReview);
    return newReview;
  },

  // Cart API
  getCartByUserId: async (userId) => {
    const userCart = carts.find(c => c.user_id === parseInt(userId));
    if (!userCart) {
      return { cart: null, items: [] };
    }
    
    const items = cartItems
      .filter(item => item.cart_id === userCart.cart_id)
      .map(item => {
        const book = books.find(b => b.book_id === item.book_id);
        return {
          ...item,
          book: book ? enrichBooks([book])[0] : null
        };
      });
    
    return { cart: userCart, items };
  },

  addToCart: async (userId, bookId, quantity = 1) => {
    let userCart = carts.find(c => c.user_id === parseInt(userId));
    
    if (!userCart) {
      userCart = {
        cart_id: carts.length + 1,
        user_id: parseInt(userId),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      carts.push(userCart);
    }
    
    const existingItem = cartItems.find(
      item => item.cart_id === userCart.cart_id && item.book_id === parseInt(bookId)
    );
    
    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.updated_at = new Date().toISOString();
    } else {
      cartItems.push({
        cart_item_id: cartItems.length + 1,
        cart_id: userCart.cart_id,
        book_id: parseInt(bookId),
        quantity,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }
    
    return { success: true };
  },

  removeFromCart: async (userId, bookId) => {
    const userCart = carts.find(c => c.user_id === parseInt(userId));
    if (!userCart) return { success: false };
    
    const itemIndex = cartItems.findIndex(
      item => item.cart_id === userCart.cart_id && item.book_id === parseInt(bookId)
    );
    
    if (itemIndex > -1) {
      cartItems.splice(itemIndex, 1);
      return { success: true };
    }
    
    return { success: false };
  },

  updateCartItemQuantity: async (userId, bookId, quantity) => {
    const userCart = carts.find(c => c.user_id === parseInt(userId));
    if (!userCart) return { success: false };
    
    const item = cartItems.find(
      item => item.cart_id === userCart.cart_id && item.book_id === parseInt(bookId)
    );
    
    if (item) {
      item.quantity = quantity;
      item.updated_at = new Date().toISOString();
      return { success: true };
    }
    
    return { success: false };
  },

  // Orders API
  getOrdersByUserId: async (userId) => {
    const userOrders = orders.filter(o => o.user_id === parseInt(userId));
    return userOrders.map(order => {
      const orderItemsForOrder = orderItems.filter(item => item.order_id === order.order_id);
      return {
        ...order,
        items: orderItemsForOrder.map(item => {
          const book = books.find(b => b.book_id === item.book_id);
          return {
            ...item,
            book: book ? enrichBooks([book])[0] : null
          };
        })
      };
    });
  },

  getOrderById: async (orderId) => {
    const order = orders.find(o => o.order_id === parseInt(orderId));
    if (!order) return null;
    
    const orderItemsForOrder = orderItems.filter(item => item.order_id === order.order_id);
    return {
      ...order,
      items: orderItemsForOrder.map(item => {
        const book = books.find(b => b.book_id === item.book_id);
        return {
          ...item,
          book: book ? enrichBooks([book])[0] : null
        };
      })
    };
  },

  createOrder: async (orderData) => {
    const newOrder = {
      order_id: orders.length + 1,
      ...orderData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    orders.push(newOrder);
    return newOrder;
  },

  // Users API
  getUserById: async (id) => {
    return users.find(u => u.user_id === parseInt(id));
  },

  updateUser: async (id, userData) => {
    const userIndex = users.findIndex(u => u.user_id === parseInt(id));
    if (userIndex > -1) {
      users[userIndex] = {
        ...users[userIndex],
        ...userData,
        updated_at: new Date().toISOString()
      };
      return users[userIndex];
    }
    return null;
  }
};

export default mockApi;
