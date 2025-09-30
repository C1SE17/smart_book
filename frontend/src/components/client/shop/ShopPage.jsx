import React, { useState } from 'react';
import FilterSidebar from './FilterSidebar';
import ProductGrid from './ProductGrid';

const ShopPage = ({ onNavigateTo }) => {
  const [filters, setFilters] = useState({
    authors: [],
    priceRange: { min: 0, max: 400 },
    rating: 1
  });

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <div className="container-fluid py-4">
      <div className="container">
        <div className="row">
          {/* Filter Sidebar */}
          <FilterSidebar onFilterChange={handleFilterChange} />
          
          {/* Product Grid */}
          <ProductGrid onNavigateTo={onNavigateTo} />
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
