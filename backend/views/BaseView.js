/**
 * BaseView - Lớp cơ sở cho tất cả các View trong MVC pattern
 * Chịu trách nhiệm format dữ liệu trước khi trả về cho client
 */
class BaseView {
  /**
   * Format response thành công
   * @param {*} data - Dữ liệu cần trả về
   * @param {string} message - Thông báo (tùy chọn)
   * @param {object} meta - Metadata bổ sung (pagination, etc.)
   * @returns {object} Response object
   */
  static success(data, message = null, meta = {}) {
    const response = {
      success: true,
      data
    };

    if (message) {
      response.message = message;
    }

    if (Object.keys(meta).length > 0) {
      Object.assign(response, meta);
    }

    return response;
  }

  /**
   * Format response lỗi
   * @param {string} message - Thông báo lỗi
   * @param {number} statusCode - HTTP status code (mặc định 500)
   * @param {*} error - Chi tiết lỗi (tùy chọn)
   * @returns {object} Error response object
   */
  static error(message, statusCode = 500, error = null) {
    const response = {
      success: false,
      message
    };

    if (error) {
      response.error = error;
    }

    return { response, statusCode };
  }

  /**
   * Format response không tìm thấy
   * @param {string} resource - Tên resource (ví dụ: "Sách", "Tác giả")
   * @returns {object} Not found response object
   */
  static notFound(resource = 'Resource') {
    return {
      response: {
        success: false,
        message: `${resource} không tồn tại`
      },
      statusCode: 404
    };
  }

  /**
   * Format response validation error
   * @param {string} message - Thông báo lỗi validation
   * @param {object} errors - Chi tiết các lỗi validation
   * @returns {object} Validation error response object
   */
  static validationError(message, errors = {}) {
    return {
      response: {
        success: false,
        message,
        errors
      },
      statusCode: 400
    };
  }

  /**
   * Format response với pagination
   * @param {Array} data - Mảng dữ liệu
   * @param {object} pagination - Thông tin pagination
   * @param {string} message - Thông báo (tùy chọn)
   * @returns {object} Response object với pagination
   */
  static paginated(data, pagination, message = null) {
    return this.success(data, message, { pagination });
  }
}

module.exports = BaseView;

