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
	</view>
</template>

<script setup>
	import {
		ref,
		reactive,
		computed
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
          }
        })
      }
    })
  })
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
</style>
