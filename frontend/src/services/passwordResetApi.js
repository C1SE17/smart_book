import BaseApiService from './baseApi.js';

class PasswordResetApiService extends BaseApiService {
  async sendResetEmail(email) {
    const result = await this.apiCall('/users/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });

    console.log('[PasswordResetApi] sendResetEmail result:', result);
    console.log('[PasswordResetApi] debugCode:', result?.debugCode);

    if (!result?.success) {
      throw new Error(result?.message || 'Gửi email đặt lại mật khẩu thất bại.');
    }

    return result;
  }

  async verifyResetCode(email, code) {
    const result = await this.apiCall('/users/verify-reset-code', {
      method: 'POST',
      body: JSON.stringify({ email, code }),
    });

    if (!result?.success) {
      throw new Error(result?.message || 'Mã xác thực không hợp lệ.');
    }

    return result;
  }

  async resetPassword(email, newPassword, resetToken) {
    const result = await this.apiCall('/users/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, newPassword, resetToken }),
    });

    if (!result?.success) {
      throw new Error(result?.message || 'Đặt lại mật khẩu thất bại.');
    }

    return result;
  }
}

const passwordResetApi = new PasswordResetApiService();

export { passwordResetApi };
export default passwordResetApi;
