<template>
  <PageLayout>
    <view class="container">
      <!-- 搜索区域 -->
      <view class="search-container">
        <view class="search-box">
          <uni-icons type="search" size="18" color="#999"></uni-icons>
          <input 
            type="text" 
            class="search-input" 
            placeholder="搜索用户名或律师名" 
            confirm-type="search"
            v-model="searchKeyword"
            @confirm="handleSearch"
          />
          <view v-if="searchKeyword" class="clear-icon" @click="clearSearch">
            <uni-icons type="clear" size="14" color="#999"></uni-icons>
          </view>
        </view>
        <view class="search-btn" @click="handleSearch">搜索</view>
      </view>

      <!-- 订单状态切换 -->
      <view class="status-tabs">
        <view 
          v-for="(item, index) in statusItems" 
          :key="index" 
          class="status-tab" 
          :class="{ active: currentStatus === index }"
          @click="changeStatus(index)"
        >
          {{ item }}
        </view>
      </view>

      <!-- 订单列表 -->
      <view class="order-list">
        <view v-if="loading" class="loading-container">
          <view class="loading">加载中...</view>
        </view>
        
        <view v-else-if="filteredOrders.length === 0" class="empty-result">
          <uni-icons type="info" size="32" color="#cecece"></uni-icons>
          <text class="empty-text">{{ searchKeyword ? '没有找到相关订单' : '暂无订单' }}</text>
        </view>
        
        <template v-else>
          <view 
            v-for="(order, index) in filteredOrders" 
            :key="order.orderId" 
            class="order-card"
          >
            <view class="order-header">
              <view class="order-id">订单编号：{{ order.orderId }}</view>
              <view class="order-status" :class="'status-' + order.status">{{ order.statusText }}</view>
            </view>
            
            <view class="order-body">
              <!-- 律师信息 -->
              <view class="lawyer-info">
                <image :src="order.lawyerAvatar" class="lawyer-avatar"></image>
                <view class="lawyer-detail">
                  <view class="lawyer-name">{{ order.lawyerName }}</view>
                  <view class="lawyer-title">{{ order.lawyerTitle }}</view>
                </view>
              </view>
              
              <!-- 订单详情 -->
              <view class="order-detail">
                <view class="detail-item">
                  <text class="detail-label">用户名：</text>
                  <text class="detail-value">{{ order.userName }}</text>
                </view>
                <view class="detail-item">
                  <text class="detail-label">费用类型：</text>
                  <text class="detail-value">{{ order.feeType }}</text>
                </view>
                <view class="detail-item">
                  <text class="detail-label">咨询时长：</text>
                  <text class="detail-value">{{ order.duration }}分钟</text>
                </view>
                <view class="detail-item">
                  <text class="detail-label">咨询时间：</text>
                  <text class="detail-value">{{ order.consultTime }}</text>
                </view>
                <view class="detail-item">
                  <text class="detail-label">费用：</text>
                  <text class="detail-value price">¥{{ order.fee }}</text>
                </view>
              </view>
            </view>
            
            <view class="order-footer">
              <button 
                v-if="order.status === 1" 
                class="btn btn-primary" 
                @click="payOrder(order.orderId)"
              >
                立即支付
              </button>
              <button 
                v-if="order.status === 2" 
                class="btn btn-outline" 
                @click="cancelOrder(order.orderId)"
              >
                取消订单
              </button>
              <button 
                v-if="order.status === 3" 
                class="btn btn-outline" 
                @click="commentOrder(order.orderId)"
              >
                评价服务
              </button>
              <button 
                class="btn btn-text" 
                @click="viewOrderDetail(order.orderId)"
              >
                查看详情
              </button>
            </view>
          </view>
          
          <!-- 加载更多 -->
          <view v-if="hasMore" class="load-more" @click="loadMore">
            <text>加载更多</text>
          </view>
          <view v-else class="no-more">没有更多了</view>
        </template>
      </view>
    </view>
  </PageLayout>
</template>

<script>
export default {
  name: "orderList",

}
</script>

<script setup>
import PageLayout from "@/components/custom/tabbarlayout.vue";
import { ref, computed, onMounted } from 'vue';

// 搜索
const searchKeyword = ref('');
const loading = ref(false);
const hasMore = ref(true);

// 订单状态
const currentStatus = ref(0);
const statusItems = ['全部', '待支付', '进行中', '已完成', '已取消'];

