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
    <!-- 搜索中状态 -->
    <view v-if="loading" class="loading-container">
      <view class="loading">搜索中...</view>
    </view>
    
    <!-- 无搜索结果 -->
    <view v-else-if="noMore && searchKeyword" class="empty-result">
      <uni-icons type="info" size="32" color="#cecece"></uni-icons>
      <text class="empty-text">没有找到"{{ searchKeyword }}"相关的律师</text>
    </view>
    
    <!-- 搜索结果列表 -->
    <template v-else>
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
      
      <!-- 底部状态显示 -->
      <view v-if="filterLawyerList.length > 0 && !noMore" class="list-footer">
        <view class="loading">加载更多中...</view>
      </view>
      <view v-else-if="filterLawyerList.length > 0" class="list-footer">
        <view class="no-more">没有更多了</view>
      </view>
    </template>
  </view>
</template>


<script setup>
import {navigateToUrl} from "@/utils/navigateTo";
import {computed, ref, watch} from "vue";

// 接收搜索关键词参数
const props = defineProps({
  searchKeyword: {
    type: String,
    default: ''
  }
});

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
    id: 3,
    name: '李秀华',
    avatar: '/static/avatar1.png',
    consultCount: 75,
    score: 4.9,
    expertise: '合同纠纷、房产纠纷',
    location: '北京朝阳区',
    price: 68,
    recommend: true
  },
  {
    id: 4,
    name: '张立强',
    avatar: '/static/avatar2.png',
    consultCount: 1312,
    score: 5.0,
    expertise: '合同纠纷、房产纠纷',
    location: '北京朝阳区',
    price: 48
  },
  {
    id: 5,
    name: '王天明',
    avatar: '/static/avatar1.png',
    consultCount: 75,
    score: 4.9,
    expertise: '征地拆迁',
    location: '北京朝阳区',
    price: 68,
    recommend: true
  },
  {
    id: 6,
    name: '赵晓峰',
    avatar: '/static/avatar2.png',
    consultCount: 1312,
    score: 5.0,
    expertise: '征地拆迁',
    location: '北京朝阳区',
    price: 48
  },
  {
    id: 7,
    name: '钱爱华',
    avatar: '/static/avatar1.png',
    consultCount: 75,
    score: 4.9,
    expertise: '债务协商',
    location: '北京朝阳区',
    price: 68,
    recommend: true
  },
  {
    id: 8,
    name: '孙丽娜',
    avatar: '/static/avatar2.png',
    consultCount: 1312,
    score: 5.0,
    expertise: '债务协商',
    location: '北京朝阳区',
    price: 48
  },
  {
    id: 9,
    name: '周海涛',
    avatar: '/static/avatar1.png',
    consultCount: 75,
    score: 4.9,
    expertise: '合同纠纷、',
    location: '北京朝阳区',
    price: 68,
    recommend: true
  },
  {
    id: 10,
    name: '吴文静',
    avatar: '/static/avatar2.png',
    consultCount: 1312,
    score: 5.0,
    expertise: '合同纠纷、交通事故',
    location: '北京朝阳区',
    price: 48
  },

  // 其他律师数据...
];

// 定义搜索状态
const loading = ref(false);
const noMore = ref(false);

// 选择标签
function selectTag(tagValue) {
  currentTag.value = tagValue;
}

// 监听搜索关键词变化
watch(() => props.searchKeyword, (newValue) => {
  console.log('搜索关键词变化：', newValue);
  // 可以在这里执行其他搜索相关的逻辑
});

// 计算属性：过滤律师列表 - 增加搜索功能
const filterLawyerList = computed(() => {
  let result = lawyerList;
  
  // 如果选择了特定标签，先按标签过滤
  if (currentTag.value !== '全部') {
    result = result.filter((lawyer) => lawyer.expertise.includes(currentTag.value));
  }
  
  // 如果有搜索关键词，再按关键词过滤
  if (props.searchKeyword) {
    const keyword = props.searchKeyword.toLowerCase();
    result = result.filter((lawyer) => 
      lawyer.name.toLowerCase().includes(keyword) || 
      lawyer.expertise.toLowerCase().includes(keyword)
    );
  }
  
  // 更新无数据状态
  noMore.value = result.length === 0;
  
  return result;
});

// 导出搜索方法，允许父组件调用
const searchLawyers = (keyword) => {
  loading.value = true;
  // 这里可以添加模拟搜索的逻辑，例如延时效果
  setTimeout(() => {
    loading.value = false;
  }, 500);
};

// 暴露方法供父组件调用
defineExpose({
  searchLawyers
});

function handleClick(item) {
  // 跳转到律师详情页
  navigateToUrl(`/pages/lawyer/lawyerinfo?lawyerId=${item.id}`);
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
  background: #f5f5f5/* url('/static/avatar-placeholder.png')*/ no-repeat center/60%;
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
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60rpx 0;
}

.list-footer {
  text-align: center;
  padding: 40rpx 0;
}

.loading,
.no-more {
  text-align: center;
  font-size: 28rpx;
  color: var(--text-tertiary);
  padding: 20rpx 0;
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

/* 无结果状态 */
.empty-result {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 100rpx 0;
}

.empty-text {
  margin-top: 20rpx;
  color: var(--text-tertiary);
  font-size: 28rpx;
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

