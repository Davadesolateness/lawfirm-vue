<template>
  <view class="call-page">
    <!-- 顶部状态栏 -->
    <view class="call-page__status-bar" :class="statusClass">
      <view class="call-page__status-bar-content">
        <text class="call-page__status-bar-text">{{ statusText }}</text>
        <view v-if="callStatus === 'connected'" class="call-page__status-bar-quality">
          <uni-icons :type="callQualityIcon" size="16" :color="callQualityColor"></uni-icons>
          <text>{{ callQualityText }}</text>
        </view>
      </view>
    </view>
    
    <!-- 律师信息 -->
    <view class="call-page__lawyer-info">
      <image class="call-page__lawyer-info-avatar" :src="lawyerInfo.avatar || '/static/images/lawyer_avatar.jpg'" mode="aspectFill"></image>
      <view class="call-page__lawyer-info-info">
        <text class="name">{{ lawyerInfo.name || '律师' }}</text>
        <text class="title">{{ lawyerInfo.title || '专业律师' }}</text>
        <text class="phone">{{ encryptedPhone }}</text>
      </view>
      <view v-if="callStatus === 'connected'" class="call-page__lawyer-info-recording" :class="{ 'call-page__lawyer-info-recording--active': isRecording }">
        <uni-icons type="record" size="16" color="#ff4d4f"></uni-icons>
        <text>录音中</text>
      </view>
    </view>
    
    <!-- 通话信息 -->
    <view class="call-page__call-info">
      <view class="call-page__call-info-timer">
        <text class="time">{{ callTime }}</text>
        <text v-if="isBillingStarted" class="billing">计费中</text>
      </view>
      
      <view v-if="callStatus === 'connected'" class="call-page__call-info-fee">
        <view class="call-page__call-info-fee-row">
          <text class="call-page__call-info-fee-label">咨询费用:</text>
          <text class="call-page__call-info-fee-value">¥{{ fee }}/分钟</text>
        </view>
        <view class="call-page__call-info-fee-row">
          <text class="call-page__call-info-fee-label">已产生费用:</text>
          <text class="call-page__call-info-fee-value call-page__call-info-fee-value--price">¥{{ calculatedFee }}</text>
        </view>
        <text class="call-page__call-info-fee-notice" v-if="!isBillingStarted">通话1分钟内免费</text>
      </view>
      
      <view v-if="callStatus === 'connecting'" class="call-page__call-info-connecting">
        <view class="call-page__call-info-connecting-dot"></view>
        <view class="call-page__call-info-connecting-dot"></view>
        <view class="call-page__call-info-connecting-dot"></view>
      </view>
    </view>
    
    <!-- 通话控制 -->
    <view class="call-page__controls">
      <view class="call-page__controls-row">
        <view class="call-page__controls-btn" :class="{ 'call-page__controls-btn--active': isMuted }" @click="toggleMute">
          <uni-icons :type="isMuted ? 'mic-slash' : 'mic'" size="24" color="#fff"></uni-icons>
          <text>{{ isMuted ? '已静音' : '静音' }}</text>
        </view>
        
        <view class="call-page__controls-btn" :class="{ 'call-page__controls-btn--active': isSpeaker }" @click="toggleSpeaker">
          <uni-icons :type="isSpeaker ? 'sound' : 'sound-filled'" size="24" color="#fff"></uni-icons>
          <text>{{ isSpeaker ? '扬声器' : '听筒' }}</text>
        </view>
        
        <view class="call-page__controls-btn" :class="{ 'call-page__controls-btn--active': isRecording }" @click="toggleRecording">
          <uni-icons :type="isRecording ? 'record-filled' : 'record'" size="24" color="#fff"></uni-icons>
          <text>{{ isRecording ? '停止录音' : '开始录音' }}</text>
        </view>
      </view>
      
      <view class="call-page__controls-end" @click="handleEndCall">
        <uni-icons type="phone-filled" size="36" color="#fff"></uni-icons>
        <text>结束通话</text>
      </view>
    </view>
    
    <!-- 通话笔记 -->
    <view v-if="callStatus === 'connected'" class="call-page__notes">
      <textarea 
        v-model="callNotes" 
        placeholder="记录通话要点..." 
        maxlength="500" 
        class="call-page__notes-input"
      ></textarea>
      <text class="call-page__notes-count">{{ callNotes.length }}/500</text>
    </view>
    
    <!-- 未接通或通话结束时的操作按钮 -->
    <view v-if="callStatus === 'pending' || callStatus === 'failed' || callStatus === 'completed'" class="call-page__actions">
      <button class="call-page__actions-btn call-page__actions-btn--primary" @click="makePhoneCall" v-if="callStatus === 'pending' || callStatus === 'failed'">
        {{ callStatus === 'failed' ? '重新拨打' : '拨打电话' }}
      </button>
      
      <button class="call-page__actions-btn call-page__actions-btn--outline" @click="goBack" v-if="callStatus === 'failed' || callStatus === 'completed'">
        返回
      </button>
      
      <button class="call-page__actions-btn call-page__actions-btn--cancel" @click="cancelCall" v-if="callStatus === 'connecting'">
        取消
      </button>
    </view>
    
    <!-- 通话结束摘要 -->
    <view v-if="callStatus === 'completed'" class="call-page__summary">
      <view class="call-page__summary-card">
        <view class="call-page__summary-card-title">通话摘要</view>
        <view class="call-page__summary-card-item">
          <text class="label">通话时长:</text>
          <text class="value">{{ formatDuration(callDuration) }}</text>
        </view>
        <view class="call-page__summary-card-item">
          <text class="label">计费时长:</text>
          <text class="value">{{ formatDuration(chargedDuration) }}</text>
        </view>
        <view class="call-page__summary-card-item">
          <text class="label">咨询费用:</text>
          <text class="value value--price">¥{{ calculatedFee }}</text>
        </view>
        <view class="call-page__summary-card-note" v-if="chargedDuration === 0">
          <text>通话未满1分钟，不收取费用</text>
        </view>
        <view class="call-page__summary-card-notes" v-if="callNotes">
          <text class="label">通话笔记:</text>
          <text class="value">{{ callNotes }}</text>
        </view>
      </view>
      
      <view class="call-page__summary-actions">
        <button class="btn btn--primary" @click="goToEvaluation" v-if="callDuration > 60">评价咨询</button>
        <button class="btn btn--outline" @click="saveCallNotes" v-if="callNotes">保存笔记</button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { makeCall, endCall, getCallInfo, encryptPhoneNumber, formatDuration as formatTime } from '@/pages/call/callService';
