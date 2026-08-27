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
    <view class="order-status">
      <view class="order-box">
        <!-- 待支付 -->
        <block v-if="currentProgress == 2">
          <view class="order-status-text">
            <text>订单待支付</text>
          </view>
          <view class="order-time">
            请在 {{ formatCountdown(countdownMap['detail']) }} 内完成支付，超时订单将自动取消
          </view>
          <view class="order-btn">
            <button @click="dopay">立即支付 ({{ orderList.price }}元)</button>
          </view>
        </block>
      </view>
    </view>

     <!-- 二维码弹出层 -->
    <uni-popup ref="popupQrCode" type="center" :is-mask-click="false" background-color="#fff" border-radius=" 20rpx">
      <view class="pay-box">
        <view class="pay-icon">
          <image
            :src="cancelIcon"
            style="display: inline-block; width: 30rpx; height: 30rpx; "
            @click="payment"
          />
        </view>
        <view style="text-align: center; padding-bottom: 20rpx;">微信支付</view>
        <canvas id="qrcode" canvas-id="qrcode" style="width: 300rpx;height: 300rpx; "></canvas>
        <view style="text-align: center; padding: 20rpx 0;" >请用本人微信扫描以上二维码</view>
      </view>
    </uni-popup>
	</view>
</template>

<script setup>
	import bannerBg from '@/static/resource/banner-bg.jpg'
  import cancelIcon from '@/static/resource/cancel.png'
  import UQRCode from 'uqrcodejs'
	import {
		ref,
    computed
	} from 'vue'
	import {
		onLoad,
    onHide,
    onUnload
	} from '@dcloudio/uni-app'
  import { useCountdown } from '@/hooks/useCountdown'
  const app = getApp()
  const { windowWidth } = uni.getSystemInfoSync()
  const rpxRatio = 750 / windowWidth
  // 倒计时逻辑抽离到hooks/useCountdown.js，供订单列表页和订单详情页共用
  const { countdownMap, startCountdown, stopCountdown, formatCountdown } = useCountdown()
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
  // 二维码弹窗
  const popupQrCode = ref()
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
        // 待支付订单启动倒计时，key固定为detail，到期后重新请求订单详情获取最新状态
        if (res.data.trade_state == '待支付' && res.data._exp_time > 0) {
          startCountdown([{ key: 'detail', remain: res.data._exp_time }], () => getOrderDetail(params))
        }
      }
    })
  }
  // 点击立即支付
  const dopay = () => {
    // 打开二维码弹窗
    popupQrCode.value.open()
    var qr = new UQRCode();
    // 设置二维码内容
    qr.data = orderList.value.code_url;
    // 设置二维码大小，必须与canvas设置的宽高一致
    qr.size = Math.floor(300 / rpxRatio);
    // 调用制作二维码方法
    qr.make();
    // 获取canvas上下文
    var canvasContext = uni.createCanvasContext('qrcode'); // 如果是组件，this必须传入
    // 设置***实例的canvas上下文
    qr.canvasContext = canvasContext;
    // 调用绘制方法将二维码图案绘制到canvas上
    qr.drawCanvas();
  }
  // 关闭二维码弹窗
  const payment = () => {
    popupQrCode.value.close()
    uni.switchTab({ url: '/pages/order/index' })
  }
  // 页面隐藏或卸载时清除定时器
  onHide(() => {
    stopCountdown()
  })
  onUnload(() => {
    stopCountdown()
  })
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

 	
  .order-status {
    position: relative;
		margin-top: -40rpx;
    width: 100%;
    border-radius: 20rpx 20rpx 0 0;
    height: auto;
    background-color: #fff;
  }
  .order-status .order-box {
    padding: 40rpx;
    display: flex;
    flex-direction: column;
  }
  .order-box .order-status-text {
    flex: 1;
    font-weight: bold;
    font-size: 40rpx;
  }
  .order-box .order-time {
    font-size: 28rpx;
    margin-top: 20rpx;
  }
  .order-box .order-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 40rpx;
  }
  .order-btn button {
    background-color: #53B286;
    color: #fff;
    font-weight: bold;
    font-size: 32rpx;
    width: 80%;
  }
  // 二维码
  .pay-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 20rpx;
  }
  .pay-box .pay-icon {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
</style>
