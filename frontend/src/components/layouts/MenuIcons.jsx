import React, { memo } from 'react';
import { Link } from 'react-router-dom';

const MenuIcons = memo(() => {
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
