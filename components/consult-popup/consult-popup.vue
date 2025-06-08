<!-- consult-popup.vue -->
<template>
  <uni-popup
      ref="popup"
      type="bottom"
      :show="show"
      @change="handlePopupStateChange"
  >
    <view class="consult-popup">
      <!-- 弹窗头部 -->
      <view class="popup-header">
        <text class="popup-title">选择咨询时长</text>
        <uni-icons
            type="close"
            size="20"
            color="#999"
            @click="handleClose"
        />
      </view>

      <!-- 时长选项 -->
      <view class="duration-options">
        <view
            v-for="(item, index) in processedOptions"
            :key="index"
            class="duration-item"
            :class="{ active: selectedDuration === item.value }"
            @click="handleSelectDuration(item)"
        >
          <text class="duration-text">{{ item.label }}</text>
          <text class="duration-price">¥{{ item.price }}</text>
        </view>

        <!-- 提示信息 -->
        <view class="tips-section">
          <view class="tip-item">
            <uni-icons type="shield" size="16" color="#6B5BFF"/>
            <text class="tip-text">电话号码经过加密处理，保证隐私安全</text>
          </view>
          <view class="tip-item">
            <uni-icons type="info" size="16" color="#6B5BFF"/>
            <text class="tip-text">电话未接通不收费，接通1分钟内不收费</text>
          </view>
        </view>
      </view>

      <!-- 底部操作区 -->
      <view class="popup-footer">
        <!-- 协议确认 -->
        <view class="agreement-section">
          <checkbox-group @change="handleAgreementToggle">
            <label class="agreement-label">
              <checkbox
                  :checked="isAgreed"
                  color="#6B5BFF"
                  style="transform:scale(0.8)"
              />
              <text class="agreement-text">我已阅读并同意</text>
              <text
                  class="agreement-link"
                  @click.stop="handleViewAgreement"
              >《服务协议》
              </text>
            </label>
          </checkbox-group>
        </view>

        <!-- 确认按钮 -->
        <button
            class="confirm-btn"
            :class="{ disabled: !canSubmit }"
            :disabled="!canSubmit"
            @click="handleConfirm"
        >
          {{ confirmText }}
        </button>
      </view>
    </view>
  </uni-popup>
</template>

<script setup>
import { ref, computed } from 'vue'
import { getUserInfo } from '@/utils/store/userManager'
import { navigateToUrl } from '@/utils/navigateTo'

// 定义组件属性
const props = defineProps({
  show: { type: Boolean, default: false },
  basePrice: { type: Number, default: 38 },
  lawyerInfo: {
    type: Object,
    required: true,
    default: () => ({
      id: '',
      lawyername: '',
      phone: '',
      fee: 0
    })
  }
})

// 定义组件事件
const emit = defineEmits(['close', 'confirm'])

// 组件状态
const selectedDuration = ref(null)
const isAgreed = ref(false)

// 咨询时长选项
const durationOptions = [
  { label: '15分钟', value: 15, price: 0 },
  { label: '30分钟', value: 30, price: 0 },
  { label: '1小时', value: 60, price: 0 }
]

// 计算属性
const processedOptions = computed(() =>
  durationOptions.map(option => ({
    ...option,
    price: option.price || props.basePrice * (option.value / 30)
  }))
)

const canSubmit = computed(() =>
  selectedDuration.value !== null && isAgreed.value
)

const confirmText = computed(() =>
  selectedDuration.value
    ? `立即咨询 ¥${processedOptions.value.find(o => o.value === selectedDuration.value)?.price}`
    : '立即咨询'
)

// 事件处理函数
const handleClose = () => emit('close')

const handlePopupStateChange = (e) => !e.show && resetState()

const handleSelectDuration = (item) => {
  selectedDuration.value = item.value
}

const handleAgreementToggle = (e) => {
  isAgreed.value = e.detail.value.length > 0
}

const handleViewAgreement = () => {
  navigateToUrl('/pages/agreement/service')
}

const handleConfirm = async () => {
  if (!canSubmit.value) return

  try {
    const userInfo = await getUserInfo()
    if (!userInfo || !userInfo.phone) {
      uni.showToast({ title: '请先完善手机号', icon: 'none' })
      return
    }

    // 构建通话参数
    const callParams = {
      userId: userInfo.id,
      lawyerId: props.lawyerInfo.id,
      duration: selectedDuration.value,
      fee: props.basePrice * (selectedDuration.value / 30)
    }

    // 跳转到通话页面
    navigateToUrl(`/pages/call/callpage?lawyerId=${props.lawyerInfo.id}&duration=${selectedDuration.value}`)
    
    // 触发确认事件
    emit('confirm', callParams)
    
    // 重置状态
    resetState()

  } catch (error) {
    uni.showToast({ title: error.message || '操作失败', icon: 'none' })
  }
}

// 重置状态
const resetState = () => {
  selectedDuration.value = null
  isAgreed.value = false
}
</script>

<style lang="scss" scoped>
.consult-popup {
  background: #fff;
  border-radius: 32rpx 32rpx 0 0;
  padding: 32rpx;
  padding-bottom: calc(32rpx + env(safe-area-inset-bottom));

  .popup-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40rpx;

    .popup-title {
      font-size: 32rpx;
      font-weight: 600;
      color: #333;
    }
  }

  .duration-options {
    margin-bottom: 40rpx;

    .duration-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 28rpx;
      margin-bottom: 20rpx;
      border: 2rpx solid #eee;
      border-radius: 16rpx;
      transition: all 0.3s;

      &.active {
        border-color: #6B5BFF;
        background: rgba(107, 91, 255, 0.05);
      }

      .duration-text {
        font-size: 28rpx;
        color: #333;
      }

      .duration-price {
        font-size: 32rpx;
        font-weight: 500;
        color: #FF5252;
      }
    }

    .tips-section {
      margin-top: 24rpx;
      padding: 20rpx;
      background: rgba(107, 91, 255, 0.05);
      border-radius: 12rpx;

      .tip-item {
        display: flex;
        align-items: center;
        margin-bottom: 16rpx;

        &:last-child {
          margin-bottom: 0;
        }

        .tip-text {
          margin-left: 12rpx;
          font-size: 24rpx;
          color: #666;
          line-height: 1.4;
        }
      }
    }
  }

  .agreement-section {
    margin-bottom: 32rpx;

    .agreement-label {
      display: flex;
      align-items: center;
      font-size: 24rpx;
      color: #666;

      .agreement-link {
        color: #6B5BFF;
        margin-left: 4rpx;
      }
    }
  }

  .confirm-btn {
    width: 100%;
    height: 88rpx;
    line-height: 88rpx;
    background: linear-gradient(135deg, #6B5BFF, #857AFF);
    color: #fff;
    font-size: 32rpx;
    border-radius: 44rpx;
    transition: opacity 0.3s;

    &.disabled {
      opacity: 0.6;
    }
  }
}
</style>