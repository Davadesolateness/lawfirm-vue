<template>
  <PageLayout>
    <view class="container">
      <!-- 用户信息区 -->
      <view class="user-header">
        <view class="user-info">
          <image class="avatar" :src="userInfo.avatar" mode="aspectFill"/>
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
  </PageLayout>
</template>

<script setup>
import {onMounted, reactive, ref} from "vue"
import {navigateTo, navigateToUrl} from "@/utils/navigateTo"
import {apiGetCorporateDetails, apiGetIndividualDetails, apiGetUserInfoById} from "@/api/userapi"
import PageLayout from "@/components/custom/tabbarlayout.vue"
import {cacheManager} from "@/utils/store"

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

// 获取用户信息
const getUserInfoById = async () => {
  const data = await apiGetUserInfoById("444")
  Object.assign(userInfo, data)
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

    .avatar {
      width: 128rpx;
      height: 128rpx;
      border-radius: 50%;
      border: 2rpx solid rgba(255, 255, 255, 0.8);
      margin-right: 24rpx;
      box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
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
      flex-direction: row;
      align-items: center;
      gap: 16rpx;
      padding: 16rpx;
      background: white;
      border-radius: 12rpx;
      box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  
      .date-label {
        display: flex;
        align-items: center;
        gap: 8rpx;
        white-space: nowrap;

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
        flex-wrap: wrap;
        gap: 8rpx;
  
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

    /* 移动端响应式 */
    @media (max-width: 480px) {
      .date-row {
        flex-wrap: wrap;
        justify-content: center;
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
</style>