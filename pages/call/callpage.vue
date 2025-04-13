<!-- callpage.vue -->

<template>
  <view class="call-container">
    <!-- 支付状态提示 -->
    <view v-if="paymentStatus !== 'paid'" class="payment-panel">
      <view v-if="paymentStatus === 'unpaid'">
        <text class="fee-text">咨询费用：¥{{ (lawyerInfo.fee * 30).toFixed(2) }}</text>
        <button class="pay-btn" @click="handleStartPayment">立即支付并通话</button>
      </view>
      <view v-else class="paying-status">
        <uni-icons type="spinner-cycle" size="24" color="#007AFF"/>
        <text>支付处理中...</text>
      </view>
    </view>
    <template v-else>
      <view class="call-container">
        <!-- 状态指示器 -->
        <view class="status-indicator" :class="callStatus">
          <text class="status-text">{{ statusText }}</text>
          <view v-if="isConnected" class="network-quality">
            <uni-icons :type="networkStatus.icon" size="16" :color="networkStatus.color"/>
            <text>{{ networkStatus.label }}</text>
          </view>
        </view>

        <!-- 律师信息卡片 -->
        <view class="lawyer-card">
          <image class="avatar" :src="lawyerInfo.avatar" mode="aspectFill"/>
          <view class="info">
            <text class="name">{{ lawyerInfo.name }}</text>
            <text class="title">{{ lawyerInfo.title }}</text>
            <text class="phone">{{ encryptedPhone }}</text>
          </view>
          <view v-if="isRecording" class="recording-indicator">
            <uni-icons type="record" size="16" color="#ff4d4f"/>
            <text>录音中</text>
          </view>
        </view>

        <!-- 通话计时 -->
        <view class="call-timer">
          <text class="time">{{ formattedTime }}</text>
          <text v-if="isBilling" class="billing-tag">计费中</text>
        </view>

        <!-- 控制按钮 -->
        <view class="control-panel">
          <view class="button-group">
            <view
                v-for="(btn, index) in controlButtons"
                :key="index"
                class="control-btn"
                :class="{ active: btn.isActive }"
                @click="handleControl(btn.action)"
            >
              <uni-icons :type="btn.icon" size="24" color="#fff"/>
              <text>{{ btn.label }}</text>
            </view>
          </view>
          <view class="end-call-btn" @click="handleEndCall">
            <uni-icons type="phone-slash" size="32" color="#fff"/>
            <text>结束通话</text>
          </view>
        </view>

        <!-- 通话摘要 -->
        <view v-if="callEnded" class="summary-card">
          <text class="title">通话摘要</text>
          <view class="summary-item">
            <text>总时长：</text>
            <text>{{ totalDuration }}</text>
          </view>
          <view class="summary-item">
            <text>计费时长：</text>
            <text>{{ billedDuration }}</text>
          </view>
          <view class="summary-item total-fee">
            <text>咨询费用：</text>
            <text>¥{{ totalFee }}</text>
          </view>
        </view>
      </view>
    </template>
  </view>
</template>
<script setup>
import {ref, computed, onUnmounted} from 'vue'
import {endCall, formatDuration} from '@/pages/call/callService'
import {wxPay, ORDER_STATUS} from '@/utils/pay'

// 通话状态管理
const callStatus = ref('pending') // pending, connecting, connected, ended
const elapsedSeconds = ref(0)
let timer = null

// 律师信息
const lawyerInfo = ref({
  name: '张律师',
  title: '婚姻法律师',
  avatar: '/static/lawyer-avatar.jpg',
  phone: '13812345678',
  fee: 3.8, // 元/分钟
  lawyerId: 'L2001'
})

// 支付相关状态
const paymentStatus = ref('unpaid') // unpaid, paying, paid
const currentOrder = ref(null)

