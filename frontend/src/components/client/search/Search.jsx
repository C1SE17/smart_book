import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes, faStar, faShoppingCart, faHeart } from '@fortawesome/free-solid-svg-icons';

const Search = ({ onBackToHome, onNavigateTo, initialSearchQuery = '', onSearch }) => {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

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
      const { mockApi } = await import('../../../services/mockApi');
      
      // Search books
      const response = await mockApi.getBooks({ 
        search: query.trim(),
        limit: 20 
      });
      
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching books:', error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Call parent search function if provided
    if (onSearch) {
      onSearch(value);
    }
  };

  // Handle search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    performSearch(searchQuery);
  };

  // Handle clear search
  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setHasSearched(false);
    if (onSearch) {
      onSearch('');
    }
  };

  // Handle book click
  const handleBookClick = (bookId) => {
    onNavigateTo('product')();
    // You can also pass the bookId to the product page
    window.history.pushState({}, '', `/product?id=${bookId}`);
  };

  // Handle add to cart
  const handleAddToCart = (e, bookId) => {
    e.stopPropagation();
    // TODO: Implement add to cart functionality
    console.log('Add to cart:', bookId);
  };

  // Handle add to wishlist
  const handleAddToWishlist = (e, bookId) => {
    e.stopPropagation();
    // TODO: Implement add to wishlist functionality
    console.log('Add to wishlist:', bookId);
  };

  // Perform initial search if there's an initial query
  useEffect(() => {
    if (initialSearchQuery) {
      performSearch(initialSearchQuery);
    }
  }, [initialSearchQuery, performSearch]);

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  // Render star rating
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

  return (
    <div className="container-fluid py-4">
      <div className="row">
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
            <div className="input-group">
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="Nhập tên sách, tác giả hoặc từ khóa..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <button 
                className="btn btn-primary btn-lg" 
                type="submit"
                disabled={searchLoading}
              >
                <FontAwesomeIcon icon={faSearch} className="me-2" />
                {searchLoading ? 'Đang tìm...' : 'Tìm kiếm'}
              </button>
              {searchQuery && (
                <button 
                  className="btn btn-outline-secondary btn-lg" 
                  type="button"
                  onClick={handleClearSearch}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              )}
            </div>
          </form>

          {/* Search Results */}
          {hasSearched && (
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
                    <h4>Kết quả tìm kiếm ({searchResults.length} sách)</h4>
                  </div>
                  
                  <div className="row">
                    {searchResults.map((book) => (
                      <div key={book.book_id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
                        <div 
                          className="card h-100 shadow-sm book-card"
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleBookClick(book.book_id)}
                        >
                          <div className="position-relative">
                            <img
                              src={book.cover_image}
                              className="card-img-top"
                              alt={book.title}
                              style={{ height: '250px', objectFit: 'cover' }}
                              onError={(e) => {
                                e.target.src = '/images/book1.jpg';
                              }}
                            />
                            <div className="position-absolute top-0 end-0 p-2">
                              <button
                                className="btn btn-sm btn-light rounded-circle"
                                onClick={(e) => handleAddToWishlist(e, book.book_id)}
                                title="Thêm vào yêu thích"
                              >
                                <FontAwesomeIcon icon={faHeart} />
                              </button>
                            </div>
                          </div>
                          
                          <div className="card-body d-flex flex-column">
                            <h6 className="card-title text-truncate" title={book.title}>
                              {book.title}
                            </h6>
                            
                            <p className="text-muted small mb-2">
                              Tác giả: {book.author}
                            </p>
                            
                            <div className="d-flex align-items-center mb-2">
                              <div className="me-2">
                                {renderStars(book.rating || 0)}
                              </div>
                              <small className="text-muted">
                                ({book.reviewCount || 0} đánh giá)
                              </small>
                            </div>
                            
                            <div className="mt-auto">
                              <div className="d-flex justify-content-between align-items-center mb-2">
                                <span className="h5 text-primary mb-0">
                                  {formatPrice(book.price)}
                                </span>
                                <small className="text-muted">
                                  Còn {book.stock} cuốn
                                </small>
                              </div>
                              
                              <button
                                className="btn btn-primary w-100"
                                onClick={(e) => handleAddToCart(e, book.book_id)}
                              >
                                <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
                                Thêm vào giỏ
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

          {/* No search performed yet */}
          {!hasSearched && (
            <div className="text-center py-5">
              <FontAwesomeIcon icon={faSearch} size="3x" className="text-muted mb-3" />
              <h4>Tìm kiếm sách yêu thích</h4>
              <p className="text-muted">
                Nhập tên sách, tác giả hoặc từ khóa để bắt đầu tìm kiếm
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;