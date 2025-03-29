import { mock } from 'better-mock'

// 基础配置
const config = {
    baseURL: 'http://localhost:5173', // 基础请求地址
    header: { 'Content-Type': 'application/json' }, // 默认请求头
    timeout: 10000, // 超时时间（毫秒）
    withCredentials: false // 跨域请求时是否需要凭证
}

// 请求拦截器
const requestInterceptor = {
    invoke(options) {
        // 显示加载提示
        !options.hideLoading && uni.showLoading({ title: '加载中...', mask: true })

        // 设置自定义请求头（如 token）
        const token = uni.getStorageSync('token')
        if (token) {
            options.header = {
                ...options.header,
                'Authorization': `Bearer ${token}`
            }
        }

        // 处理请求地址
        if (!options.url.startsWith('http')) {
            options.url = config.baseURL + options.url
        }

        return options
    }
}

// 响应拦截器
const responseInterceptor = {
    succeed(response) {
        // 隐藏加载提示
        uni.hideLoading()

        const { data: res, statusCode } = response

        // HTTP 状态码判断
        if (statusCode !== 200) {
            return Promise.reject(new Error(`请求失败，状态码：${statusCode}`))
        }

        // 业务状态码判断（根据后端约定修改）
        if (res.code !== 200) {
            handleBusinessError(res.code, res.message)
            return Promise.reject(res)
        }

        return res.data
    },
    fail(error) {
        // 隐藏加载提示
        uni.hideLoading()

        // 处理网络错误
        handleNetworkError(error)
        return Promise.reject(error)
    }
}

// 处理业务错误
function handleBusinessError(code, message) {
    const errorMap = {
        401: () => {
            uni.navigateTo({ url: '/pages/login/login' })
            uni.showToast({ title: '登录已过期，请重新登录', icon: 'none' })
        },
        403: () => {
            uni.showToast({ title: '没有权限访问', icon: 'none' })
        },
        // 添加更多业务错误处理...
    }

    errorMap[code] ? errorMap[code]() : uni.showToast({ title: message || '请求失败', icon: 'none' })
}

// 处理网络错误
function handleNetworkError(error) {
    const errorMessage = {
        0: '网络连接失败，请检查网络',
        1: '请求超时，请稍后重试',
        // 添加更多错误码...
    }[error.errno] || '请求失败，请稍后重试'

    uni.showToast({ title: errorMessage, icon: 'none' })
}

// 创建请求方法
function createRequest(options) {
    options = { ...config, ...options }
    options = requestInterceptor.invoke(options)

    return new Promise((resolve, reject) => {
        uni.request({
            ...options,
            success: (res) => {
                responseInterceptor.succeed(res)
                    .then(resolve)
                    .catch(reject)
            },
            fail: (err) => {
                responseInterceptor.fail(err)
                    .catch(reject)
            }
        })
    })
}

// 封装常用方法
const http = {
    get(url, data, options = {}) {
        return createRequest({
            url,
            data,
            method: 'GET',
            ...options
        })
    },

    post(url, data, options = {}) {
        return createRequest({
            url,
            data,
            method: 'POST',
            ...options
        })
    },

    put(url, data, options = {}) {
        return createRequest({
            url,
            data,
            method: 'PUT',
            ...options
        })
    },

    delete(url, data, options = {}) {
        return createRequest({
            url,
            data,
            method: 'DELETE',
            ...options
        })
    },

    upload(url, filePath, name = 'file', options = {}) {
        return createRequest({
            url,
            method: 'POST',
            header: {
                'Content-Type': 'multipart/form-data'
            },
            filePath,
            name,
            ...options
        })
    }
}

export default http