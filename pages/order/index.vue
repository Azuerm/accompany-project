<template>
	<view style="background-color: #EEF1EE; min-height: 100vh; overflow: hidden;">
		<view class="order-tab">
      <view class="tab-box">
        <!-- @tap相当于@click -->
        <view class="tab-item" :class="{currentTab: currentItem == 0}" @tap="onCurrentItemChange(0)">
          全部
        </view>
        <view class="tab-item" :class="{currentTab: currentItem == 1}" @tap="onCurrentItemChange(1)">
          待支付
        </view>
        <view class="tab-item" :class="{currentTab: currentItem == 2}" @tap="onCurrentItemChange(2)">
          待服务
        </view>
        <view class="tab-item" :class="{currentTab: currentItem == 3}" @tap="onCurrentItemChange(3)">
          已完成
        </view>
        <view class="tab-item" :class="{currentTab: currentItem == 4}" @tap="onCurrentItemChange(4)">
          已取消
        </view>
      </view>
    </view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'
	import {
		// onLoad
    onShow
	} from '@dcloudio/uni-app'
  const app = getApp()
  onShow(() => {
    // 将onLoad改为onShow，是因为：order在tarbar中，在tarbar中onLoad只会执行一次，所以需要onShow
    // 调用订单列表
    loadList()
  })
  // 当前订单列表类型
  const currentItem = ref(0)
  const onCurrentItemChange = (index) => {
    if (currentItem.value == index) return
    currentItem.value = index
    loadList()
  }
  // 封装订单列表请求
  const loadList = () => {
    // 调用订单列表
    app.globalData.utils.request({
      url: '/order/list',
      method: 'GET',
      header: {
        token: uni.getStorageSync('token')
      },
      data: {
        stete: currentItem.value
      },
      success: (res) => {
        console.log('获取订单列表成功',res)
      }
    })
  }
</script>

<style lang="scss" scoped>
  .order-tab {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100rpx;
    background-color: #fff;

  }
  .order-tab .tab-box {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }
  .tab-box .tab-item {
    flex: 1;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    color: #999;
    font-size: 32rpx;
  }
  .tab-box .currentTab {
    color: #000;
    border-bottom: 2rpx solid #000;
  }
</style>
