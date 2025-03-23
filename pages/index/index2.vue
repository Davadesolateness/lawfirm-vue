<template>
  <view class="container">
    <!-- 顶部宣传栏 -->
    <view class="promotion-banner">
      <view class="promotion-title">下单后直接拨号，1分钟极速接通律师</view>
      <view class="promotion-features">
        <view class="feature-item" v-for="(feature, index) in features" :key="index">
          <uni-icons type="checkmark" size="18" color="#4CAF50" />
          <text>{{ feature }}</text>
        </view>
      </view>
    </view>

    <!-- 地区筛选 -->
    <view class="location-filter">
      <text class="district">东城区</text>
      <view class="filter-right">
        <text class="filter-text">律师专长</text>
        <text class="filter-text active">默认推荐</text>
      </view>
    </view>

    <!-- 律师列表 -->
    <scroll-view scroll-y class="lawyer-list">
      <view
          v-for="lawyer in lawyers"
          :key="lawyer.id"
          class="lawyer-card"
      >
        <view class="card-header">
          <image :src="lawyer.avatar" class="lawyer-avatar" />
          <view class="lawyer-badges">
            <text class="badge-cert">律师认证</text>
            <text v-if="lawyer.recommend" class="badge-recommend">平台优选</text>
          </view>
        </view>

        <view class="lawyer-info">
          <view class="name-rating">
            <text class="lawyer-name">{{ lawyer.name }}</text>
            <view class="rating">
              <uni-rate :value="lawyer.score" :size="14" color="#FFC107" readonly />
              <text class="score">{{ lawyer.score }}</text>
            </view>
          </view>

          <view class="stats">
            <text class="consult-count">咨询 {{ lawyer.consultCount }} 人</text>
            <view class="expertise-tags">
              <text
                  v-for="(tag, index) in lawyer.expertise"
                  :key="index"
                  class="expertise-tag"
              >
                {{ tag }}
              </text>
            </view>
          </view>

          <view class="location-price">
            <text class="location">{{ lawyer.location }}</text>
            <view class="price-section">
              <text class="price">¥{{ lawyer.price }}/30分钟</text>
              <button class="consult-btn" @click="handleConsult(lawyer.id)">
                电话咨询
              </button>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref } from 'vue';

const features = ref([
  '严选真实律师',
  '1对1私密咨询',
  '未服务自动退款'
]);

const lawyers = ref([
  {
    id: 1,
    name: '李文亮',
    avatar: '/static/avatar1.jpg',
    consultCount: 2084,
    score: 5.0,
    expertise: ['合同纠纷', '劳动纠纷', '交通事故'],
    location: '北京朝阳区',
    price: 99,
    recommend: true
  },
  // 其他律师数据...
]);
</script>

<style lang="scss" scoped>
.container {
  background: #F8F9FA;
  min-height: 100vh;
}

.promotion-banner {
  background: linear-gradient(135deg, #2979FF, #4A90E2);
  padding: 32rpx;
  color: #fff;
  border-radius: 0 0 24rpx 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(41, 121, 255, 0.2);

  .promotion-title {
    font-size: 36rpx;
    font-weight: 600;
    margin-bottom: 24rpx;
  }

  .promotion-features {
    display: flex;
    justify-content: space-between;

    .feature-item {
      display: flex;
      align-items: center;
      font-size: 28rpx;

      uni-icons {
        margin-right: 8rpx;
      }
    }
  }
}

.location-filter {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32rpx;
  background: #fff;
  margin: 24rpx;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05);

  .district {
    font-size: 32rpx;
    font-weight: 500;
    color: #333;
  }

  .filter-right {
    display: flex;
    gap: 32rpx;

    .filter-text {
      font-size: 28rpx;
      color: #666;
      position: relative;

      &.active {
        color: #2979FF;
        &::after {
          content: '';
          position: absolute;
          bottom: -8rpx;
          left: 50%;
          transform: translateX(-50%);
          width: 40rpx;
          height: 4rpx;
          background: #2979FF;
          border-radius: 2rpx;
        }
      }
    }
  }
}

.lawyer-list {
  height: calc(100vh - 360rpx);
  padding: 0 24rpx;
}

.lawyer-card {
  background: #fff;
  border-radius: 24rpx;
  padding: 32rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 8rpx 24rpx rgba(0,0,0,0.04);

  .card-header {
    display: flex;
    align-items: center;
    margin-bottom: 24rpx;

    .lawyer-avatar {
      width: 120rpx;
      height: 120rpx;
      border-radius: 50%;
      margin-right: 24rpx;
      border: 4rpx solid #fff;
      box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.1);
    }

    .lawyer-badges {
      display: flex;
      flex-direction: column;
      gap: 12rpx;

      .badge-cert {
        background: #E3F2FD;
        color: #2196F3;
        padding: 8rpx 16rpx;
        border-radius: 8rpx;
        font-size: 24rpx;
        align-self: flex-start;
      }

      .badge-recommend {
        background: #FFF8E1;
        color: #FFA000;
        padding: 8rpx 16rpx;
        border-radius: 8rpx;
        font-size: 24rpx;
      }
    }
  }

  .lawyer-info {
    .name-rating {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20rpx;

      .lawyer-name {
        font-size: 36rpx;
        font-weight: 600;
        color: #333;
      }

      .rating {
        display: flex;
        align-items: center;
        .score {
          font-size: 28rpx;
          color: #FFA000;
          margin-left: 12rpx;
        }
      }
    }

    .stats {
      .consult-count {
        font-size: 26rpx;
        color: #666;
        margin-bottom: 16rpx;
        display: block;
      }

      .expertise-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 12rpx;
        margin-bottom: 24rpx;

        .expertise-tag {
          background: #F5F5F5;
          color: #666;
          padding: 8rpx 16rpx;
          border-radius: 8rpx;
          font-size: 24rpx;
        }
      }
    }

    .location-price {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 24rpx;
      border-top: 2rpx solid #EEE;

      .location {
        font-size: 26rpx;
        color: #999;
      }

      .price-section {
        display: flex;
        align-items: center;
        gap: 24rpx;

        .price {
          color: #FF4444;
          font-size: 36rpx;
          font-weight: 700;
        }

        .consult-btn {
          background: linear-gradient(135deg, #2979FF, #4A90E2);
          color: #fff;
          border-radius: 40rpx;
          padding: 12rpx 32rpx;
          font-size: 28rpx;
          box-shadow: 0 4rpx 12rpx rgba(41, 121, 255, 0.3);
          &::after { border: none }
        }
      }
    }
  }
}
</style>