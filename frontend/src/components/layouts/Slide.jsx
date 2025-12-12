import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const Slide = ({ onNavigateTo }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { dictionary } = useLanguage();

  // Dữ liệu slide - được memoize để tránh tạo lại
  const baseSlides = useMemo(() => [
    {
      id: 1,
      defaultTitle: "Top 10 cuốn sách yêu thích",
      defaultDescription: "Khám phá những cuốn sách hay nhất mọi thời đại được các chuyên gia của chúng tôi tuyển chọn kỹ lưỡng.",
      image: "/images/2.jpg",
      defaultButtonText: "Xem thêm",
      backgroundColor: "#ffc0cb",
      navigationType: "categories", // Chuyển đến trang danh mục
      productId: 1
    },
    {
      id: 2,
      defaultTitle: "Sách mới",
      defaultDescription: "Hãy xem bộ sưu tập sách mới nhất của chúng tôi từ khắp nơi trên thế giới.",
      image: "/images/biasach.jpg",
      defaultButtonText: "Mua ngay",
      backgroundColor: "#e3f2fd",
      navigationType: "categories", // Chuyển đến trang danh mục
      productId: 2
    },
    {
      id: 3,
      defaultTitle: "Bán chạy nhất",
      defaultDescription: "Những cuốn sách phổ biến nhất mà mọi người đang bàn tán.",
      image: "/images/banchay.jpg",
      defaultButtonText: "Xem tất cả",
      backgroundColor: "#f3e5f5",
      navigationType: "categories", // Chuyển đến trang danh mục sản phẩm
      productId: null
    }
  ], []);

  const slides = useMemo(() => {
    const localized = dictionary.slides || [];
    return baseSlides.map((slide, index) => ({
      ...slide,
      title: localized[index]?.title || slide.defaultTitle,
      description: localized[index]?.description || slide.defaultDescription,
      buttonText: localized[index]?.buttonText || slide.defaultButtonText,
    }));
  }, [baseSlides, dictionary.slides]);

  // Tự động chuyển slide mỗi 5 giây
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const goToSlide = useCallback((index) => {
    setCurrentSlide(index);
  }, []);

  // Các event handler được memoize
  const handleButtonHover = useCallback((e, isEnter) => {
    if (isEnter) {
      e.target.style.color = '#007bff';
      e.target.style.transform = 'translateX(5px)';
    } else {
      e.target.style.color = '#333';
      e.target.style.transform = 'translateX(0)';
    }
  }, []);

  const handleArrowHover = useCallback((e, isEnter) => {
    if (isEnter) {
      e.target.style.backgroundColor = 'rgba(0,0,0,0.8)';
      e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.4)';
    } else {
      e.target.style.backgroundColor = 'rgba(0,0,0,0.6)';
      e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
    }
  }, []);

  const handleDotHover = useCallback((e, isEnter, index) => {
    if (index !== currentSlide) {
      if (isEnter) {
        e.target.style.backgroundColor = 'rgba(255,255,255,0.8)';
        e.target.style.transform = 'scale(1.2)';
      } else {
        e.target.style.backgroundColor = 'rgba(255,255,255,0.5)';
        e.target.style.transform = 'scale(1)';
      }
    }
  }, [currentSlide]);

  const currentSlideData = slides[currentSlide];

  return (
    <section
      className="pb-5 position-relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        paddingTop: '0',
        marginTop: '-20px',
        minHeight: '500px'
      }}
    >
      {/* Background Pattern */}
      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{
          backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(0,0,0,0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(0,0,0,0.05) 0%, transparent 50%)',
          zIndex: 1
        }}
      ></div>

      <div className="container position-relative" style={{ paddingTop: '3rem', zIndex: 2 }}>
        <div className="row align-items-center min-vh-50">
          <div className="col-lg-6">
            <div className="slide-content" style={{ animation: 'slideInLeft 0.8s ease-out' }}>
              <h1
                className="display-3 fw-bold text-dark mb-4"
                style={{
                  lineHeight: '1.1',
                  color: '#2c3e50',
                  textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                {currentSlideData.title}
              </h1>
              <p
                className="lead text-dark mb-4"
                style={{
                  fontSize: '1.2rem',
                  lineHeight: '1.6',
                  fontWeight: '400',
                  color: '#6c757d'
                }}
              >
                {currentSlideData.description}
              </p>
              <a
                href="#"
                className="text-decoration-none position-relative"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 24px',
                  backgroundColor: 'transparent',
                  border: '2px solid #2c3e50',
                  borderRadius: '8px',
                  color: '#2c3e50',
                  fontWeight: '600',
                  fontSize: '16px',
                  transition: 'all 0.3s ease',
                  textDecoration: 'none',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onClick={(e) => {
                  e.preventDefault();
                  if (onNavigateTo) {
                    if (currentSlideData.navigationType === 'product') {
                      onNavigateTo('product', { productId: currentSlideData.productId });
                    } else if (currentSlideData.navigationType === 'categories') {
                      onNavigateTo('categories');
                    } else {
                      onNavigateTo('categories');
                    }
                  }
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#2c3e50';
                  e.target.style.color = 'white';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(44, 62, 80, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#2c3e50';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <span>{currentSlideData.buttonText}</span>
                <i className="fas fa-arrow-right" style={{ fontSize: '14px' }}></i>
              </a>
            </div>
          </div>
          <div className="col-lg-6">
            <div
              className="text-center position-relative"
              style={{ animation: 'slideInRight 0.8s ease-out 0.2s both' }}
            >
              <div
                className="position-relative"
                style={{
                  borderRadius: '32px',
                  boxShadow: '0 25px 70px rgba(0,0,0,0.12)',
                  border: '1px solid rgba(0,0,0,0.06)',
                  width: '100%',
                  maxWidth: '700px',
                  margin: '0 auto',
                  padding: '8px',
                  background: '#fff'
                }}
              >
                <img
                  src={currentSlideData.image}
                  alt={currentSlideData.title}
                  className="img-fluid"
                  style={{
                    width: '100%',
                    height: '480px',
                    objectFit: 'cover',
                    borderRadius: '24px',
                    border: '12px solid #fff',
                    backgroundColor: '#fff'
                  }}
                />
                {/* Overlay gradient */}
                <div
                  className="position-absolute top-0 start-0 w-100 h-100"
                  style={{
                    background: 'linear-gradient(135deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.05) 100%)',
                    borderRadius: '20px'
                  }}
                ></div>
              </div>

              {/* Floating elements */}
              <div
                className="position-absolute"
                style={{
                  top: '20%',
                  right: '-10%',
                  width: '60px',
                  height: '60px',
                  background: 'linear-gradient(135deg, #6c757d, #495057)',
                  borderRadius: '50%',
                  opacity: '0.3',
                  animation: 'float 3s ease-in-out infinite'
                }}
              ></div>
              <div
                className="position-absolute"
                style={{
                  bottom: '30%',
                  left: '-15%',
                  width: '40px',
                  height: '40px',
                  background: 'linear-gradient(135deg, #adb5bd, #6c757d)',
                  borderRadius: '50%',
                  opacity: '0.2',
                  animation: 'float 3s ease-in-out infinite 1.5s'
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Mũi tên điều hướng */}
      <button
        className="position-absolute top-50 translate-middle-y"
        onClick={prevSlide}
        style={{
          left: '20px',
          backgroundColor: 'rgba(255,255,255,0.1)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '12px',
          width: '48px',
          height: '48px',
          color: '#333',
          fontSize: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          zIndex: 10,
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          cursor: 'pointer',
          backdropFilter: 'blur(20px)'
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = 'rgba(255,255,255,0.25)';
          e.target.style.border = '1px solid rgba(255,255,255,0.4)';
          e.target.style.transform = 'scale(1.05)';
          e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
          e.target.style.border = '1px solid rgba(255,255,255,0.2)';
          e.target.style.transform = 'scale(1)';
          e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
        }}
      >
        <i className="fas fa-chevron-left"></i>
      </button>

      <button
        className="position-absolute top-50 translate-middle-y"
        onClick={nextSlide}
        style={{
          right: '20px',
          backgroundColor: 'rgba(255,255,255,0.1)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '12px',
          width: '48px',
          height: '48px',
          color: '#333',
          fontSize: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          zIndex: 10,
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          cursor: 'pointer',
          backdropFilter: 'blur(20px)'
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = 'rgba(255,255,255,0.25)';
          e.target.style.border = '1px solid rgba(255,255,255,0.4)';
          e.target.style.transform = 'scale(1.05)';
          e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
          e.target.style.border = '1px solid rgba(255,255,255,0.2)';
          e.target.style.transform = 'scale(1)';
          e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
        }}
      >
        <i className="fas fa-chevron-right"></i>
      </button>

      {/* Chỉ báo slide */}
      <div
        className="position-absolute bottom-0 start-50 translate-middle-x mb-4"
        style={{ zIndex: 10 }}
      >
        <div className="d-flex gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: index === currentSlide ? '#333' : 'rgba(255,255,255,0.5)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                boxShadow: index === currentSlide ? '0 2px 8px rgba(0,0,0,0.3)' : '0 1px 4px rgba(0,0,0,0.2)'
              }}
              onMouseEnter={(e) => {
                if (index !== currentSlide) {
                  e.target.style.backgroundColor = 'rgba(255,255,255,0.8)';
                  e.target.style.transform = 'scale(1.2)';
                }
              }}
              onMouseLeave={(e) => {
                if (index !== currentSlide) {
                  e.target.style.backgroundColor = 'rgba(255,255,255,0.5)';
                  e.target.style.transform = 'scale(1)';
                }
              }}
            />
          ))}
        </div>
      </div>

    </section>
  );
};

export default Slide;
