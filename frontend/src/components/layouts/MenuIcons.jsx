import React, { memo, useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';

const MenuIcons = memo(() => {
    const [cartItemCount, setCartItemCount] = useState(0);

    // Cập nhật số lượng mục trong giỏ hàng
    const updateCartCount = useCallback(async () => {
        try {
            // Get user from localStorage
            const user = JSON.parse(localStorage.getItem('user') || 'null');
            if (!user) {
                setCartItemCount(0);
                return;
            }

            // Get cart items from localStorage
            const cartKey = `cart_${user.user_id}`;
            const cartItems = JSON.parse(localStorage.getItem(cartKey) || '[]');
            
            // Calculate total quantity of all items
            const totalQuantity = cartItems.reduce((total, item) => total + (item.quantity || 0), 0);
            setCartItemCount(totalQuantity);
        } catch (error) {
            console.error('Error fetching cart count:', error);
            setCartItemCount(0);
        }
    }, []);

    // Lắng nghe cập nhật giỏ hàng
    useEffect(() => {
        updateCartCount();

        const handleCartUpdate = () => {
            updateCartCount();
        };

        // Listen for custom cart update events
        window.addEventListener('cartUpdated', handleCartUpdate);

        return () => {
            window.removeEventListener('cartUpdated', handleCartUpdate);
        };
    }, [updateCartCount]);

    return (
        <ul className="navbar-nav">
            <li className="nav-item me-3">
                <Link
                    className="nav-link position-relative"
                    to="/notification"
                    aria-label="Notifications"
                >
                    <i className="bi bi-bell menu-icon"></i>
                    <span
                        className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger menu-notification-badge"
                        aria-label="New notifications"
                    ></span>
                </Link>
            </li>

            <li className="nav-item me-3">
                <Link
                    className="nav-link"
                    to="/search"
                    aria-label="Search"
                >
                    <i className="bi bi-search menu-icon"></i>
                </Link>
            </li>

            <li className="nav-item me-3">
                <Link
                    className="nav-link position-relative"
                    to="/cart"
                    aria-label="Shopping cart"
                >
                    <i className="bi bi-cart menu-icon"></i>
                    {cartItemCount > 0 && (
                        <span
                            className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                            style={{
                                fontSize: '0.7rem',
                                minWidth: '18px',
                                height: '18px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            {cartItemCount}
                        </span>
                    )}
                </Link>
            </li>

            <li className="nav-item">
                <Link
                    className="nav-link"
                    to="/auth"
                    aria-label="User account"
                >
                    <i className="bi bi-person menu-icon"></i>
                </Link>
            </li>
        </ul>
    );
});

MenuIcons.displayName = 'MenuIcons';

export default MenuIcons;
