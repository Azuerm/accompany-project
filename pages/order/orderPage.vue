<template>
	<view style="background-color: #EEF1EE; min-height: 100vh;">
    <view class="od-banner" :style="{ backgroundImage: `url(${bannerBg})` }">
			<!-- 进度条 -->
			<view class="od-progress">
				<view class="od-progress-inner">
          <view class="od-progress-bar" :style="{ width: currentPercent + '%' }" :class="{'gray-bar': currentPercent == 100}"></view>
        </view>
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
	import {
		ref,
    computed
	} from 'vue'
	import {
		onLoad
	} from '@dcloudio/uni-app'
  const app = getApp()
  // 订单数据
  const orderList = ref({})
  // 订单状态 => 进度映射
  const stateMap = {
    '待支付': {progress: 2, percent: 12.8 * 3},
    '待服务': {progress: 3, percent: 12.8 * 5},
    '已完成': {progress: 4, percent: 12.8 * 7},
    '已取消': {progress: 0, percent: 100},
  }
  // 当前进度百分比
	const currentPercent = computed(() => stateMap[orderList.value.trade_state]?.percent ?? 0) // 变量 ?? 默认值
	// 当前进度文字
	const currentProgress = computed(() => stateMap[orderList.value.trade_state]?.progress ?? 12.8)
  onLoad((params) => {
    getOrderDetail(params)
  })
  // 请求订单详情
  const getOrderDetail = (params) => {
    app.globalData.utils.request({
      url: '/order/detail',
      header: {
        token: uni.getStorageSync('token')
      },
      data: {
        oid: params.oid
      },
      success: (res) => {
        console.log('订单详情', res);
        orderList.value  = res.data
      }
    })
  }
</script>

<style lang="scss" scoped>
  .od-banner {
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
  // 负责进度条定位 
  .od-banner .od-progress .od-progress-inner {
    position: absolute;
		top: 50%;
		left: 6rpx;
		right: 6rpx;
		transform: translateY(-50%);
    height: 75%;
  }
	// 进度条填充
	.od-banner .od-progress .od-progress-bar {
		height: 100%;
		border-radius: 20rpx;
		background-image: linear-gradient(to right, #50e7a3, #2de2e8);
		transition: width 0.3s ease;
    overflow: hidden;
	}
  .od-banner .od-progress .gray-bar {
    background-image: none;
    background-color: #ccc;
  }
	.od-banner .od-progress-text {
		margin-top: 20rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 85%;
		overflow: hidden;
	}

	.od-banner .od-progress-text .od-progress-item {
		flex: 1;
		text-align: center;
		// color: #fff;
		// font-weight: bold;
	}
</style>
