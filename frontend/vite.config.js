import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// test หน้าจอรันใน jsdom (เบราว์เซอร์จำลอง) ไม่ต้องเปิดเบราว์เซอร์จริง
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { host: true, port: 5173 },
  test: { environment: 'jsdom', globals: true },
})
