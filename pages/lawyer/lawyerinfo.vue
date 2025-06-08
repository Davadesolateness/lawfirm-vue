<template>
  <PageLayout>
    <view class="container">
      <!-- 律师信息头部 -->
      <view class="profile-header">
        <view class="user-info">
          <image class="avatar" :src="lawyerInfo.avatar || '/static/default-avatar.png'" mode="aspectFill"/>
          <view class="user-meta">
            <text class="username">{{ lawyerInfo.lawyername }}</text>
            <view class="verify-tag">
              <uni-icons type="verified" size="16" color="#fff"></uni-icons>
              律师认证
            </view>
          </view>
        </view>
        <view class="meta-info">
          <text class="license">执业证号：{{ lawyerInfo.lawyerlicensenumber }}</text>
          <text class="location">{{ lawyerInfo.address }}</text>
        </view>
      </view>

      <!-- 服务类型 -->
      <view class="service-card">
        <view class="card-header">
          <text class="card-title">电话咨询服务</text>
          <view class="decorative-line"></view>
        </view>
        <view class="price-section">
          <text class="price">¥{{ basePrice }}</text>
          <text class="duration">/30分钟</text>
        </view>
        <text class="service-desc">专业领域律师1v1服务，快速解决法律问题</text>

        <view class="guarantee-tags">
          <view v-for="(tag,index) in guaranteeTags" :key="index" class="tag-item">
            <uni-icons type="checkmark" size="14" color="#6B5BFF"></uni-icons>
            <text class="tag-text">{{ tag }}</text>
          </view>
        </view>
      </view>

      <!-- 律师简介 -->
      <view class="info-card">
        <view class="card-header">
          <text class="card-title">律师简介</text>
          <view class="decorative-line"></view>
        </view>
        <text class="content-text">
          {{ lawyerInfo.introduction || '该律师暂未填写个人简介' }}
        </text>
      </view>

      <!-- 在线咨询按钮 -->
      <view class="action-container">
        <button class="action-btn call-btn" @click="handleCallConsult">
          电话咨询
        </button>
        <button class="action-btn contact-btn" @click="handleContact">在线咨询</button>
      </view>
    </view>
  </PageLayout>
</template>

<script setup>
import {ref, computed, onMounted} from "vue"
import {onShow, onLoad} from "@dcloudio/uni-app"
import PageLayout from "@/components/custom/tabbarlayout"
import {apiGetLawyerById} from "@/api/lawyerapi"
import {callService} from "@/utils/call/call"
import {apiGetUserDiscountInfo} from "@/api/orderapi"
import {apiGetUserInfo} from "@/api/userapi"
import {cacheManager} from "@/utils/store"

const basePrice = 38 // 基础价格
const lawyerInfo = ref({})
const lawyerId = ref('') // 存储律师ID

// 用户优惠信息
const userDiscountInfo = ref(null)

// 保障标签
const guaranteeTags = ['隐私保护', '平台认证', '服务保障', '不满意可退款']

const isCalling = ref(false); // 通话状态
const startTime = ref(0); // 通话开始时间
let startDate= null; // 通话开始日期
const callDuration = ref(0); // 通话时长（秒）
const timer = ref(null); // 计时器
const callRecords = ref([]); // 通话记录

onMounted(() => {
  // 获取用户优惠信息
  loadUserDiscountInfo()
  // 监听应用回到前台
  uni.onAppShow(handleAppShow);
})

// 获取用户优惠信息
const loadUserDiscountInfo = async () => {
  try {
    const userInfo = cacheManager.getCache('userInfo');
    if (userInfo && userInfo.id) {
      userDiscountInfo.value = await apiGetUserDiscountInfo(userInfo.id)
    }
  } catch (error) {
    console.error('获取用户优惠信息失败:', error)
  }
}

// 初始化律师信息
const initLawyerInfo = async () => {
  if (!lawyerId.value) {
    uni.showToast({title: '律师ID不能为空', icon: 'none'})
    return
  }

  try {
    uni.showLoading({title: '加载中...'})
    const data = await apiGetLawyerById(lawyerId.value)

    if (data) {
      // 处理头像数据
      let avatarUrl = '/static/default-avatar.png'
      if (data.imageData && data.imageType) {
        const imageType = data.imageType === 'image/jpg' ? 'image/jpeg' : data.imageType
        avatarUrl = `data:${imageType};base64,${data.imageData}`
      }

      lawyerInfo.value = {
        ...data,
        id: data.id || lawyerId.value,
        avatar: avatarUrl,
        lawyername: data.lawyerName || '未知律师',
        lawyerlicensenumber: data.lawyerLicenseNumber || '暂无',
        address: data.address || '暂无地址信息',
        introduction: data.lawyerIntroduction || '该律师暂未填写个人简介',
        phone: data.phone || '', // 添加电话号码
        fee: basePrice // 使用基础价格
      }
    } else {
      uni.showToast({title: '律师信息不存在', icon: 'none'})
    }
  } catch (error) {
    console.error('获取律师信息失败:', error)
    uni.showToast({title: '信息加载失败', icon: 'none'})
  } finally {
    uni.hideLoading()
  }
}

