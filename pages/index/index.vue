<template>
	<view>
		<navbar :isHome="true" />
		<view style="margin-top: 130rpx; ">
			<view class="weui-cell" style="background: #fff9eb; ">
				<view class="weui-cell_hd">
					<image src="/static/resource/program.png"
						style="display: block;width: 40rpx;height:40rpx; margin-right: 14rpx; margin-left: 14rpx;" />
				</view>
				<view class="weui-cell_bd">
					<text style="color: #be9719; font-size: 26rpx;">点击右上"添加到我的小程序"，方便下次找到</text>
				</view>
				<view class="weui-cell_fd">
					<image src="/static/resource/cancel.png" style="display: block;width: 25rpx;height:25rpx; margin-right: 14rpx; margin-left: 14rpx;" />
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		reactive,
		computed
	} from 'vue'
	const navigateTo = () => {
		uni.navigateTo({
			url: '/pages/search/index'
		})
	}
</script>

<style>
	.weui-cell {
		display: flex;
		align-items: center;
    justify-content: center;
    height: 80rpx;
	}
</style>
