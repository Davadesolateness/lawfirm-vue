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
            @click="createCallOrder"
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
async function createCallOrder() {
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
}

.call-btn {
  width: 100%;
  height: 80rpx;
  line-height: 80rpx;
  background: linear-gradient(135deg, #4A90E2, #2979FF);
  color: #fff;
  font-size: 28rpx;
  border-radius: 40rpx;
  text-align: center;
}

.popup-content {
  background-color: #fff;
  border-top-left-radius: 24rpx;
  border-top-right-radius: 24rpx;
  padding-bottom: env(safe-area-inset-bottom);
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #f1f1f1;
  
  .title {
    font-size: 32rpx;
    font-weight: 600;
    color: #333;
  }
  
  .close {
    padding: 10rpx;
  }
}

.lawyer-info {
  display: flex;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #f1f1f1;
  
  .avatar {
    width: 100rpx;
    height: 100rpx;
    border-radius: 50%;
    margin-right: 20rpx;
  }
  
  .info {
    flex: 1;
    
    .name {
      font-size: 32rpx;
      font-weight: 600;
      color: #333;
      margin-bottom: 6rpx;
    }
    
    .title {
      font-size: 24rpx;
      color: #666;
    }
  }
}

.duration-select {
  padding: 30rpx;
  
  .label {
    font-size: 28rpx;
    color: #333;
    margin-bottom: 20rpx;
    display: block;
  }
  
  .duration-options {
    display: flex;
    flex-wrap: wrap;
    margin: 0 -10rpx;
  }
  
  .duration-item {
    width: calc(33.33% - 20rpx);
    margin: 0 10rpx 20rpx;
    height: 120rpx;
    border-radius: 12rpx;
    border: 1rpx solid #e0e0e0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    
    &.active {
      border-color: #2979FF;
      background-color: rgba(41, 121, 255, 0.05);
    }
    
    .duration-text {
      font-size: 28rpx;
      color: #333;
      margin-bottom: 10rpx;
    }
    
    .duration-price {
      font-size: 24rpx;
      color: #ff6b00;
    }
  }
}

.notes {
  padding: 0 30rpx 30rpx;
  
  .note-item {
    display: flex;
    align-items: flex-start;
    margin-bottom: 12rpx;
    
    .uni-icons {
      margin-right: 8rpx;
      margin-top: 6rpx;
    }
    
    text {
      font-size: 24rpx;
      color: #999;
      flex: 1;
    }
  }
}

.agreement {
  padding: 0 30rpx 30rpx;
  
  .checkbox-label {
    display: flex;
    align-items: center;
    font-size: 24rpx;
    color: #666;
  }
  
  .link {
    color: #2979FF;
  }
}

.action-buttons {
  padding: 0 30rpx 30rpx;
  
  .submit-btn {
    width: 100%;
    height: 90rpx;
    line-height: 90rpx;
    background: linear-gradient(135deg, #4A90E2, #2979FF);
    color: #fff;
    font-size: 30rpx;
    border-radius: 45rpx;
    text-align: center;
    
    &.disabled {
      opacity: 0.6;
    }
  }
}
</style> 