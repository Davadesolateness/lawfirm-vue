import orderList from './orderlist'


export default [
    {
        path: "/order",
        component: orderList,
        hidden: true,
        children: [
            {
                path: "orderList",
                name: "orderList",
                component: () => import("@/pages/order/orderList"),
/*                props: (route) => route.params,*/
                meta: { title: "订单信息", icon: "dashboard", affix: true, parentTitle: "订单信息", parentPath: "" }
            }
        ]
    }
];