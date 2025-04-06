<template>
  <view class="call-container">
    <!-- 顶部状态栏 -->
    <view class="status-bar" :class="statusClass">
      <text class="status-text">{{ statusText }}</text>
    </view>
    
    <!-- 律师信息 -->
    <view class="lawyer-info">
      <image class="avatar" :src="lawyerInfo.avatar || '/static/images/lawyer_avatar.jpg'" mode="aspectFill"></image>
      <view class="info">
        <text class="name">{{ lawyerInfo.name || '律师' }}</text>
        <text class="title">{{ lawyerInfo.title || '专业律师' }}</text>
        <text class="phone">{{ encryptedPhone }}</text>
      </view>
    </view>
    
    <!-- 通话信息 -->
    <view class="call-info">
      <view class="timer">
        <text class="time">{{ callTime }}</text>
        <text v-if="isBillingStarted" class="billing">计费中</text>
      </view>
      
      <view v-if="callStatus === 'connected'" class="fee-info">
        <text class="fee-text">咨询费用: {{ fee }}元/分钟</text>
        <text class="fee-text">已产生费用: {{ calculatedFee }}元</text>
        <text class="fee-notice" v-if="!isBillingStarted">通话1分钟内免费</text>
      </view>
      
      <view v-if="callStatus === 'connecting'" class="connecting-animation">
        <view class="dot"></view>
        <view class="dot"></view>
        <view class="dot"></view>
      </view>
    </view>
    
    <!-- 通话控制 -->
    <view class="call-controls">
      <view class="control-row">
        <view class="control-btn mute" :class="{ active: isMuted }" @click="toggleMute">
          <uni-icons :type="isMuted ? 'mic-slash' : 'mic'" size="24" color="#fff"></uni-icons>
          <text>{{ isMuted ? '已静音' : '静音' }}</text>
        </view>
        
        <view class="control-btn speaker" :class="{ active: isSpeaker }" @click="toggleSpeaker">
          <uni-icons :type="isSpeaker ? 'sound' : 'sound-filled'" size="24" color="#fff"></uni-icons>
          <text>{{ isSpeaker ? '扬声器' : '听筒' }}</text>
        </view>
      </view>
      
      <view class="end-call" @click="handleEndCall">
        <uni-icons type="phone-filled" size="36" color="#fff"></uni-icons>
        <text>结束通话</text>
      </view>
    </view>
    
    <!-- 未接通或通话结束时的操作按钮 -->
    <view v-if="callStatus === 'pending' || callStatus === 'failed' || callStatus === 'completed'" class="action-buttons">
      <button class="btn primary" @click="makePhoneCall" v-if="callStatus === 'pending' || callStatus === 'failed'">
        {{ callStatus === 'failed' ? '重新拨打' : '拨打电话' }}
      </button>
      
      <button class="btn outline" @click="goBack" v-if="callStatus === 'failed' || callStatus === 'completed'">
        返回
      </button>
      
      <button class="btn cancel" @click="cancelCall" v-if="callStatus === 'connecting'">
        取消
      </button>
    </view>
    
    <!-- 通话结束摘要 -->
    <view v-if="callStatus === 'completed'" class="call-summary">
      <view class="summary-card">
        <view class="summary-title">通话摘要</view>
        <view class="summary-item">
          <text class="label">通话时长:</text>
          <text class="value">{{ formatDuration(callDuration) }}</text>
        </view>
        <view class="summary-item">
          <text class="label">计费时长:</text>
          <text class="value">{{ formatDuration(chargedDuration) }}</text>
        </view>
        <view class="summary-item">
          <text class="label">咨询费用:</text>
          <text class="value price">¥{{ calculatedFee }}</text>
        </view>
        <view class="summary-note" v-if="chargedDuration === 0">
          <text>通话未满1分钟，不收取费用</text>
        </view>
      </view>
      
      <button class="btn primary" @click="goToEvaluation" v-if="callDuration > 60">评价咨询</button>
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
function makePhoneCall() {
  if (callStatus.value === 'connecting') return;
  
  callStatus.value = 'connecting';
  
  // 调用拨打电话服务
  callHandler = makeCall({
    orderId: orderId.value,
    onStateChange: (state) => {
      console.log('通话状态变更', state);
      
      if (state.status === 'connected') {
        callStatus.value = 'connected';
        startTimer();
      } else if (state.status === 'failed') {
        callStatus.value = 'failed';
        uni.showToast({
          title: state.message || '连接失败',
          icon: 'none'
        });
      } else if (state.status === 'cancelled') {
        callStatus.value = 'cancelled';
      } else if (state.status === 'billing_started') {
        isBillingStarted.value = true;
      } else if (state.status === 'in_progress') {
        callDuration.value = state.duration || 0;
        if (state.isBillingStarted) {
          isBillingStarted.value = true;
          chargedDuration.value = state.chargedDuration || 0;
        }
      }
    },
    onSuccess: (res) => {
      console.log('通话已接通', res);
    },
    onFail: (err) => {
      console.error('通话失败', err);
      callStatus.value = 'failed';
      uni.showToast({
        title: err.errMsg || '通话失败',
        icon: 'none'
      });
    }
  });
}

// 取消通话
function cancelCall() {
  if (callHandler && callHandler.cancel) {
    callHandler.cancel();
    callStatus.value = 'cancelled';
  }
}

