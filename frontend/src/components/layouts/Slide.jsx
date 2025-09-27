import React from 'react';

const Hero = () => {
  return (
    <section className="py-5" style={{backgroundColor: '#ffc0cb'}}>
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <h1 className="display-4 fw-bold text-dark mb-4">
              Top 10 most favorite books
            </h1>
            <button 
              className="btn btn-dark btn-lg d-flex align-items-center"
              style={{
                transition: 'all 0.3s ease'
              }}
            >
              Learn More
              <i className="bi bi-arrow-right ms-2"></i>
            </button>
          </div>
          <div className="col-lg-6">
            <div className="text-center">
              <img 
                src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&h=400&fit=crop" 
                alt="Top 10 Favorite Books"
                className="img-fluid rounded shadow"
                style={{maxHeight: '400px', objectFit: 'contain', backgroundColor: '#f8f9fa'}}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;