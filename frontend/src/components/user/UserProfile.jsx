import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { validateEmail } from '../../utils';
import { userService } from '../../services';

const UserProfile = ({ user, onBackToHome, onUpdateProfile, activeTab: propActiveTab, onTabChange }) => {
  const [activeTab, setActiveTab] = useState(propActiveTab || 'profile');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    role: 'customer'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [userProfile, setUserProfile] = useState(null);

  // Mock data for demo mode
  const displayUser = user || {
    id: 1,
    name: 'Nguyễn Văn A',
    email: 'demo@example.com',
    phone: '0123456789',
    address: '123 Đường ABC, Quận 1, TP.HCM',
    role: 'customer',
    token: 'mock_token'
  };

  // Tabs configuration
  const tabs = useMemo(() => [
    { id: 'profile', label: 'Hồ sơ' },
    { id: 'orders', label: 'Đơn hàng' },
    { id: 'settings', label: 'Cài đặt' },
    { id: 'security', label: 'Bảo mật' }
  ], []);

  // Khởi tạo dữ liệu form khi user thay đổi
  useEffect(() => {
      const newFormData = {
        name: displayUser.name || '',
        email: displayUser.email || '',
        phone: displayUser.phone || '',
        address: displayUser.address || '',
        role: displayUser.role || 'customer'
      };
      setFormData(newFormData);
      setUserProfile(displayUser);
  }, [displayUser]);

  // Fetch user profile from backend
  const fetchUserProfile = useCallback(async () => {
    if (!user?.token) {
      setUserProfile(displayUser);
      return;
    }
    
    try {
      setLoading(true);
      // For now, we'll use a placeholder userId since we don't have it in the token
      // In a real app, you would decode the JWT token to get the userId
      const profileData = await userService.getProfile(1, user.token);
      setUserProfile(profileData);
      setFormData({
        name: profileData.name || '',
        email: profileData.email || '',
        phone: profileData.phone || '',
        address: profileData.address || '',
        role: profileData.role || 'customer'
      });
    } catch (error) {
      console.error('Lỗi lấy thông tin profile:', error);
      setUserProfile(displayUser);
    } finally {
      setLoading(false);
    }
  }, [user, displayUser]);

  // Load profile data on mount
  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  // Sync activeTab with parent prop
  useEffect(() => {
    if (propActiveTab && propActiveTab !== activeTab) {
      setActiveTab(propActiveTab);
    }
  }, [propActiveTab, activeTab]);

  // Handle URL changes for profile tabs
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      if (path === '/profile' || path === '/profile/') {
        setActiveTab('profile');
      } else if (path === '/profile/orders') {
        setActiveTab('orders');
      } else if (path === '/profile/settings') {
        setActiveTab('settings');
      } else if (path === '/profile/security') {
        setActiveTab('security');
      }
    };

    // Initial check
    handlePopState();

    // Listen for URL changes
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Xóa lỗi khi user bắt đầu gõ
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  }, [errors]);

  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Tên là bắt buộc';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Tên phải có ít nhất 2 ký tự';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Vui lòng nhập email hợp lệ';
    }

    if (formData.phone && formData.phone.length < 10) {
      newErrors.phone = 'Số điện thoại phải có ít nhất 10 chữ số';
    }

    if (formData.address && formData.address.trim().length < 10) {
      newErrors.address = 'Địa chỉ phải có ít nhất 10 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    if (!user?.token) {
      setSuccessMessage('Đây là chế độ demo. Vui lòng đăng nhập để cập nhật thông tin thực.');
      setIsEditing(false);
      setTimeout(() => setSuccessMessage(''), 3000);
      return;
    }

    setLoading(true);
    
    try {
      const updatedProfile = await userService.updateProfile(formData, user.token);
      setUserProfile(updatedProfile);
      
      if (onUpdateProfile) {
        onUpdateProfile(updatedProfile);
      }
      
      setSuccessMessage('Cập nhật thông tin thành công!');
      setIsEditing(false);
      setTimeout(() => setSuccessMessage(''), 3000);
      
    } catch (error) {
      console.error('Lỗi cập nhật:', error);
      setErrors({ general: 'Cập nhật thông tin thất bại. Vui lòng thử lại.' });
    } finally {
      setLoading(false);
    }
  }, [formData, validateForm, user?.token, onUpdateProfile]);

  const handleCancel = useCallback(() => {
    setFormData({
      name: userProfile?.name || '',
      email: userProfile?.email || '',
      phone: userProfile?.phone || '',
      address: userProfile?.address || '',
      role: userProfile?.role || 'customer'
    });
    setErrors({});
    setIsEditing(false);
  }, [userProfile]);

  const handleTabChange = useCallback((tabId) => {
    setActiveTab(tabId);
    if (onTabChange) {
      onTabChange(tabId);
    }
    
    const tabRoutes = {
      'profile': '/profile',
      'orders': '/profile/orders',
      'settings': '/profile/settings',
      'security': '/profile/security'
    };
    
    const newPath = tabRoutes[tabId] || '/profile';
    window.history.pushState({}, '', newPath);
  }, [onTabChange]);

  const currentUser = userProfile || displayUser;
  const currentFormData = formData.name ? formData : {
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    address: currentUser?.address || '',
    role: currentUser?.role || 'customer'
  };

  return (
    <div className="min-vh-100" style={{ backgroundColor: '#f5f5f5', transition: 'all 0.3s ease' }}>
      <div className="container py-4">
        <div style={{ minHeight: '600px', transition: 'all 0.3s ease' }}>
          {!user && (
            <div className="alert alert-info mb-3" role="alert">
              <i className="fas fa-info-circle me-2" style={{ fontSize: '1.2rem', width: '20px', height: '20px' }}></i>
              <strong>Chế độ demo:</strong> Bạn đang xem dữ liệu mẫu. 
              <button 
                className="btn btn-link text-primary p-0 ms-2"
                onClick={() => {
                  window.history.pushState({}, '', '/login');
                  window.dispatchEvent(new PopStateEvent('popstate'));
                }}
                style={{ textDecoration: 'underline' }}
              >
                Đăng nhập
              </button> 
              để cập nhật thông tin thực.
            </div>
          )}

          <div className="mb-3">
            <button
              className="btn btn-link text-dark p-0 no-hover"
              onClick={onBackToHome}
              style={{
                border: 'none',
                background: 'none',
                fontSize: '16px',
                textDecoration: 'none',
                boxShadow: 'none'
              }}
            >
              <i className="fas fa-arrow-left me-1" style={{ fontSize: '1.2rem', width: '20px', height: '20px' }}></i>
              Home/
              <span className="fw-bold" style={{ fontSize: '16px' }}> {tabs.find(tab => tab.id === activeTab)?.label || 'Hồ sơ'}</span>
            </button>
          </div>

          <div className="mb-4">
            <div className="d-flex border-bottom">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`btn btn-link text-decoration-none px-4 py-2 ${activeTab === tab.id ? 'text-primary border-bottom border-primary border-2' : 'text-dark'
                    }`}
                  onClick={() => handleTabChange(tab.id)}
                  style={{
                    border: 'none',
                    background: 'none',
                    borderRadius: '0',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <div style={{ minHeight: '600px' }}>
                {activeTab === 'profile' && (
                  <div className="row g-4">
                    <div className="col-12">
                      <div className="card shadow-sm">
                        <div className="card-body p-4">
                          <div className="d-flex justify-content-between align-items-center mb-4">
                            <h5 className="card-title mb-0">Thông Tin Cá Nhân</h5>
                            {!isEditing && (
                              <button
                                className="btn btn-outline-primary"
                                onClick={() => setIsEditing(true)}
                              >
                                <i className="fas fa-edit me-2" style={{ fontSize: '1.2rem', width: '20px', height: '20px' }}></i>
                                Chỉnh Sửa
                              </button>
                            )}
                          </div>

                          {successMessage && (
                            <div className="alert alert-success alert-dismissible fade show" role="alert">
                              <i className="fas fa-check-circle me-2" style={{ fontSize: '1.2rem', width: '20px', height: '20px' }}></i>
                              {successMessage}
                              <button
                                type="button"
                                className="btn-close"
                                onClick={() => setSuccessMessage('')}
                              ></button>
                            </div>
                          )}

                          {errors.general && (
                            <div className="alert alert-danger alert-dismissible fade show" role="alert">
                              <i className="fas fa-exclamation-circle me-2" style={{ fontSize: '1.2rem', width: '20px', height: '20px' }}></i>
                              {errors.general}
                              <button
                                type="button"
                                className="btn-close"
                                onClick={() => setErrors(prev => ({ ...prev, general: '' }))}
                              ></button>
                            </div>
                          )}

                          <form onSubmit={handleSubmit}>
                            <div className="row g-3">
                              {/* Name Field */}
                              <div className="col-md-6">
                                <label htmlFor="name" className="form-label">
                                  Họ và tên <span className="text-danger">*</span>
                                </label>
                                <input
                                  type="text"
                                  className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                  id="name"
                                  name="name"
                                  value={currentFormData.name}
                                  onChange={handleChange}
                                  disabled={!isEditing}
                                  placeholder="Nhập họ và tên"
                                />
                                {errors.name && (
                                  <div className="invalid-feedback">
                                    {errors.name}
                                  </div>
                                )}
                              </div>

                              {/* Email Field */}
                              <div className="col-md-6">
                                <label htmlFor="email" className="form-label">
                                  Email <span className="text-danger">*</span>
                                </label>
                                <input
                                  type="email"
                                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                  id="email"
                                  name="email"
                                  value={currentFormData.email}
                                  onChange={handleChange}
                                  disabled={!isEditing}
                                  placeholder="Nhập email"
                                />
                                {errors.email && (
                                  <div className="invalid-feedback">
                                    {errors.email}
                                  </div>
                                )}
                              </div>

                              {/* Phone Field */}
                              <div className="col-md-6">
                                <label htmlFor="phone" className="form-label">
                                  Số điện thoại
                                </label>
                                <input
                                  type="tel"
                                  className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                                  id="phone"
                                  name="phone"
                                  value={currentFormData.phone}
                                  onChange={handleChange}
                                  disabled={!isEditing}
                                  placeholder="Nhập số điện thoại"
                                />
                                {errors.phone && (
                                  <div className="invalid-feedback">
                                    {errors.phone}
                                  </div>
                                )}
                              </div>

                              {/* Role Field */}
                              <div className="col-md-6">
                                <label htmlFor="role" className="form-label">
                                  Vai trò
                                </label>
                                <select
                                  className="form-select"
                                  id="role"
                                  name="role"
                                  value={currentFormData.role}
                                  onChange={handleChange}
                                  disabled={!isEditing}
                                >
                                  <option value="customer">Khách hàng</option>
                                  <option value="admin">Quản trị viên</option>
                                </select>
                              </div>

                              {/* Address Field */}
                              <div className="col-12">
                                <label htmlFor="address" className="form-label">
                                  Địa chỉ
                                </label>
                                <textarea
                                  className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                                  id="address"
                                  name="address"
                                  rows="3"
                                  value={currentFormData.address}
                                  onChange={handleChange}
                                  disabled={!isEditing}
                                  placeholder="Nhập địa chỉ đầy đủ"
                                ></textarea>
                                {errors.address && (
                                  <div className="invalid-feedback">
                                    {errors.address}
                                  </div>
                                )}
                              </div>

                              {/* Action Buttons */}
                              {isEditing && (
                                <div className="col-12">
                                  <div className="d-flex gap-2">
                                    <button
                                      type="submit"
                                      className="btn btn-primary"
                                      disabled={loading}
                                    >
                                      {loading ? (
                                        <>
                                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                          Đang lưu...
                                        </>
                                      ) : (
                                        <>
                                          <i className="fas fa-save me-2" style={{ fontSize: '1.2rem', width: '20px', height: '20px' }}></i>
                                          Lưu thay đổi
                                        </>
                                      )}
                                    </button>
                                    <button
                                      type="button"
                                      className="btn btn-outline-secondary"
                                      onClick={handleCancel}
                                      disabled={loading}
                                    >
                                      <i className="fas fa-times me-2" style={{ fontSize: '1.2rem', width: '20px', height: '20px' }}></i>
                                      Hủy
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'orders' && (
                  <div className="row g-4">
                    <div className="col-12">
                      <div className="card shadow-sm">
                        <div className="card-body p-4">
                          <h5 className="card-title mb-4">Đơn Hàng Của Tôi</h5>

                          {/* Order Filter */}
                          <div className="row mb-4">
                            <div className="col-md-6">
                              <select className="form-select">
                                <option value="">Tất cả trạng thái</option>
                                <option value="pending">Chờ xử lý</option>
                                <option value="processing">Đang xử lý</option>
                                <option value="shipped">Đã giao</option>
                                <option value="delivered">Hoàn thành</option>
                                <option value="cancelled">Đã hủy</option>
                              </select>
                            </div>
                            <div className="col-md-6">
                              <div className="input-group">
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Tìm kiếm đơn hàng..."
                                />
                                <button className="btn btn-outline-secondary" type="button">
                                  <i className="fas fa-search" style={{ fontSize: '1.2rem', width: '20px', height: '20px' }}></i>
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Orders List */}
                          <div className="table-responsive">
                            <table className="table table-hover">
                              <thead className="table-light">
                                <tr>
                                  <th>Mã đơn hàng</th>
                                  <th>Ngày đặt</th>
                                  <th>Sản phẩm</th>
                                  <th>Tổng tiền</th>
                                  <th>Trạng thái</th>
                                  <th>Thao tác</th>
                                </tr>
                              </thead>
                              <tbody>
                                {/* Mock Order Data */}
                                <tr>
                                  <td>
                                    <span className="fw-semibold text-primary">#ORD001</span>
                                  </td>
                                  <td>15/12/2024</td>
                                  <td>
                                    <div className="d-flex align-items-center">

                                      <div>
                                        <div className="fw-semibold">Doraemon: Nobita's Little Star Wars</div>
                                        <small className="text-muted">x2</small>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="fw-semibold">240.000 VNĐ</td>
                                  <td>
                                    <span className="badge bg-success">Đã giao</span>
                                  </td>
                                  <td>
                                    <button className="btn btn-sm btn-outline-primary me-1">
                                      <i className="fas fa-eye" style={{ fontSize: '1.2rem', width: '20px', height: '20px' }}></i>
                                    </button>
                                    <button className="btn btn-sm btn-outline-success">
                                      <i className="fas fa-redo" style={{ fontSize: '1.2rem', width: '20px', height: '20px' }}></i>
                                    </button>
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <span className="fw-semibold text-primary">#ORD002</span>
                                  </td>
                                  <td>10/12/2024</td>
                                  <td>
                                    <div className="d-flex align-items-center">

                                      <div>
                                        <div className="fw-semibold">WHERE THE CRAWDADS SING</div>
                                        <small className="text-muted">x1</small>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="fw-semibold">180.000 VNĐ</td>
                                  <td>
                                    <span className="badge bg-warning">Đang xử lý</span>
                                  </td>
                                  <td>
                                    <button className="btn btn-sm btn-outline-primary me-1">
                                      <i className="fas fa-eye" style={{ fontSize: '1.2rem', width: '20px', height: '20px' }}></i>
                                    </button>
                                    <button className="btn btn-sm btn-outline-danger">
                                      <i className="fas fa-times" style={{ fontSize: '1.2rem', width: '20px', height: '20px' }}></i>
                                    </button>
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <span className="fw-semibold text-primary">#ORD003</span>
                                  </td>
                                  <td>05/12/2024</td>
                                  <td>
                                    <div className="d-flex align-items-center">

                                      <div>
                                        <div className="fw-semibold">Demon Slayer - Vô hạn thành</div>
                                        <small className="text-muted">x1</small>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="fw-semibold">150.000 VNĐ</td>
                                  <td>
                                    <span className="badge bg-danger">Đã hủy</span>
                                  </td>
                                  <td>
                                    <button className="btn btn-sm btn-outline-primary me-1">
                                      <i className="fas fa-eye" style={{ fontSize: '1.2rem', width: '20px', height: '20px' }}></i>
                                    </button>
                                    <button className="btn btn-sm btn-outline-primary">
                                      <i className="fas fa-shopping-cart" style={{ fontSize: '1.2rem', width: '20px', height: '20px' }}></i>
                                    </button>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>

                          {/* Pagination */}
                          <div className="d-flex justify-content-between align-items-center mt-4">
                            <div className="text-muted">
                              Hiển thị 1-3 của 3 đơn hàng
                            </div>
                            <nav>
                              <ul className="pagination pagination-sm mb-0">
                                <li className="page-item disabled">
                                  <span className="page-link">Trước</span>
                                </li>
                                <li className="page-item active">
                                  <span className="page-link">1</span>
                                </li>
                                <li className="page-item disabled">
                                  <span className="page-link">Sau</span>
                                </li>
                              </ul>
                            </nav>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'settings' && (
                  <div className="row g-4">
                    <div className="col-12">
                      <div className="card shadow-sm">
                        <div className="card-body p-4">
                          <h5 className="card-title mb-4">Cài Đặt Tài Khoản</h5>

                          {/* Notification Settings */}
                          <div className="mb-4">
                            <h6 className="text-muted mb-3">Thông Báo</h6>
                            <div className="row g-3">
                              <div className="col-12">
                                <div className="form-check form-switch">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="emailNotifications"
                                    defaultChecked
                                  />
                                  <label className="form-check-label" htmlFor="emailNotifications">
                                    Nhận thông báo qua email
                                  </label>
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="form-check form-switch">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="orderUpdates"
                                    defaultChecked
                                  />
                                  <label className="form-check-label" htmlFor="orderUpdates">
                                    Cập nhật đơn hàng
                                  </label>
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="form-check form-switch">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="promotions"
                                  />
                                  <label className="form-check-label" htmlFor="promotions">
                                    Khuyến mãi và ưu đãi
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>

                          <hr className="my-4" />

                          {/* Privacy Settings */}
                          <div className="mb-4">
                            <h6 className="text-muted mb-3">Quyền Riêng Tư</h6>
                            <div className="row g-3">
                              <div className="col-12">
                                <div className="form-check form-switch">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="profileVisibility"
                                    defaultChecked
                                  />
                                  <label className="form-check-label" htmlFor="profileVisibility">
                                    Hiển thị hồ sơ công khai
                                  </label>
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="form-check form-switch">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="dataSharing"
                                  />
                                  <label className="form-check-label" htmlFor="dataSharing">
                                    Chia sẻ dữ liệu để cải thiện dịch vụ
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>

                          <hr className="my-4" />

                          {/* Language & Region */}
                          <div className="mb-4">
                            <h6 className="text-muted mb-3">Ngôn Ngữ & Vùng</h6>
                            <div className="row g-3">
                              <div className="col-md-6">
                                <label htmlFor="language" className="form-label">
                                  Ngôn ngữ
                                </label>
                                <select className="form-select" id="language">
                                  <option value="vi">Tiếng Việt</option>
                                  <option value="en">English</option>
                                </select>
                              </div>
                              <div className="col-md-6">
                                <label htmlFor="timezone" className="form-label">
                                  Múi giờ
                                </label>
                                <select className="form-select" id="timezone">
                                  <option value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh (GMT+7)</option>
                                  <option value="UTC">UTC (GMT+0)</option>
                                </select>
                              </div>
                            </div>
                          </div>

                          <hr className="my-4" />

                          {/* Save Settings Button */}
                          <div className="d-flex justify-content-end">
                            <button className="btn btn-primary">
                              <i className="fas fa-save me-2" style={{ fontSize: '1.2rem', width: '20px', height: '20px' }}></i>
                              Lưu Cài Đặt
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'security' && (
                  <div className="row g-4">
                    <div className="col-12">
                      <div className="card shadow-sm">
                        <div className="card-body p-4">
                          <h5 className="card-title mb-4">Bảo Mật Tài Khoản</h5>

                          {/* Change Password Section */}
                          <div className="mb-4">
                            <h6 className="text-muted mb-3">Đổi Mật Khẩu</h6>
                            <form>
                              <div className="row g-3">
                                <div className="col-md-6">
                                  <label htmlFor="currentPassword" className="form-label">
                                    Mật khẩu hiện tại
                                  </label>
                                  <input
                                    type="password"
                                    className="form-control"
                                    id="currentPassword"
                                    placeholder="Nhập mật khẩu hiện tại"
                                  />
                                </div>
                                <div className="col-md-6">
                                  <label htmlFor="newPassword" className="form-label">
                                    Mật khẩu mới
                                  </label>
                                  <input
                                    type="password"
                                    className="form-control"
                                    id="newPassword"
                                    placeholder="Nhập mật khẩu mới"
                                  />
                                </div>
                                <div className="col-md-6">
                                  <label htmlFor="confirmPassword" className="form-label">
                                    Xác nhận mật khẩu mới
                                  </label>
                                  <input
                                    type="password"
                                    className="form-control"
                                    id="confirmPassword"
                                    placeholder="Nhập lại mật khẩu mới"
                                  />
                                </div>
                                <div className="col-12">
                                  <button type="submit" className="btn btn-primary">
                                    <i className="fas fa-key me-2" style={{ fontSize: '1.2rem', width: '20px', height: '20px' }}></i>
                                    Đổi Mật Khẩu
                                  </button>
                                </div>
                              </div>
                            </form>
                          </div>

                          <hr className="my-4" />

                          {/* Account Security Info */}
                          <div className="mb-4">
                            <h6 className="text-muted mb-3">Thông Tin Bảo Mật</h6>
                            <div className="row g-3">
                              <div className="col-md-6">
                                <div className="d-flex align-items-center">
                                  <i className="fas fa-shield-alt text-success me-3" style={{ fontSize: '1.2rem', width: '20px', height: '20px' }}></i>
                                  <div>
                                    <div className="fw-semibold">Trạng thái tài khoản</div>
                                    <small className="text-muted">Tài khoản đang hoạt động</small>
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="d-flex align-items-center">
                                  <i className="fas fa-clock text-info me-3" style={{ fontSize: '1.2rem', width: '20px', height: '20px' }}></i>
                                  <div>
                                    <div className="fw-semibold">Lần đăng nhập cuối</div>
                                    <small className="text-muted">Hôm nay, 14:30</small>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <hr className="my-4" />

                          {/* Danger Zone */}
                          <div className="mb-4">
                            <h6 className="text-danger mb-3">Vùng Nguy Hiểm</h6>
                            <div className="alert alert-warning" role="alert">
                              <i className="fas fa-exclamation-triangle me-2" style={{ fontSize: '1.2rem', width: '20px', height: '20px' }}></i>
                              <strong>Cảnh báo:</strong> Các hành động dưới đây có thể ảnh hưởng đến tài khoản của bạn.
                            </div>
                            <div className="d-flex gap-2">
                              <button className="btn btn-outline-danger">
                                <i className="fas fa-sign-out-alt me-2" style={{ fontSize: '1.2rem', width: '20px', height: '20px' }}></i>
                                Đăng xuất tất cả thiết bị
                              </button>
                              <button className="btn btn-outline-danger">
                                <i className="fas fa-trash me-2" style={{ fontSize: '1.2rem', width: '20px', height: '20px' }}></i>
                                Xóa tài khoản
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
