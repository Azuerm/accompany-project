<template>
	<view class="page">
		<navbar background="none" @heightChange="onNavHeightChange" />
		<view style="position: relative; overflow: hidden;">
			<image :src="hospitalDetail.avatar_url" mode="aspectFill"
				style="position: absolute; top: 0; left: 0; width: 100%; height: 550rpx; filter: blur(50rpx) brightness(0.8); transform: scale(1.2);" />
			<view class="hosp-info" :style="{ paddingTop: navHeight + 10 + 'rpx' }">
				<view class="hosp-cell">
					<view class="hosp-main">
						<view class="hosp-pic">
							<image class="hosp-avatar" :src="hospitalDetail.avatar_url" mode="aspectFill" />
						</view>
						<view class="hosp-name">{{ hospitalDetail.name }}</view>
						<view class="hosp-tags">
							<view class="tag-1">
								<view class="hosp-detail">
									<text class="hosp-rank">{{ hospitalDetail.rank }}</text>
									<text class="hosp-label">{{ hospitalDetail.label }}</text>
								</view>
								<view class="hosp-share" @click="goShare">
									转发
									<image src="@/static/resource/service_right.png" />
								</view>
							</view>

							<div class="tag-2">
								<view class="hosp-addr">
									<view class="addr-text">
										<image src="@/static/resource/map_go.png" mode="" />
										{{ hospitalDetail.address }}
									</view>
									<view class="addr-nav" @tap="openLocation">
										导航
										<image src="@/static/resource/service_right.png" />
									</view>
								</view>
							</div>
						</view>
					</view>
				</view>
        
			</view>
			<!-- 服务列表 -->
			<view class="service-box">
				<view class="service-title">在线预约您需要的服务</view>
				<view class="service-item" v-for="item in servicesList" :key="item.id">
					<block v-if="item.use_switch == 1">
            <image class="service-logo" :src="item.logo_image_url" mode="aspectFill" />
              <view class="service-info">
                <view class="service-name">{{ item.name }}</view>
                <view class="service-intro">{{ item.intro }}</view>
                <view class="service-price">
                  <text class="price-num">{{ item.price }}</text>
                  <text class="price-unit">元/次</text>
                </view>
              </view>
              <view class="service-btn" @tap="toService(item.id)">预约</view>
          </block>
				</view>
			</view>
		</view>
    <!-- 分享弹出层 -->
    <uni-popup ref="popupShare" type="bottom" :is-mask-click="false" background-color="#EEF1EE" border-radius=" 20rpx">
      <view class="share-box">
        <view class="share-header">
          <text>转发分享</text>
          <image class="share-close" src="@/static/resource/cancel.png" @tap="popupShare.close()" />
        </view>
        <view class="share-option">
          <view class="share-item">
            <button open-type="share">
              <image
                src="@/static/resource/share-friend.png"
                class="share-icon"
              />
            </button>
            <text>发给微信好友</text>
          </view>
          <view class="share-item" @click="sharePic">
            <image
              src="@/static/resource/share-pic.png"
            />
            <text>生成分享图片</text>
          </view>
        </view>
      </view>
    </uni-popup>
    <!-- 生成分享图片用的隐藏画布（放在屏幕外，不能用display:none） -->
    <canvas class="hide-canvas" canvas-id="qrCanvas" style="width: 150px; height: 150px;" />
    <canvas class="hide-canvas" canvas-id="posterCanvas" style="width: 340px; height: 480px;" />
	</view>
</template>

