import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faShoppingCart, faHeart, faShare, faArrowLeft, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import ReviewSection from '../shop/ReviewSection';
import ProductRating from './ProductRating';
import ErrorBoundary from '../../common/ErrorBoundary/ErrorBoundary';
import { useLanguage } from '../../../contexts/LanguageContext';

const ProductDetail = ({ productId, onNavigateTo, onNavigateToProduct, user = null }) => {
  const { t } = useLanguage();
  console.log(' Component rendered with productId:', productId, 'type:', typeof productId);
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [recommendations, setRecommendations] = useState([]);
  const [recommendationsLoading, setRecommendationsLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Show toast notification
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        console.log(' No productId provided');
        setLoading(false);
        return;
      }

      console.log('  Fetching product with ID:', productId);
      setLoading(true);
      try {
        const bookApi = await import('../../../services/bookApi.js');
        // Ensure productId is a number
        const numericId = parseInt(productId);
        console.log('  Converted ID to number:', numericId);
        const response = await bookApi.default.getBookById(numericId);

        console.log(' Product API response:', response);

        if (response && response.success && response.data) {
          setProduct(response.data);
          console.log(' Product loaded successfully:', response.data.title);
          console.log(' Product data:', {
            book_id: response.data.book_id,
            title: response.data.title,
            cover_image: response.data.cover_image,
            price: response.data.price,
            author_name: response.data.author_name,
            category_name: response.data.category_name
          });
        } else {
          console.error(' Error fetching product:', response);
          setProduct(null);
        }
      } catch (error) {
        console.error(' Error fetching product:', error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // Tracking thời gian xem sản phẩm
  useEffect(() => {
    let startTs = Date.now();
    return () => { 
      if (!product) return;
      const durationSec = Math.max(0, Math.floor((Date.now() - startTs) / 1000));
      if (durationSec >= 10) {
        (async () => {
          try {
            const api = (await import('../../../services/api')).default;
            await api.trackProductView({
              productId: product.book_id,
              productName: product.title,
              viewDuration: durationSec
            });
          } catch (e) {
            console.warn('Tracking product view failed:', e?.message || e);
          }
        })();
      }
    };
  }, [product]);

  // Fetch recommendations
  useEffect(() => {
    const fetchRecommendations = async () => {
      setRecommendationsLoading(true);
      try {
        const bookApi = await import('../../../services/bookApi.js');
        const response = await bookApi.default.getBooks({ limit: 4 });

        console.log('Recommendations API response:', response);

        if (response && response.success && Array.isArray(response.data)) {
          setRecommendations(response.data);
        } else {
          console.error('Error fetching recommendations:', response);
          setRecommendations([]);
        }
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        setRecommendations([]);
      } finally {
        setRecommendationsLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  // Fetch reviews
  const fetchReviews = async () => {
    if (!productId) return;

    setReviewsLoading(true);
    try {
      const reviewApi = await import('../../../services/reviewApi.js');
      const reviewsData = await reviewApi.default.getReviews({ book_id: productId });

      console.log('Reviews API response:', reviewsData);

      if (reviewsData && reviewsData.success && Array.isArray(reviewsData.data)) {
        setReviews(reviewsData.data);
        setTotalReviews(reviewsData.data.length);
        console.log('Set total reviews:', reviewsData.data.length);
      } else {
        console.error('Error fetching reviews:', reviewsData);
        setReviews([]);
        setTotalReviews(0);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  // Handle quantity change
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= (product?.stock || 0)) {
      setQuantity(value);
    }
  };

  // Handle add to cart (supports optional event and specific item when called from recommendations)
  const handleAddToCart = async (e, specificItem) => {
    if (e && typeof e.stopPropagation === 'function') {
      e.stopPropagation();
    }
    
    // Kiểm tra user đã đăng nhập chưa - kiểm tra chặt chẽ hơn
    let currentUser = user;
    if (!currentUser) {
      try {
        const userStr = localStorage.getItem('user');
        if (userStr && userStr !== 'null' && userStr !== 'undefined') {
          currentUser = JSON.parse(userStr);
        }
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        currentUser = null;
      }
    }

    // Kiểm tra user có hợp lệ không (phải là object và có user_id)
    if (!currentUser || typeof currentUser !== 'object' || !currentUser.user_id) {
      console.log('User not logged in');
      showToast(t('home.messages.loginRequired'), 'error');
      onNavigateTo('auth');
      return;
    }
    if (currentUser.role === 'admin') {
      showToast('Admin không thể thêm sản phẩm vào giỏ.', 'warning');
      return;
    }
    const item = specificItem || product;
    if (!item) {
      console.log('No product available');
      return;
    }

    try {
      const qty = specificItem ? 1 : quantity;
      console.log('Adding to cart:', { userId: currentUser.user_id, bookId: item.book_id, quantity: qty });
      
      // Add to cart using localStorage
      const cartKey = `cart_${currentUser.user_id}`;
      const existingCart = JSON.parse(localStorage.getItem(cartKey) || '[]');
      const existingItem = existingCart.find(ci => ci.book_id === item.book_id);

      if (existingItem) {
        // Update existing item quantity
        existingItem.quantity += qty;
        const updatedCart = existingCart.map(item =>
          item.book_id === existingItem.book_id ? existingItem : item
        );
        localStorage.setItem(cartKey, JSON.stringify(updatedCart));
      } else {
        // Add new item to cart
        const newItem = {
          book_id: item.book_id,
          title: item.title,
          price: item.price,
          quantity: qty,
          cover_image: item.cover_image,
          author_name: item.author_name,
          author: item.author,
          category_name: item.category_name,
          publisher_name: item.publisher_name
        };
        const updatedCart = [...existingCart, newItem];
        localStorage.setItem(cartKey, JSON.stringify(updatedCart));
      }

      console.log('Successfully added to cart');
      showToast(
        t('productDetail.toasts.addedToCart', {
          quantity: specificItem ? 1 : qty,
          title: item.title
        }),
        'success'
      );

      // Dispatch event to update cart count in menu
      window.dispatchEvent(new CustomEvent('cartUpdated'));

      // Tracking thêm giỏ hàng
      try {
        const api = (await import('../../../services/api')).default;
        await api.trackCartAction({
          productId: item.book_id,
          productName: item.title,
          action: 'add',
          quantity: specificItem ? 1 : qty
        });
      } catch (e) {
        console.warn('Tracking cart add failed:', e?.message || e);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      showToast(t('home.messages.addFailed'), 'error');
    }
  };

  // Handle add to wishlist
  const handleAddToWishlist = () => {
    if (user) {
      // TODO: Implement add to wishlist
      console.log('Add to wishlist:', productId);
    } else {
      // Redirect to login
      onNavigateTo('auth');
    }
  };

  // Handle checkout
  const handleCheckout = async () => {
    if (!user) {
      showToast(t('productDetail.messages.loginRequiredCheckout'), 'error');
      onNavigateTo('auth');
      return;
    }
    if (user.role === 'admin') {
      showToast('Admin không thể thanh toán.', 'warning');
      return;
    }
    if (!product) return;

    try {
      // Add to cart first
      await handleAddToCart();

      // Show success message
      showToast(
        t('productDetail.toasts.addedToCart', {
          quantity,
          title: product.title
        }),
        'success'
      );

      // Create checkout item for immediate checkout
      const checkoutItem = {
        book_id: product.book_id,
        title: product.title,
        price: product.price,
        quantity: quantity,
        cover_image: product.cover_image,
        author: product.author,
        publisher: product.publisher
      };

      // Save to sessionStorage for checkout
      sessionStorage.setItem('checkoutItems', JSON.stringify([checkoutItem]));

      // Navigate to checkout page
      onNavigateTo('checkout');
    } catch (error) {
      console.error('Error in checkout:', error);
      showToast(t('home.messages.addFailed'), 'error');
    }
  };

  // Handle book click in recommendations
  const handleBookClick = async (bookId) => {
    try {
      const api = (await import('../../../services/api')).default;
      const rec = recommendations.find(r => r && r.book_id === bookId);
      await api.trackProductView({
        productId: bookId,
        productName: rec?.title || 'Unknown',
        viewDuration: 0
      });
    } catch (e) {
      console.warn('Tracking product click (recommendations) failed:', e?.message || e);
    }

    if (onNavigateToProduct) {
      onNavigateToProduct(bookId);
    } else {
      window.location.href = `/product?id=${bookId}`;
    }
  };

  // Handle share
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.title,
        text: product?.description,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert(t('productDetail.messages.linkCopied'));
    }
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

  if (loading) {
    return (
      <div className="container py-4">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">{t('shop.states.loading')}</span>
          </div>
          <p className="mt-3">{t('productDetail.states.loadingMessage')}</p>
          {productId && (
            <small className="text-muted">
              {t('productDetail.states.loadingId', { id: productId })}
            </small>
          )}
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-4">
        <div className="text-center py-5">
          <FontAwesomeIcon icon={faShoppingCart} size="3x" className="text-muted mb-3" />
          <h4>{t('productDetail.states.notFoundTitle')}</h4>
          <p className="text-muted">{t('productDetail.states.notFoundDescription')}</p>
          <button
            className="btn btn-primary"
            onClick={() => onNavigateTo('home')}
          >
            <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
            {t('productDetail.actions.backHome')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <button
              className="btn btn-link p-0 text-decoration-none"
              onClick={() => onNavigateTo('home')}
            >
              {t('nav.home')}
            </button>
          </li>
          <li className="breadcrumb-item">
            <button
              className="btn btn-link p-0 text-decoration-none"
              onClick={() => onNavigateTo('books')}
            >
              {t('productDetail.breadcrumb.shop')}
            </button>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {product.title}
          </li>
        </ol>
      </nav>

      <div className="row">
        {/* Product Image */}
        <div className="col-lg-6">
          <div className="product-image-container">
            {product.cover_image && product.cover_image.trim() !== '' ? (
              <img
                src={product.cover_image}
                className="img-fluid rounded shadow"
                alt={product.title}
                style={{ width: '100%', maxHeight: '500px', objectFit: 'contain' }}
                onError={(e) => {
                  console.log(' Image failed to load:', product.cover_image);
                }}
                onLoad={() => {
                  console.log(' Image loaded successfully:', product.cover_image);
                }}
              />
            ) : (
              <div 
                className="d-flex align-items-center justify-content-center rounded shadow"
                style={{ 
                  width: '100%', 
                  height: '500px',
                  backgroundColor: 'var(--bg-secondary)'
                }}
              >
                <div className="text-center">
                  <i className="fas fa-book fa-5x text-muted mb-3"></i>
                  <h5 className="text-muted">{product.title}</h5>
                  <p className="text-muted small">{t('productDetail.states.noImage')}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="col-lg-6">
          <div className="product-info">
            <h2 className="product-title mb-2" style={{ fontSize: '1.5rem' }}>{product.title}</h2>

            <div className="product-meta mb-2">
              <p className="text-muted mb-1 small">
                <strong>{t('productDetail.meta.author')}</strong>{' '}
                {product.author_name || t('productDetail.info.notAvailable')}
              </p>
              <p className="text-muted mb-1 small">
                <strong>{t('productDetail.meta.publisher')}</strong>{' '}
                {product.publisher_name || t('productDetail.info.notAvailable')}
              </p>
              <p className="text-muted mb-1 small">
                <strong>{t('productDetail.meta.category')}</strong>{' '}
                {product.category_name || t('productDetail.info.notAvailable')}
              </p>
            </div>

            {/* Rating */}
            <div className="product-rating mb-2">
              <div className="d-flex align-items-center">
                <div className="me-2">
                  {renderStars(product.rating || 0)}
                </div>
                <span className="text-muted small">
                  {product.rating || 0}{' '}
                  {t('productDetail.reviews.summaryCount', { count: totalReviews })}
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="product-price mb-3">
              <h3 className="mb-0 fw-bold" style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>
                {product.price ? formatPrice(product.price) : t('productDetail.info.notAvailable')}
              </h3>
            </div>

            {/* Quantity Selector */}
            <div className="quantity-selector mb-3">
              <div className="d-flex align-items-center" style={{ maxWidth: '180px' }}>
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ width: '35px', height: '35px' }}
                >
                  -
                </button>
                <input
                  className="form-control text-center mx-2"
                  min="1"
                  max={product.stock || 0}
                  value={quantity}
                  onChange={handleQuantityChange}
                  style={{ width: '50px', height: '35px', fontSize: '0.9rem' }}
                />
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => setQuantity(Math.min(product.stock || 0, quantity + 1))}
                  style={{ width: '35px', height: '35px' }}
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="product-actions mb-3">
              <div className="d-grid gap-2">
                <button
                  className="btn btn-dark"
                  onClick={handleAddToCart}
                  disabled={(product.stock || 0) === 0}
                  style={{ height: '40px', fontSize: '1rem' }}
                >
                  <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
                  {t('shop.detail.addToCart')}
                </button>
                <button
                  className="btn btn-success"
                  onClick={handleCheckout}
                  disabled={(product.stock || 0) === 0}
                  style={{ height: '40px', fontSize: '1rem' }}
                >
                  {t('productDetail.actions.checkout')}
                </button>
              </div>
            </div>

            {/* Product Meta */}
            <div className="product-meta mb-3">
              <div className="row">
                <div className="col-6">
                  <small className="text-muted">
                    <strong>{t('productDetail.meta.author')}</strong>{' '}
                    {product.author_name || t('productDetail.info.notAvailable')}
                  </small>
                </div>
                <div className="col-6">
                  <small className="text-muted">
                    <strong>{t('productDetail.meta.publisher')}</strong>{' '}
                    {product.publisher_name || t('productDetail.info.notAvailable')}
                  </small>
                </div>
                <div className="col-12 mt-1">
                  <small className="text-muted">
                    <strong>{t('productDetail.meta.tags')}</strong>{' '}
                    {product.category_name || 'book'}
                  </small>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="product-description">
          <h6 className="fw-bold mb-2">{t('productDetail.sections.description')}</h6>
          <p className="text-muted small">
            {product.description || t('productDetail.info.noDescription')}
          </p>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="row mt-4">
        <div className="col-12">
          <ul className="nav nav-tabs" id="productTabs" role="tablist">
            <li className="nav-item" role="presentation">
              <button
                className="nav-link active"
                id="description-tab"
                data-bs-toggle="tab"
                data-bs-target="#description"
                type="button"
                role="tab"
                aria-controls="description"
                aria-selected="true"
            >
              {t('productDetail.tabs.details')}
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className="nav-link"
                id="reviews-tab"
                data-bs-toggle="tab"
                data-bs-target="#reviews"
                type="button"
                role="tab"
                aria-controls="reviews"
                aria-selected="false"
              >
              {t('shop.detail.reviews')} {t('productDetail.reviews.summaryCount', { count: totalReviews })}
              </button>
            </li>
          </ul>

          <div className="tab-content" id="productTabsContent">
            <div
              className="tab-pane fade show active"
              id="description"
              role="tabpanel"
              aria-labelledby="description-tab"
            >
              <div className="p-4" style={{ backgroundColor: 'transparent' }}>
                <h5 style={{ color: 'var(--text-primary)' }}>{t('productDetail.sections.detailInfo')}</h5>
                <div className="row">
                  <div className="col-md-6">
                    <table className="table table-borderless">
                      <tbody>
                        <tr>
                          <td style={{ color: 'var(--text-primary)' }}><strong>{t('productDetail.meta.author')}</strong></td>
                          <td style={{ color: 'var(--text-primary)' }}>{product.author_name || t('productDetail.info.notAvailable')}</td>
                        </tr>
                        <tr>
                          <td style={{ color: 'var(--text-primary)' }}><strong>{t('productDetail.meta.publisher')}</strong></td>
                          <td style={{ color: 'var(--text-primary)' }}>{product.publisher_name || t('productDetail.info.notAvailable')}</td>
                        </tr>
                        <tr>
                          <td style={{ color: 'var(--text-primary)' }}><strong>{t('productDetail.meta.category')}</strong></td>
                          <td style={{ color: 'var(--text-primary)' }}>{product.category_name || t('productDetail.info.notAvailable')}</td>
                        </tr>
                        <tr>
                          <td style={{ color: 'var(--text-primary)' }}><strong>{t('shop.detail.publishDate')}</strong></td>
                          <td style={{ color: 'var(--text-primary)' }}>
                            {product.published_date
                              ? new Date(product.published_date).toLocaleDateString('vi-VN')
                              : t('productDetail.info.notAvailable')}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="col-md-6">
                    <table className="table table-borderless">
                      <tbody>
                        <tr>
                          <td style={{ color: 'var(--text-primary)' }}><strong>{t('productDetail.info.priceLabel')}</strong></td>
                          <td className="fw-bold" style={{ color: 'var(--link-color)' }}>
                            {product.price ? formatPrice(product.price) : t('productDetail.info.notAvailable')}
                          </td>
                        </tr>
                        <tr>
                          <td style={{ color: 'var(--text-primary)' }}><strong>{t('productDetail.info.statusLabel')}</strong></td>
                          <td>
                            <span className={`badge ${product.stock > 0 ? 'bg-success' : 'bg-danger'}`}>
                              {product.stock > 0 ? t('shop.detail.inStock') : t('shop.detail.outOfStock')}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td style={{ color: 'var(--text-primary)' }}><strong>{t('productDetail.info.remainingQuantity')}</strong></td>
                          <td style={{ color: 'var(--text-primary)' }}>
                            {product.stock || 0} {t('productDetail.info.unitBook')}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="tab-pane fade"
              id="reviews"
              role="tabpanel"
              aria-labelledby="reviews-tab"
            >
              <div className="p-4" style={{ backgroundColor: 'transparent' }}>
                <ErrorBoundary>
                  <ReviewSection
                    productId={productId}
                    reviews={reviews}
                    loading={reviewsLoading}
                    user={user}
                    onAddReview={fetchReviews}
                  />
                </ErrorBoundary>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations Section */}
      <div className="recommendations-section mt-5">
        <div className="container-fluid">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-bold mb-0">{t('shop.detail.recommendations')}</h4>
            <button
              className="btn btn-link text-decoration-none text-dark fw-medium p-0 border-0"
              onClick={() => onNavigateTo('categories')}
              style={{ background: 'none', textAlign: 'left' }}
            >
              {t('home.actions.viewAll')} <span className="ms-1">→</span>
            </button>
          </div>

          <div className="row">
            {recommendationsLoading ? (
              <div className="col-12 text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">{t('shop.states.loading')}</span>
                </div>
                <p className="mt-2 text-muted">{t('productDetail.states.recommendationsLoading')}</p>
              </div>
            ) : (recommendations || []).length > 0 ? (
              (recommendations || []).map((book) => (
                <div key={book.book_id} className="col-lg-3 col-md-6 mb-4">
                  <div className="card h-100 border-0 shadow-sm" style={{
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
                      if (addToCartBtn && (book.stock || 0) > 0) {
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
                      {(book.stock || 0) > 0 && (
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
                            onClick={(e) => handleAddToCart(e, book)}
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
                        {book.title}
                      </h6>
                      <p className="card-text text-muted mb-2" style={{ fontSize: '0.9rem' }}>
                        {book.author_name || t('productDetail.info.notAvailable')}
                      </p>
                      <div className="d-flex align-items-center mb-2">
                        <div className="me-2">
                          {renderStars(book.rating || 0)}
                        </div>
                        <small className="text-muted">({book.review_count ?? book.reviewCount ?? 0})</small>
                      </div>
                      <div className="mt-auto">
                        <p className="card-text fw-bold text-primary mb-2" style={{ fontSize: '1.1rem' }}>
                          {book.price ? formatPrice(book.price) : t('productDetail.info.notAvailable')}
                        </p>
                        <button
                          className="btn btn-outline-primary btn-sm w-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBookClick(book.book_id);
                          }}
                        >
                          {t('shop.products.viewDetails')}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12 text-center py-4">
                <p className="text-muted">{t('productDetail.states.noRecommendations')}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div
          className={`toast-notification ${toast.type === 'success' ? 'toast-success' : 'toast-error'}`}
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 9999,
            minWidth: '300px',
            padding: '16px 20px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            animation: 'slideInRight 0.3s ease-out',
            backgroundColor: toast.type === 'success' ? '#10b981' : '#ef4444',
            color: 'white',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          <FontAwesomeIcon
            icon={toast.type === 'success' ? faCheck : faTimes}
            style={{ fontSize: '16px' }}
          />
          <span>{toast.message}</span>
          <button
            onClick={() => setToast({ show: false, message: '', type: 'success' })}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '18px',
              cursor: 'pointer',
              marginLeft: 'auto',
              padding: '0',
              opacity: '0.8'
            }}
          >
            ×
          </button>
        </div>
      )}

      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default ProductDetail;
