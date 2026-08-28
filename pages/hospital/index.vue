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
								<view class="hosp-share">
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
					<image class="service-logo" :src="item.logo_image_url" mode="aspectFill" />
					<view class="service-info">
						<view class="service-name">{{ item.name }}</view>
						<view class="service-intro">{{ item.intro }}</view>
						<view class="service-price">
							<text class="price-num">{{ item.price }}</text>
							<text class="price-unit">元/次</text>
						</view>
					</view>
					<view class="service-btn">预约</view>
				</view>
			</view>
		</view>

	</view>
</template>

<script setup>
	import {
		ref,
	} from 'vue'

	import {
		onLoad
	} from '@dcloudio/uni-app'

	const navHeight = ref(0)
	const onNavHeightChange = (height) => {
		navHeight.value = height
	}
	const app = getApp()
	// 医院详情
	const hospitalDetail = ref({})
	// 医院服务列表
	const servicesList = ref([])
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
				console.log('服务详情', hospitalDetail.value);
			}
		})
	})
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
</style>
