import { createMemoryHistory, createRouter } from 'vue-router'


export const constantRoutes = [

]

// 创建路由
const router = createRouter({
    history: createMemoryHistory(),
    constantRoutes,
})