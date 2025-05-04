<template>
  <PageLayout>
    <view class="container">
      <!-- 顶部横幅 -->
      <view class="top-banner">
        <view class="banner-title">全国20万执业律师，24小时在线服务</view>
        <view class="banner-sub">严选真实律师 1对私密咨询 未服务可退款</view>
      </view>


      <!-- 服务导航 -->
      <view class="service-nav">
        <view v-for="(item, index) in services" :key="index" class="nav-item">
          <uni-icons :type="item.icon" size="30" color="#2979FF"/>
          <text class="nav-title">{{ item.title }}</text>
          <text class="nav-desc">{{ item.desc }}</text>
        </view>
      </view>

      <!-- 律师列表 -->
      <scroll-view scroll-y class="lawyer-list">
        <LawyerList ref="lawyerListRef" :search-keyword="searchKeyword"></LawyerList>
      </scroll-view>

      <!-- 测试用户角色切换 -->
      <view class="role-switcher">
        <text class="role-title">测试用户角色切换：</text>
        <view class="role-buttons">
          <button class="role-btn" @click="switchRole(USER_TYPES.INDIVIDUAL)">个人用户</button>
          <button class="role-btn" @click="switchRole(USER_TYPES.CORPORATE)">法人用户</button>
          <button class="role-btn" @click="switchRole(USER_TYPES.LAWYER)">律师用户</button>
          <button class="role-btn" @click="switchRole(USER_TYPES.ADMIN)">管理员</button>
        </view>
        <text class="current-role">当前角色: {{ currentRole }}</text>
      </view>

      <button class="consult-btn" @click="handleConsult('111')">
        跳转律师详情
      </button>
      <button class="consult-btn" @click="login">
        登录
      </button>
    </view>
  </PageLayout>
</template>


<script setup>
import {ref, onMounted} from 'vue';
import {navigateToUrl} from "@/utils/navigateTo";
import LawyerList from "@/components/lawyer/lawyerlist";
import PageLayout from "@/components/page-layout/tabbarlayout.vue";
import {getUserType, setUserType, USER_TYPES} from "@/utils/store/userManager";

// 搜索相关
const searchKeyword = ref('');
const lawyerListRef = ref(null);

function handleSearch() {
  // 触发搜索事件，将通过props传递搜索关键词到LawyerList组件
  console.log('搜索关键词：', searchKeyword.value);
  // 在实际应用中，可能需要调用子组件的方法来触发搜索
  // if (lawyerListRef.value) {
  //   lawyerListRef.value.searchLawyers(searchKeyword.value);
  // }
}

function clearSearch() {
  searchKeyword.value = '';
  handleSearch();
}

function handleConsult(item) {
  navigateToUrl('/components/lawyer/lawyerlist')
}

function login() {
  navigateToUrl('/pages/login/login')
}

const services = ref([
  {icon: 'staff', title: '智能匹配', desc: '律师/法务'},
  {icon: 'phone', title: '电话快问', desc: '1分钟接通律师'},
  {icon: 'medal', title: '专家咨询', desc: '执业10年以上律师'},
]);

// 添加当前角色状态
const currentRole = ref('普通用户');

// 切换用户角色
function switchRole(role) {
  setUserType(role);

  // 更新当前显示的角色名称
  if (role === USER_TYPES.INDIVIDUAL) {
    currentRole.value = '个人用户';
  } else if (role === USER_TYPES.CORPORATE) {
    currentRole.value = '法人用户';
  } else if (role === USER_TYPES.LAWYER) {
    currentRole.value = '律师用户';
  } else if (role === USER_TYPES.ADMIN) {
    currentRole.value = '管理员';
  }

  // 刷新页面以重新加载tabBar
  setTimeout(() => {
    uni.reLaunch({
      url: '/pages/index/index'
    });
  }, 300);
}

// 页面加载时获取当前用户角色
onMounted(() => {
  const userType = getUserType();
  if (userType === USER_TYPES.INDIVIDUAL) {
    currentRole.value = '个人用户';
  } else if (userType === USER_TYPES.CORPORATE) {
    currentRole.value = '法人用户';
  } else if (userType === USER_TYPES.LAWYER) {
    currentRole.value = '律师用户';
  } else if (userType === USER_TYPES.ADMIN) {
    currentRole.value = '管理员';
  }
});

function filteredLawyers() {
  if (this.currentTag === 'all') {
    return this.lawyers;
  }
  return this.lawyers.filter((lawyer) => lawyer.category === this.currentTag);
}
</script>
<!-- ... existing template and script 部分 ... -->


<style lang="scss" scoped>

.container {
  background-color: #fafafa;
  padding-bottom: 100rpx;
}

.top-banner {
  background: linear-gradient(135deg, #4A90E2, #2979FF); // 使用渐变让顶部横幅更优雅
  padding: 30rpx;
  color: #fff;

  .banner-title {
    font-size: 36rpx;
    font-weight: bold;
    margin-bottom: 15rpx;
  }

  .banner-sub {
    font-size: 28rpx;
    opacity: 0.9;
  }
}

.service-nav {
  display: flex;
  justify-content: space-around;
  background: #fff;
  padding: 30rpx;
  margin: 20rpx;
  border-radius: 12rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);

  .nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20rpx;
    width: 180rpx;
    border: 1rpx solid #e8eaed;
    border-radius: 10rpx;
    background-color: #f9fafb;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.03);
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2rpx);
      box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
    }

    .nav-title {
      font-size: 28rpx;
      font-weight: 500;
      margin: 16rpx 0 8rpx;
      color: #333;
    }

    .nav-desc {
      font-size: 24rpx;
      color: #666;
      text-align: center;
    }
  }
}

.lawyer-list {
  height: calc(100vh - 640rpx);
  padding: 0 20rpx;
}

/* 角色切换器样式 */
.role-switcher {
  background: #fff;
  margin: 20rpx;
  padding: 24rpx;
  border-radius: 12rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.role-title {
  display: block;
  font-size: 30rpx;
  font-weight: 500;
  margin-bottom: 24rpx;
  color: #333;
}

.role-buttons {
  display: flex;
  justify-content: space-between;
  gap: 16rpx;
}

.role-btn {
  font-size: 26rpx;
  padding: 16rpx 20rpx;
  margin: 0;
  background-color: #2979FF;
  color: #fff;
  border-radius: 8rpx;
  line-height: 1.5;
  flex: 1;
  transition: all 0.2s ease;

  &:active {
    opacity: 0.9;
    transform: scale(0.98);
  }
}

.current-role {
  display: block;
  text-align: center;
  font-size: 26rpx;
  margin-top: 24rpx;
  color: #666;
  font-weight: 500;
}

.item-question {
  min-width: 78px;
  background: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-right: 10px;
  align-items: center;
  border-radius: 8px;
  box-shadow: 0px 2px 16px 0px rgba(0, 0, 0, .06);
}

.consult-btn {
  display: block;
  width: 80%;
  height: 88rpx;
  line-height: 88rpx;
  margin: 40rpx auto;
  background: linear-gradient(135deg, #4A90E2, #2979FF);
  color: #fff;
  text-align: center;
  font-size: 32rpx;
  font-weight: 500;
  border-radius: 44rpx;
  box-shadow: 0 6rpx 16rpx rgba(41, 121, 255, 0.2);
  transition: all 0.3s ease;

  &:active {
    transform: scale(0.98);
    box-shadow: 0 3rpx 8rpx rgba(41, 121, 255, 0.15);
  }
}



</style>