<script setup>
	import {
		ref,
	} from 'vue'

	import {
		onLoad,
    onShareAppMessage
	} from '@dcloudio/uni-app'
  import UQRCode from 'uqrcodejs'

	const navHeight = ref(0)
	const onNavHeightChange = (height) => {
		navHeight.value = height
	}
	const app = getApp()
	// 医院详情
	const hospitalDetail = ref({})
	// 医院服务列表
	const servicesList = ref([])
  const popupShare = ref()

	onLoad((params) => {
		app.globalData.utils.request({
			url: '/Hospital/index',
			data: {
				hid: params.hid
			},
			success: (res) => {
				hospitalDetail.value = res.data.hospital
				servicesList.value = res.data.services
				console.log('医院详情', hospitalDetail.value);
				console.log('服务详情', servicesList.value);
			}
		})
	})
  // 点击分享
  const goShare = () => {
    popupShare.value.open()
  }
  // 设置分享该页面的信息
  onShareAppMessage(() => ({
    title: hospitalDetail.value.name,
    path: '/pages/hospital/index?hid=' + hospitalDetail.value.id,
    imageUrl: hospitalDetail.value.avatar_url
  }))
  // 分享图片
  const sharePic = () => {
    // 关闭分享弹窗
    popupShare.value.close()
    uni.showLoading({ title: '生成中' })
    // canvas绘制需要本地图片路径，先把医院头像下载到本地
    uni.getImageInfo({
      src: hospitalDetail.value.avatar_url,
      success: (imgRes) => {
        makeQrCode(imgRes.path)
      },
      fail: () => {
        uni.hideLoading()
        uni.showToast({ title: '获取医院图片失败', icon: 'none' })
      }
    })
  }
  // 实现导航-利用微信小程序内置api
  const openLocation = () => {
    uni.openLocation({
      latitude: Number(hospitalDetail.value.lat),
      longitude: Number(hospitalDetail.value.lng),
      name: hospitalDetail.value.name,
      address: hospitalDetail.value.address,
    })
  }
  // 生成二维码：uqrcode只能画在原点，先画到单独的隐藏canvas再导出成图片
  const makeQrCode = (avatarPath) => {
    const qr = new UQRCode()
    // 携带医院id，扫码后进入对应医院页面
    // 注意：这是普通二维码，正式上线应由后端调用微信小程序码接口(getUnlimited)生成
    qr.data = '/pages/hospital/index?hid=' + hospitalDetail.value.id
    qr.size = 150
    qr.make()
    const qrCtx = uni.createCanvasContext('qrCanvas')
    qr.canvasContext = qrCtx
    // drawCanvas返回promise，内部已延时等待绘制完成
    qr.drawCanvas().then(() => {
      uni.canvasToTempFilePath({
        canvasId: 'qrCanvas',
        success: (res) => {
          drawPoster(avatarPath, res.tempFilePath)
        },
        fail: () => {
          uni.hideLoading()
          uni.showToast({ title: '生成失败', icon: 'none' })
        }
      })
    })
  }
  // 绘制海报：头像 + 医院信息 + 二维码
  const drawPoster = (avatarPath, qrPath) => {
    const hospital = hospitalDetail.value
    const ctx = uni.createCanvasContext('posterCanvas')
    // 白色背景
    ctx.setFillStyle('#ffffff')
    ctx.fillRect(0, 0, 340, 480)
    // 医院头像
    ctx.drawImage(avatarPath, 20, 20, 90, 90)
    // 医院名称（超长截断）
    const name = hospital.name && hospital.name.length > 9 ? hospital.name.slice(0, 9) + '...' : hospital.name
    ctx.setFillStyle('#333333')
    ctx.font = 'bold 18px sans-serif'
    ctx.fillText(name, 125, 55)
    // 医院等级、标签
    ctx.setFillStyle('#53B286')
    ctx.font = 'normal 13px sans-serif'
    ctx.fillText((hospital.rank || '') + '  ' + (hospital.label || ''), 125, 85)
    // 医院地址（超长截断）
    const address = hospital.address && hospital.address.length > 16 ? hospital.address.slice(0, 16) + '...' : hospital.address
    ctx.setFillStyle('#999999')
    ctx.font = 'normal 12px sans-serif'
    ctx.fillText(address, 20, 145)
    // 二维码
    ctx.drawImage(qrPath, 100, 240, 140, 140)
    // 提示文字
    ctx.fillText('长按识别小程序码进入医院页面', 20, 440)
    // 等待绘制完成再导出（draw回调后仍需延时，否则导出异常）
    ctx.draw(false, () => {
      setTimeout(() => {
        uni.canvasToTempFilePath({
          canvasId: 'posterCanvas',
          success: (res) => {
            uni.hideLoading()
            // 预览海报，用户可长按保存到相册或发送给朋友
            uni.previewImage({ urls: [res.tempFilePath] })
          },
          fail: () => {
            uni.hideLoading()
            uni.showToast({ title: '生成失败', icon: 'none' })
          }
        })
      }, 150)
    })
  }
  // 跳转到服务预约页面
  const toService = (svid) => {
    uni.navigateTo({
      url: `/pages/service/index?hid=${hospitalDetail.value.id}&svid=${svid}`
    })
  }
</script>

