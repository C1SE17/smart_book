/**
 * Recommendation API Service - lấy sản phẩm đề xuất và theo dõi cập nhật realtime
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

function getUserInfo() {
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    return JSON.parse(userStr);
  } catch (e) {
    return null;
  }
}

class RecommendationApiService extends BaseApiService {
  async getRecommendedProducts({ limit = 8 } = {}) {
    const sessionId = getOrCreateSessionId();
    const user = getUserInfo();
    const userId = user?.user_id || null;
    
    // Gửi cả sessionId và userId để backend có thể personalize recommendations
    const params = new URLSearchParams({ 
      sessionId, 
      limit: String(limit) 
    });
    
    if (userId) {
      params.append('userId', String(userId));
    }
    
    const qs = params.toString();
    return this.apiCall(`/recommendations/products?${qs}`);
  }

  // Subscribe via SSE; returns an unsubscribe function
  subscribeUpdates({ onMessage, onError } = {}) {
    const sessionId = getOrCreateSessionId();
    const url = `${this.baseURL}/recommendations/stream?sessionId=${encodeURIComponent(sessionId)}`;
    const es = new EventSource(url);
    if (onMessage) es.onmessage = (evt) => {
      try { onMessage(JSON.parse(evt.data)); } catch (_) {}
    };
    if (onError) es.onerror = (err) => onError(err);
    return () => { try { es.close(); } catch (_) {} };
  }
}

export default new RecommendationApiService();


