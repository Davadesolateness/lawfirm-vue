<template>
  <view class="header text-white">
    <view class="padding-xl flex align-start bg" style="background-image: url({{system.user_bg}});">
      <view class="flex align-center flex-sub">
        <image class="round" mode="aspectFill" src="{{userInfo.is_law!=0?userInfo.avatarUrl:'/static/icon/user_none.png'}}" style="width: 100rpx;height: 100rpx;background:#f3f3f3"></image>
        <view class="flex justify-between align-center flex-sub">
          <view class="padding-left-sm">
            <view bind:tap="login" class="text-df">{{userInfo.gender.length?userInfo.nickName:'立即登录'}}</view>
            <view class="text-sm padding-top-sm" wx:if="{{userInfo.gender.length}}">{{userInfo.phone||'未绑定手机号'}}</view>
            <view class="text-sm padding-top-sm" wx:else>当前身份: {{userInfo.nickName||'游客'}}</view>
          </view>
          <view @click="updeta" class="text-xl padding-right" wx:if="{{userInfo.gender}}">
            <view class="{{updeta&&'updeta'}}">
              <text class="yzd-gengxin"></text>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="nav bg-white padding-lr-xl grid col-5">
      <view @click="toPage" class="flex flex-direction align-center justify-center padding-sm" data-key="index" data-page="lawyer_orders" data-value="{{index+1}}" wx:for="{{nav}}">
        <text class="nav_text {{item.icon}}" ></text>
        <view class="text-sm padding-top-xs">{{item.title}}</view>
      </view>
    </view>
  </view>
  <form bindsubmit="submitFromId">
    <view class="padding-top" style="padding-left: 25rpx;padding-right: 25rpx;">
      <view class="bg-white padding-lr-sm" style="border-radius: 15rpx;">
        <button @click="toPage" class="item flex align-center text-lg" data-page="lawyer_orders" formType="submit">
          <text class="yzd-order" ></text>
          <view class="padding-left-sm flex-sub text-df">服务订单
          </view>
          <text class="cuIcon-right text-gray"></text>
        </button>
        <button @click="toPage" class="item flex align-center text-lg" data-page="orders" formType="submit">
          <text class="yzd-activity" ></text>
          <view class="padding-left-sm flex-sub text-df">商城订单
          </view>
          <text class="cuIcon-right text-gray"></text>
        </button>
        <button @click="toPage" class="item flex align-center text-lg" data-page="collect" formType="submit">
          <text class="yzd-select" ></text>
          <view class="padding-left-sm flex-sub text-df">我的收藏
          </view>
          <text class="cuIcon-right text-gray"></text>
        </button>
        <button @click="toPage" class="item flex align-center text-lg" data-page="fenxiao_settling_in" formType="submit" wx:if="{{fx_title&&system.fx_state}}">
          <text class="yzd-fenxiao" ></text>
          <view class="padding-left-sm flex-sub text-df">{{fx_title}}
          </view>
          <text class="cuIcon-right text-gray"></text>
        </button>
        <button @click="toPage" class="item flex align-center text-lg" data-page="wenda_wode" formType="submit" wx:if="{{system.wenda&&system.wenda.state=='1'}}">
          <text class="cuIcon-discover" ></text>
          <view class="padding-left-sm flex-sub text-df">我的{{system.wenda.title||'问答'}}
          </view>
          <text class="cuIcon-right text-gray"></text>
        </button>
        <button bindgetphonenumber="getPhoneNumber" class="item flex align-center text-lg" formType="submit" openType="getPhoneNumber" wx:if="{{userInfo.gender}}">
          <text class="yzd-mobilephone" ></text>
          <view class="padding-left-sm flex-sub text-df">更新手机号
            <view class="cu-tag round bg-red sm margin-left" wx:if="{{userInfo&&!userInfo.phone}}">未绑定</view>
          </view>
          <text class="cuIcon-right text-gray"></text>
        </button>
      </view>
    </view>
    <view class="padding-top" style="padding-left: 25rpx;padding-right: 25rpx;">
      <view class="bg-white padding-lr-sm" style="border-radius: 15rpx;">
        <button @click="toPage" class="item flex align-center text-lg" data-page="helper" formType="submit">
          <view class="padding-left-sm flex-sub text-df">帮助中心
          </view>
          <text class="cuIcon-right text-gray"></text>
        </button>
        <button @click="toPage" class="item flex align-center text-lg" data-page="about" formType="submit">
          <view class="padding-left-sm flex-sub text-df">关于我们
          </view>
          <text class="cuIcon-right text-gray"></text>
        </button>
        <button class="item flex align-center text-lg" formType="submit" openType="contact">
          <view class="padding-left-sm flex-sub text-df">联系客服
          </view>
          <text class="cuIcon-right text-gray"></text>
        </button>
        <button @click="toPage" class="item flex align-center text-lg" data-page="feedback" formType="submit">
          <view class="padding-left-sm flex-sub text-df">意见反馈
          </view>
          <text class="cuIcon-right text-gray"></text>
        </button>
        <button @click="toPage" class="item flex align-center text-lg" data-page="clearCache" formType="submit">
          <view class="padding-left-sm flex-sub text-df">清除缓存
          </view>
        </button>
      </view>
    </view>
    <view class="padding-top" style="padding-left: 25rpx;padding-right: 25rpx;">
      <view class="bg-white padding-lr-sm" style="border-radius: 15rpx;">
        <button @click="toPage" class="item flex align-center text-lg" data-page="{{law_item}}" formType="submit" openType="{{i.openType}}" wx:if="{{law_item.page=='l_index'||system.law_is_inset==2}}">
          <text class="{{law_item.icon}}" ></text>
          <view class="padding-left-sm flex-sub text-df">{{law_item.title}}
          </view>
          <text class="cuIcon-right text-gray"></text>
        </button>
      </view>
    </view>
  </form>
  <login isShow="{{isLogin}}" ></login>
  <view @click="call" class="flex flex-direction align-center justify-center padding-tb">
    <image mode="widthFix" src="{{}}" style="width: 80rpx;" wx:if="{{}}"></image>
    <view class="padding-left-xs text-xs text-grey">{{}}</view>
  </view>
  <tabbar show="{{show_tabbar}}"></tabbar>
  <blacklist isShow="{{userInfo.state==1}}"></blacklist>

