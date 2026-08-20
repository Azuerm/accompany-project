<template>
	<view class="nav">
		<!-- 状态栏 -->
		<view :style="'height:' + status + 'rpx;' + backStyle"></view>
		<!-- 标题栏 -->
		<view class="navbar" :style="'height:' + navHeight + 'rpx;' + backStyle ">
			<view class="back-icon" @click="backOrHome">
				<!-- 根据页面栈的数量getCurrentPages().length 判断是显示返回图标 还是 返回首页图标 -->
				<image v-if="pages > 1" src="/static/resource/back.png" alt=""/>
				<image v-else src="/static/resource/backhome.png" alt="" />
			</view>
      <view class="nav-title" v-if="titleText">
        <view :style="'height:' + navHeight + 'rpx; line-height:' + navHeight + 'rpx;' + textStyle">{{ titleText }}</view>
      </view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		onBeforeMount,
		defineProps
	} from 'vue'
	const props = defineProps({
		background: {
			type: String,
			default: 'rgba(255,255,255,1)'
		},
		color: {
			type: String,
			default: 'rgba(0,0,0,1)'
		},
		fontSize: {
			type: String,
			default: 32
		},
		iconWidth: {
			type: String,
			default: 116
		},
		iconHeight: {
			type: String,
			default: 38
		},
    titleText: {
      type: String,
      default: ''
    }
	})
	// 在组件挂载前计算好状态栏高度
	onBeforeMount(() => {
		// 计算状态栏高度
		setNavSize()
		// 设置样式
		setStyle()
	})
	// 状态栏高度
	const status = ref(0)
	// 标题栏高度
	const navHeight = ref(0)

	// 计算状态栏高度
	const setNavSize = () => {
		// 获取系统版本和状态栏高度
		// const res = uni.getSystemInfoSync()
		// console.log('系统信息',res);
		const {
			system,
			statusBarHeight
		} = uni.getSystemInfoSync()
		status.value = statusBarHeight * 2 // 默认返回的是px，乘以2转换成rpx；因为手机屏幕宽度是375rpx，但rpx单位的基准是750rpx，所以需要乘以2
		const isiOS = system.indexOf('iOS') > -1
		if (!isiOS) {
			// 非ios系统，标题栏高度为96rpx
			navHeight.value = 96
		} else {
			// ios系统，标题栏高度为88rpx
			navHeight.value = 88
		}
	}

	// 背景颜色
	const backStyle = ref('')
	// 字体样式
	const textStyle = ref('')
	// 图标样式
	const iconStyle = ref('')
	// 样式设置
	const setStyle = () => {
		backStyle.value = ['background:' + props.background].join(';')
		textStyle.value = ['color:' + props.color, 'font-size:' + props.fontSize + 'rpx'].join(';')
		iconStyle.value = ['height:' + props.iconHeight + 'rpx', 'width:' + props.iconWidth + 'rpx'].join(';')
	}

	// 页面栈的数量
	const pages = ref(getCurrentPages().length)
	console.log('页面栈长度', pages.value);
	const backOrHome = () => {
		if (pages.value > 1) {
			uni.navigateBack()
		} else {
			// 跳转到首页 tabbar
			uni.switchTab({
				url: 'pages/index/index'
			})
		}
	}
</script>

<style>
	.nav {
		position: fixed;
		width: 100%;
		top: 0;
		left: 0;
		z-index: 2;
	}

	.back-icon {
		display: flex;
		align-items: center;
		width: 64rpx;
		height: auto;
		margin-left: 20rpx;
	}

	.back-icon image {
		width: 64rpx;
		height: 64rpx;
	}
  .navbar {
    position: relative;
    display: flex;
    align-items: center;
  }
  .nav-title {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%);
  }
</style>
