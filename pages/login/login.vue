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
              placeholder="请输入账号/手机号"
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

      <!-- 登录按钮 -->
      <button class="login-btn" @click="handleLogin">登录</button>

      <!-- 申请成为律师按钮 -->
      <button class="apply-lawyer-btn" @click="goToApplyLawyer">申请成为律师</button>

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
        <!-- 使用 button 组件并设置 open-type -->
        <button
            class="social-icon wechat"
            open-type="getPhoneNumber"
            @getphonenumber="handleGetPhoneNumber"
        >
          <uni-icons type="weixin" size="28" color="#fff"></uni-icons>
        </button>
      </view>
      <view class="agreement">
        <checkbox-group @change="agreementChange">
          <label class="checkbox-label">
            <checkbox :checked="isAgreedPolicy" :value="'agreed'" style="transform:scale(0.7)" />
            <text>登录即表示同意</text>
            <text class="link" @click.stop="navigateToUserAgreement">《用户协议》</text>
            <text>和</text>
            <text class="link" @click.stop="navigateToPrivacyPolicy">《隐私政策》</text>
          </label>
        </checkbox-group>
      </view>
    </view>
  </view>


</template>

<script setup>
import {computed, onMounted, onUnmounted, ref} from 'vue';
import {setUserType, USER_TYPES} from '@/utils/store/userManager';
import {accountLogin, phoneLogin, sendVerificationCode, wechatLogin} from '@/api/login';
import {cacheManager} from '@/utils/store';
import {navigateToUrl} from '@/utils/navigateTo';


// 登录方式
const loginType = ref('phone'); // 'phone' 或 'account'
const selectedRole = ref('individual'); // 'individual', 'corporate', 'lawyer', 'admin'

// 手机号登录相关
const phoneNumber = ref('');
const verificationCode = ref('');
const phoneError = ref('');
const countdown = ref(0);
const isSending = ref(false);

// 账号密码登录相关
const username = ref('');
const password = ref('');
const passwordError = ref('');
const showPassword = ref(false);

// 新增微信登录相关状态
const wechatLoginLoading = ref(false);
const wechatUserInfo = ref(null);

// 登录状态
const isLoggedIn = ref(false);
let userInfo = null;

// 用户协议和隐私政策相关
const isAgreedPolicy = ref(false);

// 用户协议和隐私政策弹窗控制
const showAgreementPopup = ref(false);
const showPrivacyPopup = ref(false);

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

// 存储用户信息到缓存
function storeUserCache(userData, token, role) {
  if (!userData || !userData.userId) return;

  const userId = userData.userId;
  // 设置用户前缀
  cacheManager.setUserPrefix(userId);

  // 使用cacheManager存储用户信息
  cacheManager.setCache('userInfo', userData);
  cacheManager.setCache('userRole', role);

  // 设置token (与用户ID关联)
  cacheManager.setToken(token, userId);

  // 记录当前登录用户ID
  uni.setStorageSync('current_user_id', userId);
}

// 从缓存恢复用户信息
function restoreUserFromCache() {
  const userId = uni.getStorageSync('current_user_id');
  if (!userId) return false;

  // 检查token是否存在（指定该用户ID获取token）
  let token = cacheManager.getToken(userId);

  if (!token) {
    // token不存在，清除可能的无效数据
    clearCurrentUserCache(userId);
    return false;
  }

  // 设置用户前缀
  cacheManager.setUserPrefix(userId);

  // 尝试获取缓存数据
  try {
    const cachedUserInfo = cacheManager.getCache('userInfo');

    if (cachedUserInfo) {
      userInfo = cachedUserInfo;
      isLoggedIn.value = true;

      // 根据缓存中的角色设置selectedRole
      const userRole = cacheManager.getCache('userRole');
      if (userRole) {
        selectedRole.value = userRole;
      }

      return true;
    }
  } catch (error) {
    console.error('恢复用户数据失败:', error);
    clearCurrentUserCache(userId);
  }

  return false;
}

