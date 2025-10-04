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
  { author_id: 15, name: "Agatha Christie", slug: "agatha-christie", bio: "Nữ hoàng trinh thám, tác giả Hercule Poirot." },
  { author_id: 16, name: "Delia Owens", slug: "delia-owens", bio: "Tác giả người Mỹ, nổi tiếng với Where the Crawdads Sing." },
  { author_id: 17, name: "Fujiko F. Fujio", slug: "fujiko-f-fujio", bio: "Tác giả manga Doraemon." },
  { author_id: 18, name: "Koyoharu Gotouge", slug: "koyoharu-gotouge", bio: "Tác giả manga Demon Slayer - Kimetsu No Yaiba." }
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
    title: "WHERE THE CRAWDADS SING",
    description: "A novel by Delia Owens - #1 New York Times Bestseller",
    category_id: 2,
    publisher_id: 5,
    author_id: 16,
    price: 350000,
    stock: 100,
    published_date: "2020-01-01",
    cover_image: "/images/book1.jpg",
    slug: "where-the-crawdads-sing",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    book_id: 2,
    title: "Doraemon: Nobita's Little Star Wars",
    description: "Manga truyện tranh Doraemon tập 8",
    category_id: 26,
    publisher_id: 2,
    author_id: 17,
    price: 280000,
    stock: 80,
    published_date: "2020-01-01",
    cover_image: "/images/book2.jpg",
    slug: "doraemon-nobita-little-star-wars",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    book_id: 3,
    title: "Demon Slayer - Kimetsu No Yaiba",
    description: "Manga truyện tranh Diệt Quỷ tập 1",
    category_id: 26,
    publisher_id: 2,
    author_id: 18,
    price: 150000,
    stock: 50,
    published_date: "2020-01-01",
    cover_image: "/images/book3.jpg",
    slug: "demon-slayer-kimetsu-no-yaiba",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    book_id: 4,
    title: "Conan - Fu Jin Nobunaga 450",
    description: "Manga truyện tranh Detective Conan tập 450",
    category_id: 26,
    publisher_id: 2,
    author_id: 4,
    price: 180000,
    stock: 50,
    published_date: "2020-01-01",
    cover_image: "/images/book4.jpg",
    slug: "conan-fu-jin-nobunaga-450",
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