<style lang="scss" scoped>
	.page {
		min-height: 100vh;
		background-color: #EEF1EE;
	}

	// 医院信息：覆盖在模糊背景上，top由navbar高度动态决定
	.hosp-info {
		position: relative;
	}

	.hosp-info .hosp-cell {
		display: flex;
		align-items: center;
		margin: 0 20rpx;
    position: relative;
	}

	// 头像向上凸出，与名称、标签错位排布
	.hosp-info .hosp-avatar {
		position: absolute;
		left: 25rpx;
		top: 15rpx;
		display: block;
		width: 150rpx;
		height: 135rpx;
		border-radius: 10rpx;
	}

	.hosp-info .hosp-main {
		flex: 1;
		overflow: hidden;
	}

	.hosp-main .hosp-name {
		color: #fff;
		font-weight: bold;
		font-size: 36rpx;
		padding: 20rpx 0;
		padding-left: 200rpx;
		position: relative;
	}

	.hosp-main .hosp-tags {
		display: flex;
		flex-direction: column;
		background-color: #fff;
		overflow: hidden;
		border-radius: 10rpx;
	}

	.hosp-tags .tag-1 {
		display: flex;
		padding: 20rpx;
		border-bottom: 1rpx solid #ccc;
		padding-left: 200rpx;
	}

	.hosp-tags .hosp-detail {
		flex: 1;
	}

	.hosp-tags .hosp-rank,
	.hosp-tags .hosp-label {
		margin-right: 12rpx;
		color: #82BDA3;
		font-size: 28rpx;
		font-weight: bold;
	}

	.hosp-tags .hosp-label {
		color: #94CED1;
	}

	.hosp-info .hosp-share {
		display: flex;
		align-items: center;
		flex-shrink: 0;
		color: #999;
		font-size: 26rpx;
	}

	.hosp-share image {
		width: 36rpx;
		height: 36rpx;
		vertical-align: middle;
	}

	// 地址栏
	.hosp-info .hosp-addr {
		display: flex;
		align-items: center;
		padding: 20rpx;
		background-color: rgba(255, 255, 255, 0.9);
		border-radius: 20rpx;
	}

	.hosp-addr .addr-text {
		flex: 1;
		color: #333;
		font-size: 26rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.addr-text image {
		width: 36rpx;
		height: 36rpx;
		vertical-align: middle;
	}

	.hosp-addr .addr-nav {
		display: flex;
		align-items: center;
		flex-shrink: 0;
		color: #999;
		font-size: 26rpx;
	}

	.addr-nav image {
		width: 36rpx;
		height: 36rpx;
		vertical-align: middle;
	}

	// 服务列表
	.service-box {
		position: relative;
		overflow: hidden;
		margin: 20rpx;
		padding: 20rpx;
		background-color: #fff;
		border-radius: 10rpx;
	}

	.service-box .service-title {
		font-weight: bold;
		font-size: 32rpx;
	}

	.service-box .service-item {
		display: flex;
		align-items: center;
		padding: 30rpx 0;
		border-bottom: 1rpx solid #f5f5f5;
	}

	.service-item:last-child {
		border-bottom: none;
	}

	.service-item .service-logo {
		flex-shrink: 0;
		width: 140rpx;
		height: 140rpx;
		border-radius: 10rpx;
	}

	.service-item .service-info {
		flex: 1;
		margin-left: 20rpx;
		overflow: hidden;
	}

	.service-info .service-name {
		font-weight: bold;
		font-size: 30rpx;
	}

	.service-info .service-intro {
		margin-top: 8rpx;
		color: #999;
		font-size: 24rpx;
	}

	.service-info .service-price {
		margin-top: 12rpx;
		color: #53B286;
	}

	.service-price .price-num {
		font-weight: bold;
		font-size: 32rpx;
	}

	.service-price .price-unit {
		font-size: 22rpx;
	}

	.service-item .service-btn {
		flex-shrink: 0;
		padding: 12rpx 32rpx;
		background-color: #53B286;
		border-radius: 10rpx;
		color: #fff;
		font-size: 26rpx;
    font-weight: bold;
	}

  .share-box {
    padding: 30rpx;
  }
  .share-box .share-header {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  .share-header text {
    font-size: 32rpx;
    font-weight: bold;
  }
  .share-header image {
    width: 30rpx;
    height: 30rpx;
    vertical-align: middle;
    position: absolute;
    top: 0;
    right: 0;
  }
  .share-option {
    display: flex;
    margin: 50rpx 0;
  }
  .share-option .share-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .share-item button {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 120rpx;
    height: 120rpx;
  }
  .share-item text {
    margin-top: 10rpx;
    font-size: 24rpx;
    margin-top: 20rpx;
  }
  .share-item image {
    background: #fff;
    width: 120rpx;
    height: 120rpx;
  }
  .share-item .share-icon {
    width: 80rpx;
    height: 80rpx;
  }
  // 隐藏画布：放到屏幕外
  .hide-canvas {
    position: fixed;
    left: 9999rpx;
    top: 0;
  }
</style>
