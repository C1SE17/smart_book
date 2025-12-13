/**
 * Service để gọi API địa chỉ Việt Nam từ provinces.open-api.vn
 * và tích hợp Google Places API
 */
const API_BASE_URL = 'https://provinces.open-api.vn/api';
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

class AddressApi {
  /**
   * Lấy danh sách tất cả các tỉnh/thành phố
   */
  async getProvinces() {
    try {
      const response = await fetch(`${API_BASE_URL}/p/`);
      if (!response.ok) {
        throw new Error('Failed to fetch provinces');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching provinces:', error);
      throw error;
    }
  }

  /**
   * Lấy danh sách quận/huyện theo mã tỉnh/thành phố
   * @param {string} provinceCode - Mã tỉnh/thành phố
   */
  async getDistricts(provinceCode) {
    try {
      const response = await fetch(`${API_BASE_URL}/p/${provinceCode}?depth=2`);
      if (!response.ok) {
        throw new Error('Failed to fetch districts');
      }
      const data = await response.json();
      return data.districts || [];
    } catch (error) {
      console.error('Error fetching districts:', error);
      throw error;
    }
  }

  /**
   * Lấy danh sách phường/xã theo mã quận/huyện
   * @param {string} districtCode - Mã quận/huyện
   */
  async getWards(districtCode) {
    try {
      const response = await fetch(`${API_BASE_URL}/d/${districtCode}?depth=2`);
      if (!response.ok) {
        throw new Error('Failed to fetch wards');
      }
      const data = await response.json();
      return data.wards || [];
    } catch (error) {
      console.error('Error fetching wards:', error);
      throw error;
    }
  }

  /**
   * Tìm kiếm tỉnh/thành phố theo tên
   * @param {string} name - Tên tỉnh/thành phố
   */
  async searchProvince(name) {
    try {
      const provinces = await this.getProvinces();
      return provinces.find(p => 
        p.name.toLowerCase().includes(name.toLowerCase()) ||
        p.name_with_type.toLowerCase().includes(name.toLowerCase())
      );
    } catch (error) {
      console.error('Error searching province:', error);
      return null;
    }
  }

  /**
   * Tìm kiếm quận/huyện theo tên và mã tỉnh
   * @param {string} name - Tên quận/huyện
   * @param {string} provinceCode - Mã tỉnh/thành phố
   */
  async searchDistrict(name, provinceCode) {
    try {
      const districts = await this.getDistricts(provinceCode);
      return districts.find(d => 
        d.name.toLowerCase().includes(name.toLowerCase()) ||
        d.name_with_type.toLowerCase().includes(name.toLowerCase())
      );
    } catch (error) {
      console.error('Error searching district:', error);
      return null;
    }
  }

  /**
   * Tìm kiếm phường/xã theo tên và mã quận/huyện
   * @param {string} name - Tên phường/xã
   * @param {string} districtCode - Mã quận/huyện
   */
  async searchWard(name, districtCode) {
    try {
      const wards = await this.getWards(districtCode);
      return wards.find(w => 
        w.name.toLowerCase().includes(name.toLowerCase()) ||
        w.name_with_type.toLowerCase().includes(name.toLowerCase())
      );
    } catch (error) {
      console.error('Error searching ward:', error);
      return null;
    }
  }

  /**
   * Khởi tạo Google Places Autocomplete cho input
   * @param {HTMLInputElement} inputElement - Element input cần thêm autocomplete
   * @param {Function} onPlaceSelected - Callback khi người dùng chọn địa chỉ
   */
  initGooglePlacesAutocomplete(inputElement, onPlaceSelected) {
    if (!window.google || !window.google.maps || !window.google.maps.places) {
      console.error('Google Maps API chưa được load');
      return null;
    }

    const autocomplete = new window.google.maps.places.Autocomplete(inputElement, {
      componentRestrictions: { country: 'vn' }, // Chỉ tìm kiếm ở Việt Nam
      fields: ['address_components', 'formatted_address', 'geometry'],
      types: ['address'] // Chỉ tìm kiếm địa chỉ
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place && place.address_components) {
        const addressData = this.parseGoogleAddress(place);
        if (onPlaceSelected) {
          onPlaceSelected(addressData);
        }
      }
    });

    return autocomplete;
  }

