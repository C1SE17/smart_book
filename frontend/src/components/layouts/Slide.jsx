import React, { useState, useEffect } from 'react';

const Slide = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Slide data
  const slides = [
    {
      id: 1,
      title: "Top 10 most favorite books",
      description: "Discover the best books of all time, hand-picked by our experts.",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop",
      buttonText: "Learn More",
      backgroundColor: "#ffc0cb"
    },
    {
      id: 2,
      title: "New Arrivals",
      description: "Check out our latest collection of books from around the world.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop",
      buttonText: "Shop Now",
      backgroundColor: "#e3f2fd"
    },
    {
      id: 3,
      title: "Best Sellers",
      description: "The most popular books that everyone is talking about.",
      image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=400&fit=crop",
      buttonText: "View All",
      backgroundColor: "#f3e5f5"
    }
  ];

  // Auto slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const currentSlideData = slides[currentSlide];

  return (
    <section 
      className="py-5 position-relative" 
      style={{backgroundColor: currentSlideData.backgroundColor}}
    >
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <h1 className="display-4 fw-bold text-dark mb-4" style={{ lineHeight: '1.2' }}>
              {currentSlideData.title}
            </h1>
            <p className="lead text-dark mb-4">
              {currentSlideData.description}
            </p>
            <button 
              className="btn btn-lg text-white" 
              style={{
                backgroundColor: '#333',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                fontSize: '16px',
                fontWeight: '500',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#555';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#333';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              {currentSlideData.buttonText} <i className="fas fa-arrow-right ms-2"></i>
            </button>
          </div>
          <div className="col-lg-6">
            <div 
              className="text-center"
              style={{
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                transform: 'translateY(-10px)'
              }}
            >
              <img 
                src={currentSlideData.image}
                alt={currentSlideData.title}
                className="img-fluid"
                style={{
                  width: '100%',
                  height: '400px',
                  objectFit: 'cover',
                  borderRadius: '12px'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        className="position-absolute top-50 translate-middle-y"
        onClick={prevSlide}
        style={{
          left: '20px',
          backgroundColor: 'rgba(0,0,0,0.6)',
          border: 'none',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          color: 'white',
          fontSize: '18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          zIndex: 10,
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = 'rgba(0,0,0,0.8)';
          e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.4)';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = 'rgba(0,0,0,0.6)';
          e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
        }}
      >
        <i className="fas fa-chevron-left"></i>
      </button>

      <button
        className="position-absolute top-50 translate-middle-y"
        onClick={nextSlide}
        style={{
          right: '20px',
          backgroundColor: 'rgba(0,0,0,0.6)',
          border: 'none',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          color: 'white',
          fontSize: '18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          zIndex: 10,
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = 'rgba(0,0,0,0.8)';
          e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.4)';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = 'rgba(0,0,0,0.6)';
          e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
        }}
      >
        <i className="fas fa-chevron-right"></i>
      </button>

      {/* Slide Indicators */}
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
