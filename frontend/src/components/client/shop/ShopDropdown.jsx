import React, { useState } from 'react';

const ShopDropdown = ({ onNavigateTo }) => {
  const [isOpen, setIsOpen] = useState(false);

  const productTypes = [
    'Simple Product',
    'Variable Product', 
    'External Product',
    'Grouped Product',
    'On sale Product',
    'Out of stock'
  ];

  const shopPages = [
    'Shop',
    'Cart', 
    'Checkout',
    'My account'
  ];

  const handleItemClick = (item) => {
    setIsOpen(false);
    if (item === 'Shop') {
      onNavigateTo('books')();
    } else if (item === 'Cart') {
      onNavigateTo('cart')();
    } else if (item === 'My account') {
      onNavigateTo('profile')();
    }
  };

  return (
    <div 
      className="position-relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button 
        className="btn btn-link text-decoration-none text-dark fw-normal p-0"
        style={{ fontSize: '16px' }}
      >
        Shop <i className="bi bi-chevron-down ms-1"></i>
      </button>
      
      {isOpen && (
        <div 
          className="position-absolute bg-white shadow-lg rounded"
          style={{
            top: '100%',
            left: '0',
            minWidth: '300px',
            zIndex: 1000,
            border: '1px solid #e9ecef'
          }}
        >
          <div className="row g-0">
            {/* Product Types Column */}
            <div className="col-6 p-3">
              <h6 className="fw-bold text-dark mb-3">Product Types</h6>
              <ul className="list-unstyled mb-0">
                {productTypes.map((type, index) => (
                  <li key={index} className="mb-2">
                    <button 
                      className="btn btn-link text-decoration-none text-dark p-0 text-start"
                      style={{ fontSize: '14px' }}
                      onClick={() => handleItemClick(type)}
                    >
                      {type}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Shop Pages Column */}
            <div className="col-6 p-3">
              <h6 className="fw-bold text-dark mb-3">Shop Pages</h6>
              <ul className="list-unstyled mb-0">
                {shopPages.map((page, index) => (
                  <li key={index} className="mb-2">
                    <button 
                      className="btn btn-link text-decoration-none text-dark p-0 text-start"
                      style={{ fontSize: '14px' }}
                      onClick={() => handleItemClick(page)}
                    >
                      {page}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopDropdown;
