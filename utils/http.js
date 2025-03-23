// utils/http.js
let BASE_URL = 'https://api.example.com' // 根据环境变量动态切换更佳

class Http {
    constructor() {
        this.config = {
            baseURL: BASE_URL,
            header: { 'Content-Type': 'application/json' },
            timeout: 10000
        }
    }

    // 核心请求方法
    async request(options) {
        // 合并配置
        const mergedOptions = {
            ...this.config,
            ...options,
            header: { ...this.config.header, ...(options.header || {}) }
        }

        // 请求拦截
        this.interceptors.request(mergedOptions)

        // 发起请求
        return new Promise((resolve, reject) => {
            mergedOptions.success = (res) => {
                // 响应拦截
                const handledRes = this.interceptors.response(res)
                resolve(handledRes)
            }

            mergedOptions.fail = (err) => {
                this.handleError(err)
                reject(err)
            }

            uni.request(mergedOptions)
        })
    }

    // 快捷方法
    get(url, data, options = {}) {
        return this.request({ url, data, method: 'GET', ...options })
    }

    post(url, data, options = {}) {
        return this.request({ url, data, method: 'POST', ...options })
    }

    // 拦截器配置
    interceptors = {
        request: (config) => {
            // 添加全局请求头（如 token）
            const token = uni.getStorageSync('token')
            if (token) config.header.Authorization = `Bearer ${token}`

            // 显示加载状态（可配置是否显示）
            if (config.showLoading !== false) {
                uni.showLoading({ title: '加载中...', mask: true })
            }

            return config
        },

        response: (response) => {
            // 关闭加载状态
            uni.hideLoading()

            // 处理 HTTP 状态码
            if (response.statusCode !== 200) {
                this.handleHttpError(response)
                return Promise.reject(response)
            }

            // 处理业务状态码（假设业务 code 0 为成功）
            const resData = response.data
            if (resData.code !== 0) {
                this.handleBusinessError(resData)
                return Promise.reject(resData)
            }

            return resData.data // 返回核心数据
        }
    }

    // 错误处理
    handleError(err) {
        uni.hideLoading()
        console.error('Request Error:', err)
        uni.showToast({ title: '网络请求失败，请检查网络', icon: 'none' })
    }

    handleHttpError(response) {
        const errorMap = {
            401: () => {
                uni.navigateTo({ url: '/pages/login/login' })
                uni.showToast({ title: '登录已过期', icon: 'none' })
            },
            404: '请求资源不存在',
            500: '服务器错误'
        }
        const message = errorMap[response.statusCode] || `请求错误：${response.statusCode}`
        uni.showToast({ title: message, icon: 'none' })
    }

    handleBusinessError(resData) {
        const errorMap = {
            1001: '参数错误',
            1002: '权限不足',
            // ...其他业务错误码
        }
        const message = errorMap[resData.code] || resData.message || '请求失败'
        uni.showToast({ title: message, icon: 'none' })
    }
}

// 导出实例
export const http = new Http()