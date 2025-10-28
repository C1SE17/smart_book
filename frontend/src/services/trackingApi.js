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

class TrackingApiService extends BaseApiService {
  async trackSearch(keyword) {
    const sessionId = getOrCreateSessionId();
    return this.apiCall('/tracking/search', {
      method: 'POST',
      body: JSON.stringify({ keyword, sessionId })
    });
  }

  async trackProductView({ productId, productName, viewDuration }) {
    const sessionId = getOrCreateSessionId();
    return this.apiCall('/tracking/product-view', {
      method: 'POST',
      body: JSON.stringify({ productId: String(productId), productName, viewDuration, sessionId })
    });
  }

  async trackCartAction({ productId, productName, action, quantity }) {
    const sessionId = getOrCreateSessionId();
    return this.apiCall('/tracking/cart', {
      method: 'POST',
      body: JSON.stringify({ productId: String(productId), productName, action, quantity, sessionId })
    });
  }
}

export default new TrackingApiService();


