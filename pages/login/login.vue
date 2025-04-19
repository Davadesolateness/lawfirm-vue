<template>
  <view class="login-container">
    <!-- 顶部logo区域 -->
    <view class="logo-section">
      <image class="logo-image" src="/static/logo.png" mode="aspectFit"></image>
      <text class="app-name">律师咨询平台</text>
      <text class="app-slogan">专业法律咨询，一键直达</text>
    </view>

    <!-- 登录表单区域 -->
    <view class="login-form">
      <!-- 登录方式切换 -->
      <view class="login-tabs">
        <view
            class="tab-item"
            :class="{ active: loginType === 'phone' }"
            @click="loginType = 'phone'"
        >
          手机号登录
        </view>
        <view
            class="tab-item"
            :class="{ active: loginType === 'account' }"
            @click="loginType = 'account'"
        >
          账号密码登录
        </view>
      </view>

      <!-- 手机号登录表单 -->
      <view v-if="loginType === 'phone'" class="form-content">
        <view class="input-group">
          <uni-icons type="phone" size="20" color="#999"></uni-icons>
          <input
              type="number"
              v-model="phoneNumber"
              maxlength="11"
              placeholder="请输入手机号码"
              @blur="validatePhoneNumber"
          />
        </view>
        <text v-if="phoneError" class="error-tip">{{ phoneError }}</text>

        <view class="input-group verification-code">
          <uni-icons type="locked" size="20" color="#999"></uni-icons>
          <input
              type="number"
              v-model="verificationCode"
              maxlength="6"
              placeholder="请输入验证码"
          />
          <view
              class="send-code-btn"
              :class="{ disabled: isSending || !isPhoneValid }"
              @click="sendVerificationCodeForUser"
          >
            {{ sendBtnText }}
          </view>
        </view>
      </view>

      <!-- 账号密码登录表单 -->
      <view v-else class="form-content">
        <view class="input-group">
          <uni-icons type="person" size="20" color="#999"></uni-icons>
          <input
              type="text"
              v-model="phoneNumber"
              placeholder="请输入手机号"
          />
        </view>

        <view class="input-group">
          <uni-icons type="locked" size="20" color="#999"></uni-icons>
          <input
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              placeholder="请输入密码"
              @blur="validatePassword"
          />
          <view class="password-toggle" @click="showPassword = !showPassword">
            <uni-icons :type="showPassword ? 'eye-slash' : 'eye'" size="20" color="#999"></uni-icons>
          </view>
        </view>
        <text v-if="passwordError" class="error-tip">{{ passwordError }}</text>
      </view>

      <!-- 用户角色选择 -->
      <view class="role-selection">
        <view class="role-label">您的身份：</view>
        <view class="role-options">
          <view
              class="role-item"
              :class="{ active: selectedRole === 'user' }"
              @click="selectedRole = 'user'"
          >
            <uni-icons type="person" size="16" :color="selectedRole === 'user' ? '#2979FF' : '#999'"></uni-icons>
            <text>我是用户</text>
          </view>
          <view
              class="role-item"
              :class="{ active: selectedRole === 'lawyer' }"
              @click="selectedRole = 'lawyer'"
          >
            <uni-icons type="staff" size="16" :color="selectedRole === 'lawyer' ? '#2979FF' : '#999'"></uni-icons>
            <text>我是律师</text>
          </view>
          <view
              class="role-item"
              :class="{ active: selectedRole === 'admin' }"
              @click="selectedRole = 'admin'"
          >
            <uni-icons type="gear" size="16" :color="selectedRole === 'admin' ? '#2979FF' : '#999'"></uni-icons>
            <text>管理员</text>
          </view>
        </view>
      </view>

      <!-- 登录按钮 -->
      <button class="login-btn" @click="handleLogin">登录</button>

      <!-- 辅助功能区 -->
      <view class="helper-links">
        <text @click="goToRegister">注册账号</text>
        <text @click="goToResetPassword">忘记密码</text>
      </view>
    </view>

    <!-- 其他登录方式 -->
    <view class="other-login">
      <view class="divider">
        <text>其他登录方式</text>
      </view>
      <view class="social-login">
        <view class="social-icon wechat" @click="handleWechatLogin">
          <uni-icons type="weixin" size="28" color="#fff"></uni-icons>
        </view>
      </view>
      <view class="agreement">
        登录即表示同意
        <text class="link">《用户协议》</text>
        和
        <text class="link">《隐私政策》</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import {computed, onMounted, ref} from 'vue';
