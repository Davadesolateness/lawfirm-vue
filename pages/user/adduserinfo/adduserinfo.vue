<template>
  <view class="container">
    <view class="form-wrapper">
      <view class="form-card">
        <text class="form-title">新增用户</text>
        
        <!-- 批量添加开关 -->
        <view class="batch-switch">
          <text class="switch-label">批量添加</text>
          <switch :checked="isBatchMode" @change="toggleBatchMode" color="#4A67FF" />
        </view>

        <!-- 单用户表单 -->
        <template v-if="!isBatchMode">
          <view class="form-list">
            <view class="form-item">
              <text class="label">用户名称</text>
              <input
                v-model="formData.name"
                placeholder="请输入用户名称"
                class="form-input"
                :class="{ error: errors.name }"
              />
              <text v-if="errors.name" class="error-msg">{{ errors.name }}</text>
            </view>

            <view class="form-item">
              <text class="label">联系电话</text>
              <input
                v-model="formData.phone"
                type="number"
                placeholder="请输入联系电话"
                class="form-input"
                :class="{ error: errors.phone }"
              />
              <text v-if="errors.phone" class="error-msg">{{ errors.phone }}</text>
            </view>

            <view class="form-item">
              <text class="label">会员等级</text>
              <picker
                v-model="formData.level"
                :range="memberLevels"
                class="form-picker"
                :class="{ error: errors.level }"
              >
                <view class="picker-content">
                  {{ memberLevels[formData.level] || '请选择会员等级' }}
                </view>
              </picker>
              <text v-if="errors.level" class="error-msg">{{ errors.level }}</text>
            </view>

            <view class="form-item">
              <text class="label">是否法人</text>
              <picker
                v-model="formData.isLegal"
                :range="legalOptions"
                class="form-picker"
              >
                <view class="picker-content">
                  {{ legalOptions[formData.isLegal] || '请选择' }}
                </view>
              </picker>
            </view>

            <view class="form-item">
              <text class="label">统一社会信用代码</text>
              <input
                v-model="formData.socialCode"
                placeholder="请输入统一社会信用代码"
                class="form-input"
                :class="{ error: errors.socialCode }"
              />
              <text v-if="errors.socialCode" class="error-msg">{{ errors.socialCode }}</text>
            </view>
          </view>
        </template>

        <!-- 批量添加表单 -->
        <template v-else>
          <view class="batch-form">
            <view class="batch-header">
              <text class="batch-title">批量添加用户</text>
              <button class="add-row-btn" @click="addBatchRow">添加一行</button>
            </view>
            
            <view v-for="(item, index) in batchFormData" :key="index" class="batch-row">
              <view class="row-number">{{ index + 1 }}</view>
              <view class="row-content">
                <view class="batch-form-list">
                  <view class="batch-form-item">
                    <input v-model="item.name" placeholder="用户名称" class="batch-input" />
                  </view>
                  <view class="batch-form-item">
                    <input v-model="item.phone" type="number" placeholder="联系电话" class="batch-input" />
                  </view>
                  <view class="batch-form-item">
                    <picker v-model="item.level" :range="memberLevels" class="batch-picker">
                      <view class="picker-content">{{ memberLevels[item.level] || '会员等级' }}</view>
                    </picker>
                  </view>
                  <view class="batch-form-item">
                    <picker v-model="item.isLegal" :range="legalOptions" class="batch-picker">
                      <view class="picker-content">{{ legalOptions[item.isLegal] || '是否法人' }}</view>
                    </picker>
                  </view>
                  <view class="batch-form-item">
                    <input v-model="item.socialCode" placeholder="统一社会信用代码" class="batch-input" />
                  </view>
                </view>
              </view>
              <view class="row-action">
                <button class="delete-btn" @click="removeBatchRow(index)">删除</button>
              </view>
            </view>
          </view>
        </template>

        <!-- 提交按钮 -->
        <button class="submit-btn" @click="handleSubmit">
          {{ isBatchMode ? '批量提交' : '提交' }}
        </button>
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
  isLegal: '',
  socialCode: ''
})

// 批量表单数据
const batchFormData = ref([])

// 错误提示
const errors = reactive({
  name: '',
  phone: '',
  level: '',
  socialCode: ''
})

