import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import basicSSL from '@vitejs/plugin-basic-ssl'

// https://vitejs.dev/config/
export default defineConfig({

  server: {
    host: '0.0.0.0', // 允许外部访问
    https: true, // 启用https
  },
  plugins: [vue(), basicSSL()],
})
