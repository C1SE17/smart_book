import React, { useMemo, useCallback } from 'react';

const Home = ({ onNavigateTo }) => {
  // Ghi nhớ dữ liệu để tránh tạo lại mỗi lần render
  const blogPosts = useMemo(() => [
    { title: "Fujiko F. Fujio - The Creator of Doraemon", date: "24 Oct, 2019", image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=200&fit=crop" },
    { title: "The Art of Manga Storytelling", date: "15 Nov, 2019", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=200&fit=crop" },
    { title: "Top 10 Must-Read Manga Series", date: "01 Dec, 2019", image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=200&fit=crop" }
  ], []);

  // Ghi nhớ các event handlers
  const handleBookClick = useCallback((bookId) => {
    // Chuyển đến trang tìm kiếm khi click vào sách
    onNavigateTo('search')();
  }, [onNavigateTo]);

  // Xử lý thêm vào giỏ hàng - chỉ sử dụng localStorage
  const handleAddToCart = useCallback((bookId, e) => {
    e.stopPropagation();
    
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item.book_id === bookId);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        book_id: bookId,
        quantity: 1,
        added_at: new Date().toISOString()
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent('cartUpdated', { 
      detail: { cart, action: 'add', bookId } 
    }));
  }, []);


  return (
    <main className="flex-grow-1">
      {/* Danh Mục Nổi Bật Section */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="row align-items-center mb-4">
            <div className="col">
              <h2 className="fw-bold text-dark">Danh Mục Sản Phẩm</h2>
            </div>
            <div className="col-auto">
              <a href="#" className="btn btn-outline-primary">
                Xem Tất Cả <i className="bi bi-arrow-right ms-1"></i>
              </a>
            </div>
          </div>
          
          <div className="row g-4">
            {[
              { 
                category_id: 1, 
                name: "Sách Theo Tác Giả", 
                book_count: 15, 
                image: "https://cafefcdn.com/203337114487263232/2023/2/3/photo-4-1675433065659292646649.jpg",
                description: "Danh mục sách theo tác giả"
              },
              { 
                category_id: 2, 
                name: "Truyện Tranh", 
                book_count: 25, 
                image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop",
                description: "Truyện Manga, comic"
              },
              { 
                category_id: 3, 
                name: "Tiểu Thuyết", 
                book_count: 10, 
                image: "https://upload.wikimedia.org/wikipedia/vi/2/22/B%C3%ACa_ti%E1%BB%83u_thuy%E1%BA%BFt_C%C3%B4_th%C3%A0nh_trong_g%C6%B0%C6%A1ng.jpg",
                description: "Tiểu thuyết các thể loại"
              },
              { 
                category_id: 4, 
                name: "Đồ Chơi", 
                book_count: 20, 
                image: "https://product.hstatic.net/1000237375/product/dk81020_-_1_b4b0a4cc00da4d52814c03722f2be17d.jpg",
                description: "Đồ chơi trẻ em"
              }
            ].map((category, index) => (
              <div key={index} className="col-lg-3 col-md-6">
                <div className="card h-100 border-0 shadow-sm" style={{
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  borderRadius: '12px',
                  overflow: 'hidden'
                }}
                onClick={() => onNavigateTo('search')()}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.15)';
                  // Hiển thị nút thêm vào giỏ hàng
                  const addToCartBtn = e.currentTarget.querySelector('.add-to-cart-btn');
                  if (addToCartBtn) {
                    addToCartBtn.style.opacity = '1';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                  // Ẩn nút thêm vào giỏ hàng
                  const addToCartBtn = e.currentTarget.querySelector('.add-to-cart-btn');
                  if (addToCartBtn) {
                    addToCartBtn.style.opacity = '0';
                  }
                }}>
                  <div className="position-relative">
                    <img 
                      src={category.image} 
                      className="card-img-top" 
                      alt={category.name}
                      style={{
                        height: '200px', 
                        objectFit: 'cover',
                        width: '100%'
                      }}
                    />
                    <div className="position-absolute top-0 end-0 m-3">
                      <span className="badge bg-primary px-3 py-2" style={{ fontSize: '0.8rem' }}>
                        {category.book_count} books
                      </span>
                    </div>
                  </div>
                  
                  <div className="card-body p-4 text-center">
                    <h5 className="card-title fw-bold mb-2" style={{ fontSize: '1.2rem' }}>
                      {category.name}
                    </h5>
                    <p className="card-text text-muted mb-3" style={{ fontSize: '0.9rem' }}>
                      {category.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sách Nổi Bật Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row align-items-center mb-4">
            <div className="col">
              <h2 className="fw-bold text-dark">Sách Nổi Bật</h2>
            </div>
            <div className="col-auto">
              <a href="#" className="btn btn-outline-primary">
                Xem Tất Cả <i className="bi bi-arrow-right ms-1"></i>
              </a>
            </div>
          </div>
          
          <div className="row g-4">
            {[
              { 
                book_id: 1, 
                title: "WHERE THE CRAWDADS SING", 
                author: "Delia Owens", 
                price: 180000, 
                rating: 5.0,
                image: "./public/images/book1.jpg" 
              },
              { 
                book_id: 2, 
                title: "Doraemon: Nobita's Little Star Wars", 
                author: "Fujiko F. Fujio", 
                price: 120000, 
                rating: 5.0,
                image: "./public/images/book2.jpg" 
              },
              { 
                book_id: 3, 
                title: "Demon Slayer - Vô hạn thành", 
                author: "Koyoharu Gotouge", 
                price: 150000, 
                rating: 5.0,
                image: "./public/images/book3.jpg" 
              },
              { 
                book_id: 4, 
                title: "Conan - Vụ Án Nữ Hoàng 450", 
                author: "Gosho Aoyama", 
                price: 130000, 
                rating: 5.0,
                image: "./public/images/book4.jpg" 
              }
            ].map((book, index) => (
              <div key={index} className="col-lg-3 col-md-6">
                <div className="card h-100 border-0 shadow-sm" style={{
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  borderRadius: '12px',
                  overflow: 'hidden'
                }}
                onClick={() => handleBookClick(book.book_id)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.15)';
                  // Hiển thị nút thêm vào giỏ hàng
                  const addToCartBtn = e.currentTarget.querySelector('.add-to-cart-btn');
                  if (addToCartBtn) {
                    addToCartBtn.style.opacity = '1';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                  // Ẩn nút thêm vào giỏ hàng
                  const addToCartBtn = e.currentTarget.querySelector('.add-to-cart-btn');
                  if (addToCartBtn) {
                    addToCartBtn.style.opacity = '0';
                  }
                }}>
                  <div className="position-relative">
                    <img 
                      src={book.image} 
                      className="card-img-top" 
                      alt={book.title}
                      style={{
                        height: '280px', 
                        objectFit: 'contain',
                        width: '100%',
                        backgroundColor: '#f8f9fa',
                        padding: '10px'
                      }}
                    />
                    {/* Nút Thêm Vào Giỏ Hàng - xuất hiện khi hover */}
                    <div 
                      className="position-absolute top-0 end-0 p-2 add-to-cart-btn"
                      style={{ 
                        opacity: 0,
                        transition: 'opacity 0.3s ease'
                      }}
                    >
                      <button 
                        className="btn btn-sm btn-light rounded-circle"
                        style={{
                          width: '40px',
                          height: '40px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        onClick={(e) => handleAddToCart(book.book_id, e)}
                      >
                        <i className="bi bi-cart-plus"></i>
                      </button>
                    </div>
                  </div>
                  
                  <div className="card-body p-3 d-flex flex-column">
                    <h6 className="card-title fw-bold mb-2" style={{ 
                      fontSize: '1rem', 
                      lineHeight: '1.3',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      minHeight: '2.6rem'
                    }}>
                      {book.title}
                    </h6>
                    <p className="card-text text-muted small mb-2" style={{ fontSize: '0.85rem' }}>
                      {book.author}
                    </p>
                    
                    {/* Star Rating */}
                    <div className="mb-3">
                      <div className="d-flex align-items-center">
                        <div className="me-1">
                          {[...Array(5)].map((_, i) => (
                            <i 
                              key={i} 
                              className={`bi bi-star-fill ${
                                i < Math.floor(book.rating) ? 'text-warning' : 'text-muted'
                              }`}
                              style={{ fontSize: '12px' }}
                            ></i>
                          ))}
                          {book.rating % 1 !== 0 && (
                            <i className="bi bi-star-half text-warning" style={{ fontSize: '12px' }}></i>
                          )}
                        </div>
                        <span className="text-muted small" style={{ fontSize: '11px' }}>
                          ({book.rating})
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-auto">
                      <p className="card-text fw-bold text-primary mb-0" style={{ fontSize: '1.1rem' }}>
                        {book.price.toLocaleString('vi-VN')} VNĐ
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sách Mới Section */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="row align-items-center mb-4">
            <div className="col">
              <h2 className="fw-bold text-dark">Sách Mới</h2>
            </div>
            <div className="col-auto">
              <a href="#" className="btn btn-outline-primary">
                Xem Tất Cả <i className="bi bi-arrow-right ms-1"></i>
              </a>
            </div>
          </div>
          
          <div className="row g-4">
            {[
              { 
                book_id: 1, 
                title: "WHERE THE CRAWDADS SING", 
                author: "Delia Owens", 
                price: 180000, 
                rating: 5.0,
                image: "./public/images/book1.jpg" 
              },
              { 
                book_id: 2, 
                title: "Doraemon: Nobita's Little Star Wars", 
                author: "Fujiko F. Fujio", 
                price: 120000, 
                rating: 5.0,
                image: "./public/images/book2.jpg" 
              },
              { 
                book_id: 3, 
                title: "Demon Slayer - Vô hạn thành", 
                author: "Koyoharu Gotouge", 
                price: 150000, 
                rating: 5.0,
                image: "./public/images/book3.jpg" 
              },
              { 
                book_id: 4, 
                title: "Conan - Vụ Án Nữ Hoàng 450", 
                author: "Gosho Aoyama", 
                price: 130000, 
                rating: 5.0,
                image: "./public/images/book4.jpg" 
              }
            ].map((book, index) => (
              <div key={index} className="col-lg-3 col-md-6">
                <div className="card h-100 border-0 shadow-sm" style={{
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  borderRadius: '12px',
                  overflow: 'hidden'
                }}
                onClick={() => handleBookClick(book.book_id)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.15)';
                  // Hiển thị nút thêm vào giỏ hàng
                  const addToCartBtn = e.currentTarget.querySelector('.add-to-cart-btn');
                  if (addToCartBtn) {
                    addToCartBtn.style.opacity = '1';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                  // Ẩn nút thêm vào giỏ hàng
                  const addToCartBtn = e.currentTarget.querySelector('.add-to-cart-btn');
                  if (addToCartBtn) {
                    addToCartBtn.style.opacity = '0';
                  }
                }}>
                  <div className="position-relative">
                    <img 
                      src={book.image} 
                      className="card-img-top" 
                      alt={book.title}
                      style={{
                        height: '280px', 
                        objectFit: 'contain',
                        width: '100%',
                        backgroundColor: '#f8f9fa',
                        padding: '10px'
                      }}
                    />
                    {/* Nút Thêm Vào Giỏ Hàng - xuất hiện khi hover */}
                    <div 
                      className="position-absolute top-0 end-0 p-2 add-to-cart-btn"
                      style={{ 
                        opacity: 0,
                        transition: 'opacity 0.3s ease'
                      }}
                    >
                      <button 
                        className="btn btn-sm btn-light rounded-circle"
                        style={{
                          width: '40px',
                          height: '40px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        onClick={(e) => handleAddToCart(book.book_id, e)}
                      >
                        <i className="bi bi-cart-plus"></i>
                      </button>
                    </div>
                  </div>
                  
                  <div className="card-body p-3 d-flex flex-column">
                    <h6 className="card-title fw-bold mb-2" style={{ 
                      fontSize: '1rem', 
                      lineHeight: '1.3',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      minHeight: '2.6rem'
                    }}>
                      {book.title}
                    </h6>
                    <p className="card-text text-muted small mb-2" style={{ fontSize: '0.85rem' }}>
                      {book.author}
                    </p>
                    
                    {/* Star Rating */}
                    <div className="mb-3">
                      <div className="d-flex align-items-center">
                        <div className="me-1">
                          {[...Array(5)].map((_, i) => (
                            <i 
                              key={i} 
                              className={`bi bi-star-fill ${
                                i < Math.floor(book.rating) ? 'text-warning' : 'text-muted'
                              }`}
                              style={{ fontSize: '12px' }}
                            ></i>
                          ))}
                        </div>
                        <span className="text-muted small" style={{ fontSize: '11px' }}>
                          ({book.rating})
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-auto">
                      <p className="card-text fw-bold text-primary mb-0" style={{ fontSize: '1.1rem' }}>
                        {book.price.toLocaleString('vi-VN')} VNĐ
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sách Phổ Biến Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row align-items-center mb-4">
            <div className="col">
              <h2 className="fw-bold text-dark">Sách Phổ Biến</h2>
            </div>
            <div className="col-auto">
              <a href="#" className="btn btn-outline-primary">
                Xem Tất Cả <i className="bi bi-arrow-right ms-1"></i>
              </a>
            </div>
          </div>
          
          <div className="row g-4">
            {[
              { 
                book_id: 1, 
                title: "WHERE THE CRAWDADS SING", 
                author: "Delia Owens", 
                price: 180000, 
                rating: 5.0,
                image: "./public/images/book1.jpg" 
              },
              { 
                book_id: 2, 
                title: "Doraemon: Nobita's Little Star Wars", 
                author: "Fujiko F. Fujio", 
                price: 120000, 
                rating: 5.0,
                image: "./public/images/book2.jpg" 
              },
              { 
                book_id: 3, 
                title: "Demon Slayer - Vô hạn thành", 
                author: "Koyoharu Gotouge", 
                price: 150000, 
                rating: 5.0,
                image: "./public/images/book3.jpg" 
              },
              { 
                book_id: 4, 
                title: "Conan - Vụ Án Nữ Hoàng 450", 
                author: "Gosho Aoyama", 
                price: 130000, 
                rating: 5.0,
                image: "./public/images/book4.jpg" 
              }
            ].map((book, index) => (
              <div key={index} className="col-lg-3 col-md-6">
                <div className="card h-100 border-0 shadow-sm" style={{
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  borderRadius: '12px',
                  overflow: 'hidden'
                }}
                onClick={() => handleBookClick(book.book_id)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.15)';
                  // Hiển thị nút thêm vào giỏ hàng
                  const addToCartBtn = e.currentTarget.querySelector('.add-to-cart-btn');
                  if (addToCartBtn) {
                    addToCartBtn.style.opacity = '1';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                  // Ẩn nút thêm vào giỏ hàng
                  const addToCartBtn = e.currentTarget.querySelector('.add-to-cart-btn');
                  if (addToCartBtn) {
                    addToCartBtn.style.opacity = '0';
                  }
                }}>
                  <div className="position-relative">
                    <img 
                      src={book.image} 
                      className="card-img-top" 
                      alt={book.title}
                      style={{
                        height: '280px', 
                        objectFit: 'contain',
                        width: '100%',
                        backgroundColor: '#f8f9fa',
                        padding: '10px'
                      }}
                    />
                    {/* Nút Thêm Vào Giỏ Hàng - xuất hiện khi hover */}
                    <div 
                      className="position-absolute top-0 end-0 p-2 add-to-cart-btn"
                      style={{ 
                        opacity: 0,
                        transition: 'opacity 0.3s ease'
                      }}
                    >
                      <button 
                        className="btn btn-sm btn-light rounded-circle"
                        style={{
                          width: '40px',
                          height: '40px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        onClick={(e) => handleAddToCart(book.book_id, e)}
                      >
                        <i className="bi bi-cart-plus"></i>
                      </button>
                    </div>
                  </div>
                  
                  <div className="card-body p-3 d-flex flex-column">
                    <h6 className="card-title fw-bold mb-2" style={{ 
                      fontSize: '1rem', 
                      lineHeight: '1.3',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      minHeight: '2.6rem'
                    }}>
                      {book.title}
                    </h6>
                    <p className="card-text text-muted small mb-2" style={{ fontSize: '0.85rem' }}>
                      {book.author}
                    </p>
                    
                    {/* Star Rating */}
                    <div className="mb-3">
                      <div className="d-flex align-items-center">
                        <div className="me-1">
                          {[...Array(5)].map((_, i) => (
                            <i 
                              key={i} 
                              className={`bi bi-star-fill ${
                                i < Math.floor(book.rating) ? 'text-warning' : 'text-muted'
                              }`}
                              style={{ fontSize: '12px' }}
                            ></i>
                          ))}
                        </div>
                        <span className="text-muted small" style={{ fontSize: '11px' }}>
                          ({book.rating})
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-auto">
                      <p className="card-text fw-bold text-primary mb-0" style={{ fontSize: '1.1rem' }}>
                        {book.price.toLocaleString('vi-VN')} VNĐ
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tác Giả Yêu Thích Section */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="row align-items-center mb-4">
            <div className="col">
                <h2 className="fw-bold text-dark">Tác Giả Yêu Thích</h2>
            </div>
            <div className="col-auto">
              <a href="#" className="btn btn-outline-primary">
                Xem Tất Cả <i className="bi bi-arrow-right ms-1"></i>
              </a>
            </div>
          </div>
          
          <div className="row g-4 justify-content-center">
            {[
              { name: "Fujiko Fujio", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face" },
              { name: "Delia Owens", image: "https://photo.znews.vn/w960/Uploaded/sgorvz/2025_05_23/tac_gia_70_tuoi.jpg" },
              { name: "Koyoharu Gotouge", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face" },
              { name: "Gosho Aoyama", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face" },
              { name: "Haruki Murakami", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face" },
              { name: "J.K. Rowling", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face" }
            ].map((author, index) => (
              <div key={index} className="col-lg-2 col-md-3 col-sm-4 col-6">
                <div className="text-center">
                  <img 
                    src={author.image} 
                    alt={author.name}
                    className="rounded-circle mx-auto mb-3"
                    style={{width: '80px', height: '80px', objectFit: 'cover'}}
                  />
                  <h6 className="text-dark mb-0">{author.name}</h6>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* From the Blog Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row align-items-center mb-4">
            <div className="col">
              <h2 className="fw-bold text-dark">Bài viết</h2>
            </div>
            <div className="col-auto">
              <button 
                className="btn btn-outline-primary"
                onClick={() => {
                  console.log('Blog button clicked');
                  onNavigateTo('blog')();
                }}
              >
                Xem Tất Cả <i className="bi bi-arrow-right ms-1"></i>
              </button>
            </div>
          </div>
          
          <div className="row g-4">
            {[
              { title: "Fujiko F. Fujio - The Creator of Doraemon", date: "24 Oct, 2019", image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=200&fit=crop" },
              { title: "The Art of Manga Storytelling", date: "15 Nov, 2019", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=200&fit=crop" },
              { title: "Top 10 Must-Read Manga Series", date: "01 Dec, 2019", image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=200&fit=crop" }
            ].map((post, index) => (
              <div key={index} className="col-lg-4 col-md-6">
                <div 
                  className="card h-100 shadow-sm"
                  style={{ cursor: 'pointer' }}
                  onClick={() => onNavigateTo('blog-detail')()}
                >
                  <img 
                    src={post.image} 
                    className="card-img-top" 
                    alt={post.title}
                    style={{height: '200px', objectFit: 'contain', backgroundColor: '#f8f9fa'}}
                  />
                  <div className="card-body">
                    <small className="text-muted">{post.date}</small>
                    <h5 className="card-title mt-2">{post.title}</h5>
                    <p className="card-text text-muted">
                      Discover the life and works of the legendary manga artist who created Doraemon.
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
