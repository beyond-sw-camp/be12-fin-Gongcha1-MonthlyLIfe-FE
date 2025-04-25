import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  
  server: {
    host: '127.0.0.1',
    proxy: {
      "/api": {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/uploads': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
      },
      "/ws": {  // WebSocket 프록시 추가
        target: "http://localhost:8080/",
        changeOrigin: true,
        ws: true, // WebSocket 지원 활성화
      },


    }
  }
})
