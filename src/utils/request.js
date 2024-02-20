import axios from "axios";
import { ElMessage } from "element-plus";
// useRouter只能在setup中使用
// import { useRouter } from "vue-router";
// 如果在setup之外使用的话,直接引入router的文件即可
import router from '../router/index'
import { getToken } from "./util";



//不同环境下的地址
const tokenPrefix = import.meta.env.VITE_TOKEN_PREFIX
let baseURL = "";

//node中的环境变量process.env,也就是我们新增开发、生产的配置文件
if (import.meta.env.MODE === "development") {

    baseURL = import.meta.env.VITE_APP_DEVELOPMENT_URL //这里可在vue.config.js做一个代理【代理代码见下】
} else {
    baseURL = import.meta.env.VITE_APP_PRODUCTION_URL
}

//创建axios实例
const request = axios.create({
    timeout: 5000,
    baseURL: baseURL
});

//所有请求设置了授权头信息【请求头中设置cookie信息，一直携带，判权】
// axios.defaults.headers.common['Authorization'] = `${cookie}`;
//这里是设置发送json格式参数
axios.defaults.headers.post['Content-Type'] = 'application/json';

const source = axios.CancelToken.source();

//请求拦截器
request.interceptors.request.use(
    //发送之前想要做些什么
    config => {
        // token是否过期，是否重新登陆等等
        // 此处可修改一些基本数据
        // config[baseURL,[data,[headers,[method,[timeout,[url]   等
        //        基础地址,请求参数,头部, 请求方式, 超时,  请求地址  等

        // config.headers.Cookie = "110110110110110110";
        // 如果有token就携带(证明已经登录了),没有就不携带(登录或注册)
        const token = getToken() || ''
        if (token) {
            config.headers.Authorization = tokenPrefix + " " + token
            return config;
        } else {

            const path = router.currentRoute._value.path

            if ((path !== '/user/login' && path !== '/user/register' && path !== '/')) {
                router.push('/user/login')
                ElMessage({ message: '未登录', type: 'warning' })
                source.cancel('未登录，请求取消')
                throw new axios.Cancel('未登录，请求取消')
                // return
            }
            return config
        }

    },
    //方法返回一个带有拒绝原因的 Promise 对象。
    error => Promise.reject(error)
);
/**************移除拦截器****************/
// 动态移除
// const me = axios.interceptors.request.use(function () {/*...*/});
// axios.interceptors.request.eject(me);
/***************************************/

//响应拦截器（对请求结束后进行一些操作，，例如:统一收集报错）
request.interceptors.response.use(
    //请求成功
    res => res.status === 200 ? Promise.resolve(res) : Promise.reject(res),
    //请求失败
    error => {
        //可根据不同的状态去区分不同的错误，达到不同效果
        if (error.response && error.response.status) {
            const { data } = error.response;
            // 如果报错或过期
            if (data.code === '10101' || data.code === '10102') {

                localStorage.removeItem('token')
                localStorage.removeItem('userInfo')
                router.push('/user/login');
            }
            ElMessage({
                message: data.message || 'Error',
                duration: 1500, type: 'error'
            })

        }
        return Promise.reject(error);
    }
);

export default request