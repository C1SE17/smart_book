/**
 * Tracking API Service - gửi sự kiện FE lên BE
 */

import BaseApiService from './baseApi.js';

function getOrCreateSessionId() {
  try {
    let sid = localStorage.getItem('sessionId');
    if (!sid) {
      sid = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
      localStorage.setItem('sessionId', sid);
    }
    return sid;
  } catch (e) {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }
}

// Lấy user info từ localStorage
function getUserInfo() {
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    return JSON.parse(userStr);
  } catch (e) {
    return null;
  }
}

class TrackingApiService extends BaseApiService {
  async trackSearch(keyword) {
    const user = getUserInfo();
    // Không track cho admin
    if (user && user.role === 'admin') {
      console.log('[Tracking] Skip tracking for admin user');
      return { success: true, message: 'Admin tracking skipped' };
    }
    
    const sessionId = getOrCreateSessionId();
    const userId = user?.user_id || null;
    
    return this.apiCall('/tracking/search', {
      method: 'POST',
      body: JSON.stringify({ keyword, sessionId, userId })
    });
  }

  async trackProductView({ productId, productName, viewDuration }) {
    const user = getUserInfo();
    // Không track cho admin
    if (user && user.role === 'admin') {
      console.log('[Tracking] Skip tracking for admin user');
      return { success: true, message: 'Admin tracking skipped' };
    }
    
    const sessionId = getOrCreateSessionId();
    const userId = user?.user_id || null;
    
    return this.apiCall('/tracking/product-view', {
      method: 'POST',
      body: JSON.stringify({ 
        productId: String(productId), 
        productName, 
        viewDuration, 
        sessionId,
        userId 
      })
    });
  }

  async trackCartAction({ productId, productName, action, quantity }) {
    const user = getUserInfo();
    // Không track cho admin
    if (user && user.role === 'admin') {
      console.log('[Tracking] Skip tracking for admin user');
      return { success: true, message: 'Admin tracking skipped' };
    }
    
    const sessionId = getOrCreateSessionId();
    const userId = user?.user_id || null;
    
    return this.apiCall('/tracking/cart', {
      method: 'POST',
      body: JSON.stringify({ 
        productId: String(productId), 
        productName, 
        action, 
        quantity, 
        sessionId,
        userId 
      })
    });
  }
}

export default new TrackingApiService();


