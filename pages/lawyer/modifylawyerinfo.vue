<template>
  <view class="container">
    <view class="page-title">
      <text>修改律师信息</text>
    </view>

    <!-- 基本信息卡片 -->
    <view class="form-card">
      <text class="form-title">基本信息</text>
      <view class="form-item">
        <text class="label">姓名</text>
        <input class="input" placeholder="请输入姓名" v-model="lawyerInfo.lawyerName"/>
      </view>
      <view class="form-item">
        <text class="label">执业证号</text>
        <input class="input" placeholder="请输入执业证号" v-model="lawyerInfo.lawyerLicenseNumber"/>
      </view>
      <view class="form-item">
        <text class="label">所属律所</text>
        <input class="input" placeholder="请输入所属律所" v-model="lawyerInfo.lawFirm"/>
      </view>
      <view class="form-item">
        <text class="label">执业年限</text>
        <input class="input" type="number" placeholder="请输入执业年限" v-model="lawyerInfo.workYears"/>
      </view>
    </view>

    <!-- 服务设置卡片 -->
    <view class="form-card">
      <text class="form-title">服务设置</text>
      <view class="form-item price-item">
        <text class="label">咨询价格</text>
        <view class="price-group">
          <text class="currency">￥</text>
          <input class="price-input" type="number" v-model="lawyerInfo.price"/>
          <text class="unit">/30分钟</text>
        </view>
        <text class="tip">设置合理的价格可提高咨询量</text>
      </view>
      <view class="form-item">
        <text class="label">擅长领域</text>
        <textarea class="textarea" placeholder="请用逗号分隔专业领域（例如：劳动纠纷, 刑事辩护）"
                  v-model="lawyerInfo.specialtyNames"/>
      </view>
    </view>

    <!-- 详细信息卡片 -->
    <view class="form-card">
      <text class="form-title">详细信息</text>
      <view class="form-item">
        <text class="label">个人简介</text>
        <textarea class="textarea" placeholder="请输入个人简介（建议200字以内）" v-model="lawyerInfo.lawyerIntroduction"
                  maxlength="200"/>
      </view>
      <view class="form-item">
        <text class="label">详细描述</text>
        <textarea class="textarea" placeholder="请输入详细描述（如执业经历、案例等）" v-model="lawyerInfo.lawyerDetails"
                  maxlength="500"/>
      </view>
    </view>

    <!-- 提交按钮 -->
    <view class="submit-btn" @click="handleSubmit">
      <text>保存修改</text>
    </view>
  </view>
</template>

<script setup>
import {reactive, onMounted} from 'vue';
import {onLoad} from "@dcloudio/uni-app";
import {apiGetLawyerById, apiUpdateLawyerInfo} from '@/api/lawyerapi';

// 律师信息
const lawyerInfo = reactive({
  userId: '',
  lawyerId: '',
  avatar: '',
  lawyerName: '',
  lawyerLicenseNumber: '',
  lawFirm: '',
  workYears: '',
  specialtyNames: '',
  lawyerIntroduction: '',
  lawyerDetails: '',
  price: '38'
});

// 生命周期
onMounted(() => {
  // 防止页面加载不执行 onLoad
  if (!lawyerInfo.userId) {
    initLawyerInfo();
  }
});

// 页面加载
onLoad((options) => {
  if (options && options.lawyerId) {
    lawyerInfo.lawyerId = options.lawyerId;
  }
  initLawyerInfo();
});

// 初始化律师信息
async function initLawyerInfo() {
  try {
    uni.showLoading({title: '加载中...'});

    // 获取缓存中当前登录用户信息
    const userId = uni.getStorageSync('current_user_id');
    if (!userId) {
      throw new Error('用户未登录');
    }

    // 获取律师详情
    const response = await apiGetLawyerById(lawyerInfo.lawyerId || "1");

    // 合并对象
    Object.assign(lawyerInfo, response);
    lawyerInfo.userId = userId;

    // 处理头像数据
    if (response.imageData && response.imageType) {
      const imageType = response.imageType === 'image/jpg' ? 'image/jpeg' : response.imageType;
      lawyerInfo.avatar = `data:${imageType};base64,${response.imageData}`;
    }

    uni.hideLoading();
  } catch (error) {
    uni.hideLoading();
    uni.showToast({
      title: '获取律师信息失败',
      icon: 'none',
      duration: 2000
    });
    console.error('获取律师信息失败:', error);
  }
}