// 模拟订单数据
const orderList = ref([
  {
    orderId: 'LS202408120001',
    userName: '张三',
    lawyerName: '李律师',
    lawyerAvatar: '/static/images/lawyer_avatar.jpg',
    lawyerTitle: '合同纠纷专家',
    fee: 99.00,
    feeType: '电话咨询',
    duration: 30,
    consultTime: '2024-08-12 14:30',
    status: 1,
    statusText: '待支付'
  },
  {
    orderId: 'LS202408110023',
    userName: '李四',
    lawyerName: '王律师',
    lawyerAvatar: '/static/images/lawyer_avatar.jpg',
    lawyerTitle: '婚姻家庭专家',
    fee: 199.00,
    feeType: '视频咨询',
    duration: 60,
    consultTime: '2024-08-11 10:15',
    status: 3,
    statusText: '已完成'
  },
  {
    orderId: 'LS202408090015',
    userName: '王五',
    lawyerName: '赵律师',
    lawyerAvatar: '/static/images/lawyer_avatar.jpg',
    lawyerTitle: '劳动纠纷专家',
    fee: 59.00,
    feeType: '电话咨询',
    duration: 15,
    consultTime: '2024-08-09 16:45',
    status: 3,
    statusText: '已完成'
  },
  {
    orderId: 'LS202408050078',
    userName: '赵六',
    lawyerName: '钱律师',
    lawyerAvatar: '/static/images/lawyer_avatar.jpg',
    lawyerTitle: '知识产权专家',
    fee: 299.00,
    feeType: '在线咨询',
    duration: 45,
    consultTime: '2024-08-05 09:30',
    status: 2,
    statusText: '进行中'
  },
  {
    orderId: 'LS202408030042',
    userName: '刘七',
    lawyerName: '孙律师',
    lawyerAvatar: '/static/images/lawyer_avatar.jpg',
    lawyerTitle: '刑事辩护专家',
    fee: 399.00,
    feeType: '视频咨询',
    duration: 60,
    consultTime: '2024-08-03 11:00',
    status: 4,
    statusText: '已取消'
  }
]);

// 处理搜索
function handleSearch() {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 500);
}

function clearSearch() {
  searchKeyword.value = '';
  handleSearch();
}

// 切换订单状态
function changeStatus(index) {
  currentStatus.value = index;
}

// 过滤后的订单列表
const filteredOrders = computed(() => {
  let result = orderList.value;
  
  // 根据状态筛选
  if (currentStatus.value !== 0) {
    result = result.filter(order => order.status === currentStatus.value);
  }
  
  // 根据关键词搜索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase();
    result = result.filter(order => 
      order.userName.toLowerCase().includes(keyword) || 
      order.lawyerName.toLowerCase().includes(keyword)
    );
  }
  
  return result;
});

// 加载更多订单
function loadMore() {
  loading.value = true;
  setTimeout(() => {
    // 这里可以添加实际的加载逻辑
    hasMore.value = false;
    loading.value = false;
  }, 1000);
}

// 支付订单
function payOrder(orderId) {
  uni.showToast({
    title: '正在跳转支付...',
    icon: 'none'
  });
}

// 取消订单
function cancelOrder(orderId) {
  uni.showModal({
    title: '提示',
    content: '确定要取消该订单吗？',
    success: function(res) {
      if (res.confirm) {
        uni.showToast({
          title: '订单已取消',
          icon: 'success'
        });
      }
    }
  });
}

// 评价订单
function commentOrder(orderId) {
  uni.navigateTo({
    url: `/pages/order/comment?orderId=${orderId}`
  });
}

// 查看订单详情
function viewOrderDetail(orderId) {
  uni.navigateTo({
    url: `/pages/order/detail?orderId=${orderId}`
  });
}

onMounted(() => {
  // 初始化加载数据
  handleSearch();
});
</script>

<style lang="scss">
@import '@/uni_modules/theme/index.scss';

.container {
  padding: 20rpx;
  background-color: var(--bg-color);
  min-height: 100vh;
}

/* 搜索区域样式 */
.search-container {
  display: flex;
  align-items: center;
  padding: 20rpx;
  background-color: #fff;
  border-radius: 12rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  margin-bottom: 20rpx;
}

