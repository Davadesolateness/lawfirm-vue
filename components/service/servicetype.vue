<template>
  <!-- 服务类型 -->
  <view class="service-card">
    <view class="service-header">
      <text class="title">电话咨询</text>
      <text class="price">¥38
        <text class="duration">/30分钟</text>
      </text>
      <view class="lawyer-service-button">
        <text>电话咨询</text>
      </view>
    </view>
    <text class="service-desc">下单后直接拨号，1分钟快速接通律师</text>
    <view class="guarantee-tags">
      <view class="tag-item" v-for="(tag,index) in guarantees" :key="index">
        <uni-icons type="checkmark" size="16" color="#4CAF50"/>
        <text>{{ tag }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
const guarantees = [
  '平台全程保障',
  '严选真实律师',
  '1对1私密咨询',
  '未服务自动退款'
]

// 示例处理咨询逻辑
function handleConsult() {
  console.log('发起电话咨询');
}
</script>

<style>
.service-card {
  background: white;
  border-radius: 24rpx;
  padding: 32rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 90, 173, 0.08);

  .service-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 24rpx;

    .title {
      font-size: 36rpx;
      color: #1a237e;
      font-weight: 500;
    }

    .price {
      color: #f44336;
      font-size: 48rpx;
      font-weight: 700;

      .duration {
        font-size: 28rpx;
        color: #757575;
        margin-left: 8rpx;
      }
    }
  }

  .service-desc {
    color: #616161;
    font-size: 28rpx;
    margin-bottom: 32rpx;
    display: block;
  }

  .guarantee-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 16rpx;

    .tag-item {
      background: #f5faff;
      border-radius: 32rpx;
      padding: 12rpx 24rpx;
      display: flex;
      align-items: center;

      text {
        font-size: 22rpx;
        color: #2196F3;
        margin-left: 8rpx;
      }
    }
  }
}

.lawyer-service-button {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 96px;
  height: 30px;
  background: #349bff;
  border-radius: 24px 24px 24px 24px;
  font-size: 12px;
  color: #fff;
}
</style>
