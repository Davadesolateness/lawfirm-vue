<template>
  <view class="container">
    <view class="form-wrapper">
      <!-- 用户表单 -->
      <view class="form-card">
        <text class="form-title">新增用户</text>

        <!-- 用户名称 -->
        <input
            v-model="formData.name"
            placeholder="请输入用户名称"
            class="form-input"
            :class="{ error: errors.name }"
        />
        <text v-if="errors.name" class="error-msg">{{ errors.name }}</text>

        <!-- 用户电话 -->
        <input
            v-model="formData.phone"
            type="number"
            placeholder="请输入联系电话"
            class="form-input"
            :class="{ error: errors.phone }"
        />
        <text v-if="errors.phone" class="error-msg">{{ errors.phone }}</text>

        <!-- 会员等级 -->
        <picker
            v-model="formData.level"
            :range="memberLevels"
            class="form-picker"
            :class="{ error: errors.level }"
        >
          <view class="picker-content">
            会员等级：{{ memberLevels[formData.level] || '请选择' }}
          </view>
        </picker>
        <text v-if="errors.level" class="error-msg">{{ errors.level }}</text>

        <!-- 统一社会信用代码 -->
        <input
            v-model="formData.socialCode"
            placeholder="请输入统一社会信用代码"
            class="form-input"
            :class="{ error: errors.socialCode }"
        />
        <text v-if="errors.socialCode" class="error-msg">{{ errors.socialCode }}</text>

        <!-- 提交按钮 -->
        <button class="submit-btn" @click="handleSubmit">提交</button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive } from 'vue'

// 表单数据
const formData = reactive({
  name: '',
  phone: '',
  level: '',
  socialCode: ''
})

// 错误提示
const errors = reactive({
  name: '',
  phone: '',
  level: '',
  socialCode: ''
})

// 会员等级选项
const memberLevels = ['普通会员', '白银会员', '黄金会员', '铂金会员']

// 表单验证规则
const validateForm = () => {
  let isValid = true
  errors.name = ''
  errors.phone = ''
  errors.level = ''
  errors.socialCode = ''

  // 验证用户名称
  if (!formData.name.trim()) {
    errors.name = '用户名称不能为空'
    isValid = false
  }

  // 验证电话号码
  if (!formData.phone) {
    errors.phone = '联系电话不能为空'
    isValid = false
  } else if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
    errors.phone = '电话号码格式不正确'
    isValid = false
  }

  // 验证会员等级
  if (formData.level === '') {
    errors.level = '请选择会员等级'
    isValid = false
  }

  // 验证统一社会信用代码
  if (!formData.socialCode) {
    errors.socialCode = '信用代码不能为空'
    isValid = false
  } else if (!/^[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}$/.test(formData.socialCode)) {
    errors.socialCode = '信用代码格式不正确'
    isValid = false
  }

  return isValid
}

// 提交处理
const handleSubmit = () => {
  if (validateForm()) {
    uni.showLoading({ title: '提交中...' })

    // 模拟提交
    setTimeout(() => {
      uni.hideLoading()
      uni.showToast({ title: '新增成功' })
      // 重置表单
      Object.assign(formData, {
        name: '',
        phone: '',
        level: '',
        socialCode: ''
      })
    }, 1500)
  }
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f5f7fa;
  padding: 32rpx;
}

.form-wrapper {
  width: 100%;
  max-width: 600rpx;
}

.form-card {
  background: white;
  border-radius: 24rpx;
  padding: 48rpx;
  box-shadow: 0 8rpx 24rpx rgba(0,0,0,0.06);
}

.form-title {
  display: block;
  font-size: 36rpx;
  font-weight: 600;
  color: #2d3436;
  text-align: center;
  margin-bottom: 48rpx;
}

.form-input {
  width: 100%;
  height: 88rpx;
  padding: 0 32rpx;
  margin-bottom: 8rpx;
  background: #f8f9ff;
  border-radius: 16rpx;
  border: 1rpx solid #eee;
  font-size: 30rpx;

  &.error {
    border-color: #ff4444;
  }
}

.form-picker {
  width: 100%;
  height: 88rpx;
  margin-bottom: 8rpx;
  background: #f8f9ff;
  border-radius: 16rpx;
  border: 1rpx solid #eee;

  &.error {
    border-color: #ff4444;
  }

  .picker-content {
    height: 100%;
    display: flex;
    align-items: center;
    padding: 0 32rpx;
    color: #666;
  }
}

.error-msg {
  display: block;
  color: #ff4444;
  font-size: 24rpx;
  margin-bottom: 24rpx;
  padding-left: 32rpx;
}

.submit-btn {
  width: 100%;
  height: 96rpx;
  line-height: 96rpx;
  background: #4A67FF;
  color: white;
  border-radius: 16rpx;
  font-size: 32rpx;
  margin-top: 48rpx;
  transition: all 0.2s;

  &:active {
    opacity: 0.9;
    transform: scale(0.98);
  }
}
</style>