// 会员等级选项
const memberLevels = ['普通会员', '白银会员', '黄金会员', '铂金会员']

// 法人选项
const legalOptions = ['是', '否']

// 批量模式开关
const isBatchMode = ref(false)

// 切换批量模式
const toggleBatchMode = (e) => {
  isBatchMode.value = e.detail.value
  if (isBatchMode.value && batchFormData.value.length === 0) {
    addBatchRow()
  }
}

// 添加批量行
const addBatchRow = () => {
  batchFormData.value.push({
    name: '',
    phone: '',
    level: '',
    isLegal: '',
    socialCode: ''
  })
}

// 删除批量行
const removeBatchRow = (index) => {
  batchFormData.value.splice(index, 1)
}

// 表单验证规则
const validateForm = (data) => {
  const errors = {
    name: '',
    phone: '',
    level: '',
    socialCode: ''
  }
  let isValid = true

  if (!data.name.trim()) {
    errors.name = '用户名称不能为空'
    isValid = false
  }

  if (!data.phone) {
    errors.phone = '联系电话不能为空'
    isValid = false
  } else if (!/^1[3-9]\d{9}$/.test(data.phone)) {
    errors.phone = '电话号码格式不正确'
    isValid = false
  }

  if (data.level === '') {
    errors.level = '请选择会员等级'
    isValid = false
  }

  if (!data.socialCode) {
    errors.socialCode = '信用代码不能为空'
    isValid = false
  } else if (!/^[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}$/.test(data.socialCode)) {
    errors.socialCode = '信用代码格式不正确'
    isValid = false
  }

  return { isValid, errors }
}

// 提交处理
const handleSubmit = async () => {
  if (isBatchMode.value) {
    // 批量提交
    if (batchFormData.value.length === 0) {
      uni.showToast({ title: '请至少添加一条数据', icon: 'none' })
      return
    }

    // 验证所有数据
    let hasError = false
    for (const data of batchFormData.value) {
      const { isValid, errors: rowErrors } = validateForm(data)
      if (!isValid) {
        hasError = true
        break
      }
    }

    if (hasError) {
      uni.showToast({ title: '请检查输入数据是否正确', icon: 'none' })
      return
    }

    uni.showLoading({ title: '批量提交中...' })
    try {
      // TODO: 调用批量提交API
      await new Promise(resolve => setTimeout(resolve, 1500))
      uni.hideLoading()
      uni.showToast({ title: '批量提交成功' })
      batchFormData.value = []
      addBatchRow() // 添加一个空行
    } catch (error) {
      uni.hideLoading()
      uni.showToast({ title: '提交失败，请重试', icon: 'none' })
    }
  } else {
    // 单条提交
    const { isValid, errors: formErrors } = validateForm(formData)
    if (!isValid) {
      Object.assign(errors, formErrors)
      return
    }

    uni.showLoading({ title: '提交中...' })
    try {
      // TODO: 调用提交API
      await new Promise(resolve => setTimeout(resolve, 1500))
      uni.hideLoading()
      uni.showToast({ title: '提交成功' })
      // 重置表单
      Object.assign(formData, {
        name: '',
        phone: '',
        level: '',
        isLegal: '',
        socialCode: ''
      })
    } catch (error) {
      uni.hideLoading()
      uni.showToast({ title: '提交失败，请重试', icon: 'none' })
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 32rpx;
}

.form-wrapper {
  max-width: 700rpx;
  margin: 0 auto;
}

.form-card {
  background: white;
  border-radius: 24rpx;
  padding: 40rpx;
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

.batch-switch {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32rpx;
  padding: 0 20rpx;
  background: #f8f9ff;
  border-radius: 16rpx;
  height: 88rpx;
}

.switch-label {
  font-size: 28rpx;
  color: #666;
}

.form-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  max-width: 600rpx;
  margin: 0 auto;
}

.form-item {
  width: 100%;
  position: relative;
}

.label {
  display: block;
  font-size: 26rpx;
  color: #666;
  margin-bottom: 12rpx;
  font-weight: 500;
}

.form-input {
  width: 100%;
  height: 80rpx;
  padding: 0 24rpx;
  background: #ffffff;
  border-radius: 12rpx;
  border: 2rpx solid #e8e8e8;
  font-size: 28rpx;
  color: #333;
  transition: all 0.3s ease;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.02);
  box-sizing: border-box;

  &::placeholder {
    color: #999;
  }

  &:focus {
    border-color: #4A67FF;
    background: #ffffff;
    box-shadow: 0 4rpx 12rpx rgba(74, 103, 255, 0.1);
  }

  &.error {
    border-color: #ff4444;
    background: #fff5f5;
  }
}

.form-picker {
  width: 100%;
  height: 80rpx;
  background: #ffffff;
  border-radius: 12rpx;
  border: 2rpx solid #e8e8e8;
  transition: all 0.3s ease;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.02);
  box-sizing: border-box;

  &.error {
    border-color: #ff4444;
    background: #fff5f5;
  }

  .picker-content {
    height: 100%;
    display: flex;
    align-items: center;
    padding: 0 24rpx;
    color: #333;
    font-size: 28rpx;
  }
}

