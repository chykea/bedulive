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

2. 流媒体服务启动
- 本项目所使用的流媒体服务为srs中的rtc, 所以在启动前需要开启rtc-to-rtmp(在rtc-to-rtmp.conf进行配置)
- 启动命令: `./objs/srs -c conf/rtc.conf`
- http服务接口在 `/root/srs/trunk/src/app` 目录下, 对应文件的前缀为 srs-app-rtc
> srs-app-rtc-server 为开启http服务文件
> srs-app-rtc-conn 为处理与客户端建立连接的文件
> srs-app-rtc-sdp 生成answer sdp
> srs-app-rtc-api 处理http请求的文件