// 计算属性
const isConnected = computed(() => callStatus.value === 'connected')
const encryptedPhone = computed(() => lawyerInfo.value.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'))
const formattedTime = computed(() => formatDuration(elapsedSeconds.value))
const totalFee = computed(() => (elapsedSeconds.value / 60 * lawyerInfo.value.fee).toFixed(2))

// 发起支付
const handleStartPayment = async () => {
  paymentStatus.value = 'paying'

  try {
    /*await wxPay({
      userId: 'user123', // 实际应从用户系统获取
      lawyerId: lawyerInfo.value.lawyerId,
      fee: lawyerInfo.value.fee * 30, // 按默认30分钟预付费
      consultType: 'PHONE',
      duration: 30,
      success: (res) => {
        paymentStatus.value = 'paid'
        startCall(res.orderId)
      },
      fail: (err) => {
        paymentStatus.value = 'unpaid'
        uni.showToast({title: err.errMsg, icon: 'none'})
      }
    })*/
    uni.showLoading({title: '发起支付中...', mask: true})

    // 模拟支付过程
    setTimeout(() => {
      uni.hideLoading()

      // 模拟支付成功
      uni.showToast({title: '支付成功', icon: 'success'})

    }, 1500)
    startCall("111");
  } catch (error) {
    paymentStatus.value = 'unpaid'
    uni.showToast({title: '支付初始化失败', icon: 'none'})
  }
}

// 启动通话
const startCall = (orderId) => {
  callStatus.value = 'connecting'

  uni.makePhoneCall({
    phoneNumber: lawyerInfo.value.phone,
    success: () => {
      callStatus.value = 'connected'
      startTimer()
      updateOrderStatus(orderId)
    },
    fail: () => {
      callStatus.value = 'ended'
      uni.showToast({title: '通话连接失败', icon: 'none'})
    }
  })
}

// 更新订单状态
const updateOrderStatus = (orderId) => {
  const orders = JSON.parse(uni.getStorageSync('law_orders_v2') || []);
  const order = orders.find(o => o.orderId === orderId)
  if (order) {
    order.status = ORDER_STATUS.IN_PROGRESS
    order.statusText = '服务中'
    order.consultTime = new Date().toISOString()
    uni.setStorageSync('law_orders_v2', JSON.stringify(orders))
  }
}

// 启动计时器
const startTimer = () => {
  timer = setInterval(() => {
    elapsedSeconds.value++
  }, 1000)
}

// 结束通话
const handleEndCall = async () => {
  clearInterval(timer)
  await endCall()
  callStatus.value = 'ended'
  uni.showToast({title: '通话已结束', icon: 'success'})
}

onUnmounted(() => clearInterval(timer))
</script>

<style lang="scss" scoped>
.call-container {
  padding: 24rpx;
  background: #f8f9fb;
  min-height: 100vh;
}

.status-indicator {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16rpx;
  padding: 20rpx;
  margin-bottom: 24rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);

  &.connected {
    background: rgba(82, 196, 26, 0.1);
  }
}

.lawyer-card {
  background: #fff;
  border-radius: 24rpx;
  padding: 32rpx;
  display: flex;
  align-items: center;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);

  .avatar {
    width: 120rpx;
    height: 120rpx;
    border-radius: 50%;
    margin-right: 24rpx;
  }

  .info {
    flex: 1;

    .name {
      font-size: 32rpx;
      color: #1a1a1a;
      margin-bottom: 8rpx;
    }
  }
}

.control-panel {
  background: #fff;
  border-radius: 24rpx;
  padding: 24rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);

  .button-group {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24rpx;
    margin-bottom: 32rpx;
  }

  .control-btn {
    padding: 16rpx;
    border-radius: 12rpx;
    background: rgba(107, 91, 255, 0.1);
    transition: all 0.2s;

    &.active {
      background: rgba(107, 91, 255, 0.2);
    }
  }

  .end-call-btn {
    background: #ff4d4f;
    border-radius: 48rpx;
    height: 96rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.summary-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-top: 32rpx;

  .total-fee {
    color: #ff4d4f;
    font-weight: bold;
  }
}
</style>