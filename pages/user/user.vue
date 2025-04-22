<template>
  <PageLayout>
    <view class="container">
      <!-- 用户信息区 -->
      <view class="user-header">
        <view class="user-info">
          <!-- 修改头像功能 -->
          <view class="avatar-container" @click="showAvatarOptions">
            <image class="avatar" :src="userInfo.avatar" mode="aspectFill"/>
            <view class="avatar-edit-icon">
              <text class="edit-icon">📷</text>
            </view>
          </view>
          <view class="user-meta">
            <!-- 企业用户 -->
            <view v-if="isCorporateuser">
              <view class="username">{{ userInfo.companyName || '公司名称' }}</view>
              <view class="certificate">证件号：{{ userInfo.certificateNumber || '未设置' }}</view>
              <view class="corporate-tag">法人用户</view>
            </view>

            <!-- 个人用户 -->
            <view v-else>
              <text class="username">{{ userInfo.userName || userInfo.fullName || '用户名称' }}</text>
              <view class="personal-tag">个人用户</view>
            </view>
          </view>
        </view>

        <!-- 企业用户专属卡片 -->
        <view v-if="isCorporateuser" class="corporate-card">
          <view class="card-header">
            <text class="card-title">企业权益</text>
            <view class="decorative-line"></view>
          </view>
          <view class="corporate-content">
            <text class="info-item">专属客户经理：张经理</text>
            <text class="info-item">企业信用分：{{ corporateCredit }}</text>
          </view>
        </view>

        <!-- 个人用户会员卡片 -->
        <view v-else class="membership-card">
          <text class="membership-level">{{ membership.level }}</text>
          <text class="expire-date">有效期至：{{ membership.expire }}</text>
          <view class="privilege-tags">
            <text v-for="(tag, index) in membership.tags" :key="index" class="tag">{{ tag }}</text>
          </view>
        </view>

        <!-- 服务次数卡片 -->
        <view class="service-card">
          <view class="card-header">
            <text class="card-title">法律服务</text>
            <view class="decorative-line"></view>
          </view>
          <view class="service-content">
            <view class="service-item highlight">
              <view class="label-box">
                <text class="icon">📞</text>
                <text class="label">剩余咨询次数</text>
              </view>
              <text class="value">{{ userInfo.remainingServiceCount }}次</text>
            </view>

            <!-- 日期显示区域 -->
            <view class="date-container">
              <view class="date-row">
                <view class="date-label">
                  <text class="icon">📅</text>
                  <text>服务期限：</text>
                </view>
                <view class="date-values">
                  <text class="date-value">{{ formatDate(userInfo.serviceStartTime) }}</text>
                  <text class="date-separator">至</text>
                  <text class="date-value">{{ formatDate(userInfo.serviceExpireTime) }}</text>
                </view>
              </view>
            </view>


          </view>
        </view>
      </view>

      <!-- 功能列表 -->
      <view class="func-list">
        <view class="func-item" @click="toPage('/pages/share/index')">
          <text class="func-icon">👀</text>
          <text class="func-text">推荐给好友</text>
          <text class="arrow">›</text>
        </view>
        <view class="func-item" @click="toPage('/pages/about/index')">
          <text class="func-icon">💁</text>
          <text class="func-text">关于</text>
          <text class="arrow">›</text>
        </view>
        <view class="func-item" @click="toPage('/pages/feedback/index')">
          <text class="func-icon">📧</text>
          <text class="func-text">意见反馈</text>
          <text class="arrow">›</text>
        </view>
      </view>

      <view>
        <button class="el-button--text" @click="modifyUserInfo">修改用户</button>
        <button class="el-button--text" @click="adminPage">管理员</button>
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

<script setup>
import {onMounted, reactive, ref} from "vue"
import {navigateTo, navigateToUrl} from "@/utils/navigateTo"
import {apiGetCorporateDetails, apiGetIndividualDetails, apiUpdateAvatar} from "@/api/userapi"
import PageLayout from "@/components/custom/tabbarlayout.vue"
import {cacheManager} from "@/utils/store"

// 头像弹窗引用
const avatarPopup = ref(null)

// 格式化日期函数
const formatDate = (date) => {
  if (!date) return '未设置';

  // 将字符串日期转换为Date对象
  const dateObj = new Date(date);

  // 检查日期是否有效
  if (isNaN(dateObj.getTime())) {
    return '无效日期';
  }

  // 获取年、月、日
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');

  // 格式化为中文日期格式
  return `${year}年${month}月${day}日`;
}

