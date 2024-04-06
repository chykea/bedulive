// vite.config.js
import { defineConfig, loadEnv } from "file:///C:/Users/user/Desktop/media-server/bedulive/node_modules/vite/dist/node/index.js";
import vue from "file:///C:/Users/user/Desktop/media-server/bedulive/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import AutoImport from "file:///C:/Users/user/Desktop/media-server/bedulive/node_modules/unplugin-auto-import/dist/vite.js";
import Components from "file:///C:/Users/user/Desktop/media-server/bedulive/node_modules/unplugin-vue-components/dist/vite.js";
import { ElementPlusResolver } from "file:///C:/Users/user/Desktop/media-server/bedulive/node_modules/unplugin-vue-components/dist/resolvers.js";
import VueRouter from "file:///C:/Users/user/Desktop/media-server/bedulive/node_modules/unplugin-vue-router/dist/vite.mjs";
import { VueRouterAutoImports } from "file:///C:/Users/user/Desktop/media-server/bedulive/node_modules/unplugin-vue-router/dist/index.mjs";
var vite_config_default = defineConfig(({ command, mode, ssrBuild }) => {
  const config = loadEnv(mode, process.cwd());
  const url = mode === "development" ? config.VITE_APP_DEVELOPMENT_URL : config.VITE_APP_PRODUCTION_URL;
  return {
    server: {
      host: "0.0.0.0",
      // 允许外部访问
      // https: {
      //   key: fs.readFileSync('./cert/localhost+1-key.pem'),
      //   cert: fs.readFileSync('./cert/localhost+1.pem'),
      // }, // 启用https
      port: 3e3
      // 指定端口号
    },
    plugins: [
      // 路由自动配置
      VueRouter({
        routesFolder: "src/pages",
        exclude: ["**/components/*.vue"],
        extensions: [".vue"],
        // 自定义 <route> 模块
        routeBlockLang: "json5"
      }),
      vue(),
      // basicSSL(), // 本地服务开启https的自签名证书
      // ele 自动导入
      AutoImport({
        resolvers: [ElementPlusResolver()],
        imports: [
          VueRouterAutoImports,
          { "vue-router/auto": ["useLink"] }
        ]
      }),
      Components({
        resolvers: [ElementPlusResolver()]
      })
    ]
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFx1c2VyXFxcXERlc2t0b3BcXFxcbWVkaWEtc2VydmVyXFxcXGJlZHVsaXZlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFx1c2VyXFxcXERlc2t0b3BcXFxcbWVkaWEtc2VydmVyXFxcXGJlZHVsaXZlXFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy91c2VyL0Rlc2t0b3AvbWVkaWEtc2VydmVyL2JlZHVsaXZlL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBsb2FkRW52IH0gZnJvbSAndml0ZSdcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xuLy8gaW1wb3J0IGJhc2ljU1NMIGZyb20gJ0B2aXRlanMvcGx1Z2luLWJhc2ljLXNzbCdcblxuaW1wb3J0IEF1dG9JbXBvcnQgZnJvbSAndW5wbHVnaW4tYXV0by1pbXBvcnQvdml0ZSdcbmltcG9ydCBDb21wb25lbnRzIGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3ZpdGUnXG5pbXBvcnQgeyBFbGVtZW50UGx1c1Jlc29sdmVyIH0gZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvcmVzb2x2ZXJzJ1xuXG5pbXBvcnQgVnVlUm91dGVyIGZyb20gJ3VucGx1Z2luLXZ1ZS1yb3V0ZXIvdml0ZSdcbmltcG9ydCB7IFZ1ZVJvdXRlckF1dG9JbXBvcnRzIH0gZnJvbSAndW5wbHVnaW4tdnVlLXJvdXRlcidcbmltcG9ydCBmcyBmcm9tICdmcydcblxuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgY29tbWFuZCwgbW9kZSwgc3NyQnVpbGQgfSkgPT4ge1xuICAvLyBcdTUyQTBcdThGN0RcdTVCRjlcdTVFOTRcdTVGMDBcdTUzRDFcdTczQUZcdTU4ODNcdTc2ODRcdTkxNERcdTdGNkVcdTY1ODdcdTRFRjZcbiAgY29uc3QgY29uZmlnID0gbG9hZEVudihtb2RlLCBwcm9jZXNzLmN3ZCgpKVxuICBjb25zdCB1cmwgPSBtb2RlID09PSAnZGV2ZWxvcG1lbnQnID8gY29uZmlnLlZJVEVfQVBQX0RFVkVMT1BNRU5UX1VSTCA6IGNvbmZpZy5WSVRFX0FQUF9QUk9EVUNUSU9OX1VSTFxuICByZXR1cm4ge1xuXG4gICAgc2VydmVyOiB7XG4gICAgICBob3N0OiAnMC4wLjAuMCcsIC8vIFx1NTE0MVx1OEJCOFx1NTkxNlx1OTBFOFx1OEJCRlx1OTVFRVxuICAgICAgLy8gaHR0cHM6IHtcbiAgICAgIC8vICAga2V5OiBmcy5yZWFkRmlsZVN5bmMoJy4vY2VydC9sb2NhbGhvc3QrMS1rZXkucGVtJyksXG4gICAgICAvLyAgIGNlcnQ6IGZzLnJlYWRGaWxlU3luYygnLi9jZXJ0L2xvY2FsaG9zdCsxLnBlbScpLFxuICAgICAgLy8gfSwgLy8gXHU1NDJGXHU3NTI4aHR0cHNcbiAgICAgIHBvcnQ6IDMwMDAsICAvLyBcdTYzMDdcdTVCOUFcdTdBRUZcdTUzRTNcdTUzRjdcbiAgICB9LFxuICAgIHBsdWdpbnM6IFtcbiAgICAgIC8vIFx1OERFRlx1NzUzMVx1ODFFQVx1NTJBOFx1OTE0RFx1N0Y2RVxuICAgICAgVnVlUm91dGVyKHtcbiAgICAgICAgcm91dGVzRm9sZGVyOiAnc3JjL3BhZ2VzJyxcbiAgICAgICAgZXhjbHVkZTogWycqKi9jb21wb25lbnRzLyoudnVlJ10sXG4gICAgICAgIGV4dGVuc2lvbnM6IFsnLnZ1ZSddLFxuICAgICAgICAvLyBcdTgxRUFcdTVCOUFcdTRFNDkgPHJvdXRlPiBcdTZBMjFcdTU3NTdcbiAgICAgICAgcm91dGVCbG9ja0xhbmc6ICdqc29uNScsXG5cbiAgICAgIH0pLFxuXG4gICAgICB2dWUoKSxcbiAgICAgIC8vIGJhc2ljU1NMKCksIC8vIFx1NjcyQ1x1NTczMFx1NjcwRFx1NTJBMVx1NUYwMFx1NTQyRmh0dHBzXHU3Njg0XHU4MUVBXHU3QjdFXHU1NDBEXHU4QkMxXHU0RTY2XG4gICAgICAvLyBlbGUgXHU4MUVBXHU1MkE4XHU1QkZDXHU1MTY1XG4gICAgICBBdXRvSW1wb3J0KHtcbiAgICAgICAgcmVzb2x2ZXJzOiBbRWxlbWVudFBsdXNSZXNvbHZlcigpXSxcbiAgICAgICAgaW1wb3J0czogW1xuICAgICAgICAgIFZ1ZVJvdXRlckF1dG9JbXBvcnRzLFxuICAgICAgICAgIHsgJ3Z1ZS1yb3V0ZXIvYXV0byc6IFsndXNlTGluayddIH1cbiAgICAgICAgXVxuICAgICAgfSksXG4gICAgICBDb21wb25lbnRzKHtcbiAgICAgICAgcmVzb2x2ZXJzOiBbRWxlbWVudFBsdXNSZXNvbHZlcigpXVxuICAgICAgfSksXG5cblxuXG4gICAgXSxcbiAgfVxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBK1QsU0FBUyxjQUFjLGVBQWU7QUFDclcsT0FBTyxTQUFTO0FBR2hCLE9BQU8sZ0JBQWdCO0FBQ3ZCLE9BQU8sZ0JBQWdCO0FBQ3ZCLFNBQVMsMkJBQTJCO0FBRXBDLE9BQU8sZUFBZTtBQUN0QixTQUFTLDRCQUE0QjtBQUlyQyxJQUFPLHNCQUFRLGFBQWEsQ0FBQyxFQUFFLFNBQVMsTUFBTSxTQUFTLE1BQU07QUFFM0QsUUFBTSxTQUFTLFFBQVEsTUFBTSxRQUFRLElBQUksQ0FBQztBQUMxQyxRQUFNLE1BQU0sU0FBUyxnQkFBZ0IsT0FBTywyQkFBMkIsT0FBTztBQUM5RSxTQUFPO0FBQUEsSUFFTCxRQUFRO0FBQUEsTUFDTixNQUFNO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLE1BS04sTUFBTTtBQUFBO0FBQUEsSUFDUjtBQUFBLElBQ0EsU0FBUztBQUFBO0FBQUEsTUFFUCxVQUFVO0FBQUEsUUFDUixjQUFjO0FBQUEsUUFDZCxTQUFTLENBQUMscUJBQXFCO0FBQUEsUUFDL0IsWUFBWSxDQUFDLE1BQU07QUFBQTtBQUFBLFFBRW5CLGdCQUFnQjtBQUFBLE1BRWxCLENBQUM7QUFBQSxNQUVELElBQUk7QUFBQTtBQUFBO0FBQUEsTUFHSixXQUFXO0FBQUEsUUFDVCxXQUFXLENBQUMsb0JBQW9CLENBQUM7QUFBQSxRQUNqQyxTQUFTO0FBQUEsVUFDUDtBQUFBLFVBQ0EsRUFBRSxtQkFBbUIsQ0FBQyxTQUFTLEVBQUU7QUFBQSxRQUNuQztBQUFBLE1BQ0YsQ0FBQztBQUFBLE1BQ0QsV0FBVztBQUFBLFFBQ1QsV0FBVyxDQUFDLG9CQUFvQixDQUFDO0FBQUEsTUFDbkMsQ0FBQztBQUFBLElBSUg7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
