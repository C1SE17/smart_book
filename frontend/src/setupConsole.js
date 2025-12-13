// Đã tắt ẩn log để hiển thị lại log trên F12
// Để bật lại ẩn log, uncomment code bên dưới và set VITE_SUPPRESS_LOGS=true trong .env
const shouldSuppressLogs = (import.meta.env.VITE_SUPPRESS_LOGS ?? 'false') === 'true'

if (shouldSuppressLogs) {
  const mutedMethods = ['log', 'info', 'debug', 'warn']
  mutedMethods.forEach(method => {
    // keep errors visible while silencing noisy console output
    console[method] = () => {}
  })
}