import { getOrderDetail } from '@/utils/pay';

// 获取参数
const orderId = ref('');
const callStatus = ref('pending'); // pending, connecting, connected, completed, failed, cancelled
const callTime = ref('00:00');
const callDuration = ref(0);
const chargedDuration = ref(0);
const isBillingStarted = ref(false);
const isMuted = ref(false);
const isSpeaker = ref(false);
const isRecording = ref(false);

// 律师信息
const lawyerInfo = ref({
  name: '',
  title: '',
  avatar: '',
  phone: ''
});

// 通话费用
const fee = ref(0);
const calculatedFee = computed(() => {
  if (!isBillingStarted.value || chargedDuration.value === 0) {
    return '0.00';
  }
  // 计算费用：每分钟收费 × 计费分钟数（向上取整）
  const minutes = Math.ceil(chargedDuration.value / 60);
  return (fee.value * minutes).toFixed(2);
});

// 加密后的电话号码
const encryptedPhone = computed(() => {
  const callInfo = getCallInfo(orderId.value);
  return callInfo ? callInfo.lawyerPhone : '***********';
});

// 状态文本和样式
const statusText = computed(() => {
  switch(callStatus.value) {
    case 'pending': return '准备拨打';
    case 'connecting': return '正在连接...';
    case 'connected': return '通话中';
    case 'completed': return '通话已结束';
    case 'failed': return '连接失败';
    case 'cancelled': return '已取消';
    default: return '';
  }
});

