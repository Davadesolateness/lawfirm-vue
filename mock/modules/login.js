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

// 模拟验证码
const mockVerificationCodes = new Map()

// 生成随机验证码
function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// 手机号登录
export function mockPhoneLogin(data) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const { phone, code, role } = data
      
      // 验证手机号格式
      if (!/^1[3-9]\d{9}$/.test(phone)) {
        reject(new Error('手机号格式不正确'))
        return
      }
      
      // 验证验证码
      const storedCode = mockVerificationCodes.get(phone)
      if (!storedCode || storedCode !== code) {
        reject(new Error('验证码错误'))
        return
      }
      
      // 查找用户
      const user = mockUsers.find(u => u.phone === phone && u.role === role)
      if (!user) {
        reject(new Error('用户不存在'))
        return
      }
      
      // 清除验证码
      mockVerificationCodes.delete(phone)
      
      resolve({
        code: 200,
        message: '登录成功',
        data: {
          token: user.token,
          userData: user.userInfo
        }
      })
    }, 1000)
  })
}

// 账号密码登录
export function mockAccountLogin(data) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const { username, password, role } = data
      
      // 查找用户
      const user = mockUsers.find(u => 
        u.username === username && 
        u.password === password && 
        u.role === role
      )
      
      if (!user) {
        reject(new Error('账号或密码错误'))
        return
      }
      
      resolve({
        code: 200,
        message: '登录成功',
        data: {
          token: user.token,
          userData: user.userInfo
        }
      })
    }, 1000)
  })
}

// 微信登录
export function mockWechatLogin(data) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const { code, userInfo, role } = data
      
      // 模拟微信登录成功
      const user = mockUsers.find(u => u.role === role)
      if (!user) {
        reject(new Error('登录失败'))
        return
      }
      
      // 更新用户信息
      user.userInfo = {
        ...user.userInfo,
        ...userInfo
      }
      
      resolve({
        code: 200,
        message: '登录成功',
        data: {
          token: user.token,
          userData: user.userInfo
        }
      })
    }, 1000)
  })
}

// 发送验证码
export function mockSendVerificationCode(phone) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 验证手机号格式
      if (!/^1[3-9]\d{9}$/.test(phone)) {
        reject(new Error('手机号格式不正确'))
        return
      }
      
      // 生成验证码
      const code = generateVerificationCode()
      mockVerificationCodes.set(phone, code)
      
      // 模拟发送验证码
      console.log(`向 ${phone} 发送验证码: ${code}`)
      
      resolve({
        code: 200,
        message: '验证码已发送',
        data: {
          phone,
          code
        }
      })
    }, 1000)
  })
}

// 验证手机号
export function mockVerifyPhone(phone) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 验证手机号格式
      if (!/^1[3-9]\d{9}$/.test(phone)) {
        reject(new Error('手机号格式不正确'))
        return
      }
      
      // 检查手机号是否已注册
      const isRegistered = mockUsers.some(u => u.phone === phone)
      
      resolve({
        code: 200,
        message: '验证成功',
        data: {
          phone,
          isRegistered
        }
      })
    }, 1000)
  })
}

// 刷新token
export function mockRefreshToken() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const token = uni.getStorageSync('token')
      if (!token) {
        reject(new Error('token不存在'))
        return
      }
      
      // 查找用户
      const user = mockUsers.find(u => u.token === token)
      if (!user) {
        reject(new Error('token无效'))
        return
      }
      
      // 生成新token
      const newToken = `${user.token}_${Date.now()}`
      user.token = newToken
      
      resolve({
        code: 200,
        message: '刷新成功',
        data: {
          token: newToken
        }
      })
    }, 1000)
  })
}

// 退出登录
export function mockLogout() {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 清除本地存储
      uni.removeStorageSync('token')
      uni.removeStorageSync('userInfo')
      
      resolve({
        code: 200,
        message: '退出成功'
      })
    }, 1000)
  })
}
