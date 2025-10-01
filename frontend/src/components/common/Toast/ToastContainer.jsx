import React, { useState, useCallback } from 'react';
import Toast from './Toast';

const ToastContainer = () => {
    const [toasts, setToasts] = useState([]);

    // Hàm thêm toast mới
    const addToast = useCallback((message, type = 'success', duration = 3000) => {
        const id = Date.now() + Math.random();
        const newToast = { id, message, type, duration };

        setToasts(prev => [...prev, newToast]);
    }, []);

    // Hàm xóa toast
    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    // Expose addToast globally
    React.useEffect(() => {
        window.showToast = addToast;
        return () => {
            delete window.showToast;
        };
    }, [addToast]);

    return (
        <div style={{ position: 'fixed', top: 0, right: 0, zIndex: 9999 }}>
            {toasts.map((toast, index) => (
                <div
                    key={toast.id}
                    style={{
                        marginBottom: '10px',
                        transform: `translateY(${index * 10}px)`,
                        transition: 'transform 0.3s ease'
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
