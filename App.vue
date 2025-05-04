<template>
  <div id="app">

  </div>
</template>
<script>
import { getUserType, USER_TYPES } from '@/utils/store/userManager';

export default {
  onLaunch: function() {
    console.log('App Launch');
    // 初始化时检查用户类型
    this.checkUserType();
  },
  onShow: function() {
    console.log('App Show');
    // 每次显示应用时检查用户类型
    this.checkUserType();
    // 触发app-show事件，通知组件更新
    uni.$emit('app-show');
  },
  onHide: function() {
    console.log('App Hide');
  },
  methods: {
    // 检查用户类型并保存到全局状态
    checkUserType() {
      const userType = getUserType();
      // 将用户类型保存到全局对象，使所有页面都能访问
      getApp().globalData = getApp().globalData || {};
      getApp().globalData.userType = userType;
      console.log('当前用户类型:', userType);
    }
  }
}
</script>


<style lang="scss">
/*每个页面公共css */
@import './static/css/style.css';

.bgf {
  background: #FFF;
}

.flc {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.flc-inline {
  display: inline-flex;
  align-items: center;
}

.g5 {
  color: $g5;
}

.fz12 {
  font-size: $fz12;
}
</style>