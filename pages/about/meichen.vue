<template>
  <view class="about-container">
    <view class="header">
      <uni-icons type="back" size="24" color="#333" @click="goBack"></uni-icons>
      <text class="title">关于某某律师事务所</text>
    </view>

    <scroll-view class="content" scroll-y="true" show-scrollbar="true">
      <!-- 公司logo和基本信息 -->
      <view class="logo-section">
        <image class="logo" src="/static/logo.png" mode="aspectFit"></image>
        <text class="company-name">某某律师事务所</text>
        <text class="company-slogan">专业 · 诚信 · 卓越</text>
      </view>

      <!-- 公司简介 -->
      <view class="section">
        <view class="section-title">公司简介</view>
        <view class="section-content">
          某某律师事务所成立于2010年，是一家集法律咨询、诉讼服务、法律顾问于一体的综合性律师事务所。我们汇聚了来自全国各地的优秀法律人才，致力于为企业和个人提供全方位、高质量的法律服务。
        </view>
      </view>

      <!-- 发展历程 -->
      <view class="section">
        <view class="section-title">发展历程</view>
        <view class="timeline">
          <view class="timeline-item">
            <text class="year">2010</text>
            <text class="event">某某律师事务所成立</text>
          </view>
          <view class="timeline-item">
            <text class="year">2015</text>
            <text class="event">获得国家司法部颁发的律师事务所执业证书</text>
          </view>
          <view class="timeline-item">
            <text class="year">2018</text>
            <text class="event">入选全国优秀律师事务所</text>
          </view>
          <view class="timeline-item">
            <text class="year">2021</text>
            <text class="event">启动法律咨询数字化平台</text>
          </view>
        </view>
      </view>

      <!-- 业务范围 -->
      <view class="section">
        <view class="section-title">业务范围</view>
        <view class="business-areas">
          <view class="business-item">
            <text class="icon">⚖️</text>
            <text>民商事诉讼</text>
          </view>
          <view class="business-item">
            <text class="icon">🏢</text>
            <text>公司法律顾问</text>
          </view>
          <view class="business-item">
            <text class="icon">💼</text>
            <text>投资并购法律服务</text>
          </view>
          <view class="business-item">
            <text class="icon">📝</text>
            <text>合同法律审核</text>
          </view>
          <view class="business-item">
            <text class="icon">🌐</text>
            <text>知识产权保护</text>
          </view>
          <view class="business-item">
            <text class="icon">👥</text>
            <text>劳动争议解决</text>
          </view>
        </view>
      </view>

      <!-- 团队介绍 -->
      <view class="section">
        <view class="section-title">专业团队</view>
        <view class="team-intro">
          <text>我们拥有一支由资深律师、法学专家组成的专业团队。团队成员平均执业经验超过10年，曾多次成功代理重大疑难案件，为客户提供精准、高效的法律解决方案。</text>
        </view>
      </view>

      <!-- 联系方式 -->
      <view class="section">
        <view class="section-title">联系我们</view>
        <view class="contact-info">
          <view class="contact-item" @click="copyText('service@meichen.com')">
            <text class="icon">✉️</text>
            <text>service@meichen.com</text>
          </view>
          <view class="contact-item" @click="callPhone('400-888-8888')">
            <text class="icon">📞</text>
            <text>400-888-8888</text>
          </view>
          <view class="contact-item">
            <text class="icon">📍</text>
            <text>北京市朝阳区东三环中路7号</text>
          </view>
        </view>
      </view>

      <!-- 法律声明 -->
      <view class="section">
        <view class="section-title">法律声明</view>
        <view class="links">
          <view class="link-item" @click="navigateToUserAgreement">
            <text>用户协议</text>
            <text class="arrow">›</text>
          </view>
          <view class="link-item" @click="navigateToPrivacyPolicy">
            <text>隐私政策</text>
            <text class="arrow">›</text>
          </view>
        </view>
      </view>
    </scroll-view>

    <view class="footer">
      <text>© 2024 某某律师事务所 版权所有</text>
      <text>京ICP备12345678号-1</text>
    </view>
  </view>
