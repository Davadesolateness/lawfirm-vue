import Mock from 'better-mock'

// 提取 URL 到配置
const BASE_URL = 'http://localhost:5173'

// 提取 Mock 数据到常量
// /mock/index.js

// 示例：模拟 GET 请求
Mock.mock('/api/user', 'GET', {
    code: 200,
    data: {
        'id|1-100': 1,
        name: '@cname',
        avatar: Mock.Random.image('100x100'),
        address: '@county(true)'
    }
})

// 示例：模拟 POST 请求（动态响应）
Mock.mock('/api/login', 'POST', (options) => {
    const {username, password} = JSON.parse(options.body)
    return {
        code: username === 'admin' ? 200 : 401,
        message: username === 'admin' ? '登录成功' : '账号错误',
        token: Mock.mock('@guid')
    }
})

const MOCK_USER_INFO = {
    code: 200,
    data: {
        'id|1-100': 1,
        name: '@cname',
        avatar: Mock.Random.image('100x100'),
        address: '@county(true)'
    }
};

Mock.mock(BASE_URL + '/getUserInfo', 'GET', (options) => {
    return MOCK_USER_INFO;
});