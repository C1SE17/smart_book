import React from 'react';

const AboutUs = ({ onBackToHome, onNavigateTo }) => {
  const authors = [
    { name: "Fujiko Fujio", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face" },
    { name: "Delia Owens", image: "https://photo.znews.vn/w960/Uploaded/sgorvz/2025_05_23/tac_gia_70_tuoi.jpg" },
    { name: "Koyoharu Gotouge", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face" },
    { name: "Gosho Aoyama", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face" },
    { name: "Haruki Murakami", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face" },
    { name: "J.K. Rowling", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face" }
  ];

  return (
    <div className="min-vh-100" style={{ backgroundColor: '#ffffff' }}>
      <div className="container py-5">
        {/* Breadcrumb */}
        <div className="mb-4">
          <button
            className="btn btn-link text-dark p-0 no-hover"
            onClick={onBackToHome}
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
            Trang Chủ/
            <span className="fw-bold ms-1" style={{ fontSize: '16px' }}> Giới Thiệu</span>
          </button>
        </div>

        <h1 className="text-center mb-4" style={{ fontSize: '2.8rem', fontWeight: '700', color: '#343a40' }}>
          Về Chúng Tôi
        </h1>
        <p className="text-center text-muted mb-5" style={{ fontSize: '1.1rem' }}>
          Khám phá thế giới sách và tri thức cùng SmartBook
        </p>

        {/* Who We Are Section */}
        <div className="row mb-5">
          <div className="col-lg-6">
            <h2 className="display-6 fw-bold text-dark mb-4">Chúng Tôi Là Ai</h2>
            <p className="text-muted mb-4" style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
              SmartBook là nền tảng mua sách trực tuyến hàng đầu Việt Nam, được thành lập với sứ mệnh 
              lan tỏa tri thức và văn hóa đọc đến mọi người dân. Chúng tôi cam kết mang đến những cuốn sách 
              chất lượng cao với giá cả hợp lý và dịch vụ khách hàng xuất sắc.
            </p>
            <p className="text-muted mb-4" style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
              Với hơn 50,000 đầu sách từ các nhà xuất bản uy tín trong và ngoài nước, SmartBook tự hào 
              là điểm đến tin cậy cho những người yêu thích đọc sách và muốn khám phá tri thức mới.
            </p>
            <p className="text-muted fw-bold">Nguyễn Văn A, Người sáng lập & Giám đốc điều hành.</p>
          </div>
          <div className="col-lg-6">
            <div className="text-center">
              <img
                src="/images/about-us.jpg"
                alt="SmartBook - Nền tảng sách trực tuyến"
                className="img-fluid rounded-3 shadow-lg"
                style={{ 
                  height: '400px', 
                  width: '100%', 
                  objectFit: 'cover',
                  borderRadius: '15px'
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div 
                className="bg-gradient rounded-3 d-flex align-items-center justify-content-center shadow-lg"
                style={{ 
                  height: '400px', 
                  minHeight: '400px',
                  display: 'none',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }}
              >
                <div className="text-center text-white">
                  <i className="fas fa-book-open fa-4x mb-3"></i>
                  <h4 className="fw-bold">SmartBook</h4>
                  <p className="mb-0">Nền tảng sách trực tuyến</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Our Mission Section */}
        <div className="row mb-5">
          <div className="col-12 text-center">
            <h2 className="display-6 fw-bold text-dark mb-4">Sứ Mệnh Của Chúng Tôi</h2>
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <p className="text-muted mb-4" style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
                  Chúng tôi tin rằng sách là cánh cửa mở ra thế giới tri thức vô tận. Mỗi cuốn sách đều chứa đựng 
                  những bài học quý giá, những câu chuyện ý nghĩa và những kiến thức bổ ích có thể thay đổi cuộc đời bạn.
                </p>
                <p className="text-muted mb-5" style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
                  SmartBook cam kết mang đến trải nghiệm mua sách tuyệt vời nhất với hệ thống tìm kiếm thông minh, 
                  giao hàng nhanh chóng và dịch vụ khách hàng chuyên nghiệp. Hãy để chúng tôi đồng hành cùng bạn 
                  trên hành trình khám phá tri thức.
                </p>
              </div>
            </div>
            
            {/* Stats */}
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <div className="row text-center">
                  <div className="col-4">
                    <div className="display-4 fw-bold text-primary mb-2">50K+</div>
                    <div className="text-muted">ĐẦU SÁCH</div>
                  </div>
                  <div className="col-4">
                    <div className="display-4 fw-bold text-success mb-2">10K+</div>
                    <div className="text-muted">KHÁCH HÀNG</div>
                  </div>
                  <div className="col-4">
                    <div className="display-4 fw-bold text-warning mb-2">5+</div>
                    <div className="text-muted">NĂM KINH NGHIỆM</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Testimonial */}
        <div className="row mb-5">
          <div className="col-12">
            <div className="text-center">
              <div className="bg-light rounded-3 p-5 position-relative" style={{ maxWidth: '800px', margin: '0 auto' }}>
                {/* Background Image */}
                <div 
                  className="position-absolute top-0 start-0 w-100 h-100 rounded-3"
                  style={{
                    backgroundImage: 'url(/images/testimonial-bg.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    opacity: '0.1',
                    zIndex: '1'
                  }}
                ></div>
                
                {/* Content */}
                <div className="position-relative" style={{ zIndex: '2' }}>
                  <i className="fas fa-quote-left fa-3x text-primary mb-4"></i>
                  <div className="mb-3">
                    <i className="fas fa-star text-warning"></i>
                    <i className="fas fa-star text-warning"></i>
                    <i className="fas fa-star text-warning"></i>
                    <i className="fas fa-star text-warning"></i>
                    <i className="fas fa-star text-warning"></i>
                  </div>
                  <h3 className="fw-bold text-dark mb-3">SmartBook Tuyệt Vời</h3>
                  <p className="text-muted mb-4" style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
                    "SmartBook đã thay đổi hoàn toàn cách tôi mua sách. Giao diện thân thiện, tìm kiếm dễ dàng, 
                    và giao hàng nhanh chóng. Tôi đã tìm thấy rất nhiều cuốn sách hay mà trước đây khó tìm mua."
                  </p>
                  <div className="d-flex align-items-center justify-content-center">
                    <img
                      src="/images/customer-avatar.jpg"
                      alt="Nguyễn Thị B"
                      className="rounded-circle me-3"
                      style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div 
                      className="rounded-circle bg-primary d-flex align-items-center justify-content-center me-3"
                      style={{ width: '50px', height: '50px', display: 'none' }}
                    >
                      <i className="fas fa-user text-white"></i>
                    </div>
                    <div className="text-start">
                      <div className="fw-bold text-dark">Nguyễn Thị B</div>
                      <div className="text-muted small">Khách hàng thân thiết</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Authors Section */}
        <div className="row">
          <div className="col-12">
            <div className="row align-items-center mb-4">
              <div className="col">
                <h2 className="fw-bold text-dark">Tác Giả Yêu Thích</h2>
              </div>
              <div className="col-auto">
                <a href="#" className="text-decoration-none" style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#333',
                  transition: 'all 0.3s ease'
                }}
                  onMouseEnter={(e) => {
                    e.target.style.color = '#007bff';
                    e.target.style.transform = 'translateX(5px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = '#333';
                    e.target.style.transform = 'translateX(0)';
                  }}>
                  Xem Tất Cả <i className="bi bi-arrow-right ms-1"></i>
                </a>
              </div>
            </div>

            <div className="row g-4 justify-content-center">
              {authors.map((author, index) => (
                <div key={index} className="col-lg-2 col-md-3 col-sm-4 col-6">
                  <div className="text-center">
                    <img
                      src={author.image}
                      alt={author.name}
                      className="rounded-circle mx-auto mb-3"
                      style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                    />
                    <h6 className="text-dark mb-0">{author.name}</h6>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
