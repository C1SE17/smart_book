import React from 'react';

const FeaturedCategories = ({ onFilterByCategory, onViewAllCategories }) => {
  // Featured categories data
  const featuredCategories = [
    {
      id: 1,
      name: 'Fiction',
      title: 'Books and Stories',
      tag: 'Fiction',
      image: '/images/book1.jpg',
      description: 'Tiểu thuyết và truyện viễn tưởng',
      bookCount: 15
    },
    {
      id: 2,
      name: 'Literature',
      title: 'Foreign Literature',
      tag: 'Literature',
      image: '/images/book2.jpg',
      description: 'Văn học nước ngoài',
      bookCount: 22
    },
    {
      id: 3,
      name: 'Self-Help',
      title: 'Self Development',
      tag: 'Self-Help',
      image: '/images/book3.jpg',
      description: 'Sách tự phát triển bản thân',
      bookCount: 19
    },
    {
      id: 4,
      name: 'Biography',
      title: 'Biography & Memoirs',
      tag: 'Biography',
      image: '/images/book4.jpg',
      description: 'Tiểu sử và hồi ký',
      bookCount: 16
    }
  ];

  const handleCategoryClick = (category) => {
    if (onFilterByCategory) {
      onFilterByCategory(category.id);
    }
  };

  const handleViewAllClick = () => {
    if (onViewAllCategories) {
      onViewAllCategories();
    }
  };

  return (
    <section className="py-5" style={{ backgroundColor: '#f8f9fa' }}>
      <div className="container">
        {/* Section Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center">
              <h2 className="fw-bold mb-0">Featured Categories</h2>
              <button 
                className="btn btn-primary"
                onClick={handleViewAllClick}
              >
                View All
                <i className="bi bi-arrow-right ms-2"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="row g-4">
          {featuredCategories.map((category) => (
            <div key={category.id} className="col-lg-3 col-md-6 col-sm-6">
              <div 
                className="card h-100"
                style={{ 
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  border: '1px solid #e9ecef'
                }}
                onClick={() => handleCategoryClick(category)}
              >
                {/* Category Image */}
                <div 
                  className="card-img-top"
                  style={{
                    height: '200px',
                    backgroundImage: `url(${category.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                >
                  {/* Fallback if image not found */}
                  <div 
                    className="w-100 h-100 d-flex align-items-center justify-content-center"
                    style={{ backgroundColor: '#e9ecef' }}
                  >
                    <i className="bi bi-book display-1 text-muted"></i>
                  </div>
                </div>

                {/* Category Content */}
                <div className="card-body p-3">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h6 className="card-title fw-bold mb-0">{category.title}</h6>
                    <span className="badge bg-secondary small">{category.tag}</span>
                  </div>
                  <p className="card-text text-muted small mb-2">
                    {category.description}
                  </p>
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                      <i className="bi bi-book me-1"></i>
                      {category.bookCount} sách
                    </small>
                    <i className="bi bi-arrow-right text-primary"></i>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="row mt-4">
          <div className="col-12 text-center">
            <p className="text-muted mb-0">
              Khám phá hàng nghìn cuốn sách được phân loại theo chủ đề
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;
