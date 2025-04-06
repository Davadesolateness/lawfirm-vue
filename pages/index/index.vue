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
        <LawyerList></LawyerList>
      </scroll-view>

      <!-- 测试用户角色切换 -->
      <view class="role-switcher">
        <text class="role-title">测试用户角色切换：</text>
        <view class="role-buttons">
          <button class="role-btn" @click="switchRole(USER_TYPES.USER)">普通用户</button>
          <button class="role-btn" @click="switchRole(USER_TYPES.LAWYER)">律师用户</button>
          <button class="role-btn" @click="switchRole(USER_TYPES.ADMIN)">管理员</button>
        </view>
        <text class="current-role">当前角色: {{ currentRole }}</text>
      </view>

      <button class="consult-btn" @click="handleConsult('111')">
        跳转律师详情
      </button>
    </view>
  </PageLayout>
</template>


<script setup>
import {ref, onMounted} from 'vue';
import {navigateToUrl} from "@/utils/navigateTo";
import LawyerList from "@/components/lawyer/lawyerlist";
import PageLayout from "@/components/custom/tabbarlayout";
import {getUserType, setUserType, USER_TYPES} from "@/utils/userManager";

function handleConsult(item) {
  navigateToUrl('/components/lawyer/lawyerlist')
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
  if(role === USER_TYPES.USER) {
    currentRole.value = '普通用户';
  } else if(role === USER_TYPES.LAWYER) {
    currentRole.value = '律师用户';
  } else if(role === USER_TYPES.ADMIN) {
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
  if(userType === USER_TYPES.USER) {
    currentRole.value = '普通用户';
  } else if(userType === USER_TYPES.LAWYER) {
    currentRole.value = '律师用户';
  } else if(userType === USER_TYPES.ADMIN) {
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

<style lang="scss" scoped>

.container {
  background-color: #f5f5f5;
  padding-bottom: 100rpx;
}

.top-banner {
  background-color: #2979FF;
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
  padding: 30rpx 0;
  margin: 20rpx 0;

  .nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;

    .nav-title {
      font-size: 28rpx;
      margin: 10rpx 0;
    }

    .nav-desc {
      font-size: 24rpx;
      color: #666;
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
  padding: 20rpx;
  border-radius: 10rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.role-title {
  display: block;
  font-size: 28rpx;
  margin-bottom: 20rpx;
  color: #333;
}

.role-buttons {
  display: flex;
  justify-content: space-between;
}

.role-btn {
  font-size: 24rpx;
  padding: 10rpx 20rpx;
  margin: 0 10rpx;
  background-color: #2979FF;
  color: #fff;
  border-radius: 30rpx;
  line-height: 1.5;
  flex: 1;
}

.current-role {
  display: block;
  text-align: center;
  font-size: 26rpx;
  margin-top: 20rpx;
  color: #666;
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
</style>