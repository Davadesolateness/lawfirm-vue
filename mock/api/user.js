import { mock } from 'better-mock'

// 模拟登录接口
mock('/api/login', 'post', (options) => {
    const { username, password } = JSON.parse(options.body)

    if(username === 'admin' && password === '123456') {
        return {
            code: 200,
            data: {
                token: mock('@guid'),
                userInfo: {
                    id: mock('@id'),
                    name: mock('@cname'),
                    avatar: mock('@image(100x100)')
                }
            }
        }
    }

    return {
        code: 401,
        message: '用户名或密码错误'
    }
})

// 带参数的 GET 请求
mock(/\/api\/user\/\d+/, 'get', (options) => {
    const id = options.url.match(/\d+$/)[0]

    return {
        code: 200,
        data: {
            id,
            name: mock('@cname'),
            age: mock('@integer(18,60)'),
            address: mock('@county(true)')
        }
    }
})