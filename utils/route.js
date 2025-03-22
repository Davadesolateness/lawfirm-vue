import {createMemoryHistory, createRouter} from 'vue-router';
import * as VueRouter from 'vue-router';


import userRouter from "@/pages/user/router";

export const constantRoutes = [
    ...userRouter
]

// 创建路由
const route = createRouter({
    history: createMemoryHistory(),
    routes: constantRoutes
})

export default route;
