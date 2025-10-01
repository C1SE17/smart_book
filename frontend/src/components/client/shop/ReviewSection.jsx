import React, { useState, useEffect } from 'react';

const ReviewSection = ({ productId, user = null }) => {
  const [reviews, setReviews] = useState([]);
  const [comments, setComments] = useState([]);
  const [newReview, setNewReview] = useState({
    rating: 0,
    title: '',
    content: '',
    reviewerName: '',
    reviewerEmail: ''
  });
  const [newComment, setNewComment] = useState({
    content: '',
    reviewerName: ''
  });
  const [filter, setFilter] = useState('all'); // all, 5, 4, 3, 2, 1
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, helpful, rating
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);

  // Dữ liệu mẫu cho reviews
  const sampleReviews = [
    {
      id: 1,
      rating: 5,
      title: "Sách rất hay và bổ ích",
      content: "Tôi rất thích cuốn sách này. Nội dung sâu sắc, cách viết dễ hiểu. Khuyến nghị cho mọi người.",
      reviewerName: "Nguyễn Văn A",
      reviewerEmail: "nguyenvana@email.com",
      date: "2024-01-15",
      helpful: 12,
      verified: true,
      images: []
    },
    {
      id: 2,
      rating: 4,
      title: "Tốt nhưng có một số điểm cần cải thiện",
      content: "Nội dung hay nhưng một số chương hơi dài dòng. Tổng thể vẫn đáng đọc.",
      reviewerName: "Trần Thị B",
      reviewerEmail: "tranthib@email.com",
      date: "2024-01-10",
      helpful: 8,
      verified: false,
      images: []
    },
    {
      id: 3,
      rating: 5,
      title: "Xuất sắc!",
      content: "Một trong những cuốn sách hay nhất tôi từng đọc. Tác giả có cách tiếp cận rất độc đáo.",
      reviewerName: "Lê Văn C",
      reviewerEmail: "levanc@email.com",
      date: "2024-01-08",
      helpful: 15,
      verified: true,
      images: []
    },
    {
      id: 4,
      rating: 3,
      title: "Bình thường",
      content: "Không có gì đặc biệt, cũng không tệ. Phù hợp để đọc giải trí.",
      reviewerName: "Phạm Thị D",
      reviewerEmail: "phamthid@email.com",
      date: "2024-01-05",
      helpful: 3,
      verified: false,
      images: []
    },
    {
      id: 5,
      rating: 2,
      title: "Hơi thất vọng",
      content: "Kỳ vọng cao nhưng nội dung không như mong đợi. Một số phần hơi nhàm chán.",
      reviewerName: "Hoàng Văn E",
      reviewerEmail: "hoangvane@email.com",
      date: "2024-01-03",
      helpful: 1,
      verified: false,
      images: []
    }
  ];

  // Dữ liệu mẫu cho comments
  const sampleComments = [
    {
      id: 1,
      content: "Cảm ơn bạn đã chia sẻ! Tôi cũng đang cân nhắc mua cuốn này. Hình ảnh sách rất đẹp!",
      reviewerName: "Nguyễn Thị F",
      date: "2024-01-16",
      likes: 5,
      dislikes: 0,
      replies: [
        {
          id: 11,
          content: "Cảm ơn bạn đã quan tâm! Sách này thực sự rất hay và đáng đọc. Nếu bạn có thắc mắc gì về sản phẩm, đừng ngại liên hệ với chúng tôi nhé!",
          reviewerName: "Admin SmartBook",
          date: "2024-01-16",
          likes: 2,
          dislikes: 0,
        }
      ]
    },
    {
      id: 2,
      content: "Tôi đồng ý với đánh giá của bạn. Sách này thực sự rất hay. Đây là ảnh chụp trang sách tôi thích nhất:",
      reviewerName: "Lê Thị H",
      date: "2024-01-14",
      likes: 3,
      dislikes: 0,
      replies: []
    },
    {
      id: 3,
      content: "Sách này có nội dung rất sâu sắc, tôi đã đọc xong và rất hài lòng!",
      reviewerName: "Phạm Văn I",
      date: "2024-01-12",
      likes: 1,
      dislikes: 0,
      replies: []
    }
  ];

  useEffect(() => {
    // Load sample data
    setReviews(sampleReviews);
    setComments(sampleComments);
  }, []);

  // Tính toán thống kê rating
  const ratingStats = {
    average: reviews.length > 0 ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1) : 0,
    total: reviews.length,
    distribution: [5, 4, 3, 2, 1].map(star => ({
      star,
      count: reviews.filter(review => review.rating === star).length,
      percentage: reviews.length > 0 ? Math.round((reviews.filter(review => review.rating === star).length / reviews.length) * 100) : 0
    }))
  };

  // Lọc và sắp xếp reviews
  const filteredReviews = reviews
    .filter(review => filter === 'all' || review.rating === parseInt(filter))
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.date) - new Date(a.date);
        case 'oldest':
          return new Date(a.date) - new Date(b.date);
        case 'helpful':
          return b.helpful - a.helpful;
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (newReview.rating > 0 && newReview.title.trim() && newReview.content.trim() && newReview.reviewerName.trim()) {
      const review = {
        id: Date.now(),
        ...newReview,
        date: new Date().toISOString().split('T')[0],
        helpful: 0,
        verified: false,
        images: []
      };
      setReviews([review, ...reviews]);
      setNewReview({
        rating: 0,
        title: '',
        content: '',
        reviewerName: '',
        reviewerEmail: ''
      });
      setShowReviewForm(false);
    }
  };


  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (newComment.content.trim() && newComment.reviewerName.trim()) {
      const comment = {
        id: Date.now(),
        ...newComment,
        date: new Date().toISOString().split('T')[0],
        likes: 0,
        dislikes: 0,
        replies: []
      };
      setComments([comment, ...comments]);
      setNewComment({
        content: '',
        reviewerName: ''
      });
      setShowCommentForm(false);
    }
  };

  const handleReply = (parentId, content, reviewerName) => {
    const reply = {
      id: Date.now(),
      content,
      reviewerName,
      date: new Date().toISOString().split('T')[0],
      likes: 0,
      dislikes: 0
    };
    
    setComments(comments.map(comment => 
      comment.id === parentId 
        ? { ...comment, replies: [...comment.replies, reply] }
        : comment
    ));
    setReplyingTo(null);
  };

  const handleHelpful = (reviewId) => {
    setReviews(reviews.map(review => 
      review.id === reviewId 
        ? { ...review, helpful: review.helpful + 1 }
        : review
    ));
  };

  const handleLikeComment = (commentId) => {
    setComments(comments.map(comment => 
      comment.id === commentId 
        ? { ...comment, likes: comment.likes + 1 }
        : comment
    ));
  };

  const renderStars = (rating, interactive = false, onStarClick = null) => {
    return Array.from({ length: 5 }, (_, index) => (
      <i
        key={index}
        className={`bi bi-star${index < rating ? '-fill' : ''} text-warning`}
        style={{
          cursor: interactive ? 'pointer' : 'default',
          fontSize: interactive ? '20px' : '14px'
        }}
        onClick={interactive ? () => onStarClick(index + 1) : undefined}
      ></i>
    ));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Kiểm tra quyền admin
  const isAdmin = user && user.role === 'admin';
  const canReply = isAdmin; // Chỉ admin mới được reply

  return (
    <div className="review-section">
      {/* Rating Overview */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="text-center">
            <div className="display-4 fw-bold text-primary">{ratingStats.average}</div>
            <div className="mb-2">
              {renderStars(Math.round(ratingStats.average))}
            </div>
            <div className="text-muted">Dựa trên {ratingStats.total} đánh giá</div>
          </div>
        </div>
        <div className="col-md-8">
          <div className="rating-distribution">
            {ratingStats.distribution.map(({ star, count, percentage }) => (
              <div key={star} className="d-flex align-items-center mb-2">
                <div className="d-flex me-2">
                  {renderStars(star)}
                </div>
                <div className="progress flex-grow-1 me-2" style={{ height: '8px' }}>
                  <div 
                    className="progress-bar bg-warning" 
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="text-muted small">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters and Sort */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="btn-group" role="group">
            <button 
              className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setFilter('all')}
            >
              Tất cả
            </button>
            {[5, 4, 3, 2, 1].map(star => (
              <button 
                key={star}
                className={`btn ${filter === star.toString() ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setFilter(star.toString())}
              >
                {star} sao
              </button>
            ))}
          </div>
        </div>
        <div className="col-md-6">
          <select 
            className="form-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Mới nhất</option>
            <option value="oldest">Cũ nhất</option>
            <option value="helpful">Hữu ích nhất</option>
            <option value="rating">Đánh giá cao nhất</option>
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mb-4">
        <button 
          className="btn btn-primary me-2"
          onClick={() => setShowReviewForm(!showReviewForm)}
        >
          <i className="bi bi-star me-1"></i>
          Viết đánh giá
        </button>
        <button 
          className="btn btn-outline-primary"
          onClick={() => setShowCommentForm(!showCommentForm)}
        >
          <i className="bi bi-chat me-1"></i>
          Bình luận
        </button>
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <div className="card mb-4">
          <div className="card-header">
            <h5 className="mb-0">Viết đánh giá</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmitReview}>
              <div className="mb-3">
                <label className="form-label fw-bold">Đánh giá của bạn *</label>
                <div className="d-flex align-items-center">
                  <div className="me-3">
                    {renderStars(newReview.rating, true, (rating) => 
                      setNewReview({...newReview, rating})
                    )}
                  </div>
                  <span className="text-muted">
                    {newReview.rating > 0 ? ['Rất tệ', 'Tệ', 'Bình thường', 'Tốt', 'Rất tốt'][newReview.rating - 1] : 'Chọn đánh giá'}
                  </span>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Tiêu đề đánh giá *</label>
                <input
                  type="text"
                  className="form-control"
                  value={newReview.title}
                  onChange={(e) => setNewReview({...newReview, title: e.target.value})}
                  placeholder="Tóm tắt đánh giá của bạn"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Nội dung đánh giá *</label>
                <textarea
                  className="form-control"
                  rows="4"
                  value={newReview.content}
                  onChange={(e) => setNewReview({...newReview, content: e.target.value})}
                  placeholder="Chia sẻ chi tiết về trải nghiệm của bạn với sản phẩm này..."
                  required
                ></textarea>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label fw-bold">Tên của bạn *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newReview.reviewerName}
                      onChange={(e) => setNewReview({...newReview, reviewerName: e.target.value})}
                      placeholder="Nhập tên của bạn"
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Email (tùy chọn)</label>
                    <input
                      type="email"
                      className="form-control"
                      value={newReview.reviewerEmail}
                      onChange={(e) => setNewReview({...newReview, reviewerEmail: e.target.value})}
                      placeholder="Nhập email của bạn"
                    />
                  </div>
                </div>
              </div>

              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary">
                  Gửi đánh giá
                </button>
                <button 
                  type="button" 
                  className="btn btn-outline-secondary"
                  onClick={() => setShowReviewForm(false)}
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Comment Form */}
      {showCommentForm && (
        <div className="card mb-4">
          <div className="card-header">
            <h5 className="mb-0">Bình luận</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmitComment}>
              <div className="mb-3">
                <label className="form-label fw-bold">Bình luận của bạn *</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={newComment.content}
                  onChange={(e) => setNewComment({...newComment, content: e.target.value})}
                  placeholder="Chia sẻ suy nghĩ của bạn về sản phẩm này..."
                  required
                ></textarea>
              </div>


              <div className="mb-3">
                <label className="form-label fw-bold">Tên của bạn *</label>
                <input
                  type="text"
                  className="form-control"
                  value={newComment.reviewerName}
                  onChange={(e) => setNewComment({...newComment, reviewerName: e.target.value})}
                  placeholder="Nhập tên của bạn"
                  required
                />
              </div>

              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary">
                  Gửi bình luận
                </button>
                <button 
                  type="button" 
                  className="btn btn-outline-secondary"
                  onClick={() => setShowCommentForm(false)}
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="reviews-list">
        <h5 className="mb-3">Đánh giá ({filteredReviews.length})</h5>
        {filteredReviews.map(review => (
          <div key={review.id} className="card mb-3">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <h6 className="mb-1">{review.title}</h6>
                  <div className="d-flex align-items-center mb-2">
                    <div className="me-2">
                      {renderStars(review.rating)}
                    </div>
                    <span className="text-muted small">
                      {review.reviewerName}
                      {review.verified && <span className="badge bg-success ms-1">Đã xác thực</span>}
                    </span>
                  </div>
                </div>
                <div className="text-muted small">
                  {formatDate(review.date)}
                </div>
              </div>
              
              <p className="mb-3">{review.content}</p>
              
              
              <div className="d-flex justify-content-end align-items-center gap-3">
                <div className="text-muted small">
                  Đánh giá này có hữu ích không?
                </div>
                <button 
                  className="btn btn-outline-primary btn-sm"
                  style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                  onClick={() => handleHelpful(review.id)}
                >
                  <i className="bi bi-hand-thumbs-up me-1" style={{ fontSize: '0.7rem' }}></i>
                  Hữu ích ({review.helpful})
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Comments List */}
      <div className="comments-list mt-5">
        <h5 className="mb-3">Bình luận ({comments.length})</h5>
        {comments.map(comment => (
          <div key={comment.id} className="card mb-3">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <h6 className="mb-1">{comment.reviewerName}</h6>
                  <div className="text-muted small">
                    {formatDate(comment.date)}
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <button 
                    className="btn btn-outline-primary btn-sm"
                    style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                    onClick={() => handleLikeComment(comment.id)}
                  >
                    <i className="bi bi-hand-thumbs-up me-1" style={{ fontSize: '0.7rem' }}></i>
                    {comment.likes}
                  </button>
                  {canReply ? (
                    <button 
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => setReplyingTo(comment.id)}
                    >
                      <i className="bi bi-reply me-1"></i>
                      Trả lời
                    </button>
                  ) : (
                    <span className="text-muted small">
                      <i className="bi bi-shield-check me-1"></i>
                      Chỉ admin mới có thể trả lời
                    </span>
                  )}
                </div>
              </div>
              
              <p className="mb-3">{comment.content}</p>
              
              {/* Reply Form - Chỉ admin mới thấy */}
              {replyingTo === comment.id && canReply && (
                <div className="reply-form mb-3">
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    handleReply(
                      comment.id,
                      formData.get('content'),
                      formData.get('reviewerName')
                    );
                  }}>
                    <div className="mb-2">
                      <textarea
                        name="content"
                        className="form-control"
                        rows="2"
                        placeholder="Viết phản hồi của bạn..."
                        required
                      ></textarea>
                    </div>
                    
                    
                    <div className="mb-2">
                      <input
                        name="reviewerName"
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Tên của bạn"
                        required
                      />
                    </div>
                    <div className="mt-2">
                      <button type="submit" className="btn btn-primary btn-sm me-2">
                        Gửi phản hồi
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => setReplyingTo(null)}
                      >
                        Hủy
                      </button>
                    </div>
                  </form>
                </div>
              )}
              
              {/* Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="replies ms-4">
                  {comment.replies.map(reply => (
                    <div key={reply.id} className="card mb-2 border-start border-primary border-3">
                      <div className="card-body py-2">
                        <div className="d-flex justify-content-between align-items-start mb-1">
                          <div>
                            <h6 className="mb-1 small">
                              {reply.reviewerName}
                              <span className="badge bg-primary ms-1 small">Admin</span>
                            </h6>
                            <div className="text-muted small">
                              {formatDate(reply.date)}
                            </div>
                          </div>
                          <button 
                            className="btn btn-outline-primary btn-sm"
                            style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                            onClick={() => handleLikeComment(reply.id)}
                          >
                            <i className="bi bi-hand-thumbs-up me-1" style={{ fontSize: '0.7rem' }}></i>
                            {reply.likes}
                          </button>
                        </div>
                        <p className="mb-0 small">{reply.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewSection;
