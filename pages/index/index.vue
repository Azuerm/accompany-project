<template>
	<view class="content">
		<navbar name="首页" :content="details" @changeDetailsContent="changeDetails">
			<!-- <view>===我是插槽内容===</view> -->
		</navbar>
	</view>
</template>

<script setup>
	import {
		ref,
		reactive,
		computed
	} from 'vue'
	const details = ref('动态数据')
	const changeDetails = (val) => {
		details.value = val
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>
