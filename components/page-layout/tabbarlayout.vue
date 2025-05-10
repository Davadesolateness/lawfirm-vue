<template>
  <view class="container">
    <!-- 页面内容区域 -->
    <view class="content-area">
      <slot></slot>
    </view>
    
    <!-- 自定义TabBar -->
    <cCustomTabBar v-if="showTabBar"></cCustomTabBar>
  </view>
</template>

<script>
import CustomTabBar from '@/components/custom/tabbar.vue';

export default {
  components: {
    CustomTabBar
  },
  props: {
    showTabBar: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style lang="scss">
.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content-area {
  flex: 1;
  padding-bottom: 100rpx; /* 预留TabBar的高度 */
}
</style> 