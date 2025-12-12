import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter, faSort, faStar, faShoppingCart, faHeart, faTimes } from '@fortawesome/free-solid-svg-icons';
import apiService from '../../../services';
import { useLanguage } from '../../../contexts/LanguageContext';

const CategoriesPage = ({ onNavigateTo }) => {
  const { t } = useLanguage();
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

  // Pagination states for products
  const [currentProductPage, setCurrentProductPage] = useState(1);
  const [productsPerPage] = useState(12); // 12 products per page (3 rows x 4 columns)

  const [sortOrder, setSortOrder] = useState('desc');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000000 });
  const [searchQuery, setSearchQuery] = useState('');

  // Restore state from sessionStorage when component mounts
  useEffect(() => {
    try {
      const savedState = sessionStorage.getItem('categoriesPageState');
      if (savedState) {
        const state = JSON.parse(savedState);
        console.log('Restoring categories page state:', state);
        
        if (state.selectedCategory !== undefined) setSelectedCategory(state.selectedCategory);
        if (state.selectedAuthor !== undefined) setSelectedAuthor(state.selectedAuthor);
        if (state.currentProductPage !== undefined) setCurrentProductPage(state.currentProductPage);
        if (state.searchQuery !== undefined) setSearchQuery(state.searchQuery);
        if (state.sortBy !== undefined) setSortBy(state.sortBy);
        if (state.sortOrder !== undefined) setSortOrder(state.sortOrder);
        if (state.priceRange !== undefined) setPriceRange(state.priceRange);
        
        // Clear saved state after restoring
        sessionStorage.removeItem('categoriesPageState');
      }
    } catch (error) {
      console.error('Error restoring categories page state:', error);
    }
  }, []);

  // Fetch categories and products
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        console.log(' Fetching real data from API...');

        // Fetch data from real API
        const [categoriesResponse, booksResponse, authorsResponse] = await Promise.all([
          apiService.getCategories(),
          apiService.getBooks({ limit: 1000 }), // Lấy tối đa 1000 sách
          apiService.getAllAuthors()
        ]);

        console.log('API Responses:', {
          categories: categoriesResponse,
          books: booksResponse,
          authors: authorsResponse
        });

        // Debug: Log sample data
        if (booksResponse.success && booksResponse.data) {
          console.log('Sample books data:', booksResponse.data.slice(0, 3).map(book => ({
            id: book.book_id,
            title: book.title,
            category_id: book.category_id,
            author_id: book.author_id
          })));
        }

        if (categoriesResponse.success && categoriesResponse.data) {
          console.log(' Categories data:', categoriesResponse.data.map(cat => ({
            id: cat.category_id,
            name: cat.name
          })));
        }

        // Set data from API responses
        if (categoriesResponse.success) {
          setCategories(categoriesResponse.data || []);
          console.log('Categories loaded:', categoriesResponse.data?.length || 0);
        }

        if (booksResponse.success) {
          setProducts(booksResponse.data || []);
          console.log('Books loaded:', booksResponse.data?.length || 0);
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
          console.log('Authors loaded with book counts:', authorsWithBookCount.length);
        }

        console.log(' All data loaded successfully from real API!');
      } catch (error) {
        console.error('Error fetching data from API:', error);

        // Fallback to empty arrays on error
        setCategories([]);
        setProducts([]);
        setAuthors([]);

        // Show error message to user
        if (window.showToast) {
          window.showToast(t('shop.states.errorLoading'), 'error');
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
      console.log('Filtering by category:', {
        selectedCategory,
        category,
        totalProducts: products.length,
        productsWithCategoryId: products.filter(p => p && p.category_id).length
      });
      
      if (category) {
        const beforeFilter = filtered.length;
        filtered = filtered.filter(product => product && product.category_id === category.category_id);
        console.log('Category filter result:', {
          categoryName: category.name,
          categoryId: category.category_id,
          beforeFilter,
          afterFilter: filtered.length,
          matchingProducts: filtered.map(p => ({ id: p.book_id, title: p.title, category_id: p.category_id }))
        });
      } else {
        console.log('Category not found:', selectedCategory);
      }
    }

    // Filter by author
    if (selectedAuthor && authors && Array.isArray(authors)) {
      const author = authors.find(a => a && a.name === selectedAuthor);
      console.log(' Filtering by author:', {
        selectedAuthor,
        author,
        beforeFilter: filtered.length
      });
      
      if (author) {
        const beforeFilter = filtered.length;
        filtered = filtered.filter(product => product && product.author_id === author.author_id);
        console.log('Author filter result:', {
          authorName: author.name,
          authorId: author.author_id,
          beforeFilter,
          afterFilter: filtered.length,
          matchingProducts: filtered.map(p => ({ id: p.book_id, title: p.title, author_id: p.author_id }))
        });
      } else {
        console.log('Author not found:', selectedAuthor);
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

    // Log final result
    console.log('Final filter result:', {
      totalProducts: products.length,
      finalFilteredCount: filtered.length,
      activeFilters: {
        category: selectedCategory || 'none',
        author: selectedAuthor || 'none',
        search: searchQuery || 'none',
        priceRange: `${priceRange.min} - ${priceRange.max}`
      },
      sortBy,
      sortOrder
    });

    return filtered;
  }, [products, selectedCategory, selectedAuthor, searchQuery, priceRange, sortBy, sortOrder, categories, authors]);

  // Pagination logic for products
  const paginatedProducts = useMemo(() => {
    if (!filteredProducts || !Array.isArray(filteredProducts)) return [];

    const startIndex = (currentProductPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentProductPage, productsPerPage]);

  const totalProductPages = useMemo(() => {
    if (!filteredProducts || !Array.isArray(filteredProducts)) return 0;
    return Math.ceil(filteredProducts.length / productsPerPage);
  }, [filteredProducts, productsPerPage]);

  // Ensure currentProductPage is valid after filtering
  useEffect(() => {
    if (totalProductPages > 0 && currentProductPage > totalProductPages) {
      setCurrentProductPage(1);
    }
  }, [totalProductPages, currentProductPage]);

  // Handle category selection
  const handleCategorySelect = (categoryName) => {
    // Toggle category selection - nếu đã chọn thì bỏ chọn, nếu chưa chọn thì chọn
    if (selectedCategory === categoryName) {
      setSelectedCategory(''); // Bỏ chọn nếu đã chọn
    } else {
      setSelectedCategory(categoryName); // Chọn category mới
    }
    setShowCategoryCards(false);
    setCurrentProductPage(1); // Reset to first page
  };

  // Handle author selection
  const handleAuthorSelect = (authorName) => {
    // Toggle author selection - nếu đã chọn thì bỏ chọn, nếu chưa chọn thì chọn
    if (selectedAuthor === authorName) {
      setSelectedAuthor(''); // Bỏ chọn nếu đã chọn
    } else {
      setSelectedAuthor(authorName); // Chọn author mới
    }
    setShowCategoryCards(false);
    setCurrentProductPage(1); // Reset to first page
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
    setCurrentProductPage(1); // Reset to first page
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

  // Handle product page change
  const handleProductPageChange = (page) => {
    setCurrentProductPage(page);
  };

  // Handle product click
  const handleProductClick = async (bookId) => {
    // Save current state to sessionStorage before navigating
    try {
      const stateToSave = {
        selectedCategory,
        selectedAuthor,
        currentProductPage,
        searchQuery,
        sortBy,
        sortOrder,
        priceRange
      };
      sessionStorage.setItem('categoriesPageState', JSON.stringify(stateToSave));
      console.log('Saved categories page state before navigating to product:', stateToSave);
    } catch (error) {
      console.error('Error saving categories page state:', error);
    }

    try {
      const api = (await import('../../../services/api')).default;
      const product = filteredProducts.find(p => p && p.book_id === bookId);
      if (product) {
        await api.trackProductView({
          productId: product.book_id,
          productName: product.title,
          viewDuration: 0
        });
      }
    } catch (e) {
      console.warn('Tracking product click failed:', e?.message || e);
    }

    onNavigateTo('product', { productId: bookId });
  };

  // Handle add to cart
  const handleAddToCart = async (e, bookId) => {
    e.stopPropagation();

    // Kiểm tra user đã đăng nhập chưa - kiểm tra chặt chẽ hơn
    let user = null;
    try {
      const userStr = localStorage.getItem('user');
      if (userStr && userStr !== 'null' && userStr !== 'undefined') {
        user = JSON.parse(userStr);
      }
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      user = null;
    }

    // Kiểm tra user có hợp lệ không (phải là object và có user_id)
    if (!user || typeof user !== 'object' || !user.user_id) {
      const message = t('home.messages.loginRequired');
      if (window.showToast) {
        window.showToast(message, 'warning');
      } else {
        alert(message);
      }
      return;
    }

    try {

      // Find the product details
      const product = filteredProducts.find(p => p.book_id === bookId);
      if (!product) {
        const message = t('shop.products.notFound');
        if (window.showToast) {
          window.showToast(message, 'error');
        } else {
          alert(message);
        }
        return;
      }

      // Add to cart using localStorage
      const cartKey = `cart_${user.user_id}`;
      const existingCart = JSON.parse(localStorage.getItem(cartKey) || '[]');
      const existingItem = existingCart.find(item => item.book_id === bookId);

      if (existingItem) {
        // Update existing item quantity
        existingItem.quantity += 1;
        const updatedCart = existingCart.map(item =>
          item.book_id === bookId ? existingItem : item
        );
        localStorage.setItem(cartKey, JSON.stringify(updatedCart));
      } else {
        // Add new item to cart
        const newItem = {
          book_id: product.book_id,
          title: product.title,
          price: product.price,
          quantity: 1,
          cover_image: product.cover_image,
          author_name: product.author_name,
          author: product.author,
          category_name: product.category_name,
          publisher_name: product.publisher_name
        };
        const updatedCart = [...existingCart, newItem];
        localStorage.setItem(cartKey, JSON.stringify(updatedCart));
      }

      // Dispatch cart updated event
      window.dispatchEvent(new CustomEvent('cartUpdated'));

      // Tracking thêm vào giỏ từ listing
      try {
        const api = (await import('../../../services/api')).default;
        await api.trackCartAction({
          productId: product.book_id,
          productName: product.title,
          action: 'add',
          quantity: 1
        });
      } catch (e) {
        console.warn('Tracking cart add (listing) failed:', e?.message || e);
      }

      const successMessage = t('home.messages.addSuccess', { title: product.title });
      if (window.showToast) {
        window.showToast(successMessage, 'success');
      } else {
        alert(successMessage);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      const message = t('home.messages.addFailed');
      if (window.showToast) {
        window.showToast(message, 'error');
      } else {
        alert(message);
      }
    }
  };

  // Handle add to wishlist
  const handleAddToWishlist = (e, bookId) => {
    e.stopPropagation();
    // TODO: Implement wishlist functionality
    const message = t('shop.products.wishlistPending');
    if (window.showToast) {
      window.showToast(message, 'info');
    } else {
      alert(message);
    }
  };

  // Handle refresh data
  const handleRefreshData = async () => {
    setLoading(true);
    try {
      console.log(' Refreshing data from API...');

      const [categoriesResponse, booksResponse, authorsResponse] = await Promise.all([
        apiService.getCategories(),
        apiService.getBooks({ limit: 1000 }),
        apiService.getAllAuthors()
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
        window.showToast(t('shop.notifications.refreshSuccess'), 'success');
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
      if (window.showToast) {
        window.showToast(t('shop.notifications.refreshError'), 'error');
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
            <span className="visually-hidden">{t('shop.states.loading')}</span>
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
                {t('shop.sidebar.filterTitle')}
              </h5>
            </div>
            <div className="card-body" style={{ minHeight: '700px' }}>
              {/* Search */}
              <div className="mb-3">
                <label className="form-label fw-bold mb-2" style={{ fontSize: '0.9rem' }}>{t('shop.sidebar.searchLabel')}</label>
                <div className="input-group input-group-sm">
                  <input
                    type="text"
                    className="form-control"
                    placeholder={t('shop.sidebar.searchPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentProductPage(1); // Reset to first page when searching
                    }}
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
                  <label className="form-label fw-bold mb-0" style={{ fontSize: '0.9rem' }}>{t('shop.sidebar.categoriesLabel')}</label>
                  <button
                    className="btn btn-link btn-sm p-0"
                    onClick={() => setShowAllCategories(true)}
                    style={{ fontSize: '0.8rem', textDecoration: 'none' }}
                  >
                    {t('shop.sidebar.viewAll')}
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
                        className={`list-group-item list-group-item-action border-0 py-1 ${selectedCategory === category.name ? 'active bg-dark text-white' : ''}`}
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
                  <label className="form-label fw-bold mb-0" style={{ fontSize: '0.9rem' }}>{t('shop.sidebar.authorsLabel')}</label>
                  <button
                    className="btn btn-link btn-sm p-0"
                    onClick={handleToggleAuthorCards}
                    style={{ fontSize: '0.8rem', textDecoration: 'none' }}
                  >
                    {t('shop.sidebar.viewAll')}
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
                        className={`list-group-item list-group-item-action border-0 py-1 ${selectedAuthor === author.name ? 'active bg-dark text-white' : ''}`}
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
                <label className="form-label fw-bold mb-2" style={{ fontSize: '0.9rem' }}>{t('shop.sidebar.priceLabel')}</label>
                <div className="row g-2">
                  <div className="col-6">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder={t('shop.sidebar.minPlaceholder')}
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
                      placeholder={t('shop.sidebar.maxPlaceholder')}
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
                  {t('shop.sidebar.reset')}
                </button>
              </div>

              {/* Refresh Data Button */}
              <div className="d-grid">
                <button
                  className="btn btn-outline-dark btn-sm"
                  onClick={handleRefreshData}
                  disabled={loading}
                  style={{ fontSize: '0.8rem' }}
                >
                  <FontAwesomeIcon icon={faSearch} className="me-1" />
                  {loading ? t('shop.sidebar.refreshLoading') : t('shop.sidebar.refresh')}
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
                {t('shop.header.results', { count: filteredProducts.length })}
                {products && Array.isArray(products) && (
                  <span className="text-muted ms-2">
                    {t('shop.header.summary', {
                      books: products.length,
                      categories: categories && Array.isArray(categories) ? categories.length : 0
                    })}
                  </span>
                )}
              </h6>
              
              {/* Active Filters Display */}
              {(selectedCategory || selectedAuthor || searchQuery) && (
                <div className="mt-2">
                  <small className="text-muted me-2">{t('shop.header.activeFilters')}</small>
                  {selectedCategory && (
                    <span className="badge bg-primary me-1">
                       {selectedCategory}
                      <button 
                        className="btn-close btn-close-white ms-1" 
                        style={{ fontSize: '0.6rem' }}
                        onClick={() => setSelectedCategory('')}
                        title={t('shop.filterBadges.clearCategory')}
                      ></button>
                    </span>
                  )}
                  {selectedAuthor && (
                    <span className="badge bg-success me-1">
                      {selectedAuthor}
                      <button 
                        className="btn-close btn-close-white ms-1" 
                        style={{ fontSize: '0.6rem' }}
                        onClick={() => setSelectedAuthor('')}
                        title={t('shop.filterBadges.clearAuthor')}
                      ></button>
                    </span>
                  )}
                  {searchQuery && (
                    <span className="badge bg-warning text-dark me-1">
                       "{searchQuery}"
                      <button 
                        className="btn-close ms-1" 
                        style={{ fontSize: '0.6rem' }}
                        onClick={() => setSearchQuery('')}
                        title={t('shop.filterBadges.clearSearch')}
                      ></button>
                    </span>
                  )}
                  <button 
                    className="btn btn-sm btn-outline-secondary ms-2"
                    onClick={handleResetFilters}
                    title={t('shop.filterBadges.clearAll')}
                  >
                    <FontAwesomeIcon icon={faTimes} className="me-1" />
                    {t('shop.header.clearAll')}
                  </button>
                </div>
              )}
            </div>
            <div className="d-flex align-items-center">
              <label className="form-label me-2 mb-0">{t('shop.header.sortLabel')}</label>
              <select
                className="form-select form-select-sm"
                style={{ width: 'auto' }}
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [newSortBy, newSortOrder] = e.target.value.split('-');
                  setSortBy(newSortBy);
                  setSortOrder(newSortOrder);
                  setCurrentProductPage(1); // Reset to first page when sorting
                }}
              >
                <option value="created_at-desc">{t('shop.header.sortOptions.default')}</option>
                <option value="price-asc">{t('shop.header.sortOptions.priceAsc')}</option>
                <option value="price-desc">{t('shop.header.sortOptions.priceDesc')}</option>
                <option value="title-asc">{t('shop.header.sortOptions.titleAsc')}</option>
                <option value="title-desc">{t('shop.header.sortOptions.titleDesc')}</option>
                <option value="rating-desc">{t('shop.header.sortOptions.ratingDesc')}</option>
                <option value="rating-asc">{t('shop.header.sortOptions.ratingAsc')}</option>
              </select>
            </div>
          </div>

          {showAllCategories ? (
            // All Categories Grid View - Giống như hình ảnh
            <div>
              <h2 className="fw-bold text-dark mb-4">{t('shop.categories.title')}</h2>
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
                            {t('shop.categories.bookCount', { count: bookCount })}
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
              <h2 className="fw-bold text-dark mb-4">{t('shop.categories.authorsTitle')}</h2>
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
                            {t('shop.categories.authorCount', { count: author.book_count || 0 })}
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
                          {t('shop.categories.pagination.prev')}
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
                          {t('shop.categories.pagination.next')}
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              )}

              {/* Author count info */}
              <div className="text-center mt-3">
                <small className="text-muted">
                  {t('shop.categories.pagination.range', {
                    start: ((currentAuthorPage - 1) * authorsPerPage) + 1,
                    end: Math.min(currentAuthorPage * authorsPerPage, authors.length),
                    total: authors.length
                  })}
                </small>
              </div>
            </div>
          ) : (
            // Products Grid View
            <div>
              {filteredProducts.length > 0 ? (
                <>
                  <div className="row">
                    {paginatedProducts && Array.isArray(paginatedProducts) && paginatedProducts.map((product) => {
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
                                <span className="badge bg-dark">{t('shop.products.saleBadge')}</span>
                              </div>
                              <div className="position-absolute top-0 start-0 p-2">
                                <button
                                  className="btn btn-sm btn-light rounded-circle"
                                  onClick={(e) => handleAddToWishlist(e, product.book_id)}
                                  title={t('shop.products.addToWishlist')}
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
                                    className="btn btn-dark btn-sm rounded-circle"
                                    onClick={(e) => handleAddToCart(e, product.book_id)}
                                    title={t('shop.products.addToCart')}
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
                                  return author ? author.name : t('shop.products.unknownAuthorById', { id: product.author_id });
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
                                <small className="text-muted">{t('home.badges.ratingCount', { count: product.review_count ?? product.reviewCount ?? 0 })}</small>
                              </div>
                              <div className="mt-auto">
                                <p className="card-text fw-bold text-dark mb-2" style={{ fontSize: '1.1rem' }}>
                                  {formatPrice(product.price)}
                                </p>
                                <button
                                  className="btn btn-outline-dark btn-sm w-100"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleProductClick(product.book_id);
                                  }}
                                >
                                  {t('shop.products.viewDetails')}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Products Pagination */}
                  {totalProductPages > 1 && (
                    <div className="d-flex justify-content-center mt-4 mb-3">
                      <nav aria-label="Products pagination">
                        <ul className="pagination" style={{
                          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          backgroundColor: 'white'
                        }}>
                          {/* Previous Button */}
                          <li className={`page-item ${currentProductPage === 1 ? 'disabled' : ''}`}>
                            <button
                              className="page-link border-0"
                              onClick={() => handleProductPageChange(currentProductPage - 1)}
                              disabled={currentProductPage === 1}
                              style={{
                                backgroundColor: currentProductPage === 1 ? '#f8f9fa' : 'white',
                                color: currentProductPage === 1 ? '#6c757d' : '#212529',
                                fontWeight: '500',
                                padding: '8px 12px',
                                transition: 'all 0.3s ease',
                                border: 'none'
                              }}
                              onMouseEnter={(e) => {
                                if (currentProductPage !== 1) {
                                  e.target.style.backgroundColor = '#212529';
                                  e.target.style.color = 'white';
                                  e.target.style.transform = 'translateY(-1px)';
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (currentProductPage !== 1) {
                                  e.target.style.backgroundColor = 'white';
                                  e.target.style.color = '#212529';
                                  e.target.style.transform = 'translateY(0)';
                                }
                              }}
                            >
                              <i className="fas fa-chevron-left me-1"></i>
                              {t('shop.pagination.prev')}
                            </button>
                          </li>

                          {/* Page Numbers with Smart Display */}
                          {(() => {
                            const pages = [];
                            const maxVisiblePages = 7;
                            let startPage = Math.max(1, currentProductPage - Math.floor(maxVisiblePages / 2));
                            let endPage = Math.min(totalProductPages, startPage + maxVisiblePages - 1);

                            if (endPage - startPage + 1 < maxVisiblePages) {
                              startPage = Math.max(1, endPage - maxVisiblePages + 1);
                            }

                            // Add first page and ellipsis if needed
                            if (startPage > 1) {
                              pages.push(
                                <li key={1} className="page-item">
                                  <button
                                    className="page-link border-0"
                                    onClick={() => handleProductPageChange(1)}
                                    style={{
                                      backgroundColor: 'white',
                                      color: '#212529',
                                      fontWeight: '500',
                                      padding: '8px 12px',
                                      transition: 'all 0.3s ease',
                                      border: 'none'
                                    }}
                                    onMouseEnter={(e) => {
                                      e.target.style.backgroundColor = '#212529';
                                      e.target.style.color = 'white';
                                      e.target.style.transform = 'translateY(-1px)';
                                    }}
                                    onMouseLeave={(e) => {
                                      e.target.style.backgroundColor = 'white';
                                      e.target.style.color = '#212529';
                                      e.target.style.transform = 'translateY(0)';
                                    }}
                                  >
                                    1
                                  </button>
                                </li>
                              );

                              if (startPage > 2) {
                                pages.push(
                                  <li key="ellipsis1" className="page-item disabled">
                                    <span className="page-link border-0" style={{
                                      backgroundColor: 'white',
                                      color: '#6c757d',
                                      padding: '12px 8px',
                                      border: 'none'
                                    }}>
                                      {t('shop.pagination.ellipsis')}
                                    </span>
                                  </li>
                                );
                              }
                            }

                            // Add visible pages
                            for (let i = startPage; i <= endPage; i++) {
                              pages.push(
                                <li key={i} className={`page-item ${currentProductPage === i ? 'active' : ''}`}>
                                  <button
                                    className="page-link border-0"
                                    onClick={() => handleProductPageChange(i)}
                                    style={{
                                      backgroundColor: currentProductPage === i ? '#212529' : 'white',
                                      color: currentProductPage === i ? 'white' : '#212529',
                                      fontWeight: currentProductPage === i ? '600' : '500',
                                      padding: '8px 12px',
                                      transition: 'all 0.3s ease',
                                      border: 'none',
                                      boxShadow: currentProductPage === i ? '0 4px 8px rgba(0,123,255,0.3)' : 'none'
                                    }}
                                    onMouseEnter={(e) => {
                                      if (currentProductPage !== i) {
                                        e.target.style.backgroundColor = '#212529';
                                        e.target.style.color = 'white';
                                        e.target.style.transform = 'translateY(-1px)';
                                        e.target.style.boxShadow = '0 4px 8px rgba(0,123,255,0.3)';
                                      }
                                    }}
                                    onMouseLeave={(e) => {
                                      if (currentProductPage !== i) {
                                        e.target.style.backgroundColor = 'white';
                                        e.target.style.color = '#212529';
                                        e.target.style.transform = 'translateY(0)';
                                        e.target.style.boxShadow = 'none';
                                      }
                                    }}
                                  >
                                    {i}
                                  </button>
                                </li>
                              );
                            }

                            // Add last page and ellipsis if needed
                            if (endPage < totalProductPages) {
                              if (endPage < totalProductPages - 1) {
                                pages.push(
                                  <li key="ellipsis2" className="page-item disabled">
                                    <span className="page-link border-0" style={{
                                      backgroundColor: 'white',
                                      color: '#6c757d',
                                      padding: '12px 8px',
                                      border: 'none'
                                    }}>
                                      {t('shop.pagination.ellipsis')}
                                    </span>
                                  </li>
                                );
                              }

                              pages.push(
                                <li key={totalProductPages} className="page-item">
                                  <button
                                    className="page-link border-0"
                                    onClick={() => handleProductPageChange(totalProductPages)}
                                    style={{
                                      backgroundColor: 'white',
                                      color: '#212529',
                                      fontWeight: '500',
                                      padding: '8px 12px',
                                      transition: 'all 0.3s ease',
                                      border: 'none'
                                    }}
                                    onMouseEnter={(e) => {
                                      e.target.style.backgroundColor = '#212529';
                                      e.target.style.color = 'white';
                                      e.target.style.transform = 'translateY(-1px)';
                                    }}
                                    onMouseLeave={(e) => {
                                      e.target.style.backgroundColor = 'white';
                                      e.target.style.color = '#212529';
                                      e.target.style.transform = 'translateY(0)';
                                    }}
                                  >
                                    {totalProductPages}
                                  </button>
                                </li>
                              );
                            }

                            return pages;
                          })()}

                          {/* Next Button */}
                          <li className={`page-item ${currentProductPage === totalProductPages ? 'disabled' : ''}`}>
                            <button
                              className="page-link border-0"
                              onClick={() => handleProductPageChange(currentProductPage + 1)}
                              disabled={currentProductPage === totalProductPages}
                              style={{
                                backgroundColor: currentProductPage === totalProductPages ? '#f8f9fa' : 'white',
                                color: currentProductPage === totalProductPages ? '#6c757d' : '#212529',
                                fontWeight: '500',
                                padding: '8px 12px',
                                transition: 'all 0.3s ease',
                                border: 'none'
                              }}
                              onMouseEnter={(e) => {
                                if (currentProductPage !== totalProductPages) {
                                  e.target.style.backgroundColor = '#212529';
                                  e.target.style.color = 'white';
                                  e.target.style.transform = 'translateY(-1px)';
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (currentProductPage !== totalProductPages) {
                                  e.target.style.backgroundColor = 'white';
                                  e.target.style.color = '#212529';
                                  e.target.style.transform = 'translateY(0)';
                                }
                              }}
                            >
                              {t('shop.pagination.next')}
                              <i className="fas fa-chevron-right ms-1"></i>
                            </button>
                          </li>
                        </ul>
                      </nav>
                    </div>
                  )}

                  {/* Product count info */}
                  <div className="text-center mt-4">
                    <div className="d-inline-flex align-items-center bg-light rounded-pill px-4 py-2" style={{
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      border: '1px solid #e9ecef'
                    }}>
                      <i className="fas fa-info-circle text-dark me-2"></i>
                      <span className="text-dark fw-medium">
                        {t('shop.products.paginationRange', {
                          start: ((currentProductPage - 1) * productsPerPage) + 1,
                          end: Math.min(currentProductPage * productsPerPage, filteredProducts.length),
                          total: filteredProducts.length
                        })}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-5">
                  <FontAwesomeIcon icon={faSearch} size="3x" className="text-muted mb-3" />
                  <h4>{t('shop.products.emptyTitle')}</h4>
                  <p className="text-muted">
                    {t('shop.products.emptyDescription')}
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