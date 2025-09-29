import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocalStorage } from '../../../hooks';
import { cartService, bookService } from '../../../services';

const Search = ({ onBackToHome, onNavigateTo, initialSearchQuery = '', onSearch }) => {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user] = useLocalStorage('user', null);

  const addToCart = useCallback(async (bookId) => {
    if (!user) {
      alert('Please login to add items to cart');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await cartService.addItem(bookId, 1, token);
      alert('Item added to cart successfully!');
    } catch (error) {
      console.error('Error adding item to cart:', error);
      alert('Failed to add item to cart. Please try again.');
    }
  }, [user]);

  // Search function
  const performSearch = useCallback(async (query) => {
    setLoading(true);
    try {
      // Handle regular search
      const data = await bookService.search(query);
      setSearchResults(data);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Effect to perform search when initialSearchQuery changes
  useEffect(() => {
    if (initialSearchQuery) {
      performSearch(initialSearchQuery);
    }
  }, [initialSearchQuery, performSearch]);

  // Mock data for search results - memoized to avoid recreation
  const mockBooks = useMemo(() => [
    {
      book_id: 1,
      title: "WHERE THE CRAWDADS SING",
      description: "A mystery novel about a girl who grows up alone in the marshes of North Carolina.",
      price: 25.99,
      stock: 10,
      category_id: 1,
      author_id: 1,
      publisher_id: 1,
      published_date: "2020-01-01",
      cover_image: "./public/images/book1.jpg",
      slug: "where-the-crawdads-sing"
    },
    {
      book_id: 2,
      title: "Doraemon: Nobita's Little Star Wars",
      description: "A classic manga series featuring the beloved robot cat Doraemon.",
      price: 19.99,
      stock: 15,
      category_id: 2,
      author_id: 2,
      publisher_id: 2,
      published_date: "2020-01-01",
      cover_image: "./public/images/book2.jpg",
      slug: "doraemon-nobita-little-star-wars"
    },
    {
      book_id: 3,
      title: "Demon Slayer - Vô hạn thành",
      description: "An epic tale of a young demon slayer's journey to save his sister.",
      price: 22.99,
      stock: 8,
      category_id: 2,
      author_id: 3,
      publisher_id: 2,
      published_date: "2020-01-01",
      cover_image: "./public/images/book3.jpg",
      slug: "demon-slayer-vo-han-thanh"
    },
    {
      book_id: 4,
      title: "Conan - Vụ Án Nữ Hoàng 450",
      description: "A thrilling mystery featuring the famous detective Conan Edogawa.",
      price: 21.99,
      stock: 12,
      category_id: 3,
      author_id: 4,
      publisher_id: 2,
      published_date: "2020-01-01",
      cover_image: "./public/images/book4.jpg",
      slug: "conan-vu-an-nu-hoang-450"
    },
    {
      book_id: 5,
      title: "The Great Gatsby",
      description: "A classic American novel set in the Jazz Age.",
      price: 16.99,
      stock: 20,
      category_id: 4,
      author_id: 5,
      publisher_id: 3,
      published_date: "2020-01-01",
      cover_image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=200&fit=crop",
      slug: "the-great-gatsby"
    },
    {
      book_id: 6,
      title: "Harry Potter and the Sorcerer's Stone",
      description: "The first book in the magical Harry Potter series.",
      price: 18.99,
      stock: 25,
      category_id: 5,
      author_id: 6,
      publisher_id: 3,
      published_date: "2020-01-01",
      cover_image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop",
      slug: "harry-potter-sorcerers-stone"
    }
  ], []);

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Filter books based on search query
      const filteredBooks = mockBooks.filter(book => 
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.description.toLowerCase().includes(searchQuery.toLowerCase())
      );

      setSearchResults(filteredBooks);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, mockBooks]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }, [handleSearch]);

  useEffect(() => {
    if (searchQuery.trim()) {
      handleSearch();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, handleSearch]);

  return (
    <div className="min-vh-100" style={{ backgroundColor: '#f5f5f5' }}>
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-md-10">
            <div className="card shadow-sm border-0" style={{
              transition: 'none',
              transform: 'none',
              cursor: 'default'
            }}>
              <div className="card-body p-4">
                {/* Header with Back Home and Search Books Title */}
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <div className="d-flex align-items-center">
                    <button
                      className="btn btn-link text-dark p-0 me-3"
                      onClick={onBackToHome}
                      style={{
                        border: 'none',
                        background: 'none',
                        fontSize: '16px',
                        textDecoration: 'none',
                        boxShadow: 'none'
                      }}
                    >
                      <i className="bi bi-arrow-left me-1"></i>
                      Home/
                      <span className="fw-bold" style={{ fontSize: '16px' }}> Search</span>
                    </button>
                  </div>
                  <div className="d-flex align-items-center">
                    <span className="text-muted">
                      {searchResults.length} results found
                    </span>
                  </div>
                </div>

                {/* Search Bar */}
                <div className="mb-4">
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
                    >
                      {loading ? (
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      ) : (
                        <i className="bi bi-search"></i>
                      )}
                    </button>
                  </div>
                </div>

                {/* Popular Searches */}
                {!searchQuery && (
                  <div>
                    <h5 className="fw-bold mb-3">Popular Searches</h5>
                    <div className="d-flex flex-wrap gap-2">
                      {['Doraemon', 'Harry Potter', 'The Great Gatsby', 'Demon Slayer', 'Conan', 'Romance', 'Science Fiction', 'Biography'].map((term) => (
                        <button
                          key={term}
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => setSearchQuery(term)}
                          style={{
                            borderRadius: '20px',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Search Results */}
        {searchQuery && (
          <div className="row mt-5">
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
                    <div key={book.book_id} className="col-lg-3 col-md-4 col-sm-6">
                      <div className="card h-100 shadow-sm" style={{
                        transition: 'all 0.3s ease',
                        cursor: 'pointer'
                      }}
                        onClick={() => console.log('Book clicked:', book.book_id)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-5px)';
                          e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                        }}>
                        <img
                          src={book.cover_image}
                          className="card-img-top"
                          alt={book.title}
                          style={{ height: '250px', objectFit: 'contain', backgroundColor: '#f8f9fa' }}
                        />
                        <div className="card-body d-flex flex-column">
                          <h6 className="card-title fw-bold text-dark mb-1">{book.title}</h6>
                          <p className="card-text text-muted small mb-2">Stock: {book.stock}</p>

                          <p className="card-text text-muted small mb-2 flex-grow-1">
                            {book.description}
                          </p>

                          <div className="d-flex justify-content-between align-items-center mt-auto">
                            <span className="fw-bold text-primary">${book.price}</span>
                          </div>

                          <button
                            className="btn btn-dark btn-sm mt-3"
                            style={{
                              transition: 'all 0.3s ease'
                            }}
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent card click when clicking button
                              addToCart(book.book_id);
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

      </div>
    </div>
  );
};

export default Search;
