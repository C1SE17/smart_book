import React, { useState } from 'react';

const BlogDetail = ({ onNavigateTo, blogId }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showShareDropdown, setShowShareDropdown] = useState(false);
  const [likeCount, setLikeCount] = useState(156);

  // Dữ liệu blog chi tiết
  const blogData = {
    1: {
      id: 1,
      title: "Fujiko F. Fujio - Người Tạo Ra Doraemon",
      content: `
        <p>Fujiko F. Fujio (1933-1996) là một trong những mangaka vĩ đại nhất của Nhật Bản. Ông với bộ truyện Doraemon, một tác phẩm đã trở thành biểu tượng văn hóa không chỉ ở còn trên toàn thế giới.</p>
        
        <h3>Những Ngày Đầu</h3>
        <p>Fujiko F. Fujio sinh ra tại Takaoka, tỉnh Toyama vào năm 1933. Tên thật của ông là Hiroshi Fujimoto. Từ nhỏ, ông đã có niềm đam mê với manga và anime. Năm 1951, ông gặp Motoo Abiko (sau này là Fujiko A. Fujio) và hai người bắt đầu hợp tác sáng tác manga dưới bút danh chung "Fujiko Fujio".</p>
        
        <h3>Sự Ra Đời Của Doraemon</h3>
        <p>Doraemon được tạo ra vào năm 1969, ban đầu là một nhân vật phụ trong bộ truyện "Doraemon" của Fujiko F. Fujio. Tuy nhiên, nhân vật này nhanh chóng trở thành nhân vật chính và được yêu thích trên toàn thế giới.</p>
        
        <h3>Tác Động Văn Hóa</h3>
        <p>Doraemon không chỉ là một bộ truyện tranh mà còn là một hiện tượng văn hóa. Bộ truyện đã được dịch sang nhiều ngôn ngữ và được chuyển thể thành anime, phim điện ảnh, và các sản phẩm thương mại khác.</p>
        
        <h3>Di Sản</h3>
        <p>Mặc dù Fujiko F. Fujio đã qua đời vào năm 1996, nhưng di sản của ông vẫn tiếp tục sống mãi thông qua Doraemon. Nhân vật này đã trở thành biểu tượng của tình bạn, sự sáng tạo và ước mơ của trẻ em trên toàn thế giới.</p>
      `,
      author: "Nguyễn Văn A",
      date: "24 Tháng 10, 2019",
      readTime: "5 phút đọc",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=400&fit=crop",
      tags: ["Doraemon", "Manga", "Fujiko F. Fujio", "Nhật Bản"]
    }
  };

  const currentBlog = blogData[blogId] || blogData[1];

  const handleLike = () => {
    if (isLiked) {
      setLikeCount(prev => prev - 1);
    } else {
      setLikeCount(prev => prev + 1);
    }
    setIsLiked(!isLiked);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = currentBlog.title;
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        alert('Đã sao chép liên kết!');
        break;
      default:
        break;
    }
    setShowShareDropdown(false);
  };

  return (
    <div className="min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
      <div className="container py-5">
        {/* Breadcrumb */}
        <div className="mb-4">
          <button
            className="btn btn-link text-dark p-0 no-hover"
            onClick={() => onNavigateTo('blog')()}
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
            Trang Chủ / Blog /
            <span className="fw-bold ms-1" style={{ fontSize: '16px' }}> {currentBlog.title}</span>
          </button>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-8 col-xl-7">
            {/* Main Content */}
            <div className="card border-0 shadow-lg">
              {/* Hero Image */}
              <img
                src={currentBlog.image}
                alt={currentBlog.title}
                className="card-img-top"
                style={{ height: '400px', objectFit: 'cover' }}
              />
              
              <div className="card-body p-5">
                {/* Tags */}
                <div className="mb-4">
                  {currentBlog.tags.map((tag, index) => (
                    <span key={index} className="badge bg-light text-dark me-2 mb-2" style={{ fontSize: '0.8rem' }}>
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Interaction Buttons */}
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <div className="d-flex align-items-center">
                    <button
                      className={`btn me-3 ${isLiked ? 'btn-danger' : 'btn-outline-danger'}`}
                      onClick={handleLike}
                      style={{ 
                        borderRadius: '20px',
                        backgroundColor: isLiked ? '#dc3545' : 'transparent',
                        borderColor: '#dc3545',
                        color: isLiked ? 'white' : '#dc3545',
                        fontWeight: '600',
                        boxShadow: isLiked ? '0 4px 8px rgba(220, 53, 69, 0.3)' : 'none',
                        transform: isLiked ? 'scale(1.05)' : 'scale(1)',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <i className={`fas fa-heart ${isLiked ? 'text-white' : 'text-danger'}`}></i>
                      <span className="ms-2">{likeCount} lượt thích</span>
                    </button>
                    
                    <button
                      className={`btn me-3 ${isSaved ? 'btn-warning' : 'btn-outline-warning'}`}
                      onClick={handleSave}
                      style={{ 
                        borderRadius: '20px',
                        backgroundColor: isSaved ? '#ffc107' : 'transparent',
                        borderColor: '#ffc107',
                        color: isSaved ? 'white' : '#ffc107',
                        fontWeight: '600',
                        boxShadow: isSaved ? '0 4px 8px rgba(255, 193, 7, 0.3)' : 'none',
                        transform: isSaved ? 'scale(1.05)' : 'scale(1)',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <i className={`fas fa-bookmark ${isSaved ? 'text-white' : 'text-warning'}`}></i>
                      <span className="ms-2">Lưu</span>
                    </button>
                  </div>

                  {/* Share Button */}
                  <div className="position-relative">
                    <button
                      className="btn btn-dark"
                      onClick={() => setShowShareDropdown(!showShareDropdown)}
                      style={{ borderRadius: '8px' }}
                    >
                      <i className="fas fa-share-alt me-2"></i>
                      Chia sẻ
                      <i className="fas fa-chevron-down ms-2"></i>
                    </button>
                    
                    {showShareDropdown && (
                      <div className="dropdown-menu show position-absolute" style={{ top: '100%', right: '0', zIndex: 1000 }}>
                        <button
                          className="dropdown-item"
                          onClick={() => handleShare('facebook')}
                        >
                          <i className="fab fa-facebook text-primary me-2"></i>
                          Facebook
                        </button>
                        <button
                          className="dropdown-item"
                          onClick={() => handleShare('twitter')}
                        >
                          <i className="fab fa-twitter text-info me-2"></i>
                          Twitter
                        </button>
                        <button
                          className="dropdown-item"
                          onClick={() => handleShare('linkedin')}
                        >
                          <i className="fab fa-linkedin text-primary me-2"></i>
                          LinkedIn
                        </button>
                        <hr className="dropdown-divider" />
                        <button
                          className="dropdown-item"
                          onClick={() => handleShare('copy')}
                        >
                          <i className="fas fa-copy text-muted me-2"></i>
                          Sao chép liên kết
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Title */}
                <h1 className="display-5 fw-bold text-dark mb-4">{currentBlog.title}</h1>

                {/* Author and Date */}
                <div className="d-flex align-items-center mb-4">
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face"
                    alt={currentBlog.author}
                    className="rounded-circle me-3"
                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                  />
                  <div className="me-auto">
                    <div className="fw-bold text-dark">{currentBlog.author}</div>
                    <div className="text-muted small">{currentBlog.date}</div>
                  </div>
                  <div className="text-muted">
                    <i className="fas fa-clock me-1"></i>
                    {currentBlog.readTime}
                  </div>
                </div>

                {/* Content */}
                <div 
                  className="blog-content"
                  dangerouslySetInnerHTML={{ __html: currentBlog.content }}
                  style={{ fontSize: '1.1rem', lineHeight: '1.8' }}
                />

                {/* Back to Blog Button */}
                <div className="text-center mt-5">
                  <button
                    className="btn btn-primary"
                    onClick={() => onNavigateTo('blog')()}
                    style={{ borderRadius: '25px', padding: '10px 30px' }}
                  >
                    <i className="fas fa-arrow-left me-2"></i>
                    Quay Lại Blog
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;