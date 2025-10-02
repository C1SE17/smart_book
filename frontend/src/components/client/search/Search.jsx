import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocalStorage } from '../../../hooks';
import { cartService, bookService } from '../../../services';

const Search = ({ onBackToHome, onNavigateTo, initialSearchQuery = '', onSearch }) => {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user] = useLocalStorage('user', null);

  const addToCart = useCallback((book) => {
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

  // Search function - using mock data
  const performSearch = useCallback(async (query) => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Filter mock books by title, description, or author
      const filteredBooks = mockBooks.filter(book => 
        book.title.toLowerCase().includes(query.toLowerCase()) ||
        book.description.toLowerCase().includes(query.toLowerCase()) ||
        (book.author && book.author.toLowerCase().includes(query.toLowerCase()))
      );
      
      setSearchResults(filteredBooks);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Effect to perform search when initialSearchQuery changes
  useEffect(() => {
    if (initialSearchQuery) {
      performSearch(initialSearchQuery);
    }
  }, [initialSearchQuery, performSearch]);

  // Mock data for search results - memoized to avoid recreation
  const mockBooks = useMemo(() => [
    {
      book_id: 1,
      title: "WHERE THE CRAWDADS SING",
      description: "A mystery novel about a girl who grows up alone in the marshes of North Carolina.",
      price: 105000,
      stock: 10,
      category_id: 1,
      author_id: 1,
      author: "Delia Owens",
      publisher_id: 1,
      published_date: "2020-01-01",
      cover_image: "/images/book1.jpg",
      slug: "where-the-crawdads-sing"
    },
    {
      book_id: 2,
      title: "Doraemon: Nobita và Cuộc Chiến Vũ Trụ",
      description: "Cuộc phiêu lưu của Nobita và Doraemon trong không gian",
      price: 248000,
      stock: 15,
      category_id: 2,
      author_id: 2,
      author: "Fujiko Fujio",
      publisher_id: 2,
      published_date: "2020-01-01",
      cover_image: "/images/book2.jpg",
      slug: "doraemon-nobita-little-star-wars"
    },
    {
      book_id: 3,
      title: "Demon Slayer - Vô hạn thành",
      description: "Câu chuyện về chàng trai trẻ trở thành thợ săn quỷ để cứu em gái",
      price: 220000,
      stock: 8,
      category_id: 2,
      author_id: 3,
      author: "Koyoharu Gotouge",
      publisher_id: 2,
      published_date: "2020-01-01",
      cover_image: "/images/book3.jpg",
      slug: "demon-slayer-vo-han-thanh"
    },
    {
      book_id: 4,
      title: "Conan - Vụ Án Nữ Hoàng 450",
      description: "Một vụ án bí ẩn với thám tử nổi tiếng Conan Edogawa",
      price: 180000,
      stock: 12,
      category_id: 3,
      author_id: 4,
      author: "Gosho Aoyama",
      publisher_id: 2,
      published_date: "2020-01-01",
      cover_image: "/images/book4.jpg",
      slug: "conan-vu-an-nu-hoang-450"
    },
    {
      book_id: 5,
      title: "The Great Gatsby",
      description: "Tiểu thuyết kinh điển Mỹ trong thời đại Jazz",
      price: 120000,
      stock: 20,
      category_id: 4,
      author_id: 5,
      author: "F. Scott Fitzgerald",
      publisher_id: 3,
      published_date: "2020-01-01",
      cover_image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=200&fit=crop",
      slug: "the-great-gatsby"
    },
    {
      book_id: 6,
      title: "Harry Potter và Hòn Đá Phù Thủy",
      description: "Cuốn sách đầu tiên trong series phép thuật Harry Potter",
      price: 150000,
      stock: 25,
      category_id: 5,
      author_id: 6,
      author: "J.K. Rowling",
      publisher_id: 3,
      published_date: "2020-01-01",
      cover_image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop",
      slug: "harry-potter-sorcerers-stone"
    },
    {
      book_id: 7,
      title: "Norwegian Wood",
      description: "Tiểu thuyết tình cảm sâu sắc của Haruki Murakami",
      price: 130000,
      stock: 15,
      category_id: 4,
      author_id: 7,
      author: "Haruki Murakami",
      publisher_id: 3,
      published_date: "2020-01-01",
      cover_image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop",
      slug: "norwegian-wood"
    },
    {
      book_id: 8,
      title: "Romance Novel Collection",
      description: "Tuyển tập những tiểu thuyết lãng mạn hay nhất",
      price: 95000,
      stock: 30,
      category_id: 6,
      author_id: 8,
      author: "Various Authors",
      publisher_id: 4,
      published_date: "2020-01-01",
      cover_image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop",
      slug: "romance-novel-collection"
    }
  ], []);

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;

    await performSearch(searchQuery);
  }, [searchQuery, performSearch]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }, [handleSearch]);

  useEffect(() => {
    if (searchQuery.trim()) {
      handleSearch();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, handleSearch]);

  return (
    <div className="min-vh-100" style={{ backgroundColor: '#f5f5f5' }}>
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-md-10">
            <div className="card shadow-sm border-0" style={{
              transition: 'none',
              transform: 'none',
              cursor: 'default'
            }}>
              <div className="card-body p-4">
                {/* Header with Back Home and Search Books Title */}
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <div className="d-flex align-items-center">
                    <button
                      className="btn btn-link text-dark p-0 me-3"
                      onClick={onBackToHome}
                      style={{
                        border: 'none',
                        background: 'none',
                        fontSize: '16px',
                        textDecoration: 'none',
                        boxShadow: 'none'
                      }}
                    >
                      <i className="fas fa-arrow-left me-2"></i>
                      Trang Chủ/
                      <span className="fw-bold ms-1" style={{ fontSize: '16px' }}> Tìm Kiếm</span>
                    </button>
                  </div>
                  <div className="d-flex align-items-center">
                    <span className="text-muted">
                      Tìm thấy {searchResults.length} kết quả
                    </span>
                  </div>
                </div>

                {/* Search Bar */}
                <div className="mb-4">
                  <div className="position-relative">
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      placeholder="Tìm kiếm sách, tác giả hoặc từ khóa..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={handleKeyPress}
                      style={{
                        backgroundColor: '#f8f9fa',
                        border: '1px solid #e9ecef',
                        borderRadius: '8px',
                        padding: '12px 50px 12px 16px'
                      }}
                    />
                    <button
                      className="btn btn-primary position-absolute end-0 top-50 translate-middle-y me-2"
                      onClick={handleSearch}
                      disabled={loading}
                      style={{
                        borderRadius: '6px',
                        padding: '8px 12px',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {loading ? (
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      ) : (
                        <i className="bi bi-search"></i>
                      )}
                    </button>
                  </div>
                </div>

                {/* Popular Searches */}
                {!searchQuery && (
                  <div>
                    <h5 className="fw-bold mb-3">Tìm kiếm phổ biến</h5>
                    <div className="d-flex flex-wrap gap-2">
                      {['Doraemon', 'Harry Potter', 'The Great Gatsby', 'Demon Slayer', 'Conan', 'Romance', 'Murakami', 'Fujiko'].map((term) => (
                        <button
                          key={term}
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => setSearchQuery(term)}
                          style={{
                            borderRadius: '20px',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Search Results */}
        {searchQuery && (
          <div className="row mt-5">
            <div className="col-12">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Searching...</span>
                  </div>
                  <p className="mt-3 text-muted">Đang tìm kiếm sách...</p>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="row g-4">
                  {searchResults.map((book) => (
                    <div key={book.book_id} className="col-lg-3 col-md-4 col-sm-6">
                      <div className="card h-100 shadow-sm" style={{
                        transition: 'all 0.3s ease',
                        cursor: 'pointer'
                      }}
                        onClick={() => console.log('Book clicked:', book.book_id)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-5px)';
                          e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                        }}>
                        <img
                          src={book.cover_image}
                          className="card-img-top"
                          alt={book.title}
                          style={{ height: '250px', objectFit: 'contain', backgroundColor: '#f8f9fa' }}
                        />
                        <div className="card-body d-flex flex-column">
                          <h6 className="card-title fw-bold text-dark mb-1" style={{ fontSize: '14px', lineHeight: '1.3' }}>
                            {book.title}
                          </h6>
                          
                          {book.author && (
                            <p className="card-text text-muted small mb-2" style={{ fontSize: '12px' }}>
                              <i className="fas fa-user me-1"></i>
                              {book.author}
                            </p>
                          )}

                          <p className="card-text text-muted small mb-2 flex-grow-1" style={{ fontSize: '11px', lineHeight: '1.4' }}>
                            {book.description.length > 80 ? book.description.substring(0, 80) + '...' : book.description}
                          </p>

                          <div className="d-flex justify-content-between align-items-center mt-auto mb-2">
                            <span className="fw-bold text-dark" style={{ fontSize: '14px' }}>
                              {(book.price || 0).toLocaleString('vi-VN')} VNĐ
                            </span>
                            <span className="badge bg-light text-dark" style={{ fontSize: '10px' }}>
                              Còn {book.stock}
                            </span>
                          </div>

                          <button
                            className="btn btn-dark btn-sm"
                            style={{
                              transition: 'all 0.3s ease',
                              fontSize: '12px',
                              padding: '6px 12px'
                            }}
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent card click when clicking button
                              addToCart(book);
                            }}
                          >
                            <i className="fas fa-cart-plus me-1"></i>
                            Thêm vào giỏ
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-5">
                  <i className="bi bi-search display-1 text-muted mb-3"></i>
                  <h5 className="text-muted">Không tìm thấy sách nào</h5>
                  <p className="text-muted">Hãy thử điều chỉnh từ khóa tìm kiếm</p>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Search;
