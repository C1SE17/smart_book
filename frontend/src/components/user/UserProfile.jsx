import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { validateEmail } from '../../utils';
import apiService from '../../services';
import { useLanguage } from '../../contexts/LanguageContext';

const UserProfile = ({ user, onBackToHome, onUpdateProfile, activeTab: propActiveTab, onTabChange }) => {
  const { t, language } = useLanguage();
  const profileTexts = useMemo(() => t('profilePage', { returnObjects: true }) || {}, [t, language]);
  const tabLabels = profileTexts.tabs || {};
  const tabs = useMemo(() => [
    { id: 'profile', label: tabLabels.profile || 'Profile' },
    { id: 'security', label: tabLabels.security || 'Security' }
  ], [tabLabels]);
  const breadcrumbText = profileTexts.breadcrumb || {};
  const demoText = profileTexts.demo || {};
  const profileCardText = profileTexts.profileCard || {};
  const settingsText = profileTexts.settingsCard || {};
  const securityText = profileTexts.securityCard || {};
  const dangerZoneText = securityText.dangerZone || {};
  const profileFields = profileCardText.fields || {};
  const profileButtons = profileCardText.buttons || {};
  const roleOptions = profileFields.roleOptions || {};
  const settingsSections = settingsText.sections || {};
  const notificationOptions = settingsText.notifications || {};
  const privacyOptions = settingsText.privacy || {};
  const languageOptions = settingsText.languageOptions || {};
  const timezoneOptions = settingsText.timezones || {};
  const securityFields = securityText.fields || {};
  const passwordButtonText = securityText.passwordButton || {};
  const securityInfo = securityText.info || {};
  const validationText = profileTexts.validation || {};
  const passwordValidationText = profileTexts.passwordValidation || {};
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

    // Code gọi backend
    try {
      setLoading(true);
      const profileData = await apiService.getUserById(user.user_id);
      console.log('Profile data from API:', profileData);
      
      // Sửa: sử dụng profileData.data thay vì profileData
      const finalProfileData = {
        ...profileData.data, // Thay đổi từ profileData thành profileData.data
        role: user.role || profileData.data?.role || 'customer'
      };
      
      console.log('Final profile data:', finalProfileData);
      console.log('Phone in final profile data:', finalProfileData.phone);
      
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
    let filteredValue = value;

    // Cho phép nhập tạm thời để hiển thị lỗi, sẽ lọc khi blur
    if (name === 'name' || name === 'phone') {
      filteredValue = value;
    }

    setFormData(prev => ({
      ...prev,
      [name]: filteredValue
    }));

    // Validate real-time cho name
    if (name === 'name' && value) {
      const nameRegex = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵýỷỹ\s]+$/;
      if (!nameRegex.test(value.trim())) {
        setErrors(prev => ({
          ...prev,
          name: 'Only letters, spaces, and Vietnamese characters are allowed.'
        }));
      } else if (value.trim().length < 2) {
        setErrors(prev => ({
          ...prev,
          name: t('profilePage.validation.nameMin')
        }));
      } else {
        // Xóa lỗi nếu hợp lệ
        if (errors.name) {
          setErrors(prev => ({
            ...prev,
            name: ''
          }));
        }
      }
    } else if (name === 'name' && !value) {
      // Xóa lỗi khi trường rỗng
      if (errors.name) {
        setErrors(prev => ({
          ...prev,
          name: ''
        }));
      }
    }

    // Validate real-time cho phone
    if (name === 'phone' && value) {
      const phoneNumbersOnly = /^[0-9]+$/.test(value);
      if (!phoneNumbersOnly) {
        setErrors(prev => ({
          ...prev,
          phone: 'Only numbers can be entered.'
        }));
      } else {
        // Xóa lỗi nếu hợp lệ
        if (errors.phone) {
          setErrors(prev => ({
            ...prev,
            phone: ''
          }));
        }
      }
    } else if (name === 'phone' && !value) {
      // Xóa lỗi khi trường rỗng
      if (errors.phone) {
        setErrors(prev => ({
          ...prev,
          phone: ''
        }));
      }
    }

    // Validate real-time cho email
    if (name === 'email' && value) {
      if (!validateEmail(value)) {
        setErrors(prev => ({
          ...prev,
          email: t('profilePage.validation.emailInvalid')
        }));
      } else if (!value.toLowerCase().endsWith('@gmail.com')) {
        setErrors(prev => ({
          ...prev,
          email: 'Email must be @gmail.com'
        }));
      } else {
        // Xóa lỗi nếu hợp lệ
        if (errors.email) {
          setErrors(prev => ({
            ...prev,
            email: ''
          }));
        }
      }
    } else if (name === 'email' && !value) {
      // Xóa lỗi khi trường rỗng
      if (errors.email) {
        setErrors(prev => ({
          ...prev,
          email: ''
        }));
      }
    }

    // Validate real-time cho address
    if (name === 'address' && value) {
      const trimmedAddress = value.trim();
      if (trimmedAddress.length < 5) {
        setErrors(prev => ({
          ...prev,
          address: t('profilePage.validation.addressMin')
        }));
      } else if (trimmedAddress.length > 30) {
        setErrors(prev => ({
          ...prev,
          address: t('profilePage.validation.addressMax')
        }));
      } else {
        // Xóa lỗi nếu hợp lệ
        if (errors.address) {
          setErrors(prev => ({
            ...prev,
            address: ''
          }));
        }
      }
    } else if (name === 'address' && !value) {
      // Xóa lỗi khi trường rỗng
      if (errors.address) {
        setErrors(prev => ({
          ...prev,
          address: ''
        }));
      }
    }

    // Xóa lỗi khi user bắt đầu gõ (cho các field khác)
    if (name !== 'phone' && name !== 'email' && name !== 'name' && name !== 'address' && errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  }, [errors]);

  const validateForm = useCallback(() => {
    const newErrors = {};

    // Validation cho tên
    if (!formData.name.trim()) {
      newErrors.name = t('profilePage.validation.nameRequired');
    } else if (formData.name.trim().length < 2) {
      newErrors.name = t('profilePage.validation.nameMin');
    } else {
      // Kiểm tra tên không có ký tự đặc biệt hoặc số
      const nameRegex = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵýỷỹ\s]+$/;
      if (!nameRegex.test(formData.name.trim())) {
        newErrors.name = 'Only letters, spaces, and Vietnamese characters are allowed.';
      }
    }

    // Validation cho email - chỉ chấp nhận @gmail.com
    if (!formData.email.trim()) {
      newErrors.email = t('profilePage.validation.emailRequired');
    } else if (!validateEmail(formData.email)) {
      newErrors.email = t('profilePage.validation.emailInvalid');
    } else if (!formData.email.toLowerCase().endsWith('@gmail.com')) {
      newErrors.email = 'Email must be @gmail.com';
    }

    // Validation cho số điện thoại
    if (formData.phone) {
      // Kiểm tra chỉ có số
      const phoneNumbersOnly = /^[0-9]+$/.test(formData.phone);
      if (!phoneNumbersOnly) {
        newErrors.phone = 'Only numbers can be entered.';
      } else if (formData.phone.length < 10) {
        newErrors.phone = t('profilePage.validation.phoneInvalid');
      }
    }

    // Validation cho địa chỉ (5-30 ký tự)
    if (formData.address) {
      const trimmedAddress = formData.address.trim();
      if (trimmedAddress.length < 5) {
        newErrors.address = t('profilePage.validation.addressMin');
      } else if (trimmedAddress.length > 30) {
        newErrors.address = t('profilePage.validation.addressMax');
      } else {
        // Kiểm tra địa chỉ hợp lệ: phải có ít nhất một ký tự chữ cái
        // Địa chỉ không được chỉ toàn số hoặc ký tự đặc biệt
        const hasValidChars = /[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵýỷỹ]/.test(trimmedAddress);
        if (!hasValidChars) {
          newErrors.address = t('profilePage.validation.addressInvalid');
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, t]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (!user?.token) {
      setSuccessMessage(t('profilePage.profileCard.messages.demoMode'));
      setIsEditing(false);
      setTimeout(() => setSuccessMessage(''), 3000);
      return;
    }

    setLoading(true);

    try {
      // Gọi API backend để cập nhật thông tin user (sử dụng service chung để tự động gắn token/baseURL)
      const result = await apiService.updateProfile({
        name: formData.name,
        phone: formData.phone,
        address: formData.address
      });
      console.log('Update user result:', result);
      console.log('Updated phone:', formData.phone);

      // Cập nhật user trong localStorage
      const updatedUser = {
        ...user,
        name: formData.name,
        phone: formData.phone,
        address: formData.address
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      setUserProfile({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        role: formData.role
      });

      if (onUpdateProfile) {
        onUpdateProfile(updatedUser);
      }

      setSuccessMessage(t('profilePage.profileCard.messages.updateSuccess'));
      setIsEditing(false);
      setTimeout(() => setSuccessMessage(''), 3000);

    } catch (error) {
      console.error('Lỗi cập nhật:', error);
      setErrors({ general: t('profilePage.profileCard.messages.updateError') });
    } finally {
      setLoading(false);
    }
  }, [formData, validateForm, user?.token, onUpdateProfile, t]);

  const handleNameBlur = useCallback((e) => {
    const { value } = e.target;
    // Lọc bỏ ký tự không hợp lệ khi rời khỏi trường
    const filteredValue = value === '' ? '' : value.replace(/[^a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵýỷỹ\s]/g, '');
    
    setFormData(prev => ({
      ...prev,
      name: filteredValue
    }));

    // Validate sau khi lọc
    if (filteredValue) {
      const nameRegex = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵýỷỹ\s]+$/;
      if (!nameRegex.test(filteredValue.trim())) {
        setErrors(prev => ({
          ...prev,
          name: 'Only letters, spaces, and Vietnamese characters are allowed.'
        }));
      } else if (filteredValue.trim().length < 2) {
        setErrors(prev => ({
          ...prev,
          name: t('profilePage.validation.nameMin')
        }));
      } else {
        setErrors(prev => ({
          ...prev,
          name: ''
        }));
      }
    } else {
      setErrors(prev => ({
        ...prev,
        name: ''
      }));
    }
  }, [t]);

  const handlePhoneBlur = useCallback((e) => {
    const { value } = e.target;
    // Lọc bỏ chữ cái khi rời khỏi trường
    const filteredValue = value.replace(/[^0-9]/g, '');
    
    setFormData(prev => ({
      ...prev,
      phone: filteredValue
    }));

    // Validate sau khi lọc
    if (filteredValue) {
      const phoneNumbersOnly = /^[0-9]+$/.test(filteredValue);
      if (!phoneNumbersOnly) {
        setErrors(prev => ({
          ...prev,
          phone: 'Only numbers can be entered.'
        }));
      } else if (filteredValue.length < 10) {
        setErrors(prev => ({
          ...prev,
          phone: t('profilePage.validation.phoneInvalid')
        }));
      } else {
        setErrors(prev => ({
          ...prev,
          phone: ''
        }));
      }
    } else {
      setErrors(prev => ({
        ...prev,
        phone: ''
      }));
    }
  }, [t]);

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
    if (window.confirm(t('profilePage.securityCard.logout.confirm'))) {
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
          localStorage.removeItem('token'); // Xóa token
          
          // Xóa tất cả cart data của user
          const userId = user?.user_id;
          if (userId) {
            localStorage.removeItem(`cart_${userId}`);
          }
          
          // Xóa tất cả cart keys (fallback - xóa tất cả keys bắt đầu bằng 'cart_')
          try {
            Object.keys(localStorage).forEach(key => {
              if (key.startsWith('cart_')) {
                localStorage.removeItem(key);
              }
            });
          } catch (e) {
            console.error('Error clearing cart data:', e);
          }

          // Dispatch event để App.jsx biết user đã đăng xuất
          window.dispatchEvent(new CustomEvent('userLoggedOut'));

          if (window.showToast) {
            window.showToast(t('profilePage.securityCard.logout.success'), 'success');
          } else {
            alert(t('profilePage.securityCard.logout.success'));
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
          const message = result.message || t('profilePage.securityCard.logout.error');
          if (window.showToast) {
            window.showToast(message, 'error');
          } else {
            alert(message);
          }
        }

      } catch (error) {
        console.error('Error logging out all devices:', error);
        if (window.showToast) {
          window.showToast(t('profilePage.securityCard.logout.error'), 'error');
        } else {
          alert(t('profilePage.securityCard.logout.error'));
        }
      }
    }
  }, [user, onBackToHome, t]);

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
      newErrors.currentPassword = t('profilePage.passwordValidation.currentRequired');
    }

    if (!passwordForm.newPassword.trim()) {
      newErrors.newPassword = t('profilePage.passwordValidation.newRequired');
    } else if (passwordForm.newPassword.length < 6) {
      newErrors.newPassword = t('profilePage.passwordValidation.newMin');
    }

    if (!passwordForm.confirmPassword.trim()) {
      newErrors.confirmPassword = t('profilePage.passwordValidation.confirmRequired');
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      newErrors.confirmPassword = t('profilePage.passwordValidation.confirmMismatch');
    }

    if (passwordForm.currentPassword === passwordForm.newPassword) {
      newErrors.newPassword = t('profilePage.passwordValidation.newDifferent');
    }

    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [passwordForm, t]);

  // Submit đổi mật khẩu
  const handlePasswordSubmit = useCallback(async (e) => {
    e.preventDefault();

    if (!validatePasswordForm()) {
      return;
    }

    // Kiểm tra user đã đăng nhập chưa
    if (!user?.token) {
      setPasswordErrors({ general: 'Vui lòng đăng nhập để đổi mật khẩu' });
      return;
    }

    setPasswordLoading(true);

    try {
      // Gọi API đổi mật khẩu thực sự
      const result = await apiService.changePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword
      );

      if (result?.success) {
        // Reset form
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setPasswordErrors({});

        if (window.showToast) {
          window.showToast(t('profilePage.securityCard.passwordChange.success'), 'success');
        } else {
          alert(t('profilePage.securityCard.passwordChange.success'));
        }
      } else {
        const errorMessage = result?.message || t('profilePage.securityCard.passwordChange.error');
        setPasswordErrors({ general: errorMessage });
      }

    } catch (error) {
      console.error('Error changing password:', error);
      const errorMessage = error?.message || error?.response?.data?.message || t('profilePage.securityCard.passwordChange.error');
      setPasswordErrors({ general: errorMessage });
    } finally {
      setPasswordLoading(false);
    }
  }, [passwordForm, validatePasswordForm, user, t]);

  const handleTabChange = useCallback((tabId) => {
    setActiveTab(tabId);
    if (onTabChange) {
      onTabChange(tabId);
    }

    const tabRoutes = {
      'profile': '/profile',
      'security': '/profile/security'
    };

    const newPath = tabRoutes[tabId] || '/profile';
    window.history.pushState({}, '', newPath);
  }, [onTabChange]);

  const currentUser = userProfile || displayUser;
  // Luôn sử dụng formData nếu đã được khởi tạo (kể cả khi rỗng)
  // Chỉ fallback khi formData chưa được khởi tạo (tất cả field đều undefined)
  const currentFormData = (formData.name !== undefined || formData.email !== undefined) ? formData : {
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
              <strong>{demoText.title || ''}</strong> {demoText.description || ''}
              <button
                className="btn btn-link text-primary p-0 ms-2"
                onClick={() => {
                  window.history.pushState({}, '', '/login');
                  window.dispatchEvent(new PopStateEvent('popstate'));
                }}
                style={{ textDecoration: 'underline' }}
              >
                {demoText.loginCta || ''}
              </button>
              {demoText.loginSuffix ? ` ${demoText.loginSuffix}` : ''}
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
              {breadcrumbText.home || 'Home'}
              {breadcrumbText.separator || '/'}
              <span className="fw-bold" style={{ fontSize: '16px' }}> {tabs.find(tab => tab.id === activeTab)?.label || tabLabels.profile || 'Profile'}</span>
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
                            <h5 className="card-title mb-0">{profileCardText.title || ''}</h5>
                            {!isEditing && (
                              <button
                                className="btn btn-outline-primary"
                                onClick={() => setIsEditing(true)}
                              >
                                <i className="fas fa-edit me-2" style={{ fontSize: '1.2rem', width: '20px', height: '20px' }}></i>
                                {profileCardText.editButton || ''}
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
                                  {profileFields.nameLabel}
                                  <span className="text-danger"> *</span>
                                </label>
                                <input
                                  type="text"
                                  className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                  id="name"
                                  name="name"
                                  value={currentFormData.name}
                                  onChange={handleChange}
                                  onBlur={handleNameBlur}
                                  disabled={!isEditing}
                                  placeholder={profileFields.namePlaceholder}
                                />
                                {errors.name && (
                                  <div className="invalid-feedback" style={{display: 'block'}}>
                                    {errors.name}
                                  </div>
                                )}
                              </div>

                              {/* Email Field */}
                              <div className="col-md-6">
                                <label htmlFor="email" className="form-label">
                                  {profileFields.emailLabel}
                                  <span className="text-danger"> *</span>
                                </label>
                                <input
                                  type="email"
                                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                  id="email"
                                  name="email"
                                  value={currentFormData.email}
                                  onChange={handleChange}
                                  disabled={!isEditing}
                                  placeholder={profileFields.emailPlaceholder}
                                />
                                {errors.email && (
                                  <div className="invalid-feedback" style={{display: 'block'}}>
                                    {errors.email}
                                  </div>
                                )}
                              </div>

                              {/* Phone Field */}
                              <div className="col-md-6">
                                <label htmlFor="phone" className="form-label">
                                  {profileFields.phoneLabel}
                                </label>
                                <input
                                  type="tel"
                                  className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                                  id="phone"
                                  name="phone"
                                  value={currentFormData.phone}
                                  onChange={handleChange}
                                  onBlur={handlePhoneBlur}
                                  disabled={!isEditing}
                                  placeholder={profileFields.phonePlaceholder}
                                />
                                {errors.phone && (
                                  <div className="invalid-feedback" style={{display: 'block'}}>
                                    {errors.phone}
                                  </div>
                                )}
                              </div>

                              {/* Role Field */}
                              <div className="col-md-6">
                                <label htmlFor="role" className="form-label">
                                  {profileFields.roleLabel}
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
                                  <option value="customer">{roleOptions.customer}</option>
                                  <option value="admin">{roleOptions.admin}</option>
                                </select>
                                {user?.role !== 'admin' && (
                                  <small className="text-muted">
                                    <i className="fas fa-lock me-1"></i>
                                    {profileFields.roleHint}
                                  </small>
                                )}
                              </div>

                              {/* Address Field */}
                              <div className="col-12">
                                <label htmlFor="address" className="form-label">
                                  {profileFields.addressLabel}
                                </label>
                                <textarea
                                  className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                                  id="address"
                                  name="address"
                                  rows="3"
                                  value={currentFormData.address}
                                  onChange={handleChange}
                                  disabled={!isEditing}
                                  placeholder={profileFields.addressPlaceholder}
                                ></textarea>
                                {errors.address && (
                                  <div className="invalid-feedback" style={{display: 'block'}}>
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
                                          {profileButtons.saving}
                                        </>
                                      ) : (
                                        <>
                                          <i className="fas fa-save me-2" style={{ fontSize: '1.2rem', width: '20px', height: '20px' }}></i>
                                          {profileButtons.save}
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
                                      {profileButtons.cancel}
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

                {activeTab === 'security' && (
                  <div className="row g-4">
                    <div className="col-12">
                      <div className="card shadow-sm">
                        <div className="card-body p-4">
                          <h5 className="card-title mb-4">{securityText.title || ''}</h5>

                          {/* Change Password Section */}
                          <div className="mb-4">
                            <h6 className="text-muted mb-3">{securityText.changePasswordTitle || ''}</h6>

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
                                    {securityFields.currentPasswordLabel}
                                    <span className="text-danger"> *</span>
                                  </label>
                                  <input
                                    type="password"
                                    className={`form-control ${passwordErrors.currentPassword ? 'is-invalid' : ''}`}
                                    id="currentPassword"
                                    name="currentPassword"
                                    placeholder={securityFields.currentPasswordPlaceholder}
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
                                    {securityFields.newPasswordLabel}
                                    <span className="text-danger"> *</span>
                                  </label>
                                  <input
                                    type="password"
                                    className={`form-control ${passwordErrors.newPassword ? 'is-invalid' : ''}`}
                                    id="newPassword"
                                    name="newPassword"
                                    placeholder={securityFields.newPasswordPlaceholder}
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
                                    {securityFields.confirmPasswordLabel}
                                    <span className="text-danger"> *</span>
                                  </label>
                                  <input
                                    type="password"
                                    className={`form-control ${passwordErrors.confirmPassword ? 'is-invalid' : ''}`}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    placeholder={securityFields.confirmPasswordPlaceholder}
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
                                        {passwordButtonText.loading}
                                      </>
                                    ) : (
                                      <>
                                        <i className="fas fa-key me-2" style={{ fontSize: '1.2rem', width: '20px', height: '20px' }}></i>
                                        {passwordButtonText.submit}
                                      </>
                                    )}
                                  </button>
                                </div>
                              </div>
                            </form>
                          </div>

                          <hr className="my-4" />

                          {/* Danger Zone */}
                          <div className="mb-4">
                            <h6 className="text-danger mb-3">{dangerZoneText.title || ''}</h6>
                            <div className="alert alert-warning" role="alert">
                              <i className="fas fa-exclamation-triangle me-2" style={{ fontSize: '1.2rem', width: '20px', height: '20px' }}></i>
                              <strong>{dangerZoneText.warningTitle || ''}</strong> {dangerZoneText.warningDescription || ''}
                            </div>
                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-outline-danger"
                                onClick={handleLogoutAllDevices}
                              >
                                <i className="fas fa-sign-out-alt me-2" style={{ fontSize: '1.2rem', width: '20px', height: '20px' }}></i>
                                {dangerZoneText.logoutAllButton}
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
