<template>
  <view class="page-container">
    <view class="page-content">
      <slot></slot>
    </view>
    <CustomTabBar></CustomTabBar>
  </view>
</template>

<script setup>
import CustomTabBar from '@/components/custom/tabbar'
</script>

<style>
.page-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.page-content {
  flex: 1;
  padding-bottom: 50px; /* 为底部tabBar预留空间 */
}
</style> 