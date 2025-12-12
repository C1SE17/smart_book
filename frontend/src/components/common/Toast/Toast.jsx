import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const Toast = ({ message, type = 'success', duration = 3000, onClose }) => {
    const { t, i18n } = useTranslation();
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(() => onClose(), 300); // Delay for animation
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const getToastClass = () => {
        const baseClass = 'toast-notification';
        const typeClass = {
            success: 'toast-success',
            error: 'toast-error',
            warning: 'toast-warning',
            info: 'toast-info'
        };
        return `${baseClass} ${typeClass[type] || typeClass.success}`;
    };

    const getIcon = () => {
        const icons = {
            success: 'bi-check-circle-fill',
            error: 'bi-exclamation-triangle-fill',
            warning: 'bi-exclamation-triangle-fill',
            info: 'bi-info-circle-fill'
        };
        return icons[type] || icons.success;
    };

    if (!isVisible) return null;

    return (
        <div
            className={getToastClass()}
            style={{
                position: 'fixed',
                top: '20px',
                right: '20px',
                zIndex: 9999,
                minWidth: '300px',
                maxWidth: '400px',
                padding: '16px 20px',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transform: isVisible ? 'translateX(0)' : 'translateX(100%)',
                transition: 'transform 0.3s ease-in-out',
                backgroundColor: type === 'success' ? '#d4edda' :
                    type === 'error' ? '#f8d7da' :
                        type === 'warning' ? '#fff3cd' : '#d1ecf1',
                border: `1px solid ${type === 'success' ? '#c3e6cb' :
                    type === 'error' ? '#f5c6cb' :
                        type === 'warning' ? '#ffeaa7' : '#bee5eb'}`,
                color: type === 'success' ? '#155724' :
                    type === 'error' ? '#721c24' :
                        type === 'warning' ? '#856404' : '#0c5460'
            }}
        >
            <i className={`bi ${getIcon()}`} style={{ fontSize: '20px' }}></i>
            <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                    {type === 'success' ? (i18n.language === 'vi' ? 'Thành công!' : 'Success') :
                        type === 'error' ? (i18n.language === 'vi' ? 'Lỗi!' : 'Error') :
                            type === 'warning' ? (i18n.language === 'vi' ? 'Cảnh báo!' : 'Warning') : 
                                (i18n.language === 'vi' ? 'Thông báo!' : 'Info')}
                </div>
                <div style={{ fontSize: '14px' }}>{message}</div>
            </div>
            <button
                onClick={() => {
                    setIsVisible(false);
                    setTimeout(() => onClose(), 300);
                }}
                style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '18px',
                    cursor: 'pointer',
                    padding: '0',
                    color: 'inherit',
                    opacity: '0.7'
                }}
            >
                <i className="bi bi-x"></i>
            </button>
        </div>
    );
};

export default Toast;