// 提交表单
async function handleSubmit() {
  try {
    // 表单验证
    if (!lawyerInfo.lawyerName) {
      throw new Error('请输入姓名');
    }
    if (!lawyerInfo.lawyerLicenseNumber) {
      throw new Error('请输入执业证号');
    }
    if (!lawyerInfo.lawFirm) {
      throw new Error('请输入所属律所');
    }

    uni.showLoading({title: '保存中...'});
    debugger
    // 调用更新接口
    await apiUpdateLawyerInfo(lawyerInfo);

    uni.hideLoading();
    uni.showToast({
      title: '修改成功',
      icon: 'success',
      duration: 2000
    });

    // 延迟返回上一页
    setTimeout(() => {
      uni.navigateBack();
    }, 1500);
  } catch (error) {
    uni.hideLoading();
    uni.showToast({
      title: error instanceof Error ? error.message : '保存失败，请重试',
      icon: 'none',
      duration: 2000
    });
    console.error('保存律师信息失败:', error);
  }
}
</script>

<style scoped lang="scss">
.container {
  background: #f8fafd;
  min-height: 100vh;
  padding: 32rpx;
}

.page-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 32rpx;
  text-align: center;
}

.form-card {
  background: white;
  border-radius: 24rpx;
  padding: 32rpx;
  margin-bottom: 32rpx;
  box-shadow: 0 8rpx 24rpx rgba(0, 90, 173, 0.06);

  .form-title {
    display: block;
    font-size: 36rpx;
    color: #1a237e;
    font-weight: 600;
    padding-bottom: 24rpx;
    margin-bottom: 32rpx;
    border-bottom: 2rpx solid #f0f4f8;
  }
}

.form-item {
  margin-bottom: 32rpx;

  .label {
    display: block;
    font-size: 28rpx;
    color: #616161;
    margin-bottom: 16rpx;
    font-weight: 500;
  }

  .input {
    height: 88rpx;
    width: 100%;
    padding: 0 24rpx;
    background: #f8fafd;
    border-radius: 16rpx;
    font-size: 28rpx;
    color: #1a237e;
    border: 2rpx solid #e0e7f1;
    transition: all 0.2s;

    &:focus {
      border-color: #2196F3;
      background: white;
    }
  }

  .textarea {
    height: 200rpx;
    width: 100%;
    padding: 24rpx;
    background: #f8fafd;
    border-radius: 16rpx;
    font-size: 28rpx;
    color: #1a237e;
    border: 2rpx solid #e0e7f1;
    line-height: 1.6;
  }
}

.price-item {
  .price-group {
    display: flex;
    align-items: center;
    margin-bottom: 16rpx;

    .price-input {
      width: 160rpx;
      height: 72rpx;
      margin: 0 16rpx;
      padding: 0 24rpx;
      background: #f8fafd;
      border-radius: 12rpx;
      text-align: center;
      font-weight: 600;
      color: #f44336;
      border: 2rpx solid #e0e7f1;
    }

    .currency {
      color: #757575;
      font-size: 28rpx;
    }

    .unit {
      color: #757575;
      font-size: 28rpx;
    }
  }

  .tip {
    color: #bdbdbd;
    font-size: 24rpx;
  }
}

.submit-btn {
  width: 400rpx;
  height: 88rpx;
  line-height: 88rpx;
  background: #4A67FF;
  color: white;
  text-align: center;
  border-radius: 12rpx;
  font-size: 30rpx;
  margin: 48rpx auto;
  transition: all 0.3s ease;
  box-shadow: 0 4rpx 12rpx rgba(74, 103, 255, 0.2);

  &:active {
    transform: translateY(2rpx);
    box-shadow: 0 2rpx 8rpx rgba(74, 103, 255, 0.2);
  }
}
</style>
