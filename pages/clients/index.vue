<template>
  <view class="" style="background-color: #EEF1EE; min-height: 100vh;">
    <view class="cell-box" v-for="item in clientsList" :key="item.id" >
      <view class="user-detail">
        <view class="name-text">
          <text>{{ item.name }}</text>
        </view>
        <view class="name-info">
          <text :class="'sex' + item.sex">{{ item.sex == 1 ? '男' : '女'}}</text>
          <text style="margin-left: 10rpx;">{{ item.age }}周岁</text>
          <text style="margin-left: 10rpx;">{{ item.mobile }}</text>
        </view>
      </view>
      <view class="user-button">
        <text v-if="act == 'select'" class="text-select" @click="onClientSelected(item)">选择</text>
        <text v-else class="text-delete" @click="removeClient">删除</text>
      </view>
    </view>
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
  // 选择
  const onClientSelected = (item) => {
    if (act.value == '') return
    // 触发自定义事件
    uni.$emit('clientChange', item)
    uni.navigateBack()
  }
  // 移除
  const removeClient = () => {

  }
</script>

<style lang="scss" scoped>
.cell-box {
  margin: 20rpx 20rpx 0 20rpx;
  background-color: #fff;
  border-radius: 20rpx;
  overflow: hidden;
  display: flex;
  // height: 100rpx;
  padding: 20rpx 20rpx;
}
.user-detail {
  flex: 2;
  display: flex;
  flex-direction: column;

  // justify-content: center;
}
.user-detail .name-text {
  font-weight: bold;
  font-size: 32rpx;
  padding-bottom: 10rpx;
}
.user-detail .name-info {

}
.user-button {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
} 
.user-button text {
  display: inline-block;
  padding: 15rpx 30rpx;
  border-radius: 10rpx;
  border: 1px solid #0bb584;
  color: #0bb584;
  font-size: 28rpx;
  line-height: 28rpx;
  overflow: hidden;
  text-align: center;
}
.user-button .text-delete {
  color:  #f13e6d !important;
  border: 1px solid #000 !important;
}
.sex1 {
  color: blue;
}
.sex2 {
  color: red;
}

</style>