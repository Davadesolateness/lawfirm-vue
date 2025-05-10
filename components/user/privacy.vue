<template>
  <view class="privacy-container">
    <!-- 头部 -->
    <view class="header">
      <text class="title">隐私权保护声明</text>
      <text class="subtitle">[律师在线服务平台]</text>
      <text class="version">更新日期：2023年10月1日</text>
    </view>

    <!-- 目录导航 -->
    <view class="nav-box">
      <text
          v-for="(item, index) in navList"
          :key="index"
          class="nav-item"
          @click="scrollToSection(index)"
      >{{ item }}</text>
    </view>

    <!-- 正文内容 -->
    <scroll-view class="content" scroll-y scroll-with-animation>
      <!-- 引言 -->
      <view class="section" id="section0">
        <text class="emphasis">尊敬的平台用户：</text>
        <text>我们深知法律咨询服务的敏感性，将按照《中华人民共和国个人信息保护法》及行业规范，采取严格措施保护您的隐私信息。</text>
      </view>

      <!-- 信息收集 -->
      <view class="section" id="section1">
        <h3>一、我们收集的信息</h3>
        <view class="card">
          <h4>1.1 主动提供信息</h4>
          <p>• 身份认证：律师执业证书编号、身份证信息（仅限律师用户）</p>
          <p>• 联系方式：手机号、微信号（用于咨询沟通）</p>
          <p>• 案件资料：上传的文书、证据材料（加密存储）</p>
        </view>

        <view class="card">
          <h4>1.2 自动获取信息</h4>
          <p>• 设备信息：IP地址、设备型号、操作系统版本</p>
          <p>• 行为数据：咨询时长、服务评价、页面浏览路径</p>
          <p>• 位置信息：仅当预约线下服务时获取定位授权</p>
        </view>
      </view>

      <!-- 信息使用 -->
      <view class="section" id="section2">
        <h3>二、信息使用方式</h3>
        <p>2.1 核心用途</p>
        <p class="indent">• 律师身份核验与资质展示</p>
        <p class="indent">• 案件需求与律师专长智能匹配</p>
        <p class="indent">• 法律文书电子送达服务</p>

        <p>2.2 改进服务</p>
        <p class="indent">• 咨询响应速度分析</p>
        <p class="indent">• 服务满意度统计</p>
        <p class="indent">• 功能使用热力图分析</p>
      </view>

      <!-- 信息共享 -->
      <view class="section" id="section3">
        <h3>三、信息共享原则</h3>
        <view class="notice-box">
          <uni-icons type="info" size="36rpx" color="#2d8cf0"></uni-icons>
          <text class="notice-text">未经您的明确同意，我们不会向第三方提供您的敏感个人信息</text>
        </view>

        <p>3.1 必要共享场景</p>
        <p class="indent">• 对接合作的律师事务所案件管理系统</p>
        <p class="indent">• 电子签名服务提供商（仅共享签署必要信息）</p>
        <p class="indent">• 司法机关依法调取数据</p>
      </view>

      <!-- 用户权利 -->
      <view class="section" id="section4">
        <h3>四、您的权利</h3>
        <view class="rights-grid">
          <view class="right-item">
            <uni-icons type="eye" size="40rpx" color="#10b981"></uni-icons>
            <text>查阅权</text>
          </view>
          <view class="right-item">
            <uni-icons type="compose" size="40rpx" color="#f59e0b"></uni-icons>
            <text>更正权</text>
          </view>
          <view class="right-item">
            <uni-icons type="trash" size="40rpx" color="#ef4444"></uni-icons>
            <text>删除权</text>
          </view>
        </view>
      </view>

      <!-- 安全措施 -->
      <view class="section" id="section5">
        <h3>五、安全保护措施</h3>
        <view class="security-card">
          <view class="security-item">
            <text class="tag">技术防护</text>
            <text>• AES-256加密存储\n• SSL传输加密\n• 数据访问三员管理</text>
          </view>
          <view class="security-item">
            <text class="tag">管理规范</text>
            <text>• 分级授权制度\n• 安全审计日志\n• 年度等保测评</text>
          </view>
        </view>
      </view>

      <!-- 其他条款 -->
      <view class="section" id="section6">
        <h3>六、其他条款</h3>
        <p>6.1 未成年人保护：不接受16周岁以下用户注册</p>
        <p>6.2 政策更新：通过站内信和短信双通道通知</p>
        <p>6.3 争议解决：由平台所在地有管辖权的法院管辖</p>
      </view>
    </scroll-view>

    <!-- 底部操作 -->
    <view class="footer">
      <button class="back-top" @click="scrollToTop">返回顶部</button>
      <text class="contact">联系我们：legal@service.com</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';

