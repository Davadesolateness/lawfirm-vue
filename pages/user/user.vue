<template>
  <PageLayout>
    <view class="container">
      <!-- 用户信息区 -->
      <view class="user-header">
        <view class="user-info">
          <image class="avatar" :src="userInfo.avatar" mode="aspectFill"/>
          <view class="user-meta">
            <text class="username">{{ userInfo.username }}</text>
            <view class="user-tag" v-if="corporateuser">法人用户</view>
            <view class="user-tag" v-else>普通用户</view>
          </view>
        </view>
        <view class="membership-card">
          <text class="membership-level">黄金会员</text>
          <text class="expire-date">有效期至：2024-12-31</text>

          <view class="privilege-tags">
            <text class="tag">专属律师</text>
            <text class="tag">双倍积分</text>
            <text class="tag">优先服务</text>
          </view>
        </view>

        <!-- 修改后的优惠券卡片 -->
        <view class="coupon-card">
          <view class="card-header">
            <text class="card-title">我的使用次数</text>
            <view class="decorative-line"></view>
          </view>
          <view class="coupon-list">
            <view v-for="(coupon, index) in coupons" :key="index" class="coupon-item">
              <text class="times">{{ coupon.times }}次</text>
              <view class="coupon-info">
                <text class="name">{{ coupon.name }}</text>
                <text class="condition">可用{{ coupon.times }}次</text>
                <text class="expire">{{ coupon.expire }}</text>
              </view>
            </view>
          </view>
        </view>
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

      <view>
        <button class="el-button--text" @click="modifyUserInfo">修改用户</button>
      </view>
      <view>
        <button class="el-button--text" @click="adminPage">管理员</button>
      </view>
    </view>
  </PageLayout>
</template>

<script setup>
import {ref} from "vue"
import {navigateTo, navigateToUrl} from "@/utils/navigateTo";
import {apiGetUserInfoById} from "@/api/userapi";
import {onShow} from "@dcloudio/uni-app";
import PageLayout from "@/components/custom/tabbarlayout.vue";

// 功能列表
const functionList = ref([
  {
    icon: 'calendar',
    name: '我的预约',
    type: 'appointment'
  },
  {
    icon: 'paperplane',
    name: '我的咨询',
    type: 'consultation'
  },
  {
    icon: 'star',
    name: '我的收藏',
    type: 'favorite'
  },
  {
    icon: 'help',
    name: '帮助中心',
    type: 'help'
  },
  {
    icon: 'settings',
    name: '设置',
    type: 'setting'
  }
]);

// 修改后的响应式数据
const coupons = ref([
  {times: 3, name: '优惠券', expire: '2023-12-31'},
  /* {times: 5, name: '会员专属券', expire: '2024-01-31'},
   {times: 1, name: '新人礼券', expire: '2024-02-28'}*/
]);

const membership = ref({
  level: '黄金会员',
  progress: 60,
  expire: '2024-12-31'
});

let corporateuser = true;
let avatarImg = '';  // 头像
const userInfo = ref(null); // 用户信息

onShow(() => {
  initUserInfo();
});

function judgeUserType() {
  if (userInfo.usertype == "corporate") {
    corporateuser = true;
  } else {
    corporateuser = false;
  }
}

// 初始化用户信息
function initUserInfo() {
  getUserInfoById()
}

const getUserInfoById = async () => {
  userInfo.value = await apiGetUserInfoById("444");
  avatarImg = userInfo.value.avatar;
}

function toPage(url) {
  this.navigate.navigateToUrl("2020-01-01");
}

// 修改用户信息
function modifyUserInfo() {
  navigateTo({
    url: "/pages/user/modifyuserinfo",
    params: {
      username: userInfo.value.username,
      avatarImg: avatarImg,
      phone: userInfo.value.phone_number
    }
  })
}

function adminPage() {
  navigateToUrl("/pages/admin/admin");
}
</script>

