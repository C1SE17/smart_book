import React, { useState } from 'react';

const ProductGrid = ({ onNavigateTo }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('default');

  // Sample product data based on the image
  const products = [
    {
      id: 1,
      title: "Thanh Gươm Diệt Quỷ - Tập 1",
      author: "Koyoharu Gotouge",
      price: 815000,
      image: "/images/book1.jpg",
      rating: 4.0,
      reviewCount: 1
    },
    {
      id: 2,
      title: "Doraemon: Nobita và Cuộc Chiến Vũ Trụ",
      author: "Fujiko F. Fujio",
      price: 248000,
      image: "/images/book2.jpg",
      rating: 5.0,
      reviewCount: 1
    },
    {
      id: 3,
      title: "Harry Potter và Hòn Đá Phù Thủy",
      author: "J.K. Rowling",
      price: 200000,
      image: "/images/book3.jpg",
      rating: 4.8,
      reviewCount: 1
    },
    {
      id: 4,
      title: "Conan - Vụ Án Nữ Hoàng 450",
      author: "Gosho Aoyama",
      price: 863000,
      image: "/images/book4.jpg",
      rating: 5.0,
      reviewCount: 1
    },
    {
      id: 5,
      title: "WHERE THE CRAWDADS SING",
      author: "Delia Owens",
      price: 350000,
      image: "/images/book1.jpg",
      rating: 4.5,
      reviewCount: 1
    },
    {
      id: 6,
      title: "Doraemon: Nobita's Little Star Wars",
      author: "Fujiko F. Fujio",
      price: 280000,
      image: "/images/book2.jpg",
      rating: 4.9,
      reviewCount: 1
    },
    {
      id: 7,
      title: "Demon Slayer - Kimetsu No Yaiba",
      author: "Koyoharu Gotouge",
      price: 150000,
      image: "/images/book3.jpg",
      rating: 4.7,
      reviewCount: 1
    },
    {
      id: 8,
      title: "Detective Conan - Fu Jin Nobunaga 690",
      author: "Gosho Aoyama",
      price: 180000,
      image: "/images/book4.jpg",
      rating: 4.6,
      reviewCount: 1
    },
    {
      id: 9,
      title: "One Piece - Tập 100",
      author: "Eiichiro Oda",
      price: 220000,
      image: "/images/book1.jpg",
      rating: 4.8,
      reviewCount: 1
    },
    {
      id: 10,
      title: "Attack on Titan - Tập 30",
      author: "Hajime Isayama",
      price: 195000,
      image: "/images/book2.jpg",
      rating: 4.9,
      reviewCount: 1
    },
    {
      id: 11,
      title: "Naruto - Tập 72",
      author: "Masashi Kishimoto",
      price: 175000,
      image: "/images/book3.jpg",
      rating: 4.5,
      reviewCount: 1
    },
    {
      id: 12,
      title: "Dragon Ball Super - Tập 15",
      author: "Akira Toriyama",
      price: 165000,
      image: "/images/book4.jpg",
      rating: 4.4,
      reviewCount: 1
    },
    {
      id: 13,
      title: "Tokyo Ghoul - Tập 14",
      author: "Sui Ishida",
      price: 185000,
      image: "/images/book1.jpg",
      rating: 4.3,
      reviewCount: 1
    },
    {
      id: 14,
      title: "My Hero Academia - Tập 25",
      author: "Kohei Horikoshi",
      price: 195000,
      image: "/images/book2.jpg",
      rating: 4.7,
      reviewCount: 1
    },
    {
      id: 15,
      title: "Jujutsu Kaisen - Tập 10",
      author: "Gege Akutami",
      price: 180000,
      image: "/images/book3.jpg",
      rating: 4.6,
      reviewCount: 1
    },
    {
      id: 16,
      title: "Chainsaw Man - Tập 8",
      author: "Tatsuki Fujimoto",
      price: 170000,
      image: "/images/book4.jpg",
      rating: 4.8,
      reviewCount: 1
    }
  ];

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    return Array.from({ length: 5 }, (_, index) => {
      if (index < fullStars) {
        return <i key={index} className="bi bi-star-fill text-warning" style={{ fontSize: '12px' }}></i>;
      } else if (index === fullStars && hasHalfStar) {
        return <i key={index} className="bi bi-star-half text-warning" style={{ fontSize: '12px' }}></i>;
      } else {
        return <i key={index} className="bi bi-star text-warning" style={{ fontSize: '12px' }}></i>;
      }
    });
  };

  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN') + ' VNĐ';
  };

  const handleProductClick = (productId) => {
    onNavigateTo('product')();
    // Pass productId to the product detail page via URL
    window.history.pushState({}, '', `/product?id=${productId}`);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <div className="col-lg-9 col-md-8">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <p className="mb-0 text-muted">Showing 1-16 of 20 results</p>
        <div className="dropdown">
          <button 
            className="btn btn-outline-secondary dropdown-toggle" 
            type="button" 
            data-bs-toggle="dropdown"
          >
            Default sorting <i className="bi bi-chevron-down ms-1"></i>
          </button>
          <ul className="dropdown-menu">
            <li><button className="dropdown-item" onClick={() => setSortBy('default')}>Default sorting</button></li>
            <li><button className="dropdown-item" onClick={() => setSortBy('price-low')}>Sort by price: low to high</button></li>
            <li><button className="dropdown-item" onClick={() => setSortBy('price-high')}>Sort by price: high to low</button></li>
            <li><button className="dropdown-item" onClick={() => setSortBy('name')}>Sort by name</button></li>
          </ul>
        </div>
      </div>

      {/* Product Grid */}
      <div className="row g-4 mb-4">
        {products.map((product) => (
          <div key={product.id} className="col-lg-3 col-md-4 col-sm-6">
            <div 
              className="card h-100 border-0 shadow-sm"
              style={{ cursor: 'pointer' }}
              onClick={() => handleProductClick(product.id)}
            >
              <div className="position-relative">
                <img 
                  src={product.image} 
                  className="card-img-top" 
                  alt={product.title}
                  style={{ height: '300px', objectFit: 'contain', backgroundColor: '#f8f9fa' }}
                />
                <div className="position-absolute top-0 end-0 m-2">
                  <span className="badge bg-danger">Sale</span>
                </div>
              </div>
              <div className="card-body d-flex flex-column">
                <h6 className="card-title text-dark mb-2" style={{ fontSize: '14px', lineHeight: '1.3' }}>
                  {product.title}
                </h6>
                <p className="text-muted small mb-2">{product.author}</p>
                <div className="d-flex align-items-center mb-2">
                  {renderStars(product.rating)}
                  <span className="text-muted small ms-1">({product.reviewCount})</span>
                </div>
                <div className="mt-auto">
                  <span className="fw-bold text-primary">{formatPrice(product.price)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="d-flex justify-content-center">
        <nav aria-label="Page navigation">
          <ul className="pagination">
            <li className="page-item">
              <button className="page-link" disabled>
                <i className="bi bi-chevron-left"></i>
              </button>
            </li>
            <li className="page-item active">
              <button className="page-link bg-dark text-white border-dark">1</button>
            </li>
            <li className="page-item">
              <button className="page-link">2</button>
            </li>
            <li className="page-item">
              <button className="page-link">
                <i className="bi bi-chevron-right"></i>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default ProductGrid;
