import React from 'react';

const BlogDetail = ({ onNavigateTo, blogId }) => {
  // Dữ liệu blog chi tiết
  const blogData = {
    1: {
      id: 1,
      title: "Fujiko F. Fujio - Người Tạo Ra Doraemon",
      content: `
        <p>Fujiko F. Fujio (1933-1996) là một trong những mangaka vĩ đại nhất của Nhật Bản. Ông nổi tiếng với bộ truyện Doraemon, một tác phẩm đã trở thành biểu tượng văn hóa không chỉ ở Nhật mà còn trên toàn thế giới.</p>
        
        <h3>Những Ngày Đầu</h3>
        <p>Fujiko F. Fujio sinh ra tại Takaoka, tỉnh Toyama vào năm 1933. Tên thật của ông là Hiroshi Fujimoto. Từ nhỏ, ông đã có niềm đam mê với manga và anime. Năm 1951, ông gặp Motoo Abiko (sau này là Fujiko A. Fujio) và hai người bắt đầu hợp tác sáng tác manga dưới bút danh chung "Fujiko Fujio".</p>
        
        <h3>Sự Ra Đời Của Doraemon</h3>
        <p>Năm 1969, Doraemon lần đầu tiên xuất hiện trong tạp chí manga thiếu nhi. Câu chuyện kể về một chú mèo máy từ thế kỷ 22 được gửi về quá khứ để giúp đỡ cậu bé Nobita Nobi. Doraemon có túi thần kỳ chứa đầy những bảo bối tương lai, mỗi bảo bối đều có khả năng đặc biệt giúp Nobita giải quyết các vấn đề trong cuộc sống.</p>
        
        <h3>Tác Động Văn Hóa</h3>
        <p>Doraemon không chỉ là một bộ truyện tranh đơn thuần mà còn là một phần quan trọng của văn hóa Nhật Bản. Tác phẩm đã được dịch sang nhiều ngôn ngữ và phát hành tại hơn 40 quốc gia. Tại Việt Nam, Doraemon cũng rất được yêu thích và đã trở thành một phần tuổi thơ của nhiều thế hệ.</p>
        
        <h3>Di Sản</h3>
        <p>Mặc dù Fujiko F. Fujio đã qua đời vào năm 1996, nhưng di sản của ông vẫn tiếp tục sống mãi. Doraemon vẫn được xuất bản và phát sóng cho đến ngày nay, với các tác phẩm mới được tạo ra bởi các họa sĩ khác dựa trên ý tưởng gốc của ông.</p>
        
        <p>Fujiko F. Fujio đã để lại cho thế giới một tác phẩm vượt thời gian, không chỉ giải trí mà còn mang tính giáo dục cao, dạy trẻ em về tình bạn, lòng tốt và sự sáng tạo.</p>
      `,
      author: "Nguyễn Văn A",
      date: "24 Tháng 10, 2019",
      readTime: "5 phút đọc",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=400&fit=crop",
      category: "Tác giả",
      tags: ["Doraemon", "Manga", "Fujiko F. Fujio", "Nhật Bản"],
      views: 2500
    }
  };

  const blog = blogData[blogId] || blogData[1];

  const handleBackToBlog = () => {
    onNavigateTo('blog')();
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
                onClick={() => onNavigateTo('home')()}
                style={{ color: '#6c757d' }}
              >
                Trang Chủ
              </button>
            </li>
            <li className="breadcrumb-item">
              <button 
                className="btn btn-link p-0 text-decoration-none"
                onClick={handleBackToBlog}
                style={{ color: '#6c757d' }}
              >
                Blog
              </button>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {blog.title}
            </li>
          </ol>
        </nav>
      </div>

      {/* Article Content */}
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            {/* Article Header */}
            <article className="card shadow-sm">
              {/* Featured Image */}
              <img 
                src={blog.image}
                className="card-img-top"
                style={{ height: '400px', objectFit: 'cover' }}
                alt={blog.title}
              />
              
              <div className="card-body p-5">
                {/* Category Badge */}
                <div className="mb-3">
                  <span className="badge bg-primary">{blog.category}</span>
                </div>

                {/* Title */}
                <h1 className="card-title fw-bold mb-4" style={{ fontSize: '2.5rem', lineHeight: '1.2' }}>
                  {blog.title}
                </h1>

                {/* Meta Info */}
                <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
                  <div className="d-flex align-items-center">
                    <div 
                      className="rounded-circle me-3"
                      style={{
                        width: '50px',
                        height: '50px',
                        backgroundImage: 'url(https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    />
                    <div>
                      <div className="fw-semibold">{blog.author}</div>
                      <small className="text-muted">{blog.date}</small>
                    </div>
                  </div>
                  <div className="text-end">
                    <div className="fw-semibold">{blog.readTime}</div>
                    <small className="text-muted">{blog.views.toLocaleString()} lượt xem</small>
                  </div>
                </div>

                {/* Tags */}
                <div className="mb-4">
                  {blog.tags.map((tag, index) => (
                    <span key={index} className="badge bg-light text-dark me-2 mb-2">
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Article Content */}
                <div 
                  className="article-content"
                  style={{ fontSize: '1.1rem', lineHeight: '1.8' }}
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />

                {/* Back Button */}
                <div className="mt-5 pt-4 border-top">
                  <button 
                    className="btn btn-outline-primary"
                    onClick={handleBackToBlog}
                  >
                    <i className="bi bi-arrow-left me-2"></i>
                    Quay Lại Blog
                  </button>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
