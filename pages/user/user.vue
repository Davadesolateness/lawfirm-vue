<template>
  <view class="container">
    <!-- 用户信息区 -->
    <view class="user-header">
      <view class="user-info">
        <image class="avatar" :src="userInfo.avatar" mode="aspectFill"/>
        <view class="user-meta">
          <text class="username" >{{userInfo.username}}</text>
          <view class="user-tag" v-if="corporateuser">法人用户</view>
          <view class="user-tag" v-else>普通用户</view>

        </view>
      </view>
    </view>

    <!-- 主要内容区 -->
    <view class="main-content">
      <!-- 免费咨询卡片 -->
      <view class="service-card">
        <view class="card-header">
          <text class="card-title">11111111111</text>
          <view class="decorative-line"></view>
        </view>
        <view class="features">
          <view v-for="(item, index) in features" :key="index" class="feature-item">
            <text class="feature-icon">✓</text>
            <text class="feature-text">{{ item }}</text>
          </view>
        </view>
        <button class="consult-btn" >进入咨询</button>
      </view>

      <!-- 功能列表 -->
      <view class="func-list">
        <view class="func-item" @click="toPage('/pages/share/index')">
          <text class="func-icon">👀</text>
          <text class="func-text">推荐给好友</text>
          <text class="arrow">›</text>
        </view>
        <view class="func-item" @click="toPage('/pages/about/index')">
          <text class="func-icon">💁</text>
          <text class="func-text">关于</text>
          <text class="arrow">›</text>
        </view>
        <view class="func-item" @click="toPage('/pages/feedback/index')">
          <text class="func-icon">📧</text>
          <text class="func-text">意见反馈</text>
          <text class="arrow">›</text>
        </view>
      </view>

      <!-- 版本信息 -->
      <!--
            <view class="version">版本号：1.9.3</view>
      -->
    </view>


  </view>
</template>

<script setup>
import {ref} from "vue"
import {navigateToUrl} from "@/utils/navigateTo";
import {apiGetUserInfoById  } from "@/api/userapi";
import {onShow} from "@dcloudio/uni-app";

const features = [
  '111',
  '111',
  '1'
]
let corporateuser = true;
let avatarImg = '';  // 头像
const userInfo = ref(null); // 用户信息
onShow(() => {
  initUserInfo();
});

function judgeUserType(){
  if(userInfo.usertype == "corporate"){
    corporateuser = true;
  }else{
    corporateuser = false;
  }
}

// 初始化用户信息
function initUserInfo(){
  getUserInfoById()

}

const getUserInfoById = async ()=>{
  userInfo.value  =await apiGetUserInfoById("444");
  avatarImg = userInfo.value.avatar;

}

function toPage(url) {
  this.navigate.navigateToUrl("2020-01-01");

}

</script>

<style lang="scss" scoped>
.container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5faf7;
}

.user-header {
  background: linear-gradient(135deg, #d5c6ff 0%, #8176a5 100%);
  padding: 40rpx 32rpx 80rpx;

  .user-info {
    display: flex;
    align-items: center;

    .avatar {
      width: 120rpx;
      height: 120rpx;
      border-radius: 50%;
      border: 4rpx solid rgba(255, 255, 255, 0.3);
      margin-right: 32rpx;
      box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.2);
    }

    .user-meta {
      .username {
        color: #fff;
        font-size: 40rpx;
        font-weight: 600;
        line-height: 1.4;
      }

      .user-tag {
        display: inline-block;
        padding: 8rpx 24rpx;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 32rpx;
        color: #fff;
        font-size: 28rpx;
        font-weight: 500;
      }
    }
  }
}

.main-content {
  flex: 1;
  padding: 0 32rpx;
  transform: translateY(-60rpx);
}

.service-card {
  background: #fff;
  border-radius: 24rpx;
  padding: 32rpx;
  margin-bottom: 32rpx;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.04);

  .card-header {
    margin-bottom: 32rpx;

    .card-title {
      font-size: 38rpx;
      font-weight: 600;
      color: #2d3436;
    }

    .decorative-line {
      width: 80rpx;
      height: 8rpx;
      background: #6B5BFF;
      border-radius: 4rpx;
      margin-top: 16rpx;
    }
  }

  .features {
    .feature-item {
      display: flex;
      align-items: center;
      padding: 24rpx 0;

      .feature-icon {
        color: #6B5BFF;
        margin-right: 16rpx;
        font-weight: bold;
      }

      .feature-text {
        color: #666;
        font-size: 30rpx;
      }
    }
  }

  .consult-btn {
    width: 100%;
    height: 96rpx;
    line-height: 96rpx;
    background: #6B5BFF;
    color: #fff;
    font-size: 34rpx;
    border-radius: 16rpx;
    margin-top: 32rpx;
    transition: all 0.2s;

    &:active {
      opacity: 0.9;
      transform: scale(0.98);
    }
  }
}

.func-list {
  background: #fff;
  border-radius: 24rpx;
  overflow: hidden;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.04);

  .func-item {
    display: flex;
    align-items: center;
    padding: 32rpx;
    border-bottom: 2rpx solid #eee;

    &:last-child {
      border-bottom: none;
    }

    .func-icon {
      font-size: 44rpx;
      margin-right: 24rpx;
    }

    .func-text {
      flex: 1;
      font-size: 32rpx;
      color: #333;
    }

    .arrow {
      color: #6B5BFF;
      font-size: 48rpx;
    }

    &:active {
      background-color: #f8f9fa;
    }
  }
}

.version {
  text-align: center;
  color: #999;
  font-size: 26rpx;
  padding: 48rpx 0;
}

.tab-bar {
  display: flex;
  height: 100rpx;
  background: #fff;
  box-shadow: 0 -8rpx 24rpx rgba(0, 0, 0, 0.04);

  .tab-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    margin: 0 16rpx;

    .tab-text {
      font-size: 28rpx;
      color: #666;
    }

    &.active {
      .tab-text {
        color: #6B5BFF;
        font-weight: 600;
      }

      .tab-indicator {
        width: 48rpx;
        height: 8rpx;
        background: #6B5BFF;
        border-radius: 4rpx;
        position: absolute;
        bottom: 16rpx;
      }
    }
  }
}

</style>