import {setUserType, USER_TYPES} from '@/utils/store/userManager';
import {loginByPassword, phoneLogin, sendVerificationCode, wechatLogin} from '@/api/login';
import {cacheManager} from '@/utils/store';

// 登录方式
const loginType = ref('phone'); // 'phone' 或 'account'
const selectedRole = ref('user'); // 'user', 'lawyer', 'admin'

// 手机号登录相关
const phoneNumber = ref('');
const verificationCode = ref('');
const phoneError = ref('');
const countdown = ref(0);
const isSending = ref(false);

// 账号密码登录相关
const password = ref('');
const passwordError = ref('');
const showPassword = ref(false);

// 登录状态
const isLoggedIn = ref(false);
let userInfo = null;

// 计算手机号是否有效
const isPhoneValid = computed(() => {
  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(phoneNumber.value);
});

// 计算验证码按钮文字
const sendBtnText = computed(() => {
  if (countdown.value > 0) {
    return `${countdown.value}秒后重新获取`;
  }
  return '获取验证码';
});

// 验证手机号
function validatePhoneNumber() {
  if (!phoneNumber.value) {
    phoneError.value = '请输入手机号码';
    return false;
  }

  const phoneRegex = /^1[3-9]\d{9}$/;
  if (!phoneRegex.test(phoneNumber.value)) {
    phoneError.value = '请输入有效的手机号码';
    return false;
  }

  phoneError.value = '';
  return true;
}

// 验证密码
function validatePassword() {
  if (!password.value) {
    passwordError.value = '请输入密码';
    return false;
  }

  if (password.value.length < 6) {
    passwordError.value = '密码长度至少为6位';
    return false;
  }

  passwordError.value = '';
  return true;
}

// 发送验证码
async function sendVerificationCodeForUser() {
  if (isSending.value || !isPhoneValid.value) return;
  if (!validatePhoneNumber()) return;

  isSending.value = true;
  countdown.value = 60;

  try {
    await sendVerificationCode(phoneNumber.value);
    uni.showToast({
      title: '验证码已发送',
      icon: 'success'
    });

    // 倒计时
    const timer = setInterval(() => {
      countdown.value--;
      if (countdown.value <= 0) {
        clearInterval(timer);
        isSending.value = false;
      }
    }, 1000);
  } catch (error) {
    isSending.value = false;
    uni.showToast({
      title: error.message || '发送验证码失败',
      icon: 'none'
    });
  }
}

// 登录处理
async function handleLogin() {
  // 验证表单
  if (loginType.value === 'phone') {
    if (!validatePhoneNumber()) return;

    if (!verificationCode.value) {
      uni.showToast({
        title: '请输入验证码',
        icon: 'none'
      });
      return;
    }
  } else {
    if (!phoneNumber.value) {
      uni.showToast({
        title: '请输入手机号',
        icon: 'none'
      });
      return;
    }

    if (!validatePassword()) return;
  }

  // 显示加载
  uni.showLoading({
    title: '登录中...'
  });
  try {
    let response;
    if (loginType.value === 'phone') {
      response = await phoneLogin({
        phone: phoneNumber.value,
        code: verificationCode.value,
        role: selectedRole.value
      });
    } else {
      response = await loginByPassword({
        phoneNumber: phoneNumber.value,
        password: password.value,
        role: selectedRole.value
      });
    }

    userInfo = response;

    if (selectedRole.value.toUpperCase() == "")
        // 设置用户类型
      setUserType(USER_TYPES[selectedRole.value.toUpperCase()]);

    // 登录成功，保存用户信息和token
    isLoggedIn.value = true;
    debugger
    // 存储登录信息到本地
    cacheManager.setCache('token', userInfo.token);
    cacheManager.setCache('userInfo', userInfo);

    uni.hideLoading();
    uni.showToast({
      title: '登录成功',
      icon: 'success'
    });

    // 登录成功后重定向
    redirectAfterLogin();
  } catch (error) {
    uni.hideLoading();
    uni.showToast({
      title: error.message || '登录失败',
      icon: 'none'
    });
  }
}

