<template>
	<view class="" style="background-color: #EEF1EE; min-height: 100vh; overflow: hidden; position: relative;">
		<view style="margin-top: 20rpx;">
      <view class="user-info">
        <view class="user-image">
          <block v-if="userInfo.avatar">
            <image
              :src="userInfo.avatar_url"
              style="width: 150rpx; height: 150rpx; border-radius: 50%;"
            />
          </block>
          <block v-else> 
            <image
              :src="defaultAvatar"
              style="width: 150rpx; height: 150rpx; border-radius: 50%;"
            />
          </block>
        </view>
        <view class="user-name">
          {{ userInfo.nickname ? userInfo.nickname : '用户' + userInfo._id }}
          <image
            :src="editIcon"
          />
        </view>
      </view>
    </view>
    <view class="order-content">
      <view class="my-order">
        <view class="my-ordertext">
          我的订单
        </view>
        <view class="my-orderall">
          全部
        </view>
      </view>
      <view class="order-list">
        <view class="order-item" @tap="toOrder(1)">
          <view class="item-icon">
            <image :src="payIcon" mode="widthFix" />
            <text v-if="statistic.topays > 0">{{ statistic.topays }}</text>
          </view>
          <view class="item-text">待支付</view>
        </view>
        <view class="order-item"  @tap="toOrder(2)">
          <view class="item-icon">
            <image :src="serviceIcon" mode="widthFix" />
            <text v-if="statistic.todos > 0">{{ statistic.todos }}</text>
          </view>
          <view class="item-text">待服务</view>
        </view>
        <view class="order-item"  @tap="toOrder(3)">
          <view class="item-icon">
            <image :src="completeIcon" mode="widthFix" />
          </view>
          <view class="item-text">已完成</view>
        </view>
        <view class="order-item"  @tap="toOrder(4)">
          <view class="item-icon">
            <image :src="alreadyIcon" mode="widthFix" />
          </view>
          <view class="item-text">已取消</view>
        </view>
      </view>
    </view>
    <view class="order-select">
      <view class="select-item" @tap="toClient" style="border-bottom: 2rpx solid #eee;">
        <image class="item-logo" src="/static/resource/clients.png" mode="aspectFit" />
        <text class="item-name">服务对象管理</text>
        <image class="item-arrow" src="/static/resource/service_right.png" />
      </view>
      <view class="select-item">
        <!-- 小程序不允许JS主动调起转发，必须用button的open-type -->
        <button class="share-btn" open-type="share">
          <image class="item-logo" src="/static/resource/share.png" mode="aspectFit" />
          <text class="item-name">分享转发</text>
        </button>
        <image class="item-arrow" src="/static/resource/service_right.png" />
      </view>
    </view>
    <view class="xieyi">
      <text>用户协议</text> | <text>服务协议</text> | <text>资讯客服</text>
    </view>
	</view>
</template>

<script setup>
	import defaultAvatar from '@/static/resource/avatar.png'
  import editIcon from '@/static/resource/edit_name.png'
  import payIcon from '@/static/resource/wati_pay.png'
  import serviceIcon from '@/static/resource/wait_service.png'
  import completeIcon from '@/static/resource/complete.png'
  import alreadyIcon from '@/static/resource/already_cancel.png'
	import {
		ref,
	} from 'vue'
	import {
		onLoad,
    onShareAppMessage
	} from '@dcloudio/uni-app'
  const userInfo = ref({
    avatar: '',
    avatar_url: '',
    nickname: '',
    _id: '',
    seller_switch: 0
  })
  const statistic = ref({
    topays: 0,
    todos: 0
  })
  const app = getApp()
  onLoad(() => {
    app.globalData.utils.request({
      url: '/User/index',
      method: 'GET',
      header: {
        token: uni.getStorageSync('token')
      },
      success: (res) => {
        console.log('用户信息', res.data.statistic);
        userInfo.value = res.data.mine
        statistic.value = res.data.statistic
      }
    })
  })
  // 跳转到订单列表
  const toOrder = (type) => {
    app.globalData.orderType = type
    uni.switchTab({ url: '/pages/order/index' })
  }
  // 跳转到服务对象管理
  const toClient = () => {
    uni.navigateTo({ url: '/pages/clients/index' })
  }
  // 分享转发的分享信息
  onShareAppMessage(() => ({
    title: '陪诊小程序',
    path: '/pages/index/index',
    imageUrl: '/static/resource/banner-bg.jpg'
  }))
</script>

<style lang="scss" scoped>
.user-info {
  background-color: #fff;
  margin: 0 20rpx;
  padding: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.user-info .user-image {
  width: 150rpx; 
  height: 150rpx; 
  border-radius: 50%; 
  overflow: hidden;
  border: 2px solid #eee;
}
.user-image image {
  width: 100%;
  height: 100%;
}
.user-info .user-name {
  padding-top: 20rpx;
  font-size: 32rpx;
  font-weight: bold;
}
.user-name image {
  width: 38rpx;
  height: 38rpx;
  vertical-align: middle;
}
.user-info .user-name {
  padding-top: 20rpx;
  font-size: 32rpx;
  font-weight: bold;
}
.user-name image {
  width: 38rpx;
  height: 38rpx;
  vertical-align: middle;
}

.order-content {
  margin: 20rpx;
  background-color: #fff;
  padding: 20rpx;
  border-radius: 20rpx;
  overflow: hidden;
}
// 标题行：我的订单 + 全部
.order-content .my-order {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx;
  border-bottom: 2rpx solid #eee;
}
.my-order .my-ordertext {
  font-size: 32rpx;
}
.my-order .my-orderall {
  color: #999;
  font-size: 26rpx;
}
// 订单状态列表：四个均分一行
.order-content .order-list {
  display: flex;
  margin-top: 40rpx;
  padding-bottom: 10rpx;
}
.order-list .order-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}
// 图标容器作为角标的定位参照物
.order-item .item-icon {
  position: relative;
}
.item-icon image {
  width: 64rpx;
  height: 64rpx;
}
// 红色数量角标：定位在图标右上角
.item-icon text {
  position: absolute;
  top: -14rpx;
  right: -18rpx;
  min-width: 32rpx;
  height: 32rpx;
  line-height: 32rpx;
  padding: 0 6rpx;
  box-sizing: border-box;
  background-color: #fa5151;
  border-radius: 32rpx;
  color: #fff;
  font-size: 20rpx;
  text-align: center;
}
.order-item .item-text {
  margin-top: 14rpx;
  color: #333;
  font-size: 26rpx;
}
// 菜单列表：服务对象管理 / 分享转发
.order-select {
  margin: 20rpx;
  background-color: #fff;
  border-radius: 20rpx;
  overflow: hidden;
}
.order-select .select-item {
  position: relative;
  display: flex;
  align-items: center;
  height: 100rpx;
  padding: 0 20rpx;
}
.select-item .item-logo {
  flex-shrink: 0;
  width: 44rpx;
  height: 44rpx;
  margin-right: 16rpx;
}
.select-item .item-name {
  color: #333;
  font-size: 28rpx;
}
.select-item .item-arrow {
  position: absolute;
  right: 20rpx;
  width: 30rpx;
  height: 30rpx;
}
// 分享转发：重置button默认样式，内容铺满整行
.select-item .share-btn {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  background: transparent;
  text-align: left;
}
.share-btn::after {
  border: none;
}
.xieyi {
  color: #999;
  width: 100%;
  text-align: center;
  position: absolute;
  bottom: 20rpx;
  left: 50%;
  transform: translateX(-50%);
}
</style>
