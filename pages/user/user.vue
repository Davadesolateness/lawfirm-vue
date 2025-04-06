<template>
  <PageLayout>
    <view class="container">
      <!-- 用户信息卡片 -->
      <view class="card user-card">
        <view class="user-avatar">
          <image src="/static/images/default_avatar.jpg" mode="aspectFill"></image>
        </view>
        <view class="user-info">
          <view class="user-name">{{ userInfo.username || '游客' }}</view>
          <view class="user-status">{{ userInfo.status || '普通会员' }}</view>
        </view>
        <view class="user-action">
          <button class="btn btn-outline btn-sm">编辑资料</button>
        </view>
      </view>
      
      <!-- 优惠券卡片 -->
      <view class="card coupon-card">
        <view class="coupon-header">
          <view class="coupon-title">我的优惠券</view>
          <view class="coupon-action">查看全部</view>
        </view>
        <view class="coupon-content">
          <view class="coupon-item" v-for="(coupon, index) in coupons" :key="index">
            <view class="coupon-value">
              <text class="symbol">¥</text>
              <text class="amount">{{ coupon.amount }}</text>
            </view>
            <view class="coupon-detail">
              <text class="coupon-name">{{ coupon.name }}</text>
              <text class="coupon-desc">{{ coupon.desc }}</text>
              <text class="coupon-date">{{ coupon.validDate }}</text>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 功能列表 -->
      <view class="card function-card">
        <view class="function-list">
          <view class="function-item" v-for="(item, index) in functionList" :key="index" @click="handleFunction(item.type)">
            <view class="function-icon">
              <uni-icons :type="item.icon" size="24" color="var(--primary-color)"></uni-icons>
            </view>
            <view class="function-detail">
              <text class="function-name">{{ item.name }}</text>
            </view>
            <uni-icons type="right" size="16" color="var(--text-tertiary)"></uni-icons>
          </view>
        </view>
      </view>
      
      <!-- 角色切换器（测试用） -->
      <view class="card role-switcher">
        <view class="card-header">
          <text class="card-title">测试用户角色切换</text>
        </view>
        <view class="role-buttons">
          <button class="btn btn-primary" @click="switchRole(USER_TYPES.USER)">普通用户</button>
          <button class="btn btn-outline" @click="switchRole(USER_TYPES.LAWYER)">律师用户</button>
          <button class="btn btn-outline" @click="switchRole(USER_TYPES.ADMIN)">管理员</button>
        </view>
        <text class="current-role">当前角色: {{ currentRole }}</text>
      </view>
      
      <!-- 退出登录按钮 -->
      <button class="btn btn-danger logout-btn">退出登录</button>
    </view>
  </PageLayout>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import PageLayout from "@/components/custom/tabbarlayout.vue";
import { getUserType, setUserType, USER_TYPES } from '@/utils/userManager';
import { navigateToUrl } from '@/utils/navigateTo';

// 用户信息
const userInfo = reactive({
  username: '张三',
  status: '普通会员',
  avatar: '/static/images/default_avatar.jpg'
});

// 优惠券数据
const coupons = ref([
  {
    amount: '50',
    name: '法律咨询优惠券',
    desc: '电话咨询满100元可用',
    validDate: '有效期至2024-12-31'
  },
  {
    amount: '100',
    name: '新用户专享券',
    desc: '首次咨询可用',
    validDate: '有效期至2024-06-30'
  }
]);

// 功能列表
const functionList = ref([
  {
    icon: 'calendar',
    name: '我的预约',
    type: 'appointment'
  },
  {
    icon: 'paperplane',
    name: '我的咨询',
    type: 'consultation'
  },
  {
    icon: 'star',
    name: '我的收藏',
    type: 'favorite'
  },
  {
    icon: 'help',
    name: '帮助中心',
    type: 'help'
  },
  {
    icon: 'settings',
    name: '设置',
    type: 'setting'
  }
]);

// 当前角色状态
const currentRole = ref('普通用户');

