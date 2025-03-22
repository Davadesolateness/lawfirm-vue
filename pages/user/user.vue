<template>
  <view class="content">
    <view class='member-top'>
      <image class='bg-img' src='/static/image/member-bg.png'></image>
      <view class='member-top-c'>
        <template v-if="hasLogin">
          <image class='user-head-img' mode="aspectFill" :src='userInfo.avatar'></image>
          <view class='user-name'>{{ userInfo.nickname }}</view>
          <view class="fz12 grade" v-if="userInfo.grade_name">
            {{ userInfo.grade_name }}
          </view>
        </template>
        <template v-else>
          <!-- #ifdef H5 || APP-PLUS -->
          <!--
                    <image class='user-head-img' mode="aspectFill" :src='$store.state.config.shop_logo'></image>
          -->
          <view class="login-btn" @click="toLogin">
            登录/注册
          </view>
          <!-- #endif -->
          <!-- #ifdef MP-WEIXIN -->
          <view class="user-head-img">
            <open-data type="userAvatarUrl"></open-data>
          </view>
          <view>
            <button class="login-btn" hover-class="btn-hover" @click="goLogin()">授权登录</button>
          </view>
          <!-- #endif -->
          <!-- #ifdef MP-ALIPAY -->
          <view class="user-head-img"></view>
          <view>
            <button class="login-btn" open-type="getAuthorize" @click="getALICode" hover-class="btn-hover">授权登录
            </button>
          </view>
          <!-- #endif -->
        </template>
      </view>
    </view>

    <!-- 订单列表信息 -->
    <view class='cell-group'>
      <view class='cell-item right-img' @click="router.push('/order/orderlist')">
        <view class='cell-item-hd'>
          <view class='cell-hd-title'>我的订单</view>
        </view>
        <view class='cell-item-ft'>
          <image class='cell-ft-next icon' src='/static/image/right.png'></image>
        </view>
      </view>
    </view>

    <view class='member-grid'>
      <view class='member-item' v-for="(item, index) in ORDER_ITEMS" :key="index"
            @click="orderNavigateHandle('../order/orderlist', index + 1)">
        <view class="badge color-f" v-if="item.nums">{{ item.nums }}</view>
        <image class='member-item-icon' :src='item.icon'></image>
        <text class='member-item-text'>{{ item.name }}</text>
      </view>
      <view class='member-item' @click="goAfterSaleList">
        <view class="badge color-f" v-if="afterSaleNums != 0">{{ afterSaleNums }}</view>
        <image class='member-item-icon' src='/static/image/me-ic-evaluate.png'></image>
        <text class='member-item-text'>退换货</text>
      </view>
    </view>
    <!-- 订单列表end -->

    <!-- 其他功能菜单 -->
    <view class='cell-group margin-cell-group right-img'>

      <view class='cell-item' v-for="(item, index) in UTILITY_MENUS" :key="index" v-show="item.unShowItem">
        <view class='cell-item-hd' @click="this.$router.push(item.router)">
          <image class='cell-hd-icon' :src='item.icon'></image>
          <view class='cell-hd-title'>{{ item.name }}</view>
        </view>
        <view class='cell-item-ft'>
          <image class='cell-ft-next icon' src='/static/image/right.png'></image>
        </view>
      </view>
      <!-- #ifdef H5 || APP-PLUS -->
      <view class='cell-item'>
        <view class='cell-item-hd' @click="showChat()">
          <image class='cell-hd-icon' src='/static/image/me-ic-phone.png'></image>
          <view class='cell-hd-title'>联系客服</view>
        </view>
        <view class='cell-item-ft'>
          <image class='cell-ft-next icon' src='/static/image/right.png'></image>
        </view>
      </view>
      <!-- #endif -->
      <!-- #ifdef MP-WEIXIN -->
      <view class='cell-item'>
        <button class="cell-item-hd " hover-class="none" open-type="contact" bindcontact="showChat"
                :session-from="kefupara">
          <image src='/static/image/me-ic-phone.png' class='cell-hd-icon'></image>
          <view class='cell-hd-title'>联系客服</view>
        </button>
        <view class='cell-item-ft'>
          <image class='cell-ft-next icon' src='/static/image/right.png'></image>
        </view>
      </view>
      <!-- #endif -->
      <!-- #ifdef MP-ALIPAY -->
      <view class='cell-item'>
        <contact-button icon="/static/image/kefu2.png" size="170rpx*76rpx" tnt-inst-id="WKPKUZXG" scene="SCE00040186"
                        class="cell-item-hd " hover-class="none"/>
        <view class='cell-item-ft'>
          <image class='cell-ft-next icon' src='/static/image/right.png'></image>
        </view>
      </view>
      <!-- #endif -->
    </view>

    <view class='cell-group margin-cell-group right-img' v-if="isLawyer">
      <view class='cell-item' v-for="(item, index) in CLERK_MENUS" :key="index">
        <view class='cell-item-hd' @click="navigateToHandle(item.router)">
          <image class='cell-hd-icon' :src='item.icon'></image>
          <view class='cell-hd-title'>{{ item.name }}</view>
        </view>
        <view class='cell-item-ft'>
          <image class='cell-ft-next icon' src='/static/image/right.png'></image>
        </view>
      </view>
    </view>
    <!-- 其他功能菜单end -->
    <lawfirm></lawfirm>

  </view>
