import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { bookService, cartService, userService } from '../../../services';

const ProductDetail = ({ onBackToHome, onNavigateTo, productId, onViewProduct, user }) => {
  const id = productId;
  // Remove console.log in production
  if (process.env.NODE_ENV === 'development') {
    console.log('ProductDetail render - productId:', productId, 'id:', id);
  }
  const [activeTab, setActiveTab] = useState('overview');
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '', name: '' });
  const [relatedBooks, setRelatedBooks] = useState([]);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Tabs configuration
  const tabs = useMemo(() => [
    { id: 'overview', label: 'Overview' },
    { id: 'description', label: 'Description' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'specifications', label: 'Specifications' }
  ], []);

  useEffect(() => {
    console.log('ProductDetail useEffect - productId:', id);
    if (id) {
      fetchBookDetail();
      fetchRelatedBooks();
      fetchReviews();
    } else {
      console.warn('No productId provided to ProductDetail');
    }
  }, [id, fetchBookDetail, fetchRelatedBooks, fetchReviews]);

  const fetchBookDetail = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to fetch from API first
      try {
        const bookData = await bookService.getById(id);
        setBook(bookData);
      } catch (apiError) {
        console.warn('API failed, using mock data:', apiError);
        // Fallback to mock data based on book_id
        const mockBooks = {
          1: {
            book_id: 1,
            title: "WHERE THE CRAWDADS SING",
            author_name: "Delia Owens",
            cover_image: "/images/book1.jpg",
            price: 250000,
            category_name: "Fiction",
            publisher_name: "Penguin Random House",
            stock: 10,
            description: "A beautiful and haunting story of survival and love in the marshlands of North Carolina.",
            created_at: "2024-01-01T00:00:00Z",
            updated_at: "2024-01-01T00:00:00Z"
          },
          2: {
            book_id: 2,
            title: "Doraemon: Nobita's Little Star Wars",
            author_name: "Fujiko F. Fujio",
            cover_image: "/images/book2.jpg",
            price: 200000,
            category_name: "Manga",
            publisher_name: "Shogakukan",
            stock: 15,
            description: "Join Nobita and Doraemon on an exciting space adventure in this classic manga series.",
            created_at: "2024-01-01T00:00:00Z",
            updated_at: "2024-01-01T00:00:00Z"
          },
          3: {
            book_id: 3,
            title: "Demon Slayer - Vô hạn thành",
            author_name: "Koyoharu Gotouge",
            cover_image: "/images/book3.jpg",
            price: 230000,
            category_name: "Manga",
            publisher_name: "Shueisha",
            stock: 8,
            description: "The epic tale of Tanjiro Kamado's journey to become a demon slayer and save his sister.",
            created_at: "2024-01-01T00:00:00Z",
            updated_at: "2024-01-01T00:00:00Z"
          },
          4: {
            book_id: 4,
            title: "Conan - Vụ Án Nữ Hoàng 450",
            author_name: "Gosho Aoyama",
            cover_image: "/images/book4.jpg",
            price: 210000,
            category_name: "Manga",
            publisher_name: "Shogakukan",
            stock: 12,
            description: "Detective Conan investigates a mysterious case involving a queen in this thrilling mystery manga.",
            created_at: "2024-01-01T00:00:00Z",
            updated_at: "2024-01-01T00:00:00Z"
          }
        };
        
        const mockBook = mockBooks[id];
        if (mockBook) {
          setBook(mockBook);
        } else {
          throw new Error('Book not found');
        }
      }
    } catch (err) {
      setError('Cannot load book information');
      console.error('Error fetching book detail:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchRelatedBooks = useCallback(async () => {
    try {
      const books = await bookService.getAll();
      // Get 4 random books as related products, excluding current book
      const filteredBooks = books.filter(book => book.book_id !== id);
      const shuffled = filteredBooks.sort(() => 0.5 - Math.random());
      setRelatedBooks(shuffled.slice(0, 4));
    } catch (err) {
      console.error('Error fetching related books:', err);
      // Fallback to mock data if API fails
      setRelatedBooks([
        {
          book_id: 1,
          title: "WHERE THE CRAWDADS SING",
          author_name: "Delia Owens",
          cover_image: "/images/book1.jpg",
          price: 250000,
          category_name: "Fiction"
        },
        {
          book_id: 2,
          title: "Doraemon: Nobita's Little Star Wars",
          author_name: "Fujiko F. Fujio",
          cover_image: "/images/book2.jpg",
          price: 200000,
          category_name: "Manga"
        },
        {
          book_id: 3,
          title: "Demon Slayer - Vô hạn thành",
          author_name: "Koyoharu Gotouge",
          cover_image: "/images/book3.jpg",
          price: 230000,
          category_name: "Manga"
        },
        {
          book_id: 4,
          title: "Conan - Vụ Án Nữ Hoàng 450",
          author_name: "Gosho Aoyama",
          cover_image: "/images/book4.jpg",
          price: 210000,
          category_name: "Manga"
        }
      ]);
    }
  }, [id]);

  const fetchReviews = useCallback(async () => {
    try {
      const mockReviews = [
        {
          id: 1,
          rating: 5,
          comment: "It's a really good book! Definitely a must-read!",
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
    } catch (err) {
      console.error('Error fetching reviews:', err);
    }
  }, [id]);

  const handleAddToCart = useCallback(async () => {
    try {
      setAddingToCart(true);
      const token = user?.token || localStorage.getItem('userToken');
      if (!token) {
        alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
        return;
      }
      
      await cartService.addItem(id, quantity, token);
      alert('Đã thêm sản phẩm vào giỏ hàng thành công!');
    } catch (err) {
      alert('Không thể thêm sản phẩm vào giỏ hàng');
      console.error('Error adding to cart:', err);
    } finally {
      setAddingToCart(false);
    }
  }, [id, quantity, user?.token]);

  const handleProductClick = useCallback((bookId) => {
    console.log('Product clicked:', bookId);
    if (onViewProduct) {
      onViewProduct(bookId);
    }
  }, [onViewProduct]);

  const handleWishlistToggle = useCallback(async () => {
    try {
      const token = user?.token || localStorage.getItem('userToken');
      if (!token) {
        alert('Vui lòng đăng nhập để thêm vào danh sách yêu thích');
        return;
      }
      
      // TODO: Implement wishlist API when backend is ready
      // await userService.toggleWishlist(id, token);
      setIsWishlisted(!isWishlisted);
      alert(isWishlisted ? 'Đã xóa khỏi danh sách yêu thích' : 'Đã thêm vào danh sách yêu thích');
    } catch (err) {
      console.error('Error toggling wishlist:', err);
    }
  }, [id, isWishlisted, user?.token]);

  const handleSubmitReview = useCallback(async (e) => {
    e.preventDefault();
    if (!newReview.comment.trim() || !newReview.name.trim()) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }
    
    try {
      const token = user?.token || localStorage.getItem('userToken');
      if (!token) {
        alert('Vui lòng đăng nhập để đánh giá sản phẩm');
        return;
      }
      
      // TODO: Replace with actual API call when backend is ready
      // await bookService.addReview(id, newReview, token);
      
      // For now, add to local state
      const review = {
        id: reviews.length + 1,
        ...newReview,
        date: new Date().toISOString().split('T')[0]
      };
      
      setReviews([review, ...reviews]);
      setNewReview({ rating: 5, comment: '', name: '' });
      alert('Cảm ơn bạn đã đánh giá!');
    } catch (err) {
      console.error('Error submitting review:', err);
      alert('Không thể gửi đánh giá. Vui lòng thử lại.');
    }
  }, [id, newReview, reviews.length, user?.token]);

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
    console.log('ProductDetail loading...');
    return (
      <div className="min-vh-100" style={{backgroundColor: '#f5f5f5'}}>
        <div className="container py-4">
          <div className="row justify-content-center">
            <div className="col-md-8 text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading book information...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !book) {
    console.log('ProductDetail error or no book - error:', error, 'book:', book);
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{backgroundColor: '#f8f9fa'}}>
        <div className="text-center">
          <div className="alert alert-danger border-danger" role="alert" style={{
            backgroundColor: '#f8d7da',
            borderColor: '#f5c6cb',
            color: '#721c24',
            borderRadius: '8px',
            padding: '20px',
            maxWidth: '400px',
            margin: '0 auto'
          }}>
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error || 'Cannot load book information'}
          </div>
          <button 
            className="btn btn-primary mt-3"
            onClick={onBackToHome}
            style={{
              borderRadius: '8px',
              padding: '10px 20px',
              fontWeight: '500'
            }}
          >
            <i className="bi bi-house me-2"></i>
            Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 0;

  console.log('ProductDetail rendering main content - book:', book);

  return (
    <div className="min-vh-100" style={{backgroundColor: '#f8f9fa'}}>
      <div className="container py-4">
        {/* Breadcrumb Navigation */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item">
              <button 
                className="btn btn-link p-0 text-decoration-none" 
                onClick={onBackToHome}
                style={{ color: '#6c757d' }}
              >
                Home
              </button>
            </li>
            <li className="breadcrumb-item">
              <button 
                className="btn btn-link p-0 text-decoration-none" 
                onClick={() => onNavigateTo('search')()}
                style={{ color: '#6c757d' }}
              >
                Shop
              </button>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {book.title}
            </li>
          </ol>
        </nav>

        {/* Product Title */}
        <div className="row mb-4">
          <div className="col-12">
            <h1 className="h2 fw-bold text-dark mb-2">{book.title}</h1>
            <p className="text-muted mb-0">Vol. 27</p>
          </div>
        </div>

        {/* Main Product Section */}
        <div className="row mb-5">
          {/* Product Image */}
          <div className="col-md-6 mb-4">
            <div className="card border-0 shadow-sm" style={{ backgroundColor: '#fff' }}>
              <div className="card-body p-4 text-center">
                <img
                  src={book.cover_image || '/images/book1.jpg'}
                  alt={book.title}
                  className="img-fluid"
                  style={{ 
                    maxHeight: '500px', 
                    objectFit: 'contain',
                    borderRadius: '8px'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="col-md-6">
            <div className="card border-0 shadow-sm h-100" style={{ backgroundColor: '#fff' }}>
              <div className="card-body p-4">
                <h2 className="h3 fw-bold text-dark mb-3">{book.title}</h2>
                
                {/* Rating */}
                <div className="mb-3">
                  <div className="d-flex align-items-center">
                    <div className="me-2">
                      {renderStars(Math.round(averageRating))}
                    </div>
                    <span className="text-muted small">
                      {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-4">
                  <h3 className="text-primary fw-bold mb-0" style={{ fontSize: '2rem' }}>
                    {formatPrice(book.price)}
                  </h3>
                </div>

                {/* Quantity and Add to Cart */}
                <div className="mb-4">
                  <div className="d-flex align-items-center mb-3">
                    <span className="me-3 fw-bold">Quantity:</span>
                    <div className="input-group" style={{ width: '120px' }}>
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
                  
                  <button 
                    className="btn btn-dark btn-lg w-100 mb-3"
                    onClick={handleAddToCart}
                    disabled={addingToCart || book.stock === 0}
                    style={{ borderRadius: '8px' }}
                  >
                    {addingToCart ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Adding...
                      </>
                    ) : (
                      'Add to Cart'
                    )}
                  </button>
                  
                  <button 
                    className={`btn btn-lg w-100 ${isWishlisted ? 'btn-danger' : 'btn-outline-danger'}`}
                    onClick={handleWishlistToggle}
                    style={{ borderRadius: '8px' }}
                  >
                    <i className={`bi ${isWishlisted ? 'bi-heart-fill' : 'bi-heart'}`}></i> 
                    {isWishlisted ? 'Added to Wishlist' : 'Add to Wishlist'}
                  </button>
                </div>

                {/* Product Details */}
                <div className="border-top pt-4">
                  <h6 className="fw-bold mb-3">Product Details</h6>
                  <div className="row g-3">
                    <div className="col-12">
                      <div className="d-flex justify-content-between">
                        <span className="fw-bold text-muted">Author:</span>
                        <span className="text-dark">{book.author_name || 'Unknown'}</span>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="d-flex justify-content-between">
                        <span className="fw-bold text-muted">Category:</span>
                        <span className="text-dark">{book.category_name || 'Uncategorized'}</span>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="d-flex justify-content-between">
                        <span className="fw-bold text-muted">Publisher:</span>
                        <span className="text-dark">{book.publisher_name || 'Unknown'}</span>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="d-flex justify-content-between">
                        <span className="fw-bold text-muted">Status:</span>
                        <span className={`badge ${book.stock > 0 ? 'bg-success' : 'bg-danger'}`}>
                          {book.stock > 0 ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="row mb-5">
          <div className="col-12">
            <div className="card border-0 shadow-sm" style={{ backgroundColor: '#fff' }}>
              <div className="card-body p-4">
                <h4 className="fw-bold mb-4">Description</h4>
                <p className="mb-4">
                  <strong>{book.title}</strong> is one of the most popular books in this series. 
                  It was first published and has been widely acclaimed by readers worldwide.
                </p>
                
                <h6 className="fw-bold mb-3">Main Story</h6>
                <p className="mb-4">
                  {book.title} tells an engaging story with deep meaning and valuable lessons. 
                  The book narrates interesting stories and precious insights that the author wants to convey to readers. 
                  It's a compelling tale that captures the imagination and provides meaningful content for all ages.
                </p>
                
                <h6 className="fw-bold mb-3">Themes</h6>
                <p className="mb-4">
                  <strong>Friendship and courage:</strong> Stories about genuine friendship and courage to overcome difficulties.<br/>
                  <strong>Justice and freedom:</strong> Emphasis on fighting for justice and freedom.<br/>
                  <strong>Sacrifice and loyalty:</strong> Characters willing to sacrifice for what's right.
                </p>
                
                <h6 className="fw-bold mb-3">Highlights</h6>
                <p className="mb-0">
                  Considered a highly rated book with meaningful messages and touching content. 
                  The book is suitable for all ages and provides valuable lessons for readers.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="row mb-5">
          <div className="col-12">
            <div className="card border-0 shadow-sm" style={{ backgroundColor: '#fff' }}>
              <div className="card-body p-4">
                <h4 className="fw-bold mb-4">Reviews</h4>
                
                {/* Existing Reviews */}
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
                              <i className="bi bi-heart"></i> Like
                            </button>
                            <small className="text-muted">{new Date(review.date).toLocaleDateString('en-US')}</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button className="btn btn-link p-0 text-primary">View all {reviews.length} review{reviews.length !== 1 ? 's' : ''}</button>
                </div>

                {/* Add Review Form */}
                <div className="border-top pt-4">
                  <h6 className="fw-bold mb-3">Add a review</h6>
                  <p className="text-muted small mb-4">Your email address will not be published. Required fields are marked *</p>
                  
                  <form onSubmit={handleSubmitReview}>
                    <div className="mb-3">
                      <label className="form-label fw-bold">Your rating *</label>
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
                      <label htmlFor="reviewComment" className="form-label fw-bold">Your review *</label>
                      <textarea
                        className="form-control"
                        id="reviewComment"
                        rows="4"
                        value={newReview.comment}
                        onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                        required
                        placeholder="Write your review about this product..."
                        style={{ borderRadius: '8px' }}
                      ></textarea>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="reviewName" className="form-label fw-bold">Your name *</label>
                      <input
                        type="text"
                        className="form-control"
                        id="reviewName"
                        value={newReview.name}
                        onChange={(e) => setNewReview({...newReview, name: e.target.value})}
                        required
                        placeholder="Enter your name"
                        style={{ borderRadius: '8px' }}
                      />
                    </div>
                    <button type="submit" className="btn btn-dark" style={{ borderRadius: '8px' }}>Submit</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="mb-0 fw-bold">Recommendations</h4>
              <button 
                className="btn btn-link p-0 text-primary"
                onClick={() => onNavigateTo('search')()}
              >
                View All
              </button>
            </div>
            <div className="row g-4">
              {relatedBooks.map(relatedBook => (
                <div key={relatedBook.book_id} className="col-lg-3 col-md-6">
                  <div 
                    className="card h-100 border-0 shadow-sm" 
                    style={{ 
                      cursor: 'pointer',
                      borderRadius: '12px',
                      transition: 'all 0.3s ease',
                      backgroundColor: '#fff'
                    }} 
                    onClick={() => handleProductClick(relatedBook.book_id)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-8px)';
                      e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                    }}
                  >
                    {/* Book Cover */}
                    <div className="text-center p-4" style={{ backgroundColor: '#f8f9fa', borderRadius: '12px 12px 0 0' }}>
                      <img
                        src={relatedBook.cover_image || '/images/book1.jpg'}
                        className="img-fluid"
                        alt={relatedBook.title}
                        style={{ 
                          height: '220px', 
                          objectFit: 'contain',
                          borderRadius: '8px'
                        }}
                      />
                    </div>

                    {/* Book Info */}
                    <div className="card-body p-4 d-flex flex-column">
                      {/* Title */}
                      <h6 className="card-title fw-bold text-dark mb-2" style={{ 
                        fontSize: '1.1rem', 
                        lineHeight: '1.3',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        minHeight: '2.6rem'
                      }}>
                        {relatedBook.title}
                      </h6>
                      
                      {/* Author */}
                      <p className="text-muted mb-3" style={{ fontSize: '0.9rem' }}>
                        {relatedBook.author_name || 'Unknown Author'}
                      </p>

                      {/* Rating */}
                      <div className="mb-3">
                        <div className="d-flex align-items-center">
                          <div className="me-2">
                            {renderStars(5)}
                          </div>
                          <span className="text-muted small">(5.0)</span>
                        </div>
                      </div>

                      {/* Price */}
                      <p className="text-primary fw-bold mb-3" style={{ fontSize: '1.2rem' }}>
                        {formatPrice(relatedBook.price)}
                      </p>

                      {/* Category Badge */}
                      <div className="mt-auto">
                        <span className="badge bg-light text-dark px-3 py-2" style={{ 
                          fontSize: '0.8rem',
                          borderRadius: '20px',
                          border: '1px solid #e9ecef',
                          fontWeight: '500'
                        }}>
                          {relatedBook.category_name || 'Uncategorized'}
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
    </div>
  );
};

export default ProductDetail;
