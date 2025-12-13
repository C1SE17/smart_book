import React from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';

const Contact = ({ onBackToHome, onNavigateTo }) => {
  const { t } = useLanguage();
  const contactInfo = t('contact.info.items', { returnObjects: true }) || [];

  return (
    <div className="min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
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
          {t('contact.breadcrumb.home')}/
          <span className="fw-bold ms-1" style={{ fontSize: '16px' }}> {t('contact.breadcrumb.contact')}</span>
          </button>
        </div>

        {/* Header Section */}
        <div className="row mb-5">
          <div className="col-12 text-center">
            <h1 className="display-4 fw-bold text-dark mb-3" style={{ 
              background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
            }}>
            {t('contact.header.title')}
            </h1>
            <p className="lead text-muted mb-0">
            {t('contact.header.subtitle')}
            </p>
          </div>
        </div>

        <div className="row justify-content-center">
          {/* Contact Information */}
          <div className="col-lg-8">
            <div className="card shadow-lg border-0" style={{ borderRadius: '20px' }}>
              <div className="card-header bg-white border-0 py-4">
                <h3 className="card-title mb-0 fw-bold text-center">
                  <i className="fas fa-info-circle me-2 text-primary"></i>
                {t('contact.info.title')}
                </h3>
              </div>
              <div className="card-body p-5">
                <div className="row g-4">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="col-12">
                      <div className="d-flex">
                        <div className={`me-3 ${info.color}`} style={{ fontSize: '1.5rem', marginTop: '0.25rem' }}>
                          <i className={`${info.icon}`}></i>
                        </div>
                        <div className="flex-grow-1">
                          <h5 className="fw-bold mb-2">{info.title}</h5>
                          <p className="text-muted mb-0" style={{ whiteSpace: 'pre-line', fontSize: '1.1rem' }}>
                            {info.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Social Media Links */}
                <div className="mt-5 pt-4 border-top">
                <h5 className="fw-bold mb-4 text-center">{t('contact.follow.title')}</h5>
                  <div className="d-flex justify-content-center gap-3">
                    <a
                      href="#"
                      className="btn btn-outline-primary btn-lg"
                      style={{ borderRadius: '50px', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <i className="fab fa-facebook-f"></i>
                    </a>
                    <a
                      href="#"
                      className="btn btn-outline-info btn-lg"
                      style={{ borderRadius: '50px', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <i className="fab fa-twitter"></i>
                    </a>
                    <a
                      href="#"
                      className="btn btn-outline-danger btn-lg"
                      style={{ borderRadius: '50px', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <i className="fab fa-youtube"></i>
                    </a>
                    <a
                      href="#"
                      className="btn btn-outline-success btn-lg"
                      style={{ borderRadius: '50px', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <i className="fab fa-instagram"></i>
                    </a>
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

export default Contact;