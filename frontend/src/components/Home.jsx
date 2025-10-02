import React, { useMemo, useCallback, useState, useEffect } from 'react';
import { bookService } from '../services';

const Home = ({ onNavigateTo }) => {
  // State cho dữ liệu sách
  const [books, setBooks] = useState([]);
  const [newBooks, setNewBooks] = useState([]);
  const [popularBooks, setPopularBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Ghi nhớ dữ liệu để tránh tạo lại mỗi lần render
  const blogPosts = useMemo(() => [
    { title: "Fujiko F. Fujio - The Creator of Doraemon", date: "24 Oct, 2019", image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=200&fit=crop" },
    { title: "The Art of Manga Storytelling", date: "15 Nov, 2019", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=200&fit=crop" },
    { title: "Top 10 Must-Read Manga Series", date: "01 Dec, 2019", image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=200&fit=crop" }
  ], []);

  // Lấy dữ liệu sách từ API
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);

      // Hiện tại, luôn sử dụng dữ liệu giả để tránh lỗi API
      console.log('Using mock data for books display');

      // Dữ liệu giả
      const mockBooks = [
        {
          book_id: 1,
          title: "WHERE THE CRAWDADS SING",
          description: "A mystery novel about a girl who grows up alone in the marshes of North Carolina",
          price: 105000, // $4.3 * 24,000 VND
          stock: 50,
          category_id: 1,
          author_id: 1,
          publisher_id: 1,
          published_date: "2018-08-14",
          cover_image: "/images/book1.jpg",
          slug: "where-the-crawdads-sing",
          author: "Delia Owens",
          rating: 3.5
        },
        {
          book_id: 2,
          title: "Doraemon: Nobita và Cuộc Chiến Vũ Trụ",
          description: "Cuộc phiêu lưu của Nobita và Doraemon trong không gian",
          price: 248000, // $10.35 * 24,000 VND
          stock: 30,
          category_id: 2,
          author_id: 2,
          publisher_id: 2,
          published_date: "2020-01-15",
          cover_image: "/images/book2.jpg",
          slug: "doraemon-nobita-vu-tru",
          author: "Fujiko F. Fujio",
          rating: 5.0
        },
        {
          book_id: 3,
          title: "Thanh Gươm Diệt Quỷ - Tập 1",
          description: "Câu chuyện về Tanjiro và cuộc chiến chống lại ma quỷ",
          price: 815000, // $33.95 * 24,000 VND
          stock: 25,
          category_id: 2,
          author_id: 3,
          publisher_id: 2,
          published_date: "2019-06-20",
          cover_image: "/images/book3.jpg",
          slug: "thanh-guom-diet-quy-tap-1",
          author: "Koyoharu Gotouge",
          rating: 4.0
        },
        {
          book_id: 4,
          title: "Conan - Vụ Án Nữ Hoàng 450",
          description: "Vụ án bí ẩn của thám tử Conan Edogawa",
          price: 863000, // $35.95 * 24,000 VND
          stock: 40,
          category_id: 2,
          author_id: 4,
          publisher_id: 2,
          published_date: "2021-03-10",
          cover_image: "/images/book4.jpg",
          slug: "conan-vu-an-nu-hoang-450",
          author: "Gosho Aoyama",
          rating: 5.0
        },
        {
          book_id: 5,
          title: "Harry Potter và Hòn Đá Phù Thủy",
          description: "Tập 1 của bộ Harry Potter - cuộc phiêu lưu của cậu bé phù thủy",
          price: 200000,
          stock: 35,
          category_id: 1,
          author_id: 5,
          publisher_id: 3,
          published_date: "2017-09-01",
          cover_image: "/images/book1.jpg",
          slug: "harry-potter-va-hon-da-phu-thuy",
          author: "J.K. Rowling",
          rating: 4.8
        },
        {
          book_id: 6,
          title: "Đắc Nhân Tâm",
          description: "Cuốn sách kinh điển về nghệ thuật giao tiếp và thu phục lòng người",
          price: 120000,
          stock: 60,
          category_id: 1,
          author_id: 6,
          publisher_id: 4,
          published_date: "2016-01-01",
          cover_image: "/images/book2.jpg",
          slug: "dac-nhan-tam",
          author: "Dale Carnegie",
          rating: 4.5
        },
        {
          book_id: 7,
          title: "One Piece - Tập 1000",
          description: "Cuộc phiêu lưu của Luffy và băng hải tặc Mũ Rơm",
          price: 25000,
          stock: 100,
          category_id: 2,
          author_id: 7,
          publisher_id: 2,
          published_date: "2022-01-01",
          cover_image: "/images/book3.jpg",
          slug: "one-piece-tap-1000",
          author: "Eiichiro Oda",
          rating: 4.9
        },
        {
          book_id: 8,
          title: "Attack on Titan - Tập 34",
          description: "Câu chuyện về cuộc chiến giữa loài người và Titan",
          price: 30000,
          stock: 80,
          category_id: 2,
          author_id: 8,
          publisher_id: 2,
          published_date: "2021-06-09",
          cover_image: "/images/book4.jpg",
          slug: "attack-on-titan-tap-34",
          author: "Hajime Isayama",
          rating: 4.7
        },
        {
          book_id: 9,
          title: "The Great Gatsby",
          description: "Tiểu thuyết kinh điển của F. Scott Fitzgerald về giấc mơ Mỹ",
          price: 150000,
          stock: 45,
          category_id: 1,
          author_id: 9,
          publisher_id: 1,
          published_date: "1925-04-10",
          cover_image: "/images/book1.jpg",
          slug: "the-great-gatsby",
          author: "F. Scott Fitzgerald",
          rating: 4.3
        },
        {
          book_id: 10,
          title: "To Kill a Mockingbird",
          description: "Cuốn tiểu thuyết về công lý và phân biệt chủng tộc ở miền Nam nước Mỹ",
          price: 160000,
          stock: 55,
          category_id: 1,
          author_id: 10,
          publisher_id: 1,
          published_date: "1960-07-11",
          cover_image: "/images/book2.jpg",
          slug: "to-kill-a-mockingbird",
          author: "Harper Lee",
          rating: 4.6
        },
        {
          book_id: 11,
          title: "Naruto - Tập 72",
          description: "Câu chuyện về ninja trẻ Naruto và hành trình trở thành Hokage",
          price: 28000,
          stock: 90,
          category_id: 2,
          author_id: 11,
          publisher_id: 2,
          published_date: "2014-11-04",
          cover_image: "/images/book3.jpg",
          slug: "naruto-tap-72",
          author: "Masashi Kishimoto",
          rating: 4.8
        },
        {
          book_id: 12,
          title: "Dragon Ball Super - Tập 20",
          description: "Cuộc phiêu lưu mới của Goku và các chiến binh Z",
          price: 32000,
          stock: 75,
          category_id: 2,
          author_id: 12,
          publisher_id: 2,
          published_date: "2023-03-02",
          cover_image: "/images/book4.jpg",
          slug: "dragon-ball-super-tap-20",
          author: "Akira Toriyama",
          rating: 4.4
        }
      ];

      setBooks(mockBooks);
      // Sách mới: 4 cuốn mới nhất theo ngày xuất bản
      setNewBooks(mockBooks.sort((a, b) => new Date(b.published_date) - new Date(a.published_date)).slice(0, 4));
      // Sách phổ biến: 4 cuốn có stock thấp nhất (bán nhiều)
      setPopularBooks(mockBooks.sort((a, b) => a.stock - b.stock).slice(0, 4));

      setLoading(false);
    };

    fetchBooks();
  }, []);

  // Ghi nhớ các event handlers
  const handleBookClick = useCallback((bookId) => {
    // Chuyển đến trang chi tiết sản phẩm khi click vào sách
    onNavigateTo('product')();
    // Truyền bookId đến trang chi tiết sản phẩm qua URL
    window.history.pushState({}, '', `/product?id=${bookId}`);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }, [onNavigateTo]);

  // Xử lý thêm vào giỏ hàng - chỉ sử dụng localStorage
  const handleAddToCart = useCallback((book, e) => {
    e.stopPropagation();

    // Kiểm tra còn hàng không
    if (book.stock <= 0) {
      if (window.showToast) {
        window.showToast('Sản phẩm đã hết hàng!', 'warning');
      } else {
        alert('Sản phẩm đã hết hàng!');
      }
      return;
    }

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item.book_id === book.book_id);

    if (existingItem) {
      // Kiểm tra số lượng trong giỏ có vượt quá stock không
      if (existingItem.quantity >= book.stock) {
        if (window.showToast) {
          window.showToast(`Chỉ còn ${book.stock} sản phẩm trong kho!`, 'warning');
        } else {
          alert(`Chỉ còn ${book.stock} sản phẩm trong kho!`);
        }
        return;
      }
      existingItem.quantity += 1;

      // Hiển thị thông báo thành công
      if (window.showToast) {
        window.showToast(`Đã tăng số lượng "${book.title}" trong giỏ hàng!`, 'success');
      }
    } else {
      cart.push({
        book_id: book.book_id,
        title: book.title,
        author: book.author || 'Unknown Author',
        price: book.price,
        cover_image: book.cover_image,
        quantity: 1,
        added_at: new Date().toISOString()
      });

      // Hiển thị thông báo thành công
      if (window.showToast) {
        window.showToast(`✅ Thêm thành công! Đã thêm "${book.title}" vào giỏ hàng!`, 'success');
      }
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent('cartUpdated', {
      detail: { cart, action: 'add', bookId: book.book_id }
    }));
  }, []);


  return (
    <main className="flex-grow-1">
      {/* Danh Mục Nổi Bật Section */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="row align-items-center mb-4">
            <div className="col">
              <h2 className="fw-bold text-dark">Danh Mục Sản Phẩm</h2>
            </div>
            <div className="col-auto">
              <a href="#" className="text-decoration-none" style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#333',
                transition: 'all 0.3s ease'
              }}
                onClick={(e) => {
                  e.preventDefault();
                  window.history.pushState({}, '', '/categories');
                  window.dispatchEvent(new PopStateEvent('popstate'));
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = '#007bff';
                  e.target.style.transform = 'translateX(5px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = '#333';
                  e.target.style.transform = 'translateX(0)';
                }}>
                Xem Tất Cả <i className="bi bi-arrow-right ms-1"></i>
              </a>
            </div>
          </div>

          <div className="row g-4">
            {[
              {
                category_id: 1,
                name: "Sách Theo Tác Giả",
                book_count: 15,
                image: "https://cafefcdn.com/203337114487263232/2023/2/3/photo-4-1675433065659292646649.jpg",
                description: "Danh mục sách theo tác giả"
              },
              {
                category_id: 2,
                name: "Truyện Tranh",
                book_count: 25,
                image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop",
                description: "Truyện Manga, comic"
              },
              {
                category_id: 3,
                name: "Tiểu Thuyết",
                book_count: 10,
                image: "https://upload.wikimedia.org/wikipedia/vi/2/22/B%C3%ACa_ti%E1%BB%83u_thuy%E1%BA%BFt_C%C3%B4_th%C3%A0nh_trong_g%C6%B0%C6%A1ng.jpg",
                description: "Tiểu thuyết các thể loại"
              },
              {
                category_id: 4,
                name: "Đồ Chơi",
                book_count: 20,
                image: "https://product.hstatic.net/1000237375/product/dk81020_-_1_b4b0a4cc00da4d52814c03722f2be17d.jpg",
                description: "Đồ chơi trẻ em"
              }
            ].map((category, index) => (
              <div key={index} className="col-lg-3 col-md-6">
                <div className="card h-100 border-0 shadow-sm" style={{
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  borderRadius: '12px',
                  overflow: 'hidden'
                }}
                  onClick={() => {
                    // Chuyển đến trang categories với filter theo danh mục
                    window.history.pushState({}, '', `/categories?category=${encodeURIComponent(category.name)}`);
                    window.dispatchEvent(new PopStateEvent('popstate'));
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                  }}>
                  <div className="position-relative">
                    <img
                      src={category.image}
                      className="card-img-top"
                      alt={category.name}
                      style={{
                        height: '200px',
                        objectFit: 'cover',
                        width: '100%'
                      }}
                    />
                    <div className="position-absolute top-0 end-0 m-3">
                      <span className="badge bg-primary px-3 py-2" style={{ fontSize: '0.8rem' }}>
                        {category.book_count} books
                      </span>
                    </div>
                  </div>

                  <div className="card-body p-4 text-center">
                    <h5 className="card-title fw-bold mb-2" style={{ fontSize: '1.2rem' }}>
                      {category.name}
                    </h5>
                    <p className="card-text text-muted mb-3" style={{ fontSize: '0.9rem' }}>
                      {category.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sách Nổi Bật Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row align-items-center mb-4">
            <div className="col">
              <h2 className="fw-bold text-dark">Sách Nổi Bật</h2>
            </div>
            <div className="col-auto">
              <a href="#" className="text-decoration-none" style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#333',
                transition: 'all 0.3s ease'
              }}
                onMouseEnter={(e) => {
                  e.target.style.color = '#007bff';
                  e.target.style.transform = 'translateX(5px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = '#333';
                  e.target.style.transform = 'translateX(0)';
                }}>
                Xem Tất Cả <i className="bi bi-arrow-right ms-1"></i>
              </a>
            </div>
          </div>

          <div className="row g-4">
            {loading ? (
              <div className="col-12 text-center py-5">
                <div className="spinner-border text-dark" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Đang tải dữ liệu...</p>
              </div>
            ) : error ? (
              <div className="col-12 text-center py-5">
                <div className="alert alert-warning" role="alert">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {error}
                </div>
              </div>
            ) : books.slice(0, 4).map((book, index) => (
              <div key={index} className="col-lg-3 col-md-6">
                <div className="card h-100 border-0 shadow-sm" style={{
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  borderRadius: '12px',
                  overflow: 'hidden'
                }}
                  onClick={() => handleBookClick(book.book_id)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.15)';
                    // Hiển thị nút thêm vào giỏ hàng nếu còn hàng
                    const addToCartBtn = e.currentTarget.querySelector('.add-to-cart-btn');
                    if (addToCartBtn && book.stock > 0) {
                      addToCartBtn.style.opacity = '1';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                    // Ẩn nút thêm vào giỏ hàng
                    const addToCartBtn = e.currentTarget.querySelector('.add-to-cart-btn');
                    if (addToCartBtn) {
                      addToCartBtn.style.opacity = '0';
                    }
                  }}>
                  <div className="position-relative">
                    <img
                      src={book.cover_image || '/images/book1.jpg'}
                      className="card-img-top"
                      alt={book.title}
                      style={{
                        height: '280px',
                        objectFit: 'contain',
                        width: '100%',
                        backgroundColor: '#f8f9fa',
                        padding: '10px'
                      }}
                    />
                    {/* Nút Thêm Vào Giỏ Hàng - xuất hiện khi hover và còn hàng */}
                    {book.stock > 0 && (
                      <div
                        className="position-absolute top-0 end-0 p-2 add-to-cart-btn"
                        style={{
                          opacity: 0,
                          transition: 'opacity 0.3s ease'
                        }}
                      >
                        <button
                          className="btn btn-sm btn-light rounded-circle"
                          style={{
                            width: '40px',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          onClick={(e) => handleAddToCart(book, e)}
                        >
                          <i className="bi bi-cart-plus"></i>
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="card-body p-3 d-flex flex-column">
                    <h6 className="card-title fw-bold mb-2" style={{
                      fontSize: '1rem',
                      lineHeight: '1.3',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      minHeight: '2.6rem'
                    }}>
                      {book.title}
                    </h6>
                    <p className="card-text text-muted small mb-2" style={{ fontSize: '0.85rem' }}>
                      {book.author || 'Tác giả chưa xác định'}
                    </p>

                    {/* Rating */}
                    <div className="mb-2">
                      <div className="d-flex align-items-center">
                        {[...Array(5)].map((_, i) => (
                          <i
                            key={i}
                            className={`bi bi-star${i < Math.floor(book.rating || 0) ? '-fill' : ''} text-warning`}
                            style={{ fontSize: '12px' }}
                          ></i>
                        ))}
                        <span className="text-muted small ms-1" style={{ fontSize: '11px' }}>
                          {book.rating ? book.rating.toFixed(1) : '0.0'} (1)
                        </span>
                      </div>
                    </div>

                    <div className="mt-auto">
                      <p className="card-text fw-bold text-dark mb-0" style={{ fontSize: '1.1rem' }}>
                        {(book.price || 0).toLocaleString('vi-VN')} VNĐ
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sách Mới Section */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="row align-items-center mb-4">
            <div className="col">
              <h2 className="fw-bold text-dark">Sách Mới</h2>
            </div>
            <div className="col-auto">
              <a href="#" className="text-decoration-none" style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#333',
                transition: 'all 0.3s ease'
              }}
                onMouseEnter={(e) => {
                  e.target.style.color = '#007bff';
                  e.target.style.transform = 'translateX(5px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = '#333';
                  e.target.style.transform = 'translateX(0)';
                }}>
                Xem Tất Cả <i className="bi bi-arrow-right ms-1"></i>
              </a>
            </div>
          </div>

          <div className="row g-4">
            {loading ? (
              <div className="col-12 text-center py-5">
                <div className="spinner-border text-dark" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Đang tải dữ liệu...</p>
              </div>
            ) : error ? (
              <div className="col-12 text-center py-5">
                <div className="alert alert-warning" role="alert">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {error}
                </div>
              </div>
            ) : newBooks.map((book, index) => (
              <div key={index} className="col-lg-3 col-md-6">
                <div className="card h-100 border-0 shadow-sm" style={{
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  borderRadius: '12px',
                  overflow: 'hidden'
                }}
                  onClick={() => handleBookClick(book.book_id)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.15)';
                    // Hiển thị nút thêm vào giỏ hàng nếu còn hàng
                    const addToCartBtn = e.currentTarget.querySelector('.add-to-cart-btn');
                    if (addToCartBtn && book.stock > 0) {
                      addToCartBtn.style.opacity = '1';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                    // Ẩn nút thêm vào giỏ hàng
                    const addToCartBtn = e.currentTarget.querySelector('.add-to-cart-btn');
                    if (addToCartBtn) {
                      addToCartBtn.style.opacity = '0';
                    }
                  }}>
                  <div className="position-relative">
                    <img
                      src={book.cover_image || '/images/book1.jpg'}
                      className="card-img-top"
                      alt={book.title}
                      style={{
                        height: '280px',
                        objectFit: 'contain',
                        width: '100%',
                        backgroundColor: '#f8f9fa',
                        padding: '10px'
                      }}
                    />
                    {/* Nút Thêm Vào Giỏ Hàng - xuất hiện khi hover và còn hàng */}
                    {book.stock > 0 && (
                      <div
                        className="position-absolute top-0 end-0 p-2 add-to-cart-btn"
                        style={{
                          opacity: 0,
                          transition: 'opacity 0.3s ease'
                        }}
                      >
                        <button
                          className="btn btn-sm btn-light rounded-circle"
                          style={{
                            width: '40px',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          onClick={(e) => handleAddToCart(book, e)}
                        >
                          <i className="bi bi-cart-plus"></i>
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="card-body p-3 d-flex flex-column">
                    <h6 className="card-title fw-bold mb-2" style={{
                      fontSize: '1rem',
                      lineHeight: '1.3',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      minHeight: '2.6rem'
                    }}>
                      {book.title}
                    </h6>
                    <p className="card-text text-muted small mb-2" style={{ fontSize: '0.85rem' }}>
                      {book.author || 'Tác giả chưa xác định'}
                    </p>

                    {/* Rating */}
                    <div className="mb-2">
                      <div className="d-flex align-items-center">
                        {[...Array(5)].map((_, i) => (
                          <i
                            key={i}
                            className={`bi bi-star${i < Math.floor(book.rating || 0) ? '-fill' : ''} text-warning`}
                            style={{ fontSize: '12px' }}
                          ></i>
                        ))}
                        <span className="text-muted small ms-1" style={{ fontSize: '11px' }}>
                          {book.rating ? book.rating.toFixed(1) : '0.0'} (1)
                        </span>
                      </div>
                    </div>

                    <div className="mt-auto">
                      <p className="card-text fw-bold text-dark mb-0" style={{ fontSize: '1.1rem' }}>
                        {(book.price || 0).toLocaleString('vi-VN')} VNĐ
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sách Phổ Biến Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row align-items-center mb-4">
            <div className="col">
              <h2 className="fw-bold text-dark">Sách Phổ Biến</h2>
            </div>
            <div className="col-auto">
              <a href="#" className="text-decoration-none" style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#333',
                transition: 'all 0.3s ease'
              }}
                onMouseEnter={(e) => {
                  e.target.style.color = '#007bff';
                  e.target.style.transform = 'translateX(5px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = '#333';
                  e.target.style.transform = 'translateX(0)';
                }}>
                Xem Tất Cả <i className="bi bi-arrow-right ms-1"></i>
              </a>
            </div>
          </div>

          <div className="row g-4">
            {loading ? (
              <div className="col-12 text-center py-5">
                <div className="spinner-border text-dark" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Đang tải dữ liệu...</p>
              </div>
            ) : error ? (
              <div className="col-12 text-center py-5">
                <div className="alert alert-warning" role="alert">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {error}
                </div>
              </div>
            ) : popularBooks.map((book, index) => (
              <div key={index} className="col-lg-3 col-md-6">
                <div className="card h-100 border-0 shadow-sm" style={{
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  borderRadius: '12px',
                  overflow: 'hidden'
                }}
                  onClick={() => handleBookClick(book.book_id)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.15)';
                    // Hiển thị nút thêm vào giỏ hàng nếu còn hàng
                    const addToCartBtn = e.currentTarget.querySelector('.add-to-cart-btn');
                    if (addToCartBtn && book.stock > 0) {
                      addToCartBtn.style.opacity = '1';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                    // Ẩn nút thêm vào giỏ hàng
                    const addToCartBtn = e.currentTarget.querySelector('.add-to-cart-btn');
                    if (addToCartBtn) {
                      addToCartBtn.style.opacity = '0';
                    }
                  }}>
                  <div className="position-relative">
                    <img
                      src={book.cover_image || '/images/book1.jpg'}
                      className="card-img-top"
                      alt={book.title}
                      style={{
                        height: '280px',
                        objectFit: 'contain',
                        width: '100%',
                        backgroundColor: '#f8f9fa',
                        padding: '10px'
                      }}
                    />
                    {/* Nút Thêm Vào Giỏ Hàng - xuất hiện khi hover và còn hàng */}
                    {book.stock > 0 && (
                      <div
                        className="position-absolute top-0 end-0 p-2 add-to-cart-btn"
                        style={{
                          opacity: 0,
                          transition: 'opacity 0.3s ease'
                        }}
                      >
                        <button
                          className="btn btn-sm btn-light rounded-circle"
                          style={{
                            width: '40px',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          onClick={(e) => handleAddToCart(book, e)}
                        >
                          <i className="bi bi-cart-plus"></i>
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="card-body p-3 d-flex flex-column">
                    <h6 className="card-title fw-bold mb-2" style={{
                      fontSize: '1rem',
                      lineHeight: '1.3',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      minHeight: '2.6rem'
                    }}>
                      {book.title}
                    </h6>
                    <p className="card-text text-muted small mb-2" style={{ fontSize: '0.85rem' }}>
                      {book.author || 'Tác giả chưa xác định'}
                    </p>

                    {/* Rating */}
                    <div className="mb-2">
                      <div className="d-flex align-items-center">
                        {[...Array(5)].map((_, i) => (
                          <i
                            key={i}
                            className={`bi bi-star${i < Math.floor(book.rating || 0) ? '-fill' : ''} text-warning`}
                            style={{ fontSize: '12px' }}
                          ></i>
                        ))}
                        <span className="text-muted small ms-1" style={{ fontSize: '11px' }}>
                          {book.rating ? book.rating.toFixed(1) : '0.0'} (1)
                        </span>
                      </div>
                    </div>

                    <div className="mt-auto">
                      <p className="card-text fw-bold text-dark mb-0" style={{ fontSize: '1.1rem' }}>
                        {(book.price || 0).toLocaleString('vi-VN')} VNĐ
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tác Giả Yêu Thích Section */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="row align-items-center mb-4">
            <div className="col">
              <h2 className="fw-bold text-dark">Tác Giả Yêu Thích</h2>
            </div>
            <div className="col-auto">
              <a 
                href="#" 
                className="text-decoration-none" 
                style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#333',
                  transition: 'all 0.3s ease'
                }}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigateTo('author')();
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = '#007bff';
                  e.target.style.transform = 'translateX(5px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = '#333';
                  e.target.style.transform = 'translateX(0)';
                }}
              >
                Xem Tất Cả <i className="bi bi-arrow-right ms-1"></i>
              </a>
            </div>
          </div>

          <div className="row g-4 justify-content-center">
            {[
              { name: "Fujiko Fujio", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face" },
              { name: "Delia Owens", image: "https://photo.znews.vn/w960/Uploaded/sgorvz/2025_05_23/tac_gia_70_tuoi.jpg" },
              { name: "Koyoharu Gotouge", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face" },
              { name: "Gosho Aoyama", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face" },
              { name: "Haruki Murakami", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face" },
              { name: "J.K. Rowling", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face" }
            ].map((author, index) => (
              <div key={index} className="col-lg-2 col-md-3 col-sm-4 col-6">
                <div className="text-center">
                  <img
                    src={author.image}
                    alt={author.name}
                    className="rounded-circle mx-auto mb-3"
                    style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                  />
                  <h6 className="text-dark mb-0">{author.name}</h6>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* From the Blog Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row align-items-center mb-4">
            <div className="col">
              <h2 className="fw-bold text-dark">Bài viết</h2>
            </div>
            <div className="col-auto">
              <button
                className="btn btn-outline-primary"
                onClick={() => {
                  console.log('Blog button clicked');
                  onNavigateTo('blog')();
                }}
              >
                Xem Tất Cả <i className="bi bi-arrow-right ms-1"></i>
              </button>
            </div>
          </div>

          <div className="row g-4">
            {[
              { title: "Fujiko F. Fujio - The Creator of Doraemon", date: "24 Oct, 2019", image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=200&fit=crop" },
              { title: "The Art of Manga Storytelling", date: "15 Nov, 2019", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=200&fit=crop" },
              { title: "Top 10 Must-Read Manga Series", date: "01 Dec, 2019", image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=200&fit=crop" }
            ].map((post, index) => (
              <div key={index} className="col-lg-4 col-md-6">
                <div
                  className="card h-100 shadow-sm"
                  style={{ cursor: 'pointer' }}
                  onClick={() => onNavigateTo('blog-detail')()}
                >
                  <img
                    src={post.image}
                    className="card-img-top"
                    alt={post.title}
                    style={{ height: '200px', objectFit: 'contain', backgroundColor: '#f8f9fa' }}
                  />
                  <div className="card-body">
                    <small className="text-muted">{post.date}</small>
                    <h5 className="card-title mt-2">{post.title}</h5>
                    <p className="card-text text-muted">
                      Discover the life and works of the legendary manga artist who created Doraemon.
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
