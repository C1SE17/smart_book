import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faUser, faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';

const ReviewSection = ({ productId, reviews = [], loading = false, user = null }) => {
  const [newReview, setNewReview] = useState({
    rating: 5,
    review_text: ''
  });
  const [newComment, setNewComment] = useState({
    name: '',
    comment: ''
  });
  const [submitting, setSubmitting] = useState(false);
  
  // Auto-fill name when user is logged in
  useEffect(() => {
    if (user && user.name) {
      setNewComment(prev => ({
        ...prev,
        name: user.name
      }));
    }
  }, [user]);
  
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
        
        {reviews.length === 0 ? (
          <div className="text-center py-4">
            <FontAwesomeIcon icon={faStar} size="2x" className="text-muted mb-3" />
            <p className="text-muted">Chưa có đánh giá nào cho sản phẩm này.</p>
            <p className="text-muted">Hãy là người đầu tiên đánh giá!</p>
          </div>
        ) : (
          <div className="reviews">
            {reviews.map((review) => (
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