<style lang="scss" scoped>
/* 基础容器 */
.container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f8fafb;
}

/* 用户信息区优化 */
.user-header {
  background: linear-gradient(135deg, #f0f4ff 0%, #e6ecfa 100%);
  padding: 48rpx 32rpx 10rpx;
  position: relative;

  .user-info {
    display: flex;
    align-items: center;
    margin-bottom: 40rpx;

    .avatar {
      width: 128rpx;
      height: 128rpx;
      border-radius: 50%;
      border: 2rpx solid rgba(255, 255, 255, 0.8);
      margin-right: 32rpx;
      box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
    }

    .user-meta {
      .username {
        color: #2d3436;
        font-size: 40rpx;
        font-weight: 600;
        letter-spacing: 0.5rpx;
      }

      .user-tag {
        display: inline-block;
        padding: 6rpx 24rpx;
        background: rgba(127, 127, 213, 0.1);
        border-radius: 32rpx;
        color: #7F7FD5;
        font-size: 26rpx;
        margin-top: 12rpx;
        border: 1rpx solid rgba(127, 127, 213, 0.2);
      }
    }
  }
}

/* 会员卡片优化 */
.membership-card {
  background: linear-gradient(135deg, #f0f5ff 0%, #e8efff 100%);
  border-radius: 20rpx;
  padding: 28rpx;
  margin: 0 0 24rpx;
  border: 1rpx solid rgba(127, 127, 213, 0.1);

  .membership-level {
    color: #4A67FF;
    font-size: 36rpx;
    font-weight: 600;
    margin-bottom: 12rpx;
  }

  .expire-date {
    color: #666;
    font-size: 26rpx;

    &::before {
      content: "📅 ";
    }
  }

  .privilege-tags {
    margin-top: 24rpx;
    display: flex;
    gap: 16rpx;

    .tag {
      background: rgba(127, 127, 213, 0.08);
      color: #4A67FF;
      padding: 6rpx 20rpx;
      border-radius: 32rpx;
      font-size: 24rpx;
      border: 1rpx solid rgba(127, 127, 213, 0.15);
    }
  }
}

/* 使用次数卡片优化 */
.coupon-card {
  background: #fff;
  border-radius: 20rpx;
  padding: 24rpx;
  margin: 24rpx 0;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);

  .card-header {
    margin-bottom: 24rpx;

    .card-title {
      color: #444;
      font-size: 32rpx;
      font-weight: 500;
    }

    .decorative-line {
      width: 48rpx;
      height: 4rpx;
      background: #7F7FD5;
      margin-top: 12rpx;
    }
  }

  .coupon-item {
    padding: 24rpx;
    background: #f8f9ff;
    border-radius: 16rpx;
    margin: 16rpx 0;
    display: flex;
    align-items: center;

    .times {
      color: #4A67FF;
      font-size: 40rpx;
      font-weight: 600;
      margin-right: 32rpx;
      min-width: 96rpx;
    }

    .coupon-info {
      .name {
        color: #444;
        font-size: 28rpx;
      }

      .condition {
        color: #666;
        font-size: 26rpx;
      }

      .expire {
        color: #999;
        font-size: 24rpx;
        margin-top: 8rpx;
      }
    }
  }
}

/* 功能列表优化 */
.func-list {
  background: #fff;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);

  .func-item {
    padding: 28rpx 32rpx;
    border-bottom: 1rpx solid #f0f0f0;
    display: flex;
    align-items: center;
    transition: background 0.2s;

    &:last-child {
      border-bottom: none;
    }

    .func-icon {
      font-size: 40rpx;
      margin-right: 24rpx;
      width: 56rpx;
      text-align: center;
    }

    .func-text {
      flex: 1;
      color: #444;
      font-size: 30rpx;
    }

    .arrow {
      color: #999;
      font-size: 40rpx;
    }

    &:active {
      background: #f8f9ff;
    }
  }
}
</style>