// 结束通话
function handleEndCall() {
  if (callStatus.value !== 'connected') return;
  
  // 清理计时器
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
  
  // 调用结束通话服务
  const result = endCall(orderId.value);
  if (result) {
    callStatus.value = 'completed';
    
    // 获取最终通话信息
    const callInfo = getCallInfo(orderId.value);
    if (callInfo) {
      callDuration.value = callInfo.actualDuration || 0;
      chargedDuration.value = callInfo.chargedDuration || 0;
      callTime.value = formatTime(callDuration.value);
    }
    
    // 显示结束提示
    uni.showToast({
      title: '通话已结束',
      icon: 'none'
    });
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
</script>

<style lang="scss">
.call-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #334155, #1e293b);
  color: #fff;
  padding: 40rpx 30rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

/* 状态栏样式 */
.status-bar {
  text-align: center;
  padding: 20rpx 0;
  border-radius: 50rpx;
  background: rgba(255,255,255,0.1);
  margin-bottom: 60rpx;
  
  &.status-connecting {
    background: rgba(255, 163, 0, 0.2);
    color: #ffa000;
  }
  
  &.status-connected {
    background: rgba(0, 200, 83, 0.2);
    color: #00c853;
  }
  
  &.status-failed {
    background: rgba(244, 67, 54, 0.2);
    color: #f44336;
  }
  
  &.status-completed {
    background: rgba(255, 255, 255, 0.2);
  }
}

.status-text {
  font-size: 28rpx;
  font-weight: 500;
}

/* 律师信息 */
.lawyer-info {
  display: flex;
  align-items: center;
  margin-bottom: 80rpx;
  
  .avatar {
    width: 160rpx;
    height: 160rpx;
    border-radius: 50%;
    border: 4rpx solid rgba(255,255,255,0.2);
    margin-right: 30rpx;
  }
  
  .info {
    flex: 1;
    
    .name {
      font-size: 40rpx;
      font-weight: 600;
      margin-bottom: 10rpx;
    }
    
    .title {
      font-size: 28rpx;
      color: rgba(255,255,255,0.7);
      margin-bottom: 10rpx;
    }
    
    .phone {
      font-size: 26rpx;
      color: rgba(255,255,255,0.5);
    }
  }
}

/* 通话信息 */
.call-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 80rpx;
  flex: 1;
}

.timer {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30rpx;
  
  .time {
    font-size: 68rpx;
    font-weight: 300;
    font-family: 'Courier New', monospace;
    margin-bottom: 10rpx;
  }
  
  .billing {
    font-size: 24rpx;
    color: #ff9800;
    background: rgba(255, 152, 0, 0.2);
    padding: 6rpx 20rpx;
    border-radius: 30rpx;
  }
}

.fee-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20rpx;
  
  .fee-text {
    font-size: 28rpx;
    color: rgba(255,255,255,0.8);
    margin-bottom: 10rpx;
  }
  
  .fee-notice {
    font-size: 24rpx;
    color: #4fc3f7;
    margin-top: 10rpx;
  }
}

/* 连接动画 */
.connecting-animation {
  display: flex;
  justify-content: center;
  margin-top: 40rpx;
  
  .dot {
    width: 20rpx;
    height: 20rpx;
    border-radius: 50%;
    background-color: rgba(255,255,255,0.8);
    margin: 0 10rpx;
    animation: pulse 1.5s infinite ease-in-out;
    
    &:nth-child(2) {
      animation-delay: 0.3s;
    }
    
    &:nth-child(3) {
      animation-delay: 0.6s;
    }
  }
}

@keyframes pulse {
  0%, 80%, 100% {
    transform: scale(0.6);
    opacity: 0.3;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

/* 通话控制 */
.call-controls {
  margin-top: auto;
  
  .control-row {
    display: flex;
    justify-content: space-around;
    margin-bottom: 40rpx;
  }
  
  .control-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20rpx;
    border-radius: 20rpx;
    background: rgba(255,255,255,0.1);
    width: 160rpx;
    
    text {
      font-size: 24rpx;
      margin-top: 10rpx;
      color: rgba(255,255,255,0.8);
    }
    
    &.active {
      background: rgba(255,255,255,0.2);
    }
  }
  
  .end-call {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #f44336;
    border-radius: 50%;
    width: 120rpx;
    height: 120rpx;
    margin: 0 auto 40rpx;
    
    text {
      font-size: 24rpx;
      margin-top: 5rpx;
    }
  }
}

/* 按钮 */
.action-buttons {
  display: flex;
  justify-content: center;
  margin-top: auto;
  gap: 20rpx;
  
  .btn {
    min-width: 240rpx;
    height: 80rpx;
    line-height: 80rpx;
    border-radius: 40rpx;
    font-size: 28rpx;
    
    &.primary {
      background: linear-gradient(135deg, #4A90E2, #2979FF);
      color: #fff;
    }
    
    &.outline {
      background: transparent;
      border: 1px solid rgba(255,255,255,0.6);
      color: #fff;
    }
    
    &.cancel {
      background: rgba(255,255,255,0.2);
      color: #fff;
    }
  }
}

/* 通话摘要 */
.call-summary {
  margin-top: 40rpx;
  
  .summary-card {
    background: rgba(255,255,255,0.1);
    border-radius: 16rpx;
    padding: 30rpx;
    margin-bottom: 30rpx;
  }
  
  .summary-title {
    font-size: 32rpx;
    font-weight: 600;
    margin-bottom: 20rpx;
    text-align: center;
  }
  
  .summary-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20rpx;
    font-size: 28rpx;
    
    .label {
      color: rgba(255,255,255,0.7);
    }
    
    .value {
      font-weight: 500;
      
      &.price {
        color: #ff9800;
      }
    }
  }
  
  .summary-note {
    text-align: center;
    font-size: 24rpx;
    color: #4fc3f7;
    margin-top: 20rpx;
  }
  
  .btn.primary {
    width: 100%;
    background: linear-gradient(135deg, #4A90E2, #2979FF);
    color: #fff;
    height: 80rpx;
    line-height: 80rpx;
    border-radius: 40rpx;
    font-size: 28rpx;
    margin-top: 20rpx;
  }
}
</style> 