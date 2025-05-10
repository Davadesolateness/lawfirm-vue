<template>
  <view class="reset-password-container">
    <!-- 顶部logo区域 -->
    <view class="logo-section">
      <image class="logo-image" src="/static/logo.png" mode="aspectFit"></image>
      <text class="app-name">律师咨询平台</text>
      <text class="app-slogan">修改密码</text>
    </view>
    
    <!-- 修改密码表单 -->
    <view class="reset-form">
      <view class="input-group">
        <uni-icons type="phone" size="20" color="#999"></uni-icons>
        <input 
          type="number" 
          v-model="phone" 
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
          @click="sendVerificationCode"
        >
          {{ sendBtnText }}
        </view>
      </view>
      
      <view class="input-group">
        <uni-icons type="locked" size="20" color="#999"></uni-icons>
        <input 
          :type="showPassword ? 'text' : 'password'" 
          v-model="newPassword" 
          placeholder="请输入新密码" 
          @blur="validatePassword"
        />
        <view class="password-toggle" @click="showPassword = !showPassword">
          <uni-icons :type="showPassword ? 'eye-slash' : 'eye'" size="20" color="#999"></uni-icons>
        </view>
      </view>
      <text v-if="passwordError" class="error-tip">{{ passwordError }}</text>
      
      <view class="input-group">
        <uni-icons type="locked" size="20" color="#999"></uni-icons>
        <input 
          :type="showPassword ? 'text' : 'password'" 
          v-model="confirmPassword" 
          placeholder="请确认新密码" 
          @blur="validateConfirmPassword"
        />
      </view>
      <text v-if="confirmPasswordError" class="error-tip">{{ confirmPasswordError }}</text>
      
      <!-- 提交按钮 -->
      <button class="submit-btn" @click="handleResetPassword">确认修改</button>
      
      <!-- 返回登录 -->
      <view class="back-to-login">
        <text @click="goToLogin">返回登录</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue';
import { sendVerificationCode, resetPassword } from '@/api/login';
import { navigateToUrl } from "@/utils/navigateTo";

// 表单数据
const phone = ref('');
const verificationCode = ref('');
const newPassword = ref('');
const confirmPassword = ref('');

// 错误信息
const phoneError = ref('');
const passwordError = ref('');
const confirmPasswordError = ref('');

// 验证码相关
const isSending = ref(false);
const countdown = ref(0);
const showPassword = ref(false);

// 计算手机号是否有效
const isPhoneValid = computed(() => {
  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(phone.value);
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
  if (!phone.value) {
    phoneError.value = '请输入手机号码';
    return false;
  }
  
  const phoneRegex = /^1[3-9]\d{9}$/;
  if (!phoneRegex.test(phone.value)) {
    phoneError.value = '请输入有效的手机号码';
    return false;
  }
  
  phoneError.value = '';
  return true;
}

// 验证密码
function validatePassword() {
  if (!newPassword.value) {
    passwordError.value = '请输入新密码';
    return false;
  }
  
  if (newPassword.value.length < 6) {
    passwordError.value = '密码长度至少为6位';
    return false;
  }
  
  passwordError.value = '';
  return true;
}

// 验证确认密码
function validateConfirmPassword() {
  if (!confirmPassword.value) {
    confirmPasswordError.value = '请确认新密码';
    return false;
  }
  
  if (newPassword.value !== confirmPassword.value) {
    confirmPasswordError.value = '两次输入的密码不一致';
    return false;
  }
  
  confirmPasswordError.value = '';
  return true;
}

// 发送验证码
async function sendVerificationCode1() {
  if (isSending.value || !isPhoneValid.value) return;
  
  if (!validatePhoneNumber()) return;
  
  isSending.value = true;
  countdown.value = 60;
  
  try {
    await sendVerificationCode(phone.value);
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

// 修改密码处理
async function handleResetPassword() {
  // 验证表单
  if (!validatePhoneNumber() || !validatePassword() || !validateConfirmPassword()) {
    return;
  }
  
  if (!verificationCode.value) {
    uni.showToast({
      title: '请输入验证码',
      icon: 'none'
    });
    return;
  }
  
  // 显示加载
  uni.showLoading({
    title: '修改中...'
  });
  
  try {
    await resetPassword({
      phone: phone.value,
      code: verificationCode.value,
      newPassword: newPassword.value
    });
    
    uni.hideLoading();
    uni.showToast({
      title: '密码修改成功',
      icon: 'success'
    });
    
    // 修改成功后跳转到登录页
    setTimeout(() => {
      goToLogin();
    }, 1500);
  } catch (error) {
    uni.hideLoading();
    uni.showToast({
      title: error.message || '密码修改失败',
      icon: 'none'
    });
  }
}

// 跳转到登录页
function goToLogin() {
  navigateToUrl("/pages/login/login");
}
</script>

<style lang="scss">


.reset-password-container {
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

/* 修改密码表单 */
.reset-form {
  width: 100%;
  margin-top: 20rpx;
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

/* 提交按钮 */
.submit-btn {
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
  margin-top: 40rpx;
}

/* 返回登录 */
.back-to-login {
  text-align: center;
  margin-top: 30rpx;
  
  text {
    font-size: 28rpx;
    color: var(--text-secondary);
  }
}
</style> 