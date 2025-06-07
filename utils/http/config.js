// 全局配置
export const BASE_CONFIG = {
    baseURL: 'http://localhost:8080', // 从环境变量获取
    //baseURL: 'http://121.40.67.3:8080',
    timeout: 15000, // 默认超时时间
    header: {
        'Content-Type': 'application/json'
    },
    withCredentials: false,
    // 自定义扩展配置
    custom: {
        retry: 2, // 请求重试次数
        loading: true // 默认显示加载提示
    }
}

// 状态码映射
export const HTTP_STATUS = {
    SUCCESS: 200,
    CREATED: 201,
    ACCEPTED: 202,
    CLIENT_ERROR: 400,
    AUTHENTICATE: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    SERVER_ERROR: 500,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
    GATEWAY_TIMEOUT: 504
}