<template>
  <PageLayout>
    <view class="container">
      <!-- 律师信息区 -->
      <view class="lawyer-header">
        <view class="lawyer-info">
          <!-- 修改头像功能 -->
          <view class="avatar-container" @click="showAvatarOptions">
            <image class="avatar" :src="lawyerInfo.avatar || '/static/default-avatar.png'" mode="aspectFill"/>
            <view v-if="isAvatarLoading" class="avatar-loading">
              <uni-icons type="spinner-cycle" size="24" color="#ffffff"></uni-icons>
            </view>
          </view>
          <view class="lawyer-meta">
            <view class="username">{{ lawyerInfo.lawyerName || '律师姓名' }}</view>
            <view class="license">执业证号：{{ lawyerInfo.lawyerLicenseNumber || '未设置' }}</view>
            <view class="lawyer-tag">认证律师</view>
          </view>
        </view>

        <!-- 律师资质卡片 -->
        <view class="qualification-card">
          <view class="card-header">
            <text class="card-title">律师资质</text>
            <view class="decorative-line"></view>
          </view>
          <view class="qualification-content">
            <text class="info-item">所属律所：{{ lawyerInfo.lawFirm || '未设置' }}</text>
            <text class="info-item">执业年限：{{ lawyerInfo.workYears || '0' }}年</text>
            <text class="info-item">擅长领域：{{ lawyerInfo.specialtyNames || '未设置' }}</text>
          </view>
        </view>
      </view>

      <!-- 律师简介卡片 -->
      <view class="intro-card">
        <view class="card-header">
          <text class="card-title">个人简介</text>
          <view class="decorative-line"></view>
        </view>
        <text class="content-text">{{ lawyerInfo.lawyerIntroduction || '暂无个人简介' }}</text>
      </view>

      <!-- 功能列表 -->
      <view class="func-list">
        <view class="func-item" @click="modifyLawyerInfo">
          <text class="func-icon">✏️</text>
          <text class="func-text">修改信息</text>
          <text class="arrow">›</text>
        </view>
        <view class="func-item" @click="viewOrderHistory">
          <text class="func-icon">📋</text>
          <text class="func-text">咨询记录</text>
          <text class="arrow">›</text>
        </view>
        <view class="func-item" @click="toPage('/pages/feedback/index')">
          <text class="func-icon">📧</text>
          <text class="func-text">意见反馈</text>
          <text class="arrow">›</text>
        </view>
      </view>
    </view>

    <!-- 头像操作弹窗 -->
    <uni-popup ref="avatarPopup" type="bottom">
      <view class="popup-content">
        <view class="popup-title">修改头像</view>
        <view class="popup-item" @click="chooseImage('album')">
          <text class="popup-icon">🖼️</text>
          <text class="popup-text">从相册选择</text>
        </view>
        <view class="popup-item" @click="chooseImage('camera')">
          <text class="popup-icon">📷</text>
          <text class="popup-text">拍照</text>
        </view>
        <view class="popup-item cancel" @click="closeAvatarPopup">取消</view>
      </view>
    </uni-popup>
  </PageLayout>
</template>

<script setup >
import { onMounted, reactive, ref } from "vue";
import { navigateTo, navigateToUrl } from "@/utils/navigateTo";
import {apiGetLawyerById } from "@/api/lawyerapi";
import { apiUploadLawyerAvatar } from "@/api/imageapi";
import PageLayout from "@/components/page-layout/tabbarlayout.vue";
import { cacheManager } from "@/utils/store";

// 头像弹窗引用
const avatarPopup = ref(null);
// 头像加载状态
const isAvatarLoading = ref(false);

// 响应式数据
const lawyerInfo = reactive({
  userId:  '',
  lawyerId: '',
  avatar: '',
  lawyerName: '',
  lawyerLicenseNumber: '',
  lawFirm: '',
  workYears: '',
  specialtyNames: '',
  lawyerIntroduction: '',
  lawyerDetails: ''
});

// 生命周期
onMounted(async () => {
  await initLawyerInfo();
});

