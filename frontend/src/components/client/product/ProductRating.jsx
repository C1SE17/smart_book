import React from 'react';

const ProductRating = ({ productId, averageRating = 4.2, totalReviews = 128 }) => {
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="d-flex align-items-center">
        {Array.from({ length: fullStars }, (_, index) => (
          <i key={`full-${index}`} className="bi bi-star-fill text-warning me-1"></i>
        ))}
        {hasHalfStar && (
          <i className="bi bi-star-half text-warning me-1"></i>
        )}
        {Array.from({ length: emptyStars }, (_, index) => (
          <i key={`empty-${index}`} className="bi bi-star text-warning me-1"></i>
        ))}
        <span className="ms-2 fw-bold text-primary">{rating}</span>
        <span className="ms-1 text-muted">({totalReviews} đánh giá)</span>
      </div>
    );
  };

  return (
    <div className="product-rating">
      {renderStars(averageRating)}
    </div>
  );
};

export default ProductRating;
