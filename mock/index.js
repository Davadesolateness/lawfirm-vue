import BetterMock from 'better-mock'

// 仅在开发环境启用
if (process.env.NODE_ENV === 'development') {
    // 初始化配置
    BetterMock.setup({
        timeout: '200-600ms', // 请求延迟
        debug: true,          // 开启调试模式
        log: true             // 显示请求日志
    })

    // 动态加载所有接口模块
    const context = require.context('./api', true, /\.js$/)
    context.keys().forEach(key => context(key))
    console.log('[Better-Mock] 数据模拟已启用')
}