// 微信登录
async function handleWechatLogin() {
  uni.showLoading({
    title: '正在登录...'
  });

  // 检查是否支持微信登录
  if (!uni.canIUse('getUserProfile')) {
    uni.hideLoading();
    uni.showToast({
      title: '当前版本不支持微信登录',
      icon: 'none'
    });
    return;
  }

  try {
    // 获取微信用户信息
    const userProfile = await new Promise((resolve, reject) => {
      uni.getUserProfile({
        desc: '用于完善用户资料',
        lang: 'zh_CN',
        success: resolve,
        fail: reject
      });
    });

    // 获取微信登录凭证
    const loginRes = await new Promise((resolve, reject) => {
      uni.login({
        provider: 'weixin',
        success: resolve,
        fail: reject
      });
    });

    // 调用微信登录接口
    const response = await wechatLogin({
      code: loginRes.code,
      userInfo: userProfile.userInfo,
      role: selectedRole.value
    });

    const userInfo = response.data;

    // 保存登录信息
    uni.setStorageSync('token', userInfo.value.token);
    uni.setStorageSync('userInfo', userInfo);

    // 设置用户类型
    setUserType(USER_TYPES.USER);

    // 更新状态
    isLoggedIn.value = true;
    userInfo.value = userData;

    uni.hideLoading();
    uni.showToast({
      title: '登录成功',
      icon: 'success'
    });

    // 登录成功后重定向
    redirectAfterLogin();
  } catch (error) {
    uni.hideLoading();
    uni.showToast({
      title: error.message || '登录失败',
      icon: 'none'
    });
    console.error('微信登录失败:', error);
  }
}

// 登录成功后重定向
function redirectAfterLogin() {
  // 根据用户角色重定向到不同页面
  switch (selectedRole.value) {
    case 'user':
      uni.reLaunch({url: '/pages/index/index'});
      break;
    case 'lawyer':
      uni.reLaunch({url: '/pages/lawyer/lawyerinfo'});
      break;
    case 'admin':
      uni.reLaunch({url: '/pages/admin/admin'});
      break;
    default:
      uni.reLaunch({url: '/pages/index/index'});
  }
}

// 跳转到注册页面
function goToRegister() {
  uni.navigateTo({
    url: '/pages/login/register'
  });
}

// 跳转到忘记密码页面
function goToResetPassword() {
  uni.navigateTo({
    url: '/pages/login/reset'
  });
}

// 检查是否已登录
function checkLoginStatus() {
  let token = cacheManager.getCache('token');
  let savedUserInfo = cacheManager.getCache('userInfo');

  if (token && savedUserInfo) {
    try {
      debugger
      userInfo = savedUserInfo;
      isLoggedIn.value = true;
    } catch (e) {
      console.error('Parse userInfo error:', e);
    }
  }
}

// 页面加载时检查登录状态
onMounted(() => {
  checkLoginStatus();
});
</script>

<style lang="scss">

.login-container {
  min-height: 100vh;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  padding: 40rpx;
}

/* Logo区域 */
.logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60rpx 0;

  .logo-image {
    width: 160rpx;
    height: 160rpx;
    margin-bottom: 30rpx;
  }

  .app-name {
    font-size: 36rpx;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 16rpx;
  }

  .app-slogan {
    font-size: 28rpx;
    color: var(--text-secondary);
  }
}

/* 登录表单 */
.login-form {
  width: 100%;
  margin-top: 20rpx;
}

