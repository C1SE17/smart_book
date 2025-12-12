import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: 'localhost', // Chỉ bind vào localhost, không hiển thị network URL
    port: 5173, // Port mặc định của Vite
    strictPort: false, // Không bắt buộc port cố định
  },
  // Expose env variables to HTML
  define: {
    'import.meta.env.VITE_GOOGLE_MAPS_API_KEY': JSON.stringify(process.env.VITE_GOOGLE_MAPS_API_KEY || ''),
  },
})