// 响应式数据
const isCorporateuser = ref(false)
const userInfo = reactive({
  userId: '',
  avatar: '',
  userName: '',
  companyName: '',
  certificateNumber: '',
  userType: '',
  remainingServiceCount: '',  //剩余服务次数
  remainingServiceMinutes: '',  // 剩余服务时长
  serviceLevel: '',  //服务级别：1-基础，2-标准，3-高级，4-企业VIP
  serviceStartTime: '',  //服务开始时间
  serviceExpireTime: '',   //服务到期时间
})
const corporateCredit = ref(100)

const membership = ref({
  level: '黄金会员',
  expire: '2024-12-31',
  tags: ['专属律师', '双倍积分', '优先服务']
})

// 生命周期
onMounted(async () => {
  await initUserInfo()
  judgeUserType(userInfo.userType)
})

// 初始化用户信息
function initUserInfo() {
  const cachedInfo = cacheManager.getCache("userInfo")

  if (cachedInfo) {
    Object.assign(userInfo, cachedInfo)
  }

  if (userInfo) {
    // 如果是法人用户且没有公司信息，则尝试获取详细信息
    if (userInfo.userType === 'corporate' && !userInfo.companyName) {
      fetchCorporateUserDetails();
    }
    // 如果是个人用户且没有详细信息，则尝试获取
    else if (userInfo.userType === 'individual' && !userInfo.fullName) {
      fetchIndividualUserDetails();
    }

  }
}

// 获取法人用户详细信息
async function fetchCorporateUserDetails() {
  try {
    const response = await apiGetCorporateDetails(userInfo.userId);

    // 合并对象
    Object.assign(userInfo, response);

    console.log("企业用户信息加载完成", userInfo);
  } catch (error) {
    console.error("获取企业信息失败:", error);
  }
}

// 获取个人用户详细信息
async function fetchIndividualUserDetails() {
  try {
    const response = await apiGetIndividualDetails(userInfo.userId);

    // 合并对象
    Object.assign(userInfo, response);

    console.log("个人用户信息加载完成", userInfo);
  } catch (error) {
    console.error("获取个人详情失败", error);
  }
}

// 判断用户类型
function judgeUserType(userType) {
  if (userType == "corporate") {
    isCorporateuser.value = true;
  }
}

// 页面跳转方法
function toPage(url) {
  navigateToUrl(url)
}

// 修改用户信息
function modifyUserInfo() {
  navigateTo({
    url: "/pages/user/modifyuserinfo",
    params: {username: userInfo.userName}
  })
}

function adminPage() {
  navigateToUrl("/pages/admin/admin")
}

// 显示头像操作弹窗
function showAvatarOptions() {
  avatarPopup.value.open('bottom')
}

// 关闭头像操作弹窗
function closeAvatarPopup() {
  avatarPopup.value.close()
}

// 选择图片
function chooseImage(sourceType) {
  closeAvatarPopup()

  // 确保已获取用户ID
  if (!userInfo.userId) {
    uni.showToast({
      title: '用户信息错误，请重新登录',
      icon: 'none'
    })
    return
  }

  const source = sourceType === 'camera' ? ['camera'] : ['album']

  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: source,
    success: async (res) => {
      try {
        // 增加文件类型和大小验证
        const file = res.tempFiles[0]
        if (!file.type.startsWith('image/')) {
          throw new Error('请选择图片文件')
        }
        if (file.size > 2 * 1024 * 1024) { // 2MB限制
          throw new Error('图片大小不能超过2MB')
        }

        await uploadAvatar(userInfo.userId, res.tempFilePaths[0])
      } catch (error) {
        handleUploadError(error)
      }
    },
    fail: handleUploadError
  })
}

// 上传方法
 function uploadAvatar(userId, filePath) {
  try {
    uni.showLoading({title: '上传中...', mask: true})

    http.uploadFile('/user/uploadAvatar', filePath, {
      formatDate: {userId}
    })

    const result = JSON.parse(uploadResult.data)
    if (result.code !== 200) {
      throw new Error(result.message || '上传失败')
    }

    //await updateAvatarUrl(userId, result.data.url)
    uni.showToast({title: '头像更新成功', icon: 'success'})
  } catch (error) {
    handleUploadError(error)
  } finally {
    uni.hideLoading()
  }
}

