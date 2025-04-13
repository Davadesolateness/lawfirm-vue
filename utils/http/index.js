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

    // 基础post请求
    post(url, data, options = {}) {
        return this.request({
            url,
            data,
            method: 'POST',
            ...options
        })
    }

    // 带token的post请求
    postWithToken(url, data, options = {}) {
        const token = uni.getStorageSync('token')
        return this.post(url, data, {
            ...options,
            header: {
                ...options.header,
                'Authorization': `Bearer ${token}`
            }
        })
    }

    // 带重试的post请求
    postWithRetry(url, data, options = {}) {
        return this.post(url, data, {
            ...options,
            custom: {
                ...options.custom,
                retry: 3
            }
        })
    }

    // 带超时的post请求
    postWithTimeout(url, data, options = {}) {
        return this.post(url, data, {
            ...options,
            timeout: 10000
        })
    }

    // 带进度回调的post请求
    postWithProgress(url, data, options = {}) {
        return this.post(url, data, {
            ...options,
            custom: {
                ...options.custom,
                onProgress: (progress) => {
                    console.log('上传进度:', progress)
                }
            }
        })
    }

    // 上传文件
    uploadFile(url, filePath, options = {}) {
        return this.postWithProgress(url, {
            file: filePath
        }, {
            ...options,
            header: {
                'Content-Type': 'multipart/form-data'
            }
        })
    }

    // 批量请求
    batchPost(requests) {
        return Promise.all(requests.map(req => 
            this.post(req.url, req.data, req.options)
        ))
    }

    // 带取消功能的post请求
    cancellablePost(url, data, options = {}) {
        const controller = new AbortController()
        const signal = controller.signal
        
        const request = this.post(url, data, {
            ...options,
            signal
        })
        
        request.cancel = () => controller.abort()
        return request
    }

    // 带缓存的post请求
    postWithCache(url, data, options = {}) {
        const cacheKey = `${url}_${JSON.stringify(data)}`
        const cachedData = uni.getStorageSync(cacheKey)
        
        if (cachedData) {
            return Promise.resolve(cachedData)
        }
        
        return this.post(url, data, options).then(response => {
            uni.setStorageSync(cacheKey, response)
            return response
        })
    }

    // 带重定向的post请求
    postWithRedirect(url, data, options = {}) {
        return this.post(url, data, {
            ...options,
            custom: {
                ...options.custom,
                followRedirect: true
            }
        })
    }

    // 带压缩的post请求
    postWithCompression(url, data, options = {}) {
        return this.post(url, data, {
            ...options,
            header: {
                ...options.header,
                'Accept-Encoding': 'gzip, deflate'
            }
        })
    }

    // 带自定义错误处理的post请求
    postWithErrorHandler(url, data, options = {}) {
        return this.post(url, data, {
            ...options,
            custom: {
                ...options.custom,
                errorHandler: (error) => {
                    console.error('请求错误:', error)
                    // 自定义错误处理逻辑
                }
            }
        })
    }
}

// 创建实例
const http = new HttpRequest()

export default http