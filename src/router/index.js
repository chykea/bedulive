import { createRouter, createWebHistory } from 'vue-router/auto';
import { getToken } from '../utils/util'
import { ElMessage } from 'element-plus';
const router = createRouter({
    extendRoutes: (routes) => {
        // 在自动生成的routes数组,对符合条件的路由进行加工
        const route = routes.map(r => {
            // 重定向
            return r.path === '/user' ? { ...r, redirect: '/user/login' } : r;
        })
        // console.log(route);
        // 返回结果一定是routes,自动配置中会把返回的routes作为路由规则

        return route
    },
    history: createWebHistory(import.meta.env.BASE_URL),
});
// 全局拦截
router.beforeEach((to, from, next) => {
    // 如果本地有token,则禁止跳转登录或注册
    if ((to.path.includes('login') || to.path.includes('register')) && getToken()) {
        ElMessage({ message: '您已登录', type: 'warning' })
        next(from.path)
        return
    }
    // // 如果没有token,则跳转登录
    // if (!getToken() && (to.path !== '/user/login' || to.path !== '/user/register')) {
    //     ElMessage({ message: '请先登录', type: 'warning' })
    //     next('/user/login')
    //     return
    // }

    next();
})
export default router;