.search-box {
  flex: 1;
  display: flex;
  align-items: center;
  background-color: #f5f7fa;
  border-radius: 8rpx;
  padding: 12rpx 20rpx;
  height: 68rpx;
}

.search-input {
  flex: 1;
  height: 68rpx;
  font-size: 28rpx;
  color: #333;
  margin-left: 16rpx;
}

.clear-icon {
  padding: 10rpx;
}

.search-btn {
  margin-left: 20rpx;
  padding: 0 30rpx;
  height: 68rpx;
  line-height: 68rpx;
  background: linear-gradient(135deg, #4A90E2, #2979FF);
  color: #fff;
  font-size: 28rpx;
  border-radius: 8rpx;
  text-align: center;
}

/* 状态切换选项卡 */
.status-tabs {
  display: flex;
  background-color: #fff;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
  padding: 0 10rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  overflow-x: auto;
  white-space: nowrap;
}

.status-tab {
  padding: 24rpx 30rpx;
  font-size: 28rpx;
  color: var(--text-secondary);
  position: relative;
  transition: all 0.3s;
  
  &.active {
    color: var(--primary-color);
    font-weight: 500;
    
    &::after {
      content: '';
      position: absolute;
      left: 50%;
      bottom: 0;
      transform: translateX(-50%);
      width: 40rpx;
      height: 4rpx;
      background-color: var(--primary-color);
      border-radius: 2rpx;
    }
  }
}

/* 订单卡片样式 */
.order-card {
  background-color: #fff;
  border-radius: 12rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  margin-bottom: 20rpx;
  overflow: hidden;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 30rpx;
  border-bottom: 1rpx solid var(--border-color);
  
  .order-id {
    font-size: 24rpx;
    color: var(--text-secondary);
  }
  
  .order-status {
    font-size: 24rpx;
    font-weight: 500;
    
    &.status-1 {
      color: #ff9900;
    }
    
    &.status-2 {
      color: #2979FF;
    }
    
    &.status-3 {
      color: #4CD964;
    }
    
    &.status-4 {
      color: var(--text-tertiary);
    }
  }
}

.order-body {
  padding: 30rpx;
}

.lawyer-info {
  display: flex;
  align-items: center;
  margin-bottom: 30rpx;
  
  .lawyer-avatar {
    width: 100rpx;
    height: 100rpx;
    border-radius: 50%;
    margin-right: 20rpx;
  }
  
  .lawyer-detail {
    flex: 1;
    
    .lawyer-name {
      font-size: 32rpx;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 8rpx;
    }
    
    .lawyer-title {
      font-size: 24rpx;
      color: var(--text-secondary);
    }
  }
}

.order-detail {
  background-color: #f9fafb;
  border-radius: 8rpx;
  padding: 20rpx 24rpx;
  
  .detail-item {
    display: flex;
    margin-bottom: 16rpx;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    .detail-label {
      width: 160rpx;
      font-size: 26rpx;
      color: var(--text-secondary);
    }
    
    .detail-value {
      flex: 1;
      font-size: 26rpx;
      color: var(--text-primary);
      
      &.price {
        color: var(--price-color);
        font-weight: 600;
      }
    }
  }
}

.order-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 20rpx 30rpx;
  border-top: 1rpx solid var(--border-color);
  gap: 16rpx;
  
  .btn {
    padding: 0 30rpx;
    height: 64rpx;
    line-height: 64rpx;
    font-size: 26rpx;
    border-radius: 32rpx;
  }
  
  .btn-primary {
    background: linear-gradient(135deg, #4A90E2, #2979FF);
    color: #fff;
  }
  
  .btn-outline {
    border: 1rpx solid var(--border-color);
    color: var(--text-secondary);
  }
  
  .btn-text {
    color: var(--text-secondary);
    background: none;
    border: none;
    
    &::after {
      border: none;
    }
  }
}

/* 空状态和加载状态 */
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60rpx 0;
}

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

.loading {
  text-align: center;
  font-size: 28rpx;
  color: var(--text-tertiary);
  padding: 20rpx 0;
  position: relative;
  
  &::after {
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
}

.load-more {
  text-align: center;
  padding: 30rpx 0;
  font-size: 28rpx;
  color: var(--primary-color);
}

.no-more {
  text-align: center;
  padding: 30rpx 0;
  font-size: 28rpx;
  color: var(--text-tertiary);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>