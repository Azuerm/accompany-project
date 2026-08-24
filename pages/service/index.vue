<template>
  <view style="background-color: #EEF1EE; min-height: 100vh;">
    <view class="od-banner" :style="{ backgroundImage: `url(${bannerBg})` }">
      <!-- 进度条 -->
      <view class="od-progress">
        <view class="od-progress-bar" :style="{width: currentPercent ? currentPercent + '%' : '12.8%'}"></view>
      </view>
      <!-- 进度条文本 -->
      <view class="od-progress-text">
        <view class="od-progress-item" :style="{fontWeight: currentProgress == 1 ? 'bold' : 'normal'}">
          <text class="od-item-status">填写订单</text>
        </view>
        <view class="od-progress-item" :style="{fontWeight: currentProgress == 2 ? 'bold' : 'normal'}">
          <text class="od-item-status">在线支付</text>
        </view>
        <view class="od-progress-item" :style="{fontWeight: currentProgress == 3 ? 'bold' : 'normal'}"> 
          <text class="od-item-status">专人服务</text>
        </view>
        <view class="od-progress-item" :style="{fontWeight: currentProgress == 4 ? 'bold' : 'normal'}">
          <text class="od-item-status">服务完成</text>
        </view>
      </view>
    </view>
    <view class="content-wrapper">
      <view class="pub-box">
        <view class="put-box-content">
          <view class="put-title">
            <image
              :src="serviceList.icon_image ? serviceList.icon_image_url : defaultAvatar"
              class="put-icon"
            />
            <text class="put-type">{{ serviceList.name }}</text>
          </view>
          <view class="put-text">
            <view class="put-text-gray">服务内容</view>
          </view>
        </view>
      </view>
      <view class="form-box" v-if="serviceList.stype == 10 || serviceList.stype == 15 || serviceList.stype == 20 ">
        <view class="form-item">
          <view class="form-item-label">
            就诊医院
          </view>
          <view class="form-item-select">
            <picker @change="onHospitalChange" :value="hospitalIndex" :range="hospitalList" range-key="name" >
              <!-- range-key作用：设置想要显示的字段 -->
              <!-- <view class="uni-input">{{hospitalList[hospitalIndex].name}}</view> -->
              <!-- <input type="text" :disabled="true" placeholder="请选择要就诊的医院" :value="hospitalList[hospitalIndex].name"> -->
              <view class="picker-input">
                <text :class="hospitalIndex >= 0 ? 'selected': 'placeholder'">
                  {{ hospitalIndex >= 0 ? hospitalList[hospitalIndex].name : '请选择要就诊的医院'}}
                </text>
                <image
                  src="@/static/resource/service_right.png"
                />
              </view>
            </picker>
          </view>
        </view>
        <view class="form-item">
          <view class="form-item-label">
            就诊时间
          </view>
          <view class="form-item-select">
            <timePicker></timePicker>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import bannerBg from '@/static/resource/banner-bg.jpg'
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import defaultAvatar from '@/static/resource/avatar.png'
import TimePicker from '../../components/timePicker/timePicker.vue'
// 当前进度百分比
const currentPercent = ref(12.8)
// 当前进度文字
const currentProgress = ref(1)
onLoad((options) => {
  console.log('上级页面传递过来的参数：',options);
  getHospitalData(options)
})
// 服务数据列表
const serviceList = ref({})
// 医院列表
const hospitalList = ref([])
// 选中医院索引
const hospitalIndex = ref(0)
// 订单数据
const order = ref({
  price: '',
  starttime: '',
  address: {
    userName: '',
    cityName: '',
    countyName: '',
    detailInfo: ''
  }
})
const app = getApp()
// 页面服务数据
const getHospitalData = (options) => {
  app.globalData.utils.request({
    url: '/Service/order',
    data: {
      svid: options.svid
    },
    success: (res) => {
      serviceList.value = res.data.service
      console.log('服务数据',serviceList.value)
      hospitalList.value = res.data.hospitals
      if (options.hid) {
        hospitalIndex.value = res.data.hospitals.findIndex(item => item.id == options.hid)
        order.value.pirice = res.data.hospitals.findIndex(item => item.id == options.hid).service_price
      }
    }
  })
}
// 切换医院
const onHospitalChange = (e) => {
  hospitalIndex.value = e.detail.value
  order.value.price = hospitalList.value[hospitalIndex.value].service_price
  console.log('切换医院价格',order.value.price)
}
</script>

<style lang="scss" scoped>
.od-banner  {
  width: 100%;
  height: 250rpx;
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
}
.od-banner .od-progress {
  height: 38rpx;
  background-color: #fff;
  border-radius: 20rpx;
  width: 85%;
  overflow: hidden;
  margin-bottom: 20rpx;
  position: relative
}
// 进度条填充
.od-banner .od-progress .od-progress-bar {
  height: 75%;
  border-radius: 20rpx;
  position: absolute;
  top: 50%;
  left: 6rpx;
  right: 6rpx;
  transform: translateY(-50%);
  background-image: linear-gradient(to right, #50e7a3, #2de2e8);
  transition: width 0.3s ease;
}
.od-banner .od-progress-text {
  margin-top: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 85%;
  overflow: hidden;
}
.od-banner .od-progress-text .od-progress-item{
  flex: 1;
  text-align: center;
  // color: #fff;
  // font-weight: bold;
}
.content-wrapper {
  position: relative;
  margin-top: -60rpx;
}
// 类型
.pub-box {
  width: calc(100% - 40rpx);
  margin: 20rpx 20rpx 0 20rpx;
  border-radius: 20rpx;
  overflow: hidden;
}
.put-box-content {
  background-color: #fff;
  width: calc(100% - 40rpx);
  display: flex;
  justify-content: space-between;
  height: 90rpx;
  padding: 0 20rpx;
}
.put-box-content .put-title {
  flex: 1;
  display: flex;
  align-items: center;
}
.put-title image {
  width: 55rpx;
  height: 55rpx;
}
.put-title .put-type {
  font-weight: bold;
  margin-left: 20rpx;
}
.put-box-content .put-text {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.put-text .put-text-gray {
  font-size: 28rpx;
  color: #999
}
.put-text-gray::before {
  content: '';
  display: inline-block;
  width: 36rpx;
  height: 36rpx;
  background: url('/static/resource/exclaim.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  margin-right: 10rpx;
  vertical-align: middle;
}
// 服务内容
.form-box {
  width: calc(100% - 40rpx);
  margin: 20rpx 20rpx 0 20rpx;
  background-color: #fff;
  border-radius: 20rpx;
  overflow: hidden;
}
.form-box .form-item {
  background-color: #fff;
  width: calc(100% - 40rpx);
  display: flex;
  justify-content: space-between;
  height: 90rpx;
  padding: 0 20rpx;
}
.picker-input image {
  width: 36rpx;
  height: 36rpx;
  vertical-align: middle;
}
.form-item .form-item-label {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.form-item .form-item-select {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.form-item .form-item-select input {
  text-align: right;
}
.placeholder {
  color: #999;
}
</style>