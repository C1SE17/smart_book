import React, { useState, useEffect } from 'react';

const ProductDetail = ({ onBackToHome, onNavigateTo, productId, onViewProduct }) => {
  const id = productId;
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '', name: '' });
  const [relatedBooks, setRelatedBooks] = useState([]);

  useEffect(() => {
    fetchBookDetail();
    fetchRelatedBooks();
    fetchReviews();
  }, [id]);

  const fetchBookDetail = async () => {
    try {
      setLoading(true);
      const bookData = await bookService.getById(id);
      setBook(bookData);
    } catch (err) {
      setError('Không thể tải thông tin sách');
      console.error('Error fetching book:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedBooks = async () => {
    try {
      const books = await bookService.getAll();
      // Get 4 random books as related products
      const shuffled = books.sort(() => 0.5 - Math.random());
      setRelatedBooks(shuffled.slice(0, 4));
    } catch (err) {
      console.error('Error fetching related books:', err);
    }
  };

  const fetchReviews = async () => {
    // Mock reviews data - in real app, this would come from API
    const mockReviews = [
      {
        id: 1,
        rating: 5,
        comment: "It's a really good film! Definitely a must-see!",
        name: "John Doe",
        date: "2024-01-15"
      },
      {
        id: 2,
        rating: 4,
        comment: "Great story and characters. Highly recommended!",
        name: "Jane Smith",
        date: "2024-01-10"
      }
    ];
    setReviews(mockReviews);
  };

  const handleAddToCart = async () => {
    try {
      setAddingToCart(true);
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
        return;
      }
      
      await cartService.addItem(id, quantity, token);
      alert('Đã thêm sản phẩm vào giỏ hàng!');
    } catch (err) {
      alert('Không thể thêm sản phẩm vào giỏ hàng');
      console.error('Error adding to cart:', err);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!newReview.comment.trim() || !newReview.name.trim()) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }
    
    const review = {
      id: reviews.length + 1,
      ...newReview,
      date: new Date().toISOString().split('T')[0]
    };
    
    setReviews([review, ...reviews]);
    setNewReview({ rating: 5, comment: '', name: '' });
    alert('Cảm ơn bạn đã đánh giá!');
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? 'text-warning' : 'text-muted'}>
        ★
      </span>
    ));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8 text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Đang tải thông tin sách...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8 text-center">
            <div className="alert alert-danger" role="alert">
              {error || 'Không tìm thấy sách'}
            </div>
            <button className="btn btn-primary" onClick={onBackToHome}>
              Quay về trang chủ
            </button>
          </div>
        </div>
      </div>
    );
  }

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="container py-5">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <button className="btn btn-link p-0 text-decoration-none" onClick={onBackToHome}>
              Trang chủ
            </button>
          </li>
          <li className="breadcrumb-item">
            <button className="btn btn-link p-0 text-decoration-none" onClick={() => onNavigateTo('search')()}>
              Sách
            </button>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {book.title}
          </li>
        </ol>
      </nav>

      {/* Product Card Layout - People's Choice Style */}
      <div className="row justify-content-center">
        <div className="col-lg-8 col-xl-6">
          <div className="card shadow-sm border-0" style={{ 
            backgroundColor: 'white',
            borderRadius: '12px',
            overflow: 'hidden'
          }}>
            {/* Product Image */}
            <div className="text-center p-4" style={{ backgroundColor: '#f8f9fa' }}>
              <img
                src={book.cover_image || '/images/book1.jpg'}
                alt={book.title}
                className="img-fluid"
                style={{ 
                  maxHeight: '400px', 
                  objectFit: 'contain',
                  borderRadius: '8px'
                }}
              />
            </div>

            {/* Product Info */}
            <div className="card-body p-4">
              {/* Title */}
              <h1 className="h4 fw-bold text-dark mb-2" style={{ fontSize: '1.5rem', lineHeight: '1.3' }}>
                {book.title}
              </h1>
              
              {/* Author */}
              <p className="text-muted mb-3" style={{ fontSize: '0.95rem' }}>
                {book.author_name || 'Tác giả chưa cập nhật'}
              </p>

              {/* Rating */}
              <div className="mb-3">
                <div className="d-flex align-items-center">
                  <div className="me-2">
                    {renderStars(5)}
                  </div>
                  <span className="text-muted small">
                    ({reviews.length} đánh giá)
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="mb-4">
                <h3 className="text-primary fw-bold mb-0" style={{ fontSize: '1.8rem' }}>
                  {formatPrice(book.price)}
                </h3>
              </div>

              {/* Category Badge */}
              <div className="mb-4">
                <span className="badge bg-light text-dark px-3 py-2" style={{ 
                  fontSize: '0.9rem',
                  borderRadius: '20px',
                  border: '1px solid #e9ecef'
                }}>
                  {book.category_name || 'Chưa phân loại'}
                </span>
              </div>

              {/* Description */}
              <div className="mb-4">
                <p className="text-muted" style={{ fontSize: '0.95rem', lineHeight: '1.5' }}>
                  {book.description}
                </p>
              </div>

              {/* Quantity Selector */}
              <div className="mb-4">
                <div className="d-flex align-items-center">
                  <span className="me-3 fw-bold">Số lượng:</span>
                  <div className="input-group" style={{ width: '130px' }}>
                    <button 
                      className="btn btn-outline-secondary btn-sm" 
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      -
                    </button>
                    <input 
                      type="number" 
                      className="form-control text-center" 
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      min="1"
                      max={book.stock}
                      style={{ fontSize: '0.9rem' }}
                    />
                    <button 
                      className="btn btn-outline-secondary btn-sm" 
                      type="button"
                      onClick={() => setQuantity(Math.min(book.stock, quantity + 1))}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="d-grid gap-2 d-md-flex mb-4">
                <button 
                  className="btn btn-dark btn-lg flex-fill"
                  onClick={handleAddToCart}
                  disabled={addingToCart || book.stock === 0}
                  style={{ borderRadius: '8px' }}
                >
                  {addingToCart ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Đang thêm...
                    </>
                  ) : (
                    'Thêm vào giỏ hàng'
                  )}
                </button>
                <button className="btn btn-outline-danger btn-lg" style={{ borderRadius: '8px' }}>
                  <i className="bi bi-heart"></i> Yêu thích
                </button>
              </div>

              {/* Product Metadata */}
              <div className="border-top pt-4">
                <div className="row g-3">
                  <div className="col-6">
                    <div className="d-flex flex-column">
                      <span className="fw-bold small text-muted">Tác giả</span>
                      <span className="text-dark">{book.author_name || 'Chưa cập nhật'}</span>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="d-flex flex-column">
                      <span className="fw-bold small text-muted">Thể loại</span>
                      <span className="text-dark">{book.category_name || 'Chưa cập nhật'}</span>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="d-flex flex-column">
                      <span className="fw-bold small text-muted">Nhà xuất bản</span>
                      <span className="text-dark">{book.publisher_name || 'Chưa cập nhật'}</span>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="d-flex flex-column">
                      <span className="fw-bold small text-muted">Tình trạng</span>
                      <span className={`badge ${book.stock > 0 ? 'bg-success' : 'bg-danger'} align-self-start`}>
                        {book.stock > 0 ? 'Còn hàng' : 'Hết hàng'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Description */}
      <div className="row mt-5">
        <div className="col-12">
          <h4 className="mb-4">Mô tả</h4>
          <div className="card border-0">
            <div className="card-body p-0">
              <div className="row">
                <div className="col-12">
                  <h6 className="mb-3">Cốt truyện chính</h6>
                  <p className="mb-4">
                    {book.title} là một trong những bộ phim Doraemon được yêu thích nhất. 
                    Câu chuyện kể về cuộc phiêu lưu của Nobita và những người bạn khi gặp gỡ Papi, 
                    tổng thống của hành tinh Pirika, người đang chạy trốn khỏi lực lượng quân đội áp bức. 
                    Nobita, Doraemon và những người bạn (Shizuka, Gian, và Suneo) sử dụng công cụ "Ánh sáng nhỏ" 
                    của Doraemon để thu nhỏ bản thân và giúp Papi chiến đấu chống lại đội quân xâm lược.
                  </p>
                  
                  <h6 className="mb-3">Chủ đề</h6>
                  <p className="mb-4">
                    <strong>Tình bạn và lòng dũng cảm:</strong> Sự quyết tâm của nhóm nhỏ trong việc giúp đỡ Papi và người dân Pirika.<br/>
                    <strong>Công lý và tự do:</strong> Nhấn mạnh vào việc chống lại chế độ độc tài và theo đuổi hòa bình.<br/>
                    <strong>Hy sinh và lòng trung thành:</strong> Các nhân vật sẵn sàng hy sinh bản thân vì bạn bè và công lý.
                  </p>
                  
                  <h6 className="mb-3">Điểm nổi bật</h6>
                  <p className="mb-0">
                    Được coi là một bộ phim Doraemon được đánh giá cao với thông điệp ý nghĩa và cốt truyện cảm động. 
                    Phiên bản làm lại năm 2021 sử dụng kỹ thuật hoạt hình hiện đại, giữ nguyên cốt truyện gốc 
                    nhưng thêm vào những hình ảnh, chi tiết và hiệu ứng mới cho khán giả đương đại.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="row mt-5">
        <div className="col-12">
          <h4 className="mb-4">Đánh giá</h4>
          
          {/* Overall Rating */}
          <div className="mb-4">
            <div className="d-flex align-items-center mb-3">
              <div className="me-3">
                {renderStars(5)}
              </div>
              <span className="text-muted">Đánh giá tổng thể</span>
            </div>
          </div>

          {/* Reviews List */}
          <div className="mb-4">
            {reviews.map(review => (
              <div key={review.id} className="border-bottom pb-3 mb-3">
                <div className="d-flex justify-content-between align-items-start">
                  <div className="flex-grow-1">
                    <div className="d-flex align-items-center mb-2">
                      <strong className="me-2">{review.name}</strong>
                      <div className="text-warning me-2">{renderStars(review.rating)}</div>
                    </div>
                    <p className="mb-2">{review.comment}</p>
                    <div className="d-flex align-items-center">
                      <button className="btn btn-link p-0 text-danger me-3">
                        <i className="bi bi-heart"></i> Thích
                      </button>
                      <small className="text-muted">{new Date(review.date).toLocaleDateString('vi-VN')}</small>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <button className="btn btn-danger">Xem tất cả đánh giá</button>
          </div>

          {/* Add Review Form */}
          <div className="border-top pt-4">
            <h5 className="mb-4">Thêm đánh giá</h5>
            <form onSubmit={handleSubmitReview}>
              <div className="mb-3">
                <label className="form-label">Đánh giá của bạn</label>
                <div className="mb-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      className={`btn btn-link p-0 me-1 ${star <= newReview.rating ? 'text-warning' : 'text-muted'}`}
                      onClick={() => setNewReview({...newReview, rating: star})}
                      style={{ fontSize: '1.5rem' }}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="reviewComment" className="form-label">Đánh giá của bạn *</label>
                <textarea
                  className="form-control"
                  id="reviewComment"
                  rows="4"
                  value={newReview.comment}
                  onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                  required
                  placeholder="Viết đánh giá của bạn về sản phẩm này..."
                ></textarea>
              </div>
              <div className="mb-3">
                <label htmlFor="reviewName" className="form-label">Tên của bạn *</label>
                <input
                  type="text"
                  className="form-control"
                  id="reviewName"
                  value={newReview.name}
                  onChange={(e) => setNewReview({...newReview, name: e.target.value})}
                  required
                  placeholder="Nhập tên của bạn"
                />
              </div>
              <button type="submit" className="btn btn-dark">Gửi</button>
            </form>
          </div>
        </div>
      </div>

      {/* Related Products - People's Choice Style */}
      <div className="row mt-5">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="mb-0 fw-bold">Gợi ý</h4>
            <a href="#" className="btn btn-link p-0 text-primary">Xem tất cả</a>
          </div>
          <div className="row g-4">
            {relatedBooks.map(relatedBook => (
              <div key={relatedBook.book_id} className="col-lg-3 col-md-6">
                <div className="card h-100 border-0 shadow-sm" style={{ 
                  cursor: 'pointer',
                  borderRadius: '12px',
                  transition: 'all 0.3s ease'
                }} 
                onClick={() => onViewProduct(relatedBook.book_id)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                }}>
                  {/* Book Cover */}
                  <div className="text-center p-3" style={{ backgroundColor: '#f8f9fa' }}>
                    <img
                      src={relatedBook.cover_image || '/images/book1.jpg'}
                      className="img-fluid"
                      alt={relatedBook.title}
                      style={{ 
                        height: '200px', 
                        objectFit: 'contain',
                        borderRadius: '8px'
                      }}
                    />
                  </div>

                  {/* Book Info */}
                  <div className="card-body p-3 d-flex flex-column">
                    {/* Title */}
                    <h6 className="card-title fw-bold text-dark mb-2" style={{ 
                      fontSize: '1rem', 
                      lineHeight: '1.3',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {relatedBook.title}
                    </h6>
                    
                    {/* Author */}
                    <p className="text-muted small mb-2" style={{ fontSize: '0.85rem' }}>
                      {relatedBook.author_name || 'Tác giả'}
                    </p>

                    {/* Rating */}
                    <div className="mb-2">
                      <div className="d-flex align-items-center">
                        <div className="me-1">
                          {renderStars(5)}
                        </div>
                      </div>
                    </div>

                    {/* Price */}
                    <p className="text-primary fw-bold mb-2" style={{ fontSize: '1.1rem' }}>
                      {formatPrice(relatedBook.price)}
                    </p>

                    {/* Category Badge */}
                    <div className="mt-auto">
                      <span className="badge bg-light text-dark px-2 py-1" style={{ 
                        fontSize: '0.75rem',
                        borderRadius: '15px',
                        border: '1px solid #e9ecef'
                      }}>
                        {relatedBook.category_name || 'Chưa phân loại'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
