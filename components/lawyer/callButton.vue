<template>
  <view class="call-consultation">
    <button class="call-btn" @click="handleCallConsultation">电话咨询</button>
    
    <!-- 咨询选项弹窗 -->
    <uni-popup ref="popup" type="bottom">
      <view class="popup-content">
        <view class="popup-header">
          <text class="title">电话咨询</text>
          <view class="close" @click="closePopup">
            <uni-icons type="close" size="20" color="#333"></uni-icons>
          </view>
        </view>
        
        <view class="lawyer-info">
          <image class="avatar" :src="lawyerInfo.avatar" mode="aspectFill"></image>
          <view class="info">
            <text class="name">{{ lawyerInfo.name }}</text>
            <text class="title">{{ lawyerInfo.title }}</text>
          </view>
        </view>
        
        <view class="duration-select">
          <text class="label">选择咨询时长</text>
          <view class="duration-options">
            <view 
              v-for="(item, index) in durationOptions" 
              :key="index" 
              class="duration-item"
              :class="{ active: selectedDuration === item.value }"
              @click="selectDuration(item.value)"
            >
              <text class="duration-text">{{ item.text }}</text>
              <text class="duration-price">¥{{ calculatePrice(item.value) }}</text>
            </view>
          </view>
        </view>
        
        <view class="notes">
          <view class="note-item">
            <uni-icons type="info" size="14" color="#999"></uni-icons>
            <text>电话号码经过加密处理，保证隐私安全</text>
          </view>
          <view class="note-item">
            <uni-icons type="info" size="14" color="#999"></uni-icons>
            <text>电话未接通不收费，接通1分钟内不收费</text>
          </view>
          <view class="note-item">
            <uni-icons type="info" size="14" color="#999"></uni-icons>
            <text>咨询结束后，可对服务进行评价</text>
          </view>
        </view>
        
        <view class="agreement">
          <checkbox-group @change="toggleAgreement">
            <label class="checkbox-label">
              <checkbox :checked="agreed" style="transform:scale(0.7);" color="#2979FF" />
              <text>我已阅读并同意</text>
              <text class="link" @click.stop="viewAgreement">《咨询服务协议》</text>
            </label>
          </checkbox-group>
        </view>
        
        <view class="action-buttons">
          <button 
            class="submit-btn" 
            :class="{ disabled: !canSubmit }" 
            :disabled="!canSubmit"
            @click="createCallOrder1"
          >
            <text v-if="!isLoading">立即支付 ¥{{ calculatePrice(selectedDuration) }}</text>
            <text v-else>处理中...</text>
          </button>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue';
import { createCallOrder } from '@/pages/call/callService';
import { wxPay } from '@/utils/pay';
import { getUserInfo } from '@/utils/userManager';

const props = defineProps({
  lawyerInfo: {
    type: Object,
    required: true,
    default: () => ({
      id: '',
      name: '',
      title: '',
      avatar: '',
      phone: '',
      fee: 10, // 默认每分钟10元
    })
  }
});

const emit = defineEmits(['success', 'fail']);

// 引用弹窗
const popup = ref(null);

// 选择的咨询时长（分钟）
const selectedDuration = ref(15);
const isLoading = ref(false);
const agreed = ref(false);

// 判断是否可以提交
const canSubmit = computed(() => {
  return agreed.value && selectedDuration.value > 0 && !isLoading.value;
});

// 咨询时长选项
const durationOptions = [
  { value: 15, text: '15分钟' },
  { value: 30, text: '30分钟' },
  { value: 60, text: '1小时' },
];

// 处理电话咨询按钮点击
function handleCallConsultation() {
  popup.value.open();
}

// 关闭弹窗
function closePopup() {
  popup.value.close();
}

// 选择咨询时长
function selectDuration(duration) {
  selectedDuration.value = duration;
}

// 同意协议变更
function toggleAgreement(e) {
  agreed.value = e.detail.value.length > 0;
}

// 查看协议
function viewAgreement() {
  uni.navigateTo({
    url: '/pages/agreement/service'
  });
}

// 计算价格
function calculatePrice(duration) {
  const price = (props.lawyerInfo.fee || 10) * duration;
  return price.toFixed(2);
}

