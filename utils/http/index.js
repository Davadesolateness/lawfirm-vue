import {BASE_CONFIG} from './config'
import {requestInterceptor, responseInterceptor} from './interceptor'
import {getCache, getToken, setCache, setToken} from '@/utils/store/cacheManager'

class HttpRequest {
    constructor() {
        this.config = {...BASE_CONFIG}
    }

    // 设置全局配置
    setConfig(config) {
        this.config = {...this.config, ...config}
    }

    // 核心请求方法
    async request(options) {
        // 合并配置
        const config = {
            ...this.config,
            ...options,
            header: {...this.config.header, ...(options.header || {})},
            custom: {...this.config.custom, ...(options.custom || {})}
        }

        // 自动添加Token逻辑
        if (!config.custom.noAuth) {
            const token = getToken()
            if (token) {
                config.header = {
                    ...config.header,
                    Authorization: `Bearer ${token}`
                }
            }
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
                console.log(`请求重试: ${config.url}, 第${retryCount + 1}次`)
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

    // 免token的post请求
    postWithoutToken(url, data, options = {}) {
        return this.post(url, data, {
            ...options,
            custom: {
                ...options.custom,
                noAuth: true  // 设置不需要认证
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
    // 修改后的uploadFile方法（移除手动Token处理）
    uploadFile(url, filePath, options = {}) {
        return new Promise((resolve, reject) => {
            const uploadTask = uni.uploadFile({
                url: this.config.baseURL + url,
                filePath,
                name: options.name || 'file',
                formData: options.formData || {},
                header: options.header || {},  // 依赖全局header合并
                success: (res) => {
                    try {
                        const data = JSON.parse(res.data)
                        resolve(data)
                    } catch (e) {
                        resolve(res.data)
                    }
                },
                fail: (err) => {
                    reject(err)
                }
            })

            if (options.onProgress) {
                uploadTask.onProgressUpdate((res) => {
                    options.onProgress(res.progress)
                })
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
        let aborted = false;

        const requestPromise = new Promise((resolve, reject) => {
            const task = uni.request({
                url: this.config.baseURL + url,
                data,
                method: 'POST',
                header: {
                    ...this.config.header,
                    ...(options.header || {})
                },
                success: (res) => {
                    if (!aborted) {
                        resolve(responseInterceptor.onSuccess(res));
                    }
                },
                fail: (err) => {
                    if (!aborted) {
                        reject(err);
                    }
                }
            });

            // 添加取消方法
            requestPromise.abort = () => {
                aborted = true;
                task.abort();
            };
        });

        return requestPromise;
    }

    // 带缓存的post请求
    async postWithCache(url, data, options = {}) {
        const cacheKey = `http_cache_${url}_${JSON.stringify(data)}`
        const cacheTime = options.cacheTime || 5 * 60 * 1000 // 默认缓存5分钟

        // 检查是否有缓存
        const cachedData = getCache(cacheKey)
        if (cachedData) {
            return cachedData
        }

        // 无缓存，发起请求
        const response = await this.post(url, data, options)
        // 缓存响应数据
        setCache(cacheKey, response, cacheTime)
        return response
    }

    // 处理登录响应，自动保存token
    handleLoginResponse(response) {
        if (response && response.token) {
            // 设置token
            setToken(response.token, response.tokenExpireTime);
            console.log('Token已保存:', response.token);
        } else {
            console.warn('响应中没有找到token');
        }
        return response;
    }

    // 登录并保存token
    login(url, data, options = {}) {
        return this.postWithoutToken(url, data, options)
            .then(response => this.handleLoginResponse(response));
    }
}

// 创建实例
const http = new HttpRequest()

export default http