const statusClass = computed(() => {
  return {
    'status-connecting': callStatus.value === 'connecting',
    'status-connected': callStatus.value === 'connected',
    'status-failed': callStatus.value === 'failed' || callStatus.value === 'cancelled',
    'status-completed': callStatus.value === 'completed'
  };
});

// 定时器
let timer = null;
let callHandler = null;

// 通话质量相关
const callQuality = ref('good'); // good, fair, poor
const callQualityIcon = computed(() => {
  switch(callQuality.value) {
    case 'good': return 'signal';
    case 'fair': return 'signal-fair';
    case 'poor': return 'signal-poor';
    default: return 'signal';
  }
});
const callQualityColor = computed(() => {
  switch(callQuality.value) {
    case 'good': return '#52c41a';
    case 'fair': return '#faad14';
    case 'poor': return '#ff4d4f';
    default: return '#52c41a';
  }
});
const callQualityText = computed(() => {
  switch(callQuality.value) {
    case 'good': return '通话质量良好';
    case 'fair': return '通话质量一般';
    case 'poor': return '通话质量较差';
    default: return '';
  }
});

// 通话笔记
const callNotes = ref('');

// 通话记录
const callHistory = ref([]);

// 错误重试次数
const retryCount = ref(0);
const MAX_RETRY_COUNT = 3;

// 监控通话质量
function monitorCallQuality() {
  // 模拟通话质量变化
  const qualities = ['good', 'fair', 'poor'];
  const randomQuality = qualities[Math.floor(Math.random() * qualities.length)];
  callQuality.value = randomQuality;
}

// 生命周期钩子
onMounted(() => {
  // 获取页面参数
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  const options = currentPage.options || {};
  
  orderId.value = options.orderId || '';
  
  if (!orderId.value) {
    uni.showToast({
      title: '参数错误',
      icon: 'none'
    });
    setTimeout(() => {
      goBack();
    }, 1500);
    return;
  }
  
  // 加载律师和订单信息
  loadOrderInfo();
  
  // 如果已经在通话中，恢复通话状态
  const callInfo = getCallInfo(orderId.value);
  if (callInfo && callInfo.callStatus === 'connected') {
    restoreCallState(callInfo);
  }
});

onBeforeUnmount(() => {
  // 清理计时器
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
});

// 加载订单信息
function loadOrderInfo() {
  const order = getOrderDetail(orderId.value);
  if (!order) {
    uni.showToast({
      title: '订单不存在',
      icon: 'none'
    });
    setTimeout(() => {
      goBack();
    }, 1500);
    return;
  }
  
  // 设置律师信息
  lawyerInfo.value = {
    name: order.lawyerName || '律师',
    title: order.lawyerTitle || '专业律师',
    avatar: order.lawyerAvatar || '/static/images/lawyer_avatar.jpg'
  };
  
  // 设置费用
  fee.value = order.fee / order.duration; // 按分钟计算费率
  
  // 获取通话信息
  const callInfo = getCallInfo(orderId.value);
  if (callInfo) {
    callStatus.value = callInfo.callStatus;
    
    if (callInfo.startTime && callInfo.endTime) {
      // 已结束通话
      const startTime = new Date(callInfo.startTime);
      const endTime = new Date(callInfo.endTime);
      callDuration.value = Math.floor((endTime - startTime) / 1000);
      chargedDuration.value = callInfo.chargedDuration || 0;
      isBillingStarted.value = callInfo.billingStartTime ? true : false;
      callTime.value = formatTime(callDuration.value);
    } else if (callInfo.startTime) {
      // 正在通话中
      restoreCallState(callInfo);
    }
  }
}

