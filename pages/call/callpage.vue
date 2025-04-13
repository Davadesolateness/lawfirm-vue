<!-- callpage.vue 优化后完整代码 -->
<template>
  <view class="call-page">
    <!-- 状态栏 -->
    <view class="status-bar" :class="statusClass">
      <text class="status-text">{{ statusText }}</text>
      <view v-if="callStatus === 'connected'" class="network-quality">
        <uni-icons :type="networkIcon" size="16" :color="networkColor"></uni-icons>
        <text>{{ networkStatus }}</text>
      </view>
    </view>

    <!-- 律师信息卡片 -->
    <view class="lawyer-card">
      <image class="avatar" :src="lawyerInfo.avatar" mode="aspectFill"></image>
      <view class="info">
        <text class="name">{{ lawyerInfo.name }}</text>
        <text class="title">{{ lawyerInfo.title }}</text>
        <text class="phone">{{ encryptedPhone }}</text>
      </view>
      <view v-if="isRecording" class="recording-indicator">
        <uni-icons type="record" size="16" color="#FF4D4F"></uni-icons>
        <text>录音中</text>
      </view>
    </view>

    <!-- 通话信息 -->
    <view class="call-info">
      <view class="timer-section">
        <text class="time">{{ formattedTime }}</text>
        <text v-if="isBilling" class="billing-tag">计费中</text>
      </view>

      <view v-if="callStatus === 'connected'" class="fee-details">
        <view class="fee-row">
          <text>咨询费率:</text>
          <text class="highlight">¥{{ feePerMin }}/分钟</text>
        </view>
        <view class="fee-row">
          <text>当前费用:</text>
          <text class="highlight price">¥{{ currentFee }}</text>
        </view>
        <text v-if="!isBilling" class="fee-notice">前1分钟免费咨询</text>
      </view>

      <view v-if="callStatus === 'connecting'" class="connecting-animation">
        <view v-for="i in 3" :key="i" class="dot"></view>
      </view>
    </view>

    <!-- 控制按钮 -->
    <view class="control-panel">
      <view class="function-buttons">
        <view
            v-for="btn in functionButtons"
            :key="btn.action"
            class="btn"
            :class="{ active: btn.isActive }"
            @click="handleControl(btn.action)"
        >
          <uni-icons :type="btn.icon" size="24" color="#fff"></uni-icons>
          <text>{{ btn.label }}</text>
        </view>
      </view>

      <view class="end-call" @click="endTheCurrentCall">
        <uni-icons type="phone-slash" size="32" color="#fff"></uni-icons>
        <text>结束通话</text>
      </view>
    </view>

    <!-- 通话笔记 -->
    <view v-if="callStatus === 'connected'" class="notes-section">
      <textarea
          v-model="notes"
          placeholder="输入通话要点..."
          maxlength="300"
          class="notes-input"
      ></textarea>
      <text class="counter">{{ notes.length }}/300</text>
    </view>

    <!-- 通话结束面板 -->
    <view v-if="callStatus === 'ended'" class="summary-panel">
      <view class="summary-card">
        <text class="title">通话摘要</text>
        <view class="detail-item">
          <text>总时长:</text>
          <text>{{ totalDuration }}</text>
        </view>
        <view class="detail-item">
          <text>计费时长:</text>
          <text>{{ billedDuration }}</text>
        </view>
        <view class="detail-item">
          <text>咨询费用:</text>
          <text class="price">¥{{ totalFee }}</text>
        </view>
        <button class="action-btn" @click="goToReview">评价服务</button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { endCall, formatDuration } from '@/pages/call/callService'
import { navigateToUrl } from '@/utils/navigateTo'

// 组件状态
const orderId = ref('')
const callStatus = ref('pending') // pending, connecting, connected, ended
const elapsedSeconds = ref(0)
const isMuted = ref(false)
const isSpeakerOn = ref(false)
const isRecording = ref(false)
const notes = ref('')
const timer = ref(null)
const callStartTime = ref(null)
const callInstance = ref(null)

