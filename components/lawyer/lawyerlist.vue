<template>
  <!-- 分类标签 -->
  <view class="category-wrapper">
    <scroll-view scroll-x="true" class="category-scroll">
      <view
          v-for="(tag, index) in categories"
          :key="index"
          class="category-tag"
          :class="{ active: currentTag === tag }"
          @click="selectTag(tag)"
      >
        {{ tag }}
      </view>
    </scroll-view>
  </view>


  <view class="lawyer-list">
    <view
        v-for="(lawyer, index) in filterLawyerList"
        :key="index"
        class="lawyer-card"
        @click="handleClick(lawyer)"
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
    <view v-if="loading" class="loading">加载中...</view>
    <view v-if="noMore" class="no-more">没有更多了</view>
  </view>
</template>


<script setup>
import {navigateToUrl} from "@/utils/navigateTo";
import {computed, ref} from "vue";

const categories = ref([
  '全部', '刑事案件', '经济纠纷', '劳动纠纷', '工伤纠纷',
  '退费纠纷', '交通事故', '房产纠纷', '征地拆迁',
  '离婚纠纷', '债务协商', '更多领域'
]);
const currentTag = ref('全部');// 当前选中的标签
const lawyerList = [
  {
    id: 1,
    name: '魏会然',
    avatar: '/static/avatar1.png',
    consultCount: 75,
    score: 4.9,
    expertise: '工伤纠纷、交通事故、刑事案件、劳动纠纷、工伤纠纷、离婚纠纷',
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
    expertise: '退费纠纷、交通事故、经济纠纷',
    location: '北京朝阳区',
    price: 48
  },
  {
    id: 1,
    name: '魏会然',
    avatar: '/static/avatar1.png',
    consultCount: 75,
    score: 4.9,
    expertise: '合同纠纷、房产纠纷',
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
    expertise: '合同纠纷、房产纠纷',
    location: '北京朝阳区',
    price: 48
  },
  {
    id: 4,
    name: '魏会然',
    avatar: '/static/avatar1.png',
    consultCount: 75,
    score: 4.9,
    expertise: '征地拆迁',
    location: '北京朝阳区',
    price: 68,
    recommend: true
  },
  {
    id: 5,
    name: '何巧玲',
    avatar: '/static/avatar2.png',
    consultCount: 1312,
    score: 5.0,
    expertise: '征地拆迁',
    location: '北京朝阳区',
    price: 48
  },
  {
    id: 6,
    name: '魏会然',
    avatar: '/static/avatar1.png',
    consultCount: 75,
    score: 4.9,
    expertise: '债务协商',
    location: '北京朝阳区',
    price: 68,
    recommend: true
  },
  {
    id: 7,
    name: '何巧玲',
    avatar: '/static/avatar2.png',
    consultCount: 1312,
    score: 5.0,
    expertise: '债务协商',
    location: '北京朝阳区',
    price: 48
  },
  {
    id: 8,
    name: '魏会然',
    avatar: '/static/avatar1.png',
    consultCount: 75,
    score: 4.9,
    expertise: '合同纠纷、',
    location: '北京朝阳区',
    price: 68,
    recommend: true
  },
  {
    id: 9,
    name: '何巧玲',
    avatar: '/static/avatar2.png',
    consultCount: 1312,
    score: 5.0,
    expertise: '合同纠纷、交通事故',
    location: '北京朝阳区',
    price: 48
  },

  // 其他律师数据...
];

//选择标签
function selectTag(tagValue) {
  this.currentTag = tagValue;
}

// 计算属性：过滤律师列表
const filterLawyerList = computed(() => {
  if (currentTag.value === '全部') {
    return lawyerList;
  }
  return lawyerList.filter((lawyer) => lawyer.expertise.includes(currentTag.value));
})

function handleClick(item) {
  // 跳转到律师详情页
  navigateToUrl({
    url: `/pages/lawyerDetail/lawyerDetail?lawyerId=${item.id}`
  })
}
</script>

<
<style scoped>
/* 颜色变量 */
:root {
  --primary-color: #007AFF;
  --danger-color: #ff4444;
  --warning-color: #ff9900;
  --success-color: #4CD964;
  --text-primary: #333;
  --text-secondary: #666;
  --text-tertiary: #999;
  --bg-color: #f9f9f9;
  --card-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
}

/* 分类标签优化 */
.category-wrapper {
  background: #fff;
  padding: 20rpx 0;
  position: sticky;
  top: 0;
  z-index: 10;
}

.category-scroll {
  white-space: nowrap;
  padding: 0 20px;
}

.category-tag {
  display: inline-flex;
  align-items: center;
  padding: 12rpx 32rpx;
  background: #f5f5f5;
  border-radius: 40rpx;
  margin-right: 20rpx;
  font-size: 26rpx;
  color: var(--text-primary);
  transition: all 0.2s ease;
  position: relative;
}

.category-tag.active {
  background-color: var(--primary-color);
  color: #fff;
  font-weight: 500;
}

.category-tag:active {
  transform: scale(0.95);
}

/* 律师列表优化 */
.lawyer-list {
  height: calc(100vh - 640rpx);
  padding: 0 20rpx;
  background-color: var(--bg-color);
}

.lawyer-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: var(--card-shadow);
  transition: transform 0.2s ease;
}

.lawyer-card:active {
  transform: translateY(2rpx);
}

.lawyer-header {
  display: flex;
  gap: 20rpx;
}

.avatar {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  flex-shrink: 0;
  aspect-ratio: 1/1;
  background: #f5f5f5 url('/static/avatar-placeholder.png') no-repeat center/60%;
}

.lawyer-info {
  flex: 1;
  min-width: 0; /* 防止内容溢出 */
}

.name-line {
  display: flex;
  align-items: center;
  gap: 15rpx;
  flex-wrap: wrap;
}

.name {
  font-size: 32rpx;
  font-weight: bold;
  color: var(--text-primary);
}

.cert-badge {
  background: #f0f7ff;
  color: var(--primary-color);
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
  font-size: 22rpx;
}

.recommend-badge {
  background: #fff3e0;
  color: var(--warning-color);
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
  font-size: 22rpx;
}

.stats {
  font-size: 24rpx;
  color: var(--text-secondary);
  margin: 16rpx 0;
  display: flex;
  gap: 20rpx;
}

.score {
  color: var(--warning-color);
}

.expertise {
  color: var(--text-primary);
  font-size: 26rpx;
  margin: 8rpx 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.location {
  color: var(--text-tertiary);
  font-size: 24rpx;
}

.price-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20rpx;
  padding-top: 20rpx;
  border-top: 1rpx solid #eee;
}

.price {
  color: var(--danger-color);
  font-size: 32rpx;
  font-weight: bold;
}

.consult-type {
  color: var(--text-secondary);
  font-size: 26rpx;
}

/* 加载状态优化 */
.loading,
.no-more {
  text-align: center;
  font-size: 28rpx;
  color: var(--text-tertiary);
  padding: 40rpx 0;
  position: relative;
}

.loading::after {
  content: "";
  display: inline-block;
  width: 20rpx;
  height: 20rpx;
  border: 3rpx solid var(--text-tertiary);
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 0.8s linear infinite;
  margin-left: 12rpx;
  vertical-align: middle;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 响应式处理 */
@media (max-width: 480px) {
  .lawyer-card {
    padding: 24rpx;
  }

  .avatar {
    width: 80rpx;
    height: 80rpx;
  }

  .name {
    font-size: 28rpx;
  }
}
</style>

