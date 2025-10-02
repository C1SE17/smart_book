import React, { useState } from 'react';

const AuthorPage = ({ onNavigateTo, onNavigateToAuthorDetail }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Dữ liệu tác giả ảo
  const authors = [
    {
      author_id: 1,
      name: "Koyoharu Gotouge",
      bio: "Tác giả manga nổi tiếng với bộ truyện 'Thanh Gươm Diệt Quỷ' (Demon Slayer). Sinh năm 1989 tại Fukuoka, Nhật Bản. Bộ truyện của cô đã trở thành một trong những manga bán chạy nhất mọi thời đại.",
      slug: "koyoharu-gotouge",
      created_at: "2020-01-15T10:30:00Z",
      updated_at: "2024-01-15T10:30:00Z",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face",
      book_count: 23,
      rating: 4.9
    },
    {
      author_id: 2,
      name: "Fujiko F. Fujio",
      bio: "Tác giả manga huyền thoại, đồng sáng tạo ra nhân vật Doraemon. Sinh năm 1933 tại Takaoka, Nhật Bản. Ông được biết đến với những tác phẩm mang tính giáo dục cao và phù hợp với mọi lứa tuổi.",
      slug: "fujiko-f-fujio",
      created_at: "2020-01-15T10:30:00Z",
      updated_at: "2024-01-15T10:30:00Z",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
      book_count: 45,
      rating: 4.8
    },
    {
      author_id: 3,
      name: "J.K. Rowling",
      bio: "Tác giả người Anh nổi tiếng với bộ truyện Harry Potter. Sinh năm 1965 tại Yate, Anh. Bà đã tạo ra một trong những thế giới phù thủy phong phú và hấp dẫn nhất trong lịch sử văn học.",
      slug: "jk-rowling",
      created_at: "2020-01-15T10:30:00Z",
      updated_at: "2024-01-15T10:30:00Z",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
      book_count: 12,
      rating: 4.9
    },
    {
      author_id: 4,
      name: "Gosho Aoyama",
      bio: "Tác giả manga trinh thám nổi tiếng với bộ truyện Detective Conan. Sinh năm 1963 tại Hokuei, Nhật Bản. Ông được biết đến với khả năng tạo ra những câu đố phức tạp và cốt truyện hấp dẫn.",
      slug: "gosho-aoyama",
      created_at: "2020-01-15T10:30:00Z",
      updated_at: "2024-01-15T10:30:00Z",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
      book_count: 100,
      rating: 4.7
    },
    {
      author_id: 5,
      name: "Eiichiro Oda",
      bio: "Tác giả manga One Piece, một trong những manga bán chạy nhất thế giới. Sinh năm 1975 tại Kumamoto, Nhật Bản. Ông được biết đến với khả năng xây dựng thế giới quan phong phú và nhân vật đa dạng.",
      slug: "eiichiro-oda",
      created_at: "2020-01-15T10:30:00Z",
      updated_at: "2024-01-15T10:30:00Z",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
      book_count: 105,
      rating: 4.9
    },
    {
      author_id: 6,
      name: "Hajime Isayama",
      bio: "Tác giả manga Attack on Titan. Sinh năm 1986 tại Ōyama, Nhật Bản. Ông được biết đến với cốt truyện căng thẳng và những twist bất ngờ trong bộ truyện nổi tiếng của mình.",
      slug: "hajime-isayama",
      created_at: "2020-01-15T10:30:00Z",
      updated_at: "2024-01-15T10:30:00Z",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
      book_count: 34,
      rating: 4.8
    },
    {
      author_id: 7,
      name: "Delia Owens",
      bio: "Tác giả người Mỹ nổi tiếng với cuốn tiểu thuyết 'Where the Crawdads Sing'. Sinh năm 1949 tại Georgia, Mỹ. Bà là nhà động vật học và nhà văn, kết hợp kiến thức khoa học với tài năng kể chuyện.",
      slug: "delia-owens",
      created_at: "2020-01-15T10:30:00Z",
      updated_at: "2024-01-15T10:30:00Z",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
      book_count: 3,
      rating: 4.6
    },
    {
      author_id: 8,
      name: "Haruki Murakami",
      bio: "Tác giả người Nhật nổi tiếng với phong cách văn học độc đáo. Sinh năm 1949 tại Kyoto, Nhật Bản. Ông được biết đến với những tác phẩm có yếu tố siêu thực và triết lý sâu sắc.",
      slug: "haruki-murakami",
      created_at: "2020-01-15T10:30:00Z",
      updated_at: "2024-01-15T10:30:00Z",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
      book_count: 18,
      rating: 4.7
    }
  ];

  // Lọc tác giả theo tìm kiếm
  const filteredAuthors = authors.filter(author => 
    author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    author.bio.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBackToHome = () => {
    onNavigateTo('home')();
  };

  const handleAuthorClick = (authorId) => {
    if (onNavigateToAuthorDetail) {
      onNavigateToAuthorDetail(authorId);
    }
  };

  return (
    <div className="container-fluid" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Breadcrumb */}
      <div className="container py-3">
        <div className="d-flex justify-content-start">
          <button
            className="btn btn-link p-0 text-decoration-none"
            onClick={handleBackToHome}
            style={{
              color: '#6c757d',
              fontSize: '16px',
              textDecoration: 'none',
              boxShadow: 'none',
              fontWeight: '500'
            }}
          >
            <i className="fas fa-arrow-left me-2"></i>
            Trang Chủ/
            <span className="fw-bold ms-1" style={{ fontSize: '16px' }}> Tác Giả</span>
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="container text-center py-5">
        <h1 className="display-4 fw-bold text-dark mb-3">Tác Giả</h1>
        <p className="text-muted fs-5">Khám phá những tác giả tài năng và tác phẩm của họ</p>
      </div>

      {/* Search and Filter */}
      <div className="container mb-5">
        <div className="row justify-content-center">
          <div className="col-lg-10 col-xl-8">
            <div className="input-group">
              <span className="input-group-text bg-white border-0">
                <i className="fas fa-search text-muted"></i>
              </span>
              <input
                type="text"
                className="form-control border-0 rounded-pill-end"
                placeholder="Tìm kiếm tác giả..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ fontSize: '1.1rem', padding: '12px 20px' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Authors Grid */}
      <div className="container mb-5">
        <div className="row g-4">
          {filteredAuthors.map(author => (
            <div key={author.author_id} className="col-lg-4 col-md-6">
              <div 
                className="card h-100 border-0 shadow-sm author-card"
                style={{ 
                  cursor: 'pointer',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  borderRadius: '15px'
                }}
                onClick={() => handleAuthorClick(author.author_id)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                }}
              >
                <div className="card-body text-center p-4">
                  <div className="mb-3">
                    <img
                      src={author.image}
                      alt={author.name}
                      className="rounded-circle mx-auto"
                      style={{ 
                        width: '100px', 
                        height: '100px', 
                        objectFit: 'cover',
                        border: '3px solid #f8f9fa',
                        display: 'block'
                      }}
                    />
                  </div>
                  
                  <h5 className="card-title fw-bold text-dark mb-2">{author.name}</h5>
                  
                  <div className="d-flex justify-content-center align-items-center mb-3">
                    <div className="d-flex align-items-center me-3">
                      <i className="fas fa-star text-warning me-1"></i>
                      <span className="text-muted small">{author.rating}</span>
                    </div>
                    <div className="d-flex align-items-center">
                      <i className="fas fa-book text-muted me-1"></i>
                      <span className="text-muted small">{author.book_count} tác phẩm</span>
                    </div>
                  </div>
                  
                  <p className="card-text text-muted small mb-3" style={{ 
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {author.bio}
                  </p>
                  
                  <button className="btn btn-outline-dark btn-sm rounded-pill px-4">
                    Xem chi tiết <i className="fas fa-arrow-right ms-1"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {filteredAuthors.length === 0 && (
        <div className="container text-center py-5">
          <i className="fas fa-search fa-3x text-muted mb-3"></i>
          <h4 className="text-muted">Không tìm thấy tác giả nào</h4>
          <p className="text-muted">Hãy thử tìm kiếm với từ khóa khác</p>
        </div>
      )}
    </div>
  );
};

export default AuthorPage;