// 律师信息
const lawyerInfo = ref({
  name: '李律师',
  title: '婚姻法律师',
  avatar: '/static/avatar-lawyer.jpg',
  phone: '13812345678'
})

// 费率信息
const feeConfig = ref({
  rate: 3.8, // 元/分钟
  freeMinutes: 1
})

// 计算属性
const statusClass = computed(() => ({
  'status-pending': callStatus.value === 'pending',
  'status-connecting': callStatus.value === 'connecting',
  'status-connected': callStatus.value === 'connected',
  'status-ended': callStatus.value === 'ended'
}))

const statusText = computed(() => {
  const statusMap = {
    pending: '等待接通',
    connecting: '正在接通',
    connected: '通话中',
    ended: '通话结束'
  }
  return statusMap[callStatus.value] || ''
})

const networkIcon = computed(() => {
  const quality = Math.random() // 模拟网络质量
  if (quality > 0.8) return 'wifi'
  if (quality > 0.5) return 'wifi-medium'
  return 'wifi-low'
})

const networkStatus = computed(() => {
  const quality = Math.random() // 模拟网络质量
  if (quality > 0.8) return '网络良好'
  if (quality > 0.5) return '网络一般'
  return '网络较差'
})

const encryptedPhone = computed(() => {
  const phone = lawyerInfo.value.phone
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
})

const formattedTime = computed(() => {
  const mins = Math.floor(elapsedSeconds.value / 60)
  const secs = elapsedSeconds.value % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
})

const isBilling = computed(() => elapsedSeconds.value > feeConfig.value.freeMinutes * 60)

const currentFee = computed(() => {
  const billedSeconds = Math.max(elapsedSeconds.value - feeConfig.value.freeMinutes * 60, 0)
  return (billedSeconds / 60 * feeConfig.value.rate).toFixed(2)
})

const feePerMin = computed(() => feeConfig.value.rate)

const totalDuration = computed(() => formatDuration(elapsedSeconds.value))

const billedDuration = computed(() => {
  const billedSeconds = Math.max(elapsedSeconds.value - feeConfig.value.freeMinutes * 60, 0)
  return formatDuration(billedSeconds)
})

const totalFee = computed(() => {
  const billedSeconds = Math.max(elapsedSeconds.value - feeConfig.value.freeMinutes * 60, 0)
  return (billedSeconds / 60 * feeConfig.value.rate).toFixed(2)
})

// 控制按钮配置
const functionButtons = computed(() => [
  {
    action: 'toggleMute',
    label: isMuted.value ? '已静音' : '静音',
    icon: isMuted.value ? 'mic-off' : 'mic',
    isActive: isMuted.value
  },
  {
    action: 'toggleSpeaker',
    label: isSpeakerOn.value ? '扬声器' : '听筒',
    icon: isSpeakerOn.value ? 'speaker' : 'earpiece',
    isActive: isSpeakerOn.value
  },
  {
    action: 'toggleRecord',
    label: isRecording.value ? '停止录音' : '录音',
    icon: isRecording.value ? 'record-active' : 'record',
    isActive: isRecording.value
  }
])

// 生命周期
onMounted(async () => {
  const params = getCurrentPages().pop().options
  orderId.value = params.orderId

  if (orderId.value) {
    await loadCallData()
    startCall()
  }
})

onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value)
  }
  if (callStatus.value === 'connected') {
    endTheCurrentCall()
  }
})

// 方法
async function loadCallData() {
  try {
    // 模拟加载通话数据
    const data = {
      lawyerInfo: {
        name: '李律师',
        title: '婚姻法律师',
        avatar: '/static/avatar-lawyer.jpg',
        phone: '13812345678'
      },
      duration: 0,
      status: 'pending'
    }
    lawyerInfo.value = data.lawyerInfo
    elapsedSeconds.value = data.duration
    callStatus.value = data.status
  } catch (error) {
    uni.showToast({ title: '加载通话数据失败', icon: 'none' })
  }
}