// 更新头像URL（强化参数验证）
async function updateAvatarUrl(userId, avatarUrl) {
  if (!userId || !avatarUrl) {
    throw new Error('参数错误')
  }

  try {
    const result = await apiUpdateAvatar(userId, avatarUrl)
    if (result.code !== 200) {
      throw new Error(result.message || '更新失败')
    }

    // 更新本地数据
    userInfo.avatar = avatarUrl
    const cachedInfo = cacheManager.getCache("userInfo")
    if (cachedInfo) {
      cachedInfo.avatar = avatarUrl
      cacheManager.setCache("userInfo", cachedInfo)
    }
  } catch (error) {
    throw error
  }
}

// 统一错误处理
function handleUploadError(error) {
  console.error('上传失败:', error)
  uni.showToast({
    title: error.message || '操作失败',
    icon: 'none',
    duration: 3000
  })
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

/* 用户信息区 */
.user-header {
  background: linear-gradient(135deg, #f0f4ff 0%, #e6ecfa 100%);
  padding: 32rpx;
  border-radius: 24rpx;
  margin-bottom: 24rpx;

  .user-info {
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

      .avatar-edit-icon {
        position: absolute;
        right: 0;
        bottom: 0;
        width: 40rpx;
        height: 40rpx;
        background: #4A67FF;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2rpx solid #fff;

        .edit-icon {
          color: #fff;
          font-size: 24rpx;
        }
      }
    }

    .user-meta {
      .username {
        color: #2d3436;
        font-size: 36rpx;
        font-weight: 600;
        line-height: 1.4;
      }

      .certificate {
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

      .corporate-tag, .personal-tag {
        display: inline-block;
        padding: 6rpx 20rpx;
        border-radius: 32rpx;
        font-size: 24rpx;
        margin-top: 12rpx;
      }

      .corporate-tag {
        background: rgba(52, 152, 219, 0.1);
        color: #3498db;
      }

      .personal-tag {
        background: rgba(46, 204, 113, 0.1);
        color: #2ecc71;
      }
    }
  }
}

/* 卡片通用样式 */
.corporate-card, .membership-card, .service-card {
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
      background: #7F7FD5;
      margin-top: 12rpx;
    }
  }
}

/* 服务卡片 */
.service-card {
  .service-item.highlight {
    background: #f8f9ff;
    border-radius: 16rpx;
    padding: 24rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .label-box {
      display: flex;
      align-items: center;
      gap: 12rpx;

      .icon {
        font-size: 36rpx;
      }

      .label {
        font-size: 28rpx;
        color: #444;
      }
    }

    .value {
      color: #4A67FF;
      font-size: 40rpx;
      font-weight: 600;

      &::after {
        content: "次";
        font-size: 28rpx;
        color: #999;
        margin-left: 4rpx;
      }
    }
  }

  .date-container {
    margin-top: 24rpx;
    background: #f8f9ff;
    border-radius: 16rpx;
    padding: 24rpx;

    .date-row {
      display: flex;
      align-items: center; /* 保持垂直居中 */
      gap: 16rpx;
      padding: 16rpx;
      background: white;
      border-radius: 12rpx;
      box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
      flex-wrap: nowrap; /* 禁止换行 */
      overflow-x: auto; /* 允许横向滚动（极端情况备用） */

      .date-label {
        display: flex;
        align-items: center;
        gap: 8rpx;
        white-space: nowrap; /* 禁止标签换行 */
        flex-shrink: 0; /* 禁止压缩 */

        .icon {
          font-size: 32rpx;
        }

        text {
          color: #666;
          font-size: 26rpx;
        }
      }

      .date-values {
        display: flex;
        align-items: center;
        gap: 8rpx;
        white-space: nowrap; /* 强制日期不换行 */
        flex-shrink: 0; /* 禁止压缩 */

        .date-value {
          color: #4A67FF;
          font-size: 28rpx;
          font-weight: 500;
        }

        .date-separator {
          color: #999;
          font-size: 28rpx;
          margin: 0 4rpx;
        }
      }
    }

    /* 移除移动端换行样式 */
    @media (max-width: 480px) {
      .date-row {
        justify-content: flex-start; /* 左对齐代替居中 */
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

/* 按钮样式 */
.el-button--text {
  width: 100%;
  margin-top: 24rpx;
  padding: 20rpx;
  background: #f0f4ff;
  color: #4A67FF;
  border-radius: 12rpx;
  font-size: 28rpx;
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
</style>