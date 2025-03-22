import user from './user'


export default [
    {
        path: "/user",
        component: user,
        hidden: true,
        children: [
            /* 用户信息主页 */
            {
                path: "userInfo",
                name: "userInfo",
                component: () => import("@/pages/user/user"),
                meta: { title: "用户信息", icon: "dashboard", affix: true, parentTitle: "用户信息", parentPath: "" }
            },
    ]
    }
]