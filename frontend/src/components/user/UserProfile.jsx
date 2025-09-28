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

  // Use mock data when user is not logged in
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
    if (displayUser) {
      const newFormData = {
        name: displayUser.name || '',
        email: displayUser.email || '',
        phone: displayUser.phone || '',
        address: displayUser.address || '',
        role: displayUser.role || 'customer'
      };
      setFormData(newFormData);
      setUserProfile(displayUser);
    }
  }, [displayUser]);

  // Lấy thông tin profile từ backend
  const fetchUserProfile = useCallback(async () => {
    if (!user?.token) {
      // Use mock data when not logged in
      setUserProfile(displayUser);
      return;
    }
    
    try {
      setLoading(true);
      const profileData = await userService.getProfile(user.token);
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
      // Fallback về dữ liệu user local
      setUserProfile(displayUser);
    } finally {
      setLoading(false);
    }
  }, [user, displayUser]);

  // Tải dữ liệu profile khi component mount
  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  // Sync activeTab với prop từ parent
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
    
    if (!validateForm()) {
      return;
    }

    // If not logged in, just show demo message
    if (!user?.token) {
      setSuccessMessage('Đây là chế độ demo. Vui lòng đăng nhập để cập nhật thông tin thực.');
      setIsEditing(false);
      setTimeout(() => setSuccessMessage(''), 3000);
      return;
    }

    setLoading(true);
    
    try {
      // Cập nhật profile qua API
      const updatedProfile = await userService.updateProfile(formData, user.token);
      
      console.log('Cập nhật profile thành công:', updatedProfile);
      
      // Cập nhật state local
      setUserProfile(updatedProfile);
      if (onUpdateProfile) {
        onUpdateProfile(updatedProfile);
      }
      
      setSuccessMessage('Cập nhật thông tin thành công!');
      setIsEditing(false);
      
      // Xóa thông báo thành công sau 3 giây
      setTimeout(() => setSuccessMessage(''), 3000);
      
    } catch (error) {
      console.error('Lỗi cập nhật:', error);
      setErrors({ general: 'Cập nhật thông tin thất bại. Vui lòng thử lại.' });
    } finally {
      setLoading(false);
    }
  }, [formData, validateForm, user?.token, onUpdateProfile]);

  const handleCancel = useCallback(() => {
    // Đặt lại dữ liệu form về dữ liệu user gốc
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

  // Handle tab change with URL update
  const handleTabChange = useCallback((tabId) => {
    setActiveTab(tabId);
    if (onTabChange) {
      onTabChange(tabId);
    }
    
    // Update URL based on tab
    const tabRoutes = {
      'profile': '/profile',
      'orders': '/profile/orders',
      'settings': '/profile/settings',
      'security': '/profile/security'
    };
    
    const newPath = tabRoutes[tabId] || '/profile';
    window.history.pushState({}, '', newPath);
  }, [onTabChange]);

  // Ensure we always have data to display
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
          {/* Demo Notice for non-logged in users */}
          {!user && (
            <div className="alert alert-info mb-3" role="alert">
              <i className="fas fa-info-circle me-2"></i>
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

          {/* Back Home Navigation */}
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
              <i className="fas fa-arrow-left me-1"></i>
              Home/
              <span className="fw-bold" style={{ fontSize: '16px' }}> {tabs.find(tab => tab.id === activeTab)?.label || 'Hồ sơ'}</span>
            </button>
          </div>

          {/* Tabs */}
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

          {/* Content based on active tab */}
          <div className="row">
            <div className="col-12">
              <div style={{ minHeight: '600px' }}>
                {activeTab === 'profile' && (
                  <div className="row g-4">
                    <div className="col-12">
                      <div className="card" style={{
                        backgroundColor: '#f8f9fa',
                        border: '1px solid #e9ecef',
                        minHeight: '500px'
                      }}>
                        <div className="card-body p-4">
                          <h5 className="card-title mb-4">Profile Information</h5>
                          <p>This is the profile tab content.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'orders' && (
                  <div className="row g-4">
                    <div className="col-12">
                      <div className="card" style={{
                        backgroundColor: '#f8f9fa',
                        border: '1px solid #e9ecef',
                        minHeight: '500px'
                      }}>
                        <div className="card-body p-4">
                          <h5 className="card-title mb-4">Đơn hàng của tôi</h5>
                          <p>This is the orders tab content.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'settings' && (
                  <div className="row g-4">
                    <div className="col-12">
                      <div className="card" style={{
                        backgroundColor: '#f8f9fa',
                        border: '1px solid #e9ecef',
                        minHeight: '500px'
                      }}>
                        <div className="card-body p-4">
                          <h5 className="card-title mb-4">Account Settings</h5>
                          <p>This is the settings tab content.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'security' && (
                  <div className="row g-4">
                    <div className="col-12">
                      <div className="card" style={{
                        backgroundColor: '#f8f9fa',
                        border: '1px solid #e9ecef',
                        minHeight: '500px'
                      }}>
                        <div className="card-body p-4">
                          <h5 className="card-title mb-4">Security Settings</h5>
                          <p>This is the security tab content.</p>
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
