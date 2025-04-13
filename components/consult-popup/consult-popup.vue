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
              >《服务协议》</text>
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

const props = defineProps({
  show: { type: Boolean, default: false },
  basePrice: { type: Number, default: 38 }
})

// 咨询时长选项
const durationOptions = [
  { label: '15分钟', value: 15, price: 0 },
  { label: '30分钟', value: 30, price: 0 },
  { label: '1小时', value: 60, price: 0 }
]

const emit = defineEmits(['close', 'confirm'])

// 组件状态
const selectedDuration = ref(null)
const isAgreed = ref(false)

// 处理后的选项数据
const processedOptions = computed(() =>
    durationOptions.map(option => ({
      ...option,
      price: option.price || props.basePrice * (option.value / 30)
    }))
)

// 是否可提交
const canSubmit = computed(() =>
    selectedDuration.value !== null && isAgreed.value
)

// 确认按钮文字
const confirmText = computed(() =>
    selectedDuration.value
        ? `立即咨询 ¥${processedOptions.value.find(o => o.value === selectedDuration.value)?.price}`
        : '立即咨询'
)

// 事件处理
const handleClose = () => emit('close')
const handlePopupStateChange = (e) => !e.show && resetState()

const handleSelectDuration = (item) => {
  selectedDuration.value = item.value
}

const handleAgreementToggle = (e) => {
  isAgreed.value = e.detail.value.length > 0
}

const handleViewAgreement = () => {
  uni.navigateTo({ url: '/pages/agreement/service' })
}

const handleConfirm = () => {
  if (!canSubmit.value) return

  const selectedOption = processedOptions.value.find(
      o => o.value === selectedDuration.value
  )

  emit('confirm', {
    duration: selectedOption.value,
    price: selectedOption.price
  })
  resetState()
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