// 清除当前用户缓存
function clearCurrentUserCache(specificUserId = null) {
  const userId = specificUserId || uni.getStorageSync('current_user_id');

  if (userId) {
    // 设置用户前缀
    cacheManager.setUserPrefix(userId);

    // 清除该用户的所有缓存
    cacheManager.clearUserCache();
  } else {
    // 如果没有特定用户ID，尝试清除当前活跃用户的token
    cacheManager.removeToken();
  }

  // 移除当前用户ID
  uni.removeStorageSync('current_user_id');

  isLoggedIn.value = false;
  userInfo = null;
}

// 登录处理
async function handleLogin() {
  // 验证是否同意用户协议和隐私政策
  if (!isAgreedPolicy.value) {
    uni.showToast({
      title: '请先同意用户协议和隐私政策',
      icon: 'none'
    });
    return;
  }

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
      response = await accountLogin({
        phone: phoneNumber.value,
        password: password.value,
        role: selectedRole.value
      });
    }

    userInfo = response;

    // 设置用户类型
    let userType;
    if (selectedRole.value === 'individual') {
      userType = USER_TYPES.INDIVIDUAL;
    } else if (selectedRole.value === 'corporate') {
      userType = USER_TYPES.CORPORATE;
    } else if (selectedRole.value === 'lawyer') {
      userType = USER_TYPES.LAWYER;
    } else if (selectedRole.value === 'admin') {
      userType = USER_TYPES.ADMIN;
    }

    // 设置用户类型（这是唯一确定的，之后不会变）
    setUserType(userType);

    // 存储用户缓存，使用唯一key
    storeUserCache(userInfo, userInfo.token, selectedRole.value);

    // 登录成功状态
    isLoggedIn.value = true;

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

// 处理获取手机号事件
async function handleGetPhoneNumber(e) {
  // 验证是否同意用户协议
  if (!isAgreedPolicy.value) {
    uni.showToast({ title: '请先同意用户协议', icon: 'none' });
    return;
  }

  // 检查授权结果
  const { code, errMsg } = e.detail;
  if (errMsg !== 'getPhoneNumber:ok') {
    uni.showToast({ title: '需要授权手机号才能登录', icon: 'none' });
    return;
  }

  // 显示加载状态
  wechatLoginLoading.value = true;
  uni.showLoading({ title: '微信登录中...', mask: true });

  try {
    // 1. 获取用户基本信息
    const userProfile = await new Promise((resolve, reject) => {
      uni.getUserProfile({
        desc: '用于完善用户资料',
        lang: 'zh_CN',
        success: resolve,
        fail: reject
      });
    });

    // 2. 获取微信登录凭证
    const loginRes = await new Promise((resolve, reject) => {
      uni.login({
        provider: 'weixin',
        success: resolve,
        fail: reject
      });
    });

    // 3. 存储用户信息用于后续处理
    wechatUserInfo.value = {
      ...userProfile.userInfo,
      phoneCode: code, // 手机号授权码
      wxCode: loginRes.code // 微信登录凭证
    };

    // 4. 调用微信登录接口
    await handleWechatLogin();

  } catch (error) {
    console.error('微信登录失败:', error);
    uni.hideLoading();
    wechatLoginLoading.value = false;
    uni.showToast({
      title: error.errMsg || '微信登录失败',
      icon: 'none'
    });
  }
}

