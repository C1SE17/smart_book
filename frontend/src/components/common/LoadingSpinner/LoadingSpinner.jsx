import React from 'react';

const LoadingSpinner = ({ size = 'sm', text = 'Loading...' }) => {
    const sizeClass = size === 'lg' ? 'spinner-border-lg' : 'spinner-border-sm';

    return (
        <div className="d-flex align-items-center justify-content-center">
            <div className={`spinner-border ${sizeClass} text-primary me-2`} role="status">
                <span className="visually-hidden">{text}</span>
            </div>
            <span className="text-muted">{text}</span>
        </div>
    );
};

export default LoadingSpinner;
