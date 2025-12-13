import BaseApiService from './baseApi';

class TranslationApi extends BaseApiService {
  async translate(payload) {
    return this.apiCall('/translation', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }
}

const translationApi = new TranslationApi();

export default translationApi;


