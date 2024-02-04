import { createRouter, createWebHistory } from 'vue-router/auto';

const router = createRouter({
    extendRoutes: (routes) => {
        // 在自动生成的routes数组
        const route = routes.map(r => {
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
    // if (to.path === '/user')
    next();
})
export default router;