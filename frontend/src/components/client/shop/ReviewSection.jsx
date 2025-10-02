import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faUser, faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';

const ReviewSection = ({ productId, reviews = [], loading = false, user = null, onAddReview = null }) => {
  const [newReview, setNewReview] = useState({
    rating: 5,
    review_text: ''
  });
  const [newComment, setNewComment] = useState({
    name: '',
    comment: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [filterRating, setFilterRating] = useState('all'); // 'all', '5', '4', '3', '2', '1'
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'oldest', 'highest', 'lowest'

  // Calculate average rating and total reviews
  const averageRating = reviews && reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;
  const totalReviews = reviews ? reviews.length : 0;

  // Filter and sort reviews
  const filteredAndSortedReviews = React.useMemo(() => {
    if (!reviews || reviews.length === 0) return [];
    
    let filtered = reviews;
    
    // Filter by rating
    if (filterRating !== 'all') {
      const rating = parseInt(filterRating);
      filtered = reviews.filter(review => review.rating === rating);
    }
    
    // Sort reviews
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at || b.date) - new Date(a.created_at || a.date);
        case 'oldest':
          return new Date(a.created_at || a.date) - new Date(b.created_at || b.date);
        case 'highest':
          return b.rating - a.rating;
        case 'lowest':
          return a.rating - b.rating;
        default:
          return 0;
      }
    });
    
    return sorted;
  }, [reviews, filterRating, sortBy]);
  
  // Auto-fill name when user is logged in
  useEffect(() => {
    if (user && user.name) {
      setNewComment(prev => ({
        ...prev,
        name: user.name
      }));
    }
  }, [user]);

  // Handle review submission
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!user) {
      alert('Vui lòng đăng nhập để viết đánh giá!');
      return;
    }

    if (!newReview.review_text.trim()) {
      alert('Vui lòng nhập nội dung đánh giá!');
      return;
    }

    // Check if user already reviewed this product
    const existingReview = reviews.find(review => 
      review.user_id === user.user_id && review.book_id === parseInt(productId)
    );
    
    if (existingReview) {
      if (window.showToast) {
        window.showToast('Bạn đã đánh giá sản phẩm này rồi!', 'warning');
      } else {
        alert('Bạn đã đánh giá sản phẩm này rồi!');
      }
      return;
    }

    setReviewSubmitting(true);
    try {
      const { mockApi } = await import('../../../services/mockApi');
      const reviewData = {
        book_id: parseInt(productId),
        user_id: user.user_id,
        rating: newReview.rating,
        review_text: newReview.review_text.trim(),
        user_name: user.name
      };

      const result = await mockApi.addReview(reviewData);
      
      // Reset form
      setNewReview({
        rating: 5,
        review_text: ''
      });
      
      // Show success message
      if (window.showToast) {
        window.showToast('Đánh giá đã được gửi thành công!', 'success');
      } else {
        alert('Đánh giá đã được gửi thành công!');
      }

      // Call parent callback to refresh reviews
      if (onAddReview) {
        onAddReview();
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      if (window.showToast) {
        window.showToast('Có lỗi xảy ra khi gửi đánh giá!', 'error');
      } else {
        alert('Có lỗi xảy ra khi gửi đánh giá!');
      }
    } finally {
      setReviewSubmitting(false);
    }
  };
  
  const [comments, setComments] = useState([
    {
      id: 1,
      user: "Nguyễn Thị D",
      date: "2024-01-20",
      question: "Sách này có phù hợp với người mới bắt đầu không?",
      likes: 5,
      dislikes: 1,
      adminReply: {
        user: "Admin",
        date: "2024-01-21",
        content: "Có, sách này rất phù hợp với người mới bắt đầu. Tác giả giải thích rất chi tiết và dễ hiểu."
      }
    },
    {
      id: 2,
      user: "Phạm Văn E",
      date: "2024-01-18",
      question: "Có thể đổi trả sách nếu không hài lòng không?",
      likes: 3,
      dislikes: 0,
      adminReply: {
        user: "Admin",
        date: "2024-01-19",
        content: "Chúng tôi có chính sách đổi trả trong vòng 7 ngày nếu sách còn nguyên vẹn."
      }
    }
  ]);


  // Handle comment submission
  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!newComment.name.trim() || !newComment.comment.trim()) return;

    const newCommentData = {
      id: comments.length + 1,
      user: newComment.name,
      date: new Date().toISOString().split('T')[0],
      question: newComment.comment,
      likes: 0,
      dislikes: 0
    };

    setComments(prev => [...prev, newCommentData]);
    setNewComment({ name: '', comment: '' });
    alert('Bình luận đã được gửi thành công!');
  };


  // Render star rating
  const renderStars = (rating, interactive = false, onChange = null) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FontAwesomeIcon
          key={i}
          icon={faStar}
          className={`${i <= rating ? 'text-warning' : 'text-muted'} ${interactive ? 'cursor-pointer' : ''}`}
          style={{ cursor: interactive ? 'pointer' : 'default' }}
          onClick={() => interactive && onChange && onChange(i)}
        />
      );
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
        <p className="mt-2">Đang tải đánh giá...</p>
      </div>
    );
  }

  return (
    <div className="reviews-section">
      {/* Product Reviews Section */}
      <div className="mb-5">
        <h5 className="mb-4 fw-bold">Đánh giá sản phẩm</h5>
        
        {/* Rating Summary */}
        <div className="row mb-4">
          <div className="col-md-4">
            <div className="text-center">
              <div className="display-4 fw-bold text-primary">
                {totalReviews === 0 ? '0' : averageRating.toFixed(1)}
              </div>
              <div className="mb-2">
                {renderStars(Math.round(averageRating))}
              </div>
              <div className="text-muted">({totalReviews} đánh giá)</div>
            </div>
          </div>
          <div className="col-md-8">
            <div className="rating-breakdown">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = reviews ? reviews.filter(r => r.rating === star).length : 0;
                const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                return (
                  <div key={star} className="d-flex align-items-center mb-2">
                    <div className="me-2">
                      {renderStars(star)}
                    </div>
                    <div className="flex-grow-1 mx-2">
                      <div className="progress" style={{ height: '8px' }}>
                        <div 
                          className="progress-bar bg-warning" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="text-muted small">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Filter and Sort Controls */}
        <div className="filter-controls mb-4">
          <div className="row align-items-center">
            <div className="col-md-8">
              <div className="d-flex flex-wrap gap-2 mb-2">
                <button
                  className={`btn btn-sm ${filterRating === 'all' ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => setFilterRating('all')}
                >
                  Tất cả ({totalReviews})
                </button>
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = reviews ? reviews.filter(r => r.rating === rating).length : 0;
                  return (
                    <button
                      key={rating}
                      className={`btn btn-sm ${filterRating === rating.toString() ? 'btn-primary' : 'btn-outline-secondary'}`}
                      onClick={() => setFilterRating(rating.toString())}
                    >
                      {rating} sao ({count})
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="col-md-4">
              <div className="d-flex align-items-center justify-content-end">
                <label className="me-2 small text-muted">Sắp xếp:</label>
                <select
                  className="form-select form-select-sm"
                  style={{ width: 'auto' }}
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">Mới nhất</option>
                  <option value="oldest">Cũ nhất</option>
                  <option value="highest">Cao nhất</option>
                  <option value="lowest">Thấp nhất</option>
                </select>
              </div>
            </div>
          </div>
          {filteredAndSortedReviews.length !== totalReviews && (
            <div className="text-muted small">
              Hiển thị {filteredAndSortedReviews.length} trong {totalReviews} đánh giá
            </div>
          )}
        </div>
        
        {totalReviews === 0 ? (
          <div className="text-center py-4">
            <FontAwesomeIcon icon={faStar} size="2x" className="text-muted mb-3" />
            <p className="text-muted">Chưa có đánh giá nào cho sản phẩm này.</p>
            <p className="text-muted">Hãy là người đầu tiên đánh giá!</p>
          </div>
        ) : filteredAndSortedReviews.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-muted">Không có đánh giá nào phù hợp với bộ lọc đã chọn.</p>
          </div>
        ) : (
          <div className="reviews">
            {filteredAndSortedReviews.map((review) => (
              <div key={review.review_id} className="card mb-3" style={{ backgroundColor: '#f8f9fa', border: 'none' }}>
                <div className="card-body">
                  <div className="d-flex align-items-center mb-2">
                    <div className="avatar me-3">
                      <FontAwesomeIcon icon={faUser} className="text-muted" size="lg" />
                    </div>
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center mb-1">
                        <strong className="me-2">
                          {review.user?.name || 'Người dùng ẩn danh'}
                        </strong>
                        <div className="me-2">
                          {renderStars(review.rating)}
                        </div>
                        <small className="text-muted">
                          {new Date(review.created_at).toLocaleDateString('vi-VN')}
                        </small>
                      </div>
                    </div>
                    <div className="d-flex align-items-center">
                      <small className="text-muted me-3">
                        Đánh giá này có hữu ích không?
                      </small>
                      <button className="btn btn-sm btn-outline-secondary me-2">
                        <FontAwesomeIcon icon={faThumbsUp} className="me-1" />
                        Hữu ích (12)
                      </button>
                    </div>
                  </div>
                  <p className="mb-0">{review.review_text}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Review Status Message */}
        {user && reviews.find(review => review.user_id === user.user_id && review.book_id === parseInt(productId)) && (
          <div className="card mt-4" style={{ backgroundColor: '#e8f5e8', border: '1px solid #28a745' }}>
            <div className="card-body text-center">
              <FontAwesomeIcon icon={faStar} className="text-success me-2" />
              <span className="text-success fw-medium">Bạn đã đánh giá sản phẩm này!</span>
            </div>
          </div>
        )}

        {/* Review Form */}
        {user && !reviews.find(review => review.user_id === user.user_id && review.book_id === parseInt(productId)) && (
          <div className="card mt-4" style={{ backgroundColor: '#f8f9fa', border: 'none' }}>
            <div className="card-body">
              <h6 className="mb-3 fw-bold">Viết đánh giá của bạn</h6>
              <form onSubmit={handleSubmitReview}>
                <div className="mb-3">
                  <label className="form-label fw-medium">Đánh giá của bạn <span className="text-danger">*</span></label>
                  <div className="d-flex align-items-center mb-2">
                    <span className="me-2">Chất lượng:</span>
                    <div className="rating-input">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          className={`btn btn-sm p-0 me-1 ${newReview.rating >= star ? 'text-warning' : 'text-muted'}`}
                          onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                          disabled={reviewSubmitting}
                        >
                          <FontAwesomeIcon icon={faStar} size="lg" />
                        </button>
                      ))}
                      <span className="ms-2 text-muted">
                        {newReview.rating === 1 && 'Rất tệ'}
                        {newReview.rating === 2 && 'Tệ'}
                        {newReview.rating === 3 && 'Bình thường'}
                        {newReview.rating === 4 && 'Tốt'}
                        {newReview.rating === 5 && 'Rất tốt'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="reviewText" className="form-label fw-medium">Nội dung đánh giá <span className="text-danger">*</span></label>
                  <textarea
                    className="form-control"
                    id="reviewText"
                    rows="4"
                    placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                    value={newReview.review_text}
                    onChange={(e) => setNewReview(prev => ({ ...prev, review_text: e.target.value }))}
                    disabled={reviewSubmitting}
                    required
                  />
                </div>
                
                <div className="d-flex justify-content-end">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={reviewSubmitting || !newReview.review_text.trim()}
                  >
                    {reviewSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Đang gửi...
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faStar} className="me-2" />
                        Gửi đánh giá
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Comments Section */}
      <div className="mb-5">
        <h5 className="mb-4 fw-bold">Bình luận ({comments.length})</h5>
        
        {/* Comments List */}
        <div className="comments">
          {comments.map((comment) => (
            <div key={comment.id} className="card mb-3" style={{ backgroundColor: '#f8f9fa', border: 'none' }}>
              <div className="card-body">
                {/* User Question */}
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <strong>{comment.user}</strong>
                      <small className="text-muted ms-2">{comment.date}</small>
                    </div>
                    <div className="d-flex align-items-center">
                      <button className="btn btn-sm btn-outline-secondary me-2">
                        <FontAwesomeIcon icon={faThumbsUp} className="me-1" />
                        {comment.likes}
                      </button>
                      <button className="btn btn-sm btn-outline-secondary">
                        <FontAwesomeIcon icon={faThumbsDown} className="me-1" />
                        {comment.dislikes}
                      </button>
                    </div>
                  </div>
                  <p className="mb-2">{comment.question}</p>
                  <div className="text-muted small">
                    Chỉ admin mới có thể trả lời bình luận
                  </div>
                </div>

                {/* Admin Reply */}
                {comment.adminReply && (
                  <div className="border-start border-3 border-primary ps-3">
                    <div className="d-flex align-items-center mb-2">
                      <strong className="me-2">{comment.adminReply.user}</strong>
                      <span className="badge bg-primary">Admin</span>
                      <small className="text-muted ms-2">{comment.adminReply.date}</small>
                    </div>
                    <p className="mb-0">{comment.adminReply.content}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Comment Form */}
        <div className="card" style={{ backgroundColor: '#f8f9fa', border: 'none' }}>
          <div className="card-body">
            <form onSubmit={handleSubmitComment}>
              <div className="mb-3">
                <label htmlFor="commentName" className="form-label fw-medium">
                  Tên của bạn <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="commentName"
                  placeholder={user ? "Tên từ tài khoản của bạn" : "Nhập tên của bạn"}
                  value={newComment.name}
                  onChange={(e) => setNewComment(prev => ({ ...prev, name: e.target.value }))}
                  required
                  disabled={!!user}
                  style={{ 
                    backgroundColor: user ? '#f8f9fa' : 'white', 
                    border: '1px solid #e9ecef',
                    cursor: user ? 'not-allowed' : 'text'
                  }}
                />
                {user && (
                  <small className="text-muted">
                    <FontAwesomeIcon icon={faUser} className="me-1" />
                    Tên được lấy từ tài khoản của bạn
                  </small>
                )}
              </div>
              
              <div className="mb-3">
                <label htmlFor="commentText" className="form-label fw-medium">
                  Bình luận <span className="text-danger">*</span>
                </label>
                <textarea
                  className="form-control"
                  id="commentText"
                  rows="4"
                  placeholder="Viết bình luận của bạn..."
                  value={newComment.comment}
                  onChange={(e) => setNewComment(prev => ({ ...prev, comment: e.target.value }))}
                  required
                  style={{ backgroundColor: 'white', border: '1px solid #e9ecef' }}
                ></textarea>
              </div>
              
              <button 
                type="submit"
                className="btn btn-dark"
                disabled={!newComment.name.trim() || !newComment.comment.trim()}
              >
                Gửi bình luận
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewSection;