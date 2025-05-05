<template>
  <view class="tab-bar">
    <!-- 个人用户导航栏 -->
    <view v-if="userType === USER_TYPES.INDIVIDUAL" class="tab-bar-content">
      <view class="tab-item" :class="{ active: currentPage === 'index' }" @click="navTo('/pages/index/index')">
        <image :src="currentPage === 'index' ? '/static/images/home_active.png' : '/static/images/home.png'"></image>
        <text>首页</text>
      </view>
      <view class="tab-item" :class="{ active: currentPage === 'consult' }" @click="navTo('/pages/lawyer/lawyerinfo')">
        <image :src="currentPage === 'consult' ? '/static/images/home_active.png' : '/static/images/home.png'"></image>
        <text>个人咨询</text>
      </view>
      <view class="tab-item" :class="{ active: currentPage === 'order' }" @click="navTo('/pages/order/orderlist')">
        <image :src="currentPage === 'order' ? '/static/images/user_active.png' : '/static/images/user.png'"></image>
        <text>我的订单</text>
      </view>
      <view class="tab-item" :class="{ active: currentPage === 'user' }" @click="navTo('/pages/user/user')">
        <image :src="currentPage === 'user' ? '/static/images/user_active.png' : '/static/images/user.png'"></image>
        <text>个人中心</text>
      </view>
    </view>

    <!-- 法人用户导航栏 -->
    <view v-else-if="userType === USER_TYPES.CORPORATE" class="tab-bar-content">
      <view class="tab-item" :class="{ active: currentPage === 'index' }" @click="navTo('/pages/index/index')">
        <image :src="currentPage === 'index' ? '/static/images/home_active.png' : '/static/images/home.png'"></image>
        <text>首页</text>
      </view>
      <view class="tab-item" :class="{ active: currentPage === 'consult' }" @click="navTo('/pages/lawyer/lawyerinfo')">
        <image :src="currentPage === 'consult' ? '/static/images/home_active.png' : '/static/images/home.png'"></image>
        <text>企业咨询</text>
      </view>
      <view class="tab-item" :class="{ active: currentPage === 'order' }" @click="navTo('/pages/order/orderlist')">
        <image :src="currentPage === 'order' ? '/static/images/user_active.png' : '/static/images/user.png'"></image>
        <text>企业订单</text>
      </view>
      <view class="tab-item" :class="{ active: currentPage === 'user' }" @click="navTo('/pages/user/user')">
        <image :src="currentPage === 'user' ? '/static/images/user_active.png' : '/static/images/user.png'"></image>
        <text>企业信息</text>
      </view>
    </view>

    <!-- 律师导航栏 -->
    <view v-else-if="userType === USER_TYPES.LAWYER" class="tab-bar-content">
      <view class="tab-item" :class="{ active: currentPage === 'index' }" @click="navTo('/pages/index/index')">
        <image :src="currentPage === 'index' ? '/static/images/home_active.png' : '/static/images/home.png'"></image>
        <text>首页</text>
      </view>
      <view class="tab-item" :class="{ active: currentPage === 'order' }" @click="navTo('/pages/order/orderlist')">
        <image :src="currentPage === 'order' ? '/static/images/user_active.png' : '/static/images/user.png'"></image>
        <text>我的订单</text>
      </view>
      <view class="tab-item" :class="{ active: currentPage === 'lawyer' }" @click="navTo('/pages/lawyer/lawyerinfo')">
        <image :src="currentPage === 'lawyer' ? '/static/images/home_active.png' : '/static/images/home.png'"></image>
        <text>我的</text>
      </view>
      <view class="tab-item" :class="{ active: currentPage === 'user' }" @click="navTo('/pages/lawyer/lawyer')">
        <image :src="currentPage === 'user' ? '/static/images/user_active.png' : '/static/images/user.png'"></image>
        <text>我的</text>
      </view>-
    </view>

    <!-- 管理员导航栏 -->
    <view v-else-if="userType === USER_TYPES.ADMIN" class="tab-bar-content">
      <view class="tab-item" :class="{ active: currentPage === 'index' }" @click="navTo('/pages/index/index')">
        <image :src="currentPage === 'index' ? '/static/images/home_active.png' : '/static/images/home.png'"></image>
        <text>首页</text>
      </view>
      <view class="tab-item" :class="{ active: currentPage === 'admin' }" @click="navTo('/pages/admin/admin')">
        <image :src="currentPage === 'admin' ? '/static/images/home_active.png' : '/static/images/home.png'"></image>
        <text>管理面板</text>
      </view>
      <view class="tab-item" :class="{ active: currentPage === 'lawyer' }" @click="navTo('/pages/lawyer/addlawyerinfo')">
        <image :src="currentPage === 'lawyer' ? '/static/images/home_active.png' : '/static/images/home.png'"></image>
        <text>律师管理</text>
      </view>
      <view class="tab-item" :class="{ active: currentPage === 'user' }" @click="navTo('/pages/user/user')">
        <image :src="currentPage === 'user' ? '/static/images/user_active.png' : '/static/images/user.png'"></image>
        <text>我的</text>
      </view>
    </view>
  </view>
</template>

<script>
import { USER_TYPES, getUserType } from '@/utils/store/userManager';

export default {
  name: 'CustomTabBar',
  data() {
    return {
      USER_TYPES: USER_TYPES,
      userType: USER_TYPES.INDIVIDUAL, // 设置默认值为个人用户
      currentPage: 'index'
    };
  },
  created() {
    // 初始化时获取用户类型
    this.userType = getUserType();
    
    // 根据当前路径设置当前页面标识
    this.setCurrentPage();
  },
  methods: {
    // 设置当前页面标识
    setCurrentPage() {
      const pages = getCurrentPages();
      if (pages.length > 0) {
        const currentPage = pages[pages.length - 1].route;
        if (currentPage.includes('/index/')) {
          this.currentPage = 'index';
        } else if (currentPage.includes('/lawyer/')) {
          this.currentPage = 'lawyer';
        } else if (currentPage.includes('/order/')) {
          this.currentPage = 'order';
        } else if (currentPage.includes('/user/')) {
          this.currentPage = 'user';
        } else if (currentPage.includes('/admin/')) {
          this.currentPage = 'admin';
        } else if (currentPage.includes('/consult/')) {
          this.currentPage = 'consult';
        }
      }
    },
    
    // 页面导航
    navTo(url) {
      uni.switchTab({
        url: url,
        fail: () => {
          uni.navigateTo({
            url: url
          });
        }
      });
    }
  }
};
</script>

<style lang="scss">
.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100rpx;
  background-color: #fff;
  border-top: 1rpx solid #eee;
  z-index: 999;
}

.tab-bar-content {
  display: flex;
  height: 100%;
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  
  image {
    width: 44rpx;
    height: 44rpx;
    margin-bottom: 4rpx;
  }
  
  text {
    font-size: 24rpx;
    color: #666;
  }
  
  &.active {
    text {
      color: #007AFF;
    }
  }
}
</style> 