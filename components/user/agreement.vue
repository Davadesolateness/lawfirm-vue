<template>
  <view class="agreement-page">
    <!-- 协议头部 -->
    <view class="header">
      <text class="title">律师在线服务平台用户协议</text>
      <text class="effective-date">生效日期：2023年10月1日</text>
    </view>

    <!-- 协议正文 -->
    <scroll-view class="content" scroll-y>
      <!-- 导言部分 -->
      <view class="section introduction">
        <text class="emphasis">欢迎使用[律师在线]服务平台！</text>
        <text>请仔细阅读本协议，确认充分理解各条款内容后再进行注册或使用服务。</text>
      </view>

      <!-- 条款内容 -->
      <view class="section">
        <h3>一、服务定义</h3>
        <p>1.1 本平台是由[公司名称]运营的法律咨询服务中介平台，为用户与执业律师提供信息对接服务。</p>
        <p>1.2 平台服务包括但不限于：法律咨询预约、文书模板下载、律师信息查询、在线咨询等功能。</p>
      </view>

      <view class="section">
        <h3>二、用户资格</h3>
        <p>2.1 注册用户须为具有完全民事行为能力的自然人、法人或其他组织</p>
        <p>2.2 法律执业人员注册需提交有效律师执业证书并通过平台审核</p>
        <p>2.3 不得冒充他人或机构进行虚假注册</p>
      </view>

      <view class="section">
        <h3>三、服务规范</h3>
        <p>3.1 用户咨询内容不得包含：</p>
        <p class="indent">• 违反宪法确定的基本原则</p>
        <p class="indent">• 危害国家安全的内容</p>
        <p class="indent">• 侵害他人合法权益的信息</p>
        <p>3.2 平台提供的中立性：</p>
        <p class="indent">• 不参与用户与律师的线下交易</p>
        <p class="indent">• 不对律师服务质量作担保</p>
      </view>

      <view class="section">
        <h3>四、费用说明</h3>
        <p>4.1 基础咨询服务费按平台公示标准收取</p>
        <p>4.2 复杂案件需线下签订专项服务协议</p>
        <p>4.3 费用纠纷应通过平台争议解决机制处理</p>
      </view>

      <view class="section">
        <h3>五、隐私条款</h3>
        <p>5.1 咨询内容加密存储，仅限案件相关律师查看</p>
        <p>5.2 身份信息采用三级权限管理体系</p>
        <p>5.3 匿名化数据可能用于行业分析报告</p>
      </view>

      <view class="section">
        <h3>六、免责声明</h3>
        <p>6.1 平台不承担律师执业行为引发的法律责任</p>
        <p>6.2 因不可抗力导致服务中断的免责情形</p>
        <p>6.3 用户自行承担信息传输延迟风险</p>
      </view>

      <view class="section">
        <h3>七、协议变更</h3>
        <p>7.1 修改后的协议在平台公告7日后生效</p>
        <p>7.2 重大变更将通过注册手机号进行通知</p>
        <p>7.3 继续使用服务视为接受修订条款</p>
      </view>
    </scroll-view>


  </view>
</template>

<script setup>

</script>

<style lang="scss">
.agreement-page {
  padding: 32rpx;
  background: #f8f9fb;
  min-height: 100vh;

  .header {
    margin-bottom: 48rpx;
    .title {
      display: block;
      font-size: 38rpx;
      font-weight: 600;
      color: #1a1a1a;
      margin-bottom: 16rpx;
    }
    .effective-date {
      font-size: 26rpx;
      color: #909399;
    }
  }

  .content {
    height: calc(100vh - 300rpx);
    background: #fff;
    border-radius: 24rpx;
    padding: 32rpx;
    box-shadow: 0 4rpx 24rpx rgba(0,0,0,0.06);

    .section {
      margin-bottom: 48rpx;
      &:last-child {
        margin-bottom: 0;
      }

      h3 {
        font-size: 32rpx;
        color: #2d8cf0;
        margin-bottom: 24rpx;
        padding-left: 16rpx;
        border-left: 6rpx solid #e6f7ff;
      }

      p {
        font-size: 28rpx;
        color: #4a5568;
        line-height: 1.8;
        margin-bottom: 20rpx;

        &.indent {
          text-indent: 2em;
          color: #718096;
          &::before {
            content: '•';
            margin-right: 8rpx;
            color: #cbd5e0;
          }
        }

        &.emphasis {
          color: #1a1a1a;
          font-weight: 500;
        }
      }
    }

    .introduction {
      background: #f6fbff;
      padding: 32rpx;
      border-radius: 16rpx;
      margin-bottom: 40rpx;
      text {
        display: block;
        font-size: 28rpx;
        line-height: 1.6;
        &:first-child {
          color: #2d8cf0;
          font-weight: 500;
          margin-bottom: 16rpx;
        }
      }
    }
  }

  .action-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(180deg, rgba(248,249,251,0) 0%, #f8f9fb 60%);
    padding: 32rpx;
    .agree-btn {
      background: #2d8cf0;
      color: #fff;
      height: 96rpx;
      border-radius: 16rpx;
      font-size: 32rpx;
      box-shadow: 0 8rpx 24rpx rgba(45,140,240,0.3);
      &:active {
        background: #1c7ae6;
        transform: scale(0.98);
      }
    }
  }

  /* 滚动条美化 */
  ::-webkit-scrollbar {
    width: 6rpx;
  }
  ::-webkit-scrollbar-thumb {
    background: #d9e1e8;
    border-radius: 4rpx;
  }
}
</style>