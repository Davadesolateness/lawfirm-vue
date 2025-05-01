<template>
  <view class="register-container">
    <!-- 顶部logo区域 -->
    <view class="logo-section">
      <image class="logo-image" src="/static/logo.png" mode="aspectFit"></image>
      <text class="app-name">律师咨询平台</text>
      <text class="app-slogan">专业法律咨询，一键直达</text>
    </view>
    
    <!-- 注册表单区域 -->
    <view class="register-form">
      <!-- 注册方式切换 -->
      <view class="register-tabs">
        <view 
          class="tab-item" 
          :class="{ active: registerType === 'user' }" 
          @click="registerType = 'user'"
        >
          用户注册
        </view>
        <view 
          class="tab-item" 
          :class="{ active: registerType === 'lawyer' }" 
          @click="registerType = 'lawyer'"
        >
          律师申请
        </view>
      </view>
      
      <!-- 用户注册表单 -->
      <view v-if="registerType === 'user'" class="form-content">
        <view class="input-group">
          <uni-icons type="person" size="20" color="#999"></uni-icons>
          <input 
            type="text" 
            v-model="userForm.username" 
            placeholder="请输入用户名" 
          />
        </view>
        
        <view class="input-group">
          <uni-icons type="phone" size="20" color="#999"></uni-icons>
          <input 
            type="number" 
            v-model="userForm.phone" 
            maxlength="11" 
            placeholder="请输入手机号码" 
            @blur="validatePhoneNumber"
          />
        </view>
        <text v-if="phoneError" class="error-tip">{{ phoneError }}</text>
        
        <view class="input-group">
          <uni-icons type="locked" size="20" color="#999"></uni-icons>
          <input 
            :type="showPassword ? 'text' : 'password'" 
            v-model="userForm.password" 
            placeholder="请输入密码" 
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
            v-model="userForm.confirmPassword" 
            placeholder="请确认密码" 
            @blur="validateConfirmPassword"
          />
        </view>
        <text v-if="confirmPasswordError" class="error-tip">{{ confirmPasswordError }}</text>
      </view>
      
      <!-- 律师注册表单 -->
      <view v-else class="form-content">
        <view class="input-group">
          <uni-icons type="person" size="20" color="#999"></uni-icons>
          <input 
            type="text" 
            v-model="lawyerForm.username" 
            placeholder="请输入真实姓名" 
          />
        </view>
        
        <view class="input-group">
          <uni-icons type="phone" size="20" color="#999"></uni-icons>
          <input 
            type="number" 
            v-model="lawyerForm.phone" 
            maxlength="11" 
            placeholder="请输入手机号码" 
            @blur="validatePhoneNumber"
          />
        </view>
        <text v-if="phoneError" class="error-tip">{{ phoneError }}</text>
        
        <view class="input-group">
          <uni-icons type="locked" size="20" color="#999"></uni-icons>
          <input 
            :type="showPassword ? 'text' : 'password'" 
            v-model="lawyerForm.password" 
            placeholder="请输入密码" 
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
            v-model="lawyerForm.confirmPassword" 
            placeholder="请确认密码" 
            @blur="validateConfirmPassword"
          />
        </view>
        <text v-if="confirmPasswordError" class="error-tip">{{ confirmPasswordError }}</text>
        
        <!-- 律师特有字段 -->
        <view class="input-group">
          <uni-icons type="medal" size="20" color="#999"></uni-icons>
          <input 
            type="text" 
            v-model="lawyerForm.licenseNumber" 
            placeholder="请输入律师执业证号" 
          />
        </view>
        
        <view class="input-group">
          <uni-icons type="home" size="20" color="#999"></uni-icons>
          <input 
            type="text" 
            v-model="lawyerForm.lawFirm" 
            placeholder="请输入所属律所" 
          />
        </view>
        
        <view class="input-group">
          <uni-icons type="paperplane" size="20" color="#999"></uni-icons>
          <input 
            type="text" 
            v-model="lawyerForm.specialty" 
            placeholder="请输入专业领域" 
          />
        </view>
      </view>
      
      <!-- 注册按钮 -->
      <button class="register-btn" @click="handleRegister">
        {{ registerType === 'user' ? '注册' : '提交申请' }}
      </button>
      
      <!-- 返回登录 -->
      <view class="back-to-login">
        <text @click="goToLogin">已有账号？返回登录</text>
      </view>
    </view>
    
    <!-- 用户协议 -->
    <view class="agreement">
      注册即表示同意<text class="link">《用户协议》</text>和<text class="link">《隐私政策》</text>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue';