function startCall() {
  callStatus.value = 'connecting'
  callStartTime.value = new Date()

  // 使用uni-app的电话功能API拨打电话
  uni.makePhoneCall({
    phoneNumber: lawyerInfo.value.phone,
    success: () => {
      callStatus.value = 'connected'
      startTimer()
    },
    fail: (err) => {
      console.error('拨打电话失败:', err)
      callStatus.value = 'ended'
      uni.showToast({ title: '通话连接失败', icon: 'none' })
    }
  })
}

function startTimer() {
  timer.value = setInterval(() => {
    elapsedSeconds.value++

    // 检查是否需要开始计费
    if (elapsedSeconds.value === feeConfig.value.freeMinutes * 60) {
      uni.showToast({ title: '开始计费', icon: 'none' })
    }
  }, 1000)
}

function handleControl(action) {
  const handlers = {
    toggleMute: () => {
      isMuted.value = !isMuted.value
      // 模拟静音操作
      uni.showToast({ title: isMuted.value ? '已静音' : '已取消静音', icon: 'none' })
    },
    toggleSpeaker: () => {
      isSpeakerOn.value = !isSpeakerOn.value
      // 模拟扬声器切换
      uni.showToast({ title: isSpeakerOn.value ? '已切换至扬声器' : '已切换至听筒', icon: 'none' })
    },
    toggleRecord: () => {
      if (!isRecording.value) {
        uni.showModal({
          title: '录音提示',
          content: '开始录音将告知对方',
          success: () => {
            isRecording.value = true
            // 模拟开始录音
            uni.showToast({ title: '开始录音', icon: 'none' })
          }
        })
      } else {
        isRecording.value = false
        // 模拟停止录音
        uni.showToast({ title: '录音已保存', icon: 'none' })
      }
    }
  }
  handlers[action]?.()
}

async function endTheCurrentCall() {
  try {
    // 结束通话
    if (timer.value) {
      clearInterval(timer.value)
      timer.value = null
    }

    // 计算通话时长和费用
    const endTime = new Date()
    const duration = Math.floor((endTime - callStartTime.value) / 1000)
    elapsedSeconds.value = duration

    // 更新通话状态
    callStatus.value = 'ended'

    // 显示通话摘要
    uni.showToast({ title: '通话已结束', icon: 'none' })
  } catch (error) {
    uni.showToast({ title: '结束通话失败', icon: 'none' })
  }
}

function goToReview() {
  navigateToUrl(`/pages/review?orderId=${orderId.value}`)
}
</script>

<style lang="scss" scoped>
.call-page {
  padding: 24rpx;
  background: #f8f9fa;
  min-height: 100vh;
}

.status-bar {
  background: #fff;
  border-radius: 16rpx;
  padding: 20rpx;
  margin-bottom: 24rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05);

  &-text {
    font-size: 28rpx;
    color: #333;
    font-weight: 500;
  }
}

.lawyer-card {
  background: #fff;
  border-radius: 24rpx;
  padding: 32rpx;
  display: flex;
  align-items: center;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05);

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

    .title {
      font-size: 24rpx;
      color: #666;
    }

    .phone {
      font-size: 24rpx;
      color: #999;
      margin-top: 8rpx;
    }
  }

  .recording-indicator {
    background: rgba(255,77,79,0.1);
    padding: 8rpx 16rpx;
    border-radius: 8rpx;
    display: flex;
    align-items: center;

    text {
      color: #FF4D4F;
      font-size: 24rpx;
      margin-left: 8rpx;
    }
  }
}

.control-panel {
  background: #fff;
  border-radius: 24rpx;
  padding: 24rpx;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05);

  .function-buttons {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24rpx;
    margin-bottom: 32rpx;

    .btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 16rpx;
      border-radius: 12rpx;
      background: rgba(107,91,255,0.1);
      transition: all 0.2s;

      &.active {
        background: rgba(107,91,255,0.2);
      }

      text {
        font-size: 24rpx;
        color: #6B5BFF;
        margin-top: 8rpx;
      }
    }
  }

  .end-call {
    background: #FF4D4F;
    border-radius: 48rpx;
    height: 96rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 32rpx;

    text {
      margin-left: 12rpx;
    }
  }
}

/* 其他样式部分保持语义化结构... */
</style>