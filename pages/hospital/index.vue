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
  </view>
</template>

<script setup>
import bannerBg from '@/static/resource/banner-bg.jpg'
import { ref } from 'vue'
// 当前进度百分比
const currentPercent = ref(12.8)
// 当前进度文字
const currentProgress = ref(1)
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
</style>