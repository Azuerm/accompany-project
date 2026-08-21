<template>
	<view>
		<navbar :isHome="true" />
    <!-- 添加到我的小程序 -->
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
    <!-- 轮播图 -->
    <view v-if="slidesList && slidesList.length > 0" class="index-swiper">
      <swiper
        autoplay
        circular
        :interval="4000"
        :duration="500"
      > 
        <!-- block标签相当于vue的template标签，但只能用来渲染 v-for 、 v-if -->
        <block v-for="(item, index) in slidesList" :key="index">
          <swiper-item>
            <image
              :src="item.pic_image_url"
              mode="widthFix"
              show-menu-by-longpress
              :data-index="index"
            />
          </swiper-item>
        </block>
      </swiper>
    </view>
    <!-- 快捷入口2 -->
    <view v-if="nav2sList && nav2sList.length > 0" class="nav2-list">
      <block v-for="(item, index) in nav2sList" :key="index">
        <!-- <view class="nav2-item" :data-index="index" @click="onNav2Tap"> data-属性写法 -->
        <view class="nav2-item"  @click="onNav2Tap(index)">
          <image
            :src="item.pic_image_url"
            mode="widthFix"
          />
        </view>
      </block>
    </view>
    <!-- 快捷入口多个 -->
    <view v-if="navList && navList.length > 0" class="nav-list">
      <block v-for="(item, index) in navList" :key="item.id">
        <view class="nav-item">
          <view class="nav-pic" @click="onNavTap(index)">
            <image
              :src="item.pic_image_url"
            />
          </view>
          <view class="nav-text" :style="'color:' + (item.tcolor ? item.tcolor : '')">{{ item.title }}</view>
        </view>
      </block>
    </view>
	</view>
</template>

<script setup>
	import {
		ref,
		reactive,
		computed,
    toRaw
	} from 'vue'
  import { onLoad } from '@dcloudio/uni-app' // 页面加载时调用的函数
	const navigateTo = () => {
		uni.navigateTo({
			url: '/pages/search/index'
		})
	}
  const app = getApp() // 获取全局变量
  // 轮播图数据
  const slidesList = ref([])
  // 快捷入口2
  const nav2sList = ref([])
  // 快捷入口多个
  const navList = ref([])
  onLoad(() => {
    // 获取用户信息
    app.globalData.utils.getUserInfo()
    app.globalData.utils.request({
      url: '/app/init',
      success: (res) => {
        console.log('初始化',res)
        const { id } = res.data.area
        // 通过id获取当前地区的页面数据
        app.globalData.utils.request({
          url: '/Index/index',
          data: {
            aid: id
          },
          success: ({data}) => {
            console.log('轮播图数据', data)
            slidesList.value = data.slides
            nav2sList.value = data.nav2s
            navList.value = data.navs
          }
        })
      }
    })
  })
  // 快捷入口2点击跳转页面
  // 1 方法1 ： 通过data-index属性获取点击的项
  // const onNav2Tap = (e) => {
  //   // e 是事件对象
  //   console.log('e',e)
  //   // toRaw 将响应式对象转换为普通对象，因为只需要知道当前点击的项，不需要响应式
  //   console.log(toRaw(nav2sList.value))
  //   // 通过自定义属性index 获取当前点击的项
  //   const nav = toRaw(nav2sList.value)[e.currentTarget.dataset.index] //相当于 nav2sList.value[索引]
  //   console.log('nav', nav)
  //   if(nav.stype == 1) {
  //     uni.navigateTo({
  //       url: nav.stype_link
  //     })
  //   }
  // }
  // 2 方法2: 通过索引获取点击的项
  const onNav2Tap = (index) => {
    const nav = nav2sList.value[index]
    jumpPage(nav)
  }
  // 封装跳转路由逻辑：
  const jumpPage = (nav) => {
    if (nav.stype == 1) {
      uni.navigateTo({
        url: nav.stype_link
      })
    }
  }
  // 快捷入口多个点击跳转页面
  const onNavTap = (index) => {
    const nav = navList.value[index]
    jumpPage(nav)
  }
</script>

<style>
  /* page标签是页面的根元素，page相当于html的body标签 */
  page {
    background: #fff;
  }
	.weui-cell {
		display: flex;
		align-items: center;
    justify-content: center;
    height: 80rpx;
	}
  .index-swiper {
    padding: 20rpx 20rpx 0 20rpx;
    overflow: hidden;
  }
  .index-swiper swiper {
    height: 320rpx;
    overflow: hidden;
    border-radius: 10rpx;
  }
  .index-swiper swiper-item image{
    width: 100%;
    height: 100%;
  }
  .nav2-list {
    margin: 20rpx 20rpx 0 20rpx;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 10rpx;
    overflow: hidden;
  }
  .nav2-list .nav2-item {
    border-radius: 10rpx;
    overflow: hidden;
  }
  .nav2-list .nav2-item image{
    width: 100%;
    height: 100%;
  }
  .nav-list {
    margin: 20rpx 20rpx 0 20rpx;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-gap: 10rpx;
  }
  .nav-list .nav-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .nav-list .nav-pic image {
    width: 110rpx;
    height: 110rpx;
  }
</style>
