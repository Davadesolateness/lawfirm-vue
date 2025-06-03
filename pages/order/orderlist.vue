<template>
  <PageLayout>
    <view class="container">
      <!-- 页面标题 -->
      <view class="page-header">
        <text class="page-title">法律咨询订单</text>
      </view>

      <!-- 搜索区域 -->
      <view class="search-container">
        <view class="search-box">
          <uni-icons type="search" size="18" color="#8696a7"></uni-icons>
          <input
              type="text"
              class="search-input"
              placeholder="搜索用户名或律师名"
              confirm-type="search"
              v-model="searchKeyword"
              @confirm="handleSearch"
              @blur="handleSearch"
          />
          <view v-if="searchKeyword" class="clear-icon" @click="clearSearch">
            <uni-icons type="clear" size="14" color="#8696a7"></uni-icons>
          </view>
        </view>
      </view>

      <!-- 订单列表 -->
      <view class="order-list">
        <view v-if="loading" class="loading-container">
          <view class="loading">加载中...</view>
        </view>

        <view v-else-if="filteredOrders.length === 0" class="empty-result">
          <uni-icons type="info" size="32" color="#4A67FF"></uni-icons>
          <text class="empty-text">{{ searchKeyword ? '没有找到相关订单' : '暂无订单记录' }}</text>
        </view>

        <template v-else>
          <view
              v-for="(order, index) in filteredOrders"
              :key="order.orderId"
              class="order-card"
          >
            <view class="order-header">
              <view class="order-id">订单编号：{{ order.orderId }}</view>
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
                  <text class="detail-label">用户姓名</text>
                  <text class="detail-value">{{ order.userName }}</text>
                </view>
                <view class="detail-item">
                  <text class="detail-label">费用类型</text>
                  <text class="detail-value">{{ order.orderType }}</text>
                </view>
                <view class="detail-item">
                  <text class="detail-label">咨询时长</text>
                  <text class="detail-value">{{ order.serviceDuration }}分钟</text>
                </view>
                <view class="detail-item">
                  <text class="detail-label">咨询时间</text>
                  <text class="detail-value">{{ order.inputTime }}</text>
                </view>
                <view class="detail-item fee-item">
                  <text class="detail-label">服务费用</text>
                  <text class="detail-value price">¥{{ order.fee }}</text>
                </view>
              </view>
            </view>

          </view>

          <!-- 加载更多 -->
          <view v-if="hasMore" class="load-more" @click="loadMore">
            <text>加载更多</text>
          </view>
          <view v-else class="no-more">没有更多数据</view>
        </template>
      </view>
    </view>
  </PageLayout>
</template>

<script setup>
import PageLayout from "@/components/custom/tabbarlayout.vue";
import {ref, computed, onMounted} from 'vue';
import {apiGetUserOrders, apiGetLawyerOrders, apiSearchOrders} from '@/api/orderapi.js';
import {cacheManager} from '@/utils/store';

// 当前用户ID (实际应用中应该从用户状态或存储中获取)
const userId = ref(null);
const userType = ref(null);
const lawyerId = ref(null);

// 搜索
const searchKeyword = ref('');
const loading = ref(false);
const hasMore = ref(true);
const pageNum = ref(1);
const pageSize = ref(10);

// 订单列表
const orderList = ref([]);

// 获取用户信息
function getUserInfo() {
  // 初始化缓存key值
  const cacheUserId = uni.getStorageSync('current_user_id');
  // 设置为用户前缀 获取该用户的缓存信息
  cacheManager.setUserPrefix(cacheUserId)
  // 从缓存或全局状态中获取用户ID
  const userInfo = cacheManager.getCache('userInfo');

  if (userInfo) {
    userId.value = userInfo.userId;
    userType.value = userInfo.userType;

    // 如果是律师类型，设置lawyerId
    if (userType.value === 'lawyer') {
      lawyerId.value = userInfo.relatedEntityId || userInfo.lawyerId;
    }

    console.log('当前用户类型:', userType.value);
    console.log('用户ID:', userId.value);
    console.log('律师ID:', lawyerId.value);
  } else {
    // 没有用户信息时的处理逻辑，如跳转登录页
    console.warn('用户未登录或无法获取用户信息');
  }
}

