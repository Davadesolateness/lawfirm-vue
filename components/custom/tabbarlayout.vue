<template>
    <view class="page-container">
      <view class="page-content">
        <slot></slot>
      </view>
      <TabBar></TabBar>
    </view>
  </template>
  
  <script setup>
  import TabBar from '@/components/custom/tabbar.vue';
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