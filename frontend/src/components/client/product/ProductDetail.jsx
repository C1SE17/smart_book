import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faShoppingCart, faHeart, faShare, faArrowLeft, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import ReviewSection from '../shop/ReviewSection';
import ProductRating from './ProductRating';

const ProductDetail = ({ productId, onNavigateTo, onNavigateToProduct, user = null }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
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
      if (!productId) return;

      setLoading(true);
      try {
        // TODO: Use real API
        // const { bookApi } = await import('../../../services/bookApi');
        // const productData = await bookApi.getBookById(productId);

        // Mock data for now
        const productData = { success: true, data: { book_id: productId, title: 'Sample Book', price: 100000 } };
        setProduct(productData);
      } catch (error) {
        console.error('Error fetching product:', error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // Fetch recommendations
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        // TODO: Use real API
        // const { bookApi } = await import('../../../services/bookApi');
        // const response = await bookApi.getBooks({ limit: 4 });
        const response = { success: true, data: [] };
        setRecommendations(response.data);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        setRecommendations([]);
      }
    };

    fetchRecommendations();
  }, []);

  // Fetch reviews
  const fetchReviews = async () => {
    if (!productId) return;

    setReviewsLoading(true);
    try {
      // TODO: Use real API
      // const { reviewApi } = await import('../../../services/reviewApi');
      // const reviewsData = await reviewApi.getReviewsByBookId(productId);
      const reviewsData = { success: true, data: [] };
      setReviews(reviewsData);
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

  // Handle add to cart
  const handleAddToCart = async () => {
    console.log('Current user state:', user);
    console.log('User from localStorage:', localStorage.getItem('user'));

    if (!user) {
      console.log('User not logged in');
      showToast('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.', 'error');
      onNavigateTo('auth');
      return;
    }
    if (!product) {
      console.log('No product available');
      return;
    }

    try {
      console.log('Adding to cart:', { userId: user.user_id, bookId: product.book_id, quantity });
      // TODO: Use real cart API
      // const { cartApi } = await import('../../../services/cartApi');
      // await cartApi.addToCart(user.user_id, product.book_id, quantity);
      console.log('Successfully added to cart');
      showToast(`${quantity} x "${product.title}" đã được thêm vào giỏ hàng!`, 'success');

      // Dispatch event to update cart count in menu
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch (error) {
      console.error('Error adding to cart:', error);
      showToast('Không thể thêm sản phẩm vào giỏ hàng.', 'error');
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
      showToast('Vui lòng đăng nhập để thanh toán.', 'error');
      onNavigateTo('auth');
      return;
    }
    if (!product) return;

    try {
      // Add to cart first
      await handleAddToCart();

      // Show success message
      showToast('Đã thêm sản phẩm vào giỏ hàng!', 'success');

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
      showToast('Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng.', 'error');
    }
  };

  // Handle book click in recommendations
  const handleBookClick = (bookId) => {
    if (onNavigateToProduct) {
      onNavigateToProduct(bookId);
    } else {
      // Fallback: navigate to product page
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
      alert('Link đã được sao chép!');
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
            <span className="visually-hidden">Đang tải...</span>
          </div>
          <p className="mt-3">Đang tải thông tin sản phẩm...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-4">
        <div className="text-center py-5">
          <FontAwesomeIcon icon={faShoppingCart} size="3x" className="text-muted mb-3" />
          <h4>Sản phẩm không tồn tại</h4>
          <p className="text-muted">Không tìm thấy sản phẩm với ID này.</p>
          <button
            className="btn btn-primary"
            onClick={() => onNavigateTo('home')}
          >
            <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
            Quay về trang chủ
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
              Trang chủ
            </button>
          </li>
          <li className="breadcrumb-item">
            <button
              className="btn btn-link p-0 text-decoration-none"
              onClick={() => onNavigateTo('books')}
            >
              Sách
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
            <img
              src={product.cover_image}
              className="img-fluid rounded shadow"
              alt={product.title}
              style={{ width: '100%', maxHeight: '500px', objectFit: 'contain' }}
              onError={(e) => {
                e.target.src = '/images/book1.jpg';
              }}
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="col-lg-6">
          <div className="product-info">
            <h2 className="product-title mb-2" style={{ fontSize: '1.5rem' }}>{product.title}</h2>

            <div className="product-meta mb-2">
              <p className="text-muted mb-1 small">
                <strong>Tác giả:</strong> {product.author}
              </p>
              <p className="text-muted mb-1 small">
                <strong>Nhà xuất bản:</strong> {product.publisher}
              </p>
              <p className="text-muted mb-1 small">
                <strong>Danh mục:</strong> {product.category}
              </p>
            </div>

            {/* Rating */}
            <div className="product-rating mb-2">
              <div className="d-flex align-items-center">
                <div className="me-2">
                  {renderStars(product.rating || 0)}
                </div>
                <span className="text-muted small">
                  {product.rating || 0} ({product.reviewCount || 0} đánh giá)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="product-price mb-3">
              <h3 className="text-dark mb-0 fw-bold" style={{ fontSize: '1.5rem' }}>{formatPrice(product.price)}</h3>
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
                  max={product.stock}
                  value={quantity}
                  onChange={handleQuantityChange}
                  style={{ width: '50px', height: '35px', fontSize: '0.9rem' }}
                />
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
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
                  disabled={product.stock === 0}
                  style={{ height: '40px', fontSize: '1rem' }}
                >
                  <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
                  Thêm giỏ hàng
                </button>
                <button
                  className="btn btn-success"
                  onClick={handleCheckout}
                  disabled={product.stock === 0}
                  style={{ height: '40px', fontSize: '1rem' }}
                >
                  Thanh toán
                </button>
              </div>
            </div>

            {/* Product Meta */}
            <div className="product-meta mb-3">
              <div className="row">
                <div className="col-6">
                  <small className="text-muted">
                    <strong>Author:</strong> {product.author}
                  </small>
                </div>
                <div className="col-6">
                  <small className="text-muted">
                    <strong>Company:</strong> {product.publisher}
                  </small>
                </div>
                <div className="col-12 mt-1">
                  <small className="text-muted">
                    <strong>Tags:</strong> book
                  </small>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="product-description">
              <h6 className="fw-bold mb-2">Description</h6>
              <p className="text-muted small">{product.description}</p>
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
                Mô tả chi tiết
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
                Đánh giá ({product.reviewCount || 0})
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
              <div className="p-4">
                <h5>Thông tin chi tiết</h5>
                <div className="row">
                  <div className="col-md-6">
                    <table className="table table-borderless">
                      <tbody>
                        <tr>
                          <td><strong>Tác giả:</strong></td>
                          <td>{product.author}</td>
                        </tr>
                        <tr>
                          <td><strong>Nhà xuất bản:</strong></td>
                          <td>{product.publisher}</td>
                        </tr>
                        <tr>
                          <td><strong>Danh mục:</strong></td>
                          <td>{product.category}</td>
                        </tr>
                        <tr>
                          <td><strong>Ngày xuất bản:</strong></td>
                          <td>{new Date(product.published_date).toLocaleDateString('vi-VN')}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="col-md-6">
                    <table className="table table-borderless">
                      <tbody>
                        <tr>
                          <td><strong>Giá:</strong></td>
                          <td className="text-primary fw-bold">{formatPrice(product.price)}</td>
                        </tr>
                        <tr>
                          <td><strong>Tình trạng:</strong></td>
                          <td>
                            <span className={`badge ${product.stock > 0 ? 'bg-success' : 'bg-danger'}`}>
                              {product.stock > 0 ? 'Còn hàng' : 'Hết hàng'}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td><strong>Số lượng còn lại:</strong></td>
                          <td>{product.stock} cuốn</td>
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
              <div className="p-4">
                <ReviewSection
                  productId={productId}
                  reviews={reviews}
                  loading={reviewsLoading}
                  user={user}
                  onAddReview={fetchReviews}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations Section */}
      <div className="recommendations-section mt-5">
        <div className="container-fluid">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-bold mb-0">Sách gợi ý</h4>
            <a href="#" className="text-decoration-none text-dark fw-medium">
              Xem tất cả <span className="ms-1">→</span>
            </a>
          </div>

          <div className="row">
            {recommendations.map((book) => (
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
                      <p className="card-text fw-bold text-primary mb-2" style={{ fontSize: '1.1rem' }}>
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