// 处理搜索
function handleSearch() {
  loading.value = true;
  pageNum.value = 1; // 重置页码
  
  // 有搜索关键词时使用搜索API
  if (searchKeyword.value) {
    searchOrders();
  } else {
    // 无搜索关键词时加载所有订单
    loadOrders();
  }
}

// 搜索订单
function searchOrders() {

  apiSearchOrders({
    keyword: searchKeyword.value,
    pageNum: pageNum.value,
    pageSize: pageSize.value
  }).then(res => {
    if (res) {
      if (pageNum.value === 1) {
        orderList.value = formatOrders(res || []);
      } else {
        // 追加数据到现有列表
        orderList.value = [...orderList.value, ...formatOrders(res || [])];
      }
      
      // 如果返回的记录数小于页大小，表示没有更多数据
      hasMore.value = res.length >= pageSize.value;
    } else {
      if (pageNum.value === 1) {
        orderList.value = [];
      }
      hasMore.value = false;
    }
  }).catch(err => {
    console.error('搜索订单异常:', err);
    if (pageNum.value === 1) {
      orderList.value = [];
    }
    hasMore.value = false;
  }).finally(() => {
    loading.value = false;
  });
}

function clearSearch() {
  searchKeyword.value = '';
  handleSearch(); // Trigger search with empty keyword to reset
}

// 格式化订单数据，增加前端展示所需字段
function formatOrders(orders) {
  return orders.map(order => {
    // 处理头像
    let avatarUrl = '/static/default-avatar.png';
    if (order.lawyerAvatar && order.fileExtension) {
      const imageType = order.fileExtension === 'image/jpg' ? 'image/jpeg' : order.fileExtension;
      avatarUrl = `data:${imageType};base64,${order.lawyerAvatar}`;
    }
    // 计算或转换UI显示数据
    const formattedOrder = {
      ...order,
      // 处理咨询时间格式
      consultTime: formatDateTime(order.inputTime),
      // 处理费用类型展示
      feeType: order.orderType === 'lawyer_service' ? '咨询服务费' : '其他费用',
      // 处理时长
      duration: order.serviceDuration || 0,
      // 处理显示费用
      fee: order.purchaseAmount || 0,
      // 默认头像
      lawyerAvatar: avatarUrl,
      // 填充缺失的UI显示字段
      lawyerName: order.lawyerName || '未分配律师',
      lawyerTitle: order.lawyerTitle || '律师',
      userName: order.userName || '未知用户'
    };
    return formattedOrder;
  });
}

// 格式化日期时间
function formatDateTime(dateTimeStr) {
  if (!dateTimeStr) return '未设置';

  const date = new Date(dateTimeStr);
  if (isNaN(date.getTime())) return dateTimeStr; // 日期无效则返回原字符串

  return `${date.getFullYear()}-${padZero(date.getMonth() + 1)}-${padZero(date.getDate())} ${padZero(date.getHours())}:${padZero(date.getMinutes())}`;
}

// 补零
function padZero(num) {
  return num < 10 ? `0${num}` : num;
}

// 过滤后的订单列表
const filteredOrders = computed(() => {
  let result = orderList.value;

  // 根据关键词过滤
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase();
    result = result.filter(order =>
        (order.userName && order.userName.toLowerCase().includes(keyword)) ||
        (order.lawyerName && order.lawyerName.toLowerCase().includes(keyword))
    );
  }

  return result;
});