// 处理功能点击
function handleFunction(type) {
  switch (type) {
    case 'appointment':
      navigateToUrl('/pages/appointment/list');
      break;
    case 'consultation':
      navigateToUrl('/pages/consultation/list');
      break;
    case 'favorite':
      navigateToUrl('/pages/favorite/list');
      break;
    case 'help':
      navigateToUrl('/pages/help/center');
      break;
    case 'setting':
      navigateToUrl('/pages/setting/index');
      break;
  }
}

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
</script>

<style lang="scss">
@import '@/uni_modules/theme/index.scss';

.container {
  min-height: 100vh;
  padding-bottom: var(--spacing-xl);
}

.user-card {
  display: flex;
  align-items: center;
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-md);
  
  .user-avatar {
    margin-right: var(--spacing-md);
    
    image {
      width: 120rpx;
      height: 120rpx;
      border-radius: 50%;
      border: 3rpx solid var(--primary-light);
    }
  }
  
  .user-info {
    flex: 1;
    
    .user-name {
      font-size: var(--font-size-lg);
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: var(--spacing-xs);
    }
    
    .user-status {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
    }
  }
}

.coupon-card {
  margin-bottom: var(--spacing-md);
  
  .coupon-header {
    display: flex;
    justify-content: space-between;
    padding: var(--spacing-md);
    border-bottom: 1rpx solid var(--border-color);
    
    .coupon-title {
      font-size: var(--font-size-md);
      font-weight: 600;
      color: var(--text-primary);
    }
    
    .coupon-action {
      font-size: var(--font-size-sm);
      color: var(--primary-color);
    }
  }
  
  .coupon-content {
    padding: var(--spacing-md);
  }
  
  .coupon-item {
    display: flex;
    align-items: center;
    background: linear-gradient(to right, var(--primary-light), var(--card-bg));
    border-radius: var(--border-radius-md);
    padding: var(--spacing-md);
    margin-bottom: var(--spacing-sm);
    position: relative;
    overflow: hidden;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      right: 120rpx;
      width: 30rpx;
      background: var(--bg-color);
      border-radius: 50%;
      box-shadow: 0 -15rpx 0 0 var(--bg-color), 0 15rpx 0 0 var(--bg-color);
    }
    
    &:last-child {
      margin-bottom: 0;
    }
    
    .coupon-value {
      min-width: 120rpx;
      text-align: center;
      margin-right: var(--spacing-md);
      
      .symbol {
        font-size: var(--font-size-sm);
        color: var(--primary-color);
        font-weight: 500;
      }
      
      .amount {
        font-size: var(--font-size-xl);
        color: var(--primary-color);
        font-weight: 700;
      }
    }
    
    .coupon-detail {
      flex: 1;
      padding-left: var(--spacing-md);
      
      .coupon-name {
        font-size: var(--font-size-md);
        font-weight: 500;
        color: var(--text-primary);
        margin-bottom: var(--spacing-xs);
        display: block;
      }
      
      .coupon-desc {
        font-size: var(--font-size-xs);
        color: var(--text-secondary);
        margin-bottom: var(--spacing-xs);
        display: block;
      }
      
      .coupon-date {
        font-size: var(--font-size-xs);
        color: var(--text-tertiary);
        display: block;
      }
    }
  }
}

.function-card {
  margin-bottom: var(--spacing-md);
  
  .function-list {
    padding: 0 var(--spacing-xs);
  }
  
  .function-item {
    display: flex;
    align-items: center;
    padding: var(--spacing-md) var(--spacing-sm);
    border-bottom: 1rpx solid var(--border-color);
    
    &:last-child {
      border-bottom: none;
    }
    
    .function-icon {
      margin-right: var(--spacing-md);
    }
    
    .function-detail {
      flex: 1;
      
      .function-name {
        font-size: var(--font-size-md);
        color: var(--text-primary);
      }
    }
  }
}

.role-switcher {
  margin-bottom: var(--spacing-xl);
  
  .card-header {
    margin-bottom: var(--spacing-md);
  }
}

.role-buttons {
  display: flex;
  justify-content: space-between;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
  
  .btn {
    flex: 1;
  }
}

.current-role {
  display: block;
  text-align: center;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin-top: var(--spacing-sm);
}

.logout-btn {
  width: 80%;
  margin: 0 auto;
  margin-top: var(--spacing-xl);
}
</style>