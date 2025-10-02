import React, { useState } from 'react';

const BlogPage = ({ onNavigateTo }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả danh mục');
  const [selectedAuthor, setSelectedAuthor] = useState('Tất cả tác giả');
  const [sortBy, setSortBy] = useState('Mới nhất');

  // Dữ liệu blog mẫu về sách
  const blogPosts = [
    {
      id: 1,
      title: "Fujiko F. Fujio - Người Tạo Ra Doraemon",
      excerpt: "Khám phá cuộc đời và sự nghiệp của tác giả manga nổi tiếng Fujiko F. Fujio, người đã tạo ra nhân vật Doraemon được yêu thích trên toàn thế giới.",
      content: "Fujiko F. Fujio (1933-1996) là một trong những mangaka vĩ đại nhất của Nhật Bản. Ông nổi tiếng với bộ truyện Doraemon, một tác phẩm đã trở thành biểu tượng văn hóa không chỉ ở Nhật mà còn trên toàn thế giới. Với hơn 100 triệu bản in được bán ra, Doraemon đã chạm đến trái tim của hàng triệu độc giả ở mọi lứa tuổi...",
      author: "Nguyễn Văn A",
      date: "24 Tháng 10, 2023",
      readTime: "7 phút đọc",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=300&fit=crop",
      category: "Nổi bật",
      tags: ["Doraemon", "Manga", "Fujiko F. Fujio"]
    },
    {
      id: 2,
      title: "Nghệ Thuật Kể Chuyện Manga",
      excerpt: "Tìm hiểu về những kỹ thuật kể chuyện độc đáo trong manga và cách các mangaka tạo ra những câu chuyện hấp dẫn.",
      content: "Manga không chỉ là những hình ảnh đơn thuần mà là một hình thức nghệ thuật kể chuyện phức tạp. Từ cách sắp xếp khung hình đến việc sử dụng âm thanh và chuyển động, mỗi yếu tố đều góp phần tạo nên trải nghiệm đọc độc đáo...",
      author: "Trần Thị B",
      date: "17 Tháng 10, 2023",
      readTime: "5 phút đọc",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=300&fit=crop",
      category: "Nghệ thuật",
      tags: ["Manga", "Kể chuyện", "Nghệ thuật"]
    },
    {
      id: 3,
      title: "Top 10 Bộ Manga Phải Đọc",
      excerpt: "Danh sách những bộ manga kinh điển và đáng đọc nhất mọi thời đại, từ những tác phẩm cổ điển đến những bộ truyện hiện đại.",
      content: "Trong thế giới manga rộng lớn, có những bộ truyện đã vượt qua ranh giới của thời gian và không gian để trở thành những tác phẩm kinh điển. Từ One Piece với cuộc phiêu lưu vĩ đại của Luffy đến Attack on Titan với câu chuyện đầy kịch tính...",
      author: "Lê Văn C",
      date: "07 Tháng 10, 2023",
      readTime: "8 phút đọc",
      image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=300&fit=crop",
      category: "Đánh giá",
      tags: ["Top 10 Manga", "Đánh giá"]
    },
    {
      id: 4,
      title: "Lịch Sử Phát Triển Của Manga",
      excerpt: "Tìm hiểu về quá trình phát triển của manga từ những bản vẽ đầu tiên đến ngành công nghiệp tỷ đô ngày nay.",
      content: "Manga có lịch sử phát triển lâu dài và phong phú, bắt đầu từ những bản vẽ đơn giản trong thời kỳ Edo đến ngành công nghiệp manga hiện đại với doanh thu hàng tỷ đô. Quá trình này phản ánh sự thay đổi của xã hội Nhật Bản và sự phát triển của công nghệ...",
      author: "Phạm Thị D",
      date: "01 Tháng 10, 2023",
      readTime: "6 phút đọc",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=300&fit=crop",
      category: "Lịch sử",
      tags: ["Lịch sử Manga", "Manga"]
    },
    {
      id: 5,
      title: "Tác Động Của Manga Đến Văn Hóa Thế Giới",
      excerpt: "Khám phá cách manga đã ảnh hưởng đến văn hóa toàn cầu và tạo ra những xu hướng mới trong nghệ thuật và giải trí.",
      content: "Manga không chỉ là một hình thức giải trí mà còn là một sức mạnh văn hóa mạnh mẽ. Từ việc lan tỏa văn hóa Nhật Bản ra thế giới đến việc tạo ra những xu hướng mới trong nghệ thuật, thời trang và lối sống...",
      author: "Hoàng Văn E",
      date: "25 Tháng 9, 2023",
      readTime: "7 phút đọc",
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=300&fit=crop",
      category: "Văn hóa",
      tags: ["Văn hóa", "Manga", "Ảnh hưởng"]
    },
    {
      id: 6,
      title: "Cách Đọc Manga Hiệu Quả",
      excerpt: "Hướng dẫn chi tiết về cách đọc manga để có trải nghiệm tốt nhất, từ cách chọn tác phẩm đến kỹ thuật đọc.",
      content: "Đọc manga là một nghệ thuật. Không chỉ đơn giản là lật trang và xem hình ảnh, việc đọc manga đúng cách sẽ mang lại trải nghiệm sâu sắc và thú vị hơn nhiều. Từ việc hiểu cách đọc từ phải sang trái đến việc cảm nhận nhịp điệu của câu chuyện...",
      author: "Trần Thị F",
      date: "18 Tháng 9, 2023",
      readTime: "4 phút đọc",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=300&fit=crop",
      category: "Kỹ thuật",
      tags: ["Manga", "Kỹ thuật đọc"]
    }
  ];

  const handleBackToHome = () => {
    onNavigateTo('home')();
  };

  const handleBlogClick = (blogId) => {
    // Tạo một handler mới để navigate đến blog detail
    const navigateToBlogDetail = (id) => {
      onNavigateTo('blog-detail')(id);
    };
    navigateToBlogDetail(blogId);
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Nổi bật': '#dc3545',
      'Nghệ thuật': '#28a745',
      'Đánh giá': '#fd7e14',
      'Lịch sử': '#6f42c1',
      'Văn hóa': '#20c997',
      'Kỹ thuật': '#0d6efd'
    };
    return colors[category] || '#6c757d';
  };

  return (
    <div className="min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
      <div className="container py-5">
        {/* Breadcrumb */}
        <div className="mb-4">
          <button
            className="btn btn-link text-dark p-0 no-hover"
            onClick={handleBackToHome}
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
            <span className="fw-bold ms-1" style={{ fontSize: '16px' }}> Blog</span>
          </button>
        </div>

        <h1 className="text-center mb-4" style={{ fontSize: '2.8rem', fontWeight: '700', color: '#343a40' }}>
          Blog
        </h1>
        <p className="text-center text-muted mb-5" style={{ fontSize: '1.1rem' }}>
          Khám phá những bài viết thú vị về thế giới sách và manga
        </p>

        {/* Search and Filter Bar */}
        <div className="row mb-5">
          <div className="col-12">
            <div className="bg-white rounded-3 p-4 shadow-sm border">
              <div className="row align-items-center">
                <div className="col-md-6 mb-3 mb-md-0">
                  <div className="position-relative">
                    <i className="fas fa-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                    <input
                      type="text"
                      className="form-control ps-5"
                      placeholder="Tìm kiếm bài viết, tác giả hoặc thể loại..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{ border: '1px solid #e9ecef', borderRadius: '8px' }}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="row g-2">
                    <div className="col-4">
                      <select 
                        className="form-select" 
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        style={{ border: '1px solid #e9ecef', borderRadius: '8px' }}
                      >
                        <option>Tất cả danh mục</option>
                        <option>Nổi bật</option>
                        <option>Nghệ thuật</option>
                        <option>Đánh giá</option>
                        <option>Lịch sử</option>
                        <option>Văn hóa</option>
                        <option>Kỹ thuật</option>
                      </select>
                    </div>
                    <div className="col-4">
                      <select 
                        className="form-select" 
                        value={selectedAuthor}
                        onChange={(e) => setSelectedAuthor(e.target.value)}
                        style={{ border: '1px solid #e9ecef', borderRadius: '8px' }}
                      >
                        <option>Tất cả tác giả</option>
                        <option>Nguyễn Văn A</option>
                        <option>Trần Thị B</option>
                        <option>Lê Văn C</option>
                        <option>Phạm Thị D</option>
                        <option>Hoàng Văn E</option>
                        <option>Trần Thị F</option>
                      </select>
                    </div>
                    <div className="col-4">
                      <select 
                        className="form-select" 
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        style={{ border: '1px solid #e9ecef', borderRadius: '8px' }}
                      >
                        <option>Mới nhất</option>
                        <option>Cũ nhất</option>
                        <option>Phổ biến</option>
                        <option>Đọc nhiều</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Blog Post */}
        <div className="row mb-5">
          <div className="col-12">
            <div className="card border-0 shadow-lg">
              <div className="row g-0">
                <div className="col-md-6">
                  <img
                    src={blogPosts[0].image}
                    alt={blogPosts[0].title}
                    className="img-fluid h-100"
                    style={{ objectFit: 'cover', minHeight: '300px' }}
                  />
                </div>
                <div className="col-md-6">
                  <div className="card-body p-5">
                    <span 
                      className="badge mb-3"
                      style={{ 
                        backgroundColor: getCategoryColor(blogPosts[0].category),
                        color: 'white',
                        fontSize: '0.8rem',
                        padding: '6px 12px'
                      }}
                    >
                      {blogPosts[0].category}
                    </span>
                    <h3 className="card-title fw-bold mb-3" style={{ fontSize: '1.5rem' }}>
                      {blogPosts[0].title}
                    </h3>
                    <p className="card-text text-muted mb-4" style={{ fontSize: '1rem', lineHeight: '1.6' }}>
                      {blogPosts[0].excerpt}
                    </p>
                    <div className="mb-3">
                      {blogPosts[0].tags.map((tag, index) => (
                        <span key={index} className="badge bg-light text-dark me-2 mb-2" style={{ fontSize: '0.75rem' }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="d-flex align-items-center">
                      <div className="me-3">
                        <div className="fw-bold text-dark">{blogPosts[0].author}</div>
                        <div className="text-muted small">{blogPosts[0].date}</div>
                      </div>
                      <div className="ms-auto">
                        <i className="fas fa-clock me-1 text-muted"></i>
                        <span className="text-muted small">{blogPosts[0].readTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Other Blog Posts */}
        <div className="row mb-5">
          <div className="col-12">
            <h4 className="fw-bold text-dark mb-4">
              <i className="fas fa-square text-primary me-2" style={{ fontSize: '0.8rem' }}></i>
              Các Bài Viết Khác
            </h4>
            <div className="row g-4">
              {blogPosts.slice(1).map((post) => (
                <div key={post.id} className="col-lg-4 col-md-6">
                  <div className="card border-0 shadow-sm h-100" style={{ cursor: 'pointer' }} onClick={() => handleBlogClick(post.id)}>
                    <img
                      src={post.image}
                      alt={post.title}
                      className="card-img-top"
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                    <div className="card-body p-4">
                      <span 
                        className="badge mb-3"
                        style={{ 
                          backgroundColor: getCategoryColor(post.category),
                          color: 'white',
                          fontSize: '0.7rem',
                          padding: '4px 8px'
                        }}
                      >
                        {post.category}
                      </span>
                      <h5 className="card-title fw-bold mb-3" style={{ fontSize: '1.1rem' }}>
                        {post.title}
                      </h5>
                      <p className="card-text text-muted mb-3" style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
                        {post.excerpt}
                      </p>
                      <div className="d-flex align-items-center mb-3">
                        <div className="me-3">
                          <div className="fw-bold text-dark small">{post.author}</div>
                          <div className="text-muted small">{post.date}</div>
                        </div>
                        <div className="ms-auto">
                          <i className="fas fa-clock me-1 text-muted"></i>
                          <span className="text-muted small">{post.readTime}</span>
                        </div>
                      </div>
                      <div>
                        {post.tags.map((tag, index) => (
                          <span key={index} className="badge bg-light text-dark me-1 mb-1" style={{ fontSize: '0.7rem' }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="row">
          <div className="col-12">
            <div className="bg-primary rounded-3 p-5 text-center text-white">
              <h4 className="fw-bold mb-3">Đăng Ký Nhận Tin Tức</h4>
              <p className="mb-4">Nhận những bài viết mới nhất về sách và manga</p>
              <div className="row justify-content-center">
                <div className="col-md-6">
                  <div className="input-group">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Nhập email của bạn"
                      style={{ borderRadius: '25px 0 0 25px', border: 'none' }}
                    />
                    <button 
                      className="btn btn-light text-primary fw-bold"
                      style={{ borderRadius: '0 25px 25px 0', border: 'none' }}
                    >
                      Đăng Ký
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;