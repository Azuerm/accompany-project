<template>
	<view class="">
		<text>订单页面</text>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'
	import {
		onLoad
	} from '@dcloudio/uni-app'
  const app = getApp()
  onLoad(() => {
    // 调用订单列表
    app.globalData.utils.request({
      url: '/order/list',
      method: 'GET',
      header: {
        token: uni.getStorageSync('token')
      },
      success: (res) => {
        console.log('获取订单列表成功',res)
      }
    })
  })
</script>

<style lang="scss" scoped>

</style>
