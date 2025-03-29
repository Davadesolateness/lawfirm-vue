import { BASE_CONFIG, HTTP_STATUS } from './config'
import { requestInterceptor, responseInterceptor } from './interceptor'
import { handleError } from './error'

class HttpRequest {
    constructor() {
        this.config = { ...BASE_CONFIG }
    }

    // 设置全局配置
    setConfig(config) {
        this.config = { ...this.config, ...config }
    }

    // 核心请求方法
    async request(options) {
        // 合并配置
        const config = {
            ...this.config,
            ...options,
            header: { ...this.config.header, ...(options.header || {}) },
            custom: { ...this.config.custom, ...(options.custom || {}) }
        }

        try {
            // 请求拦截
            const processedConfig = requestInterceptor.onRequest(config)

            // 发起请求
            const response = await this._requestWithRetry(processedConfig)

            // 响应拦截
            return responseInterceptor.onSuccess(response)
        } catch (error) {
            return responseInterceptor.onError(error)
        }
    }

    // 带重试的请求
    async _requestWithRetry(config, retryCount = 0) {
        try {
            return await this._baseRequest(config)
        } catch (error) {
            if (retryCount < config.custom.retry) {
                return this._requestWithRetry(config, retryCount + 1)
            }
            throw error
        }
    }

    // 基础请求
    _baseRequest(config) {
        return new Promise((resolve, reject) => {
            uni.request({
                ...config,
                success: (res) => resolve(res),
                fail: (err) => reject(err)
            })
        })
    }

    // 快捷方法
    get(url, data, options = {}) {
        return this.request({
            url,
            data,
            method: 'GET',
            ...options
        })
    }

    post(url, data, options = {}) {
        return this.request({
            url,
            data,
            method: 'POST',
            ...options
        })
    }

    // 其他方法同理...
}

// 创建实例
const http = new HttpRequest()

export default http