<template>
  <view class="content">
    <view class="head">
      <image
          mode="aspectFit"
          src="/static/logo.png"
          @error="handleImageError"
      ></image>
    </view>
    <view class="form-box">
      <view class="row-input">
        <input
            v-model="phoneNumber"
            placeholder="手机号"
            maxlength="11"
            type="number"
            @blur="validatePhoneNumber"
        />
        <text v-if="phoneError" class="error">{{ phoneError }}</text>
      </view>
      <view class="row-input">
        <input
            v-model="password"
            placeholder="密码"
            password
            maxlength="18"
            @blur="validatePassword"
        />
        <text v-if="passwordError" class="error">{{ passwordError }}</text>
      </view>
      <view class="login-btn" @click="handleLogin">登录</view>
      <view class="menu-link">
        <text>忘记密码</text>
        <text @click="goToRegister">注册账号</text>
      </view>
      <view class="line">第三方账号登录</view>
      <view class="quick-login">
        <image
            src="/static/weixin.png"
            @error="handleImageError"
        ></image>
      </view>
    </view>
  </view>
</template>

<script>import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: "login",
  setup() {
    const router = useRouter();
    const phoneNumber = ref('');
    const password = ref('');
    const phoneError = ref('');
    const passwordError = ref('');

    // 验证手机号
    const validatePhoneNumber = () => {
      const phoneRegex = /^1[3-9]\d{9}$/;
      if (!phoneRegex.test(phoneNumber.value)) {
        phoneError.value = '请输入有效的手机号';
      } else {
        phoneError.value = '';
      }
    };

    // 验证密码
    const validatePassword = () => {
      if (password.value.length < 6) {
        passwordError.value = '密码长度至少为6位';
      } else {
        passwordError.value = '';
      }
    };

    // 登录按钮点击事件
    const handleLogin = () => {
      if (phoneError.value || passwordError.value) {
        uni.showToast({ title: '请检查输入信息', icon: 'none' });
        return;
      }
      // 模拟登录逻辑
      uni.showToast({ title: '登录成功', icon: 'success' });
    };

    // 跳转到注册页面
    const goToRegister = () => {
      router.push('/pages/lawyer/lawyerinfo');
    };

    // 图片加载失败处理
    const handleImageError = (e) => {
      e.target.src = '/static/weixin.png'; // 替换为默认占位图
    };

    return {
      phoneNumber,
      password,
      phoneError,
      passwordError,
      validatePhoneNumber,
      validatePassword,
      handleLogin,
      goToRegister,
      handleImageError,
    };
  },
});
</script>

<style lang="scss" scoped>.head {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 32vh;

  image {
    width: 360rpx;
    height: 360rpx;
  }
}

.form-box {
  padding: 0rpx 80rpx;

  .row-input {
    position: relative;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 100rpx;
    border-bottom: 1rpx solid #ececec;

    .error {
      position: absolute;
      bottom: -40rpx;
      left: 0;
      font-size: 24rpx;
      color: red;
    }
  }

  .login-btn {
    margin-top: 30rpx;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 30rpx;
    height: 80rpx;
    background-color: #393a3e;
    letter-spacing: 10rpx;
    color: #f1f1f3;
  }

  .menu-link {
    line-height: 100rpx;
    font-size: 28rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #676769;
  }

  .line {
    width: 100%;
    margin: 50rpx 0rpx;
    align-self: center;
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  .line:before,
  .line::after {
    content: "";
    margin: 0 20rpx;
    border-top: 1px solid #dddddd;
    flex: 1 1 0rpx;
  }

  .quick-login {
    padding: 0 120rpx;
    display: flex;
    justify-content: space-around;
    align-items: center;

    image {
      width: 100rpx;
      height: 100rpx;
      border-radius: 100%;
      background-color: #000000;
    }
  }
}
</style>
