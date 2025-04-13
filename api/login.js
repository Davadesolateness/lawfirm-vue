import http from "@/utils/http/index";

// 手机号登录
export function phoneLogin(data) {
  return http.postWithRetry('/auth/phoneLogin', {
    phone: data.phone,
    code: data.code,
    role: data.role
  });
}

// 账号密码登录
export function accountLogin(data) {
  return http.postWithTimeout('/auth/account-login', {
    username: data.username,
    password: data.password,
    role: data.role
  });
}

// 微信登录
export function wechatLogin(data) {
  return http.postWithRetry('/auth/wechat-login', {
    code: data.code,
    userInfo: data.userInfo,
    role: data.role
  });
}

// 发送验证码
export function sendVerificationCode(phone) {
  return http.postWithTimeout('/auth/sendCode', { phone });
}

// 验证手机号
export function verifyPhone(phone) {
  return http.postWithTimeout('/auth/verify-phone', { phone });
}

// 刷新token
export function refreshToken() {
  return http.postWithToken('/auth/refresh-token');
}

// 退出登录
export function logout() {
  return http.postWithToken('/auth/logout');
}

