<template>
  <view class="custom-tab-bar">
    <!-- 普通用户导航栏 -->
    <view v-if="userType === USER_TYPES.USER" class="tab-bar-container">
      <view 
        v-for="(item, index) in userTabs" 
        :key="index" 
        class="tab-item" 
        :class="{ active: current === index }"
        @click="switchTab(item.pagePath, index)">
        <image :src="current === index ? item.selectedIconPath : item.iconPath"></image>
        <text>{{ item.text }}</text>
      </view>
    </view>
    
    <!-- 律师导航栏 -->
    <view v-else-if="userType === USER_TYPES.LAWYER" class="tab-bar-container">
      <view 
        v-for="(item, index) in lawyerTabs" 
        :key="index" 
        class="tab-item" 
        :class="{ active: current === index }"
        @click="handleNavigation(item.pagePath, index, item.isTabBar)">
        <image :src="current === index ? item.selectedIconPath : item.iconPath"></image>
        <text>{{ item.text }}</text>
      </view>
    </view>
    
    <!-- 管理员导航栏 -->
    <view v-else-if="userType === USER_TYPES.ADMIN" class="tab-bar-container">
      <view 
        v-for="(item, index) in adminTabs" 
        :key="index" 
        class="tab-item" 
        :class="{ active: current === index }"
        @click="handleNavigation(item.pagePath, index, item.isTabBar)">
        <image :src="current === index ? item.selectedIconPath : item.iconPath"></image>
        <text>{{ item.text }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { switchTabUrl, navigateToUrl } from '@/utils/navigateTo';
import { getUserType as getType, USER_TYPES } from '@/utils/userManager';

// 响应式状态
const userType = ref(USER_TYPES.USER); // 默认为普通用户
const current = ref(0);

// Tab 配置 - 普通用户导航（全部是tabBar页面）
const userTabs = [
  {
    pagePath: '/pages/index/index',
    text: '首页',
    iconPath: '/static/images/home.png',
    selectedIconPath: '/static/images/home_active.png',
    isTabBar: true
  },
  {
    pagePath: '/pages/lawyer/lawyerinfo',
    text: '免费咨询',
    iconPath: '/static/images/home.png',
    selectedIconPath: '/static/images/home_active.png',
    isTabBar: true
  },
  {
    pagePath: '/pages/order/orderlist',
    text: '订单',
    iconPath: '/static/images/user.png',
    selectedIconPath: '/static/images/user_active.png',
    isTabBar: true
  },
  {
    pagePath: '/pages/user/user',
    text: '我的',
    iconPath: '/static/images/user.png',
    selectedIconPath: '/static/images/user_active.png',
    isTabBar: true
  }
];

// 律师用户导航
const lawyerTabs = [
  {
    pagePath: '/pages/lawyer/lawyerinfo',
    text: '律师页面',
    iconPath: '/static/images/home.png',
    selectedIconPath: '/static/images/home_active.png',
    isTabBar: true // 这是tabBar页面
  },
  {
    pagePath: '/pages/lawyer/modifylawyerinfo',
    text: '律师信息',
    iconPath: '/static/images/user.png',
    selectedIconPath: '/static/images/user_active.png',
    isTabBar: false // 这不是tabBar页面，需要用navigateTo
  }
];

// 管理员导航
const adminTabs = [
  {
    pagePath: '/pages/admin/admin',
    text: '管理主页',
    iconPath: '/static/images/user.png',
    selectedIconPath: '/static/images/user_active.png',
    isTabBar: false // 这不是tabBar页面，需要用navigateTo
  }
];

// 获取用户类型
const fetchUserType = () => {
  userType.value = getType();
};

// 设置当前激活的tab
const setCurrentTab = () => {
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  const url = `/${currentPage.route}`;
  
  let tabs = [];
  if (userType.value === USER_TYPES.USER) {
    tabs = userTabs;
  } else if (userType.value === USER_TYPES.LAWYER) {
    tabs = lawyerTabs;
  } else if (userType.value === USER_TYPES.ADMIN) {
    tabs = adminTabs;
  }
  
  const index = tabs.findIndex(item => item.pagePath === url);
  if (index !== -1) {
    current.value = index;
  }
};

// 导航处理
const handleNavigation = (url, index, isTabBar) => {
  if (current.value !== index) {
    // 根据页面类型选择导航方式
    if (isTabBar) {
      switchTabUrl(url);
    } else {
      navigateToUrl(url);
    }
    current.value = index;
  }
};

// TabBar页面切换（仅用于tabBar页面）
const switchTab = (url, index) => {
  if (current.value !== index) {
    switchTabUrl(url);
    current.value = index;
  }
};

// 页面加载时执行
onMounted(() => {
  fetchUserType();
  setCurrentTab();
});
</script>

<style>
.custom-tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50px;
  background-color: #fff;
  display: flex;
  box-shadow: 0 -1px 5px rgba(0, 0, 0, 0.1);
}

.tab-bar-container {
  display: flex;
  width: 100%;
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: #666;
}

.tab-item.active {
  color: #007AFF;
}

.tab-item image {
  width: 24px;
  height: 24px;
  margin-bottom: 2px;
}
</style> 