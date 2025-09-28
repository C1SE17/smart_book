import React from 'react';
import { NotificationDropdown } from '../common';

const TopBar = ({ onViewAllNotifications }) => {
  return (
    <div className="bg-light py-2">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-6">
            <span className="text-muted">Home</span>
          </div>
          <div className="col-6 text-end">
            <div className="d-flex align-items-center justify-content-end gap-3">
              {/* Search Icon */}
              <i className="bi bi-search fs-5 text-dark" style={{ cursor: 'pointer' }}></i>
              
              {/* Notification Dropdown */}
              <NotificationDropdown onViewAllNotifications={onViewAllNotifications} />
              
              {/* Cart Icon */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
