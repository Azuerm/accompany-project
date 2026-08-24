<template>
  <view class="">
    服务对象
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
  // 区分不同页面
  const act = ref('')
  // 服务对象列表
  const clientsList = ref([])
  onLoad((options) => {
    act.value = options.act
    if (options.act == 'select') {
      uni.setNavigationBarTitle({
        title: '请选择服务对象'
      })
    } else {
      uni.setNavigationBarTitle({
        title: '服务对象管理'
      })
    }
    app.globalData.utils.request({
      url: '/User/clients',
      success: (res) => {
        console.log('服务对象',res.data);
        clientsList.value = res.data.clients
      }
    })
  }) 
</script>

<style lang="scss" scoped>

</style>