</template>
<script setup>
import {ref} from 'vue';
import lawfirm from '@/componpents/lawfirm';

let hasLogin = false;
let userInfo = {}; // 用户信息
let isLawyer = true;   // 律师身份标识，如果是律师的话，展示该页面
let ORDER_ITEMS = [
  {name: '待付款', icon: '/static/image/me-ic-obligation.png', nums: 0},
  {name: '待发货', icon: '/static/image/me-ic-sendout.png', nums: 0},
  {name: '待收货', icon: '/static/image/me-ic-receiving.png', nums: 0},
  {name: '待评价', icon: '/static/image/me-ic-evaluate.png', nums: 0}
];
let UTILITY_MENUS = {
  distribution: {
    name: '分销中心',
    icon: '/static/image/distribution.png',
    router: '../distribution/user',
    unShowItem: true
  },
  coupon: {name: '我的优惠券', icon: '/static/image/ic-me-coupon.png', router: '/user/userInfo', unShowItem: true},
  balance: {name: '我的余额', icon: '/static/image/ic-me-balance.png', router: '/order/orderList', unShowItem: true},
  integral: {name: '我的积分', icon: '/static/image/integral.png', router: '/order/orderList', unShowItem: true},
  address: {name: '地址管理', icon: '/static/image/me-ic-site.png', router: '/order/orderList', unShowItem: true},
  collection: {
    name: '我的收藏',
    icon: '/static/image/ic-me-collect.png',
    router: '../collection/index',
    unShowItem: true
  },
  history: {name: '我的足迹', icon: '/static/image/ic-me-track.png', router: '../history/index', unShowItem: true},
  invite: {name: '邀请好友', icon: '/static/image/ic-me-invite.png', router: '../invite/index', unShowItem: true},
  setting: {name: '系统设置', icon: '/static/image/me-ic-set.png', router: '../setting/index', unShowItem: true}
};

let CLERK_MENUS = [
  {name: '提货单列表', icon: '/static/image/me-ic-phone.png', router: '../take_delivery/list'},
  {name: '提货单核销', icon: '/static/image/me-ic-about.png', router: '../take_delivery/index'}
];
function initUserInfo(){

}


</script>


<script >
export default {
  name: "user",
  onShow: function() {
    console.log("this is user")
  },

}
</script>

<style lang="css">
.cell-item {
  padding: 20upx 26upx 20upx 0;
  width: 724upx;
  margin-left: 26upx;
  border-bottom: 2upx solid #f3f3f3;
  position: relative;
  overflow: hidden;
  background-color: #fff;
  color: #333;
  display: table;
  min-height: 90upx;
}

.right-img {
  border-bottom: 0;
}

.member-top {
  position: relative;
  width: 100%;
  height: 340upx;
}

.bg-img {
  position: absolute;
  width: 100%;
  height: 100%;
}

.member-top-c {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.user-head-img {
  display: block;
  width: 160upx;
  height: 160upx;
  border-radius: 50%;
  overflow: hidden;
  background-color: rgba(255, 255, 255, 0.7);
  margin: 0 auto 16upx;
}

.user-name {
  font-size: 30upx;
  color: #fff;
  margin-bottom: 16upx;
}

.grade {
  color: #FFF;
}

.member-grid {
  background-color: #fff;
  border-top: 2upx solid #eee;
  padding: 20upx 0;
}

.margin-cell-group {
  margin: 20upx 0;
  color: #666666;
}

.badge {
  left: 80upx;
  top: -6upx;
}

button.cell-item-hd {
  background-color: #fff;
  padding: 0;
  line-height: 1.4;
  color: #333;
}

button.cell-item-hd:after {
  border: none;
}

.login-btn {
  color: #fff;
  width: 180upx;
  height: 50upx;
  line-height: 50upx;
  border-radius: 25upx;
  background: #ff7159;
  font-size: 12px;
}
</style>
