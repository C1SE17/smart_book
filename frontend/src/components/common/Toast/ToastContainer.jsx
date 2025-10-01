import React, { useState, useCallback, useEffect } from 'react';
import Toast from './Toast';

const ToastContainer = () => {
    const [toasts, setToasts] = useState([]);

    // Hàm thêm toast mới
    const addToast = useCallback((message, type = 'success', duration = 3000) => {
        const id = Date.now() + Math.random();
        const newToast = { id, message, type, duration };

        setToasts(prev => [...prev, newToast]);

        // Tự động xóa toast sau thời gian duration
        setTimeout(() => {
            setToasts(prev => prev.filter(toast => toast.id !== id));
        }, duration);
    }, []);

    // Hàm xóa toast
    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    // Expose addToast globally
    useEffect(() => {
        window.showToast = addToast;
        return () => {
            delete window.showToast;
        };
    }, [addToast]);

    return (
        <div style={{ 
            position: 'fixed', 
            top: '20px', 
            right: '20px', 
            zIndex: 9999,
            maxWidth: '400px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
        }}>
            {toasts.map((toast, index) => (
                <div
                    key={toast.id}
                    className="toast-fade-in"
                    style={{
                        animationDelay: `${index * 0.15}s`,
                        transform: `translateY(${index * 5}px)`
                    }}
                >
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        duration={toast.duration}
                        onClose={() => removeToast(toast.id)}
                    />
                </div>
            ))}
        </div>
    );
};

export default ToastContainer;
