import React from 'react';

const FooterClient = () => {
  return (
    <footer className="bg-light py-5 mt-5">
      <div className="container">
        <div className="row">
          {/* Connect Column */}
          <div className="col-lg-2 col-md-4 col-sm-6 mb-4">
            <h5 className="fw-bold text-dark mb-3">Connect</h5>
            <div className="text-dark">
              <p className="mb-2">1000 Nguyen Van A, Thanh Khe, Da Nang, Viet Nam</p>
              <p className="mb-2">smartbook@gmail.com</p>
              <p className="mb-0">12334566676</p>
            </div>
          </div>

          {/* Categories Column */}
          <div className="col-lg-2 col-md-4 col-sm-6 mb-4">
            <h5 className="fw-bold text-dark mb-3">Categories</h5>
            <div className="text-dark">
              <a href="#" className="text-decoration-none text-dark d-block mb-2">Fiction</a>
              <a href="#" className="text-decoration-none text-dark d-block mb-2">Non-Fiction</a>
              <a href="#" className="text-decoration-none text-dark d-block mb-2">Science</a>
              <a href="#" className="text-decoration-none text-dark d-block mb-2">History</a>
              <a href="#" className="text-decoration-none text-dark d-block mb-0">Biography</a>
            </div>
          </div>

          {/* Explore Column */}
          <div className="col-lg-2 col-md-4 col-sm-6 mb-4">
            <h5 className="fw-bold text-dark mb-3">Explore</h5>
            <div className="text-dark">
              <a href="#" className="text-decoration-none text-dark d-block mb-2">About Us</a>
              <a href="#" className="text-decoration-none text-dark d-block mb-2">Our Team</a>
              <a href="#" className="text-decoration-none text-dark d-block mb-2">Careers</a>
              <a href="#" className="text-decoration-none text-dark d-block mb-2">Press</a>
              <a href="#" className="text-decoration-none text-dark d-block mb-0">Blog</a>
            </div>
          </div>

          {/* Account Column */}
          <div className="col-lg-2 col-md-4 col-sm-6 mb-4">
            <h5 className="fw-bold text-dark mb-3">Account</h5>
            <div className="text-dark">
              <a href="#" className="text-decoration-none text-dark d-block mb-2">My Account</a>
              <a href="#" className="text-decoration-none text-dark d-block mb-2">Order History</a>
              <a href="#" className="text-decoration-none text-dark d-block mb-2">Wishlist</a>
              <a href="#" className="text-decoration-none text-dark d-block mb-2">Newsletter</a>
              <a href="#" className="text-decoration-none text-dark d-block mb-0">Support</a>
            </div>
          </div>

          {/* Get in touch Column */}
          <div className="col-lg-2 col-md-4 col-sm-6 mb-4">
            <h5 className="fw-bold text-dark mb-3">Get in touch</h5>
            <div className="text-dark">
              <a href="#" className="text-decoration-none text-dark d-block mb-2">Contact Us</a>
              <a href="#" className="text-decoration-none text-dark d-block mb-2">Help Center</a>
              <a href="#" className="text-decoration-none text-dark d-block mb-2">Feedback</a>
              <a href="#" className="text-decoration-none text-dark d-block mb-2">Partnership</a>
              <a href="#" className="text-decoration-none text-dark d-block mb-0">Advertise</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterClient;
