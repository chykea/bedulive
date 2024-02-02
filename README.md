# 基于流媒体服务的直播平台
### 开发中需要注意的问题
1. 项目中使用unplugin-vue-router自动生成路由,如果要生成嵌套路由，并且在父路由组件中显示子路由组件，那么目录的结构需要按照如下
```
src/pages/
├── login/
│   └── index.vue
├── register/
│   └── index.vue
└── users.vue
```