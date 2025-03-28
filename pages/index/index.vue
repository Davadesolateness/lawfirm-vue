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

    <!-- 律师列表 -->
    <scroll-view scroll-y class="lawyer-list">
      <LawyerList></LawyerList>
    </scroll-view>

    <button class="consult-btn" @click="handleConsult('111')">
      跳转律师详情
    </button>
  </view>

</template>


<script setup>
import {ref} from 'vue';
import {navigateToUrl} from "@/utils/navigateTo";
import LawyerList from "@/components/lawyer/lawyerlist";

function handleConsult(item) {
  navigateToUrl('/components/lawyer/lawyerlist')
}

const services = ref([
  {icon: 'staff', title: '智能匹配', desc: '律师/法务'},
  {icon: 'phone', title: '电话快问', desc: '1分钟接通律师'},
  {icon: 'medal', title: '专家咨询', desc: '执业10年以上律师'},
]);


function filteredLawyers() {
  if (this.currentTag === 'all') {
    return this.lawyers;
  }
  return this.lawyers.filter((lawyer) => lawyer.category === this.currentTag);
}

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
.lawyer-list {
  height: calc(100vh - 640rpx);
  padding: 0 20rpx;
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