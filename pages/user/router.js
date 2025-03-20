import user from './user'


export default [
    {
        path: "/user",
        component: user,
        hidden: true,
        children: [
            {
                path: "aa",
                name: "aa",
                component: () => import(/* webpackChunkName: "approve" */ "./ApproveBusinessQueryList"),
                props: (route) => route.query,
                meta: {  }
            }]
    }
]