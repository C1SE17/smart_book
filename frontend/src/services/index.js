// API Services

// Base API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Auth Services
export const authService = {
  login: (credentials) => apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  }),
  
  register: (userData) => apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData)
  }),
  
  logout: () => apiRequest('/auth/logout', {
    method: 'POST'
  })
};

// Book Services
export const bookService = {
  getAll: () => apiRequest('/books'),
  getById: (id) => apiRequest(`/books/${id}`),
  create: (bookData) => apiRequest('/books', {
    method: 'POST',
    body: JSON.stringify(bookData)
  }),
  update: (id, bookData) => apiRequest(`/books/${id}`, {
    method: 'PUT',
    body: JSON.stringify(bookData)
  }),
  delete: (id) => apiRequest(`/books/${id}`, {
    method: 'DELETE'
  })
};
