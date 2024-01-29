import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import basicSSL from '@vitejs/plugin-basic-ssl'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({

  server: {
    host: '0.0.0.0', // 允许外部访问
    https: true, // 启用https
  },
  plugins: [
    vue(),
    basicSSL(), // 本地服务开启https的自签名证书
    // ele 自动导入
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    })
  ],
})