// 加载订单数据
function loadOrders() {
  if (!userType.value) {
    console.warn('无法加载订单：用户类型不存在');
    return;
  }

  loading.value = true;
  let api;
  let params = {
    pageNum: pageNum.value,
    pageSize: pageSize.value
  };

  // 根据用户类型选择不同的API
  if (userType.value === 'lawyer' && lawyerId.value) {
    // 律师用户，使用律师ID查询
    api = apiGetLawyerOrders;
    params.lawyerId = lawyerId.value;
  } else {
    // 普通用户，使用用户ID查询
    api = apiGetUserOrders;
    params.userId = userId.value;
  }

  api(params)
    .then(res => {
      if (res) {
        orderList.value = formatOrders(res || []);
        // 如果返回的记录数小于页大小，表示没有更多数据
        hasMore.value = res.length >= pageSize.value;
      } else {
        orderList.value = [];
        hasMore.value = false;
        console.error('获取订单列表失败');
      }
    })
    .catch(err => {
      console.error('获取订单列表异常:', err);
      orderList.value = [];
      hasMore.value = false;
    })
    .finally(() => {
      loading.value = false;
    });
}

// 加载更多
function loadMore() {
  if (!hasMore.value || loading.value) return;
  
  pageNum.value++;
  loading.value = true;
  
  // 有搜索关键词时使用搜索API
  if (searchKeyword.value) {
    searchOrders();
  } else {
    // 无搜索关键词时加载所有订单
    loadMoreOrders();
  }
}

// 加载更多普通订单
function loadMoreOrders() {
  let api;
  let params = {
    pageNum: pageNum.value,
    pageSize: pageSize.value
  };

  // 根据用户类型选择不同的API
  if (userType.value === 'lawyer' && lawyerId.value) {
    // 律师用户，使用律师ID查询
    api = apiGetLawyerOrders;
    params.lawyerId = lawyerId.value;
  } else {
    // 普通用户，使用用户ID查询
    api = apiGetUserOrders;
    params.userId = userId.value;
  }
  
  api(params)
    .then(res => {
      if (res) {
        // 追加数据到现有列表
        orderList.value = [...orderList.value, ...formatOrders(res || [])];
        // 如果返回的记录数小于页大小，表示没有更多数据
        hasMore.value = res.length >= pageSize.value;
      } else {
        hasMore.value = false;
      }
    })
    .catch(err => {
      console.error('加载更多订单异常:', err);
      hasMore.value = false;
    })
    .finally(() => {
      loading.value = false;
    });
}

onMounted(() => {
  // 获取用户信息并初始化加载数据
  getUserInfo();
  loadOrders();
});

// 如果API尚未实现或开发环境，使用以下模拟数据（正式环境需删除）
// 仅用于开发阶段展示，API实现后自动切换
const mockOrders = [
  {
    orderId: '202304150001',
    userId: 1,
    userName: '张先生',
    userType: 'individual',
    orderType: 'lawyer_service',
    lawyerName: '李律师',
    lawyerTitle: '高级律师',
    lawyerAvatar: '/static/images/lawyer1.png',
    serviceDuration: 30,
    purchaseAmount: 300,
    orderStatus: 'completed',
    inputTime: '2023-04-15 14:30:00'
  },
  {
    orderId: '202304160002',
    userId: 1,
    userName: '张先生',
    userType: 'individual',
    orderType: 'lawyer_service',
    lawyerName: '王律师',
    lawyerTitle: '资深律师',
    lawyerAvatar: '/static/images/lawyer2.png',
    serviceDuration: 60,
    purchaseAmount: 500,
    orderStatus: 'completed',
    inputTime: '2023-04-16 10:15:00'
  }
];
</script>

<style lang="scss" scoped>
/* 基础容器 */
.container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f8fafb;
  padding: 24rpx;
}

/* 页面标题 */
.page-header {
  margin-bottom: 32rpx;

  .page-title {
    font-size: 36rpx;
    font-weight: 600;
    color: #2c3e50;
    position: relative;
    display: inline-block;
    padding-bottom: 16rpx;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 64rpx;
      height: 4rpx;
      background: #4A67FF;
      border-radius: 2rpx;
    }
  }
}

/* 搜索区域样式 */
.search-container {
  display: flex;
  padding: 15px;
  background-color: #fff;
  margin-bottom: 10px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.search-box {
  flex: 1;
  display: flex;
  align-items: center;
  background-color: #f5f7f9;
  border-radius: 20px;
  padding: 0 15px;
  height: 40px;
  transition: all 0.3s ease;
}

.search-box:focus-within {
  box-shadow: 0 0 0 2px rgba(74, 103, 255, 0.2);
  background-color: #ffffff;
}

.search-input {
  flex: 1;
  height: 40px;
  border: none;
  background: transparent;
  margin-left: 10px;
  font-size: 14px;
}

.clear-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
}

