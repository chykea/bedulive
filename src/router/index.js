import { createRouter, createWebHistory } from 'vue-router/auto';

const router = createRouter({
    extendRoutes: (routes) => {
        // 返回结果一定是routes,自动配置中会把返回的routes作为路由规则
        console.log(routes);
        return routes
    },
    history: createWebHistory(import.meta.env.BASE_URL),
});
// 全局拦截
router.beforeEach((to, from, next) => {
    // if (to.path === '/user')
    next();
})
export default router;