// 初始化律师信息
async function initLawyerInfo() {
  // 获取缓存中当前登录用户的id
  const userId = uni.getStorageSync('current_user_id');
  // 设置为用户前缀 获取该用户的缓存信息
  cacheManager.setUserPrefix(userId)
  const cachedInfo = cacheManager.getCache('userInfo');
  if (cachedInfo && cachedInfo.userId) {
    // 使用用户ID作为律师ID获取律师信息
    await fetchLawyerDetails();
    // 这是当前登录用户的id 使用此id上传图片
    lawyerInfo.userId = cachedInfo.userId;
  } else {
    console.error("未找到律师信息，无法获取律师详情");
    uni.showToast({
      title: '请先登录',
      icon: 'none',
      duration: 2000
    });
  }
}

// 获取律师详细信息
async function fetchLawyerDetails() {
  try {
    uni.showLoading({ title: '加载中...' });
    const response = await apiGetLawyerById("1");

    // 合并对象
    Object.assign(lawyerInfo, response);
    lawyerInfo.lawyerId = response.id;

    // 处理头像数据
    if (response.imageData && response.imageType) {
      const imageType = response.imageType === 'image/jpg' ? 'image/jpeg' : response.imageType;
      lawyerInfo.avatar = `data:${imageType};base64,${response.imageData}`;
      console.log("律师个人用户头像加载完成");
    }

    console.log("律师信息加载完成", lawyerInfo);
    uni.hideLoading();
  } catch (error) {
    console.error("获取律师信息失败:", error);
    uni.hideLoading();
    uni.showToast({
      title: '获取律师信息失败',
      icon: 'none',
      duration: 2000
    });
  }
}

// 页面跳转方法
function toPage(url) {
  navigateToUrl(url);
}

// 修改律师信息
function modifyLawyerInfo() {
  navigateTo({
    url: "/pages/lawyer/modifylawyerinfo",
    params: { lawyerid: lawyerInfo.lawyerid }
  });
}

// 查看订单历史
function viewOrderHistory() {
  navigateToUrl("/pages/order/orderlist");
}

// 显示头像操作弹窗
function showAvatarOptions() {
  avatarPopup.value.open('bottom');
}

// 关闭头像操作弹窗
function closeAvatarPopup() {
  avatarPopup.value.close();
}

// 选择图片
function chooseImage(sourceType) {
  closeAvatarPopup();
  // 确保已获取律师ID
  if (!lawyerInfo.userId) {
    uni.showToast({
      title: '用户信息错误，请重新登录',
      icon: 'none'
    });
    return;
  }
  
  const source = sourceType === 'camera' ? ['camera'] : ['album'];

  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: source,
    success: async (res) => {
      try {
        // 增加文件类型和大小验证
        const file = res.tempFiles[0];
        if (!file.type.startsWith('image/')) {
          throw new Error('请选择图片文件');
        }
        if (file.size > 4 * 1024 * 1024) { // 4MB限制
          throw new Error('图片大小不能超过4MB');
        }

        await uploadAvatar(lawyerInfo.userId, res.tempFilePaths[0]);
      } catch (error) {
        handleUploadError(error);
      }
    },
    fail: handleUploadError
  });
}

// 上传方法
async function uploadAvatar(userId, filePath) {
  try {
    isAvatarLoading.value = true;
    uni.showLoading({ title: '上传中...', mask: true });

    console.log('开始上传律师头像:', filePath);

    // 这里调用接口上传头像文件 - 需要更换为对应的律师头像上传API
    let uploadResult = await apiUploadLawyerAvatar('/image/uploadAvatar', filePath, userId);

    if (uploadResult.code !== 200) {
      throw new Error(uploadResult.message || '上传失败，请重试');
    }

    // 处理返回的图片数据
    if (uploadResult.data && uploadResult.data.imageData) {
      const imageType = uploadResult.data.type === 'image/jpg' ? 'image/jpeg' : uploadResult.data.type;
      lawyerInfo.avatar = `data:${imageType};base64,${uploadResult.data.imageData}`;
    }

    uni.showToast({ title: '头像更新成功', icon: 'success' });
  } catch (error) {
    handleUploadError(error);
  } finally {
    isAvatarLoading.value = false;
    uni.hideLoading();
  }
}

// 统一错误处理
function handleUploadError(error) {
  console.error('上传失败:', error);
  uni.showToast({
    title: error.message || '操作失败',
    icon: 'none',
    duration: 3000
  });
}
</script>