/* 订单卡片样式 */
.order-card {
  background: #fff;
  border-radius: 20rpx;
  margin-bottom: 24rpx;
  overflow: hidden;
  transition: all 0.3s;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);

  &:hover {
    transform: translateY(-2rpx);
    box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.1);
  }
}

.order-header {
  padding: 24rpx 32rpx;
  border-bottom: 1rpx solid #f0f0f0;
  background: linear-gradient(135deg, #f0f4ff 0%, #e6ecfa 100%);

  .order-id {
    font-size: 28rpx;
    color: #2c3e50;
    font-weight: 500;
  }
}

.order-body {
  padding: 32rpx;
}

.lawyer-info {
  display: flex;
  align-items: center;
  margin-bottom: 32rpx;
  padding-bottom: 24rpx;
  border-bottom: 1rpx dashed #f0f0f0;

  .lawyer-avatar {
    width: 108rpx;
    height: 108rpx;
    border-radius: 50%;
    margin-right: 24rpx;
    border: 2rpx solid rgba(255, 255, 255, 0.8);
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
  }

  .lawyer-detail {
    flex: 1;

    .lawyer-name {
      font-size: 32rpx;
      font-weight: 600;
      color: #2d3436;
      margin-bottom: 8rpx;
    }

    .lawyer-title {
      font-size: 26rpx;
      color: #4A67FF;
      background: rgba(74, 103, 255, 0.1);
      display: inline-block;
      padding: 6rpx 20rpx;
      border-radius: 32rpx;
    }
  }
}

.order-detail {
  background: #f8f9ff;
  border-radius: 16rpx;
  padding: 24rpx;

  .detail-item {
    display: flex;
    margin-bottom: 20rpx;

    &:last-child {
      margin-bottom: 0;
    }

    &.fee-item {
      padding-top: 16rpx;
      border-top: 1rpx dashed #f0f0f0;
      margin-top: 8rpx;
    }

    .detail-label {
      width: 160rpx;
      font-size: 26rpx;
      color: #666;
      position: relative;
      padding-left: 20rpx;

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 6rpx;
        height: 6rpx;
        border-radius: 50%;
        background: #4A67FF;
      }
    }

    .detail-value {
      flex: 1;
      font-size: 26rpx;
      color: #2d3436;

      &.price {
        color: #4A67FF;
        font-weight: 600;
        font-size: 30rpx;
      }
    }
  }
}

.order-footer {
  padding: 24rpx 32rpx;
  border-top: 1rpx solid #f0f0f0;
  min-height: 20rpx;
}

/* 空状态和加载状态 */
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 80rpx 0;
}

.empty-result {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 120rpx 0;
  background: #fff;
  border-radius: 20rpx;
  margin-top: 32rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
}

.empty-text {
  margin-top: 24rpx;
  color: #718096;
  font-size: 28rpx;
}

.loading {
  text-align: center;
  font-size: 28rpx;
  color: #4A67FF;
  padding: 24rpx 0;
  position: relative;

  &::after {
    content: "";
    display: inline-block;
    width: 20rpx;
    height: 20rpx;
    border: 3rpx solid #4A67FF;
    border-radius: 50%;
    border-top-color: transparent;
    animation: spin 0.8s linear infinite;
    margin-left: 12rpx;
    vertical-align: middle;
  }
}

.load-more {
  text-align: center;
  padding: 32rpx 0;
  font-size: 28rpx;
  color: #4A67FF;
  background: #fff;
  border-radius: 20rpx;
  margin-top: 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
  cursor: pointer;

  &:active {
    opacity: 0.8;
  }
}

.no-more {
  text-align: center;
  padding: 32rpx 0;
  font-size: 28rpx;
  color: #718096;
  background: #fff;
  border-radius: 20rpx;
  margin-top: 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>