<template>
	<view class="nav" :style="textStyle">
		<!-- 状态栏 -->
		<view :style="'height:' + status + 'rpx;' + backStyle"></view>
		<!-- 标题栏 -->
    <view v-if="isHome" class="headernav" :style="'height:' + navHeight + 'rpx;line-height:' + navHeight + 'rpx;padding-left: 20rpx;' + backStyle ">
      <view class="city">
        <image
          src="/static/resource/navbar_map.png"
        />
        中部地区
        <image
          src="/static/resource/navbar_left.png"
          class="right-icon"
        />
      </view>
      <view style="flex: 1">
        <!-- 跳转搜索页面，跟胶囊按钮的位置对齐 -->
         <!-- margin-top: 胶囊按钮的top值 * 2 - 状态栏高度；因为胶囊按钮的top值包括状态栏的高度，所以要减去状态栏的高度 -->
        <navigator
          url="/pages/search/index"
          :style="'height:'+ (menu.height*2) +'rpx;line-height:'+ (menu.height*2) +'rpx; margin-top:'+(menu.top * rpxRatio - status) + 'rpx; margin-right:' + (menu.width * rpxRatio + 24) + 'rpx;background: #f4f4f4;border-radius:200rpx; text-align:center'"
        >
          <view class="search-text">
            <image
              src="/static/resource/navbar_search.png"
            />
            搜索
          </view>
        </navigator>
      </view>
    </view>
		<view v-else class="navbar" :style="'height:' + navHeight + 'rpx;' + backStyle ">
			<view class="back-icon" @click="backOrHome">
				<!-- 根据页面栈的数量getCurrentPages().length 判断是显示返回图标 还是 返回首页图标 -->
				<image v-if="pages > 1" src="/static/resource/back.png" alt="" class="back-left"/>
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
    reactive,
		onBeforeMount,
		defineProps,
    defineEmits
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
    },
    isHome: {
      type: Boolean,
      default: false
    }
	})
	// 在组件挂载前计算好状态栏高度
	onBeforeMount(() => {
		// 计算状态栏高度
		setNavSize()
		// 设置样式
		setStyle()
    totalHight.value = status.value + navHeight.value
    emit('heightChange', totalHight.value)
	})

  const emit = defineEmits(['heightChange'])
   // navbar总高度
  const totalHight = ref(0)
  // 搜索功能距离顶部距离
  const windowWidthGet = ref(0)
  const rpxRatio = ref(0)

	// 状态栏高度
	const status = ref(0)
	// 标题栏高度
	const navHeight = ref(0)
  // 背景颜色
	const backStyle = ref('')
	// 字体样式
	const textStyle = ref('')
	// 图标样式
	const iconStyle = ref('')
  // 页面栈的数量
	const pages = ref(getCurrentPages().length)
	console.log('页面栈长度', pages.value);
  // 胶囊按钮的位置
  const menu = reactive( uni.getMenuButtonBoundingClientRect( ) )
  console.log('胶囊按钮位置', menu);
	// 计算状态栏高度
	const setNavSize = () => {
		// 获取系统版本和状态栏高度
		// const res = uni.getSystemInfoSync()
		// console.log('系统信息',res);
		const {
			system,
			statusBarHeight,
      windowWidth
		} = uni.getSystemInfoSync()
		status.value = statusBarHeight * 2 // 默认返回的是px，乘以2转换成rpx；因为手机屏幕宽度是375rpx，但rpx单位的基准是750rpx，所以需要乘以2

    windowWidthGet.value = windowWidth
    rpxRatio.value = 750 / windowWidthGet.value

		const isiOS = system.indexOf('iOS') > -1
		if (!isiOS) {
			// 非ios系统，标题栏高度为96rpx
			navHeight.value = 96
		} else {
			// ios系统，标题栏高度为88rpx
			navHeight.value = 88
		}
	}
	// 样式设置
	const setStyle = () => {
		backStyle.value = ['background:' + props.background].join(';')
		textStyle.value = ['color:' + props.color, 'font-size:' + props.fontSize + 'rpx'].join(';')
		iconStyle.value = ['height:' + props.iconHeight + 'rpx', 'width:' + props.iconWidth + 'rpx'].join(';')
	}
  // 返回按钮点击事件
	const backOrHome = () => {
		if (pages.value > 1) {
			uni.navigateBack()
		} else {
			// 跳转到首页 tabbar
			uni.switchTab({
				url: '/pages/index/index'
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
  .back-icon .back-left {
    transform: scale(0.7);
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
  .headernav {
    display: flex;
  }
  .city {
    display: flex;
    align-items: center;

  }
  .city image {
    width: 64rpx;
		height: 64rpx;
  }
  .city .right-icon {
    transform: scale(0.5);
    margin-left: -16rpx;
  }
  .search-text  {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .search-text image {
    width: 64rpx;
    height: 64rpx;
    transform: scale(0.6);
  }
</style>
