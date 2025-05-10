<template>
  <PageLayout>
    <view class="container">
      <!-- 管理员信息区 -->
      <view class="admin-header">
        <view class="admin-info">
          <!-- 头像区域 -->
          <view class="avatar-container" @click="showAvatarOptions">
            <image class="avatar" :src="adminInfo.avatar || '/static/default-avatar.png'" mode="aspectFill"/>
            <view v-if="isAvatarLoading" class="avatar-loading">
              <uni-icons type="spinner-cycle" size="24" color="#ffffff"></uni-icons>
            </view>
          </view>
          <view class="admin-meta">
            <text class="username">{{ adminInfo.adminName || '管理员' }}</text>
            <view class="admin-tag">{{ getLevelText(adminInfo.adminLevel) }}</view>
          </view>
        </view>

        <!-- 管理员权限卡片 -->
        <view class="permission-card">
          <view class="card-header">
            <text class="card-title">管理权限</text>
            <view class="decorative-line"></view>
          </view>
          <view class="permission-content">
            <text class="info-item">管理级别：{{ getLevelText(adminInfo.adminLevel) }}</text>
            <text class="info-item">上次登录：{{ formatDate(adminInfo.lastLoginTime) }}</text>
          </view>
        </view>
      </view>

      <!-- 功能列表 -->
      <view class="func-list">
        <view class="func-item" @click="modifyAdminInfo">
          <text class="func-icon">✏️</text>
          <text class="func-text">修改信息</text>
          <text class="arrow">›</text>
        </view>
        <view class="func-item" @click="toPage('/pages/about/meichen')">
          <text class="func-icon">🏢</text>
          <text class="func-text">关于</text>
          <text class="arrow">›</text>
        </view>
        <view class="func-item" @click="logout">
          <text class="func-icon">🚪</text>
          <text class="func-text">退出登录</text>
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
import PageLayout from "@/components/page-layout/tabbarlayout.vue";
import { apiUploadAdminAvatar } from "@/api/imageapi";
import { apiGetAdminById } from "@/api/adminapi";
import { cacheManager } from "@/utils/store";

// 头像弹窗引用
const avatarPopup = ref(null);
// 头像加载状态
const isAvatarLoading = ref(false);

// 响应式数据
const adminInfo = reactive({
  adminId: '',
  avatar: '',
  adminName: '',
  adminLevel: 1, // 1: 普通管理员, 2: 高级管理员, 3: 超级管理员
  lastLoginTime: new Date()
});

// 生命周期
onMounted(async () => {
  await initAdminInfo();
});

