<template>
  <!-- 新增/修改律师信息页面 -->
  <view class="container">
    <!-- 基本信息卡片 -->
    <view class="form-card">
      <text class="form-title">律师基本信息</text>
      <view class="form-item">
        <text class="label">姓名</text>
        <input class="input" placeholder="请输入律师姓名" v-model="formData.name"/>
      </view>
      <view class="form-item">
        <text class="label">执业证号</text>
        <input class="input" placeholder="请输入执业证号" v-model="formData.license"/>
      </view>
      <view class="form-item">
        <text class="label">所在地区</text>
        <picker class="picker" mode="region" @change="bindRegionChange">
          <view class="picker-content">{{ formData.region || '请选择地区' }}</view>
        </picker>
      </view>
    </view>

    <!-- 服务信息卡片 -->
    <view class="form-card">
      <text class="form-title">服务信息设置</text>
      <view class="form-item">
        <text class="label">服务类型</text>
        <input class="input" placeholder="例如：电话咨询" v-model="formData.serviceType"/>
      </view>
      <view class="form-item price-item">
        <view class="price-group">
          <text class="label">服务价格</text>
          <input class="price-input" type="number" placeholder="0" v-model="formData.price"/>
          <text class="currency">元/30分钟</text>
        </view>
        <text class="tip">建议价格区间：30-100元/30分钟</text>
      </view>
    </view>

    <!-- 详细信息卡片 -->
    <view class="form-card">
      <text class="form-title">详细信息</text>
      <view class="form-item">
        <text class="label">专业领域</text>
        <textarea class="textarea" placeholder="请用逗号分隔专业领域（例如：劳动纠纷, 刑事辩护）"
                  v-model="formData.expertise"/>
      </view>
      <view class="form-item">
        <text class="label">个人简介</text>
        <textarea class="textarea" placeholder="请输入详细个人简介（建议200字以内）"
                  v-model="formData.introduction" maxlength="200"/>
      </view>
    </view>

    <!-- 提交按钮 -->
<!--    <view class="submit-btn" @click="handleSubmit">
      <view v-show="isEditMode.value">
        <text>保存修改</text>
      </view>
      <view v-show="!isEditMode.value">
        <text>提交信息</text>
      </view>
    </view>-->
    <view class="submit-btn" @click="handleSubmit">
      <text>{{ isEditMode ? '保存修改' : '提交信息' }}</text>
    </view>
  </view>
</template>


<script setup>
import {ref} from "vue"
import {onLoad,onShow} from "@dcloudio/uni-app";

let isEditMode = ref(false); // 根据路由参数判断是否编辑模式
let formData = {
  name: '',
  license: '',
  region: '',
  serviceType: '电话咨询',
  price: 38,
  expertise: '',
  introduction: ''
}

function bindRegionChange(e) {
  this.formData.region = e.detail.value.join(' ')
}

function handleSubmit() {
  // 提交逻辑
  uni.showToast({
    title: this.isEditMode ? '修改成功' : '新增成功',
    icon: 'success'
  })
}

// 加载时更改数据
onShow((data) => {
  isEditMode.value = data.isEditMode;
  console.log("----------" + isEditMode.value)
});
</script>

<style lang="scss" scoped>
.container {
  background: #f8fafd;
  min-height: 100vh;
  padding: 32rpx;
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
  margin-bottom: 48rpx;

  .label {
    display: block;
    font-size: 28rpx;
    color: #616161;
    margin-bottom: 16rpx;
    font-weight: 500;
  }

  .input, .picker-content {
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

  .picker-content {
    line-height: 88rpx;
    color: #1a237e;
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
  }

  .tip {
    color: #bdbdbd;
    font-size: 24rpx;
  }
}

.submit-btn {
  position: fixed;
  bottom: 64rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  height: 96rpx;
  background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
  border-radius: 64rpx;
  color: white;
  font-size: 32rpx;
  font-weight: 500;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 8rpx 24rpx rgba(33, 150, 243, 0.3);
  transition: all 0.2s;

  &:active {
    transform: translateX(-50%) scale(0.96);
    opacity: 0.9;
  }
}
</style>