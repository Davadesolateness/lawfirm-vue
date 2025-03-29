/*
import store from '@/store'
*/
import { HTTP_STATUS } from './config'

// 请求拦截器
export const requestInterceptor = {
    onRequest(config) {
        // 显示加载提示
        if (config.custom.loading) {
            uni.showLoading({ title: '加载中...', mask: true })
        }

        /*// 自动携带 Token
        const token = store.getters.token
        if (token && !config.noAuth) {
            config.header.Authorization = `Bearer ${token}`
        }*/

        // URL 处理
        if (!config.url.startsWith('http')) {
            config.url = config.baseURL + config.url
        }


        return config
    }
}

// 响应拦截器
export const responseInterceptor = {
    onSuccess(response) {
        // 关闭加载提示
        uni.hideLoading()

        const { data: res, statusCode } = response

        // HTTP 状态码处理
        if (statusCode !== HTTP_STATUS.SUCCESS) {
            return Promise.reject({
                code: statusCode,
                message: `请求失败，状态码：${statusCode}`,
                data: res
            })
        }

        // 业务状态码处理（根据后端约定调整）
        if (res.code !== 200) {
            return Promise.reject({
                code: res.code,
                message: res.message || '业务逻辑错误',
                data: res.data
            })
        }

        return res.data
    },

    onError(error) {
        // 关闭加载提示
        uni.hideLoading()

        // 统一错误处理
        handleError(error)
        return Promise.reject(error)
    }
}