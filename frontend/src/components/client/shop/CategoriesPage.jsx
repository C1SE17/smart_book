import React, { useState, useEffect } from 'react';

const CategoriesPage = ({ onNavigateTo }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000000 });
  const [sortBy, setSortBy] = useState('default');

  // Xử lý query parameter từ URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    if (categoryParam) {
      setSelectedCategory(decodeURIComponent(categoryParam));
    }
  }, []);

  // Dữ liệu sản phẩm mẫu
  const sampleProducts = [
    {
      id: 1,
      title: "Thanh Gươm Diệt Quỷ - Tập 1",
      author: "Koyoharu Gotouge",
      price: 815000,
      image: "/images/book1.jpg",
      rating: 4.0,
      reviewCount: 1,
      category: "Truyện Tranh",
      description: "Câu chuyện về Tanjiro Kamado, một cậu bé trở thành thợ săn quỷ để cứu em gái mình khỏi lời nguyền biến thành quỷ."
    },
    {
      id: 2,
      title: "Doraemon: Nobita và Cuộc Chiến Vũ Trụ",
      author: "Fujiko F. Fujio",
      price: 248000,
      image: "/images/book2.jpg",
      rating: 5.0,
      reviewCount: 1,
      category: "Truyện Tranh",
      description: "Một trong những bộ phim Doraemon nổi tiếng nhất. Được phát hành lần đầu vào năm 1985 và sau đó được làm lại vào năm 2021."
    },
    {
      id: 3,
      title: "Harry Potter và Hòn Đá Phù Thủy",
      author: "J.K. Rowling",
      price: 200000,
      image: "/images/book3.jpg",
      rating: 4.8,
      reviewCount: 1,
      category: "Tiểu Thuyết",
      description: "Câu chuyện về cậu bé Harry Potter phát hiện mình là phù thủy và bắt đầu cuộc phiêu lưu tại trường Hogwarts."
    },
    {
      id: 4,
      title: "Conan - Vụ Án Nữ Hoàng 450",
      author: "Gosho Aoyama",
      price: 863000,
      image: "/images/book4.jpg",
      rating: 5.0,
      reviewCount: 1,
      category: "Mystery",
      description: "Câu chuyện về thám tử Conan Edogawa giải quyết những vụ án phức tạp và bí ẩn."
    },
    {
      id: 5,
      title: "WHERE THE CRAWDADS SING",
      author: "Delia Owens",
      price: 350000,
      image: "/images/book1.jpg",
      rating: 4.5,
      reviewCount: 1,
      category: "Fiction",
      description: "Một câu chuyện cảm động về một cô gái sống cô đơn trong đầm lầy và cuộc điều tra vụ án mạng."
    },
    {
      id: 6,
      title: "One Piece - Tập 100",
      author: "Eiichiro Oda",
      price: 220000,
      image: "/images/book2.jpg",
      rating: 4.8,
      reviewCount: 1,
      category: "Truyện Tranh",
      description: "Cuộc phiêu lưu của Monkey D. Luffy và băng hải tặc Mũ Rơm tìm kiếm kho báu One Piece."
    },
    {
      id: 7,
      title: "Attack on Titan - Tập 30",
      author: "Hajime Isayama",
      price: 195000,
      image: "/images/book3.jpg",
      rating: 4.9,
      reviewCount: 1,
      category: "Truyện Tranh",
      description: "Câu chuyện về cuộc chiến của nhân loại chống lại những Titan khổng lồ."
    },
    {
      id: 8,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      price: 180000,
      image: "/images/book4.jpg",
      rating: 4.6,
      reviewCount: 1,
      category: "Classic Literature",
      description: "Một trong những tác phẩm văn học Mỹ kinh điển về thời đại Jazz và giấc mơ Mỹ."
    },
    {
      id: 9,
      title: "Pride and Prejudice",
      author: "Jane Austen",
      price: 165000,
      image: "/images/book1.jpg",
      rating: 4.7,
      reviewCount: 1,
      category: "Romance",
      description: "Câu chuyện tình yêu kinh điển giữa Elizabeth Bennet và Mr. Darcy trong xã hội Anh thế kỷ 19."
    },
    {
      id: 10,
      title: "1984",
      author: "George Orwell",
      price: 190000,
      image: "/images/book2.jpg",
      rating: 4.8,
      reviewCount: 1,
      category: "Science Fiction",
      description: "Tác phẩm dystopian kinh điển về một xã hội toàn trị trong tương lai."
    },
    {
      id: 11,
      title: "Sapiens",
      author: "Yuval Noah Harari",
      price: 280000,
      image: "/images/book3.jpg",
      rating: 4.5,
      reviewCount: 1,
      category: "History",
      description: "Lịch sử loài người từ thời kỳ đồ đá đến hiện đại qua góc nhìn độc đáo."
    },
    {
      id: 12,
      title: "Steve Jobs",
      author: "Walter Isaacson",
      price: 320000,
      image: "/images/book4.jpg",
      rating: 4.6,
      reviewCount: 1,
      category: "Biography",
      description: "Tiểu sử chính thức của Steve Jobs, người sáng lập Apple."
    },
    {
      id: 13,
      title: "The Art of War",
      author: "Sun Tzu",
      price: 150000,
      image: "/images/book1.jpg",
      rating: 4.3,
      reviewCount: 1,
      category: "Self-Help",
      description: "Tác phẩm kinh điển về chiến lược và nghệ thuật chiến tranh."
    },
    {
      id: 14,
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      price: 250000,
      image: "/images/book2.jpg",
      rating: 4.9,
      reviewCount: 1,
      category: "Tiểu Thuyết",
      description: "Cuộc phiêu lưu của Bilbo Baggins trong thế giới Trung Địa."
    },
    {
      id: 15,
      title: "Sherlock Holmes",
      author: "Arthur Conan Doyle",
      price: 175000,
      image: "/images/book3.jpg",
      rating: 4.7,
      reviewCount: 1,
      category: "Mystery",
      description: "Những vụ án trinh thám kinh điển của thám tử Sherlock Holmes."
    },
    {
      id: 16,
      title: "Romeo and Juliet",
      author: "William Shakespeare",
      price: 160000,
      image: "/images/book4.jpg",
      rating: 4.4,
      reviewCount: 1,
      category: "Romance",
      description: "Tác phẩm tình yêu kinh điển của Shakespeare."
    },
    {
      id: 17,
      title: "Dune",
      author: "Frank Herbert",
      price: 300000,
      image: "/images/book1.jpg",
      rating: 4.6,
      reviewCount: 1,
      category: "Science Fiction",
      description: "Tác phẩm khoa học viễn tưởng kinh điển về hành tinh Arrakis."
    },
    {
      id: 18,
      title: "The Diary of Anne Frank",
      author: "Anne Frank",
      price: 140000,
      image: "/images/book2.jpg",
      rating: 4.8,
      reviewCount: 1,
      category: "History",
      description: "Nhật ký của cô gái Do Thái trong thời kỳ Holocaust."
    },
    {
      id: 19,
      title: "Atomic Habits",
      author: "James Clear",
      price: 220000,
      image: "/images/book3.jpg",
      rating: 4.5,
      reviewCount: 1,
      category: "Self-Help",
      description: "Cách xây dựng thói quen tốt và phá vỡ thói quen xấu."
    },
    {
      id: 20,
      title: "The Catcher in the Rye",
      author: "J.D. Salinger",
      price: 180000,
      image: "/images/book4.jpg",
      rating: 4.2,
      reviewCount: 1,
      category: "Fiction",
      description: "Câu chuyện về Holden Caulfield và những trải nghiệm của tuổi trẻ."
    },
    {
      id: 21,
      title: "Tuyển Tập Truyện Ngắn Nam Cao",
      author: "Nam Cao",
      price: 120000,
      image: "/images/book1.jpg",
      rating: 4.7,
      reviewCount: 1,
      category: "Sách Theo Tác Giả",
      description: "Tuyển tập những truyện ngắn hay nhất của nhà văn Nam Cao."
    },
    {
      id: 22,
      title: "Tuyển Tập Thơ Xuân Diệu",
      author: "Xuân Diệu",
      price: 95000,
      image: "/images/book2.jpg",
      rating: 4.5,
      reviewCount: 1,
      category: "Sách Theo Tác Giả",
      description: "Những bài thơ tình nổi tiếng của nhà thơ Xuân Diệu."
    },
    {
      id: 23,
      title: "Bộ Xếp Hình LEGO Classic",
      author: "LEGO",
      price: 350000,
      image: "/images/book3.jpg",
      rating: 4.8,
      reviewCount: 1,
      category: "Đồ Chơi",
      description: "Bộ xếp hình LEGO Classic với 1500 miếng ghép đa dạng."
    },
    {
      id: 24,
      title: "Búp Bê Barbie Thời Trang",
      author: "Mattel",
      price: 280000,
      image: "/images/book4.jpg",
      rating: 4.3,
      reviewCount: 1,
      category: "Đồ Chơi",
      description: "Búp bê Barbie với nhiều trang phục thời trang đẹp mắt."
    }
  ];

  // Các danh mục có sẵn để lọc
  const categories = [
    "Sách Theo Tác Giả", "Truyện Tranh", "Tiểu Thuyết", "Đồ Chơi",
    "Fiction", "Mystery", "Classic Literature", "Romance", 
    "Science Fiction", "History", "Biography", "Self-Help"
  ];

  // Các tác giả có sẵn để lọc
  const authors = [
    "Koyoharu Gotouge", "Fujiko F. Fujio", "J.K. Rowling", "Gosho Aoyama",
    "Delia Owens", "Eiichiro Oda", "Hajime Isayama", "F. Scott Fitzgerald",
    "Jane Austen", "George Orwell", "Yuval Noah Harari", "Walter Isaacson",
    "Sun Tzu", "J.R.R. Tolkien", "Arthur Conan Doyle", "William Shakespeare",
    "Frank Herbert", "Anne Frank", "James Clear", "J.D. Salinger"
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Thử lấy dữ liệu từ API
        const response = await fetch('http://localhost:5000/api/books', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
        
        // Nếu là lỗi mạng, sử dụng dữ liệu mẫu một cách im lặng
        if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
          console.log('Backend not available, using sample products data');
          setProducts(sampleProducts);
          setFilteredProducts(sampleProducts);
          setError(null);
        } else {
          setError(`Lỗi: ${err.message}`);
          setProducts(sampleProducts);
          setFilteredProducts(sampleProducts);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Lọc và tìm kiếm sản phẩm
  useEffect(() => {
    let filtered = [...products];

    // Tìm kiếm theo tiêu đề hoặc tác giả
    if (searchQuery && searchQuery.trim()) {
      filtered = filtered.filter(product => 
        product.title.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        product.author.toLowerCase().includes(searchQuery.toLowerCase().trim())
      );
    }

    // Lọc theo danh mục
    if (selectedCategory && selectedCategory.trim()) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Lọc theo tác giả
    if (selectedAuthor && selectedAuthor.trim()) {
      filtered = filtered.filter(product => product.author === selectedAuthor);
    }

    // Lọc theo khoảng giá
    filtered = filtered.filter(product => 
      product.price >= priceRange.min && product.price <= priceRange.max
    );

    // Sắp xếp sản phẩm
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // Giữ nguyên thứ tự ban đầu
        break;
    }

    setFilteredProducts(filtered);
  }, [products, searchQuery, selectedCategory, selectedAuthor, priceRange, sortBy]);

  const handleProductClick = (productId) => {
    onNavigateTo('product')();
    window.history.pushState({}, '', `/product?id=${productId}`);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedAuthor('');
    setPriceRange({ min: 0, max: 1000000 });
    setSortBy('default');
  };

  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN') + ' VNĐ';
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    return Array.from({ length: 5 }, (_, index) => {
      if (index < fullStars) {
        return <i key={index} className="bi bi-star-fill text-warning" style={{ fontSize: '12px' }}></i>;
      } else if (index === fullStars && hasHalfStar) {
        return <i key={index} className="bi bi-star-half text-warning" style={{ fontSize: '12px' }}></i>;
      } else {
        return <i key={index} className="bi bi-star text-warning" style={{ fontSize: '12px' }}></i>;
      }
    });
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Đang tải danh mục...</p>
        </div>
      </div>
    );
  }

  if (error && products.length === 0) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning" role="alert">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      {/* Backend Status Notice */}
      {products.length === 0 && sampleProducts.length > 0 && (
        <div className="alert alert-info alert-dismissible fade show" role="alert">
          <i className="bi bi-info-circle me-2"></i>
          <strong>Thông báo:</strong> Đang sử dụng dữ liệu mẫu. Backend có thể chưa được khởi động.
          <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      )}

      <div className="container">
        <div className="row">
          {/* Filter Sidebar */}
          <div className="col-lg-3 col-md-4">
            {/* Search */}
            <div className="bg-light rounded p-3 mb-3">
              <h6 className="fw-bold text-dark mb-3">Tìm Kiếm</h6>
              <input
                type="text"
                className="form-control"
                placeholder="Tìm theo tên sách hoặc tác giả..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Categories */}
            <div className="bg-light rounded p-3 mb-3">
              <h6 className="fw-bold text-dark mb-3">Danh Mục</h6>
              <div className="d-flex flex-column">
                <button
                  className={`btn btn-link text-start p-0 mb-2 ${selectedCategory === '' ? 'fw-bold text-primary' : 'text-dark'}`}
                  onClick={() => setSelectedCategory('')}
                >
                  Tất Cả ({products.length})
                </button>
                {categories.map((category) => {
                  const count = products.filter(product => product.category === category).length;
                  return (
                    <button
                      key={category}
                      className={`btn btn-link text-start p-0 mb-2 ${selectedCategory === category ? 'fw-bold text-primary' : 'text-dark'}`}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category} ({count})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Authors */}
            <div className="bg-light rounded p-3 mb-3">
              <h6 className="fw-bold text-dark mb-3">Tác Giả</h6>
              <div className="d-flex flex-column">
                <button
                  className={`btn btn-link text-start p-0 mb-2 ${selectedAuthor === '' ? 'fw-bold text-primary' : 'text-dark'}`}
                  onClick={() => setSelectedAuthor('')}
                >
                  Tất Cả ({products.length})
                </button>
                {authors.map((author) => {
                  const count = products.filter(product => product.author === author).length;
                  return count > 0 ? (
                    <button
                      key={author}
                      className={`btn btn-link text-start p-0 mb-2 ${selectedAuthor === author ? 'fw-bold text-primary' : 'text-dark'}`}
                      onClick={() => setSelectedAuthor(author)}
                    >
                      {author} ({count})
                    </button>
                  ) : null;
                })}
              </div>
            </div>

            {/* Price Range */}
            <div className="bg-light rounded p-3 mb-3">
              <h6 className="fw-bold text-dark mb-3">Khoảng Giá (VNĐ)</h6>
              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label small">Từ</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    value={priceRange.min.toLocaleString('vi-VN')}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\./g, '');
                      const numValue = parseInt(value) || 0;
                      setPriceRange({...priceRange, min: numValue});
                    }}
                    placeholder="0"
                  />
                </div>
                <div className="col-6">
                  <label className="form-label small">Đến</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    value={priceRange.max.toLocaleString('vi-VN')}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\./g, '');
                      const numValue = parseInt(value) || 1000000;
                      setPriceRange({...priceRange, max: numValue});
                    }}
                    placeholder="1.000.000"
                  />
                </div>
              </div>
              <div className="mb-2">
                <small className="text-muted">
                  {priceRange.min.toLocaleString('vi-VN')} - {priceRange.max.toLocaleString('vi-VN')} VNĐ
                </small>
              </div>
              <div className="range-slider">
                <input
                  type="range"
                  className="form-range"
                  min="0"
                  max="1000000"
                  step="10000"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({...priceRange, max: parseInt(e.target.value)})}
                />
              </div>
            </div>

            {/* Reset Filters */}
            <button
              className="btn btn-outline-secondary w-100"
              onClick={handleResetFilters}
            >
              <i className="bi bi-arrow-clockwise me-2"></i>
              Đặt Lại Bộ Lọc
            </button>
          </div>

          {/* Products Grid */}
          <div className="col-lg-9 col-md-8">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <p className="mb-0 text-muted">
                Hiển thị {filteredProducts.length} kết quả
              </p>
              <div className="dropdown">
                <button className="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                  Sắp xếp theo: {sortBy === 'default' ? 'Mặc định' : 
                    sortBy === 'price-low' ? 'Giá thấp đến cao' :
                    sortBy === 'price-high' ? 'Giá cao đến thấp' :
                    sortBy === 'name' ? 'Tên A-Z' :
                    sortBy === 'rating' ? 'Đánh giá cao' : 'Mặc định'}
                </button>
                <ul className="dropdown-menu">
                  <li><button className="dropdown-item" onClick={() => setSortBy('default')}>Mặc định</button></li>
                  <li><button className="dropdown-item" onClick={() => setSortBy('price-low')}>Giá thấp đến cao</button></li>
                  <li><button className="dropdown-item" onClick={() => setSortBy('price-high')}>Giá cao đến thấp</button></li>
                  <li><button className="dropdown-item" onClick={() => setSortBy('name')}>Tên A-Z</button></li>
                  <li><button className="dropdown-item" onClick={() => setSortBy('rating')}>Đánh giá cao</button></li>
                </ul>
              </div>
            </div>

            {/* Products Grid */}
            <div className="row g-4">
              {filteredProducts.map((product) => (
                <div key={product.id} className="col-lg-4 col-md-6">
                  <div
                    className="card h-100 border-0 shadow-sm"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleProductClick(product.id)}
                  >
                    <div className="position-relative">
                      <img
                        src={product.image}
                        className="card-img-top"
                        alt={product.title}
                        style={{ height: '300px', objectFit: 'contain', backgroundColor: '#f8f9fa' }}
                      />
                      <div className="position-absolute top-0 end-0 m-2">
                        <span className="badge bg-danger">Sale</span>
                      </div>
                    </div>
                    <div className="card-body d-flex flex-column">
                      <h6 className="card-title text-dark mb-2" style={{ fontSize: '14px', lineHeight: '1.3' }}>
                        {product.title}
                      </h6>
                      <p className="text-muted small mb-2">{product.author}</p>
                      <div className="d-flex align-items-center mb-2">
                        {renderStars(product.rating)}
                        <span className="text-muted small ms-1">({product.reviewCount})</span>
                      </div>
                      <div className="mt-auto">
                        <span className="fw-bold text-primary">{formatPrice(product.price)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* No Results */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-5">
                <i className="bi bi-search display-1 text-muted"></i>
                <h4 className="text-muted mt-3">Không tìm thấy sản phẩm nào</h4>
                <p className="text-muted">Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                <button className="btn btn-primary" onClick={handleResetFilters}>
                  Đặt Lại Bộ Lọc
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