// 初始化管理员信息
async function initAdminInfo() {
  try {
    // 获取缓存中的管理员ID
    const adminId = uni.getStorageSync('current_user_id');
    
    if (!adminId) {
      uni.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    debugger
    // 显示加载中提示
    uni.showLoading({ title: '加载中...' });
    const adminResponse = await apiGetAdminById(adminId);

   /* // 获取管理员详细信息
    const detailsResponse = await apiGetAdminDetails(adminId);
    
    // 获取管理员权限信息
    const permissionsResponse = await apiGetAdminPermissions(adminId);*/

    // 合并管理员信息
    Object.assign(adminInfo, detailsResponse.data, {
      adminLevel: permissionsResponse.data.level,
      lastLoginTime: detailsResponse.data.lastLoginTime || new Date()
    });

    // 处理头像数据
    if (detailsResponse.data.imageData && detailsResponse.data.imageType) {
      const imageType = detailsResponse.data.imageType === 'image/jpg' ? 'image/jpeg' : detailsResponse.data.imageType;
      adminInfo.avatar = `data:${imageType};base64,${detailsResponse.data.imageData}`;
    }

    // 存入缓存
    cacheManager.setCache('adminInfo', adminInfo);

    // 隐藏加载提示
    uni.hideLoading();
  } catch (error) {
    // 错误处理
    console.error("获取管理员信息失败:", error);
    uni.hideLoading();
    uni.showToast({
      title: '获取管理员信息失败',
      icon: 'none',
      duration: 2000
    });

    // 如果获取失败，使用默认数据
    Object.assign(adminInfo, {
      adminId: adminId,
      adminName: '系统管理员',
      adminLevel: 3,
      avatar: '/static/default-avatar.png',
      lastLoginTime: new Date()
    });
  }
}

// 获取管理员级别文本
function getLevelText(level) {
  const levels = {
    1: '普通管理员',
    2: '高级管理员',
    3: '超级管理员'
  };
  return levels[level] || '未知级别';
}

// 格式化日期函数
function formatDate(date) {
  if (!date) return '未登录';

  // 将字符串日期转换为Date对象
  const dateObj = new Date(date);

  // 检查日期是否有效
  if (isNaN(dateObj.getTime())) {
    return '无效日期';
  }

  // 获取年、月、日、时、分
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  const hour = String(dateObj.getHours()).padStart(2, '0');
  const minute = String(dateObj.getMinutes()).padStart(2, '0');

  // 格式化为中文日期格式
  return `${year}年${month}月${day}日 ${hour}:${minute}`;
}

// 页面跳转方法
function toPage(url) {
  navigateToUrl(url);
}

// 修改管理员信息
function modifyAdminInfo() {
  navigateTo({
    url: "/pages/admin/modifyadmininfo",
    params: { adminId: adminInfo.adminId }
  });
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
  // 确保已获取管理员ID
  if (!adminInfo.adminId) {
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

        await uploadAvatar(adminInfo.adminId, res.tempFilePaths[0]);
      } catch (error) {
        handleUploadError(error);
      }
    },
    fail: handleUploadError
  });
}

// 上传方法
async function uploadAvatar(adminId, filePath) {
  try {
    isAvatarLoading.value = true;
    uni.showLoading({ title: '上传中...', mask: true });

    console.log('开始上传管理员头像:', filePath);

    // 这里调用接口上传头像文件
    // 注意：这里需要替换为实际的管理员头像上传API
    let uploadResult = await apiUploadAdminAvatar('/image/uploadAvatar', filePath, adminId);

    if (uploadResult.code !== 200) {
      throw new Error(uploadResult.message || '上传失败，请重试');
    }

    // 处理返回的图片数据
    if (uploadResult.data && uploadResult.data.imageData) {
      const imageType = uploadResult.data.type === 'image/jpg' ? 'image/jpeg' : uploadResult.data.type;
      adminInfo.avatar = `data:${imageType};base64,${uploadResult.data.imageData}`;
    }

    // 更新缓存
    cacheManager.setCache('adminInfo', adminInfo);

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

// 退出登录
function logout() {
  uni.showModal({
    title: '退出登录',
    content: '确定要退出当前管理员账号吗？',
    success: (res) => {
      if (res.confirm) {
        // 清除当前管理员缓存
        clearCurrentAdminCache();
        
        // 跳转到登录页面
        uni.reLaunch({
          url: '/pages/login/login'
        });
      }
    }
  });
}

// 清除当前管理员缓存
function clearCurrentAdminCache() {
  const adminId = uni.getStorageSync('current_user_id');
  
  if (adminId) {
    // 设置用户前缀
    cacheManager.setUserPrefix(adminId);
    
    // 清除该管理员的所有缓存
    cacheManager.clearUserCache();
  }
  
  // 移除当前管理员ID
  uni.removeStorageSync('current_user_id');
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

/* 管理员信息区 */
.admin-header {
  background: linear-gradient(135deg, #f0f7ff 0%, #e6f0fa 100%);
  padding: 32rpx;
  border-radius: 24rpx;
  margin-bottom: 24rpx;

  .admin-info {
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

    .admin-meta {
      .username {
        color: #2d3436;
        font-size: 36rpx;
        font-weight: 600;
        line-height: 1.4;
      }

      .admin-tag {
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
.permission-card {
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

/* 管理员权限卡片 */
.permission-card {
  .permission-content {
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
