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
      </view>
      <view>
        <button class="el-button--text" @click="adminPage">管理员</button>
      </view>
    </view>
  </PageLayout>
</template>

<script setup>
import {onMounted, reactive, ref} from "vue"
import {navigateTo, navigateToUrl} from "@/utils/navigateTo";
import {apiGetCorporateDetails, apiGetUserInfoById} from "@/api/userapi";
import PageLayout from "@/components/custom/tabbarlayout.vue";
import {cacheManager} from "@/utils/store";


// 修改后的响应式数据
const coupons = ref([
  {times: 3, name: '优惠券', expire: '2023-12-31'},
  /* {times: 5, name: '会员专属券', expire: '2024-01-31'},
   {times: 1, name: '新人礼券', expire: '2024-02-28'}*/
]);

const membership = ref({
  level: '黄金会员',
  progress: 60,
  expire: '2024-12-31'
});

let avatarImg = '';  // 头像

// 响应式数据
const isCorporateuser = ref(false)
const userInfo = reactive({
  avatar: '',
  userName: '',
  companyName: '',
  certificateNumber: '',
  userType: ''
})

const corporateCredit = ref(85)


// 生命周期
onMounted(async () => {
  await initUserInfo()
  judgeUserType()
})

// 初始化用户详情信息
function initUserInfo() {
  const cachedInfo = cacheManager.getCache("userInfo")
  if (cachedInfo) {
    Object.assign(userInfo, cachedInfo)
  } else {
    //await fetchUserInfo()
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

  } else {
    // 如果本地存储没有用户信息，尝试通过API获取
    getUserInfoById();
  }
}

// 获取法人用户详细信息
async function fetchCorporateUserDetails() {
  try {
    const response = await apiGetCorporateDetails(userInfo.userId);

    // 方式1: 使用 Object.assign 合并对象
    Object.assign(userInfo, response.data);

    // 方式2: 显式更新关键字段（更安全）
    // userInfo.companyName = response.data.companyName || '未设置';
    // userInfo.certificateNumber = response.data.certificateNumber || '未设置';

  } catch (error) {
    console.error("获取企业信息失败:", error);
    userInfo.companyName = '数据加载失败';
  }
}

// 获取个人用户详细信息
async function fetchIndividualUserDetails() {
  try {
    // 这里应该是调用获取个人客户详情的API
    // const response = await apiGetIndividualDetails(userInfo.value.relatedEntityId);
    // 模拟数据
    const individualDetails = {
      fullName: "李四",
      gender: "male",
      birthDate: "1990-01-01"
    };


    // 合并信息到用户对象
    userInfo.value = {...userInfo.value, ...individualDetails};
  } catch (error) {
    console.error("获取个人详情失败", error);
  }
}

const getUserInfoById = async () => {
  userInfo.value = await apiGetUserInfoById("444");
  avatarImg = userInfo.value.avatar;
}

function toPage(url) {
  this.navigate.navigateToUrl("2020-01-01");
}

// 判断法人用户还是个人用户
function judgeUserType(userType) {
  if (userType == "corporate") {
    isCorporateuser.value = true;
  } else {
    isCorporateuser.value = false;
  }
}


// 修改用户信息
function modifyUserInfo() {
  navigateTo({
    url: "/pages/user/modifyuserinfo",
    params: {
      username: userInfo.value.username,
      avatarImg: avatarImg,
      phone: userInfo.value.phone_number
    }
  })
}

function adminPage() {
  navigateToUrl("/pages/admin/admin");
}
</script>

<style lang="scss" scoped>
/* 企业用户样式 */
.corporate-card {
  background: #fff;
  border-radius: 20rpx;
  padding: 24rpx;
  margin: 24rpx 0;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);

  .card-title {
    color: #2c3e50;
    font-size: 32rpx;
    font-weight: 600;
  }

  .corporate-content {
    margin-top: 20rpx;

    .info-item {
      display: block;
      color: #34495e;
      font-size: 28rpx;
      padding: 12rpx 0;
    }
  }
}

/* 个人用户样式 */
.membership-card {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 20rpx;
  padding: 28rpx;

  .membership-level {
    color: #e67e22;
    font-size: 36rpx;
    font-weight: 600;
    display: block;
  }

  .privilege-tags {
    margin-top: 24rpx;

    .tag {
      background: rgba(230, 126, 34, 0.1);
      color: #e67e22;
    }
  }
}