  /**
   * Parse địa chỉ từ Google Places API thành city, district, ward
   * @param {Object} place - Place object từ Google Places API
   */
  parseGoogleAddress(place) {
    const addressComponents = place.address_components || [];
    let city = '';
    let district = '';
    let ward = '';
    let streetAddress = '';

    // Map các loại địa chỉ của Google
    addressComponents.forEach(component => {
      const types = component.types;

      // Tỉnh/Thành phố
      if (types.includes('administrative_area_level_1')) {
        city = component.long_name;
      }
      // Quận/Huyện
      else if (types.includes('administrative_area_level_2')) {
        district = component.long_name;
      }
      // Phường/Xã
      else if (types.includes('administrative_area_level_3') || types.includes('sublocality_level_1')) {
        ward = component.long_name;
      }
      // Đường phố
      else if (types.includes('route')) {
        streetAddress = component.long_name;
      }
      // Số nhà
      else if (types.includes('street_number')) {
        streetAddress = component.long_name + ' ' + streetAddress;
      }
    });

    return {
      formattedAddress: place.formatted_address || '',
      streetAddress: streetAddress.trim(),
      city: city,
      district: district,
      ward: ward,
      geometry: place.geometry
    };
  }

  /**
   * Tìm kiếm địa chỉ trong danh sách provinces để match với Google Places
   * @param {string} googleCityName - Tên thành phố từ Google Places
   */
  async findMatchingProvince(googleCityName) {
    try {
      const provinces = await this.getProvinces();
      
      // Tìm exact match
      let match = provinces.find(p => 
        p.name === googleCityName || 
        p.name_with_type === googleCityName
      );

      // Nếu không tìm thấy, tìm partial match
      if (!match) {
        match = provinces.find(p => 
          googleCityName.includes(p.name) || 
          p.name.includes(googleCityName) ||
          googleCityName.includes(p.name_with_type) ||
          p.name_with_type.includes(googleCityName)
        );
      }

      return match;
    } catch (error) {
      console.error('Error finding matching province:', error);
      return null;
    }
  }

  /**
   * Tìm kiếm quận/huyện trong danh sách districts để match với Google Places
   * @param {string} googleDistrictName - Tên quận/huyện từ Google Places
   * @param {string} provinceCode - Mã tỉnh/thành phố
   */
  async findMatchingDistrict(googleDistrictName, provinceCode) {
    try {
      const districts = await this.getDistricts(provinceCode);
      
      // Tìm exact match
      let match = districts.find(d => 
        d.name === googleDistrictName || 
        d.name_with_type === googleDistrictName
      );

      // Nếu không tìm thấy, tìm partial match
      if (!match) {
        match = districts.find(d => 
          googleDistrictName.includes(d.name) || 
          d.name.includes(googleDistrictName) ||
          googleDistrictName.includes(d.name_with_type) ||
          d.name_with_type.includes(googleDistrictName)
        );
      }

      return match;
    } catch (error) {
      console.error('Error finding matching district:', error);
      return null;
    }
  }

  /**
   * Tìm kiếm phường/xã trong danh sách wards để match với Google Places
   * @param {string} googleWardName - Tên phường/xã từ Google Places
   * @param {string} districtCode - Mã quận/huyện
   */
  async findMatchingWard(googleWardName, districtCode) {
    try {
      const wards = await this.getWards(districtCode);
      
      // Tìm exact match
      let match = wards.find(w => 
        w.name === googleWardName || 
        w.name_with_type === googleWardName
      );

      // Nếu không tìm thấy, tìm partial match
      if (!match) {
        match = wards.find(w => 
          googleWardName.includes(w.name) || 
          w.name.includes(googleWardName) ||
          googleWardName.includes(w.name_with_type) ||
          w.name_with_type.includes(googleWardName)
        );
      }

      return match;
    } catch (error) {
      console.error('Error finding matching ward:', error);
      return null;
    }
  }
}

const addressApi = new AddressApi();
export default addressApi;