<style lang="scss" scoped>
/* 基础容器 */
.container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f8fafb;
  padding: 24rpx;
}

/* 律师信息区 */
.lawyer-header {
  background: linear-gradient(135deg, #f0f7ff 0%, #e6f0fa 100%);
  padding: 32rpx;
  border-radius: 24rpx;
  margin-bottom: 24rpx;

  .lawyer-info {
    display: flex;
    align-items: center;
    margin-bottom: 32rpx;

    .avatar-container {
      position: relative;
      margin-right: 24rpx;

      .avatar {
        width: 128rpx;
        height: 128rpx;
        border-radius: 50%;
        border: 2rpx solid rgba(255, 255, 255, 0.8);
        box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
      }
    }

    .lawyer-meta {
      .username {
        color: #2d3436;
        font-size: 36rpx;
        font-weight: 600;
        line-height: 1.4;
      }

      .license {
        color: #666;
        font-size: 26rpx;
        margin: 8rpx 0;
        display: flex;
        align-items: center;

        &::before {
          content: "🆔 ";
          margin-right: 8rpx;
        }
      }

      .lawyer-tag {
        display: inline-block;
        padding: 6rpx 20rpx;
        border-radius: 32rpx;
        font-size: 24rpx;
        margin-top: 12rpx;
        background: rgba(52, 152, 219, 0.1);
        color: #3498db;
      }
    }
  }
}

/* 卡片通用样式 */
.qualification-card, .intro-card {
  background: #fff;
  border-radius: 20rpx;
  padding: 24rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);

  .card-header {
    margin-bottom: 24rpx;

    .card-title {
      color: #2c3e50;
      font-size: 32rpx;
      font-weight: 600;
    }

    .decorative-line {
      width: 48rpx;
      height: 4rpx;
      background: #3498db;
      margin-top: 12rpx;
    }
  }
}

/* 律师资质卡片 */
.qualification-card {
  .qualification-content {
    .info-item {
      display: block;
      font-size: 28rpx;
      color: #555;
      padding: 12rpx 0;
      border-bottom: 1rpx solid #f0f0f0;
      
      &:last-child {
        border-bottom: none;
      }
    }
  }
}

/* 简介卡片 */
.intro-card {
  .content-text {
    font-size: 28rpx;
    color: #555;
    line-height: 1.6;
  }
}

/* 功能列表 */
.func-list {
  background: #fff;
  border-radius: 20rpx;
  margin-bottom: 24rpx;

  .func-item {
    padding: 28rpx 32rpx;
    display: flex;
    align-items: center;
    border-bottom: 1rpx solid #f0f0f0;
    transition: background 0.2s;

    &:last-child {
      border-bottom: none;
    }

    .func-icon {
      font-size: 40rpx;
      margin-right: 24rpx;
      min-width: 40rpx;
    }

    .func-text {
      flex: 1;
      color: #444;
      font-size: 30rpx;
    }

    .arrow {
      color: #999;
      font-size: 40rpx;
    }

    &:active {
      background: #f8f9ff;
    }
  }
}

/* 头像弹窗样式 */
.popup-content {
  padding: 24rpx;
  background: #fff;
  border-radius: 24rpx 24rpx 0 0;
}

.popup-title {
  text-align: center;
  font-size: 32rpx;
  font-weight: 600;
  color: #2c3e50;
  padding: 16rpx 0 32rpx;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 80rpx;
    height: 4rpx;
    background: #f0f4ff;
    border-radius: 2rpx;
  }
}

.popup-item {
  display: flex;
  align-items: center;
  padding: 28rpx 16rpx;
  border-bottom: 1rpx solid #f0f0f0;

  .popup-icon {
    font-size: 36rpx;
    margin-right: 20rpx;
  }

  .popup-text {
    color: #2c3e50;
    font-size: 30rpx;
  }

  &.cancel {
    margin-top: 24rpx;
    border: none;
    justify-content: center;
    color: #999;
    font-size: 30rpx;
  }

  &:active {
    background: #f8f9ff;
  }
}

/* 加载样式 */
.avatar-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 优化头像过渡效果 */
.avatar {
  transition: opacity 0.3s ease;
}

.avatar[src] {
  opacity: 1;
}

.avatar:not([src]) {
  opacity: 0.5;
}
</style>
