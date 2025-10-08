import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter, faSort, faStar, faShoppingCart, faHeart, faTimes } from '@fortawesome/free-solid-svg-icons';
import apiService from '../../../services';

const CategoriesPage = ({ onNavigateTo }) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [showCategoryCards, setShowCategoryCards] = useState(false);
  const [showAuthorCards, setShowAuthorCards] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('created_at');
  
  // Pagination states for authors
  const [currentAuthorPage, setCurrentAuthorPage] = useState(1);
  const [authorsPerPage] = useState(12); // 12 authors per page (3 rows x 4 columns)
  const [sortOrder, setSortOrder] = useState('desc');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000000 });
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch categories and products
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        console.log('🔄 Fetching real data from API...');
        
        // Fetch data from real API
        const [categoriesResponse, booksResponse, authorsResponse] = await Promise.all([
          apiService.getCategories(),
          apiService.getBooks({ limit: 1000 }), // Lấy tối đa 1000 sách
          apiService.getAuthors()
        ]);

        console.log('📊 API Responses:', {
          categories: categoriesResponse,
          books: booksResponse,
          authors: authorsResponse
        });

        // Set data from API responses
        if (categoriesResponse.success) {
          setCategories(categoriesResponse.data || []);
          console.log('✅ Categories loaded:', categoriesResponse.data?.length || 0);
        }

        if (booksResponse.success) {
          setProducts(booksResponse.data || []);
          console.log('✅ Books loaded:', booksResponse.data?.length || 0);
        }

        if (authorsResponse.success) {
          const authorsData = authorsResponse.data || [];
          // Tính số lượng sách cho mỗi tác giả
          const authorsWithBookCount = authorsData.map(author => {
            const bookCount = booksResponse.success ? 
              (booksResponse.data || []).filter(book => book.author_id === author.author_id).length : 0;
            return { ...author, book_count: bookCount };
          });
          setAuthors(authorsWithBookCount);
          console.log('✅ Authors loaded with book counts:', authorsWithBookCount.length);
        }

        console.log('🎉 All data loaded successfully from real API!');
      } catch (error) {
        console.error('❌ Error fetching data from API:', error);
        
        // Fallback to empty arrays on error
        setCategories([]);
        setProducts([]);
        setAuthors([]);
        
        // Show error message to user
        if (window.showToast) {
          window.showToast('Không thể tải dữ liệu từ server. Vui lòng thử lại sau.', 'error');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Pagination logic for authors
  const paginatedAuthors = useMemo(() => {
    if (!authors || !Array.isArray(authors)) return [];
    
    const startIndex = (currentAuthorPage - 1) * authorsPerPage;
    const endIndex = startIndex + authorsPerPage;
    return authors.slice(startIndex, endIndex);
  }, [authors, currentAuthorPage, authorsPerPage]);

  const totalAuthorPages = useMemo(() => {
    if (!authors || !Array.isArray(authors)) return 0;
    return Math.ceil(authors.length / authorsPerPage);
  }, [authors, authorsPerPage]);

  // Filter products based on selected category and search
  const filteredProducts = useMemo(() => {
    if (!products || !Array.isArray(products)) return [];
    
    let filtered = [...products];

    // Filter by category
    if (selectedCategory && categories && Array.isArray(categories)) {
      const category = categories.find(c => c && c.name === selectedCategory);
      if (category) {
        filtered = filtered.filter(product => product && product.category_id === category.category_id);
      }
    }

    // Filter by author
    if (selectedAuthor && authors && Array.isArray(authors)) {
      const author = authors.find(a => a && a.name === selectedAuthor);
      if (author) {
        filtered = filtered.filter(product => product && product.author_id === author.author_id);
      }
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product => {
        if (!product) return false;
        
        // Search in title
        const titleMatch = product.title && product.title.toLowerCase().includes(query);
        
        // Search in author name
        const author = authors.find(a => a && a.author_id === product.author_id);
        const authorMatch = author && author.name && author.name.toLowerCase().includes(query);
        
        // Search in description
        const descriptionMatch = product.description && product.description.toLowerCase().includes(query);
        
        return titleMatch || authorMatch || descriptionMatch;
      });
    }

    // Filter by price range
    filtered = filtered.filter(product =>
      product && product.price && product.price >= priceRange.min && product.price <= priceRange.max
    );

    // Sort products
    filtered.sort((a, b) => {
      if (!a || !b) return 0;
      
      let aValue, bValue;

      switch (sortBy) {
        case 'price':
          aValue = a.price || 0;
          bValue = b.price || 0;
          break;
        case 'title':
          aValue = (a.title || '').toLowerCase();
          bValue = (b.title || '').toLowerCase();
          break;
        case 'rating':
          aValue = a.rating || 0;
          bValue = b.rating || 0;
          break;
        case 'created_at':
        default:
          aValue = new Date(a.created_at || 0);
          bValue = new Date(b.created_at || 0);
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
    setShowAllCategories(false);
    setSearchQuery('');
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSelectedCategory('');
    setSelectedAuthor('');
    setShowAllCategories(false);
    setSearchQuery('');
    setPriceRange({ min: 0, max: 1000000 });
    setSortBy('created_at');
    setSortOrder('desc');
  };

  // Handle toggle author cards
  const handleToggleAuthorCards = () => {
    setShowAuthorCards(!showAuthorCards);
    setShowCategoryCards(false);
    setShowAllCategories(false);
    setSelectedCategory('');
    setSelectedAuthor('');
    setCurrentAuthorPage(1); // Reset to first page
  };

  // Handle author page change
  const handleAuthorPageChange = (page) => {
    setCurrentAuthorPage(page);
  };

  // Handle product click
  const handleProductClick = (bookId) => {
    onNavigateTo('product', { productId: bookId });
  };

  // Handle add to cart
  const handleAddToCart = async (e, bookId) => {
    e.stopPropagation();

    try {
      // TODO: Implement real cart API
      // const { cartApi } = await import('../../../services/cartApi');
      const user = JSON.parse(localStorage.getItem('user'));

      if (!user) {
        alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!');
        return;
      }

      // await cartApi.addToCart(user.user_id, bookId, 1);

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

  // Handle refresh data
  const handleRefreshData = async () => {
    setLoading(true);
    try {
      console.log('🔄 Refreshing data from API...');
      
      const [categoriesResponse, booksResponse, authorsResponse] = await Promise.all([
        apiService.getCategories(),
        apiService.getBooks({ limit: 1000 }),
        apiService.getAuthors()
      ]);

      if (categoriesResponse.success) {
        setCategories(categoriesResponse.data || []);
      }
      if (booksResponse.success) {
        setProducts(booksResponse.data || []);
      }
      if (authorsResponse.success) {
        setAuthors(authorsResponse.data || []);
      }

      if (window.showToast) {
        window.showToast('Dữ liệu đã được cập nhật thành công!', 'success');
      }
    } catch (error) {
      console.error('❌ Error refreshing data:', error);
      if (window.showToast) {
        window.showToast('Không thể cập nhật dữ liệu. Vui lòng thử lại.', 'error');
      }
    } finally {
      setLoading(false);
    }
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
          <div className="card" style={{ minHeight: '800px' }}>
            <div className="card-header">
              <h5 className="mb-0">
                <FontAwesomeIcon icon={faFilter} className="me-2" />
                Bộ lọc
              </h5>
            </div>
            <div className="card-body" style={{ minHeight: '700px' }}>
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
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <label className="form-label fw-bold mb-0" style={{ fontSize: '0.9rem' }}>Danh mục</label>
                  <button
                    className="btn btn-link btn-sm p-0"
                    onClick={() => setShowAllCategories(true)}
                    style={{ fontSize: '0.8rem', textDecoration: 'none' }}
                  >
                    Xem Tất Cả
                  </button>
                </div>
                <div className="list-group list-group-flush" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {categories && Array.isArray(categories) && categories.slice(0, 18).map((category) => {
                    if (!category) return null;
                    const count = products && Array.isArray(products) ? products.filter(p => p && p.category_id === category.category_id).length : 0;
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
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <label className="form-label fw-bold mb-0" style={{ fontSize: '0.9rem' }}>Tác Giả</label>
                  <button
                    className="btn btn-link btn-sm p-0"
                    onClick={handleToggleAuthorCards}
                    style={{ fontSize: '0.8rem', textDecoration: 'none' }}
                  >
                    Xem Tất Cả
                  </button>
                </div>
                <div className="list-group list-group-flush" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  
                  {authors && Array.isArray(authors) && authors.map((author) => {
                    if (!author) return null;
                    const count = products && Array.isArray(products) ? products.filter(p => p && p.author_id === author.author_id).length : 0;
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
              <div className="mb-4">
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
              <div className="d-grid mb-2">
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={handleResetFilters}
                  style={{ fontSize: '0.8rem' }}
                >
                  <FontAwesomeIcon icon={faTimes} className="me-1" />
                  Đặt Lại
                </button>
              </div>

              {/* Refresh Data Button */}
              <div className="d-grid">
                <button
                  className="btn btn-outline-primary btn-sm"
                  onClick={handleRefreshData}
                  disabled={loading}
                  style={{ fontSize: '0.8rem' }}
                >
                  <FontAwesomeIcon icon={faSearch} className="me-1" />
                  {loading ? 'Đang tải...' : 'Làm mới'}
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
              <h6 className="mb-0">
                Hiển thị {filteredProducts.length} kết quả
                {products && Array.isArray(products) && (
                  <span className="text-muted ms-2">
                    (Tổng: {products.length} sách, {categories && Array.isArray(categories) ? categories.length : 0} danh mục)
                  </span>
                )}
              </h6>
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

          {showAllCategories ? (
            // All Categories Grid View - Giống như hình ảnh
            <div>
              <h2 className="fw-bold text-dark mb-4">Danh mục sách</h2>
              <div className="row g-4">
                {categories && Array.isArray(categories) && categories.map((category) => {
                  if (!category) return null;
                  const bookCount = products && Array.isArray(products) ? products.filter(p => p && p.category_id === category.category_id).length : 0;
                  return (
                    <div key={category.category_id} className="col-lg-3 col-md-4 col-sm-6">
                      <div
                        className="card h-100 border-0 shadow-sm"
                        style={{
                          cursor: 'pointer',
                          borderRadius: '8px',
                          transition: 'all 0.3s ease',
                          backgroundColor: 'white',
                          minHeight: '200px'
                        }}
                        onClick={() => {
                          setSelectedCategory(category.name);
                          setShowAllCategories(false);
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-8px)';
                          e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.15)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                        }}
                      >
                        <div className="card-body text-center p-4 d-flex flex-column justify-content-center">
                          <h5 className="card-title fw-bold mb-2" style={{ fontSize: '1.1rem', lineHeight: '1.3' }}>
                            {category.name}
                          </h5>
                          <p className="card-text text-muted mb-0" style={{ fontSize: '0.9rem' }}>
                            {bookCount} sách
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : showAuthorCards ? (
            // Author Cards View - Giống như danh mục sách
            <div>
              <h2 className="fw-bold text-dark mb-4">Danh mục tác giả</h2>
              <div className="row g-4">
                {paginatedAuthors && Array.isArray(paginatedAuthors) && paginatedAuthors.map((author) => {
                  if (!author) return null;
                  return (
                    <div key={author.author_id} className="col-lg-3 col-md-4 col-sm-6">
                      <div
                        className="card h-100 border-0 shadow-sm"
                        style={{
                          cursor: 'pointer',
                          borderRadius: '8px',
                          transition: 'all 0.3s ease',
                          backgroundColor: 'white',
                          minHeight: '200px'
                        }}
                        onClick={() => {
                          setSelectedAuthor(author.name);
                          setShowAuthorCards(false);
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-8px)';
                          e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.15)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                        }}
                      >
                        <div className="card-body text-center p-4 d-flex flex-column justify-content-center">
                          <h5 className="card-title fw-bold mb-2" style={{ fontSize: '1.1rem', lineHeight: '1.3' }}>
                            {author.name}
                          </h5>
                          <p className="card-text text-muted mb-0" style={{ fontSize: '0.9rem' }}>
                            {author.book_count || 0} sách
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Author Pagination */}
              {totalAuthorPages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                  <nav aria-label="Author pagination">
                    <ul className="pagination">
                      <li className={`page-item ${currentAuthorPage === 1 ? 'disabled' : ''}`}>
                        <button
                          className="page-link"
                          onClick={() => handleAuthorPageChange(currentAuthorPage - 1)}
                          disabled={currentAuthorPage === 1}
                        >
                          Trước
                        </button>
                      </li>
                      
                      {Array.from({ length: totalAuthorPages }, (_, i) => i + 1).map((page) => (
                        <li key={page} className={`page-item ${currentAuthorPage === page ? 'active' : ''}`}>
                          <button
                            className="page-link"
                            onClick={() => handleAuthorPageChange(page)}
                          >
                            {page}
                          </button>
                        </li>
                      ))}
                      
                      <li className={`page-item ${currentAuthorPage === totalAuthorPages ? 'disabled' : ''}`}>
                        <button
                          className="page-link"
                          onClick={() => handleAuthorPageChange(currentAuthorPage + 1)}
                          disabled={currentAuthorPage === totalAuthorPages}
                        >
                          Sau
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              )}
              
              {/* Author count info */}
              <div className="text-center mt-3">
                <small className="text-muted">
                  Hiển thị {((currentAuthorPage - 1) * authorsPerPage) + 1}-{Math.min(currentAuthorPage * authorsPerPage, authors.length)} 
                  trong tổng số {authors.length} tác giả
                </small>
              </div>
            </div>
          ) : (
            // Products Grid View
            <div>
              {filteredProducts.length > 0 ? (
                <div className="row">
                  {filteredProducts && Array.isArray(filteredProducts) && filteredProducts.map((product) => {
                    if (!product) return null;
                    return (
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
                            {(() => {
                              const author = authors.find(a => a && a.author_id === product.author_id);
                              return author ? author.name : `Tác giả ID: ${product.author_id}`;
                            })()}
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
                    );
                  })}
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