// Không còn mock users, chỉ sử dụng dữ liệu từ SQL database

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
  },
  {
    review_id: 3,
    user_id: 3,
    book_id: 1,
    rating: 5,
    review_text: "aaaaaaaaaaaaa",
    created_at: "2024-01-03T00:00:00Z"
  },
  {
    review_id: 4,
    user_id: 4,
    book_id: 1,
    rating: 3,
    review_text: "Sách tạm ổn, có thể đọc được.",
    created_at: "2024-01-04T00:00:00Z"
  },
  {
    review_id: 5,
    user_id: 2,
    book_id: 1,
    rating: 2,
    review_text: "Không hay lắm, hơi nhàm chán.",
    created_at: "2024-01-05T00:00:00Z"
  },
  {
    review_id: 6,
    user_id: 4,
    book_id: 1,
    rating: 4,
    review_text: "Đánh giá từ tài khoản test khác.",
    created_at: "2024-01-06T00:00:00Z"
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
    
    // Search by title only (exact match or contains)
    if (search) {
      const searchLower = search.toLowerCase();
      filteredBooks = filteredBooks.filter(book => 
        // Search by exact title match (priority)
        book.title.toLowerCase() === searchLower ||
        // Search by title contains
        book.title.toLowerCase().includes(searchLower)
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

  // Search suggestions API - Only book titles
  getSearchSuggestions: async (query) => {
    if (!query || query.length < 2) return [];
    
    const searchLower = query.toLowerCase();
    const suggestions = [];
    
    // Search in books only
    books.forEach(book => {
      if (book.title.toLowerCase().includes(searchLower)) {
        suggestions.push({
          type: 'book',
          title: book.title,
          subtitle: `Sách - ${authors.find(a => a.author_id === book.author_id)?.name || 'Unknown'}`,
          id: book.book_id
        });
      }
    });
    
    // Remove duplicates and limit results
    const uniqueSuggestions = suggestions.filter((suggestion, index, self) => 
      index === self.findIndex(s => s.title === suggestion.title)
    );
    
    return uniqueSuggestions.slice(0, 8);
  },

  // Get popular search keywords
  getPopularKeywords: async () => {
    return [
      'One Piece',
      'Doraemon', 
      'Demon Slayer',
      'Detective Conan',
      'Manga',
      'Truyện tranh',
      'Sách văn học',
      'Tiểu thuyết'
    ];
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

  // Forgot Password API
  sendResetEmail: async (email) => {
    try {
      // Kiểm tra email có tồn tại không
      const user = users.find(u => u.email === email);
      if (!user) {
        throw new Error('Email không tồn tại trong hệ thống');
      }

      // Tạo mã reset (6 chữ số)
      const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Lưu mã reset vào localStorage (trong thực tế sẽ gửi email)
      const resetData = {
        email: email,
        code: resetCode,
        expiresAt: Date.now() + 15 * 60 * 1000, // 15 phút
        attempts: 0
      };
      
      localStorage.setItem(`reset_${email}`, JSON.stringify(resetData));
      
      console.log(`Reset code for ${email}: ${resetCode}`); // Debug log
      console.log(`Mã xác thực cho ${email} là: ${resetCode}`);
      console.log(`Mã sẽ hết hạn sau 15 phút`);
      
      return {
        success: true,
        message: 'Mã xác thực đã được gửi đến email của bạn',
        // Trong thực tế, không trả về code
        debugCode: resetCode // Chỉ để debug
      };
    } catch (error) {
      console.error('Lỗi gửi email reset:', error);
      throw error;
    }
  },

  verifyResetCode: async (email, code) => {
    try {
      const resetData = localStorage.getItem(`reset_${email}`);
      if (!resetData) {
        throw new Error('Mã xác thực không hợp lệ hoặc đã hết hạn');
      }

      const parsedData = JSON.parse(resetData);
      
      // Kiểm tra hết hạn
      if (Date.now() > parsedData.expiresAt) {
        localStorage.removeItem(`reset_${email}`);
        throw new Error('Mã xác thực đã hết hạn');
      }

      // Kiểm tra số lần thử
      if (parsedData.attempts >= 3) {
        localStorage.removeItem(`reset_${email}`);
        throw new Error('Bạn đã nhập sai quá nhiều lần. Vui lòng yêu cầu mã mới');
      }

      // Kiểm tra mã
      if (parsedData.code !== code) {
        parsedData.attempts += 1;
        localStorage.setItem(`reset_${email}`, JSON.stringify(parsedData));
        throw new Error(`Mã xác thực không đúng. Còn ${3 - parsedData.attempts} lần thử`);
      }

      // Tạo token reset
      const resetToken = `reset_token_${email}_${Date.now()}`;
      parsedData.resetToken = resetToken;
      localStorage.setItem(`reset_${email}`, JSON.stringify(parsedData));

      return {
        success: true,
        message: 'Mã xác thực hợp lệ',
        resetToken: resetToken
      };
    } catch (error) {
      console.error('Lỗi xác thực mã:', error);
      throw error;
    }
  },

  resetPassword: async (email, newPassword, resetToken) => {
    try {
      const resetData = localStorage.getItem(`reset_${email}`);
      if (!resetData) {
        throw new Error('Phiên đặt lại mật khẩu không hợp lệ');
      }

      const parsedData = JSON.parse(resetData);
      
      // Kiểm tra token
      if (parsedData.resetToken !== resetToken) {
        throw new Error('Token không hợp lệ');
      }

      // Kiểm tra hết hạn
      if (Date.now() > parsedData.expiresAt) {
        localStorage.removeItem(`reset_${email}`);
        throw new Error('Phiên đặt lại mật khẩu đã hết hạn');
      }

      // Cập nhật mật khẩu trong mock data để đồng bộ
      console.log(`Mock: Cập nhật mật khẩu cho ${email}`);
      console.log(`Mock: Mật khẩu mới: ${newPassword}`);
      
      // Cập nhật mật khẩu trong mock users array
      const userIndex = users.findIndex(u => u.email === email);
      if (userIndex !== -1) {
        users[userIndex].password = newPassword; // Lưu mật khẩu mới trong mock data
        users[userIndex].updated_at = new Date().toISOString();
        console.log(`Mock: Đã cập nhật mật khẩu trong mock data cho user: ${email}`);
      }
      
      // Lưu mật khẩu mới vào localStorage để login sử dụng
      const userData = localStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        if (parsedUser.email === email) {
          parsedUser.password = newPassword;
          localStorage.setItem('user', JSON.stringify(parsedUser));
          console.log(`Mock: Đã cập nhật mật khẩu trong localStorage cho user: ${email}`);
        }
      }

      // Xóa dữ liệu reset
      localStorage.removeItem(`reset_${email}`);

      return {
        success: true,
        message: 'Mật khẩu đã được cập nhật thành công'
      };
    } catch (error) {
      console.error('Lỗi đặt lại mật khẩu:', error);
      throw error;
    }
  },

  // Test function để kiểm tra mock API
  testForgotPasswordFlow: async (email) => {
    try {
      console.log('🧪 Testing Forgot Password Flow for:', email);
      
      // Step 1: Send reset email
      const step1 = await mockApi.sendResetEmail(email);
      console.log('✅ Step 1 - Send Reset Email:', step1);
      
      // Step 2: Get the code from localStorage
      const resetData = localStorage.getItem(`reset_${email}`);
      if (!resetData) {
        throw new Error('Không tìm thấy dữ liệu reset');
      }
      
      const parsedData = JSON.parse(resetData);
      const code = parsedData.code;
      console.log('🔐 Step 2 - Got Code:', code);
      
      // Step 3: Verify code
      const step3 = await mockApi.verifyResetCode(email, code);
      console.log('✅ Step 3 - Verify Code:', step3);
      
      // Step 4: Reset password
      const step4 = await mockApi.resetPassword(email, 'newpassword123', step3.resetToken);
      console.log('✅ Step 4 - Reset Password:', step4);
      
      return {
        success: true,
        message: 'Test flow completed successfully',
        steps: { step1, step2: { code }, step3, step4 }
      };
    } catch (error) {
      console.error('❌ Test flow failed:', error);
      throw error;
    }
  },

  // Users API
  register: async (userData) => {
    const { name, email, password, phone, address } = userData;
    
    try {
      // Gọi backend API thật để đăng ký
      const response = await fetch('http://localhost:3306/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          phone: phone || '',
          address: address || '',
          role: email.includes('admin') ? 'admin' : 'customer' // Tự động set admin nếu email chứa 'admin'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Đăng ký thất bại');
      }

      const result = await response.json();
      
      // Xác định role dựa trên email (vì backend không xử lý role)
      const userRole = email.includes('admin') ? 'admin' : 'customer';
      
      // Tạo user object cho frontend
      const newUser = {
        user_id: Date.now(), // Tạm thời dùng timestamp
        name: name,
        email: email,
        phone: phone || '',
        address: address || '',
        role: userRole, // Sử dụng role được xác định từ email
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      console.log('Created user with role:', userRole, 'for email:', email);
      
      // Thêm vào mock data để frontend hoạt động
      users.push(newUser);
      
      // Generate mock token
      const token = `mock_token_${newUser.user_id}_${Date.now()}`;
      
      return {
        user: newUser,
        token: token,
        message: result.message || 'Đăng ký thành công'
      };
    } catch (error) {
      console.error('Lỗi đăng ký:', error);
      throw error;
    }
  },

  login: async (credentials) => {
    const { email, password } = credentials;
    
    try {
      // Chỉ sử dụng backend API
      console.log('Gọi backend API để đăng nhập...');
      const response = await fetch('http://localhost:3306/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Đăng nhập thất bại');
      }

      const result = await response.json();
      
      // Decode JWT token để lấy role
      let userRole = 'customer'; // Default role
      if (result.token) {
        try {
          // Decode JWT token (chỉ lấy payload, không verify signature)
          const payload = JSON.parse(atob(result.token.split('.')[1]));
          userRole = payload.role || 'customer';
          console.log('Decoded JWT payload:', payload);
          console.log('User role from token:', userRole);
        } catch (error) {
          console.warn('Không thể decode token, sử dụng role mặc định:', error);
        }
      }
      
      // Override role cho admin emails (tạm thời fix)
      if (email.includes('admin')) {
        userRole = 'admin';
        console.log('Overriding role to admin for email:', email);
      }
      
      // Lấy thông tin user từ backend
      const userResponse = await fetch(`http://localhost:3306/api/users/${result.userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${result.token}`
        }
      });

      let userData = {};
      if (userResponse.ok) {
        userData = await userResponse.json();
      } else {
        // Fallback nếu không lấy được thông tin user
        userData = {
          user_id: result.userId,
          name: email.split('@')[0],
          email: email,
          phone: '',
          address: '',
          role: userRole,
          status: 'active'
        };
      }
      
      console.log('User data from backend:', userData);
      
      return {
        user: {
          user_id: userData.user_id,
          name: userData.name,
          email: userData.email,
          phone: userData.phone || '',
          address: userData.address || '',
          role: userRole,
          status: userData.status || 'active',
          created_at: userData.created_at,
          updated_at: userData.updated_at
        },
        token: result.token,
        message: result.message || 'Đăng nhập thành công'
      };
    } catch (error) {
      console.error('Lỗi đăng nhập:', error);
      throw error;
    }
  },

  getUserById: async (id) => {
    // Lấy user từ backend thay vì mock data
    try {
      const token = localStorage.getItem('userToken') || JSON.parse(localStorage.getItem('user') || '{}').token;
      const response = await fetch(`http://localhost:3306/api/users/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  },

  updateUser: async (id, userData, currentUser = null) => {
    const userIndex = users.findIndex(u => u.user_id === parseInt(id));
    if (userIndex > -1) {
      // Kiểm tra quyền thay đổi role
      if (userData.role && currentUser && currentUser.role !== 'admin') {
        // Nếu không phải admin, không cho phép thay đổi role
        delete userData.role;
      }
      
      users[userIndex] = {
        ...users[userIndex],
        ...userData,
        updated_at: new Date().toISOString()
      };
      return users[userIndex];
    }
    return null;
  },

  // Đăng xuất tất cả thiết bị (bao gồm thiết bị hiện tại)
  logoutAllDevices: async (userId) => {
    // Trong thực tế, bạn sẽ:
    // 1. Lưu thời gian đăng xuất tất cả thiết bị
    // 2. Invalidate tất cả tokens (bao gồm token hiện tại)
    // 3. Gửi email thông báo
    // 4. Log hoạt động bảo mật
    
    const userIndex = users.findIndex(u => u.user_id === parseInt(userId));
    
    if (userIndex > -1) {
      users[userIndex] = {
        ...users[userIndex],
        last_logout_all: new Date().toISOString(),
        // Invalidate tất cả tokens bằng cách thêm timestamp
        token_invalidated_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      return {
        success: true,
        message: 'Đã đăng xuất tất cả thiết bị thành công',
        last_logout_all: users[userIndex].last_logout_all,
        token_invalidated_at: users[userIndex].token_invalidated_at
      };
    }
    
    return {
      success: false,
      message: 'Không tìm thấy người dùng'
    };
  },

  // Đổi mật khẩu
  changePassword: async (userId, passwordData) => {
    const { currentPassword, newPassword } = passwordData;
    
    const userIndex = users.findIndex(u => u.user_id === parseInt(userId));
    if (userIndex === -1) {
      return {
        success: false,
        message: 'Không tìm thấy người dùng'
      };
    }

    // Trong thực tế, bạn sẽ:
    // 1. Hash mật khẩu hiện tại và so sánh với database
    // 2. Hash mật khẩu mới trước khi lưu
    // 3. Kiểm tra độ mạnh của mật khẩu mới
    
    // Mock validation - trong thực tế sẽ hash và so sánh
    if (!currentPassword) {
      return {
        success: false,
        message: 'Vui lòng nhập mật khẩu hiện tại'
      };
    }

    if (!newPassword || newPassword.length < 6) {
      return {
        success: false,
        message: 'Mật khẩu mới phải có ít nhất 6 ký tự'
      };
    }

    if (currentPassword === newPassword) {
      return {
        success: false,
        message: 'Mật khẩu mới phải khác mật khẩu hiện tại'
      };
    }

    // Cập nhật mật khẩu (trong thực tế sẽ hash)
    users[userIndex] = {
      ...users[userIndex],
      password: newPassword, // Trong thực tế sẽ là hash
      password_changed_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    return {
      success: true,
      message: 'Đổi mật khẩu thành công',
      password_changed_at: users[userIndex].password_changed_at
    };
  }
};

export default mockApi;
