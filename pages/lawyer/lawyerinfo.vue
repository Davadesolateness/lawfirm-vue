<template>
  <view class="container">
    <!-- 律师信息头部 -->
    <view class="profile-header">
      <view class="user-info">
        <image class="avatar" src="/static/default-avatar.png" mode="aspectFill"/>
        <view class="user-meta">
          <text class="username">{{ lawyerInfo.lawyername }}</text>
          <view class="verify-tag">律师认证</view>
        </view>
      </view>
      <view class="meta-info">
        <text class="license">执业证号：{{ lawyerInfo.lawyerlicensenumber }}</text>
        <text class="location">{{ lawyerInfo.address }}</text>
      </view>
    </view>

    <!-- 服务类型 -->
    <view class="service-card">
      <view class="card-header">
        <text class="card-title">电话咨询服务</text>
        <view class="decorative-line"></view>
      </view>
      <view class="price-section">
        <text class="price">¥38</text>
        <text class="duration">/30分钟</text>
      </view>
      <text class="service-desc">下单后直接拨号，1分钟快速接通律师</text>

      <view class="guarantee-tags">
        <view class="tag-item" v-for="(tag,index) in guaranteeTags" :key="index">
          <text class="tag-icon">✓</text>
          <text class="tag-text">{{ tag }}</text>
        </view>
      </view>
    </view>

    <!-- 律师简介 -->
    <view class="info-card">
      <view class="card-header">
        <text class="card-title">律师简介</text>
        <view class="decorative-line"></view>
      </view>
      <text class="content-text">
        {{ lawyerInfo.introduction }}
      </text>
    </view>

    <!-- 专长经验 -->
    <view class="info-card">
      <view class="card-header">
        <text class="card-title">专长经验</text>
        <view class="decorative-line"></view>
      </view>
      <view class="expertise-item">
        <text class="expertise-type">劳动纠纷</text>
        <text class="case-count">办理了5个案件</text>
      </view>
    </view>

    <!-- 用户评价 -->
    <view class="info-card">
      <view class="card-header">
        <text class="card-title">用户评价</text>
        <view class="decorative-line"></view>
      </view>
      <view class="review-list">
        <view class="review-item" v-for="(review,index) in reviews" :key="index">
          <view class="review-header">
            <text class="username">{{ review.user }}</text>
            <text class="rating-tag" :class="review.ratingClass">{{ review.ratingText }}</text>
          </view>
          <view class="tag-group">
            <text class="feature-tag" v-for="(tag,tIndex) in review.tags" :key="tIndex">{{ tag }}</text>
          </view>
          <text class="review-time">{{ review.time }}</text>
        </view>
      </view>
    </view>

    <!-- 固定咨询按钮 -->
    <view class="fixed-consult-btn" @click="handleConsult">
      <text>立即咨询</text>
    </view>
    <view>
      <button class="el-button--text" @click="modifyLawyerInfo">修改律师</button>
    </view>
    <view>
      <button class="el-button--text" @click="addLawyerInfo">增加律师</button>
    </view>
  </view>
</template>

<script setup>
import {ref} from "vue"
import {navigateTo} from "@/utils/navigateTo";
import {onShow} from "@dcloudio/uni-app";
import {getLawyerInfoById} from "./lawyerservice";
import {apiGetLawyerInfoById} from "@/api/lawyerapi";

const lawyerInfo = ref();
const guaranteeTags = ['平台保障', '严选真实律师', '1对1私密咨询', '未服务自动退款'];
const reviews = [
  {
    user: '15****',
    tags: ['解答很清晰', '态度很好', '回复很快'],
    ratingText: '好',
    ratingClass: 'rating-good',
    time: '2024-04-07 12:17:14'
  },
  // ...其他评价数据
];

function handleConsult() {
  uni.navigateTo({url: '/pages/consult/confirm'})
}

// 增加律师
function addLawyerInfo() {
  navigateTo({
    url: "/pages/lawyer/addlawyerinfo",
    params: {
      isEditMode: false
    }
  })
}

// 修改律师
function modifyLawyerInfo() {
  navigateTo({
    url: "/pages/lawyer/addlawyerinfo",
    params: {
      isEditMode: true,
      lawyerId: "444"
    }
  })
}

// 展示页面时调用此方法
onShow(() => {
  initLawyerInfo();
});

// 初始化律师信息
function initLawyerInfo() {
  apiGetLawyerInfoById("444").then((data) =>{
    lawyerInfo.value = data;
  })
  debugger
}


