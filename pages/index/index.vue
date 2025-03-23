<template>
  <view class="container">
    <!-- 顶部横幅 -->
    <view class="top-banner">
      <view class="banner-title">全国20万执业律师，24小时在线服务</view>
      <view class="banner-sub">严选真实律师 1对私密咨询 未服务可退款</view>
    </view>

    <!-- 服务导航 -->
    <view class="service-nav">
      <view v-for="(item, index) in services" :key="index" class="nav-item">
        <uni-icons :type="item.icon" size="30" color="#2979FF"/>
        <text class="nav-title">{{ item.title }}</text>
        <text class="nav-desc">{{ item.desc }}</text>
      </view>
    </view>

    <!-- 分类标签 -->
    <view class="category-wrapper">
      <scroll-view scroll-x class="category-scroll">
        <view
            v-for="(tag, index) in categories"
            :key="index"
            class="category-tag"
        >
          {{ tag }}
        </view>
      </scroll-view>
    </view>

    <!-- 律师列表 -->
    <scroll-view scroll-y class="lawyer-list">
      <view
          v-for="(lawyer, index) in lawyers"
          :key="lawyer.id"
          class="lawyer-card"
      >
        <view class="lawyer-header">
          <image :src="lawyer.avatar" class="avatar"/>
          <view class="lawyer-info">
            <view class="name-line">
              <text class="name">{{ lawyer.name }}</text>
              <text class="cert-badge">律师认证</text>
              <text v-if="lawyer.recommend" class="recommend-badge">平台优选</text>
            </view>
            <view class="stats">
              <text>咨询人数 {{ lawyer.consultCount }}</text>
              <text class="score">用户评分 {{ lawyer.score }}</text>
            </view>
            <view class="expertise">{{ lawyer.expertise }}</view>
            <view class="location">{{ lawyer.location }}</view>
          </view>
        </view>
        <view class="price-line">
          <text class="price">¥{{ lawyer.price }}/30分钟</text>
          <text class="consult-type">电话咨询</text>
        </view>
      </view>
    </scroll-view>

    <!-- 底部导航 -->
    <view class="tab-bar">
      <view
          v-for="(tab, index) in tabs"
          :key="index"
          class="tab-item"
          :class="{ active: activeTab === index }"
      >
        <uni-icons :type="tab.icon" size="20"/>
        <text>{{ tab.text }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import {ref} from 'vue';

const services = ref([
  {icon: 'staff', title: '智能匹配', desc: '律师/法务'},
  {icon: 'phone', title: '电话快问', desc: '1分钟接通律师'},
  {icon: 'medal', title: '专家咨询', desc: '执业10年以上律师'},
]);

const categories = ref([
  '刑事案件', '经济纠纷', '劳动纠纷', '工伤纠纷',
  '退费纠纷', '交通事故', '房产纠纷', '征地拆迁',
  '离婚纠纷', '债务协商', '更多领域'
]);

const lawyers = ref([
  {
    id: 1,
    name: '魏会然',
    avatar: '/static/avatar1.png',
    consultCount: 75,
    score: 4.9,
    expertise: '合同纠纷、劳动纠纷、交通事故',
    location: '北京朝阳区',
    price: 68,
    recommend: true
  },
  {
    id: 2,
    name: '何巧玲',
    avatar: '/static/avatar2.png',
    consultCount: 1312,
    score: 5.0,
    expertise: '合同纠纷、劳动纠纷、交通事故',
    location: '北京朝阳区',
    price: 48
  },
  // 其他律师数据...
]);

const tabs = ref([
  {icon: 'home', text: '首页'},
  {icon: 'chat', text: '免费咨询'},
  {icon: 'cart', text: '订单'},
  {icon: 'person', text: '我的'}
]);

const activeTab = ref(0);
</script>

<style lang="css" scoped>

.container {
  background-color: #f5f5f5;
  padding-bottom: 100rpx;
}

.top-banner {
  background-color: #2979FF;
  padding: 30rpx;
  color: #fff;

  .banner-title {
    font-size: 36rpx;
    font-weight: bold;
    margin-bottom: 15rpx;
  }

  .banner-sub {
    font-size: 28rpx;
    opacity: 0.9;
  }
}

.service-nav {
  display: flex;
  justify-content: space-around;
  background: #fff;
  padding: 30rpx 0;
  margin: 20rpx 0;

  .nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;

    .nav-title {
      font-size: 28rpx;
      margin: 10rpx 0;
    }

    .nav-desc {
      font-size: 24rpx;
      color: #666;
    }
  }
}

.category-wrapper {
  background: #fff;
  padding: 20rpx 0;

  .category-scroll {
    white-space: nowrap;
    padding: 0 20rpx;

    .category-tag {
      display: inline-block;
      padding: 12rpx 24rpx;
      background: #f5f5f5;
      border-radius: 40rpx;
      margin-right: 20rpx;
      font-size: 26rpx;
      color: #333;
    }
  }
}

.lawyer-list {
  height: calc(100vh - 640rpx);
  padding: 0 20rpx;

  .lawyer-card {
    background: #fff;
    border-radius: 16rpx;
    padding: 30rpx;
    margin-bottom: 20rpx;

    .lawyer-header {
      display: flex;

      .avatar {
        width: 100rpx;
        height: 100rpx;
        border-radius: 50%;
        margin-right: 20rpx;
      }

      .lawyer-info {
        flex: 1;

        .name-line {
          display: flex;
          align-items: center;

          .name {
            font-size: 32rpx;
            font-weight: bold;
            margin-right: 15rpx;
          }

          .cert-badge {
            background: #f0f7ff;
            color: #2979FF;
            padding: 4rpx 12rpx;
            border-radius: 8rpx;
            font-size: 22rpx;
            margin-right: 10rpx;
          }

          .recommend-badge {
            background: #fff3e0;
            color: #ff9900;
            padding: 4rpx 12rpx;
            border-radius: 8rpx;
            font-size: 22rpx;
          }
        }

        .stats {
          font-size: 24rpx;
          color: #666;
          margin: 10rpx 0;

          .score {
            margin-left: 20rpx;
            color: #ff9900;
          }
        }

        .expertise {
          color: #333;
          font-size: 26rpx;
          margin: 8rpx 0;
        }

        .location {
          color: #999;
          font-size: 24rpx;
        }
      }
    }

    .price-line {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 20rpx;
      padding-top: 20rpx;
      border-top: 1rpx solid #eee;

      .price {
        color: #ff4444;
        font-size: 32rpx;
        font-weight: bold;
      }

      .consult-type {
        color: #666;
        font-size: 26rpx;
      }
    }
  }
}

.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100rpx;
  background: #fff;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);

  .tab-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #666;

    &.active {
      color: #2979FF;
    }

    text {
      font-size: 22rpx;
      margin-top: 6rpx;
    }
  }
}

.item-question {
  min-width: 78px;
  background: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-right: 10px;
  align-items: center;
  border-radius: 8px;
  box-shadow: 0px 2px 16px 0px rgba(0, 0, 0, .06);
}
</style>