const navList = ref([
  '引言',
  '信息收集',
  '信息使用',
  '信息共享',
  '用户权利',
  '安全措施',
  '其他条款'
]);

const scrollToSection = (index) => {
  const query = uni.createSelectorQuery();
  query.select(`#section${index}`).boundingClientRect();
  query.exec(res => {
    uni.pageScrollTo({
      scrollTop: res[0].top - 100,
      duration: 300
    });
  });
};

const scrollToTop = () => {
  uni.pageScrollTo({
    scrollTop: 0,
    duration: 200
  });
};
</script>

<style lang="scss">
.privacy-container {
  padding: 32rpx;
  background: #f8fafc;
  min-height: 100vh;

  .header {
    margin-bottom: 40rpx;
    .title {
      display: block;
      font-size: 40rpx;
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 12rpx;
    }
    .subtitle {
      font-size: 28rpx;
      color: #64748b;
    }
    .version {
      display: block;
      font-size: 26rpx;
      color: #94a3b8;
      margin-top: 16rpx;
    }
  }

  .nav-box {
    display: flex;
    flex-wrap: wrap;
    gap: 20rpx;
    margin-bottom: 32rpx;
    .nav-item {
      padding: 12rpx 24rpx;
      background: #e2e8f0;
      border-radius: 8rpx;
      font-size: 26rpx;
      color: #475569;
      &:active {
        background: #cbd5e1;
      }
    }
  }

  .content {
    height: calc(100vh - 380rpx);
    .section {
      margin-bottom: 48rpx;
      .emphasis {
        display: block;
        color: #2563eb;
        font-weight: 500;
        margin-bottom: 24rpx;
      }

      h3 {
        font-size: 34rpx;
        color: #1e40af;
        margin-bottom: 32rpx;
        padding-left: 20rpx;
        border-left: 8rpx solid #dbeafe;
      }

      .card {
        background: #fff;
        border-radius: 16rpx;
        padding: 32rpx;
        margin-bottom: 24rpx;
        box-shadow: 0 4rpx 12rpx rgba(30, 64, 175, 0.05);
        h4 {
          color: #3b82f6;
          margin-bottom: 24rpx;
        }
        p {
          color: #475569;
          line-height: 1.8;
          margin-bottom: 16rpx;
        }
      }

      .notice-box {
        background: #eff6ff;
        padding: 24rpx;
        border-radius: 12rpx;
        display: flex;
        align-items: center;
        margin: 24rpx 0;
        .notice-text {
          color: #1d4ed8;
          margin-left: 16rpx;
        }
      }

      .rights-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 24rpx;
        .right-item {
          background: #fff;
          border-radius: 12rpx;
          padding: 32rpx;
          text-align: center;
          box-shadow: 0 4rpx 12rpx rgba(30, 64, 175, 0.08);
          text {
            display: block;
            margin-top: 16rpx;
            color: #475569;
          }
        }
      }

      .security-card {
        background: #fff;
        border-radius: 16rpx;
        padding: 32rpx;
        .security-item {
          margin-bottom: 32rpx;
          .tag {
            display: inline-block;
            background: #dbeafe;
            color: #1d4ed8;
            padding: 8rpx 16rpx;
            border-radius: 6rpx;
            margin-bottom: 16rpx;
          }
          text {
            white-space: pre-wrap;
            color: #475569;
          }
        }
      }
    }
  }

  .footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(180deg, rgba(248,250,252,0) 0%, #f8fafc 60%);
    padding: 32rpx;
    .back-top {
      background: #3b82f6;
      color: #fff;
      margin-bottom: 24rpx;
    }
    .contact {
      display: block;
      text-align: center;
      color: #64748b;
      font-size: 26rpx;
    }
  }

  /* 公共样式 */
  .indent {
    text-indent: 2em;
    color: #64748b;
    &::before {
      content: '•';
      margin-right: 8rpx;
      color: #94a3b8;
    }
  }
}
</style>