/* 登录方式切换 */
.login-tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 40rpx;

  .tab-item {
    padding: 20rpx 30rpx;
    margin: 0 20rpx;
    font-size: 30rpx;
    color: var(--text-secondary);
    position: relative;

    &.active {
      color: var(--primary-color);
      font-weight: 500;

      &::after {
        content: '';
        position: absolute;
        left: 50%;
        bottom: 0;
        transform: translateX(-50%);
        width: 40rpx;
        height: 4rpx;
        background-color: var(--primary-color);
        border-radius: 2rpx;
      }
    }
  }
}

/* 表单内容 */
.form-content {
  width: 100%;
}

/* 输入框组 */
.input-group {
  display: flex;
  align-items: center;
  background-color: #f5f7fa;
  border-radius: 12rpx;
  padding: 24rpx 30rpx;
  margin-bottom: 30rpx;

  uni-icons {
    margin-right: 20rpx;
  }

  input {
    flex: 1;
    height: 48rpx;
    font-size: 28rpx;
    color: var(--text-primary);
  }

  &.verification-code {
    position: relative;
    padding-right: 200rpx;
  }
}

/* 发送验证码按钮 */
.send-code-btn {
  position: absolute;
  right: 20rpx;
  top: 50%;
  transform: translateY(-50%);
  color: var(--primary-color);
  font-size: 26rpx;
  padding: 6rpx 20rpx;
  border-left: 1rpx solid #ddd;

  &.disabled {
    color: var(--text-tertiary);
  }
}

/* 密码可见切换 */
.password-toggle {
  padding: 10rpx;
}

/* 错误提示 */
.error-tip {
  display: block;
  color: var(--danger-color);
  font-size: 24rpx;
  margin: -20rpx 0 20rpx 20rpx;
}

/* 角色选择 */
.role-selection {
  margin: 20rpx 0 40rpx;

  .role-label {
    font-size: 28rpx;
    color: var(--text-secondary);
    margin-bottom: 20rpx;
  }

  .role-options {
    display: flex;
    justify-content: space-between;
  }

  .role-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20rpx;
    border-radius: 12rpx;
    background-color: #f5f7fa;
    margin: 0 10rpx;
    transition: all 0.3s;

    &:first-child {
      margin-left: 0;
    }

    &:last-child {
      margin-right: 0;
    }

    uni-icons {
      margin-bottom: 10rpx;
    }

    text {
      font-size: 26rpx;
      color: var(--text-secondary);
    }

    &.active {
      background-color: rgba(41, 121, 255, 0.1);
      border: 1rpx solid rgba(41, 121, 255, 0.2);

      text {
        color: var(--primary-color);
        font-weight: 500;
      }
    }
  }
}

/* 登录按钮 */
.login-btn {
  width: 100%;
  height: 90rpx;
  line-height: 90rpx;
  text-align: center;
  background: linear-gradient(135deg, #4A90E2, #2979FF);
  color: #fff;
  font-size: 32rpx;
  border-radius: 45rpx;
  font-weight: 500;
  box-shadow: 0 6rpx 16rpx rgba(41, 121, 255, 0.2);
  letter-spacing: 2rpx;
}

/* 辅助链接 */
.helper-links {
  display: flex;
  justify-content: space-between;
  margin-top: 30rpx;
  padding: 0 20rpx;

  text {
    font-size: 28rpx;
    color: var(--text-secondary);
  }
}

/* 其他登录方式 */
.other-login {
  margin-top: auto;
  padding: 60rpx 0;

  .divider {
    display: flex;
    align-items: center;
    color: var(--text-tertiary);
    font-size: 26rpx;
    margin-bottom: 40rpx;

    &::before,
    &::after {
      content: "";
      flex: 1;
      height: 1rpx;
      background-color: #eee;
    }

    &::before {
      margin-right: 20rpx;
    }

    &::after {
      margin-left: 20rpx;
    }
  }

  .social-login {
    display: flex;
    justify-content: center;
  }

  .social-icon {
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 30rpx;

    &.wechat {
      background: linear-gradient(135deg, #44B549, #4FB854);
    }
  }

  .agreement {
    text-align: center;
    font-size: 24rpx;
    color: var(--text-tertiary);
    margin-top: 40rpx;

    .link {
      color: var(--primary-color);
    }
  }
}
</style>