</template>

<script setup >
import userservice from "./userservice";

function initUserInfo(){
  let  params = {};
  userservice.getUserInfo(params).then(res=>{
    if (res.status == '0'){
      //赋值
    }
  }).catch(rej=>{
    if(rej.statusText?.message){
      this.$alert(rej.statusText?.message)
      // this.$message.error(rej.statusText?.message)
    }
  });

}

export default {
  name : "User"
}

function toPage(){

}
</script>


<style scoped lang="css">
.header {
  height: 377rpx;
  position: relative;
}

.bg {
  height: 342rpx;
  padding-top: 60rpx;
  background-size: 100% 100%;
}

.header .nav {
  position: absolute;
  width: 706rpx;
  height: 168rpx;
  border-radius: 15rpx;
  left: 25rpx;
  bottom: 0rpx;
  font-size: 400rpx;
}

.header .nav text {
  font-size: 55rpx;
  color: #2363fc;
}

.item {
  min-height: 100rpx;
  border-bottom: 1rpx solid rgba(0,0,0,0.05);
}

.item text:first-child {
  font-size: 45rpx;
  color: #2363fc;
}

.item:last-child {
  border-width: 0;
}

.updeta {
  -webkit-animation: rotate .8s linear infinite;
}

@-webkit-keyframes rotate {
  0% {
    -webkit-transform: rotate(0deg);
  }

  25% {
    -webkit-transform: rotate(-90deg);
  }

  50% {
    -webkit-transform: rotate(-180deg);
  }

  75% {
    -webkit-transform: rotate(-270deg);
  }

  100% {
    -webkit-transform: rotate(-360deg);
  }
}
</style>
