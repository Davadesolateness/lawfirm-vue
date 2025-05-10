<template>
  <PageLayout>
    <view class="container">
      <!-- 公告栏 -->
      <view class="announcement-bar">
        <view class="announcement-content">
          <uni-icons type="info" size="16" color="#e53e3e"></uni-icons>
          <text class="announcement-text">新用户首次咨询享8折优惠 | 在线咨询即时响应率98%</text>
        </view>
      </view>

      <!-- 律师列表 -->
      <scroll-view scroll-y class="lawyer-list">
        <LawyerList ref="lawyerListRef" :search-keyword="searchKeyword"></LawyerList>
      </scroll-view>

    </view>
  </PageLayout>
</template>

<script setup>
import { ref } from 'vue';
import { navigateToUrl } from "@/utils/navigateTo";
import LawyerList from "@/components/lawyer/lawyerlist";
import PageLayout from "@/components/page-layout/tabbarlayout.vue";

// 搜索相关
const searchKeyword = ref('');

function login() {
  navigateToUrl('/pages/login/login')
}
</script>

<style lang="scss" scoped>
.container {
  background-color: #ffffff; // 背景改为纯白
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.announcement-bar {
  background: #f8fafc;
  padding: 20rpx 32rpx;
  border-bottom: 1rpx solid #edf2f7;
  display: flex;
  align-items: center;

  .announcement-content {
    display: flex;
    align-items: center;
    width: 100%;
    overflow: hidden;
  }

  uni-icons {
    margin-right: 16rpx;
    flex-shrink: 0;
  }

  .announcement-text {
    font-size: 26rpx;
    color: #4a5568;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    animation: marquee 15s linear infinite;
  }

  @keyframes marquee {
    0% {
      transform: translateX(100%);
    }
    100% {
      transform: translateX(-100%);
    }
  }
}

.lawyer-list {
  flex: 1;
  padding: 24rpx 0;
}

.consult-btn {
  width: 80%;
  height: 96rpx;
  line-height: 96rpx;
  margin: 32rpx auto;
  background: linear-gradient(135deg, #4a67ff, #304ffe);
  color: #fff;
  font-size: 34rpx;
  border-radius: 48rpx;
  box-shadow: 0 8rpx 24rpx rgba(74, 103, 255, 0.2);
  transition: all 0.2s;

  &:active {
    transform: scale(0.98);
    opacity: 0.9;
  }
}
</style>