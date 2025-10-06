import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { validateEmail } from '../../utils';
import { userService } from '../../services';
import ListOrders from '../client/orders/ListOrders';
import ErrorBoundary from '../common/ErrorBoundary/ErrorBoundary';

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

  // State cho form đổi mật khẩu
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordLoading, setPasswordLoading] = useState(false);

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
    // Ưu tiên role từ localStorage user object
    const userRole = user?.role || displayUser.role || 'customer';

    const newFormData = {
      name: displayUser.name || '',
      email: displayUser.email || '',
      phone: displayUser.phone || '',
      address: displayUser.address || '',
      role: userRole
    };

    console.log('Initializing form data with role:', userRole);
    console.log('User object role:', user?.role);
    console.log('DisplayUser role:', displayUser.role);

    setFormData(newFormData);
    setUserProfile(displayUser);
  }, [displayUser, user]);

  // Fetch user profile from backend
  const fetchUserProfile = useCallback(async () => {
    if (!user?.token) {
      setUserProfile(displayUser);
      return;
    }

    // Tạm thời tắt gọi backend để tránh role bị override
    // Sử dụng trực tiếp dữ liệu từ localStorage
    console.log('Using localStorage data directly (backend disabled for role fix)');
    console.log('User from localStorage:', user);
    console.log('User role from localStorage:', user?.role);

    setUserProfile(user);
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || '',
      role: user.role || 'customer'
    });

    console.log('Form data set with role:', user.role || 'customer');

    setLoading(false);

    // Code gọi backend (đã tắt)
    /*
    try {
      setLoading(true);
      const profileData = await userService.getProfile(1, user.token);
      
      const finalProfileData = {
        ...profileData,
        role: user.role || profileData.role || 'customer'
      };
      
      setUserProfile(finalProfileData);
      setFormData({
        name: finalProfileData.name || '',
        email: finalProfileData.email || '',
        phone: finalProfileData.phone || '',
        address: finalProfileData.address || '',
        role: finalProfileData.role || 'customer'
      });
    } catch (error) {
      console.error('Lỗi lấy thông tin profile:', error);
      setUserProfile(user);
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        role: user.role || 'customer'
      });
    } finally {
      setLoading(false);
    }
    */
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
      // TODO: Implement real user API
      // const { userApi } = await import('../../services/userApi');
      // const updatedProfile = await userApi.updateUser(user.user_id, formData, user);

      // Mock response for now
      const updatedProfile = { ...formData };

      // Cập nhật user trong localStorage
      const updatedUser = {
        ...user,
        ...updatedProfile
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      setUserProfile(updatedProfile);

      if (onUpdateProfile) {
        onUpdateProfile(updatedUser);
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

  // Xử lý đăng xuất tất cả thiết bị
  const handleLogoutAllDevices = useCallback(async () => {
    if (window.confirm('Bạn có chắc chắn muốn đăng xuất tất cả thiết bị? Bạn sẽ cần đăng nhập lại trên thiết bị này.')) {
      try {
        // TODO: Implement real logout API
        // const { userApi } = await import('../../services/userApi');
        // const result = await userApi.logoutAllDevices(user.user_id);

        // Mock response for now
        const result = { success: true };

        if (result.success) {
          // Xóa tất cả dữ liệu user khỏi localStorage
          localStorage.removeItem('user');
          localStorage.removeItem('userToken');
          localStorage.removeItem('userEmail');

          // Dispatch event để App.jsx biết user đã đăng xuất
          window.dispatchEvent(new CustomEvent('userLoggedOut'));

          if (window.showToast) {
            window.showToast('Đã đăng xuất tất cả thiết bị! Vui lòng đăng nhập lại.', 'success');
          } else {
            alert('Đã đăng xuất tất cả thiết bị! Vui lòng đăng nhập lại.');
          }

          // Redirect về trang chủ sau 2 giây
          setTimeout(() => {
            if (onBackToHome) {
              onBackToHome();
            } else {
              window.location.href = '/';
            }
          }, 2000);

        } else {
          if (window.showToast) {
            window.showToast(result.message, 'error');
          } else {
            alert(result.message);
          }
        }

      } catch (error) {
        console.error('Error logging out all devices:', error);
        if (window.showToast) {
          window.showToast('Có lỗi xảy ra khi đăng xuất tất cả thiết bị!', 'error');
        } else {
          alert('Có lỗi xảy ra khi đăng xuất tất cả thiết bị!');
        }
      }
    }
  }, [user, onBackToHome]);

  // Xử lý đổi mật khẩu
  const handlePasswordChange = useCallback((e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error khi user nhập
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  }, [passwordErrors]);

  // Validate form đổi mật khẩu
  const validatePasswordForm = useCallback(() => {
    const newErrors = {};

    if (!passwordForm.currentPassword.trim()) {
      newErrors.currentPassword = 'Vui lòng nhập mật khẩu hiện tại';
    }

    if (!passwordForm.newPassword.trim()) {
      newErrors.newPassword = 'Vui lòng nhập mật khẩu mới';
    } else if (passwordForm.newPassword.length < 6) {
      newErrors.newPassword = 'Mật khẩu mới phải có ít nhất 6 ký tự';
    }

    if (!passwordForm.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu mới';
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    if (passwordForm.currentPassword === passwordForm.newPassword) {
      newErrors.newPassword = 'Mật khẩu mới phải khác mật khẩu hiện tại';
    }

    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [passwordForm]);

  // Submit đổi mật khẩu
  const handlePasswordSubmit = useCallback(async (e) => {
    e.preventDefault();

    if (!validatePasswordForm()) {
      return;
    }

    setPasswordLoading(true);

    try {
      // TODO: Implement real password change API
      // const { userApi } = await import('../../services/userApi');
      // const result = await userApi.changePassword(user.user_id, {
      //   currentPassword: passwordForm.currentPassword,

      // Mock response for now
      const result = { success: true };

      if (result.success) {
        // Reset form
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setPasswordErrors({});

        if (window.showToast) {
          window.showToast('Đổi mật khẩu thành công!', 'success');
        } else {
          alert('Đổi mật khẩu thành công!');
        }
      } else {
        setPasswordErrors({ general: result.message });
      }

    } catch (error) {
      console.error('Error changing password:', error);
      setPasswordErrors({ general: 'Có lỗi xảy ra khi đổi mật khẩu. Vui lòng thử lại.' });
    } finally {
      setPasswordLoading(false);
    }
  }, [passwordForm, validatePasswordForm, user]);

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
                                  disabled={!isEditing || user?.role !== 'admin'}
                                  style={{
                                    backgroundColor: user?.role !== 'admin' ? '#f8f9fa' : '',
                                    cursor: user?.role !== 'admin' ? 'not-allowed' : 'pointer'
                                  }}
                                >
                                  <option value="customer">Khách hàng</option>
                                  <option value="admin">Quản trị viên</option>
                                </select>
                                {user?.role !== 'admin' && (
                                  <small className="text-muted">
                                    <i className="fas fa-lock me-1"></i>
                                    Chỉ quản trị viên mới có thể thay đổi vai trò
                                  </small>
                                )}
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
                          <ErrorBoundary>
                            <ListOrders onNavigateTo={onBackToHome} />
                          </ErrorBoundary>
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

                            {passwordErrors.general && (
                              <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                <i className="fas fa-exclamation-circle me-2"></i>
                                {passwordErrors.general}
                                <button
                                  type="button"
                                  className="btn-close"
                                  onClick={() => setPasswordErrors(prev => ({ ...prev, general: '' }))}
                                ></button>
                              </div>
                            )}

                            <form onSubmit={handlePasswordSubmit}>
                              <div className="row g-3">
                                <div className="col-md-6">
                                  <label htmlFor="currentPassword" className="form-label">
                                    Mật khẩu hiện tại <span className="text-danger">*</span>
                                  </label>
                                  <input
                                    type="password"
                                    className={`form-control ${passwordErrors.currentPassword ? 'is-invalid' : ''}`}
                                    id="currentPassword"
                                    name="currentPassword"
                                    placeholder="Nhập mật khẩu hiện tại"
                                    value={passwordForm.currentPassword}
                                    onChange={handlePasswordChange}
                                    disabled={passwordLoading}
                                  />
                                  {passwordErrors.currentPassword && (
                                    <div className="invalid-feedback">
                                      {passwordErrors.currentPassword}
                                    </div>
                                  )}
                                </div>
                                <div className="col-md-6">
                                  <label htmlFor="newPassword" className="form-label">
                                    Mật khẩu mới <span className="text-danger">*</span>
                                  </label>
                                  <input
                                    type="password"
                                    className={`form-control ${passwordErrors.newPassword ? 'is-invalid' : ''}`}
                                    id="newPassword"
                                    name="newPassword"
                                    placeholder="Nhập mật khẩu mới"
                                    value={passwordForm.newPassword}
                                    onChange={handlePasswordChange}
                                    disabled={passwordLoading}
                                  />
                                  {passwordErrors.newPassword && (
                                    <div className="invalid-feedback">
                                      {passwordErrors.newPassword}
                                    </div>
                                  )}
                                </div>
                                <div className="col-md-6">
                                  <label htmlFor="confirmPassword" className="form-label">
                                    Xác nhận mật khẩu mới <span className="text-danger">*</span>
                                  </label>
                                  <input
                                    type="password"
                                    className={`form-control ${passwordErrors.confirmPassword ? 'is-invalid' : ''}`}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    placeholder="Nhập lại mật khẩu mới"
                                    value={passwordForm.confirmPassword}
                                    onChange={handlePasswordChange}
                                    disabled={passwordLoading}
                                  />
                                  {passwordErrors.confirmPassword && (
                                    <div className="invalid-feedback">
                                      {passwordErrors.confirmPassword}
                                    </div>
                                  )}
                                </div>
                                <div className="col-12">
                                  <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={passwordLoading}
                                  >
                                    {passwordLoading ? (
                                      <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Đang xử lý...
                                      </>
                                    ) : (
                                      <>
                                        <i className="fas fa-key me-2" style={{ fontSize: '1.2rem', width: '20px', height: '20px' }}></i>
                                        Đổi Mật Khẩu
                                      </>
                                    )}
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
                              <button
                                className="btn btn-outline-danger"
                                onClick={handleLogoutAllDevices}
                              >
                                <i className="fas fa-sign-out-alt me-2" style={{ fontSize: '1.2rem', width: '20px', height: '20px' }}></i>
                                Đăng xuất tất cả thiết bị
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
