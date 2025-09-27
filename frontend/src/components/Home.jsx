import React from 'react';

const Home = ({ onViewProduct }) => {
  return (
    <main className="flex-grow-1">
      {/* Featured Categories Section */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="row align-items-center mb-4">
            <div className="col">
              <h2 className="fw-bold text-dark">Featured Categories</h2>
            </div>
            <div className="col-auto">
              <a href="#" className="btn btn-outline-primary">
                View All <i className="bi bi-arrow-right ms-1"></i>
              </a>
            </div>
          </div>
          
          <div className="row g-4">
            {[
              { title: "Books and Stories", category: "Fiction", image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop" },
              { title: "Foreign Literature", category: "Literature", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop" },
              { title: "Sala Thanks by Theme", category: "Self-Help", image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=200&fit=crop" },
              { title: "Burley by Author", category: "Biography", image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=200&fit=crop" }
            ].map((book, index) => (
              <div key={index} className="col-lg-3 col-md-6">
                <div className="card h-100 shadow-sm" style={{
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onClick={() => onViewProduct(book.book_id)}
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
                    style={{height: '200px', objectFit: 'contain', backgroundColor: '#f8f9fa'}}
                  />
                  <div className="card-body text-center">
                    <h6 className="card-title fw-bold">{book.title}</h6>
                    <span className="badge bg-light text-dark">{book.category}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* People's Choice Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row align-items-center mb-4">
            <div className="col">
              <h2 className="fw-bold text-dark">People's Choice</h2>
            </div>
            <div className="col-auto">
              <a href="#" className="btn btn-outline-primary">
                View All <i className="bi bi-arrow-right ms-1"></i>
              </a>
            </div>
          </div>
          
          <div className="row g-4">
            {[
              { book_id: 1, title: "WHERE THE CRAWDADS SING", author: "Delia Owens", price: "$20 - $30", category: "Fiction", image: "./public/images/book1.jpg" },
              { book_id: 2, title: "Doraemon: Nobita's Little Star Wars", author: "Fujiko F. Fujio", price: "$15 - $25", category: "Manga", image: "./public/images/book2.jpg" },
              { book_id: 3, title: "Demon Slayer - Vô hạn thành", author: "Koyoharu Gotouge", price: "$18 - $28", category: "Manga", image: "./public/images/book3.jpg" },
              { book_id: 4, title: "Conan - Vụ Án Nữ Hoàng 450", author: "Gosho Aoyama", price: "$16 - $26", category: "Manga", image: "./public/images/book4.jpg" }
            ].map((book, index) => (
              <div key={index} className="col-lg-3 col-md-6">
                <div className="card h-100 shadow-sm" style={{
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onClick={() => onViewProduct(book.book_id)}
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
                    style={{height: '200px', objectFit: 'contain', backgroundColor: '#f8f9fa'}}
                  />
                  <div className="card-body d-flex flex-column">
                    <h6 className="card-title fw-bold">{book.title}</h6>
                    <p className="card-text text-muted small">{book.author}</p>
                    
                    {/* Star Rating */}
                    <div className="mb-2">
                      {[...Array(5)].map((_, i) => (
                        <i key={i} className="bi bi-star-fill text-warning"></i>
                      ))}
                    </div>
                    
                    <p className="card-text fw-bold text-primary">{book.price}</p>
                    <span className="badge bg-light text-dark">{book.category}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Additions Section */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="row align-items-center mb-4">
            <div className="col">
              <h2 className="fw-bold text-dark">New Additions</h2>
            </div>
            <div className="col-auto">
              <a href="#" className="btn btn-outline-primary">
                View All <i className="bi bi-arrow-right ms-1"></i>
              </a>
            </div>
          </div>
          
          <div className="row g-4">
            {[
              { book_id: 1, title: "WHERE THE CRAWDADS SING", author: "Delia Owens", price: "$20 - $30", category: "Fiction", image: "./public/images/book1.jpg" },
              { book_id: 2, title: "Doraemon: Nobita's Little Star Wars", author: "Fujiko F. Fujio", price: "$15 - $25", category: "Manga", image: "./public/images/book2.jpg" },
              { book_id: 3, title: "Demon Slayer - Vô hạn thành", author: "Koyoharu Gotouge", price: "$18 - $28", category: "Manga", image: "./public/images/book3.jpg" },
              { book_id: 4, title: "Conan - Vụ Án Nữ Hoàng 450", author: "Gosho Aoyama", price: "$16 - $26", category: "Manga", image: "./public/images/book4.jpg" }
            ].map((book, index) => (
              <div key={index} className="col-lg-3 col-md-6">
                <div className="card h-100 shadow-sm" style={{
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onClick={() => onViewProduct(book.book_id)}
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
                    style={{height: '200px', objectFit: 'contain', backgroundColor: '#f8f9fa'}}
                  />
                  <div className="card-body d-flex flex-column">
                    <h6 className="card-title fw-bold">{book.title}</h6>
                    <p className="card-text text-muted small">{book.author}</p>
                    
                    {/* Star Rating */}
                    <div className="mb-2">
                      {[...Array(5)].map((_, i) => (
                        <i key={i} className="bi bi-star-fill text-warning"></i>
                      ))}
                    </div>
                    
                    <p className="card-text fw-bold text-primary">{book.price}</p>
                    <span className="badge bg-light text-dark">{book.category}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Books Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row align-items-center mb-4">
            <div className="col">
              <h2 className="fw-bold text-dark">Popular Books</h2>
            </div>
            <div className="col-auto">
              <a href="#" className="btn btn-outline-primary">
                View All <i className="bi bi-arrow-right ms-1"></i>
              </a>
            </div>
          </div>
          
          <div className="row g-4">
            {[
              { book_id: 1, title: "WHERE THE CRAWDADS SING", author: "Delia Owens", price: "$20 - $30", category: "Fiction", image: "./public/images/book1.jpg" },
              { book_id: 2, title: "Doraemon: Nobita's Little Star Wars", author: "Fujiko F. Fujio", price: "$15 - $25", category: "Manga", image: "./public/images/book2.jpg" },
              { book_id: 3, title: "Demon Slayer - Vô hạn thành", author: "Koyoharu Gotouge", price: "$18 - $28", category: "Manga", image: "./public/images/book3.jpg" },
              { book_id: 4, title: "Conan - Vụ Án Nữ Hoàng 450", author: "Gosho Aoyama", price: "$16 - $26", category: "Manga", image: "./public/images/book4.jpg" }
            ].map((book, index) => (
              <div key={index} className="col-lg-3 col-md-6">
                <div className="card h-100 shadow-sm" style={{
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onClick={() => onViewProduct(book.book_id)}
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
                    style={{height: '200px', objectFit: 'contain', backgroundColor: '#f8f9fa'}}
                  />
                  <div className="card-body d-flex flex-column">
                    <h6 className="card-title fw-bold">{book.title}</h6>
                    <p className="card-text text-muted small">{book.author}</p>
                    
                    {/* Star Rating */}
                    <div className="mb-2">
                      {[...Array(5)].map((_, i) => (
                        <i key={i} className="bi bi-star-fill text-warning"></i>
                      ))}
                    </div>
                    
                    <p className="card-text fw-bold text-primary">{book.price}</p>
                    <span className="badge bg-light text-dark">{book.category}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Favorite Authors Section */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="row align-items-center mb-4">
            <div className="col">
              <h2 className="fw-bold text-dark">Favorite Authors</h2>
            </div>
            <div className="col-auto">
              <a href="#" className="btn btn-outline-primary">
                View All <i className="bi bi-arrow-right ms-1"></i>
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
              <h2 className="fw-bold text-dark">From the Blog</h2>
            </div>
            <div className="col-auto">
              <a href="#" className="btn btn-outline-primary">
                View All <i className="bi bi-arrow-right ms-1"></i>
              </a>
            </div>
          </div>
          
          <div className="row g-4">
            {[
              { title: "Fujiko F. Fujio - The Creator of Doraemon", date: "24 Oct, 2019", image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=200&fit=crop" },
              { title: "The Art of Manga Storytelling", date: "15 Nov, 2019", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=200&fit=crop" },
              { title: "Top 10 Must-Read Manga Series", date: "01 Dec, 2019", image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=200&fit=crop" }
            ].map((post, index) => (
              <div key={index} className="col-lg-4 col-md-6">
                <div className="card h-100 shadow-sm">
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