// 根据id获取律师信息
/*const getLawyerInfoById = async () => {
  lawyerInfo.value = await apiGetLawyerInfoById("444");
  console.log("------"+lawyerInfo);
}*/

</script>

<style lang="scss" scoped>
.container {
  background: #f8fafd;
  min-height: 100vh;
  padding: 0 32rpx 120rpx;
}

.profile-header {
  background: linear-gradient(135deg, #6B5BFF 0%, #8176a5 100%);
  border-radius: 24rpx;
  padding: 32rpx;
  margin: 32rpx 0;
  box-shadow: 0 8rpx 24rpx rgba(107, 91, 255, 0.1);

  .user-info {
    display: flex;
    align-items: center;
    margin-bottom: 40rpx;

    .avatar {
      width: 120rpx;
      height: 120rpx;
      border-radius: 50%;
      border: 4rpx solid rgba(255, 255, 255, 0.3);
      margin-right: 32rpx;
    }

    .user-meta {
      .username {
        color: #fff;
        font-size: 40rpx;
        font-weight: 600;
        margin-bottom: 8rpx;
      }

      .verify-tag {
        display: inline-block;
        padding: 8rpx 24rpx;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 32rpx;
        color: #fff;
        font-size: 28rpx;
      }
    }
  }

  .meta-info {
    border-top: 2rpx solid rgba(255, 255, 255, 0.2);
    padding-top: 24rpx;

    .license, .location {
      display: block;
      color: rgba(255, 255, 255, 0.9);
      font-size: 28rpx;
      line-height: 1.6;
    }
  }
}

.service-card, .info-card {
  background: #fff;
  border-radius: 24rpx;
  padding: 32rpx;
  margin-bottom: 32rpx;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.04);

  .card-header {
    margin-bottom: 32rpx;

    .card-title {
      font-size: 36rpx;
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
}

.service-card {
  .price-section {
    display: flex;
    align-items: baseline;
    margin-bottom: 24rpx;

    .price {
      color: #f44336;
      font-size: 48rpx;
      font-weight: 700;
      margin-right: 16rpx;
    }

    .duration {
      color: #757575;
      font-size: 28rpx;
    }
  }

  .service-desc {
    color: #666;
    font-size: 28rpx;
    margin-bottom: 32rpx;
  }

  .guarantee-tags {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16rpx;

    .tag-item {
      background: #f8f9ff;
      border-radius: 16rpx;
      padding: 16rpx;
      display: flex;
      align-items: center;

      .tag-icon {
        color: #6B5BFF;
        margin-right: 12rpx;
        font-weight: bold;
      }

      .tag-text {
        color: #444;
        font-size: 26rpx;
      }
    }
  }
}

.info-card {
  .content-text {
    color: #666;
    font-size: 28rpx;
    line-height: 1.8;
  }

  .expertise-item {
    background: #f8f9ff;
    border-radius: 16rpx;
    padding: 24rpx;
    margin-top: 24rpx;

    .expertise-type {
      color: #6B5BFF;
      font-size: 30rpx;
      font-weight: 500;
    }

    .case-count {
      color: #888;
      font-size: 26rpx;
      margin-top: 12rpx;
    }
  }
}

.review-list {
  .review-item {
    padding: 32rpx 0;
    border-bottom: 2rpx solid #eee;

    &:last-child {
      border-bottom: none;
    }

    .review-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16rpx;

      .username {
        color: #444;
        font-size: 28rpx;
      }

      .rating-tag {
        font-size: 24rpx;
        padding: 8rpx 24rpx;
        border-radius: 32rpx;

        &.rating-good {
          background: #e8f5e9;
          color: #2e7d32;
        }

        &.rating-great {
          background: #e3f2fd;
          color: #0277bd;
        }

        &.rating-satisfied {
          background: #fff9c4;
          color: #9e9d24;
        }
      }
    }

    .tag-group {
      display: flex;
      flex-wrap: wrap;
      gap: 16rpx;
      margin-bottom: 16rpx;

      .feature-tag {
        background: #f5f5f5;
        color: #666;
        font-size: 24rpx;
        padding: 8rpx 24rpx;
        border-radius: 32rpx;
      }
    }

    .review-time {
      color: #999;
      font-size: 24rpx;
    }
  }
}

.fixed-consult-btn {
  position: fixed;
  bottom: 64rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 70%;
  height: 96rpx;
  background: linear-gradient(135deg, #6B5BFF 0%, #8176a5 100%);
  color: white;
  border-radius: 64rpx;
  font-size: 34rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(107, 91, 255, 0.3);
  transition: all 0.2s;

  &:active {
    transform: translateX(-50%) scale(0.95);
  }
}
</style>