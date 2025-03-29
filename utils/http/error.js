export function handleError(error) {
    const errorMap = {
        400: '请求参数错误',
        401: () => {
            uni.navigateTo({ url: '/pages/login/login' })
            return '登录已过期，请重新登录'
        },
        403: '没有操作权限',
        404: '请求资源不存在',
        500: '服务器内部错误',
        502: '网关错误',
        503: '服务不可用',
        504: '网关超时'
    }

    const message = errorMap[error.code]
        ? typeof errorMap[error.code] === 'function'
            ? errorMap[error.code]()
            : errorMap[error.code]
        : error.message || '未知错误'

    // 显示错误提示
    uni.showToast({
        title: message,
        icon: 'none',
        duration: 3000
    })
}