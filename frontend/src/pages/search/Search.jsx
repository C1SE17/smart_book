import React, { useState, useEffect } from 'react';

const Search = ({ onBackToHome }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');

  // Mock data for search results
  const mockBooks = [
    {
      id: 1,
      title: "WHERE THE CRAWDADS SING",
      author: "Delia Owens",
      price: "$20 - $30",
      category: "Fiction",
      image: "./public/images/book1.jpg",
      rating: 4.8,
      description: "A mystery novel about a girl who grows up alone in the marshes of North Carolina."
    },
    {
      id: 2,
      title: "Doraemon: Nobita's Little Star Wars",
      author: "Fujiko F. Fujio",
      price: "$15 - $25",
      category: "Manga",
      image: "./public/images/book2.jpg",
      rating: 4.6,
      description: "A classic manga series featuring the beloved robot cat Doraemon."
    },
    {
      id: 3,
      title: "Demon Slayer - Vô hạn thành",
      author: "Koyoharu Gotouge",
      price: "$18 - $28",
      category: "Manga",
      image: "./public/images/book3.jpg",
      rating: 4.9,
      description: "An epic tale of a young demon slayer's journey to save his sister."
    },
    {
      id: 4,
      title: "Conan - Vụ Án Nữ Hoàng 450",
      author: "Gosho Aoyama",
      price: "$16 - $26",
      category: "Mystery",
      image: "./public/images/book4.jpg",
      rating: 4.7,
      description: "A thrilling mystery featuring the famous detective Conan Edogawa."
    },
    {
      id: 5,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      price: "$12 - $22",
      category: "Classic Literature",
      image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=200&fit=crop",
      rating: 4.5,
      description: "A classic American novel set in the Jazz Age."
    },
    {
      id: 6,
      title: "Harry Potter and the Sorcerer's Stone",
      author: "J.K. Rowling",
      price: "$14 - $24",
      category: "Fantasy",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop",
      rating: 4.9,
      description: "The first book in the magical Harry Potter series."
    }
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'Fiction', label: 'Fiction' },
    { value: 'Manga', label: 'Manga' },
    { value: 'Mystery', label: 'Mystery' },
    { value: 'Classic Literature', label: 'Classic Literature' },
    { value: 'Fantasy', label: 'Fantasy' }
  ];

  const sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Rating' },
    { value: 'title', label: 'Title A-Z' }
  ];

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Filter books based on search query and category
      let filteredBooks = mockBooks.filter(book => 
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.description.toLowerCase().includes(searchQuery.toLowerCase())
      );

      // Filter by category
      if (selectedCategory !== 'all') {
        filteredBooks = filteredBooks.filter(book => book.category === selectedCategory);
      }

      // Sort results
      switch (sortBy) {
        case 'price-low':
          filteredBooks.sort((a, b) => {
            const priceA = parseInt(a.price.split(' - ')[0].replace('$', ''));
            const priceB = parseInt(b.price.split(' - ')[0].replace('$', ''));
            return priceA - priceB;
          });
          break;
        case 'price-high':
          filteredBooks.sort((a, b) => {
            const priceA = parseInt(a.price.split(' - ')[0].replace('$', ''));
            const priceB = parseInt(b.price.split(' - ')[0].replace('$', ''));
            return priceB - priceA;
          });
          break;
        case 'rating':
          filteredBooks.sort((a, b) => b.rating - a.rating);
          break;
        case 'title':
          filteredBooks.sort((a, b) => a.title.localeCompare(b.title));
          break;
        default:
          // Keep original order for relevance
          break;
      }

      setSearchResults(filteredBooks);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  useEffect(() => {
    if (searchQuery.trim()) {
      handleSearch();
    } else {
      setSearchResults([]);
    }
  }, [selectedCategory, sortBy]);

  return (
    <div className="min-vh-100" style={{backgroundColor: '#f5f5f5'}}>
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container py-3">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <button 
                className="btn btn-link text-dark p-0 me-3"
                onClick={onBackToHome}
                style={{border: 'none', background: 'none'}}
              >
                <i className="bi bi-arrow-left me-1"></i>
                Home
              </button>
              <h4 className="mb-0 fw-bold">Search Books</h4>
            </div>
            <div className="d-flex align-items-center">
              <span className="text-muted me-3">
                {searchResults.length} results found
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-4">
        {/* Search Bar */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card shadow-sm border-0" style={{
              transition: 'none',
              transform: 'none',
              cursor: 'default'
            }}>
              <div className="card-body p-4">
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="position-relative">
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        placeholder="Search books, authors, or keywords..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={handleKeyPress}
                        style={{
                          backgroundColor: '#f8f9fa',
                          border: '1px solid #e9ecef',
                          borderRadius: '8px',
                          padding: '12px 50px 12px 16px'
                        }}
                      />
                      <button
                        className="btn btn-primary position-absolute end-0 top-50 translate-middle-y me-2"
                        onClick={handleSearch}
                        disabled={loading}
                        style={{
                          borderRadius: '6px',
                          padding: '8px 12px',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          if (!loading) {
                            e.currentTarget.style.transform = 'translateY(-50%) scale(1.05)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,123,255,0.3)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!loading) {
                            e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                            e.currentTarget.style.boxShadow = 'none';
                          }
                        }}
                      >
                        {loading ? (
                          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        ) : (
                          <i className="bi bi-search"></i>
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <select
                      className="form-select form-select-lg"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      style={{
                        backgroundColor: '#f8f9fa',
                        border: '1px solid #e9ecef',
                        borderRadius: '8px'
                      }}
                    >
                      {categories.map(category => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-3">
                    <select
                      className="form-select form-select-lg"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      style={{
                        backgroundColor: '#f8f9fa',
                        border: '1px solid #e9ecef',
                        borderRadius: '8px'
                      }}
                    >
                      {sortOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          Sort by: {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Results */}
        {searchQuery && (
          <div className="row">
            <div className="col-12">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Searching...</span>
                  </div>
                  <p className="mt-3 text-muted">Searching for books...</p>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="row g-4">
                  {searchResults.map((book) => (
                    <div key={book.id} className="col-lg-3 col-md-4 col-sm-6">
                <div className="card h-100 shadow-sm" style={{
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                }}>
                        <img 
                          src={book.image} 
                          className="card-img-top" 
                          alt={book.title}
                          style={{height: '250px', objectFit: 'contain', backgroundColor: '#f8f9fa'}}
                        />
                        <div className="card-body d-flex flex-column">
                          <h6 className="card-title fw-bold text-dark mb-1">{book.title}</h6>
                          <p className="card-text text-muted small mb-2">{book.author}</p>
                          
                          {/* Star Rating */}
                          <div className="mb-2">
                            {[...Array(5)].map((_, i) => (
                              <i 
                                key={i} 
                                className={`bi bi-star-fill me-1 small ${
                                  i < Math.floor(book.rating) ? 'text-warning' : 'text-muted'
                                }`}
                              ></i>
                            ))}
                            <span className="text-muted small ms-1">({book.rating})</span>
                          </div>
                          
                          <p className="card-text text-muted small mb-2 flex-grow-1">
                            {book.description}
                          </p>
                          
                          <div className="d-flex justify-content-between align-items-center mt-auto">
                            <span className="fw-bold text-primary">{book.price}</span>
                            <span className="badge bg-light text-dark">{book.category}</span>
                          </div>
                          
                        <button 
                          className="btn btn-dark btn-sm mt-3"
                          style={{
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
                            e.currentTarget.style.backgroundColor = '#343a40';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                            e.currentTarget.style.backgroundColor = '#000';
                          }}
                        >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-5">
                  <i className="bi bi-search display-1 text-muted mb-3"></i>
                  <h5 className="text-muted">No books found</h5>
                  <p className="text-muted">Try adjusting your search terms or filters</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Popular Searches */}
        {!searchQuery && (
          <div className="row">
            <div className="col-12">
              <div className="card shadow-sm border-0" style={{
                transition: 'none',
                transform: 'none',
                cursor: 'default'
              }}>
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-3">Popular Searches</h5>
                  <div className="d-flex flex-wrap gap-2">
                    {['Fiction', 'Manga', 'Mystery', 'Fantasy', 'Classic Literature', 'Romance', 'Science Fiction', 'Biography'].map((term) => (
                      <button
                        key={term}
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => setSearchQuery(term)}
                        style={{
                          borderRadius: '20px',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                          e.currentTarget.style.backgroundColor = '#6c757d';
                          e.currentTarget.style.borderColor = '#6c757d';
                          e.currentTarget.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.borderColor = '#6c757d';
                          e.currentTarget.style.color = '#6c757d';
                        }}
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
