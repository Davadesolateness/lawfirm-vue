import BetterMock from 'better-mock';
import {parseQueryParams} from "@/mock/utils/mock-utils";

// 提取 URL 到配置
const BASE_URL = 'http://localhost:5173'

// 提取 Mock 数据到常量
// /mock/index.js

// 示例：模拟 GET 请求
BetterMock.mock('/api/user', 'GET', {
    code: 200,
    data: {
        'id|1-100': 1,
        name: '@cname',
        avatar: BetterMock.Random.image('100x100'),
        address: '@county(true)'
    }
})

// 示例：模拟 POST 请求（动态响应）
BetterMock.mock('/api/login', 'POST', (options) => {
    const {username, password} = JSON.parse(options.body)
    return {
        code: username === 'admin' ? 200 : 401,
        message: username === 'admin' ? '登录成功' : '账号错误',
        token: BetterMock.mock('@guid')
    }
})

const MOCK_USER_INFO = {
    code: 200,
    data: [
        {
            id: '111',
            name: '@cname',
            avatar: BetterMock.Random.image('100x100'),
            address: '@county(true)'
        },
        {
            id: '222',
            name: '@cname',
            avatar: BetterMock.Random.image('100x100'),
            address: '@county(true)'
        },
        {
            id: '333',
            username: "future_tech",
            password: "$2a$10$TrHnP1VYJXZ1BzQ7KQoBk.",  // 加密后的密码示例
            email: "contact@futuretech.com",
            phone_number: "13812345678",
            avatar: BetterMock.Random.image('100x100'),
            user_type: "corporate",
            related_entity_id: 1  // 关联 corporate_clients 表的 id=1
        },
        {
            id: '444',
            username: "lina_admin",
            password: "$2a$10$9S8dF7aRqVcT2mHpLxYJNu",
            email: "lina@greenenergy.com",
            phone_number: "13987654321",
            avatar: BetterMock.Random.image('200x200'),
            user_type: "admin",
            related_entity_id: null  // admin 无需关联实体
        },
        {
            id: '555',
            username: "wangxiaoming",
            password: "$2a$10$3ZvM5rKsTqW9fGpDcY6JzO",
            email: "xiaoming@example.com",
            phone_number: "13655556666",
            avatar: BetterMock.Random.image('200x200'),

            user_type: "individual",
            related_entity_id: 1  // 关联 individual_clients 表的 id=1
        }

    ]
};

BetterMock.mock(BASE_URL + '/getUserInfo', 'GET', (options) => {
    let params = parseQueryParams(options.url);
    if (params.id != null) {
        return MOCK_USER_INFO.data.filter(item => item.id === params.id);
    }
    return MOCK_USER_INFO;
});

BetterMock.mock(BASE_URL + '/getUserInfoById', 'GET', (options) => {
    let params = parseQueryParams(options.url);
    if (params.id != null) {
        let dataById = MOCK_USER_INFO.data.filter(item => item.id === params.id);
        return {
            code: 200,
            data: dataById[0]

        }
    }
    return MOCK_USER_INFO;
});