</template>

<script setup>
import { navigateToUrl } from '@/utils/navigateTo';

function goBack() {
  uni.navigateBack();
}

function navigateToUserAgreement() {
  navigateToUrl('/components/user/agreement');
}

function navigateToPrivacyPolicy() {
  navigateToUrl('/components/user/privacy');
}

function copyText(text) {
  uni.setClipboardData({
    data: text,
    success: () => {
      uni.showToast({
        title: '已复制到剪贴板',
        icon: 'none'
      });
    }
  });
}

function callPhone(phoneNumber) {
  uni.makePhoneCall({
    phoneNumber: phoneNumber
  });
}
</script>

<style lang="scss" scoped>
.about-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f7fa;
}

.header {
  display: flex;
  align-items: center;
  padding: 20rpx;
  background-color: #ffffff;
  box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.05);
  
  uni-icons {
    margin-right: 20rpx;
  }
  
  .title {
    font-size: 36rpx;
    font-weight: 600;
    color: #333;
  }
}

.content {
  flex: 1;
  padding: 30rpx;
  overflow-y: scroll;
}

.logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40rpx;

  .logo {
    width: 200rpx;
    height: 200rpx;
    margin-bottom: 20rpx;
  }

  .company-name {
    font-size: 36rpx;
    font-weight: 600;
    color: #2c3e50;
  }

  .company-slogan {
    font-size: 28rpx;
    color: #666;
    margin-top: 10rpx;
  }
}

.section {
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.06);

  .section-title {
    font-size: 34rpx;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 20rpx;
    position: relative;
    padding-left: 20rpx;
    
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 6rpx;
      width: 8rpx;
      height: 28rpx;
      background: #2d8cf0;
      border-radius: 4rpx;
    }
  }

  .section-content {
    color: #4a5568;
    font-size: 28rpx;
    line-height: 1.7;
  }
}

.timeline {
  .timeline-item {
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;
    
    .year {
      font-size: 32rpx;
      font-weight: 600;
      color: #2d8cf0;
      margin-right: 20rpx;
      min-width: 100rpx;
    }

    .event {
      font-size: 28rpx;
      color: #4a5568;
    }
  }
}

.business-areas {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;

  .business-item {
    display: flex;
    align-items: center;
    background-color: #f8f9ff;
    padding: 16rpx 24rpx;
    border-radius: 12rpx;

    .icon {
      margin-right: 10rpx;
      font-size: 36rpx;
    }

    text {
      font-size: 28rpx;
      color: #2c3e50;
    }
  }
}

.team-intro {
  color: #4a5568;
  font-size: 28rpx;
  line-height: 1.7;
}

.contact-info {
  .contact-item {
    display: flex;
    align-items: center;
    margin-bottom: 16rpx;
    padding: 16rpx;
    background-color: #f8f9ff;
    border-radius: 12rpx;

    .icon {
      margin-right: 16rpx;
      font-size: 36rpx;
    }

    text {
      font-size: 28rpx;
      color: #2c3e50;
    }

    &:active {
      background-color: rgba(45, 140, 240, 0.1);
    }
  }
}

.links {
  .link-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx 0;
    border-bottom: 1rpx solid #f0f0f0;

    text {
      font-size: 30rpx;
      color: #2c3e50;
    }

    .arrow {
      color: #999;
      font-size: 40rpx;
    }

    &:active {
      background-color: rgba(45, 140, 240, 0.1);
    }
  }
}

.footer {
  padding: 30rpx;
  background-color: #ffffff;
  text-align: center;
  font-size: 24rpx;
  color: #666;
  
  text {
    display: block;
    margin-bottom: 10rpx;
  }
}
</style> 