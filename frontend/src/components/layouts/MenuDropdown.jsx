import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { LoadingSpinner } from '../common/LoadingSpinner';

const MenuDropdown = memo(({
    showShopDropdown,
    categories,
    categoriesLoading,
    handleCategoryClick
}) => {
    if (!showShopDropdown) return null;

    if (categoriesLoading) {
        return (
            <div className="dropdown-menu show menu-dropdown">
                <div className="d-flex justify-content-center p-4">
                    <LoadingSpinner size="sm" text="Loading categories..." />
                </div>
            </div>
        );
    }

    return (
        <div className="custom-dropdown-menu">
            <div className="dropdown-content">
                {/* Books Column */}
                <div className="dropdown-column">
                    <h6 className="column-title">Sách</h6>
                    <div className="column-items">
                        <Link to="/products" className="dropdown-link">
                            Tất cả sách
                        </Link>
                        <span
                            onClick={() => handleCategoryClick(1, "Fiction")}
                            className="dropdown-link clickable"
                        >
                            Tiểu thuyết
                        </span>
                        <span
                            onClick={() => handleCategoryClick(2, "Non-Fiction")}
                            className="dropdown-link clickable"
                        >
                            Phi hư cấu
                        </span>
                        <span
                            onClick={() => handleCategoryClick(3, "Manga")}
                            className="dropdown-link clickable"
                        >
                            Manga
                        </span>
                    </div>
                </div>

                {/* Politics & Life Column */}
                <div className="dropdown-column">
                    <h6 className="column-title">Chính trị & Cuộc sống</h6>
                    <div className="column-items">
                        <Link to="/category/politics" className="dropdown-link">
                            Chính trị
                        </Link>
                        <Link to="/category/economics" className="dropdown-link">
                            Kinh tế
                        </Link>
                        <Link to="/category/self-help" className="dropdown-link">
                            Tự phát triển
                        </Link>
                    </div>
                </div>

                {/* Toys & Others Column */}
                <div className="dropdown-column">
                    <h6 className="column-title">Đồ chơi & Khác</h6>
                    <div className="column-items">
                        <Link to="/category/toys" className="dropdown-link">
                            Đồ chơi
                        </Link>
                        <Link to="/category/games" className="dropdown-link">
                            Trò chơi
                        </Link>
                        <Link to="/category/stationery" className="dropdown-link">
                            Văn phòng phẩm
                        </Link>
                    </div>
                </div>

                {/* Shop Pages Column */}
                <div className="dropdown-column">
                    <h6 className="column-title">Trang cửa hàng</h6>
                    <div className="column-items">
                        <Link to="/bestsellers" className="dropdown-link">
                            Bán chạy nhất
                        </Link>
                        <Link to="/new-arrivals" className="dropdown-link">
                            Hàng mới về
                        </Link>
                        <Link to="/sale" className="dropdown-link">
                            Khuyến mãi
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
});

MenuDropdown.displayName = 'MenuDropdown';

export default MenuDropdown;
