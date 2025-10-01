import React, { useState, useEffect } from 'react';

const ProductDetail = ({ productId, onNavigateTo }) => {
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [reviewerName, setReviewerName] = useState('');
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lấy dữ liệu sách từ API
  useEffect(() => {
    const fetchBook = async () => {
      if (!productId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Thử lấy dữ liệu từ API
        const response = await fetch(`http://localhost:5000/api/books/${productId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setBook(data);
      } catch (err) {
        console.error('Error fetching book:', err);

        // Nếu là lỗi mạng (backend không chạy), sử dụng dữ liệu dự phòng một cách im lặng
        if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
          console.log('Backend not available, using fallback data');
          setBook(getProductData(productId));
          setError(null); // Không hiển thị lỗi cho dữ liệu dự phòng
        } else {
          setError(`Lỗi: ${err.message}`);
          setBook(getProductData(productId)); // Vẫn sử dụng dữ liệu dự phòng
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [productId]);

  // Dữ liệu sản phẩm mẫu - dữ liệu dự phòng
  const getProductData = (id) => {
    const products = {
      1: {
        id: 1,
        title: "Thanh Gươm Diệt Quỷ - Tập 1",
        price: 815000,
        image: "/images/book1.jpg",
        author: "Koyoharu Gotouge",
        company: "Shueisha",
        tags: ["manga", "anime", "action"],
        description: `Câu chuyện về Tanjiro Kamado, một cậu bé trở thành thợ săn quỷ để cứu em gái mình khỏi lời nguyền biến thành quỷ.`,
        fullDescription: `Thanh Gươm Diệt Quỷ - Tập 1 là phần mở đầu của bộ manga nổi tiếng về thế giới thợ săn quỷ.

Cốt truyện chính:
Tanjiro Kamado là một cậu bé sống cùng gia đình trên núi. Một ngày nọ, khi trở về nhà, cậu phát hiện gia đình bị quỷ tàn sát, chỉ còn em gái Nezuko sống sót nhưng đã biến thành quỷ.

Chủ đề:
• Tình anh em: Mối quan hệ sâu sắc giữa Tanjiro và Nezuko
• Lòng dũng cảm: Tanjiro quyết tâm trở thành thợ săn quỷ để cứu em gái
• Sự hy sinh: Các nhân vật sẵn sàng hy sinh để bảo vệ người thân

Điểm nổi bật:
• Được đánh giá là một trong những manga hay nhất về chủ đề gia đình và tình anh em
• Nghệ thuật vẽ đẹp mắt với những cảnh chiến đấu ấn tượng
• Cốt truyện cảm động và có ý nghĩa sâu sắc`
      },
      2: {
        id: 2,
        title: "Doraemon: Nobita và Cuộc Chiến Vũ Trụ",
        price: 248000,
        image: "/images/book2.jpg",
        author: "Fujiko F. Fujio",
        company: "Shogakukan",
        tags: ["manga", "anime", "adventure"],
        description: `Một trong những bộ phim Doraemon nổi tiếng nhất. Được phát hành lần đầu vào năm 1985 và sau đó được làm lại vào năm 2021.`,
        fullDescription: `Doraemon: Nobita và Cuộc Chiến Vũ Trụ là một trong những bộ phim Doraemon nổi tiếng nhất. Được phát hành lần đầu vào năm 1985 và sau đó được làm lại vào năm 2021.

Cốt truyện chính:
Nobita tìm thấy một phi thuyền đồ chơi thuộc về Papi, tổng thống hành tinh Pirika. Papi đang chạy trốn khỏi lực lượng quân sự đối lập. Nobita, Doraemon và bạn bè quyết định giúp Papi bằng cách sử dụng "Đèn thu nhỏ" của Doraemon.

Chủ đề:
• Tình bạn và lòng dũng cảm: Các bạn nhỏ thể hiện lòng dũng cảm, tình bạn và sự đoàn kết để giải phóng người dân khỏi sự chuyên chế.
• Công lý và tự do: Câu chuyện nhấn mạnh sự kháng cự chống lại chế độ độc tài và theo đuổi hòa bình.
• Sự hy sinh và lòng trung thành: Các nhân vật sẵn sàng đặt mình vào nguy hiểm để bảo vệ bạn bè và chiến đấu vì công lý.

Điểm nổi bật:
• Được coi là một trong những bộ phim Doraemon được đánh giá cao nhất về thông điệp ý nghĩa và cốt truyện cảm động.
• Bản làm lại năm 2021 sử dụng kỹ thuật hoạt hình hiện đại, giữ nguyên cốt truyện gốc nhưng thêm các hình ảnh, chi tiết mới để thu hút khán giả hiện đại hơn.`
      },
      3: {
        id: 3,
        title: "Harry Potter và Hòn Đá Phù Thủy",
        price: 200000,
        image: "/images/book3.jpg",
        author: "J.K. Rowling",
        company: "Bloomsbury",
        tags: ["fantasy", "magic", "adventure"],
        description: `Câu chuyện về cậu bé Harry Potter phát hiện mình là phù thủy và bắt đầu cuộc phiêu lưu tại trường Hogwarts.`,
        fullDescription: `Harry Potter và Hòn Đá Phù Thủy là cuốn sách đầu tiên trong bộ truyện nổi tiếng về thế giới phù thủy.

Cốt truyện chính:
Harry Potter, một cậu bé 11 tuổi, phát hiện mình là phù thủy và được nhận vào trường Hogwarts. Tại đây, cậu kết bạn với Ron Weasley và Hermione Granger, đồng thời khám phá bí mật về quá khứ của mình.

Chủ đề:
• Tình bạn: Mối quan hệ sâu sắc giữa Harry, Ron và Hermione
• Lòng dũng cảm: Harry đối mặt với những thử thách nguy hiểm
• Sự hy sinh: Các nhân vật sẵn sàng hy sinh để bảo vệ những người thân yêu

Điểm nổi bật:
• Tạo ra một thế giới phù thủy phong phú và chi tiết
• Cốt truyện hấp dẫn với nhiều tình tiết bất ngờ
• Thông điệp tích cực về tình bạn, lòng dũng cảm và sự hy sinh`
      },
      4: {
        id: 4,
        title: "Conan - Vụ Án Nữ Hoàng 450",
        price: 863000,
        image: "/images/book4.jpg",
        author: "Gosho Aoyama",
        company: "Shogakukan",
        tags: ["manga", "mystery", "detective"],
        description: `Câu chuyện về thám tử Conan Edogawa giải quyết những vụ án phức tạp và bí ẩn.`,
        fullDescription: `Conan - Vụ Án Nữ Hoàng 450 là một trong những tập manga Detective Conan nổi tiếng.

Cốt truyện chính:
Conan Edogawa, thám tử tài ba bị biến thành trẻ con, tiếp tục giải quyết những vụ án phức tạp. Trong tập này, cậu phải đối mặt với một vụ án liên quan đến nữ hoàng và những bí mật cung đình.

Chủ đề:
• Trí tuệ và khả năng suy luận: Conan sử dụng trí thông minh để giải quyết vụ án
• Công lý: Cậu luôn tìm cách đưa sự thật ra ánh sáng
• Tình bạn: Mối quan hệ với các bạn cùng lớp và đồng nghiệp

Điểm nổi bật:
• Cốt truyện trinh thám hấp dẫn với nhiều tình tiết bất ngờ
• Nhân vật Conan thông minh và dũng cảm
• Nghệ thuật vẽ chi tiết và sinh động`
      },
      5: {
        id: 5,
        title: "One Piece - Tập 100",
        price: 220000,
        image: "/images/book1.jpg",
        author: "Eiichiro Oda",
        company: "Shueisha",
        tags: ["manga", "adventure", "action"],
        description: `Cuộc phiêu lưu của Monkey D. Luffy và băng hải tặc Mũ Rơm tìm kiếm kho báu One Piece.`,
        fullDescription: `One Piece - Tập 100 là một trong những tập manga One Piece nổi tiếng.

Cốt truyện chính:
Monkey D. Luffy, một cậu bé có khả năng co giãn như cao su, mơ ước trở thành Vua Hải Tặc. Cậu cùng băng hải tặc Mũ Rơm của mình phiêu lưu trên biển cả để tìm kiếm kho báu One Piece.

Chủ đề:
• Tình bạn: Mối quan hệ sâu sắc giữa các thành viên băng hải tặc
• Ước mơ: Mỗi nhân vật đều có ước mơ riêng và quyết tâm thực hiện
• Tự do: Khát khao được tự do trên biển cả

Điểm nổi bật:
• Cốt truyện phiêu lưu hấp dẫn với nhiều nhân vật thú vị
• Thế giới quan phong phú và chi tiết
• Thông điệp tích cực về tình bạn và ước mơ`
      },
      6: {
        id: 6,
        title: "Attack on Titan - Tập 30",
        price: 195000,
        image: "/images/book2.jpg",
        author: "Hajime Isayama",
        company: "Kodansha",
        tags: ["manga", "action", "drama"],
        description: `Câu chuyện về cuộc chiến của nhân loại chống lại những Titan khổng lồ.`,
        fullDescription: `Attack on Titan - Tập 30 là một trong những tập manga Attack on Titan nổi tiếng.

Cốt truyện chính:
Nhân loại bị đe dọa bởi những Titan khổng lồ. Eren Yeager và những người bạn của mình gia nhập Quân đoàn Tình báo để chiến đấu chống lại Titan và khám phá bí mật về nguồn gốc của chúng.

Chủ đề:
• Sự sống còn: Cuộc chiến để bảo vệ nhân loại
• Sự thật: Khám phá những bí mật bị che giấu
• Hy sinh: Các nhân vật sẵn sàng hy sinh vì lý tưởng

Điểm nổi bật:
• Cốt truyện căng thẳng và kịch tính
• Nhân vật phức tạp với động cơ sâu sắc
• Nghệ thuật vẽ ấn tượng với những cảnh chiến đấu hoành tráng`
      }
    };

    return products[id] || products[1]; // Mặc định là sản phẩm đầu tiên nếu không tìm thấy
  };

  // Sử dụng dữ liệu API nếu có, nếu không thì dùng dữ liệu dự phòng
  const product = book ? {
    id: book.book_id,
    title: book.title,
    price: book.price,
    image: book.image_url || "/images/book1.jpg",
    author: book.author_name || "Unknown Author",
    company: book.publisher_name || "Unknown Publisher",
    tags: book.categories ? book.categories.split(',').map(cat => cat.trim()) : ["book"],
    description: book.description || "Không có mô tả",
    fullDescription: book.description || "Không có mô tả chi tiết"
  } : getProductData(productId);

  const reviews = [
    {
      id: 1,
      user: "User 1",
      rating: 5,
      comment: "This book is very great, the product is very good",
      likes: 1
    }
  ];

  const recommendations = [
    {
      id: 1,
      title: "WHERE THE CRAWDADS SING",
      author: "Delia Owens",
      price: "350.000 VNĐ",
      image: "/images/book2.jpg",
      rating: 5
    },
    {
      id: 2,
      title: "Doraemon: Nobita's Little Star Wars",
      author: "Fujiko F. Fujio",
      price: "280.000 VNĐ",
      image: "/images/book1.jpg",
      rating: 5
    },
    {
      id: 3,
      title: "Demon Slayer - Kimetsu No Yaiba",
      author: "Koyoharu Gotouge",
      price: "150.000 VNĐ",
      image: "/images/book3.jpg",
      rating: 5
    },
    {
      id: 4,
      title: "Conan - Fu Jin Nobunaga 450",
      author: "Gosho Aoyama",
      price: "180.000 VNĐ",
      image: "/images/book4.jpg",
      rating: 5
    }
  ];

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (!book) return;

    // Kiểm tra còn hàng không
    if (book.stock <= 0) {
      if (window.showToast) {
        window.showToast('Sản phẩm đã hết hàng!', 'warning');
      } else {
        alert('Sản phẩm đã hết hàng!');
      }
      return;
    }

    // Kiểm tra số lượng có vượt quá stock không
    if (quantity > book.stock) {
      if (window.showToast) {
        window.showToast(`Chỉ còn ${book.stock} sản phẩm trong kho!`, 'warning');
      } else {
        alert(`Chỉ còn ${book.stock} sản phẩm trong kho!`);
      }
      return;
    }

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item.book_id === book.book_id);

    if (existingItem) {
      // Kiểm tra tổng số lượng có vượt quá stock không
      if (existingItem.quantity + quantity > book.stock) {
        if (window.showToast) {
          window.showToast(`Chỉ có thể thêm tối đa ${book.stock - existingItem.quantity} sản phẩm!`, 'warning');
        } else {
          alert(`Chỉ có thể thêm tối đa ${book.stock - existingItem.quantity} sản phẩm!`);
        }
        return;
      }
      existingItem.quantity += quantity;

      // Hiển thị thông báo thành công
      if (window.showToast) {
        window.showToast(`Đã thêm ${quantity} "${book.title}" vào giỏ hàng!`, 'success');
      }
    } else {
      cart.push({
        book_id: book.book_id,
        title: book.title,
        price: book.price,
        cover_image: book.cover_image,
        quantity: quantity,
        added_at: new Date().toISOString()
      });

      // Hiển thị thông báo thành công
      if (window.showToast) {
        window.showToast(`Đã thêm ${quantity} "${book.title}" vào giỏ hàng!`, 'success');
      }
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent('cartUpdated', {
      detail: { cart, action: 'add', bookId: book.book_id, quantity }
    }));

    console.log('Added to cart:', { book, quantity });
  };

  // Hàm xử lý tiến hành thanh toán
  const handleProceedToPayment = () => {
    if (!book) return;

    // Kiểm tra còn hàng không
    if (book.stock <= 0) {
      if (window.showToast) {
        window.showToast('Sản phẩm đã hết hàng!', 'warning');
      } else {
        alert('Sản phẩm đã hết hàng!');
      }
      return;
    }

    // Kiểm tra số lượng có vượt quá stock không
    if (quantity > book.stock) {
      if (window.showToast) {
        window.showToast(`Chỉ còn ${book.stock} sản phẩm trong kho!`, 'warning');
      } else {
        alert(`Chỉ còn ${book.stock} sản phẩm trong kho!`);
      }
      return;
    }

    // Tạo item thanh toán
    const checkoutItem = {
      book_id: book.book_id,
      title: book.title,
      price: book.price,
      cover_image: book.cover_image,
      quantity: quantity,
      added_at: new Date().toISOString()
    };

    // Lưu item vào sessionStorage để checkout
    sessionStorage.setItem('checkoutItems', JSON.stringify([checkoutItem]));

    // Hiển thị thông báo thành công
    if (window.showToast) {
      window.showToast(`Đang chuyển đến thanh toán với ${quantity} "${book.title}"!`, 'success');
    }

    // Chuyển đến trang thanh toán
    console.log('Proceeding to payment with:', checkoutItem);

    // Chuyển đến trang thanh toán thực tế
    onNavigateTo('checkout')();
  };

  const handleRatingClick = (selectedRating) => {
    setRating(selectedRating);
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (rating > 0 && review.trim() && reviewerName.trim()) {
      console.log('Review submitted:', { rating, review, reviewerName });
      // Đặt lại form
      setRating(0);
      setReview('');
      setReviewerName('');
    }
  };

  const renderStars = (rating, interactive = false, onStarClick = null) => {
    return Array.from({ length: 5 }, (_, index) => (
      <i
        key={index}
        className={`bi bi-star${index < rating ? '-fill' : ''} text-warning`}
        style={{
          cursor: interactive ? 'pointer' : 'default',
          fontSize: interactive ? '20px' : '14px'
        }}
        onClick={interactive ? () => onStarClick(index + 1) : undefined}
      ></i>
    ));
  };

  const ratingLabels = ['Very Bad', 'Bad', 'Average', 'Good', 'Very Good'];

  if (loading) {
    return (
      <div className="container py-4">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Đang tải thông tin sản phẩm...</p>
        </div>
      </div>
    );
  }

  if (error && !book) {
    return (
      <div className="container py-4">
        <div className="alert alert-warning" role="alert">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Backend Status Notice */}
      {!book && getProductData(productId) && (
        <div className="alert alert-info alert-dismissible fade show" role="alert">
          <i className="bi bi-info-circle me-2"></i>
          <strong>Thông báo:</strong> Đang sử dụng dữ liệu mẫu. Backend có thể chưa được khởi động.
          <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      )}

      {/* Product Info Section */}
      <div className="row mb-5">
        <div className="col-lg-6">
          <img
            src={product.image}
            alt={product.title}
            className="img-fluid rounded shadow"
            style={{ width: '100%', height: '500px', objectFit: 'contain', backgroundColor: '#f8f9fa' }}
          />
        </div>
        <div className="col-lg-6">
          <div className="ps-lg-4">
            <h1 className="h2 mb-3">{product.title}</h1>
            <p className="text-muted mb-3">{product.description}</p>

            <div className="mb-4">
              <span className="h3 text-primary">
                {typeof product.price === 'number'
                  ? product.price.toLocaleString('vi-VN') + ' VNĐ'
                  : product.price
                }
              </span>
            </div>

            {/* Quantity Selector */}
            <div className="mb-4">
              <label className="form-label fw-bold">Quantity:</label>
              <div className="d-flex align-items-center">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <input
                  className="form-control text-center mx-2"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  style={{ width: '80px' }}
                  min="1"
                />
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => handleQuantityChange(1)}
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="d-flex gap-2 mb-4">
              {/* Add to Cart Button */}
              <button
                className="btn btn-dark flex-fill"
                onClick={handleAddToCart}
                style={{
                  borderRadius: '6px',
                  fontWeight: '500',
                  padding: '6px 12px',
                  fontSize: '13px'
                }}
              >
                <i className="bi bi-cart-plus me-1"></i>
                Thêm giỏ hàng
              </button>

              {/* Proceed to Payment Button */}
              <button
                className="btn btn-success flex-fill"
                onClick={handleProceedToPayment}
                style={{
                  borderRadius: '6px',
                  fontWeight: '500',
                  padding: '6px 12px',
                  fontSize: '13px',
                  background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                  border: 'none',
                  boxShadow: '0 2px 8px rgba(40, 167, 69, 0.25)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 4px 12px rgba(40, 167, 69, 0.35)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 2px 8px rgba(40, 167, 69, 0.25)';
                }}
              >
                <i className="bi bi-credit-card me-1"></i>
                Thanh toán
              </button>
            </div>

            {/* Product Details */}
            <div className="row">
              <div className="col-6">
                <p className="mb-2"><strong>Author:</strong> {product.author}</p>
                <p className="mb-2"><strong>Company:</strong> {product.company}</p>
                <p className="mb-0"><strong>Tags:</strong> {product.tags.join(', ')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="mb-5">
        <h3 className="mb-3">Description</h3>
        <div className="bg-light p-4 rounded">
          <pre className="mb-0" style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
            {product.fullDescription}
          </pre>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mb-5">
        <h3 className="mb-3">Reviews</h3>
        {reviews.map(review => (
          <div key={review.id} className="border-bottom pb-3 mb-3">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h6 className="mb-1">{review.user}</h6>
                <div className="mb-2">
                  {renderStars(review.rating)}
                </div>
                <p className="mb-2">{review.comment}</p>
              </div>
              <button className="btn btn-outline-danger btn-sm">
                ❤️ Like ({review.likes})
              </button>
            </div>
          </div>
        ))}
        <a href="#" className="text-decoration-none" style={{
          fontSize: '14px',
          fontWeight: '500',
          color: '#333',
          transition: 'all 0.3s ease'
        }}
          onMouseEnter={(e) => {
            e.target.style.color = '#dc3545';
            e.target.style.transform = 'translateX(5px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.color = '#333';
            e.target.style.transform = 'translateX(0)';
          }}>
          View all 4 reviews <i className="bi bi-arrow-right ms-1"></i>
        </a>
      </div>

      {/* Add Review Section */}
      <div className="mb-5">
        <h3 className="mb-3">Add a review</h3>
        <p className="text-muted mb-3">Your account will not be published. Required fields are marked *</p>

        <form onSubmit={handleSubmitReview}>
          {/* Rating */}
          <div className="mb-3">
            <label className="form-label fw-bold">Your rating *</label>
            <div className="d-flex align-items-center">
              <div className="me-3">
                {renderStars(rating, true, handleRatingClick)}
              </div>
              <div className="d-flex flex-wrap">
                {ratingLabels.map((label, index) => (
                  <span
                    key={index}
                    className={`badge me-2 mb-1 ${index < rating ? 'bg-warning' : 'bg-secondary'}`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleRatingClick(index + 1)}
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Review Text */}
          <div className="mb-3">
            <label className="form-label fw-bold">Your review *</label>
            <textarea
              className="form-control"
              rows="4"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Write your review here..."
              required
            ></textarea>
          </div>

          {/* Name */}
          <div className="mb-3">
            <label className="form-label fw-bold">Your name *</label>
            <input
              type="text"
              className="form-control"
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>

          <button type="submit" className="btn btn-dark">
            Submit
          </button>
        </form>
      </div>

      {/* Recommendations Section */}
      <div className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3>Recommendations</h3>
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
            }}>View All <i className="bi bi-arrow-right ms-1"></i></a>
        </div>

        <div className="row g-4">
          {recommendations.map(rec => (
            <div key={rec.id} className="col-lg-3 col-md-4 col-sm-6">
              <div className="card h-100 border-0 shadow-sm">
                <img
                  src={rec.image}
                  className="card-img-top"
                  alt={rec.title}
                  style={{ height: '200px', objectFit: 'contain', backgroundColor: '#f8f9fa' }}
                />
                <div className="card-body d-flex flex-column">
                  <h6 className="card-title text-dark mb-2" style={{ fontSize: '14px', lineHeight: '1.3' }}>
                    {rec.title}
                  </h6>
                  <p className="text-muted small mb-2">{rec.author}</p>
                  <div className="d-flex align-items-center mb-2">
                    {renderStars(rec.rating)}
                  </div>
                  <div className="mt-auto">
                    <span className="fw-bold text-primary">{rec.price}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
