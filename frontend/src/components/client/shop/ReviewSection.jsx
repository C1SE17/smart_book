import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faUser } from '@fortawesome/free-solid-svg-icons';

const ReviewSection = ({ productId, reviews = [], loading = false }) => {
  const [newReview, setNewReview] = useState({
    rating: 5,
    review_text: ''
  });
  const [submitting, setSubmitting] = useState(false);

  // Handle review submission
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!newReview.review_text.trim()) return;

    setSubmitting(true);
    try {
      const { mockApi } = await import('../../../services/mockApi');
      
      // For demo purposes, we'll use a mock user ID
      const reviewData = {
        user_id: 2, // Mock user ID
        book_id: productId,
        rating: newReview.rating,
        review_text: newReview.review_text.trim()
      };

      await mockApi.addReview(reviewData);
      
      // Reset form
      setNewReview({ rating: 5, review_text: '' });
      
      // Refresh reviews (in a real app, you'd refetch from API)
      alert('Đánh giá đã được gửi thành công!');
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  // Calculate average rating
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

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

  // Render star distribution
  const renderStarDistribution = () => {
    const distribution = [5, 4, 3, 2, 1].map(star => ({
      stars: star,
      count: reviews.filter(r => r.rating === star).length,
      percentage: reviews.length > 0 ? (reviews.filter(r => r.rating === star).length / reviews.length) * 100 : 0
    }));

    return (
      <div className="star-distribution">
        {distribution.map(({ stars, count, percentage }) => (
          <div key={stars} className="d-flex align-items-center mb-2">
            <div className="me-2">
              {renderStars(stars)}
            </div>
            <div className="progress flex-grow-1 me-2" style={{ height: '8px' }}>
              <div
                className="progress-bar bg-warning"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
            <small className="text-muted">{count}</small>
          </div>
        ))}
      </div>
    );
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
      <h5 className="mb-4">Đánh giá sản phẩm</h5>
      
      {/* Rating Summary */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="text-center">
            <div className="display-4 text-primary mb-2">
              {averageRating.toFixed(1)}
            </div>
            <div className="mb-2">
              {renderStars(Math.round(averageRating))}
            </div>
            <p className="text-muted mb-0">
              Dựa trên {reviews.length} đánh giá
            </p>
          </div>
        </div>
        <div className="col-md-8">
          {renderStarDistribution()}
        </div>
      </div>

      {/* Add Review Form */}
      <div className="card mb-4">
        <div className="card-header">
          <h6 className="mb-0">Viết đánh giá của bạn</h6>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmitReview}>
            <div className="mb-3">
              <label className="form-label">Đánh giá của bạn</label>
              <div className="d-flex align-items-center">
                <div className="me-3">
                  {renderStars(newReview.rating, true, (rating) => 
                    setNewReview(prev => ({ ...prev, rating }))
                  )}
                </div>
                <span className="text-muted">
                  {newReview.rating === 1 ? 'Rất tệ' :
                   newReview.rating === 2 ? 'Tệ' :
                   newReview.rating === 3 ? 'Bình thường' :
                   newReview.rating === 4 ? 'Tốt' : 'Rất tốt'}
                </span>
              </div>
            </div>
            
            <div className="mb-3">
              <label className="form-label">Nhận xét</label>
              <textarea
                className="form-control"
                rows="4"
                placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                value={newReview.review_text}
                onChange={(e) => setNewReview(prev => ({ ...prev, review_text: e.target.value }))}
                required
              ></textarea>
            </div>
            
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting || !newReview.review_text.trim()}
            >
              {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
            </button>
          </form>
        </div>
      </div>

      {/* Reviews List */}
      <div className="reviews-list">
        <h6 className="mb-3">Tất cả đánh giá ({reviews.length})</h6>
        
        {reviews.length === 0 ? (
          <div className="text-center py-4">
            <FontAwesomeIcon icon={faStar} size="2x" className="text-muted mb-3" />
            <p className="text-muted">Chưa có đánh giá nào cho sản phẩm này.</p>
            <p className="text-muted">Hãy là người đầu tiên đánh giá!</p>
          </div>
        ) : (
          <div className="reviews">
            {reviews.map((review) => (
              <div key={review.review_id} className="card mb-3">
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
                  </div>
                  
                  <p className="mb-0">{review.review_text}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewSection;