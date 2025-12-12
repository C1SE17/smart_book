import BaseApiService from './baseApi.js';

class AnalyticsApiService extends BaseApiService {
  async getDashboard(range = 'month') {
    const params = new URLSearchParams();
    if (range) {
      params.append('range', range);
    }

    const endpoint = `/ai-analytics${params.toString() ? `?${params.toString()}` : ''}`;
    return this.apiCall(endpoint);
  }

  async createLog({ actionType, context = {}, note = '' }) {
    return this.apiCall('/ai-analytics/logs', {
      method: 'POST',
      body: JSON.stringify({ actionType, context, note })
    });
  }

  async getLogs(limit = 20) {
    const params = new URLSearchParams();
    if (limit) {
      params.append('limit', limit);
    }
    return this.apiCall(`/ai-analytics/logs?${params.toString()}`);
  }
}

export default new AnalyticsApiService();

