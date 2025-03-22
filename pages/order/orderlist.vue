<template>
  <view class="content">
    <uni-segmented-control
        :current="tab"
        :values="items"
        @clickItem="onClickItem"
        style-type="text"
        active-color="#333"
    ></uni-segmented-control>
    <view class="order-list">

      <view class="goods-detail"
            v-if="list && list.length">
        <view class="order-item"
              v-for="(item, index) in list"
              :key="index"
        >
          <view class='cell-group'>
            <view class='cell-item'
                  @click="orderDetail(item.order_id)"
            >
              <view class='cell-item-hd'>
                <view class='cell-hd-title'>订单编号：{{ item.order_id }}</view>
              </view>
              <view class='cell-item-ft'>
                <text class='cell-ft-text'>{{ item.order_status_name }}</text>
              </view>
            </view>
          </view>
          <view class='img-list'>
            <view class='img-list-item'
                  v-for="(goods, key) in item.items"
                  :key="key"
            >
              <image class='img-list-item-l little-img have-none' :src='goods.image_url' mode='aspectFill'
                     lazy-load></image>
              <view class='img-list-item-r little-right'>
                <view class='little-right-t'>
                  <view class='goods-name list-goods-name'
                        @click="orderDetail(item.order_id)"
                  >{{ goods.name }}
                  </view>
                  <view class='goods-price'>￥{{ goods.price }}</view>
                </view>
                <view class="romotion-tip">
                  <view class="romotion-tip-item"
                        v-for="(promotion, k) in formatPromotions(goods.promotion_list)"
                        :key="k"
                  >
                    {{ promotion }}
                  </view>
                </view>
                <view class='goods-item-c'>
                  <view class='goods-buy'>
                    <view class='goods-salesvolume'
                          v-if="goods.addon !== null"
                    >{{ goods.addon }}
                    </view>
                    <view class='goods-num'>× {{ goods.nums }}</view>
                  </view>
                </view>
              </view>
            </view>
          </view>
          <view class='cell-group'>
            <view class='cell-item'>
              <view class='cell-item-ft goods-num'>
                <text class='cell-ft-text'>合计
                  <text class="red-price">￥ {{ item.order_amount }}</text>
                </text>
                <text class='cell-ft-text'>共 {{ item.items.length }} 件</text>
              </view>
            </view>
          </view>
          <view class='order-list-button'>

            <button class='btn btn-circle btn-g' hover-class="btn-hover" @click="orderDetail(item.order_id)">查看详情
            </button>

            <button class='btn btn-circle btn-w'
                    hover-class="btn-hover"
                    v-if="item.status === 1 && item.pay_status === 1"
                    @click="toPay(item.order_id)"
            >立即支付
            </button>


            <button class='btn btn-circle btn-w'
                    hover-class="btn-hover"
                    v-if="item.status === 1 && item.pay_status === 2 && item.ship_status === 3 && item.confirm === 2 && item.is_comment === 1"
                    @click="toEvaluate(item.order_id)"
            >立即评价
            </button>

          </view>
        </view>
        <uni-load-more
            :status="loadStatus"
        ></uni-load-more>
      </view>
      <view class="order-none" v-else>
        <image class="order-none-img" src="/static/image/order.png" mode=""></image>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  name: "orderList",

}
</script>

<script setup >
let list = [];
let loadStatus = '';
let items =
    [
      '全部',
      '待付款',
      '待发货',
      '待收货',
      '待评价',
    ];
let status = [0, 1, 2, 3, 4];// 订单状态 0全部 1待付款 2待发货 3待收货 4待评价
let isReload = false;
function toEvaluate(orderId) {

}

function toPay(orderId) {

}

function orderDetail(orderId) {

}

</script>


<style>.segmented-control {
  /*  #ifdef  H5  */
  top: 44px;
  /*  #endif  */
  /*  #ifndef  H5  */
  top: 0;
  /*  #endif  */
  width: 100%;
  background-color: #fff;
  position: fixed;

  z-index: 999;
}

.segmented-control-item {
  line-height: 70upx;
}

.order-list {
  margin-top: 64upx;
}

.order-item {
  margin-bottom: 20upx;
}

.img-list {
  margin-top: 2upx;
}

.cell-group, .img-list-item {
  background-color: #fff;
}

.cell-hd-title {
  font-size: 22upx;
  color: #666;
}

.cell-ft-text {
  top: 0;
  font-size: 22upx;
  color: #333;
}

.order-list-button {
  width: 100%;
  background-color: #fff;
  text-align: right;
  padding: 10upx 26upx;
  /* border-top: 2upx solid #f8f8f8; */
}

.order-list-button .btn {
  height: 50upx;
  line-height: 50upx;
}

.order-list-button .btn-w {
  margin-left: 20upx;
}

.goods-num .cell-ft-text {
  color: #999;
  line-height: 32upx;
}

.goods-num .cell-ft-text:first-child {
  margin-left: 10upx;
}

.order-none {
  text-align: center;
  padding: 200upx 0;
}

.order-none-img {
  width: 274upx;
  height: 274upx;
}

.goods-name {
  min-height: 74upx;
}
</style>