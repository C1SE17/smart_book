/**
 * Utility để load Google Maps API script động từ environment variable
 */
export const loadGoogleMapsScript = () => {
  return new Promise((resolve, reject) => {
    // Kiểm tra xem script đã được load chưa
    if (window.google && window.google.maps) {
      resolve(window.google.maps);
      return;
    }

    // Lấy API key từ environment variable
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      console.warn('[Google Maps] API key chưa được cấu hình trong .env');
      reject(new Error('Google Maps API key chưa được cấu hình'));
      return;
    }

    // Kiểm tra xem script tag đã tồn tại chưa
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      // Nếu script đã tồn tại, đợi nó load xong
      existingScript.onload = () => resolve(window.google.maps);
      existingScript.onerror = reject;
      return;
    }

    // Tạo script tag mới
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&language=vi&region=VN`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      if (window.google && window.google.maps) {
        resolve(window.google.maps);
      } else {
        reject(new Error('Google Maps API không load được'));
      }
    };
    
    script.onerror = () => {
      reject(new Error('Lỗi khi load Google Maps API script'));
    };

    document.head.appendChild(script);
  });
};

