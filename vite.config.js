import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import basicSSL from '@vitejs/plugin-basic-ssl'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

import VueRouter from 'unplugin-vue-router/vite'
import { VueRouterAutoImports } from 'unplugin-vue-router'


export default defineConfig(({ command, mode, ssrBuild }) => {
  // 加载对应开发环境的配置文件
  const config = loadEnv(mode, process.cwd())
  const url = mode === 'development' ? config.VITE_APP_DEVELOPMENT_URL : config.VITE_APP_PRODUCTION_URL
  return {

    server: {
      host: '0.0.0.0', // 允许外部访问
      https: true, // 启用https
      port: 3000,  // 指定端口号
    },
    plugins: [
      // 路由自动配置
      VueRouter({
        routesFolder: 'src/pages',
        exclude: ['**/components/*.vue'],
        extensions: ['.vue'],
        // 自定义 <route> 模块
        routeBlockLang: 'json5',

      }),

      vue(),
      basicSSL(), // 本地服务开启https的自签名证书
      // ele 自动导入
      AutoImport({
        resolvers: [ElementPlusResolver()],
        imports: [
          VueRouterAutoImports,
          { 'vue-router/auto': ['useLink'] }
        ]
      }),
      Components({
        resolvers: [ElementPlusResolver()]
      }),



    ],
  }
})
