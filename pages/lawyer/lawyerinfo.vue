<template>
  <view class="container">
    <!-- 律师信息头部 -->
    <view class="profile-header">
      <view class="lawyer-info">
        <text class="name">孟繁光律师</text>
        <text class="verify-tag">律师认证</text>
      </view>
      <text class="license">执业证号：11101202210486101</text>
      <text class="location">所在地区：北京丰台区</text>
    </view>

    <!-- 服务类型 -->
    <view class="service-card">
      <view class="service-header">
        <text class="title">电话咨询</text>
        <text class="price">¥38<text class="duration">/30分钟</text></text>
      </view>
      <text class="service-desc">下单后直接拨号，1分钟快速接通律师</text>
      <view class="guarantee-tags">
        <view class="tag-item" v-for="(tag,index) in guaranteeTags" :key="index">
          <uni-icons type="checkmark" size="16" color="#4CAF50" />
          <text>{{ tag }}</text>
        </view>
      </view>
    </view>

    <!-- 律师简介 -->
    <view class="intro-card">
      <text class="section-title">律师简介</text>
      <text class="intro-content">
        本人主要业务领域为劳动争议、刑事辩护以及民事诉讼。曾帮助几百名劳动者争取经济补偿、赔偿等。刑事辩护中也曾多次为犯罪嫌疑人、被告人争取到前定不起诉、无罪的良好结果。
      </text>
    </view>

    <!-- 专长经验 -->
    <view class="expertise-card">
      <text class="section-title">专长经验（根据法院大数据整理）</text>
      <view class="expertise-item">
        <text class="expertise-type">劳动纠纷</text>
        <text class="case-count">办理了5个案件</text>
      </view>
    </view>

    <!-- 用户评价 -->
    <view class="review-card">
      <text class="section-title">用户评分</text>
      <view class="review-list">
        <view class="review-item" v-for="(review,index) in reviews" :key="index">
          <view class="user-header">
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
      <text>立即咨询孟繁光律师</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      guaranteeTags: ['平台保障', '严选真实律师', '1对1私密咨询', '未服务自动退款'],
      reviews: [
        {
          user: '15****',
          tags: ['解答很清晰', '态度很好', '回复很快'],
          ratingText: '好',
          ratingClass: 'rating-good',
          time: '2024-04-07 12:17:14'
        },
        {
          user: '13****',
          tags: ['解答很清晰', '态度很好', '回复很快'],
          ratingText: '很好',
          ratingClass: 'rating-great',
          time: '2024-03-01 09:21:11'
        },
        {
          user: '那****',
          tags: ['解答很清晰', '态度很好', '回复很快'],
          ratingText: '满意',
          ratingClass: 'rating-satisfied',
          time: '2024-01-03 06:57:51'
        }
      ]
    }
  },
  methods: {
    handleConsult() {
      uni.navigateTo({url: '/pages/consult/confirm'})
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  background: #f8fafd;
  min-height: 100vh;
  padding: 32rpx;
}

.profile-header {
  background: white;
  border-radius: 24rpx;
  padding: 32rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 90, 173, 0.08);

  .lawyer-info {
    display: flex;
    align-items: center;
    margin-bottom: 16rpx;

    .name {
      font-size: 40rpx;
      color: #1a237e;
      font-weight: 600;
      margin-right: 24rpx;
    }

    .verify-tag {
      background: #4CAF50;
      color: white;
      font-size: 24rpx;
      padding: 8rpx 24rpx;
      border-radius: 32rpx;
    }
  }

  .license, .location {
    display: block;
    font-size: 28rpx;
    color: #616161;
    line-height: 1.6;
  }
}

.service-card {
  background: white;
  border-radius: 24rpx;
  padding: 32rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 90, 173, 0.08);

  .service-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 24rpx;

    .title {
      font-size: 36rpx;
      color: #1a237e;
      font-weight: 500;
    }

    .price {
      color: #f44336;
      font-size: 48rpx;
      font-weight: 700;

      .duration {
        font-size: 28rpx;
        color: #757575;
        margin-left: 8rpx;
      }
    }
  }

  .service-desc {
    color: #616161;
    font-size: 28rpx;
    margin-bottom: 32rpx;
    display: block;
  }

  .guarantee-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 16rpx;

    .tag-item {
      background: #f5faff;
      border-radius: 32rpx;
      padding: 12rpx 24rpx;
      display: flex;
      align-items: center;

      text {
        font-size: 26rpx;
        color: #2196F3;
        margin-left: 8rpx;
      }
    }
  }
}

.intro-card, .expertise-card, .review-card {
  background: white;
  border-radius: 24rpx;
  padding: 32rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 90, 173, 0.08);

  .section-title {
    display: block;
    font-size: 32rpx;
    color: #1a237e;
    font-weight: 500;
    margin-bottom: 24rpx;
    padding-bottom: 24rpx;
    border-bottom: 2rpx solid #e3f2fd;
  }
}

.intro-content {
  font-size: 28rpx;
  color: #616161;
  line-height: 1.8;
}

.expertise-item {
  background: #f5faff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-top: 24rpx;

  .expertise-type {
    font-size: 30rpx;
    color: #2196F3;
    font-weight: 500;
  }

  .case-count {
    font-size: 26rpx;
    color: #757575;
    margin-top: 12rpx;
    display: block;
  }
}

.review-list {
  .review-item {
    padding: 32rpx 0;
    border-bottom: 2rpx solid #e3f2fd;

    &:last-child {
      border-bottom: none;
    }

    .user-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16rpx;

      .username {
        color: #424242;
        font-size: 28rpx;
      }

      .rating-tag {
        font-size: 24rpx;
        padding: 6rpx 20rpx;
        border-radius: 32rpx;

        &.rating-good {
          background: #C8E6C9;
          color: #2E7D32;
        }

        &.rating-great {
          background: #B3E5FC;
          color: #0277BD;
        }

        &.rating-satisfied {
          background: #F0F4C3;
          color: #9E9D24;
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
        color: #757575;
        font-size: 24rpx;
        padding: 8rpx 16rpx;
        border-radius: 32rpx;
      }
    }

    .review-time {
      color: #bdbdbd;
      font-size: 24rpx;
      display: block;
    }
  }
}

.fixed-consult-btn {
  position: fixed;
  bottom: 108rpx;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
  color: white;
  padding: 24rpx 96rpx;
  border-radius: 48rpx;
  font-size: 28rpx;
  box-shadow: 0 8rpx 24rpx rgba(33, 150, 243, 0.3);
  transition: all 0.2s;

  &:active {
    transform: translateX(-50%) scale(0.95);
  }
}
</style>