.error-msg {
  display: block;
  color: #ff4444;
  font-size: 24rpx;
  margin-top: 8rpx;
  padding-left: 24rpx;
}

.submit-btn {
  width: 400rpx;
  height: 88rpx;
  line-height: 88rpx;
  background: #4A67FF;
  color: white;
  border-radius: 12rpx;
  font-size: 30rpx;
  margin: 48rpx auto 0;
  transition: all 0.3s ease;
  box-shadow: 0 4rpx 12rpx rgba(74, 103, 255, 0.2);
  display: block;

  &:active {
    transform: translateY(2rpx);
    box-shadow: 0 2rpx 8rpx rgba(74, 103, 255, 0.2);
  }
}

// 批量添加样式
.batch-form {
  margin-top: 32rpx;
}

.batch-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}

.batch-title {
  font-size: 28rpx;
  color: #666;
}

.add-row-btn {
  font-size: 26rpx;
  color: #4A67FF;
  background: #fff;
  border: 2rpx solid #4A67FF;
  padding: 12rpx 24rpx;
  border-radius: 8rpx;
  transition: all 0.3s ease;

  &:active {
    background: #4A67FF;
    color: #fff;
  }
}

.batch-row {
  display: flex;
  align-items: flex-start;
  margin-bottom: 24rpx;
  background: #ffffff;
  border-radius: 16rpx;
  padding: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
  border: 2rpx solid #f0f0f0;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
  }
}

.row-number {
  width: 60rpx;
  text-align: center;
  color: #666;
  font-size: 26rpx;
  padding-top: 16rpx;
  font-weight: 500;
}

.row-content {
  flex: 1;
  min-width: 0;
}

.batch-form-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  width: 100%;
  max-width: 580rpx;
}

.batch-form-item {
  width: 100%;
}

.batch-input {
  width: 100%;
  height: 72rpx;
  padding: 0 24rpx;
  background: #ffffff;
  border-radius: 8rpx;
  border: 2rpx solid #e8e8e8;
  font-size: 26rpx;
  color: #333;
  transition: all 0.3s ease;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.02);
  box-sizing: border-box;

  &::placeholder {
    color: #999;
  }

  &:focus {
    border-color: #4A67FF;
    background: #ffffff;
    box-shadow: 0 4rpx 12rpx rgba(74, 103, 255, 0.1);
  }
}

.batch-picker {
  width: 100%;
  height: 72rpx;
  background: #ffffff;
  border-radius: 8rpx;
  border: 2rpx solid #e8e8e8;
  transition: all 0.3s ease;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.02);
  box-sizing: border-box;

  .picker-content {
    height: 100%;
    display: flex;
    align-items: center;
    padding: 0 24rpx;
    font-size: 26rpx;
    color: #333;
  }
}

.delete-btn {
  width: 120rpx;
  height: 72rpx;
  line-height: 72rpx;
  background: #fff;
  color: #ff4444;
  font-size: 26rpx;
  border-radius: 8rpx;
  margin-left: 16rpx;
  border: 2rpx solid #ff4444;
  transition: all 0.3s ease;

  &:active {
    background: #ff4444;
    color: #fff;
  }
}
</style>