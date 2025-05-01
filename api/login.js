import http from "@/utils/http/index";

// 手机号登录
export function phoneLogin(data) {
  return http.post("/auth/loginByPhone", data);
}

// 账号密码登录
export function accountLogin(data) {
  return http.post("/auth/loginByPassword", data);
}

// 微信登录
export function wechatLogin(data) {
  return http.post("/auth/loginByWechat", data);
}

// 发送验证码
export function sendVerificationCode(phone) {
  return http.post("/auth/sendCode", {
    phone: phone
  });
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

// 修改密码
export function resetPassword(data) {
  return http.post("/auth/resetPassword", data);
}

