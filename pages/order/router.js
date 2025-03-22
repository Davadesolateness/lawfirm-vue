import order from './orderlist'


export default [
    {
        path: "/order",
        component: order,
        hidden: true,
        children: [
            /* 用户信息主页 */
            {
                path: "orderList",
                name: "orderList",
                component: () => import("./orderList"),
                props: (route) => route.params,
                meta: { title: "订单信息", icon: "dashboard", affix: true, parentTitle: "用户信息", parentPath: "" }
            },
        ]
    }
]