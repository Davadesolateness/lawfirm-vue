<template>
  <view class="modify-container">
    <view class="form-card">
      <!-- 头像上传 -->
      <view class="avatar-section" @click="chooseImage">
        <image class="avatar" :src="form.avatar" mode="aspectFill" />
        <text class="avatar-tip">点击更换头像</text>
        <view class="user-meta">
          <text class="username">{{username}}</text>
        </view>
      </view>
      <!-- 原生表单 -->
      <view class="native-form">
        <!-- 电话号码 -->
        <view class="form-item">
          <text class="form-label">联系电话</text>
          <input
              v-model="form.phone"
              type="number"
              placeholder="请输入手机号码"
              class="form-input"
              :class="{ error: errors.phone }"
          />
          <text v-if="errors.phone" class="error-msg">{{ errors.phone }}</text>
        </view>

        <button class="submit-btn" @click="handleSubmit">保存修改</button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive } from 'vue'
import {onLoad} from "@dcloudio/uni-app";

const form = reactive({
  avatar: '/static/default-avatar.png',
  phone: ''
})

const errors = reactive({
  phone: ''
})

let username = ref();

// 验证规则
const validateForm = () => {
  let isValid = true
  errors.phone = ''

  if (!form.phone) {
    errors.phone = '手机号不能为空'
    isValid = false
  } else if (!/^1[3-9]\d{9}$/.test(form.phone)) {
    errors.phone = '手机号格式不正确'
    isValid = false
  }

  return isValid
}

// 选择图片
const chooseImage = () => {
  uni.chooseImage({
    count: 1,
    success: (res) => {
      form.avatar = res.tempFilePaths[0]
    }
  })
}

// 提交逻辑
const handleSubmit = () => {
  if (validateForm()) {
    uni.showToast({ title: '提交成功' })
    // 这里添加实际提交逻辑
  } else {
    uni.showToast({ title: '请检查表单', icon: 'none' })
  }
}
// 初始化数据
onLoad((data) => {
  if (data ) {
    username = data.username;
    form.avatar = data.avatarImg;
    form.phone = data.phone;
  }
});
</script>

<style lang="scss" scoped>
.modify-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 20vh;
  background: #f8fafb;
  padding: 32rpx;
}

.form-card {
  width: 100%;
  max-width: 670rpx;
  background: #fff;
  border-radius: 24rpx;
  padding: 30rpx;
  box-shadow: 0 8rpx 24rpx rgba(0,0,0,0.06);
}

.avatar-section {
  text-align: center;
  margin-bottom: 64rpx;

  .avatar {
    width: 160rpx;
    height: 160rpx;
    border-radius: 50%;
    border: 4rpx solid #fff;
    box-shadow: 0 8rpx 24rpx rgba(0,0,0,0.08);
  }

  .avatar-tip {
    color: #7F7FD5;
    font-size: 28rpx;
    display: block;
    margin-top: 16rpx;
  }
}

.native-form {
  .form-item {
    margin-bottom: 48rpx;

    .form-label {
      display: block;
      color: #666;
      font-size: 30rpx;
      margin-bottom: 16rpx;
      padding-left: 16rpx;
    }

    .form-input {
      width: 100%;
      height: 80rpx;
      background: #f8f9ff;
      border-radius: 16rpx;
      padding: 0 24rpx;
      font-size: 30rpx;

      &.error {
        border: 1rpx solid #ff4d4f;
      }
    }

    .error-msg {
      display: block;
      color: #ff4d4f;
      font-size: 24rpx;
      margin-top: 8rpx;
      padding-left: 16rpx;
    }
  }
}

.submit-btn {
  width: 100%;
  height: 96rpx;
  line-height: 96rpx;
  background: #4A67FF;
  color: #fff;
  border-radius: 16rpx;
  font-size: 34rpx;
  margin-bottom: 30rpx;
  transition: all 0.2s;

  &:active {
    opacity: 0.9;
    transform: scale(0.98);
  }
}
</style>