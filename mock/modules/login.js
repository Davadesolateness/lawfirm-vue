import BetterMock from 'better-mock';
import {parseQueryParams} from "@/mock/utils/mock-utils";

// 提取 URL 到配置
const BASE_URL = 'http://localhost:5173'


// 模拟验证码
const mockVerificationCodes = new Map()

// 生成随机验证码
function generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString()
}

// 发送验证码
BetterMock.mock(BASE_URL + '/auth/sendCode', 'POST', {
    code: 200,
    message: '验证码已发送',
    data: {
        phone: '@phone',
        code: '@string("number", 6)',
        expireTime: '@datetime("yyyy-MM-dd HH:mm:ss")'
    }
})

// 验证手机号
BetterMock.mock('/api/login/verifyPhone', 'POST', {
    code: 200,
    message: '验证成功',
    data: {
        phone: '@phone',
        isRegistered: '@boolean'
    }
})

// 手机号登录
BetterMock.mock(BASE_URL + '/auth/phoneLogin', 'POST', {
    code: 200,
    message: '登录成功',
    data: {
        token: '@string(32)',
        userData: {
            userId: '@string("number", 4)',
            userName: '@cname',
            userType: "user",
            avatarUrl: '@image("100x100")',
            phone: '@phone'
        }
    }
})

// 账号密码登录
BetterMock.mock('/api/login/account', 'POST', {
    code: 200,
    message: '登录成功',
    data: {
        token: '@string(32)',
        userData: {
            userId: '@string("number", 4)',
            userName: '@cname',
            userType: '@pick(["user", "lawyer", "admin"])',
            avatarUrl: '@image("100x100")',
            phone: '@phone'
        }
    }
})

// 微信登录
BetterMock.mock('/api/login/wechat', 'POST', {
    code: 200,
    message: '登录成功',
    data: {
        token: '@string(32)',
        userData: {
            userId: '@string("number", 4)',
            userName: '@cname',
            userType: '@pick(["user", "lawyer", "admin"])',
            avatarUrl: '@image("100x100")',
            phone: '@phone'
        }
    }
})

// 刷新token
BetterMock.mock('/api/login/refreshToken', 'POST', {
    code: 200,
    message: '刷新成功',
    data: {
        token: '@string(32)'
    }
})

// 退出登录
BetterMock.mock('/api/login/logout', 'POST', {
    code: 200,
    message: '退出成功'
})


// 模拟用户数据
const mockUsers = [
    {
        id: '1001',
        username: 'user1',
        password: '123456',
        phone: '13800138000',
        role: 'user',
        token: 'user_token_1001',
        userInfo: {
            userId: '1001',
            userName: '普通用户',
            userType: 'user',
            avatarUrl: '/static/default_avatar.jpg',
            phone: '13800138000'
        }
    },
    {
        id: '2001',
        username: 'lawyer1',
        password: '123456',
        phone: '13800138001',
        role: 'lawyer',
        token: 'lawyer_token_2001',
        userInfo: {
            userId: '2001',
            userName: '张律师',
            userType: 'lawyer',
            avatarUrl: '/static/lawyer_avatar.jpg',
            phone: '13800138001',
            title: '高级律师',
            experience: '10年',
            specialty: '刑事辩护'
        }
    },
    {
        id: '3001',
        username: 'admin',
        password: '123456',
        phone: '13800138002',
        role: 'admin',
        token: 'admin_token_3001',
        userInfo: {
            userId: '3001',
            userName: '管理员',
            userType: 'admin',
            avatarUrl: '/static/admin_avatar.jpg',
            phone: '13800138002'
        }
    }
]