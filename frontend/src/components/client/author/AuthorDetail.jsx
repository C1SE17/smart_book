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
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
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
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face",
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
      },
      3: {
        author_id: 3,
        name: "J.K. Rowling",
        bio: "Tác giả người Anh nổi tiếng với bộ truyện Harry Potter. Sinh năm 1965 tại Yate, Anh. Bà đã tạo ra một trong những thế giới phù thủy phong phú và hấp dẫn nhất trong lịch sử văn học. Bộ truyện Harry Potter đã bán được hơn 500 triệu bản trên toàn thế giới.",
        slug: "jk-rowling",
        created_at: "2020-01-15T10:30:00Z",
        updated_at: "2024-01-15T10:30:00Z",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
        book_count: 12,
        rating: 4.9,
        birth_year: 1965,
        nationality: "Anh",
        debut_year: 1997,
        awards: ["Hugo Award", "Nebula Award", "Bram Stoker Award"],
        books: [
          {
            id: 6,
            title: "Harry Potter và Hòn Đá Phù Thủy",
            image: "/images/book1.jpg",
            price: 320000,
            rating: 4.9
          },
          {
            id: 7,
            title: "Harry Potter và Phòng Chứa Bí Mật",
            image: "/images/book2.jpg",
            price: 320000,
            rating: 4.8
          },
          {
            id: 8,
            title: "Harry Potter và Tù Nhân Azkaban",
            image: "/images/book3.jpg",
            price: 320000,
            rating: 4.9
          }
        ]
      },
      4: {
        author_id: 4,
        name: "Gosho Aoyama",
        bio: "Tác giả manga trinh thám nổi tiếng với bộ truyện Detective Conan. Sinh năm 1963 tại Hokuei, Nhật Bản. Ông được biết đến với khả năng tạo ra những câu đố phức tạp và cốt truyện hấp dẫn. Detective Conan đã trở thành một trong những manga trinh thám thành công nhất.",
        slug: "gosho-aoyama",
        created_at: "2020-01-15T10:30:00Z",
        updated_at: "2024-01-15T10:30:00Z",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face",
        book_count: 100,
        rating: 4.7,
        birth_year: 1963,
        nationality: "Nhật Bản",
        debut_year: 1987,
        awards: ["Shogakukan Manga Award", "Kodansha Manga Award"],
        books: [
          {
            id: 9,
            title: "Detective Conan - Tập 1",
            image: "/images/book1.jpg",
            price: 180000,
            rating: 4.7
          },
          {
            id: 10,
            title: "Detective Conan - Tập 2",
            image: "/images/book2.jpg",
            price: 180000,
            rating: 4.6
          },
          {
            id: 11,
            title: "Detective Conan - Tập 3",
            image: "/images/book3.jpg",
            price: 180000,
            rating: 4.8
          }
        ]
      },
      5: {
        author_id: 5,
        name: "Eiichiro Oda",
        bio: "Tác giả manga One Piece, một trong những manga bán chạy nhất thế giới. Sinh năm 1975 tại Kumamoto, Nhật Bản. Ông được biết đến với khả năng xây dựng thế giới quan phong phú và nhân vật đa dạng. One Piece đã bán được hơn 500 triệu bản trên toàn thế giới.",
        slug: "eiichiro-oda",
        created_at: "2020-01-15T10:30:00Z",
        updated_at: "2024-01-15T10:30:00Z",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
        book_count: 105,
        rating: 4.9,
        birth_year: 1975,
        nationality: "Nhật Bản",
        debut_year: 1997,
        awards: ["Shogakukan Manga Award", "Tezuka Osamu Cultural Prize"],
        books: [
          {
            id: 12,
            title: "One Piece - Tập 1",
            image: "/images/book1.jpg",
            price: 200000,
            rating: 4.9
          },
          {
            id: 13,
            title: "One Piece - Tập 2",
            image: "/images/book2.jpg",
            price: 200000,
            rating: 4.8
          },
          {
            id: 14,
            title: "One Piece - Tập 3",
            image: "/images/book3.jpg",
            price: 200000,
            rating: 4.9
          }
        ]
      },
      6: {
        author_id: 6,
        name: "Hajime Isayama",
        bio: "Tác giả manga Attack on Titan. Sinh năm 1986 tại Ōyama, Nhật Bản. Ông được biết đến với cốt truyện căng thẳng và những twist bất ngờ trong bộ truyện nổi tiếng của mình. Attack on Titan đã trở thành một hiện tượng văn hóa toàn cầu.",
        slug: "hajime-isayama",
        created_at: "2020-01-15T10:30:00Z",
        updated_at: "2024-01-15T10:30:00Z",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face",
        book_count: 34,
        rating: 4.8,
        birth_year: 1986,
        nationality: "Nhật Bản",
        debut_year: 2009,
        awards: ["Kodansha Manga Award", "Hiroshima Manga Award"],
        books: [
          {
            id: 15,
            title: "Attack on Titan - Tập 1",
            image: "/images/book1.jpg",
            price: 220000,
            rating: 4.8
          },
          {
            id: 16,
            title: "Attack on Titan - Tập 2",
            image: "/images/book2.jpg",
            price: 220000,
            rating: 4.7
          },
          {
            id: 17,
            title: "Attack on Titan - Tập 3",
            image: "/images/book3.jpg",
            price: 220000,
            rating: 4.9
          }
        ]
      },
      7: {
        author_id: 7,
        name: "Delia Owens",
        bio: "Tác giả người Mỹ nổi tiếng với cuốn tiểu thuyết 'Where the Crawdads Sing'. Sinh năm 1949 tại Georgia, Mỹ. Bà là nhà động vật học và nhà văn, kết hợp kiến thức khoa học với tài năng kể chuyện. Cuốn sách đã trở thành bestseller và được chuyển thể thành phim.",
        slug: "delia-owens",
        created_at: "2020-01-15T10:30:00Z",
        updated_at: "2024-01-15T10:30:00Z",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
        book_count: 3,
        rating: 4.6,
        birth_year: 1949,
        nationality: "Mỹ",
        debut_year: 2018,
        awards: ["Goodreads Choice Award", "Barnes & Noble Book of the Year"],
        books: [
          {
            id: 18,
            title: "Where the Crawdads Sing",
            image: "/images/book1.jpg",
            price: 280000,
            rating: 4.6
          },
          {
            id: 19,
            title: "The Eye of the Elephant",
            image: "/images/book2.jpg",
            price: 250000,
            rating: 4.5
          },
          {
            id: 20,
            title: "Cry of the Kalahari",
            image: "/images/book3.jpg",
            price: 260000,
            rating: 4.7
          }
        ]
      },
      8: {
        author_id: 8,
        name: "Haruki Murakami",
        bio: "Tác giả người Nhật nổi tiếng với phong cách văn học độc đáo. Sinh năm 1949 tại Kyoto, Nhật Bản. Ông được biết đến với những tác phẩm có yếu tố siêu thực và triết lý sâu sắc. Ông đã nhận được nhiều giải thưởng văn học quốc tế và được đề cử giải Nobel Văn học.",
        slug: "haruki-murakami",
        created_at: "2020-01-15T10:30:00Z",
        updated_at: "2024-01-15T10:30:00Z",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
        book_count: 18,
        rating: 4.7,
        birth_year: 1949,
        nationality: "Nhật Bản",
        debut_year: 1979,
        awards: ["Franz Kafka Prize", "Jerusalem Prize", "Hans Christian Andersen Literature Award"],
        books: [
          {
            id: 21,
            title: "Norwegian Wood",
            image: "/images/book1.jpg",
            price: 350000,
            rating: 4.7
          },
          {
            id: 22,
            title: "Kafka on the Shore",
            image: "/images/book2.jpg",
            price: 380000,
            rating: 4.8
          },
          {
            id: 23,
            title: "1Q84",
            image: "/images/book3.jpg",
            price: 420000,
            rating: 4.6
          }
        ]
      }
    };
    return authors[id] || authors[1];
  };

  const author = getAuthorData(authorId || 1);

  const handleBackToAuthors = () => {
    onNavigateTo('author');
  };

  const handleBookClick = (bookId) => {
    onNavigateTo('product', { productId: bookId });
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
                className="rounded-circle mb-4 mx-auto"
                style={{
                  width: '200px',
                  height: '200px',
                  objectFit: 'cover',
                  border: '4px solid #f8f9fa',
                  display: 'block'
                }}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300x300/6c757d/ffffff?text=' + encodeURIComponent(author.name.charAt(0));
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