// 处理微信登录
async function handleWechatLogin() {
  if (!wechatUserInfo.value) {
    uni.showToast({ title: '用户信息获取失败', icon: 'none' });
    return;
  }

  try {
    // 调用微信登录API
    const response = await wechatLogin({
      code: wechatUserInfo.value.wxCode,
      phoneCode: wechatUserInfo.value.phoneCode,
      userInfo: {
        nickName: wechatUserInfo.value.nickName,
        avatarUrl: wechatUserInfo.value.avatarUrl
      },
      role: selectedRole.value
    });

    const { token, userData } = response.data;

    // 设置用户类型
    let userType;
    switch (selectedRole.value) {
      case 'individual': userType = USER_TYPES.INDIVIDUAL; break;
      case 'corporate': userType = USER_TYPES.CORPORATE; break;
      case 'lawyer': userType = USER_TYPES.LAWYER; break;
      case 'admin': userType = USER_TYPES.ADMIN; break;
    }
    setUserType(userType);

    // 存储用户缓存
    storeUserCache(userData, token, selectedRole.value);

    // 登录成功
    isLoggedIn.value = true;
    uni.hideLoading();
    wechatLoginLoading.value = false;

    uni.showToast({ title: '登录成功', icon: 'success' });
    redirectAfterLogin();

  } catch (error) {
    console.error('微信登录失败:', error);
    uni.hideLoading();
    wechatLoginLoading.value = false;
    uni.showToast({
      title: error.message || '微信登录失败',
      icon: 'none'
    });
  }
}
// 登录成功后重定向
function redirectAfterLogin() {
  // 根据用户角色重定向到不同页面
  switch (selectedRole.value) {
    case 'individual':
      uni.reLaunch({url: '/pages/index/index'});
      break;
    case 'corporate':
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
    url: '/pages/login/register/register'
  });
}

// 跳转到修改密码页面
function goToResetPassword() {
  navigateToUrl("/pages/login/resetpassword");
}

// 跳转到申请成为律师页面
function goToApplyLawyer() {
  navigateToUrl("/pages/lawyer/addlawyerinfo");
}

// 退出登录
function logout() {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        // 清除当前用户缓存
        clearCurrentUserCache();
        uni.reLaunch({
          url: '/pages/login/login'
        });
      }
    }
  });
}

// 页面加载时检查登录状态
onMounted(() => {
  // 尝试从缓存恢复用户信息
  const restored = restoreUserFromCache();
  if (restored) {
    // 如果成功恢复用户信息，重定向到对应页面
    redirectAfterLogin();
  }

  // 监听小程序隐藏事件
  uni.$on('app-hide', () => {
    // 小程序隐藏/关闭时不清除缓存，只在用户主动登出时清除
  });

  // 监听小程序退出事件
  uni.$on('app-unload', () => {
    // 应用完全退出时不清除缓存，只在用户主动登出时清除
  });
});

// 在页面卸载时取消事件监听
onUnmounted(() => {
  uni.$off('app-hide');
  uni.$off('app-unload');
});

function agreementChange(e) {
  isAgreedPolicy.value = e.detail.value.includes('agreed');
}

// 跳转到用户协议页面
function navigateToUserAgreement() {
  navigateToUrl('/components/user/agreement');
}

// 跳转到隐私政策页面
function navigateToPrivacyPolicy() {
  navigateToUrl('/components/user/privacy');
}
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
  margin-bottom: 30rpx;
}

/* 申请成为律师按钮 */
.apply-lawyer-btn {
  width: 100%;
  height: 90rpx;
  line-height: 90rpx;
  text-align: center;
  background: #fff;
  color: var(--primary-color);
  font-size: 32rpx;
  border-radius: 45rpx;
  font-weight: 500;
  border: 2rpx solid var(--primary-color);
  letter-spacing: 2rpx;
  margin-bottom: 30rpx;
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

    .checkbox-label {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;

      checkbox {
        margin-right: 6rpx;
      }

      text {
        margin: 0 2rpx;
      }
    }
  }
}

/* 弹窗相关样式 */
.popup-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

.popup-content {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 600rpx;
  height: 80%;
  max-height: 900rpx;
  background-color: #fff;
  border-radius: 12rpx;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.popup-header {
  position: relative;
  height: 90rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1rpx solid #eee;

  .popup-title {
    font-size: 34rpx;
    font-weight: 500;
    color: #333;
  }

  .popup-close {
    position: absolute;
    right: 20rpx;
    top: 50%;
    transform: translateY(-50%);
    padding: 10rpx;
  }
}

.popup-body {
  flex: 1;
  padding: 30rpx;
}

.content-section {
  margin-bottom: 30rpx;

  .section-title {
    font-size: 30rpx;
    font-weight: 600;
    color: #333;
    margin-bottom: 16rpx;
  }

  .section-text {
    color: #666;
    font-size: 26rpx;
    line-height: 1.6;

    .paragraph {
      margin-bottom: 12rpx;
    }
  }
}
</style>
