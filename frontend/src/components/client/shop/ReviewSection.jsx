import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faUser, faTrash, faEdit, faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';
import apiService from '../../../services/api';
import { useLanguage } from '../../../contexts/LanguageContext';

const ReviewSection = ({ productId, reviews = [], loading = false, user = null, onAddReview = null }) => {
  const { t } = useLanguage();
  const [newReview, setNewReview] = useState({
    rating: 5,
    review_text: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [filterRating, setFilterRating] = useState('all'); // 'all', '5', '4', '3', '2', '1'
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'oldest', 'highest', 'lowest'

  // State cho dữ liệu thật từ API
  const [realReviews, setRealReviews] = useState([]);
  const [realLoading, setRealLoading] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  // State cho edit review
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editReviewData, setEditReviewData] = useState({
    rating: 5,
    review_text: ''
  });
  const [editSubmitting, setEditSubmitting] = useState(false);

  // State cho reply review (admin)
  const [replyingReviewId, setReplyingReviewId] = useState(null);
  const [replyData, setReplyData] = useState({
    reply_text: ''
  });
  const [replySubmitting, setReplySubmitting] = useState(false);
  const [replyError, setReplyError] = useState('');
  const [editingReplyId, setEditingReplyId] = useState(null);
  const [editReplyData, setEditReplyData] = useState({
    reply_text: ''
  });
  const [editReplySubmitting, setEditReplySubmitting] = useState(false);
  const [editReplyError, setEditReplyError] = useState('');

  // Load dữ liệu thật từ API khi component mount hoặc productId thay đổi
  useEffect(() => {
    if (productId) {
      loadRealReviews();
      loadAverageRating();
    }
  }, [productId]);

  // Load reviews thật từ API
  const loadRealReviews = async () => {
    try {
      setRealLoading(true);
      console.log('Đang load reviews cho productId:', productId);

      const response = await apiService.getReviews({ book_id: productId });
      console.log('Response từ API:', response);

      // Kiểm tra response structure từ baseApi
      if (response && response.success && Array.isArray(response.data)) {
        setRealReviews(response.data);
        console.log('Đã set realReviews:', response.data.length, 'reviews');
      } else if (response && Array.isArray(response)) {
        // Fallback: nếu response trực tiếp là array
        setRealReviews(response);
        console.log('Đã set realReviews (fallback):', response.length, 'reviews');
      } else {
        console.log('Response không hợp lệ, set empty array');
        console.log('Response structure:', typeof response, response);
        setRealReviews([]);
      }
    } catch (error) {
      console.error('Lỗi khi load reviews:', error);
      setRealReviews([]);
    } finally {
      setRealLoading(false);
    }
  };

  // Load average rating từ API
  const loadAverageRating = async () => {
    try {
      console.log('Đang load average rating cho productId:', productId);

      const response = await apiService.getAverageRating(productId);
      console.log('Average rating response:', response);

      // Kiểm tra response structure từ baseApi
      if (response && response.success && response.data) {
        setAverageRating(parseFloat(response.data.average_rating) || 0);
        setTotalReviews(parseInt(response.data.total_reviews) || 0);
        console.log('Set average rating:', response.data.average_rating, 'total reviews:', response.data.total_reviews);
      } else if (response && response.average_rating !== undefined) {
        // Fallback: nếu response trực tiếp có average_rating
        setAverageRating(parseFloat(response.average_rating) || 0);
        setTotalReviews(parseInt(response.total_reviews) || 0);
        console.log('Set average rating (fallback):', response.average_rating, 'total reviews:', response.total_reviews);
      } else {
        console.log('Average rating response không hợp lệ:', response);
        setAverageRating(0);
        setTotalReviews(0);
      }
    } catch (error) {
      console.error('Lỗi khi load average rating:', error);
      setAverageRating(0);
      setTotalReviews(0);
    }
  };

  // Filter and sort reviews - chỉ sử dụng dữ liệu thật từ API
  const filteredAndSortedReviews = React.useMemo(() => {
    // Chỉ sử dụng dữ liệu thật từ API, không fallback về props mock
    const reviewsToUse = realReviews;

    if (!reviewsToUse || reviewsToUse.length === 0) return [];

    let filtered = reviewsToUse;

    // Filter by rating
    if (filterRating !== 'all') {
      const rating = parseInt(filterRating);
      filtered = reviewsToUse.filter(review => review.rating === rating);
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
  }, [realReviews, reviews, filterRating, sortBy]);


  // Submit review thật lên API
  const handleSubmitRealReview = async () => {
    if (!user) {
      alert(t('productDetail.notifications.reviewLoginRequired'));
      return;
    }

    if (!newReview.review_text.trim()) {
      alert(t('productDetail.notifications.reviewContentRequired'));
      return;
    }

    try {
      setReviewSubmitting(true);
      console.log('Đang submit review:', {
        book_id: productId,
        rating: newReview.rating,
        review_text: newReview.review_text
      });

      const response = await apiService.createReview({
        book_id: productId,
        rating: newReview.rating,
        review_text: newReview.review_text
      });

      console.log('Submit review response:', response);

      if (response) {
        alert(t('productDetail.notifications.reviewSubmitSuccess'));
        setNewReview({ rating: 5, review_text: '' });

        // Reload reviews và average rating
        await loadRealReviews();
        await loadAverageRating();
      }
    } catch (error) {
      console.error('Lỗi khi submit review:', error);
      alert(t('productDetail.notifications.reviewSubmitError'));
    } finally {
      setReviewSubmitting(false);
    }
  };

  // Handle review submission
  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!user) {
      alert(t('productDetail.notifications.reviewLoginRequired'));
      return;
    }

    if (!newReview.review_text.trim()) {
      setReviewError(t('productDetail.notifications.reviewContentError'));
      // Scroll to error message
      setTimeout(() => {
        const textarea = document.getElementById('reviewText');
        if (textarea) {
          textarea.focus();
          textarea.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      return;
    }

    // Clear error if review is valid
    setReviewError('');

    // Check if user already reviewed this product
    const existingReview = realReviews.find(review =>
      review.user_id === user.user_id && review.book_id === parseInt(productId)
    );

    if (existingReview) {
      if (window.showToast) {
        window.showToast(t('productDetail.notifications.reviewAlreadyExists'), 'warning');
      } else {
        alert(t('productDetail.notifications.reviewAlreadyExists'));
      }
      return;
    }

    setReviewSubmitting(true);
    try {
      // Sử dụng API thật
      console.log('Đang submit review:', {
        book_id: productId,
        rating: newReview.rating,
        review_text: newReview.review_text
      });

      const response = await apiService.createReview({
        book_id: productId,
        rating: newReview.rating,
        review_text: newReview.review_text
      });

      console.log('Submit review response:', response);

      if (response) {
        // Reset form
        setNewReview({
          rating: 5,
          review_text: ''
        });
        setReviewError('');
        setReviewSuccess(t('productDetail.notifications.reviewSubmitSuccess'));

        // Show success message using toast
        if (window.showToast) {
          window.showToast(t('productDetail.notifications.reviewSubmitSuccess'), 'success');
        } else {
          alert(t('productDetail.notifications.reviewSubmitSuccess'));
        }

        // Auto hide success message after 5 seconds
        setTimeout(() => {
          setReviewSuccess('');
        }, 5000);

        // Reload reviews và average rating
        await loadRealReviews();
        await loadAverageRating();
      }

      // Call parent callback to refresh reviews
      if (onAddReview) {
        onAddReview();
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      if (window.showToast) {
        window.showToast(t('productDetail.notifications.reviewSubmitError'), 'error');
      } else {
        alert(t('productDetail.notifications.reviewSubmitError'));
      }
    } finally {
      setReviewSubmitting(false);
    }
  };

  // Start editing a review
  const handleStartEdit = (review) => {
    setEditingReviewId(review.review_id);
    setEditReviewData({
      rating: review.rating,
      review_text: review.review_text || ''
    });
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingReviewId(null);
    setEditReviewData({
      rating: 5,
      review_text: ''
    });
  };

  // Handle update review
  const handleUpdateReview = async (reviewId) => {
    if (!editReviewData.review_text.trim()) {
      if (window.showToast) {
        window.showToast(t('productDetail.notifications.reviewEditContentRequired'), 'error');
      } else {
        alert(t('productDetail.notifications.reviewEditContentRequired'));
      }
      return;
    }

    setEditSubmitting(true);
    try {
      console.log('Đang cập nhật review:', {
        review_id: reviewId,
        rating: editReviewData.rating,
        review_text: editReviewData.review_text
      });

      const response = await apiService.updateReview(reviewId, {
        rating: editReviewData.rating,
        review_text: editReviewData.review_text
      });

      console.log('Update review response:', response);

      if (response) {
        if (window.showToast) {
          window.showToast(t('productDetail.notifications.reviewUpdateSuccess'), 'success');
        } else {
          alert(t('productDetail.notifications.reviewUpdateSuccess'));
        }

        // Cancel edit mode
        handleCancelEdit();

        // Reload reviews và average rating
        await loadRealReviews();
        await loadAverageRating();
      }
    } catch (error) {
      console.error('Error updating review:', error);
      if (window.showToast) {
        window.showToast(t('productDetail.notifications.reviewUpdateError'), 'error');
      } else {
        alert(t('productDetail.notifications.reviewUpdateError'));
      }
    } finally {
      setEditSubmitting(false);
    }
  };

  // Handle delete review (chỉ admin mới được xóa)
  const handleDeleteReview = async (reviewId, isAdmin = false) => {
    if (!window.confirm(t('productDetail.notifications.reviewDeleteConfirm'))) {
      return;
    }

    try {
      console.log('Đang xóa review:', reviewId, isAdmin ? '(admin)' : '');

      let response;
      if (isAdmin) {
        response = await apiService.adminDeleteReview(reviewId);
      } else {
        // User không được xóa review nữa, chỉ admin mới được xóa
        throw new Error('Only admin can delete reviews');
      }

      console.log('Delete review response:', response);

      if (response) {
        if (window.showToast) {
          window.showToast(t('productDetail.notifications.reviewDeleteSuccess'), 'success');
        } else {
          alert(t('productDetail.notifications.reviewDeleteSuccess'));
        }

        // Reload reviews và average rating
        await loadRealReviews();
        await loadAverageRating();
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      if (window.showToast) {
        window.showToast(t('productDetail.notifications.reviewDeleteError'), 'error');
      } else {
        alert(t('productDetail.notifications.reviewDeleteError'));
      }
    }
  };

  // Start replying to a review
  const handleStartReply = (reviewId) => {
    setReplyingReviewId(reviewId);
    setReplyData({ reply_text: '' });
    setReplyError('');
  };

  // Cancel reply
  const handleCancelReply = () => {
    setReplyingReviewId(null);
    setReplyData({ reply_text: '' });
    setReplyError('');
  };

  // Handle submit reply
  const handleSubmitReply = async (reviewId) => {
    if (!replyData.reply_text.trim()) {
      setReplyError(t('productDetail.reviews.reply.contentRequired'));
      return;
    }

    setReplyError('');
    setReplySubmitting(true);
    try {
      console.log('Đang gửi reply cho review:', reviewId);

      const response = await apiService.createReply(reviewId, {
        reply_text: replyData.reply_text
      });

      console.log('Submit reply response:', response);

      if (response) {
        if (window.showToast) {
          window.showToast(t('productDetail.reviews.reply.submitSuccess'), 'success');
        } else {
          alert(t('productDetail.reviews.reply.submitSuccess'));
        }

        // Cancel reply mode
        handleCancelReply();

        // Reload reviews
        await loadRealReviews();
      }
    } catch (error) {
      console.error('Error submitting reply:', error);
      if (window.showToast) {
        window.showToast(t('productDetail.reviews.reply.submitError'), 'error');
      } else {
        alert(t('productDetail.reviews.reply.submitError'));
      }
    } finally {
      setReplySubmitting(false);
    }
  };

  // Start editing a reply
  const handleStartEditReply = (reply) => {
    setEditingReplyId(reply.reply_id);
    setEditReplyData({
      reply_text: reply.reply_text || ''
    });
    setEditReplyError('');
    setReplyingReviewId(null); // Close reply form if open
  };

  // Cancel editing reply
  const handleCancelEditReply = () => {
    setEditingReplyId(null);
    setEditReplyData({ reply_text: '' });
    setEditReplyError('');
  };

  // Handle update reply
  const handleUpdateReply = async (replyId) => {
    if (!editReplyData.reply_text.trim()) {
      setEditReplyError(t('productDetail.reviews.reply.contentRequired'));
      return;
    }

    setEditReplyError('');
    setEditReplySubmitting(true);
    try {
      console.log('Đang cập nhật reply:', replyId);

      const response = await apiService.updateReply(replyId, {
        reply_text: editReplyData.reply_text
      });

      console.log('Update reply response:', response);

      if (response) {
        if (window.showToast) {
          window.showToast(t('productDetail.reviews.reply.updateSuccess'), 'success');
        } else {
          alert(t('productDetail.reviews.reply.updateSuccess'));
        }

        // Cancel edit mode
        handleCancelEditReply();

        // Reload reviews
        await loadRealReviews();
      }
    } catch (error) {
      console.error('Error updating reply:', error);
      if (window.showToast) {
        window.showToast(t('productDetail.reviews.reply.updateError'), 'error');
      } else {
        alert(t('productDetail.reviews.reply.updateError'));
      }
    } finally {
      setEditReplySubmitting(false);
    }
  };

  // Handle delete reply
  const handleDeleteReply = async (replyId) => {
    if (!window.confirm(t('productDetail.reviews.reply.deleteConfirm'))) {
      return;
    }

    try {
      console.log('Đang xóa reply:', replyId);

      const response = await apiService.deleteReply(replyId);

      console.log('Delete reply response:', response);

      if (response) {
        if (window.showToast) {
          window.showToast(t('productDetail.reviews.reply.deleteSuccess'), 'success');
        } else {
          alert(t('productDetail.reviews.reply.deleteSuccess'));
        }

        // Reload reviews
        await loadRealReviews();
      }
    } catch (error) {
      console.error('Error deleting reply:', error);
      if (window.showToast) {
        window.showToast(t('productDetail.reviews.reply.deleteError'), 'error');
      } else {
        alert(t('productDetail.reviews.reply.deleteError'));
      }
    }
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

  if (loading || realLoading) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">{t('shop.states.loading')}</span>
        </div>
        <p className="mt-2">{t('shop.detail.loadingReviews')}</p>
      </div>
    );
  }

  return (
    <div className="reviews-section">
      {/* Product Reviews Section */}
      <div className="mb-5">
        <h5 className="mb-4 fw-bold">{t('productDetail.reviews.title')}</h5>

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
              <div className="text-muted">{t('productDetail.reviews.summaryCount', { count: totalReviews })}</div>
            </div>
          </div>
          <div className="col-md-8">
            <div className="rating-breakdown">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = realReviews ? realReviews.filter(r => r.rating === star).length : 0;
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
                  {t('productDetail.reviews.filter.all')} ({totalReviews})
                </button>
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = realReviews ? realReviews.filter(r => r.rating === rating).length : 0;
                  return (
                    <button
                      key={rating}
                      className={`btn btn-sm ${filterRating === rating.toString() ? 'btn-primary' : 'btn-outline-secondary'}`}
                      onClick={() => setFilterRating(rating.toString())}
                    >
                      {t('productDetail.reviews.filter.starWithCount', { rating, count })}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="col-md-4">
              <div className="d-flex align-items-center justify-content-end">
                <label className="me-2 small text-muted">{t('productDetail.reviews.sortLabel')}</label>
                <select
                  className="form-select form-select-sm"
                  style={{ width: 'auto' }}
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">{t('productDetail.reviews.sortOptions.newest')}</option>
                  <option value="oldest">{t('productDetail.reviews.sortOptions.oldest')}</option>
                  <option value="highest">{t('productDetail.reviews.sortOptions.highest')}</option>
                  <option value="lowest">{t('productDetail.reviews.sortOptions.lowest')}</option>
                </select>
              </div>
            </div>
          </div>
          {filteredAndSortedReviews.length !== totalReviews && (
            <div className="text-muted small">
              {t('productDetail.reviews.filterSummary', {
                count: filteredAndSortedReviews.length,
                total: totalReviews
              })}
            </div>
          )}
        </div>

        {totalReviews === 0 ? (
          <div className="text-center py-4">
            <FontAwesomeIcon icon={faStar} size="2x" className="text-muted mb-3" />
            <p className="text-muted">{t('productDetail.reviews.empty.title')}</p>
            <p className="text-muted">{t('productDetail.reviews.empty.subtitle')}</p>
          </div>
        ) : filteredAndSortedReviews.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-muted">{t('productDetail.reviews.emptyFiltered')}</p>
          </div>
        ) : (
          <div className="reviews">
            {filteredAndSortedReviews.map((review) => {
              const isOwner = user && review.user_id === user.user_id;
              const isEditing = editingReviewId === review.review_id;

              return (
                <div key={review.review_id} className="card mb-3" style={{ backgroundColor: '#f8f9fa', border: 'none' }}>
                  <div className="card-body">
                    {!isEditing ? (
                      <>
                        <div className="d-flex align-items-center mb-2">
                          <div className="avatar me-3">
                            <FontAwesomeIcon icon={faUser} className="text-muted" size="lg" />
                          </div>
                          <div className="flex-grow-1">
                            <div className="d-flex align-items-center mb-1">
                              <strong className="me-2">
                                {review.username || review.user?.name || t('productDetail.reviews.anonymousUser')}
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
                            {isOwner && user.role !== 'admin' && (
                              <div>
                                <button
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() => handleStartEdit(review)}
                                  title={t('productDetail.reviews.actions.edit')}
                                >
                                  <FontAwesomeIcon icon={faEdit} />
                                </button>
                              </div>
                            )}
                            {user && user.role === 'admin' && (
                              <div>
                                {isOwner && (
                                  <button
                                    className="btn btn-sm btn-outline-primary me-1"
                                    onClick={() => handleStartEdit(review)}
                                    title={t('productDetail.reviews.actions.edit')}
                                  >
                                    <FontAwesomeIcon icon={faEdit} />
                                  </button>
                                )}
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => handleDeleteReview(review.review_id, true)}
                                  title={t('productDetail.reviews.actions.delete')}
                                >
                                  <FontAwesomeIcon icon={faTrash} />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                        <p className="mb-2">{review.review_text}</p>

                        {/* Admin Reply Display */}
                        {review.replies && review.replies.length > 0 && review.replies.map((reply) => {
                          const isEditingReply = editingReplyId === reply.reply_id;
                          return (
                            <div key={reply.reply_id} className="border-start border-3 border-primary ps-3 mt-3">
                              {!isEditingReply ? (
                                <>
                                  <div className="d-flex justify-content-between align-items-center mb-2">
                                    <div className="d-flex align-items-center">
                                      <strong className="me-2">{reply.username || 'Admin'}</strong>
                                      <span className="badge bg-primary">Admin</span>
                                      <small className="text-muted ms-2">
                                        {new Date(reply.created_at).toLocaleDateString('vi-VN')}
                                      </small>
                                    </div>
                                    {user && user.role === 'admin' && replyingReviewId !== review.review_id && (
                                      <div>
                                        <button
                                          className="btn btn-outline-warning btn-sm me-1"
                                          onClick={() => handleStartEditReply(reply)}
                                          title={t('productDetail.reviews.reply.edit')}
                                        >
                                          <FontAwesomeIcon icon={faEdit} />
                                        </button>
                                        <button
                                          className="btn btn-outline-danger btn-sm"
                                          onClick={() => handleDeleteReply(reply.reply_id)}
                                          title={t('productDetail.reviews.reply.delete')}
                                        >
                                          <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                  <p className="mb-0">{reply.reply_text}</p>
                                </>
                              ) : (
                                <div>
                                  <div className="mb-3">
                                    <label className="form-label fw-medium">
                                      {t('productDetail.reviews.actions.edit')} <span className="text-danger">*</span>
                                    </label>
                                    <textarea
                                      className={`form-control ${editReplyError ? 'is-invalid' : ''}`}
                                      rows="3"
                                      placeholder={t('productDetail.reviews.reply.contentPlaceholder')}
                                      value={editReplyData.reply_text}
                                      onChange={(e) => {
                                        setEditReplyData(prev => ({ ...prev, reply_text: e.target.value }));
                                        if (editReplyError) {
                                          setEditReplyError('');
                                        }
                                      }}
                                      disabled={editReplySubmitting}
                                    />
                                    {editReplyError && (
                                      <div className="text-danger mt-2" style={{ fontSize: '0.875rem' }}>
                                        {editReplyError}
                                      </div>
                                    )}
                                  </div>
                                  <div className="d-flex justify-content-end gap-2">
                                    <button
                                      type="button"
                                      className="btn btn-primary btn-sm"
                                      onClick={() => handleUpdateReply(reply.reply_id)}
                                      disabled={editReplySubmitting}
                                    >
                                      {editReplySubmitting ? (
                                        <>
                                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                          {t('productDetail.reviews.reply.saving')}
                                        </>
                                      ) : (
                                        <>
                                          <FontAwesomeIcon icon={faCheck} className="me-2" />
                                          {t('productDetail.reviews.reply.save')}
                                        </>
                                      )}
                                    </button>
                                    <button
                                      type="button"
                                      className="btn btn-outline-secondary btn-sm"
                                      onClick={handleCancelEditReply}
                                      disabled={editReplySubmitting}
                                    >
                                      <FontAwesomeIcon icon={faTimes} className="me-2" />
                                      {t('productDetail.reviews.reply.cancel')}
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}

                        {/* Admin Reply Form */}
                        {user && user.role === 'admin' && replyingReviewId === review.review_id && (
                          <div className="border-start border-3 border-warning ps-3 mt-3">
                            <div className="mb-3">
                              <label className="form-label fw-medium">
                                {t('productDetail.reviews.reply.contentLabel')} <span className="text-danger">*</span>
                              </label>
                              <textarea
                                className={`form-control ${replyError ? 'is-invalid' : ''}`}
                                rows="3"
                                placeholder={t('productDetail.reviews.reply.contentPlaceholder')}
                                value={replyData.reply_text}
                                onChange={(e) => {
                                  setReplyData(prev => ({ ...prev, reply_text: e.target.value }));
                                  if (replyError) {
                                    setReplyError('');
                                  }
                                }}
                                disabled={replySubmitting}
                              />
                              {replyError && (
                                <div className="text-danger mt-2" style={{ fontSize: '0.875rem' }}>
                                  {replyError}
                                </div>
                              )}
                            </div>
                            <div className="d-flex gap-2">
                              <button
                                type="button"
                                className="btn btn-primary btn-sm"
                                onClick={() => handleSubmitReply(review.review_id)}
                                disabled={replySubmitting}
                              >
                                {replySubmitting ? (
                                  <>
                                    <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                    {t('productDetail.reviews.reply.submitting')}
                                  </>
                                ) : (
                                  t('productDetail.reviews.reply.submit')
                                )}
                              </button>
                              <button
                                type="button"
                                className="btn btn-outline-secondary btn-sm"
                                onClick={handleCancelReply}
                                disabled={replySubmitting}
                              >
                                {t('productDetail.reviews.reply.cancel')}
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Admin Reply Button - Only show if no reply exists */}
                        {user && user.role === 'admin' && replyingReviewId !== review.review_id && editingReplyId === null && (!review.replies || review.replies.length === 0) && (
                          <div className="mt-2">
                            <button
                              className="btn btn-outline-primary btn-sm"
                              onClick={() => handleStartReply(review.review_id)}
                            >
                              <FontAwesomeIcon icon={faUser} className="me-1" />
                              {t('productDetail.reviews.reply.reply')}
                            </button>
                          </div>
                        )}
                      </>
                    ) : (
                      <div>
                        <div className="mb-3">
                          <label className="form-label fw-medium">
                            {t('productDetail.reviews.editForm.ratingLabel')} <span className="text-danger">*</span>
                          </label>
                          <div className="d-flex align-items-center mb-2">
                            <div className="rating-input">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  className={`btn btn-sm p-0 me-1 ${editReviewData.rating >= star ? 'text-warning' : 'text-muted'}`}
                                  onClick={() => setEditReviewData(prev => ({ ...prev, rating: star }))}
                                  disabled={editSubmitting}
                                >
                                  <FontAwesomeIcon icon={faStar} size="lg" />
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="mb-3">
                          <label className="form-label fw-medium">
                            {t('productDetail.reviews.editForm.contentLabel')} <span className="text-danger">*</span>
                          </label>
                          <textarea
                            className="form-control"
                            rows="4"
                            placeholder={t('productDetail.reviews.editForm.contentPlaceholder')}
                            value={editReviewData.review_text}
                            onChange={(e) => setEditReviewData(prev => ({ ...prev, review_text: e.target.value }))}
                            disabled={editSubmitting}
                          />
                        </div>
                        <div className="d-flex justify-content-end gap-2">
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => handleUpdateReview(review.review_id)}
                            disabled={editSubmitting || !editReviewData.review_text.trim()}
                          >
                            {editSubmitting ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                {t('productDetail.reviews.editForm.saving')}
                              </>
                            ) : (
                              <>
                                <FontAwesomeIcon icon={faCheck} className="me-2" />
                                {t('productDetail.reviews.editForm.save')}
                              </>
                            )}
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={handleCancelEdit}
                            disabled={editSubmitting}
                          >
                            <FontAwesomeIcon icon={faTimes} className="me-2" />
                            {t('productDetail.reviews.editForm.cancel')}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Review Status Message */}
        {user && realReviews.find(review => review.user_id === user.user_id && review.book_id === parseInt(productId)) && (
          <div className="card mt-4" style={{ backgroundColor: '#e8f5e8', border: '1px solid #28a745' }}>
            <div className="card-body text-center">
              <FontAwesomeIcon icon={faStar} className="text-success me-2" />
              <span className="text-success fw-medium">{t('productDetail.reviews.alreadyReviewed')}</span>
            </div>
          </div>
        )}

        {/* Review Form - Only show for non-admin users */}
        {user && user.role !== 'admin' && !realReviews.find(review => review.user_id === user.user_id && review.book_id === parseInt(productId)) && (
          <div className="card mt-4" style={{ backgroundColor: '#f8f9fa', border: 'none' }}>
            <div className="card-body">
              <h6 className="mb-3 fw-bold">{t('productDetail.reviews.form.title')}</h6>
              <form onSubmit={handleSubmitReview}>
                <div className="mb-3">
                  <label className="form-label fw-medium">
                    {t('productDetail.reviews.form.ratingLabel')} <span className="text-danger">*</span>
                  </label>
                  <div className="d-flex align-items-center mb-2">
                    <span className="me-2">{t('productDetail.reviews.form.qualityLabel')}</span>
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
                        {newReview.rating
                          ? t(`productDetail.reviews.form.ratingOptions.${newReview.rating}`)
                          : ''}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="reviewText" className="form-label fw-medium">
                    {t('productDetail.reviews.form.contentLabel')} <span className="text-danger">*</span>
                  </label>
                  <textarea
                    className={`form-control ${reviewError ? 'is-invalid' : ''}`}
                    id="reviewText"
                    rows="4"
                    placeholder={t('productDetail.reviews.form.contentPlaceholder')}
                    value={newReview.review_text}
                    onChange={(e) => {
                      setNewReview(prev => ({ ...prev, review_text: e.target.value }));
                      // Clear error and success when user starts typing
                      if (reviewError) {
                        setReviewError('');
                      }
                      if (reviewSuccess) {
                        setReviewSuccess('');
                      }
                    }}
                    disabled={reviewSubmitting}
                    style={{
                      backgroundColor: 'white',
                      border: reviewError ? '1px solid #dc3545' : '1px solid #e9ecef'
                    }}
                  />
                  {reviewError && (
                    <div className="text-danger mt-2" style={{ fontSize: '0.875rem', display: 'block' }}>
                      {reviewError}
                    </div>
                  )}
                  {reviewSuccess && (
                    <div className="text-success mt-2" style={{ fontSize: '0.875rem', display: 'block' }}>
                      {reviewSuccess}
                    </div>
                  )}
                </div>

                <div className="d-flex justify-content-end">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={reviewSubmitting}
                  >
                    {reviewSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        {t('productDetail.reviews.form.submitting')}
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faStar} className="me-2" />
                        {t('productDetail.reviews.form.submit')}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Admin Notice - Show for admin users */}
        {user && user.role === 'admin' && (
          <div className="card mt-4" style={{ backgroundColor: '#e3f2fd', border: '1px solid #2196f3' }}>
            <div className="card-body text-center">
              <FontAwesomeIcon icon={faUser} className="text-primary me-2" />
              <span className="text-primary fw-medium">{t('productDetail.reviews.adminNotice.title')}</span>
              <p className="text-muted small mb-0 mt-2">{t('productDetail.reviews.adminNotice.description')}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewSection;