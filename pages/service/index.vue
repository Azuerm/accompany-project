<template>
  <view>
    <view class="od-banner" :style="{ backgroundImage: `url(${bannerBg})` }">
      <!-- 进度条 -->
      <view class="od-progress">
        <view class="od-progress-bar" :style="{width: currentPercent ? currentPercent + '%' : '12.8%'}"></view>
      </view>
      <!-- 进度条文本 -->
      <view class="od-progress-text">
        <view class="od-progress-item" :style="{fontWeight: currentProgress == 1 ? 'bold' : 'normal'}">
          <text class="od-item-status">填写订单</text>
        </view>
        <view class="od-progress-item" :style="{fontWeight: currentProgress == 2 ? 'bold' : 'normal'}">
          <text class="od-item-status">在线支付</text>
        </view>
        <view class="od-progress-item" :style="{fontWeight: currentProgress == 3 ? 'bold' : 'normal'}"> 
          <text class="od-item-status">专人服务</text>
        </view>
        <view class="od-progress-item" :style="{fontWeight: currentProgress == 4 ? 'bold' : 'normal'}">
          <text class="od-item-status">服务完成</text>
        </view>
      </view>
    </view>
    <view class="pub-box">
      <view class="put-box-content">
        <view class="put-title">
          <image
            :src="serviceList.icon_image ? serviceList.icon_image_url : defaultAvatar"
            class="put-icon"
          />
          <text class="put-type">{{ serviceList.name }}</text>
        </view>
        <view class="put-text">
          <view class="put-text-gray">服务内容</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import bannerBg from '@/static/resource/banner-bg.jpg'
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import defaultAvatar from '@/static/resource/avatar.png'
// 当前进度百分比
const currentPercent = ref(12.8)
// 当前进度文字
const currentProgress = ref(1)
onLoad((options) => {
  console.log('上级页面传递过来的参数：',options);
  getHospitalData(options)
})
const serviceList = ref({})
const app = getApp()
// 页面服务数据
const getHospitalData = (options) => {
  app.globalData.utils.request({
    url: '/Service/order',
    data: {
      svid: options.svid
    },
    success: (res) => {
      serviceList.value = res.data.service
      console.log('服务数据',serviceList.value)
    }
  })
}
</script>

<style lang="scss" scoped>
.od-banner  {
  width: 100%;
  height: 250rpx;
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
}
.od-banner .od-progress {
  height: 38rpx;
  background-color: #fff;
  border-radius: 20rpx;
  width: 85%;
  overflow: hidden;
  margin-bottom: 20rpx;
  position: relative
}
// 进度条填充
.od-banner .od-progress .od-progress-bar {
  height: 75%;
  border-radius: 20rpx;
  position: absolute;
  top: 50%;
  left: 6rpx;
  right: 6rpx;
  transform: translateY(-50%);
  background-image: linear-gradient(to right, #50e7a3, #2de2e8);
  transition: width 0.3s ease;
}
.od-banner .od-progress-text {
  margin-top: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 85%;
  overflow: hidden;
}
.od-banner .od-progress-text .od-progress-item{
  flex: 1;
  text-align: center;
  // color: #fff;
  // font-weight: bold;
}
.pub-box {
  position: absolute;
  width: calc(100% - 40rpx);
  top: 200rpx;
  left: 0;
  background-color: pink;
  margin: 20rpx 20rpx 0 20rpx;
}
.put-box-content {
  background-color: #fff;
  width: calc(100% - 40rpx);
  border-radius: 20rpx;
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  height: 90rpx;
  padding: 0 20rpx;
}
.put-box-content .put-title {
  flex: 1;
  display: flex;
  align-items: center;
}
.put-title image {
  width: 55rpx;
  height: 55rpx;
}
.put-title .put-type {
  font-weight: bold;
  margin-left: 20rpx;
}
.put-box-content .put-text {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.put-text .put-text-gray {
  font-size: 28rpx;
  color: #999
}
.put-text-gray::before {
  content: '';
  display: inline-block;
  width: 36rpx;
  height: 36rpx;
  background: url('/static/resource/exclaim.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  margin-right: 10rpx;
  vertical-align: middle;
}
</style>