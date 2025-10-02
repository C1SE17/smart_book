import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faShoppingCart, faHeart, faShare, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import ReviewSection from '../shop/ReviewSection';
import ProductRating from './ProductRating';

const ProductDetail = ({ productId, onNavigateTo, onNavigateToProduct, user = null }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      
      setLoading(true);
      try {
        const { mockApi } = await import('../../../services/mockApi');
        const productData = await mockApi.getBookById(productId);
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

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      if (!productId) return;
      
      setReviewsLoading(true);
      try {
        const { mockApi } = await import('../../../services/mockApi');
        const reviewsData = await mockApi.getReviewsByBookId(productId);
        setReviews(reviewsData);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setReviews([]);
      } finally {
        setReviewsLoading(false);
      }
    };

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
  const handleAddToCart = () => {
    if (user) {
      // TODO: Implement add to cart with user authentication
      console.log('Add to cart:', productId, quantity);
    } else {
      // Redirect to login
      onNavigateTo('auth')();
    }
  };

  // Handle add to wishlist
  const handleAddToWishlist = () => {
    if (user) {
      // TODO: Implement add to wishlist
      console.log('Add to wishlist:', productId);
    } else {
      // Redirect to login
      onNavigateTo('auth')();
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
            onClick={() => onNavigateTo('home')()}
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
              onClick={() => onNavigateTo('home')()}
            >
              Trang chủ
            </button>
          </li>
          <li className="breadcrumb-item">
            <button 
              className="btn btn-link p-0 text-decoration-none"
              onClick={() => onNavigateTo('books')()}
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
              style={{ width: '100%', maxHeight: '500px', objectFit: 'cover' }}
              onError={(e) => {
                e.target.src = '/images/book1.jpg';
              }}
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="col-lg-6">
          <div className="product-info">
            <h1 className="product-title mb-3">{product.title}</h1>
            
            <div className="product-meta mb-3">
              <p className="text-muted mb-1">
                <strong>Tác giả:</strong> {product.author}
              </p>
              <p className="text-muted mb-1">
                <strong>Nhà xuất bản:</strong> {product.publisher}
              </p>
              <p className="text-muted mb-1">
                <strong>Danh mục:</strong> {product.category}
              </p>
            </div>

            {/* Rating */}
            <div className="product-rating mb-3">
              <div className="d-flex align-items-center">
                <div className="me-2">
                  {renderStars(product.rating || 0)}
                </div>
                <span className="text-muted">
                  ({product.reviewCount || 0} đánh giá)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="product-price mb-4">
              <h2 className="text-primary mb-0">{formatPrice(product.price)}</h2>
              <small className="text-muted">
                Còn {product.stock} cuốn trong kho
              </small>
            </div>

            {/* Quantity and Actions */}
            <div className="product-actions mb-4">
              <div className="row align-items-center">
                <div className="col-md-4">
                  <label className="form-label">Số lượng:</label>
                  <input
                    type="number"
                    className="form-control"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={handleQuantityChange}
                  />
                </div>
                <div className="col-md-8">
                  <div className="d-grid gap-2 d-md-flex">
                    <button
                      className="btn btn-primary btn-lg flex-fill"
                      onClick={handleAddToCart}
                      disabled={product.stock === 0}
                    >
                      <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
                      {product.stock === 0 ? 'Hết hàng' : 'Thêm vào giỏ'}
                    </button>
                    <button
                      className="btn btn-outline-danger"
                      onClick={handleAddToWishlist}
                      title="Thêm vào yêu thích"
                    >
                      <FontAwesomeIcon icon={faHeart} />
                    </button>
                    <button
                      className="btn btn-outline-secondary"
                      onClick={handleShare}
                      title="Chia sẻ"
                    >
                      <FontAwesomeIcon icon={faShare} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="product-description">
              <h5>Mô tả sản phẩm</h5>
              <p className="text-muted">{product.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="row mt-5">
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
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;