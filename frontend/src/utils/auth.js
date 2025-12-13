// Authentication utilities

// Get token from localStorage
export const getToken = () => {
  return localStorage.getItem('userToken');
};

// Set token to localStorage
export const setToken = (token) => {
  localStorage.setItem('userToken', token);
};

// Remove token from localStorage
export const removeToken = () => {
  localStorage.removeItem('userToken');
  localStorage.removeItem('token'); // Xóa cả token key
  localStorage.removeItem('userEmail');
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = getToken();
  return !!token;
};

// Get user info from token (basic implementation)
export const getUserFromToken = (token) => {
  try {
    // In a real app, you might want to decode the JWT token
    // For now, we'll just return basic info
    return {
      isLoggedIn: !!token,
      token: token
    };
  } catch (error) {
    console.error('Error parsing token:', error);
    return null;
  }
};

// API request with authentication
export const authenticatedRequest = async (url, options = {}) => {
  const token = getToken();
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers
    }
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid, remove it
        removeToken();
        throw new Error('Authentication failed');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Authenticated request failed:', error);
    throw error;
  }
};