// 页面加载时获取参数
onLoad((options) => {
  console.log('页面参数:', options)
  if (options.lawyerId) {
    lawyerId.value = options.lawyerId
    initLawyerInfo()
  } else {
    uni.showToast({title: '缺少律师ID参数', icon: 'none'})
  }
})

// 处理电话咨询
const handleCallConsult = async () => {
  isCalling.value = false;
  // 检查律师信息完整性
  if (!lawyerInfo.value.phone) {
    uni.showToast({title: '律师联系方式不可用', icon: 'none'})
    return
  }

  // 直接发起通话，使用默认30分钟时长
  try {
    uni.showLoading({title: '发起通话中...'})

    // 使用新的通话服务，默认30分钟
    const result = await callService.startCall({
      lawyerInfo: lawyerInfo.value,
      expectedDuration: 30 // 默认30分钟
    })

    debugger
    if (result.success) {
      // 设置开始时间
      startDate = new Date();
      startTime.value = Date.now(); // 记录通话开始时间（毫秒）

      // 启动计时器，每秒更新一次通话时长
      timer.value = setInterval(() => {
        callDuration.value = Math.floor((Date.now() - startTime.value) / 1000); // 按秒计时
      }, 1000);

      uni.showToast({title: '通话已发起，系统自动计时', icon: 'success'})
    }
    isCalling.value = true;
  } catch (error) {
    console.error('发起通话失败:', error)
    uni.showToast({title: error.message || '通话发起失败', icon: 'none'})
  } finally {
    uni.hideLoading()
  }
}

// 处理应用返回前台事件
const handleAppShow = () => {
  if (isCalling.value) {
    // 结束通话
    endCall();
  }
};

// 结束通话
const endCall = () => {
  clearInterval(timer.value);
  isCalling.value = false;

  // 计算最终时长
  const duration = callDuration.value;

  callService._autoEndCall(duration,startDate)

  // 重置状态
  callDuration.value = 0;
};

// 处理在线咨询
const handleContact = () => {
  uni.showToast({title: '功能即将上线，敬请期待', icon: 'none'})
}
</script>

<style lang="scss">
.container {
  background: #f8fafd;
  padding: 24rpx 24rpx 160rpx;
}

.profile-header {
  background: linear-gradient(135deg, #6B5BFF, #857AFF);
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 24rpx;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 40rpx;
    background: rgba(255, 255, 255, 0.1);
  }

  .user-info {
    display: flex;
    align-items: center;
    margin-bottom: 32rpx;

    .avatar {
      width: 96rpx;
      height: 96rpx;
      border-radius: 50%;
      border: 2rpx solid rgba(255, 255, 255, 0.3);
      margin-right: 24rpx;
    }

    .user-meta {
      .username {
        color: #fff;
        font-size: 36rpx;
        font-weight: 600;
        line-height: 1.4;
      }

      .verify-tag {
        display: inline-flex;
        align-items: center;
        padding: 8rpx 16rpx;
        background: rgba(255, 255, 255, 0.15);
        border-radius: 32rpx;
        color: #fff;
        font-size: 24rpx;
        margin-top: 8rpx;
      }
    }
  }

  .meta-info {
    border-top: 1rpx solid rgba(255, 255, 255, 0.15);
    padding-top: 24rpx;

    .license, .location {
      display: block;
      color: rgba(255, 255, 255, 0.85);
      font-size: 26rpx;
      line-height: 1.6;
    }
  }
}

.service-card, .info-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.04);

  .card-header {
    margin-bottom: 24rpx;

    .card-title {
      font-size: 32rpx;
      font-weight: 600;
      color: #1a1a1a;
    }

    .decorative-line {
      width: 64rpx;
      height: 6rpx;
      background: #6B5BFF;
      border-radius: 3rpx;
      margin-top: 12rpx;
    }
  }
}

.service-card {
  .price-section {
    display: flex;
    align-items: baseline;
    margin-bottom: 20rpx;

    .price {
      color: #FF5252;
      font-size: 40rpx;
      font-weight: 700;
      margin-right: 12rpx;
    }

    .duration {
      color: #666;
      font-size: 26rpx;
    }
  }

  .service-desc {
    color: #666;
    font-size: 26rpx;
    line-height: 1.6;
    margin-bottom: 24rpx;
  }

  .guarantee-tags {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12rpx;

    .tag-item {
      display: flex;
      align-items: center;
      padding: 16rpx;
      background: #F8F9FF;
      border-radius: 12rpx;

      .tag-text {
        color: #444;
        font-size: 24rpx;
        margin-left: 8rpx;
      }
    }
  }
}

.info-card {
  .content-text {
    color: #666;
    font-size: 26rpx;
    line-height: 1.8;
  }
}

/* 操作按钮容器 */
.action-container {
  display: flex;
  gap: 16rpx;
  margin: 32rpx 0;
  padding: 0 24rpx;

  .action-btn {
    flex: 1;
    height: 80rpx;
    line-height: 80rpx;
    font-size: 28rpx;
    border-radius: 40rpx;
    text-align: center;
    transition: all 0.2s;

    &.call-btn {
      background: linear-gradient(135deg, #6B5BFF, #857AFF);
      color: #fff;
      border: none;
    }

    &.contact-btn {
      background: #fff;
      color: #6B5BFF;
      border: 1rpx solid #6B5BFF;
    }

    &:active {
      opacity: 0.9;
    }
  }
}
</style>