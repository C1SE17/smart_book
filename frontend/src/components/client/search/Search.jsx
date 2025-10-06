import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes, faStar, faShoppingCart, faHeart } from '@fortawesome/free-solid-svg-icons';

const Search = ({ onBackToHome, onNavigateTo, initialSearchQuery = '', onSearch }) => {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [popularKeywords, setPopularKeywords] = useState([]);

  // Perform search function
  const performSearch = useCallback(async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    setSearchLoading(true);
    setHasSearched(true);

    try {
      // Import mock API
      // TODO: Implement real search API
      // const { bookApi } = await import('../../../services/bookApi');
      // const response = await bookApi.getBooks({ 
      //   search: query.trim(),
      //   limit: 20 
      // });

      // Mock data for now
      const response = { success: true, data: [] };

      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching books:', error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  // Get search suggestions
  const getSuggestions = useCallback(async (query) => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      // TODO: Implement real search suggestions API
      // const { searchApi } = await import('../../../services/searchApi');
      // const suggestions = await searchApi.getSearchSuggestions(query);
      const suggestions = [];
      setSuggestions(suggestions);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error getting suggestions:', error);
      setSuggestions([]);
    }
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Get suggestions as user types (but don't search yet)
    getSuggestions(value);

    // Don't call parent search function here - only show suggestions
  };

  // Handle search form submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    if (searchQuery.trim()) {
      performSearch(searchQuery);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.title);
    setShowSuggestions(false);
    // Only search if there's a query
    if (suggestion.title.trim()) {
      performSearch(suggestion.title);
    }
  };

  // Handle popular keyword click
  const handlePopularKeywordClick = (keyword) => {
    setSearchQuery(keyword);
    setShowSuggestions(false);
    performSearch(keyword);
  };

  // Handle book click
  const handleBookClick = (bookId) => {
    if (onNavigateTo) {
      onNavigateTo('product', { productId: bookId });
    }
  };

  // Handle add to cart
  const handleAddToCart = async (book, e) => {
    e.stopPropagation();

    try {
      // TODO: Implement real cart API
      // const { cartApi } = await import('../../../services/cartApi');
      const user = JSON.parse(localStorage.getItem('user'));

      if (!user) {
        alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!');
        return;
      }

      // await cartApi.addToCart(user.user_id, book.book_id, 1);

      // Dispatch cart updated event
      window.dispatchEvent(new CustomEvent('cartUpdated'));

      alert('Đã thêm sản phẩm vào giỏ hàng!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng!');
    }
  };

  // Handle add to wishlist
  const handleAddToWishlist = (e, bookId) => {
    e.stopPropagation();
    // TODO: Implement wishlist functionality
    alert('Tính năng yêu thích sẽ được thêm sớm!');
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  // Render stars
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <FontAwesomeIcon key={i} icon={faStar} className="text-warning" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <FontAwesomeIcon key="half" icon={faStar} className="text-warning" style={{ opacity: 0.5 }} />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <FontAwesomeIcon key={`empty-${i}`} icon={faStar} className="text-muted" />
      );
    }

    return stars;
  };

  // Load popular keywords on mount
  useEffect(() => {
    const loadPopularKeywords = async () => {
      try {
        // TODO: Implement real popular keywords API
        // const { searchApi } = await import('../../../services/searchApi');
        // const keywords = await searchApi.getPopularKeywords();
        const keywords = [];
        setPopularKeywords(keywords);
      } catch (error) {
        console.error('Error loading popular keywords:', error);
      }
    };

    loadPopularKeywords();
  }, []);

  // Auto search on mount if initial query provided
  useEffect(() => {
    if (initialSearchQuery) {
      performSearch(initialSearchQuery);
    } else {
      // Reset search results when component mounts without initial query
      setSearchResults([]);
      setHasSearched(false);
      setSearchQuery('');
    }
  }, [initialSearchQuery, performSearch]);

  // Reset search when component mounts (for back navigation)
  useEffect(() => {
    // If no initial search query, reset everything
    if (!initialSearchQuery) {
      setSearchResults([]);
      setHasSearched(false);
      setSearchQuery('');
    }
  }, []);

  return (
    <div className="container py-4" style={{ maxWidth: '1200px' }}>
      <div className="row justify-content-center">
        <div className="col-12">
          {/* Search Header */}
          <div className="d-flex align-items-center mb-4">
            <button
              className="btn btn-outline-secondary me-3"
              onClick={onBackToHome}
            >
              <FontAwesomeIcon icon={faTimes} className="me-2" />
              Quay lại
            </button>
            <h2 className="mb-0">Tìm kiếm sách</h2>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="mb-4">
            <div className="position-relative">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="Nhập tên sách, tác giả, danh mục hoặc từ khóa..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => {
                    if (suggestions.length > 0) {
                      setShowSuggestions(true);
                    }
                  }}
                  onBlur={() => {
                    // Delay hiding suggestions to allow clicking
                    setTimeout(() => setShowSuggestions(false), 300);
                  }}
                  onKeyDown={(e) => {
                    // Hide suggestions when pressing Escape
                    if (e.key === 'Escape') {
                      setShowSuggestions(false);
                    }
                    // Hide suggestions when pressing Enter (search will be triggered by form submit)
                    if (e.key === 'Enter') {
                      setShowSuggestions(false);
                    }
                  }}
                />
                <button className="btn btn-primary btn-lg" type="submit">
                  <FontAwesomeIcon icon={faSearch} className="me-2" />
                  Tìm kiếm
                </button>
              </div>

              {/* Search Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="position-absolute w-100 bg-white border rounded shadow-lg" style={{ zIndex: 1000, top: '100%' }}>
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={`${suggestion.type}-${suggestion.id}`}
                      className="p-3 border-bottom cursor-pointer hover-bg-light"
                      style={{ cursor: 'pointer' }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleSuggestionClick(suggestion);
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#f8f9fa';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'white';
                      }}
                    >
                      <div className="d-flex align-items-center">
                        <div className="me-3">
                          <FontAwesomeIcon icon={faSearch} className="text-primary" />
                        </div>
                        <div className="flex-grow-1">
                          <div className="fw-bold">{suggestion.title}</div>
                          <small className="text-muted">{suggestion.subtitle}</small>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </form>

          {/* Popular Keywords - Show when no search has been made */}
          {!hasSearched && popularKeywords.length > 0 && (
            <div className="popular-keywords mb-4">
              <h6 className="text-muted mb-3">Từ khóa phổ biến:</h6>
              <div className="d-flex flex-wrap gap-2">
                {popularKeywords.map((keyword, index) => (
                  <button
                    key={index}
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => handlePopularKeywordClick(keyword)}
                    style={{
                      borderRadius: '20px',
                      padding: '6px 16px',
                      fontSize: '0.9rem',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#007bff';
                      e.target.style.borderColor = '#007bff';
                      e.target.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.borderColor = '#6c757d';
                      e.target.style.color = '#6c757d';
                    }}
                  >
                    {keyword}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Results - Only show when actually searched */}
          {hasSearched && searchQuery.trim() && (
            <div className="search-results">
              {searchLoading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Đang tìm kiếm...</span>
                  </div>
                  <p className="mt-3">Đang tìm kiếm sách...</p>
                </div>
              ) : searchResults.length > 0 ? (
                <>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4>Kết quả tìm kiếm cho "{searchQuery}" ({searchResults.length} sách)</h4>
                  </div>

                  <div className="row">
                    {searchResults.map((book) => (
                      <div key={book.book_id} className="col-lg-3 col-md-6 mb-4">
                        <div
                          className="card h-100 border-0 shadow-sm"
                          style={{
                            transition: 'all 0.3s ease',
                            cursor: 'pointer',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            height: '350px',
                            backgroundColor: 'white'
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
                          }}
                        >
                          <div className="position-relative">
                            <img
                              src={book.cover_image || '/images/book1.jpg'}
                              className="card-img-top"
                              alt={book.title}
                              style={{
                                height: '220px',
                                objectFit: 'contain',
                                width: '100%',
                                backgroundColor: '#f8f9fa'
                              }}
                              onError={(e) => {
                                e.target.src = '/images/book1.jpg';
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
                                  <FontAwesomeIcon icon={faShoppingCart} />
                                </button>
                              </div>
                            )}
                            <div className="position-absolute top-0 start-0 p-2">
                              <button
                                className="btn btn-sm btn-light rounded-circle"
                                onClick={(e) => handleAddToWishlist(e, book.book_id)}
                                title="Thêm vào yêu thích"
                              >
                                <FontAwesomeIcon icon={faHeart} />
                              </button>
                            </div>
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
                            <p className="card-text text-muted mb-2" style={{ fontSize: '0.9rem' }}>
                              {book.author}
                            </p>
                            <div className="d-flex align-items-center mb-2">
                              <div className="me-2">
                                {renderStars(book.rating || 0)}
                              </div>
                              <small className="text-muted">({book.reviewCount || 0})</small>
                            </div>
                            <div className="mt-auto">
                              <p className="card-text fw-bold text-dark mb-2" style={{ fontSize: '1.1rem' }}>
                                {formatPrice(book.price)}
                              </p>
                              <button
                                className="btn btn-outline-primary btn-sm w-100"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleBookClick(book.book_id);
                                }}
                              >
                                Xem chi tiết
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-5">
                  <FontAwesomeIcon icon={faSearch} size="3x" className="text-muted mb-3" />
                  <h4>Không tìm thấy sách nào</h4>
                  <p className="text-muted">
                    Không có kết quả nào cho từ khóa "{searchQuery}".
                    Hãy thử với từ khóa khác.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* No search performed yet - Show when no search has been made */}
          {!hasSearched && (
            <div className="text-center py-5">
              <FontAwesomeIcon icon={faSearch} size="3x" className="text-muted mb-3" />
              <h4>Tìm kiếm sách yêu thích</h4>
              <p className="text-muted">
                Nhập tên sách, tác giả, danh mục hoặc từ khóa để bắt đầu tìm kiếm
              </p>
              <p className="text-muted small">
                💡 Gợi ý: Gõ tên sách đầy đủ hoặc chọn từ gợi ý để tìm kiếm chính xác
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;