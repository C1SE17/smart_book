import React, { useState, useEffect } from 'react';

const BooksPage = ({ onBackToHome, onViewProduct, onFilterByCategory }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 500000 });
  const [sortBy, setSortBy] = useState('default');
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);

  // Mock books data
  const allBooks = [
    { 
      id: 1, 
      title: "Doraemon: Nobita's Little Star Wars", 
      author: "Fujiko F. Fujio", 
      price: 120000, 
      category: "Manga", 
      image: "/images/book2.jpg",
      rating: 4.8,
      reviews: 156
    },
    { 
      id: 2, 
      title: "Demon Slayer - Infinity Castle", 
      author: "Koyoharu Gotouge", 
      price: 150000, 
      category: "Manga", 
      image: "/images/book3.jpg",
      rating: 4.9,
      reviews: 203
    },
    { 
      id: 3, 
      title: "WHERE THE CRAWDADS SING", 
      author: "Delia Owens", 
      price: 180000, 
      category: "Fiction", 
      image: "/images/book1.jpg",
      rating: 4.7,
      reviews: 89
    },
    { 
      id: 4, 
      title: "Conan - Vụ Án Nữ Hoàng 450", 
      author: "Gosho Aoyama", 
      price: 130000, 
      category: "Manga", 
      image: "/images/book4.jpg",
      rating: 4.6,
      reviews: 134
    },
    { 
      id: 5, 
      title: "The Great Gatsby", 
      author: "F. Scott Fitzgerald", 
      price: 100000, 
      category: "Literature", 
      image: "/images/book1.jpg",
      rating: 4.5,
      reviews: 67
    },
    { 
      id: 6, 
      title: "Atomic Habits", 
      author: "James Clear", 
      price: 200000, 
      category: "Self-Help", 
      image: "/images/book2.jpg",
      rating: 4.8,
      reviews: 312
    },
    { 
      id: 7, 
      title: "Steve Jobs Biography", 
      author: "Walter Isaacson", 
      price: 250000, 
      category: "Biography", 
      image: "/images/book3.jpg",
      rating: 4.7,
      reviews: 98
    },
    { 
      id: 8, 
      title: "1984", 
      author: "George Orwell", 
      price: 110000, 
      category: "Fiction", 
      image: "/images/book4.jpg",
      rating: 4.9,
      reviews: 245
    }
  ];

  // Categories data - map to actual book categories
  const categories = [
    { name: "Fiction", count: 2, filterValue: "Fiction" },
    { name: "Manga", count: 4, filterValue: "Manga" },
    { name: "Literature", count: 1, filterValue: "Literature" },
    { name: "Self-Help", count: 1, filterValue: "Self-Help" },
    { name: "Biography", count: 1, filterValue: "Biography" }
  ];

  // Get unique authors from books data
  const getUniqueAuthors = () => {
    const uniqueAuthors = [...new Set(allBooks.map(book => book.author))];
    return [...uniqueAuthors, "None"]; // Add "None" at the end
  };

  const authors = getUniqueAuthors();

  useEffect(() => {
    setBooks(allBooks);
    setFilteredBooks(allBooks);
  }, []);

  // Filter books based on selected filters
  useEffect(() => {
    let filtered = [...books];

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(book => book.category === selectedCategory);
    }

    // Filter by author
    if (selectedAuthor && selectedAuthor !== "None") {
      filtered = filtered.filter(book => 
        book.author.includes(selectedAuthor)
      );
    }

    // Filter by price range
    filtered = filtered.filter(book => 
      book.price >= priceRange.min && book.price <= priceRange.max
    );

    // Sort books
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => b.id - a.id);
        break;
      default:
        // Keep original order
        break;
    }

    setFilteredBooks(filtered);
  }, [selectedCategory, selectedAuthor, priceRange, sortBy, books]);

  // Update category counts based on filtered books
  const updateCategoryCounts = () => {
    const updatedCategories = categories.map(cat => {
      const count = allBooks.filter(book => book.category === cat.filterValue).length;
      return { ...cat, count };
    });
    return updatedCategories;
  };

  const categoriesWithCounts = updateCategoryCounts();

  const handleCategoryClick = (category) => {
    setSelectedCategory(selectedCategory === category ? null : category);
  };

  const handleAuthorChange = (author) => {
    setSelectedAuthor(author);
  };

  const handlePriceChange = (field, value) => {
    setPriceRange(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedAuthor(null);
    setPriceRange({ min: 0, max: 500000 });
    setSortBy('default');
  };

  return (
    <div className="min-vh-100" style={{ backgroundColor: '#f5f5f5' }}>
      <div className="container py-4">
        <div className="row">
          {/* Left Sidebar - Filters */}
          <div className="col-lg-3 col-md-4 mb-4">
            <div className="card">
              <div className="card-body">
                {/* Categories Filter */}
                <div className="mb-4">
                  <h6 className="fw-bold mb-3">Categories</h6>
                  <div className="list-group list-group-flush">
                    {categoriesWithCounts.map((category, index) => (
                      <button
                        key={index}
                        className={`list-group-item list-group-item-action border-0 px-0 py-2 ${
                          selectedCategory === category.filterValue ? 'active' : ''
                        }`}
                        onClick={() => handleCategoryClick(category.filterValue)}
                        style={{ 
                          backgroundColor: selectedCategory === category.filterValue ? '#e3f2fd' : 'transparent',
                          color: selectedCategory === category.filterValue ? '#1976d2' : '#333'
                        }}
                      >
                        {category.name} ({category.count})
                      </button>
                    ))}
                  </div>
                </div>

                {/* Author Filter */}
                <div className="mb-4">
                  <h6 className="fw-bold mb-3">Author</h6>
                  {authors.map((author, index) => (
                    <div key={index} className="form-check mb-2">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="author"
                        id={`author-${index}`}
                        checked={selectedAuthor === author}
                        onChange={() => handleAuthorChange(author)}
                      />
                      <label className="form-check-label" htmlFor={`author-${index}`}>
                        {author}
                      </label>
                    </div>
                  ))}
                </div>

                {/* Price Filter */}
                <div className="mb-4">
                  <h6 className="fw-bold mb-3">Filter by Price</h6>
                  <div className="px-2">
                    <div className="d-flex justify-content-between mb-2">
                      <small className="text-muted">0 VNĐ</small>
                      <small className="text-muted">{priceRange.max.toLocaleString('vi-VN')} VNĐ</small>
                    </div>
                    <div className="position-relative" style={{ height: '20px' }}>
                      <input
                        type="range"
                        className="form-range"
                        min="0"
                        max="500000"
                        step="10000"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange({ min: 0, max: parseInt(e.target.value) })}
                        style={{
                          width: '100%',
                          height: '20px',
                          background: 'transparent',
                          appearance: 'none',
                          outline: 'none',
                          position: 'absolute',
                          top: '0',
                          left: '0',
                          zIndex: '2'
                        }}
                      />
                      <div 
                        className="position-absolute top-50 start-0 end-0"
                        style={{
                          height: '6px',
                          backgroundColor: '#e9ecef',
                          borderRadius: '3px',
                          transform: 'translateY(-50%)',
                          zIndex: '1'
                        }}
                      ></div>
                      <div 
                        className="position-absolute top-50"
                        style={{
                          height: '6px',
                          backgroundColor: '#007bff',
                          borderRadius: '3px',
                          transform: 'translateY(-50%)',
                          left: '0%',
                          width: `${(priceRange.max / 500000) * 100}%`,
                          zIndex: '1'
                        }}
                      ></div>
                    </div>
                    <div className="d-flex justify-content-between mt-2">
                      <small className="text-muted">0 VNĐ</small>
                      <small className="text-muted">500,000 VNĐ</small>
                    </div>
                  </div>
                </div>

                {/* Clear Filters */}
                <button 
                  className="btn btn-outline-secondary btn-sm w-100"
                  onClick={clearFilters}
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>

          {/* Right Content - Books Grid */}
          <div className="col-lg-9 col-md-8">
            {/* Header with Results and Sorting */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h5 className="mb-0">Showing all {filteredBooks.length} result</h5>
              </div>
              <div className="d-flex align-items-center">
                <label className="form-label me-2 mb-0">Sort by:</label>
                <select 
                  className="form-select form-select-sm"
                  style={{ width: '150px' }}
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="default">Default sorting</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Rating</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
            </div>

            {/* Books Grid */}
            <div className="row g-3">
              {filteredBooks.map((book) => (
                <div key={book.id} className="col-lg-3 col-md-4 col-sm-6 col-6">
                  <div 
                    className="card h-100 position-relative d-flex flex-column"
                    style={{ 
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      minHeight: '400px' // Fixed height for all cards
                    }}
                    onClick={() => onViewProduct(book.id)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.12)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                    }}
                  >
                    <div className="position-relative flex-shrink-0">
                      <img 
                        src={book.image} 
                        className="card-img-top" 
                        alt={book.title}
                        style={{ 
                          height: '200px', 
                          objectFit: 'contain',
                          backgroundColor: '#f8f9fa',
                          width: '100%',
                          padding: '10px'
                        }}
                      />
                      {/* Add to Cart Button - appears on hover */}
                      <div 
                        className="position-absolute bottom-0 start-0 end-0 p-2"
                        style={{ 
                          background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                          opacity: 0,
                          transition: 'opacity 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.opacity = '1';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.opacity = '0';
                        }}
                      >
                        <button 
                          className="btn btn-sm w-100"
                          style={{
                            backgroundColor: 'white',
                            color: '#333',
                            border: '1px solid #ddd',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#007bff';
                            e.target.style.color = 'white';
                            e.target.style.borderColor = '#007bff';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'white';
                            e.target.style.color = '#333';
                            e.target.style.borderColor = '#ddd';
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle add to cart
                            console.log('Add to cart:', book.id);
                          }}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                    
                    <div className="card-body p-3 d-flex flex-column flex-grow-1">
                      <h6 className="card-title fw-bold mb-2" style={{ fontSize: '14px', lineHeight: '1.3', minHeight: '36px' }}>
                        {book.title}
                      </h6>
                      <p className="card-text text-muted small mb-2" style={{ fontSize: '12px' }}>
                        {book.author}
                      </p>
                      
                      {/* Rating */}
                      <div className="d-flex align-items-center mb-2">
                        <div className="me-1">
                          {[...Array(5)].map((_, i) => (
                            <i 
                              key={i} 
                              className={`bi bi-star-fill ${
                                i < Math.floor(book.rating) ? 'text-warning' : 'text-muted'
                              }`}
                              style={{ fontSize: '10px' }}
                            ></i>
                          ))}
                        </div>
                        <small className="text-muted" style={{ fontSize: '10px' }}>({book.reviews})</small>
                      </div>
                      
                      <div className="d-flex justify-content-between align-items-center mt-auto">
                        <span className="fw-bold text-primary" style={{ fontSize: '14px' }}>
                          {book.price.toLocaleString('vi-VN')} VNĐ
                        </span>
                        <span className="badge bg-dark text-white" style={{ fontSize: '10px' }}>
                          {book.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* No Results */}
            {filteredBooks.length === 0 && (
              <div className="text-center py-5">
                <i className="bi bi-search display-1 text-muted mb-3"></i>
                <h5 className="text-muted">No books found</h5>
                <p className="text-muted">Try adjusting your filters</p>
                <button 
                  className="btn btn-outline-primary"
                  onClick={clearFilters}
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BooksPage;
