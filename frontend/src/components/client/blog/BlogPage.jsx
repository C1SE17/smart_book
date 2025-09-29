import React from 'react';

const BlogPage = ({ onNavigateTo }) => {
  // Dữ liệu blog mẫu về sách
  const blogPosts = [
    {
      id: 1,
      title: "Fujiko F. Fujio - Người Tạo Ra Doraemon",
      excerpt: "Khám phá cuộc đời và sự nghiệp của tác giả manga nổi tiếng Fujiko F. Fujio, người đã tạo ra nhân vật Doraemon được yêu thích trên toàn thế giới.",
      content: "Fujiko F. Fujio (1933-1996) là một trong những mangaka vĩ đại nhất của Nhật Bản. Ông nổi tiếng với bộ truyện Doraemon, một tác phẩm đã trở thành biểu tượng văn hóa không chỉ ở Nhật mà còn trên toàn thế giới. Với hơn 100 triệu bản in được bán ra, Doraemon đã chạm đến trái tim của hàng triệu độc giả ở mọi lứa tuổi...",
      author: "Nguyễn Văn A",
      date: "24 Tháng 10, 2019",
      readTime: "5 phút đọc",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=300&fit=crop",
      category: "Tác giả",
      tags: ["Doraemon", "Manga", "Fujiko F. Fujio", "Nhật Bản"]
    },
    {
      id: 2,
      title: "Nghệ Thuật Kể Chuyện Manga",
      excerpt: "Tìm hiểu về những kỹ thuật kể chuyện độc đáo trong manga và cách các mangaka tạo ra những câu chuyện hấp dẫn.",
      content: "Manga không chỉ là những hình ảnh đơn thuần mà là một hình thức nghệ thuật kể chuyện phức tạp. Từ cách sắp xếp khung hình đến việc sử dụng âm thanh và chuyển động, mỗi yếu tố đều góp phần tạo nên trải nghiệm đọc độc đáo...",
      author: "Trần Thị B",
      date: "15 Tháng 11, 2019",
      readTime: "7 phút đọc",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=300&fit=crop",
      category: "Nghệ thuật",
      tags: ["Manga", "Kể chuyện", "Nghệ thuật", "Sáng tạo"]
    },
    {
      id: 3,
      title: "Top 10 Bộ Manga Phải Đọc",
      excerpt: "Danh sách những bộ manga kinh điển và đáng đọc nhất mọi thời đại, từ những tác phẩm cổ điển đến những bộ truyện hiện đại.",
      content: "Trong thế giới manga rộng lớn, có những bộ truyện đã vượt qua ranh giới của thời gian và không gian để trở thành những tác phẩm kinh điển. Từ One Piece với cuộc phiêu lưu vĩ đại của Luffy đến Attack on Titan với câu chuyện đầy kịch tính...",
      author: "Lê Văn C",
      date: "01 Tháng 12, 2019",
      readTime: "10 phút đọc",
      image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=300&fit=crop",
      category: "Danh sách",
      tags: ["Top 10", "Manga", "Kinh điển", "Phải đọc"]
    },
    {
      id: 4,
      title: "Lịch Sử Phát Triển Của Manga",
      excerpt: "Tìm hiểu về quá trình phát triển của manga từ những bản vẽ đầu tiên đến ngành công nghiệp tỷ đô ngày nay.",
      content: "Manga có lịch sử phát triển lâu dài và phong phú, bắt đầu từ những bản vẽ đơn giản trong thời kỳ Edo đến ngành công nghiệp manga hiện đại với doanh thu hàng tỷ đô. Quá trình này phản ánh sự thay đổi của xã hội Nhật Bản và sự phát triển của công nghệ...",
      author: "Phạm Thị D",
      date: "20 Tháng 12, 2019",
      readTime: "8 phút đọc",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=300&fit=crop",
      category: "Lịch sử",
      tags: ["Lịch sử", "Manga", "Phát triển", "Công nghiệp"]
    },
    {
      id: 5,
      title: "Tác Động Của Manga Đến Văn Hóa Thế Giới",
      excerpt: "Khám phá cách manga đã ảnh hưởng đến văn hóa toàn cầu và tạo ra những xu hướng mới trong nghệ thuật và giải trí.",
      content: "Manga không chỉ là một hình thức giải trí mà còn là một sức mạnh văn hóa mạnh mẽ. Từ việc lan tỏa văn hóa Nhật Bản ra thế giới đến việc tạo ra những xu hướng mới trong nghệ thuật, thời trang và lối sống...",
      author: "Hoàng Văn E",
      date: "05 Tháng 1, 2020",
      readTime: "6 phút đọc",
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=300&fit=crop",
      category: "Văn hóa",
      tags: ["Văn hóa", "Toàn cầu", "Ảnh hưởng", "Xu hướng"]
    },
    {
      id: 6,
      title: "Cách Đọc Manga Hiệu Quả",
      excerpt: "Hướng dẫn chi tiết về cách đọc manga để có trải nghiệm tốt nhất, từ cách chọn tác phẩm đến kỹ thuật đọc.",
      content: "Đọc manga là một nghệ thuật. Không chỉ đơn giản là lật trang và xem hình ảnh, việc đọc manga đúng cách sẽ mang lại trải nghiệm sâu sắc và thú vị hơn nhiều. Từ việc hiểu cách đọc từ phải sang trái đến việc cảm nhận nhịp điệu của câu chuyện...",
      author: "Vũ Thị F",
      date: "15 Tháng 1, 2020",
      readTime: "4 phút đọc",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=300&fit=crop",
      category: "Hướng dẫn",
      tags: ["Hướng dẫn", "Đọc manga", "Kỹ thuật", "Trải nghiệm"]
    }
  ];

  const handleBackToHome = () => {
    onNavigateTo('home')();
  };

  return (
    <div className="container-fluid" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Breadcrumb */}
      <div className="container py-3">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item">
              <button
                className="btn btn-link p-0 text-decoration-none"
                onClick={handleBackToHome}
                style={{ color: '#6c757d' }}
              >
                Trang Chủ
              </button>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Blog
            </li>
          </ol>
        </nav>
      </div>

      {/* Header */}
      <div className="container py-4">
        <div className="row">
          <div className="col-12 text-center">
            <h1 className="display-4 fw-bold mb-3" style={{ color: '#2c3e50' }}>
              Blog
            </h1>
            <p className="lead text-muted mb-5">
              Khám phá những bài viết thú vị về thế giới sách và manga
            </p>
          </div>
        </div>

        {/* Featured Article */}
        <div className="row mb-5">
          <div className="col-12">
            <div
              className="card shadow-sm"
              style={{ cursor: 'pointer' }}
              onClick={() => onNavigateTo('blog-detail')()}
            >
              <div className="row g-0">
                 {/* Featured Image */}
                 <div 
                   className="col-md-6"
                   onClick={(e) => {
                     e.stopPropagation();
                     onNavigateTo('blog-detail')();
                   }}
                 >
                   <img
                     src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=300&fit=crop"
                     className="img-fluid h-100"
                     style={{ objectFit: 'cover' }}
                     alt="Featured blog post"
                   />
                 </div>

                {/* Featured Content */}
                <div 
                  className="col-md-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigateTo('blog-detail')();
                  }}
                >
                  <div className="card-body p-4">
                    {/* Badge */}
                    <span className="badge bg-primary mb-3">BÀI VIẾT NỔI BẬT</span>

                    {/* Title */}
                    <h3 className="card-title fw-bold mb-3">
                      Fujiko F. Fujio - Người Tạo Ra Doraemon
                    </h3>

                    {/* Excerpt */}
                    <p className="card-text text-muted mb-3">
                      Khám phá cuộc đời và sự nghiệp của tác giả manga nổi tiếng Fujiko F. Fujio, người đã tạo ra nhân vật Doraemon được yêu thích trên toàn thế giới...
                    </p>

                    {/* Meta Info */}
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <small className="text-muted">
                        <i className="bi bi-person me-1"></i>
                        Nguyễn Văn A • 24 Tháng 10, 2019
                      </small>
                      <small className="text-muted">
                        <i className="bi bi-clock me-1"></i>
                        5 phút đọc
                      </small>
                    </div>

                    {/* Tags */}
                    <div className="mb-3">
                      <span className="badge bg-light text-dark me-1">#Doraemon</span>
                      <span className="badge bg-light text-dark me-1">#Manga</span>
                      <span className="badge bg-light text-dark me-1">#Nhật Bản</span>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Other Blog Posts */}
        <div className="row mb-4">
          <div className="col-12">
            <h3 className="fw-bold text-dark mb-4">
              <i className="fas fa-newspaper me-2" style={{ color: '#3498db', fontSize: '1.2rem', width: '20px', height: '20px' }}></i>
              Các Bài Viết Khác
            </h3>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="row g-4">
          {blogPosts.map((post) => (
            <div key={post.id} className="col-lg-4 col-md-6">
              <article
                className="card h-100 shadow-sm border-0"
                style={{
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onClick={() => onNavigateTo('blog-detail')()}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
                }}
              >
                {/* Post Image */}
                <div
                  className="card-img-top"
                  style={{
                    height: '200px',
                    backgroundImage: `url(${post.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderTopLeftRadius: '8px',
                    borderTopRightRadius: '8px'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigateTo('blog-detail')();
                  }}
                />

                {/* Post Content */}
                <div 
                  className="card-body d-flex flex-column"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigateTo('blog-detail')();
                  }}
                >
                  {/* Category & Date */}
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span
                      className="badge rounded-pill"
                      style={{
                        backgroundColor: '#e74c3c',
                        color: 'white',
                        fontSize: '0.75rem'
                      }}
                    >
                      {post.category}
                    </span>
                    <small className="text-muted">{post.date}</small>
                  </div>

                  {/* Title */}
                  <h5 className="card-title fw-bold mb-3" style={{ color: '#2c3e50' }}>
                    {post.title}
                  </h5>

                  {/* Excerpt */}
                  <p className="card-text text-muted mb-3 flex-grow-1">
                    {post.excerpt}
                  </p>

                  {/* Author & Read Time */}
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <small className="text-muted">
                      <i className="fas fa-user me-1"></i>
                      {post.author}
                    </small>
                    <small className="text-muted">
                      <i className="fas fa-clock me-1"></i>
                      {post.readTime}
                    </small>
                  </div>

                  {/* Tags */}
                  <div className="mb-3">
                    {post.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="badge bg-light text-dark me-1 mb-1"
                        style={{ fontSize: '0.7rem' }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                </div>
              </article>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="row mt-5">
          <div className="col-12 text-center">
            <button className="btn btn-primary btn-lg">
              Tải Thêm Bài Viết
            </button>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="row mt-5">
          <div className="col-12">
            <div className="card bg-primary text-white text-center">
              <div className="card-body py-4">
                <h5 className="card-title">Đăng Ký Nhận Tin Tức</h5>
                <p className="card-text">Nhận những bài viết mới nhất về sách và manga</p>
                <div className="row justify-content-center">
                  <div className="col-md-6">
                    <div className="input-group">
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Nhập email của bạn..."
                      />
                      <button className="btn btn-light">
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
    </div>
  );
};

export default BlogPage;
