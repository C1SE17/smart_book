// src/main.jsx
import './setupConsole.js'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { loadGoogleMapsScript } from './utils/loadGoogleMaps.js'

// Import Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css'
import '@fortawesome/fontawesome-free/css/all.min.css'

// Load Google Maps API nếu có API key
const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
if (googleMapsApiKey) {
  loadGoogleMapsScript()
    .then(() => {
      console.log('[Google Maps] API đã được load thành công');
    })
    .catch((error) => {
      console.warn('[Google Maps] Không thể load API:', error.message);
    });
} else {
  console.warn('[Google Maps] API key chưa được cấu hình. Một số tính năng có thể không hoạt động.');
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