// 恢复通话状态
function restoreCallState(callInfo) {
  callStatus.value = 'connected';
  
  const startTime = new Date(callInfo.startTime);
  const now = new Date();
  const duration = Math.floor((now - startTime) / 1000);
  
  callDuration.value = duration;
  callTime.value = formatTime(duration);
  
  if (callInfo.billingStartTime) {
    isBillingStarted.value = true;
    const billingStart = new Date(callInfo.billingStartTime);
    chargedDuration.value = Math.floor((now - billingStart) / 1000);
  } else if (duration >= 60) {
    isBillingStarted.value = true;
    chargedDuration.value = duration - 60;
  }
  
  // 启动计时器
  startTimer();
}

// 开始通话
async function makePhoneCall() {
  try {
    callStatus.value = 'connecting';
    retryCount.value = 0;
    
    // 开始通话
    const result = await makeCall(orderId.value);
    
    if (result.success) {
      callStatus.value = 'connected';
      startCallTimer();
      monitorCallQuality();
    } else {
      handleCallFailure();
    }
  } catch (error) {
    console.error('拨打电话失败:', error);
    handleCallFailure();
  }
}

// 处理通话失败
function handleCallFailure() {
  if (retryCount.value < MAX_RETRY_COUNT) {
    retryCount.value++;
    uni.showModal({
      title: '连接失败',
      content: `是否重试？(第${retryCount.value}次)`,
      success: (res) => {
        if (res.confirm) {
          makePhoneCall();
        } else {
          callStatus.value = 'failed';
        }
      }
    });
  } else {
    callStatus.value = 'failed';
    uni.showToast({
      title: '连接失败，请稍后重试',
      icon: 'none'
    });
  }
}

// 结束通话
async function handleEndCall() {
  try {
    uni.showModal({
      title: '结束通话',
      content: '确定要结束本次通话吗？',
      success: async (res) => {
        if (res.confirm) {
          const result = await endCall(orderId.value);
          if (result.success) {
            callStatus.value = 'completed';
            saveCallHistory();
          } else {
            uni.showToast({
              title: '结束通话失败',
              icon: 'none'
            });
          }
        }
      }
    });
  } catch (error) {
    console.error('结束通话失败:', error);
    uni.showToast({
      title: '结束通话失败',
      icon: 'none'
    });
  }
}

// 保存通话记录
function saveCallHistory() {
  const history = {
    orderId: orderId.value,
    lawyerName: lawyerInfo.value.name,
    duration: callDuration.value,
    fee: calculatedFee.value,
    notes: callNotes.value,
    timestamp: new Date().getTime()
  };
  
  callHistory.value.push(history);
  // 实际应用中，这里应该调用保存通话记录的API
}

// 清理资源
function cleanup() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
  if (callHandler) {
    callHandler = null;
  }
}

// 启动计时器
function startTimer() {
  if (timer) clearInterval(timer);
  
  const startTime = Date.now() - (callDuration.value * 1000);
  
  timer = setInterval(() => {
    const now = Date.now();
    const duration = Math.floor((now - startTime) / 1000);
    
    callDuration.value = duration;
    callTime.value = formatTime(duration);
    
    // 通话超过1分钟开始计费
    if (duration >= 60 && !isBillingStarted.value) {
      isBillingStarted.value = true;
      
      uni.showToast({
        title: '通话已超过1分钟，开始计费',
        icon: 'none'
      });
    }
    
    // 如果已开始计费，计算计费时间
    if (isBillingStarted.value) {
      chargedDuration.value = duration - 60;
    }
  }, 1000);
}

// 切换静音状态
function toggleMute() {
  isMuted.value = !isMuted.value;
  
  // 实际应用中，这里应该调用真实的通话API
  uni.showToast({
    title: isMuted.value ? '已静音' : '已取消静音',
    icon: 'none'
  });
}

// 切换扬声器
function toggleSpeaker() {
  isSpeaker.value = !isSpeaker.value;
  
  // 实际应用中，这里应该调用真实的通话API
  uni.showToast({
    title: isSpeaker.value ? '已切换到扬声器' : '已切换到听筒',
    icon: 'none'
  });
}