import { userRegister, lawyerRegister } from '@/api/register';
import {navigateToUrl} from "@/utils/navigateTo";

// 注册类型
const registerType = ref('user'); // 'user' 或 'lawyer'

// 用户注册表单
const userForm = ref({
  username: '',
  phone: '',
  password: '',
  confirmPassword: ''
});

// 律师注册表单
const lawyerForm = ref({
  username: '',
  phone: '',
  password: '',
  confirmPassword: '',
  licenseNumber: '',
  lawFirm: '',
  specialty: ''
});

// 错误信息
const phoneError = ref('');
const passwordError = ref('');
const confirmPasswordError = ref('');
const showPassword = ref(false);

// 验证手机号
function validatePhoneNumber() {
  const phone = registerType.value === 'user' ? userForm.value.phone : lawyerForm.value.phone;
  
  if (!phone) {
    phoneError.value = '请输入手机号码';
    return false;
  }
  
  const phoneRegex = /^1[3-9]\d{9}$/;
  if (!phoneRegex.test(phone)) {
    phoneError.value = '请输入有效的手机号码';
    return false;
  }
  
  phoneError.value = '';
  return true;
}

// 验证密码
function validatePassword() {
  const password = registerType.value === 'user' ? userForm.value.password : lawyerForm.value.password;
  
  if (!password) {
    passwordError.value = '请输入密码';
    return false;
  }
  
  if (password.length < 6) {
    passwordError.value = '密码长度至少为6位';
    return false;
  }
  
  passwordError.value = '';
  return true;
}

// 验证确认密码
function validateConfirmPassword() {
  const password = registerType.value === 'user' ? userForm.value.password : lawyerForm.value.password;
  const confirmPassword = registerType.value === 'user' ? userForm.value.confirmPassword : lawyerForm.value.confirmPassword;
  
  if (!confirmPassword) {
    confirmPasswordError.value = '请确认密码';
    return false;
  }
  
  if (password !== confirmPassword) {
    confirmPasswordError.value = '两次输入的密码不一致';
    return false;
  }
  
  confirmPasswordError.value = '';
  return true;
}

// 注册处理
async function handleRegister() {
  // 验证表单
  if (!validatePhoneNumber() || !validatePassword() || !validateConfirmPassword()) {
    return;
  }
  
  // 显示加载
  uni.showLoading({
    title: registerType.value === 'user' ? '注册中...' : '提交申请中...'
  });
  
  try {
    let response;
    if (registerType.value === 'user') {
      // 处理用户注册数据
      const registerData = {
        username: userForm.value.username,
        phone: userForm.value.phone,
        password: userForm.value.password
      };
      response = await userRegister(registerData);
    } else {
      // 处理律师申请数据
      const registerData = {
        username: lawyerForm.value.username,
        phone: lawyerForm.value.phone,
        password: lawyerForm.value.password,
        licenseNumber: lawyerForm.value.licenseNumber,
        lawFirm: lawyerForm.value.lawFirm,
        specialty: lawyerForm.value.specialty
      };
      response = await lawyerRegister(registerData);
    }
    
    uni.hideLoading();
    uni.showToast({
      title: registerType.value === 'user' ? '注册成功' : '申请已提交，请等待审核',
      icon: 'success'
    });
    
    // 注册成功后跳转到登录页
    setTimeout(() => {
      goToLogin();
    }, 1500);
  } catch (error) {
    uni.hideLoading();
    uni.showToast({
      title: error.message || (registerType.value === 'user' ? '注册失败' : '申请提交失败'),
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
@import '@/uni_modules/theme/index.scss';

.register-container {
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

/* 注册表单 */
.register-form {
  width: 100%;
  margin-top: 20rpx;
}

/* 注册方式切换 */
.register-tabs {
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

/* 注册按钮 */
.register-btn {
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

/* 用户协议 */
.agreement {
  text-align: center;
  font-size: 24rpx;
  color: var(--text-tertiary);
  margin-top: 40rpx;
  
  .link {
    color: var(--primary-color);
  }
}
</style> 