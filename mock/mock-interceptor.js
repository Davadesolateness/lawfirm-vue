// /src/utils/mock-interceptor.js
import Mock from 'better-mock'

// 备份原始请求方法
const originalRequest = uni.request

// 创建 Mock 拦截器
export function setupMockInterceptor() {
    // 覆盖 uni.request
    uni.request = function(config) {
        return new Promise((resolve, reject) => {
            // 匹配 Mock 规则
            const matchResult = Mock.mock(config.url, config.method, config.data)

            if (matchResult) {
                // 模拟网络延迟
                setTimeout(() => {
                    resolve({
                        data: matchResult,
                        statusCode: 200,
                        header: {},
                        cookies: []
                    })
                }, Mock.Random.integer(200, 500))
            } else {
                // 未匹配的请求走真实接口
                originalRequest({
                    ...config,
                    success: resolve,
                    fail: reject
                })
            }
        })
    }
}