// 切换录音状态
function toggleRecording() {
  isRecording.value = !isRecording.value;
  
  // 实际应用中，这里应该调用真实的通话API
  uni.showToast({
    title: isRecording.value ? '录音已开始' : '录音已停止',
    icon: 'none'
  });
}

// 格式化时间
function formatDuration(seconds) {
  return formatTime(seconds);
}

// 返回上一页
function goBack() {
  uni.navigateBack();
}

// 去评价页面
function goToEvaluation() {
  uni.navigateTo({
    url: `/pages/order/comment?orderId=${orderId.value}`
  });
}

// 保存通话笔记
function saveCallNotes() {
  // 实际应用中，这里应该调用保存笔记的API
  uni.showToast({
    title: '通话笔记已保存',
    icon: 'none'
  });
}
</script>

<style lang="scss" scoped>
.call-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20rpx;
  
  &__status-bar {
    background: rgba(255, 255, 255, 0.9);
    border-radius: 16rpx;
    padding: 20rpx;
    margin-bottom: 20rpx;
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
    
    &--connecting {
      animation: call-page-pulse 1.5s infinite;
    }
    
    &--connected {
      background: rgba(82, 196, 26, 0.1);
    }
    
    &--failed {
      background: rgba(245, 34, 45, 0.1);
    }
    
    &-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    
    &-text {
      font-size: 28rpx;
      color: #333;
      font-weight: 500;
    }
    
    &-quality {
      display: flex;
      align-items: center;
      gap: 8rpx;
      
      text {
        font-size: 24rpx;
      }
    }
  }
  
  &__lawyer-info {
    background: #fff;
    border-radius: 16rpx;
    padding: 20rpx;
    margin-bottom: 20rpx;
    display: flex;
    align-items: center;
    gap: 20rpx;
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
    
    &-avatar {
      width: 120rpx;
      height: 120rpx;
      border-radius: 60rpx;
    }
    
    &-info {
      flex: 1;
      
      .name {
        font-size: 32rpx;
        font-weight: 500;
        color: #333;
        margin-bottom: 8rpx;
        display: block;
      }
      
      .title {
        font-size: 24rpx;
        color: #666;
        margin-bottom: 8rpx;
        display: block;
      }
      
      .phone {
        font-size: 24rpx;
        color: #999;
      }
    }
    
    &-recording {
      display: flex;
      align-items: center;
      gap: 8rpx;
      padding: 8rpx 16rpx;
      background: rgba(255, 77, 79, 0.1);
      border-radius: 8rpx;
      
      text {
        font-size: 24rpx;
        color: #ff4d4f;
      }
      
      &--active {
        animation: call-page-pulse 1.5s infinite;
      }
    }
  }
  
  &__call-info {
    background: #fff;
    border-radius: 16rpx;
    padding: 20rpx;
    margin-bottom: 20rpx;
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
    
    &-timer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20rpx;
      
      .time {
        font-size: 48rpx;
        font-weight: 500;
        color: #333;
      }
      
      .billing {
        font-size: 24rpx;
        color: #ff4d4f;
        padding: 4rpx 12rpx;
        background: rgba(255, 77, 79, 0.1);
        border-radius: 8rpx;
      }
    }
    
    &-fee {
      border-top: 1rpx solid #eee;
      padding-top: 20rpx;
      
      &-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 12rpx;
      }
      
      &-label {
        font-size: 28rpx;
        color: #666;
      }
      
      &-value {
        font-size: 28rpx;
        color: #333;
        font-weight: 500;
        
        &--price {
          color: #ff4d4f;
        }
      }
      
      &-notice {
        font-size: 24rpx;
        color: #999;
        margin-top: 12rpx;
        display: block;
      }
    }
    
    &-connecting {
      display: flex;
      justify-content: center;
      gap: 16rpx;
      margin-top: 20rpx;
      
      &-dot {
        width: 16rpx;
        height: 16rpx;
        background: #1890ff;
        border-radius: 50%;
        animation: call-page-bounce 1.4s infinite;
        
        &:nth-child(2) {
          animation-delay: 0.2s;
        }
        
        &:nth-child(3) {
          animation-delay: 0.4s;
        }
      }
    }
  }
  
  &__controls {
    background: #fff;
    border-radius: 16rpx;
    padding: 20rpx;
    margin-bottom: 20rpx;
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
    
    &-row {
      display: flex;
      justify-content: space-around;
      margin-bottom: 20rpx;
    }
    
    &-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8rpx;
      padding: 20rpx;
      border-radius: 12rpx;
      transition: all 0.3s;
      
      text {
        font-size: 24rpx;
        color: #666;
      }
      
      &--active {
        background: rgba(24, 144, 255, 0.1);
        
        text {
          color: #1890ff;
        }
      }
    }
    
    &-end {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8rpx;
      padding: 20rpx;
      background: #ff4d4f;
      border-radius: 12rpx;
      transition: all 0.3s;
      
      text {
        font-size: 24rpx;
        color: #fff;
      }
      
      &:active {
        opacity: 0.8;
      }
    }
  }
  
  &__notes {
    background: #fff;
    border-radius: 16rpx;
    padding: 20rpx;
    margin-bottom: 20rpx;
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
    
    &-input {
      width: 100%;
      height: 200rpx;
      padding: 16rpx;
      border: 1rpx solid #eee;
      border-radius: 8rpx;
      font-size: 28rpx;
      color: #333;
      margin-bottom: 12rpx;
    }
    
    &-count {
      font-size: 24rpx;
      color: #999;
      text-align: right;
    }
  }
  
  &__actions {
    display: flex;
    gap: 20rpx;
    margin-bottom: 20rpx;
    
    &-btn {
      flex: 1;
      height: 80rpx;
      border-radius: 40rpx;
      font-size: 28rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      
      &--primary {
        background: #1890ff;
        color: #fff;
      }
      
      &--outline {
        background: #fff;
        color: #1890ff;
        border: 1rpx solid #1890ff;
      }
      
      &--cancel {
        background: #ff4d4f;
        color: #fff;
      }
    }
  }
  
  &__summary {
    background: #fff;
    border-radius: 16rpx;
    padding: 20rpx;
    margin-bottom: 20rpx;
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
    
    &-card {
      margin-bottom: 20rpx;
      
      &-title {
        font-size: 32rpx;
        font-weight: 500;
        color: #333;
        margin-bottom: 20rpx;
      }
      
      &-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 16rpx;
        
        .label {
          font-size: 28rpx;
          color: #666;
        }
        
        .value {
          font-size: 28rpx;
          color: #333;
          font-weight: 500;
          
          &--price {
            color: #ff4d4f;
          }
        }
      }
      
      &-note {
        font-size: 24rpx;
        color: #999;
        margin-top: 12rpx;
        display: block;
      }
      
      &-notes {
        margin-top: 20rpx;
        padding-top: 20rpx;
        border-top: 1rpx solid #eee;
        
        .label {
          font-size: 28rpx;
          color: #666;
          margin-bottom: 12rpx;
          display: block;
        }
        
        .value {
          font-size: 28rpx;
          color: #333;
          line-height: 1.6;
        }
      }
    }
    
    &-actions {
      display: flex;
      gap: 20rpx;
      
      .btn {
        flex: 1;
        height: 80rpx;
        border-radius: 40rpx;
        font-size: 28rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        
        &--primary {
          background: #1890ff;
          color: #fff;
        }
        
        &--outline {
          background: #fff;
          color: #1890ff;
          border: 1rpx solid #1890ff;
        }
      }
    }
  }
}

@keyframes call-page-pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
  100% {
    opacity: 1;
  }
}

@keyframes call-page-bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}
</style> 