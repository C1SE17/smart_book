import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter, faSort, faStar, faShoppingCart, faHeart, faTimes } from '@fortawesome/free-solid-svg-icons';

const CategoriesPage = ({ onNavigateTo }) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [showCategoryCards, setShowCategoryCards] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000000 });
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch categories and products
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { mockApi } = await import('../../../services/mockApi');
        
        const [categoriesData, productsResponse, authorsData] = await Promise.all([
          mockApi.getCategories(),
          mockApi.getBooks({ limit: 50 }),
          mockApi.getAuthors()
        ]);
        
        setCategories(categoriesData);
        setProducts(productsResponse.data);
        setAuthors(authorsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter products based on selected category and search
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Filter by category
    if (selectedCategory) {
      const category = categories.find(c => c.name === selectedCategory);
      if (category) {
        filtered = filtered.filter(product => product.category_id === category.category_id);
      }
    }

    // Filter by author
    if (selectedAuthor) {
      const author = authors.find(a => a.name === selectedAuthor);
      if (author) {
        filtered = filtered.filter(product => product.author_id === author.author_id);
      }
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product => 
        product.title.toLowerCase().includes(query) ||
        product.author.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      );
    }

    // Filter by price range
    filtered = filtered.filter(product => 
      product.price >= priceRange.min && product.price <= priceRange.max
    );

    // Sort products
    filtered.sort((a, b) => {
      let aValue, bValue;
      
    switch (sortBy) {
        case 'price':
          aValue = a.price;
          bValue = b.price;
        break;
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
        break;
      case 'rating':
          aValue = a.rating || 0;
          bValue = b.rating || 0;
        break;
        case 'created_at':
      default:
          aValue = new Date(a.created_at);
          bValue = new Date(b.created_at);
        break;
    }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [products, selectedCategory, selectedAuthor, searchQuery, priceRange, sortBy, sortOrder, categories, authors]);

  // Handle category selection
  const handleCategorySelect = (categoryName) => {
    setSelectedCategory(categoryName);
    setShowCategoryCards(false);
  };

  // Handle author selection
  const handleAuthorSelect = (authorName) => {
    setSelectedAuthor(authorName);
    setShowCategoryCards(false);
  };

  // Handle back to categories
  const handleBackToCategories = () => {
    setSelectedCategory('');
    setSelectedAuthor('');
    setShowCategoryCards(true);
    setSearchQuery('');
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSelectedCategory('');
    setSelectedAuthor('');
    setSearchQuery('');
    setPriceRange({ min: 0, max: 1000000 });
    setSortBy('created_at');
    setSortOrder('desc');
  };

  // Handle product click
  const handleProductClick = (bookId) => {
    onNavigateTo('product', { productId: bookId });
  };

  // Handle add to cart
  const handleAddToCart = async (e, bookId) => {
    e.stopPropagation();
    
    try {
      const { mockApi } = await import('../../../services/mockApi');
      const user = JSON.parse(localStorage.getItem('user'));
      
      if (!user) {
        alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!');
        return;
      }

      await mockApi.addToCart(user.user_id, bookId, 1);
      
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

  if (loading) {
    return (
      <div className="container-fluid py-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4" style={{ maxWidth: '1200px' }}>
      <div className="row justify-content-center">
        {/* Sidebar */}
          <div className="col-lg-3 col-md-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">
                <FontAwesomeIcon icon={faFilter} className="me-2" />
                Bộ lọc
              </h5>
            </div>
            <div className="card-body">
            {/* Search */}
              <div className="mb-3">
                <label className="form-label fw-bold mb-2" style={{ fontSize: '0.9rem' }}>Tìm kiếm</label>
                <div className="input-group input-group-sm">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Tìm sách hoặc tác giả..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ fontSize: '0.85rem' }}
                  />
                  <button className="btn btn-outline-secondary" type="button" style={{ fontSize: '0.8rem' }}>
                    <FontAwesomeIcon icon={faSearch} />
                  </button>
                </div>
              </div>

            {/* Categories */}
              <div className="mb-3">
                <label className="form-label fw-bold mb-2" style={{ fontSize: '0.9rem' }}>Danh mục</label>
                <div className="list-group list-group-flush" style={{ maxHeight: '250px', overflowY: 'auto' }}>
                  <a
                    href="#"
                    className={`list-group-item list-group-item-action border-0 py-1 ${!selectedCategory ? 'active bg-primary text-white' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleBackToCategories();
                    }}
                    style={{ fontSize: '0.85rem', textDecoration: 'none' }}
                  >
                    Tất Cả ({products.length})
                  </a>
                  {categories.map((category) => {
                    const count = products.filter(p => p.category_id === category.category_id).length;
                    return (
                      <a
                        key={category.category_id}
                        href="#"
                        className={`list-group-item list-group-item-action border-0 py-1 ${selectedCategory === category.name ? 'active bg-primary text-white' : ''}`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleCategorySelect(category.name);
                        }}
                        style={{ fontSize: '0.85rem', textDecoration: 'none' }}
                      >
                        {category.name} ({count})
                      </a>
                    );
                  })}
                </div>
              </div>

            {/* Authors */}
              <div className="mb-3">
                <label className="form-label fw-bold mb-2" style={{ fontSize: '0.9rem' }}>Tác Giả</label>
                <div className="list-group list-group-flush" style={{ maxHeight: '250px', overflowY: 'auto' }}>
                  <a
                    href="#"
                    className={`list-group-item list-group-item-action border-0 py-1 ${!selectedAuthor ? 'active bg-primary text-white' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedAuthor('');
                    }}
                    style={{ fontSize: '0.85rem', textDecoration: 'none' }}
                  >
                    Tất Cả ({products.length})
                  </a>
                  {authors.map((author) => {
                    const count = products.filter(p => p.author_id === author.author_id).length;
                    return (
                      <a
                        key={author.author_id}
                        href="#"
                        className={`list-group-item list-group-item-action border-0 py-1 ${selectedAuthor === author.name ? 'active bg-primary text-white' : ''}`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleAuthorSelect(author.name);
                        }}
                        style={{ fontSize: '0.85rem', textDecoration: 'none' }}
                      >
                        {author.name} ({count})
                      </a>
                    );
                  })}
                </div>
              </div>

            {/* Price Range */}
              <div className="mb-3">
                <label className="form-label fw-bold mb-2" style={{ fontSize: '0.9rem' }}>Khoảng Giá</label>
                <div className="row g-2">
                  <div className="col-6">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="0"
                      value={priceRange.min.toLocaleString('vi-VN')}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\./g, '');
                        setPriceRange(prev => ({ ...prev, min: parseInt(value) || 0 }));
                      }}
                      style={{ fontSize: '0.8rem' }}
                    />
                  </div>
                  <div className="col-6">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="1.000.000"
                      value={priceRange.max.toLocaleString('vi-VN')}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\./g, '');
                        setPriceRange(prev => ({ ...prev, max: parseInt(value) || 1000000 }));
                      }}
                      style={{ fontSize: '0.8rem' }}
                    />
                  </div>
                </div>
                <div className="mt-2">
                  <input
                    type="range"
                    className="form-range"
                    min="0"
                    max="1000000"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) }))}
                    style={{ height: '4px' }}
                  />
                </div>
              </div>

              {/* Reset Filter Button */}
              <div className="d-grid">
                <button 
                  className="btn btn-outline-secondary btn-sm"
                  onClick={handleResetFilters}
                  style={{ fontSize: '0.8rem' }}
                >
                  <FontAwesomeIcon icon={faTimes} className="me-1" />
                  Đặt Lại
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-lg-9 col-md-8">
          {/* Header with results count and sort */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h6 className="mb-0">Hiển thị {filteredProducts.length} kết quả</h6>
            </div>
            <div className="d-flex align-items-center">
              <label className="form-label me-2 mb-0">Sắp xếp theo:</label>
              <select
                className="form-select form-select-sm"
                style={{ width: 'auto' }}
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [newSortBy, newSortOrder] = e.target.value.split('-');
                  setSortBy(newSortBy);
                  setSortOrder(newSortOrder);
                }}
              >
                <option value="created_at-desc">Mặc định</option>
                <option value="price-asc">Giá: Thấp đến Cao</option>
                <option value="price-desc">Giá: Cao đến Thấp</option>
                <option value="title-asc">Tên: A-Z</option>
                <option value="title-desc">Tên: Z-A</option>
                <option value="rating-desc">Đánh giá: Cao nhất</option>
                <option value="rating-asc">Đánh giá: Thấp nhất</option>
              </select>
            </div>
          </div>

          {showCategoryCards ? (
            // Category Cards View
            <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Danh mục sách</h2>
              </div>
              
              <div className="row">
                {categories.map((category) => {
                  const bookCount = products.filter(p => p.category_id === category.category_id).length;
                  return (
                    <div key={category.category_id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
                      <div 
                        className="card h-100 shadow-sm category-card"
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleCategorySelect(category.name)}
                      >
                        <div className="card-body text-center">
                          <h5 className="card-title">{category.name}</h5>
                          <p className="card-text text-muted">
                            {bookCount} sách
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            // Products Grid View
            <div>
              {filteredProducts.length > 0 ? (
                <div className="row">
              {filteredProducts.map((product) => (
                    <div key={product.book_id} className="col-lg-3 col-md-6 mb-4">
                      <div
                        className="card h-100 border-0 shadow-sm product-card"
                        style={{ 
                          cursor: 'pointer',
                          borderRadius: '8px',
                          height: '350px',
                          backgroundColor: 'white',
                          transition: 'all 0.3s ease'
                        }}
                        onClick={() => handleProductClick(product.book_id)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-8px)';
                          e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.15)';
                          // Hiển thị nút thêm vào giỏ hàng nếu còn hàng
                          const addToCartBtn = e.currentTarget.querySelector('.add-to-cart-btn');
                          if (addToCartBtn && product.stock > 0) {
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
                            src={product.cover_image}
                        className="card-img-top"
                        alt={product.title}
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
                          {/* Sale Tag */}
                          <div className="position-absolute top-0 end-0 p-1">
                            <span className="badge bg-dark">Sale</span>
                          </div>
                          <div className="position-absolute top-0 start-0 p-2">
                            <button
                              className="btn btn-sm btn-light rounded-circle"
                              onClick={(e) => handleAddToWishlist(e, product.book_id)}
                              title="Thêm vào yêu thích"
                            >
                              <FontAwesomeIcon icon={faHeart} />
                            </button>
                          </div>
                          {/* Nút Thêm Vào Giỏ Hàng - xuất hiện khi hover và còn hàng */}
                          {product.stock > 0 && (
                            <div
                              className="position-absolute top-0 end-0 p-2 add-to-cart-btn"
                              style={{
                                opacity: 0,
                                transition: 'opacity 0.3s ease'
                              }}
                            >
                              <button
                                className="btn btn-primary btn-sm rounded-circle"
                                onClick={(e) => handleAddToCart(e, product.book_id)}
                                title="Thêm vào giỏ hàng"
                                style={{
                                  width: '40px',
                                  height: '40px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                              >
                                <FontAwesomeIcon icon={faShoppingCart} />
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
                        {product.title}
                      </h6>
                          <p className="card-text text-muted mb-2" style={{ fontSize: '0.9rem' }}>
                            {product.author}
                          </p>
                      <div className="d-flex align-items-center mb-2">
                            <div className="me-2">
                              {Array.from({ length: 5 }, (_, i) => (
                                <FontAwesomeIcon
                                  key={i}
                                  icon={faStar}
                                  className={i < (product.rating || 0) ? 'text-warning' : 'text-muted'}
                                  size="sm"
                                />
                              ))}
                            </div>
                            <small className="text-muted">({product.reviewCount || 0})</small>
                      </div>
                      <div className="mt-auto">
                            <p className="card-text fw-bold text-dark mb-2" style={{ fontSize: '1.1rem' }}>
                              {formatPrice(product.price)}
                            </p>
                            <button
                              className="btn btn-outline-primary btn-sm w-100"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleProductClick(product.book_id);
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
              ) : (
              <div className="text-center py-5">
                  <FontAwesomeIcon icon={faSearch} size="3x" className="text-muted mb-3" />
                  <h4>Không tìm thấy sách nào</h4>
                  <p className="text-muted">
                    Không có sách nào phù hợp với bộ lọc của bạn.
                  </p>
              </div>
            )}
          </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;