// App Constants
export const APP_NAME = 'Smart Book';
export const APP_VERSION = '1.0.0';

// API Constants
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard'
};

// Theme
export const THEME = {
  COLORS: {
    PRIMARY: '#000',
    SECONDARY: '#6c757d',
    SUCCESS: '#28a745',
    DANGER: '#dc3545',
    WARNING: '#ffc107',
    INFO: '#17a2b8',
    LIGHT: '#f8f9fa',
    DARK: '#343a40'
  }
};
