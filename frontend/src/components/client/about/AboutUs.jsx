import React from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';

const AboutUs = ({ onBackToHome, onNavigateTo }) => {
  const { t } = useLanguage();
  const authors = [
    { name: "Fujiko Fujio", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face" },
    { name: "Delia Owens", image: "https://photo.znews.vn/w960/Uploaded/sgorvz/2025_05_23/tac_gia_70_tuoi.jpg" },
    { name: "Koyoharu Gotouge", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face" },
    { name: "Gosho Aoyama", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face" },
    { name: "Haruki Murakami", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face" },
    { name: "J.K. Rowling", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face" }
  ];
  const whoWeAreParagraphs = t('about.sections.whoWeAre.paragraphs', { returnObjects: true }) || [];
  const missionParagraphs = t('about.sections.mission.paragraphs', { returnObjects: true }) || [];
  const missionStats = t('about.sections.mission.stats', { returnObjects: true }) || [];
  const testimonial = t('about.sections.testimonial', { returnObjects: true }) || {};
  const fallback = t('about.fallback', { returnObjects: true }) || {};
  const authorsTitle = t('about.sections.authors.title');
  const authorsCta = t('about.sections.authors.cta');

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
          {t('about.breadcrumb.home')}/
          <span className="fw-bold ms-1" style={{ fontSize: '16px' }}> {t('about.breadcrumb.about')}</span>
          </button>
        </div>

        <h1 className="text-center mb-4" style={{ fontSize: '2.8rem', fontWeight: '700', color: '#343a40' }}>
        {t('about.title')}
        </h1>
        <p className="text-center text-muted mb-5" style={{ fontSize: '1.1rem' }}>
        {t('about.subtitle')}
        </p>

        {/* Who We Are Section */}
        <div className="row mb-5">
          <div className="col-lg-6">
          <h2 className="display-6 fw-bold text-dark mb-4">{t('about.sections.whoWeAre.title')}</h2>
          {whoWeAreParagraphs.map((paragraph, index) => (
            <p key={index} className="text-muted mb-4" style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
              {paragraph}
            </p>
          ))}
          <p className="text-muted fw-bold">{t('about.sections.whoWeAre.founder')}</p>
          </div>
          <div className="col-lg-6">
            <div className="text-center">
              <img
                src="/images/about-us.jpg"
              alt={t('about.sections.whoWeAre.imageAlt')}
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
                  background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
                }}
              >
                <div className="text-center">
                  <i className="fas fa-book-open fa-4x mb-3" style={{ color: '#343a40' }}></i>
                  <h4 className="fw-bold" style={{ color: '#212529' }}>{fallback.title}</h4>
                  <p className="mb-0" style={{ color: '#495057' }}>{fallback.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Our Mission Section */}
        <div className="row mb-5">
          <div className="col-12 text-center">
          <h2 className="display-6 fw-bold text-dark mb-4">{t('about.sections.mission.title')}</h2>
            <div className="row justify-content-center">
              <div className="col-lg-8">
              {missionParagraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className={`text-muted ${index === missionParagraphs.length - 1 ? 'mb-5' : 'mb-4'}`}
                  style={{ fontSize: '1.1rem', lineHeight: '1.6' }}
                >
                  {paragraph}
                </p>
              ))}
              </div>
            </div>
            
            {/* Stats */}
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <div className="row text-center">
                {missionStats.map((stat, index) => (
                  <div key={index} className="col-4">
                    <div className={`display-4 fw-bold ${index === 0 ? 'text-primary' : index === 1 ? 'text-success' : 'text-warning'} mb-2`}>
                      {stat.value}
                    </div>
                    <div className="text-muted">{stat.label}</div>
                  </div>
                ))}
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
                  <h3 className="fw-bold text-dark mb-3">{testimonial.title}</h3>
                  <p className="text-muted mb-4" style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
                    {testimonial.quote}
                  </p>
                  <div className="d-flex align-items-center justify-content-center">
                    <img
                      src="/images/customer-avatar.jpg"
                      alt={testimonial.author}
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
                      <div className="fw-bold text-dark">{testimonial.author}</div>
                      <div className="text-muted small">{testimonial.role}</div>
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
                <h2 className="fw-bold text-dark">{authorsTitle}</h2>
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
                  {authorsCta} <i className="bi bi-arrow-right ms-1"></i>
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
