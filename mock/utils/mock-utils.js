// mock/utils/mock-utils.js
import {mock} from "better-mock";
let users = []

export const mockDB = {
    // 创建用户
    createUser(user) {
        users.push({
            id: BetterMock.mock('@id'),
            ...user,
            createTime: new Date().toISOString()
        })
    },

    // 查询用户
    findUsers(query) {
        return users.filter(user => {
            return Object.entries(query).every(([key, value]) => {
                return user[key] === value
            })
        })
    }
}

// 在接口中使用
mock('/api/users', 'post', (options) => {
    const newUser = JSON.parse(options.body)
    mockDB.createUser(newUser)
    return { code: 200, message: '创建成功' }
})

mock('/api/users', 'get', (options) => {
    const query = BetterMock.parseUrl(options.url).query
    return {
        code: 200,
        data: mockDB.findUsers(query)
    }
})