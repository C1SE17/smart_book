import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter, faSort, faStar, faShoppingCart, faHeart } from '@fortawesome/free-solid-svg-icons';

const CategoriesPage = ({ onNavigateTo }) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showCategoryCards, setShowCategoryCards] = useState(true);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
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
        
        const [categoriesData, productsResponse] = await Promise.all([
          mockApi.getCategories(),
          mockApi.getBooks({ limit: 50 })
        ]);
        
        setCategories(categoriesData);
        setProducts(productsResponse.data);
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
  }, [products, selectedCategory, searchQuery, priceRange, sortBy, sortOrder, categories]);

  // Handle category selection
  const handleCategorySelect = (categoryName) => {
    setSelectedCategory(categoryName);
    setShowCategoryCards(false);
  };

  // Handle back to categories
  const handleBackToCategories = () => {
    setSelectedCategory('');
    setShowCategoryCards(true);
    setSearchQuery('');
  };

  // Handle product click
  const handleProductClick = (bookId) => {
    onNavigateTo('product')();
    window.history.pushState({}, '', `/product?id=${bookId}`);
  };

  // Handle add to cart
  const handleAddToCart = (e, bookId) => {
    e.stopPropagation();
    console.log('Add to cart:', bookId);
  };

  // Handle add to wishlist
  const handleAddToWishlist = (e, bookId) => {
    e.stopPropagation();
    console.log('Add to wishlist:', bookId);
  };

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

  // Category cards data
  const categoryCards = [
    { name: "Sách truyện", bookCount: 15, category: "Sách truyện" },
    { name: "Sách ngoại văn", bookCount: 8, category: "Sách ngoại văn" },
    { name: "Sách Sale theo chủ đề", bookCount: 12, category: "Sách Sale theo chủ đề" },
    { name: "Sách theo tác giả", bookCount: 6, category: "Sách theo tác giả" },
    { name: "Sách theo nhà cung cấp", bookCount: 10, category: "Sách theo nhà cung cấp" },
    { name: "Văn phòng phẩm", bookCount: 5, category: "Văn phòng phẩm" },
    { name: "Quà tặng", bookCount: 3, category: "Quà tặng" },
    { name: "Đồ chơi", bookCount: 7, category: "Đồ chơi" }
  ];

  if (loading) {
    return (
      <div className="container-fluid py-4">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
          <p className="mt-3">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="row">
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
                <label className="form-label">Tìm kiếm</label>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nhập từ khóa..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button className="btn btn-outline-secondary" type="button">
                    <FontAwesomeIcon icon={faSearch} />
                  </button>
                </div>
              </div>

              {/* Categories */}
              <div className="mb-3">
                <label className="form-label">Danh mục</label>
                <div className="list-group list-group-flush">
                  <button
                    className={`list-group-item list-group-item-action ${!selectedCategory ? 'active' : ''}`}
                    onClick={handleBackToCategories}
                  >
                    Tất cả danh mục
                  </button>
                  {categories.slice(0, 8).map((category) => (
                    <button
                      key={category.category_id}
                      className={`list-group-item list-group-item-action ${selectedCategory === category.name ? 'active' : ''}`}
                      onClick={() => handleCategorySelect(category.name)}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-3">
                <label className="form-label">Khoảng giá</label>
                <div className="row">
                  <div className="col-6">
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      placeholder="Từ"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                  <div className="col-6">
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      placeholder="Đến"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) || 1000000 }))}
                    />
                  </div>
                </div>
              </div>

              {/* Sort */}
              <div className="mb-3">
                <label className="form-label">Sắp xếp theo</label>
                <select
                  className="form-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="created_at">Mới nhất</option>
                  <option value="price">Giá</option>
                  <option value="title">Tên sách</option>
                  <option value="rating">Đánh giá</option>
                </select>
                <select
                  className="form-select mt-2"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="desc">Giảm dần</option>
                  <option value="asc">Tăng dần</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-lg-9 col-md-8">
          {showCategoryCards ? (
            // Category Cards View
            <div>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Danh mục sách</h2>
              </div>
              
              <div className="row">
                {categoryCards.map((card, index) => (
                  <div key={index} className="col-lg-3 col-md-4 col-sm-6 mb-4">
                    <div 
                      className="card h-100 shadow-sm category-card"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleCategorySelect(card.category)}
                    >
                      <div className="card-body text-center">
                        <h5 className="card-title">{card.name}</h5>
                        <p className="card-text text-muted">
                          {card.bookCount} sách
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // Products View
            <div>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h2>{selectedCategory || 'Tất cả sách'}</h2>
                  <p className="text-muted mb-0">
                    {filteredProducts.length} sách được tìm thấy
                  </p>
                </div>
                <button 
                  className="btn btn-outline-secondary"
                  onClick={handleBackToCategories}
                >
                  <FontAwesomeIcon icon={faSort} className="me-2" />
                  Quay lại danh mục
                </button>
              </div>

              {filteredProducts.length > 0 ? (
                <div className="row">
                  {filteredProducts.map((product) => (
                    <div key={product.book_id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
                      <div 
                        className="card h-100 shadow-sm product-card"
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleProductClick(product.book_id)}
                      >
                        <div className="position-relative">
                          <img
                            src={product.cover_image}
                            className="card-img-top"
                            alt={product.title}
                            style={{ height: '250px', objectFit: 'cover' }}
                            onError={(e) => {
                              e.target.src = '/images/book1.jpg';
                            }}
                          />
                          <div className="position-absolute top-0 end-0 p-2">
                            <button
                              className="btn btn-sm btn-light rounded-circle"
                              onClick={(e) => handleAddToWishlist(e, product.book_id)}
                              title="Thêm vào yêu thích"
                            >
                              <FontAwesomeIcon icon={faHeart} />
                            </button>
                          </div>
                        </div>
                        
                        <div className="card-body d-flex flex-column">
                          <h6 className="card-title text-truncate" title={product.title}>
                            {product.title}
                          </h6>
                          
                          <p className="text-muted small mb-2">
                            Tác giả: {product.author}
                          </p>
                          
                          <div className="d-flex align-items-center mb-2">
                            <div className="me-2">
                              {renderStars(product.rating || 0)}
                            </div>
                            <small className="text-muted">
                              ({product.reviewCount || 0} đánh giá)
                            </small>
                          </div>
                          
                          <div className="mt-auto">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <span className="h5 text-primary mb-0">
                                {formatPrice(product.price)}
                              </span>
                              <small className="text-muted">
                                Còn {product.stock} cuốn
                              </small>
                            </div>
                            
                            <button
                              className="btn btn-primary w-100"
                              onClick={(e) => handleAddToCart(e, product.book_id)}
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