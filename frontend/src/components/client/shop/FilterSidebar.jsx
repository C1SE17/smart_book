import React, { useState } from 'react';

const FilterSidebar = ({ onFilterChange }) => {
  const [selectedAuthors, setSelectedAuthors] = useState(['Ali Tufan', 'Benson Cooper', 'Brooklyn Simmons', 'Courtney Henry', 'Floyd Miles', 'Ralph Edwards']);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 400 });
  const [selectedRating, setSelectedRating] = useState(1);

  const categories = [
    { name: 'Hot Deals', count: 12, highlighted: true },
    { name: 'Made Horror', count: 12, highlighted: true },
    { name: 'Uncategorized', count: 2 },
    { name: 'Action & Adventure', count: 4 },
    { name: 'Baby', count: 4 },
    { name: 'Biography', count: 2 },
    { name: 'Crime', count: 4 },
    { name: 'Fantasy', count: 4 },
    { name: 'Food', count: 1 },
    { name: 'Health', count: 3 },
    { name: 'History', count: 3 },
    { name: 'Romance', count: 2 },
    { name: 'Sci-Fi', count: 4 },
    { name: 'Travel', count: 4 }
  ];

  const authors = [
    'Ali Tufan',
    'Benson Cooper', 
    'Brooklyn Simmons',
    'Courtney Henry',
    'Floyd Miles',
    'Ralph Edwards',
    'Ronald Richards'
  ];

  const handleAuthorChange = (author) => {
    const newSelectedAuthors = selectedAuthors.includes(author)
      ? selectedAuthors.filter(a => a !== author)
      : [...selectedAuthors, author];
    setSelectedAuthors(newSelectedAuthors);
    onFilterChange({ authors: newSelectedAuthors });
  };

  const handlePriceChange = (type, value) => {
    const newPriceRange = { ...priceRange, [type]: parseInt(value) };
    setPriceRange(newPriceRange);
    onFilterChange({ priceRange: newPriceRange });
  };

  const handleRatingChange = (rating) => {
    setSelectedRating(rating);
    onFilterChange({ rating });
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <i 
        key={index}
        className={`bi bi-star${index < rating ? '-fill' : ''} text-warning`}
        style={{ cursor: 'pointer' }}
        onClick={() => handleRatingChange(index + 1)}
      ></i>
    ));
  };

  return (
    <div className="col-lg-3 col-md-4">
      {/* Categories */}
      <div className="bg-light rounded p-3 mb-3">
        <h6 className="fw-bold text-dark mb-3">Categories</h6>
        <ul className="list-unstyled mb-0">
          {categories.map((category, index) => (
            <li key={index} className="mb-2">
              <button 
                className={`btn btn-link text-decoration-none p-0 text-start ${
                  category.highlighted ? 'fw-bold' : ''
                }`}
                style={{ fontSize: '14px', color: category.highlighted ? '#000' : '#6c757d' }}
              >
                {category.name} ({category.count})
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Author */}
      <div className="bg-light rounded p-3 mb-3">
        <h6 className="fw-bold text-dark mb-3">Author</h6>
        <ul className="list-unstyled mb-0">
          {authors.map((author, index) => (
            <li key={index} className="mb-2">
              <div className="form-check">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  id={`author-${index}`}
                  checked={selectedAuthors.includes(author)}
                  onChange={() => handleAuthorChange(author)}
                />
                <label 
                  className="form-check-label" 
                  htmlFor={`author-${index}`}
                  style={{ fontSize: '14px' }}
                >
                  {author}
                </label>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Filter by Price */}
      <div className="bg-light rounded p-3 mb-3">
        <h6 className="fw-bold text-dark mb-3">Filter by Price</h6>
        <div className="row g-2 mb-3">
          <div className="col-6">
            <label className="form-label small">Min. Price</label>
            <input 
              type="number" 
              className="form-control form-control-sm" 
              value={priceRange.min}
              onChange={(e) => handlePriceChange('min', e.target.value)}
            />
          </div>
          <div className="col-6">
            <label className="form-label small">Max. Price</label>
            <input 
              type="number" 
              className="form-control form-control-sm" 
              value={priceRange.max}
              onChange={(e) => handlePriceChange('max', e.target.value)}
            />
          </div>
        </div>
        <div className="range-slider">
          <input 
            type="range" 
            className="form-range" 
            min="0" 
            max="400" 
            value={priceRange.max}
            onChange={(e) => handlePriceChange('max', e.target.value)}
          />
        </div>
      </div>

      {/* Rating */}
      <div className="bg-light rounded p-3">
        <h6 className="fw-bold text-dark mb-3">Rating</h6>
        <div className="d-flex align-items-center">
          {renderStars(selectedRating)}
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