/* 用户标签差异化样式 */
.corporate-tag {
  background: rgba(52, 152, 219, 0.1);
  color: #3498db;
}

.personal-tag {
  background: rgba(46, 204, 113, 0.1);
  color: #2ecc71;
}

.user-tag {
  padding: 6rpx 24rpx;
  border-radius: 32rpx;
  font-size: 26rpx;
  display: inline-block;
  margin-top: 12rpx;
}

/* 基础容器 */
.container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f8fafb;
}

/* 用户信息区优化 */
.user-header {
  background: linear-gradient(135deg, #f0f4ff 0%, #e6ecfa 100%);
  padding: 48rpx 32rpx 10rpx;
  position: relative;

  .user-info {
    display: flex;
    align-items: center;
    margin-bottom: 40rpx;

    .avatar {
      width: 128rpx;
      height: 128rpx;
      border-radius: 50%;
      border: 2rpx solid rgba(255, 255, 255, 0.8);
      margin-right: 32rpx;
      box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
    }

    .user-meta {
      .username {
        color: #2d3436;
        font-size: 40rpx;
        font-weight: 600;
        letter-spacing: 0.5rpx;
      }

      .user-tag {
        display: inline-block;
        padding: 6rpx 24rpx;
        background: rgba(127, 127, 213, 0.1);
        border-radius: 32rpx;
        color: #7F7FD5;
        font-size: 26rpx;
        margin-top: 12rpx;
        border: 1rpx solid rgba(127, 127, 213, 0.2);
      }
    }
  }
}

/* 会员卡片优化 */
.membership-card {
  background: linear-gradient(135deg, #f0f5ff 0%, #e8efff 100%);
  border-radius: 20rpx;
  padding: 28rpx;
  margin: 0 0 24rpx;
  border: 1rpx solid rgba(127, 127, 213, 0.1);

  .membership-level {
    color: #4A67FF;
    font-size: 36rpx;
    font-weight: 600;
    margin-bottom: 12rpx;
  }

  .expire-date {
    color: #666;
    font-size: 26rpx;

    &::before {
      content: "📅 ";
    }
  }

  .privilege-tags {
    margin-top: 24rpx;
    display: flex;
    gap: 16rpx;

    .tag {
      background: rgba(127, 127, 213, 0.08);
      color: #4A67FF;
      padding: 6rpx 20rpx;
      border-radius: 32rpx;
      font-size: 24rpx;
      border: 1rpx solid rgba(127, 127, 213, 0.15);
    }
  }
}

/* 使用次数卡片优化 */
.coupon-card {
  background: #fff;
  border-radius: 20rpx;
  padding: 24rpx;
  margin: 24rpx 0;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);

  .card-header {
    margin-bottom: 24rpx;

    .card-title {
      color: #444;
      font-size: 32rpx;
      font-weight: 500;
    }

    .decorative-line {
      width: 48rpx;
      height: 4rpx;
      background: #7F7FD5;
      margin-top: 12rpx;
    }
  }

  .coupon-item {
    padding: 24rpx;
    background: #f8f9ff;
    border-radius: 16rpx;
    margin: 16rpx 0;
    display: flex;
    align-items: center;

    .times {
      color: #4A67FF;
      font-size: 40rpx;
      font-weight: 600;
      margin-right: 32rpx;
      min-width: 96rpx;
    }

    .coupon-info {
      .name {
        color: #444;
        font-size: 28rpx;
      }

      .condition {
        color: #666;
        font-size: 26rpx;
      }

      .expire {
        color: #999;
        font-size: 24rpx;
        margin-top: 8rpx;
      }
    }
  }
}

/* 功能列表优化 */
.func-list {
  background: #fff;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);

  .func-item {
    padding: 28rpx 32rpx;
    border-bottom: 1rpx solid #f0f0f0;
    display: flex;
    align-items: center;
    transition: background 0.2s;

    &:last-child {
      border-bottom: none;
    }

    .func-icon {
      font-size: 40rpx;
      margin-right: 24rpx;
      width: 56rpx;
      text-align: center;
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
</style>