import React from 'react';

const AuthorDetail = ({ onNavigateTo, authorId }) => {
  // Dữ liệu tác giả chi tiết
  const getAuthorData = (id) => {
    const authors = {
      1: {
        author_id: 1,
        name: "Koyoharu Gotouge",
        bio: "Tác giả manga nổi tiếng với bộ truyện 'Thanh Gươm Diệt Quỷ' (Demon Slayer). Sinh năm 1989 tại Fukuoka, Nhật Bản. Bộ truyện của cô đã trở thành một trong những manga bán chạy nhất mọi thời đại với hơn 150 triệu bản được bán ra trên toàn thế giới.",
        slug: "koyoharu-gotouge",
        created_at: "2020-01-15T10:30:00Z",
        updated_at: "2024-01-15T10:30:00Z",
        image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face",
        book_count: 23,
        rating: 4.9,
        birth_year: 1989,
        nationality: "Nhật Bản",
        debut_year: 2016,
        awards: ["Manga Taisho Award 2019", "Kodansha Manga Award 2020"],
        books: [
          {
            id: 1,
            title: "Thanh Gươm Diệt Quỷ - Tập 1",
            image: "/images/book1.jpg",
            price: 815000,
            rating: 4.9
          },
          {
            id: 2,
            title: "Thanh Gươm Diệt Quỷ - Tập 2",
            image: "/images/book2.jpg",
            price: 815000,
            rating: 4.8
          },
          {
            id: 3,
            title: "Thanh Gươm Diệt Quỷ - Tập 3",
            image: "/images/book3.jpg",
            price: 815000,
            rating: 4.9
          }
        ]
      },
      2: {
        author_id: 2,
        name: "Fujiko F. Fujio",
        bio: "Tác giả manga huyền thoại, đồng sáng tạo ra nhân vật Doraemon. Sinh năm 1933 tại Takaoka, Nhật Bản. Ông được biết đến với những tác phẩm mang tính giáo dục cao và phù hợp với mọi lứa tuổi. Doraemon đã trở thành biểu tượng văn hóa của Nhật Bản.",
        slug: "fujiko-f-fujio",
        created_at: "2020-01-15T10:30:00Z",
        updated_at: "2024-01-15T10:30:00Z",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
        book_count: 45,
        rating: 4.8,
        birth_year: 1933,
        nationality: "Nhật Bản",
        debut_year: 1954,
        awards: ["Shogakukan Manga Award", "Japan Cartoonists Association Award"],
        books: [
          {
            id: 4,
            title: "Doraemon: Nobita và Cuộc Chiến Vũ Trụ",
            image: "/images/book2.jpg",
            price: 248000,
            rating: 4.8
          },
          {
            id: 5,
            title: "Doraemon: Nobita và Lịch Sử Khám Phá",
            image: "/images/book1.jpg",
            price: 248000,
            rating: 4.7
          }
        ]
      }
    };
    return authors[id] || authors[1];
  };

  const author = getAuthorData(authorId || 1);

  const handleBackToAuthors = () => {
    onNavigateTo('author')();
  };

  const handleBookClick = (bookId) => {
    onNavigateTo('product')(bookId);
  };

  return (
    <div className="container py-5" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Breadcrumb */}
      <div className="mb-4">
        <button
          className="btn btn-link text-dark p-0 no-hover"
          onClick={handleBackToAuthors}
          style={{
            border: 'none',
            background: 'none',
            fontSize: '16px',
            textDecoration: 'none',
            boxShadow: 'none',
            fontWeight: '500'
          }}
        >
          <i className="fas fa-arrow-left me-2"></i>
          Trang Chủ / Tác Giả /
          <span className="fw-bold ms-1" style={{ fontSize: '16px' }}> {author.name}</span>
        </button>
      </div>

      <div className="row">
        <div className="col-lg-4 mb-4">
          <div className="card border-0 shadow-lg">
            <div className="card-body text-center p-4">
              <img
                src={author.image}
                alt={author.name}
                className="rounded-circle mb-4"
                style={{ 
                  width: '200px', 
                  height: '200px', 
                  objectFit: 'cover',
                  border: '4px solid #f8f9fa',
                  display: 'block'
                }}
              />
              
              <h2 className="fw-bold text-dark mb-3">{author.name}</h2>
              
              <div className="row text-center mb-4">
                <div className="col-6">
                  <div className="d-flex align-items-center justify-content-center mb-2">
                    <i className="fas fa-star text-warning me-2"></i>
                    <span className="fw-bold">{author.rating}</span>
                  </div>
                  <small className="text-muted">Đánh giá</small>
                </div>
                <div className="col-6">
                  <div className="d-flex align-items-center justify-content-center mb-2">
                    <i className="fas fa-book text-primary me-2"></i>
                    <span className="fw-bold">{author.book_count}</span>
                  </div>
                  <small className="text-muted">Tác phẩm</small>
                </div>
              </div>

              <div className="text-start">
                <div className="mb-2">
                  <strong>Năm sinh:</strong> {author.birth_year}
                </div>
                <div className="mb-2">
                  <strong>Quốc tịch:</strong> {author.nationality}
                </div>
                <div className="mb-2">
                  <strong>Debut:</strong> {author.debut_year}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="card border-0 shadow-lg">
            <div className="card-body p-4">
              <h3 className="fw-bold text-dark mb-4">Tiểu sử</h3>
              <p className="text-muted mb-4" style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
                {author.bio}
              </p>

              {author.awards && author.awards.length > 0 && (
                <div className="mb-4">
                  <h4 className="fw-bold text-dark mb-3">Giải thưởng</h4>
                  <div className="row">
                    {author.awards.map((award, index) => (
                      <div key={index} className="col-md-6 mb-2">
                        <div className="d-flex align-items-center">
                          <i className="fas fa-trophy text-warning me-2"></i>
                          <span className="text-muted">{award}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-4">
                <h4 className="fw-bold text-dark mb-3">Tác phẩm nổi bật</h4>
                <div className="row g-3">
                  {author.books.map(book => (
                    <div key={book.id} className="col-md-4">
                      <div 
                        className="card h-100 border-0 shadow-sm"
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleBookClick(book.id)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-3px)';
                          e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                        }}
                      >
                        <img 
                          src={book.image} 
                          className="card-img-top" 
                          alt={book.title}
                          style={{ height: '200px', objectFit: 'cover' }}
                        />
                        <div className="card-body p-3">
                          <h6 className="card-title fw-bold text-dark mb-2" style={{ fontSize: '0.9rem' }}>
                            {book.title}
                          </h6>
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                              <i className="fas fa-star text-warning me-1" style={{ fontSize: '0.8rem' }}></i>
                              <span className="text-muted small">{book.rating}</span>
                            </div>
                            <span className="fw-bold text-dark">{book.price.toLocaleString('vi-VN')} VNĐ</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorDetail;
