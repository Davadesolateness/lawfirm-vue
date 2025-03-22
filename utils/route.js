import {createRouter, createWebHashHistory} from 'vue-router';


import userRouter from "@/pages/user/router";
import orderRouter from "@/pages/order/router";

export const constantRoutes = [
    ...userRouter,
    ...orderRouter,
    {
        path: '/:catchAll(.*)',
        name: '404',
        component: () => import('@/pages/order/orderlist')
    }
]

// 创建路由
const route = createRouter({
    history: createWebHashHistory,
    routes: constantRoutes
})

console.log(route.options.routes)
export default route;