// 创建电话咨询订单
async function createCallOrder1() {
  if (!canSubmit.value) return;
  
  isLoading.value = true;
  
  // 获取用户信息
  const userInfo = await getUserInfo();
  
  if (!userInfo) {
    uni.showToast({
      title: '请先登录',
      icon: 'none'
    });
    isLoading.value = false;
    return;
  }
  
  try {
    // 创建订单
    const orderParams = {
      userId: userInfo.id || '',
      userName: userInfo.name || userInfo.nickname || '用户',
      userPhone: userInfo.phone || '',
      lawyerId: props.lawyerInfo.id || '',
      lawyerName: props.lawyerInfo.name || '',
      lawyerAvatar: props.lawyerInfo.avatar || '',
      lawyerTitle: props.lawyerInfo.title || '',
      lawyerPhone: props.lawyerInfo.phone || '',
      fee: props.lawyerInfo.fee || 10,
      duration: selectedDuration.value
    };
    
    // 创建电话咨询订单
    const order = createCallOrder(orderParams);
    
    // 关闭弹窗
    closePopup();
    
    if (order) {
      // 发起支付
      wxPay({
        orderId: order.orderId,
        totalFee: calculatePrice(selectedDuration.value),
        description: `电话咨询-${props.lawyerInfo.name}`,
        success: (res) => {
          // 支付成功，跳转到通话页面
          uni.navigateTo({
            url: `/pages/call/callpage?orderId=${order.orderId}`
          });
          
          // 触发成功事件
          emit('success', {
            orderId: order.orderId,
            order
          });
        },
        fail: (err) => {
          console.error('支付失败', err);
          
          // 触发失败事件
          emit('fail', {
            errMsg: err.errMsg || '支付失败',
            order
          });
          
          uni.showToast({
            title: err.errMsg || '支付失败',
            icon: 'none'
          });
        }
      });
    } else {
      uni.showToast({
        title: '创建订单失败',
        icon: 'none'
      });
      
      emit('fail', {
        errMsg: '创建订单失败'
      });
    }
  } catch (error) {
    console.error('创建订单错误', error);
    uni.showToast({
      title: '创建订单错误',
      icon: 'none'
    });
    
    emit('fail', {
      errMsg: '创建订单错误',
      error
    });
  } finally {
    isLoading.value = false;
  }
}
</script>


<style lang="scss">
.call-consultation {
  width: 100%;
  
  /* 调整主按钮尺寸 */
  .call-btn {
    height: 72rpx !important;
    line-height: 72rpx !important;
    font-size: 26rpx !important;
    border-radius: 36rpx !important;
  }
}

.popup-content {
  max-height: 70vh; /* 限制最大高度 */
  overflow-y: auto;  /* 允许滚动 */
  padding-bottom: calc(env(safe-area-inset-bottom) + 20rpx);
  
  /* 弹窗头部优化 */
  .popup-header {
    padding: 20rpx 24rpx;
    .title {
      font-size: 28rpx !important;
    }
  }

  /* 律师信息紧凑布局 */
  .lawyer-info {
    padding: 20rpx 24rpx;
    .avatar {
      width: 80rpx !important;
      height: 80rpx !important;
    }
    .name {
      font-size: 28rpx !important;
    }
    .title {
      font-size: 22rpx !important;
    }
  }

  /* 时长选择优化 */
  .duration-select {
    padding: 20rpx 24rpx;
    .label {
      font-size: 26rpx !important;
      margin-bottom: 16rpx;
    }
    .duration-item {
      height: 100rpx !important;
      margin-bottom: 16rpx;
      .duration-text {
        font-size: 26rpx !important;
      }
      .duration-price {
        font-size: 22rpx !important;
      }
    }
  }

  /* 备注信息紧凑 */
  .notes {
    padding: 0 24rpx 20rpx;
    .note-item text {
      font-size: 22rpx !important;
    }
  }

  /* 协议条款调整 */
  .agreement {
    padding: 0 24rpx 20rpx;
    .checkbox-label {
      font-size: 22rpx !important;
    }
  }

  /* 操作按钮优化 */
  .action-buttons {
    padding: 0 24rpx 24rpx;
    .submit-btn {
      height: 80rpx !important;
      line-height: 80rpx !important;
      font-size: 28rpx !important;
    }
  }
}

/* 通用间距缩减 */
[class*="-select"], 
[class*="-info"], 
.notes,
.agreement {
  border-bottom: none !important;
  margin-bottom: 0 !important;
  padding-bottom: 16rpx !important;
}
</style>