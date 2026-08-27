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
    <view class="order-content">
      <view v-if="orderList.length == 0" class="order-no">
        没有相关内容
      </view>
      <view v-else>
        <view class="order-item" v-for="(item, index) in orderList" :key="index">
          <view class="order-detail" @tap="toOrderPage(item.out_trade_no)">
            <view class="pic-text">
              <view class="pic">
                <image :src="item.service_logo_image_url || defaultAvatar" mode="widthFix" />
              </view>
              <div class="text">
                <div class="service-name">{{ item.service_name }}</div>
                <div class="service-info">
                  <block v-if="item.service_stype <= 20">
                    <view>
                      <text>{{ item.hospital_name }} ({{ item.area_name }})</text>
                    </view>
                    <view>
                      <text>预约时间：{{ formatTime(item.starttime) }}</text>
                    </view>
                    <view>
                      <text>就诊人员：{{ item.client_name }}</text>
                    </view>
                  </block>
                  <block v-if="item.service_stype > 20 && item.service_stype < 100">
                    <view>
                      <text>{{ item.hospital_name }} ({{ item.area_name }})</text>
                    </view>
                    <view>
                      <text>处理时间：{{ formatTime(item.starttime) }}</text>
                    </view>
                  </block>
                  <block v-if=" item.service_stype > 100">
                    <view>
                      <text>服务时间：{{ formatTime(item.starttime) }}</text>
                    </view>
                    <view>
                      <text>服务对象：{{ item.client_name }}</text>
                    </view>
                  </block>
                </div>
              </div>
            </view>
            <view class="order-status">
              <block v-if="item.trade_state == '待支付'">
                <text style="color: #ffa200">{{ item.trade_state }}</text>
                <text style="color: #ffa200">{{ formatCountdown(countdownMap[index]) }}</text>
              </block>
              <block v-if="item.trade_state == '待服务'">
                <text style="color: #1da6fd">{{ item.trade_state }}</text>
              </block>
              <block v-if="item.trade_state == '已完成'">
                <text style="color: #21c521">{{ item.trade_state }}</text>
              </block>
              <block v-if="item.trade_state == '已取消'">
                <text style="color: #999">{{ item.trade_state }}</text>
              </block>
            </view>
          </view>
        </view>
      </view>
    </view>
	</view>
</template>

<script setup>
	import defaultAvatar from '@/static/resource/avatar.png'
  import {
		ref
	} from 'vue'
	import {
		onShow,
    onHide
	} from '@dcloudio/uni-app'
  import { useCountdown } from '@/hooks/useCountdown'
  const app = getApp()
  // 倒计时逻辑抽离到hooks/useCountdown.js，供订单列表页和订单详情页共用
  const { countdownMap, startCountdown, stopCountdown, formatCountdown } = useCountdown()
  onShow(() => {
    // 将onLoad改为onShow，是因为：order在tarbar中，在tarbar中onLoad只会执行一次，所以需要onShow
    // 调用订单列表
    loadList()
  })
  // 当前订单列表类型
  const currentItem = ref(0)
  // 订单列表
  const orderList = ref([])

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
        state: currentItem.value
      },
      success: (res) => {
        console.log('获取订单列表成功',res)
        orderList.value = res.data
        // 初始化倒计时：提取待支付订单的剩余时间，key用index对应列表项
        const items = []
        orderList.value.forEach((item, index) => {
          if (item.trade_state == '待支付' && item._exp_time > 0) {
            items.push({ key: index, remain: item._exp_time })
          }
        })
        startCountdown(items, () => loadList())
      }
    })
  }
  // 跳转到订单详情页面
  const toOrderPage = (id) => {
    uni.navigateTo({ 
      url: '/pages/order/orderPage?oid=' + id
     })
  }

  // 页面隐藏时清除定时器
  onHide(() => {
    stopCountdown()
  })

  // 格式化时间
  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${month}-${day} ${hours}:${minutes}`
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
    overflow: hidden;

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
  // 订单列表
  .order-content {
    margin-top: 100rpx;
    height: calc(100vh - 100rpx);
    overflow: hidden;
    overflow-y: scroll;
  }
  .order-content .order-no {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .order-detail {
    margin: 20rpx;
    padding: 20rpx;
    background: #fff;
    border-radius: 10rpx;
    overflow: hidden;
    display: flex;
    justify-content: space-between;
  }
  .order-detail .pic-text {
    flex: 2;
    display: flex;
  }
  .pic-text .pic {
    width: 100rpx;
    height: 100rpx;
    margin-right: 20rpx;
  }
  .pic image {
    width: 100%;
    height: 100%;
  }
  .pic-text .text {
    flex: 1;
  }
  .text .service-name {
    font-size: 32rpx;
    font-weight: bold;
  }
  .text .service-info {
    color: #999;
    font-size: 28rpx;
  }
  .order-detail .order-status {
    flex: 1;
    display: flex;
    text-align: right;
    flex-direction: column;
  }
  .order-status text {
    flex: 1;
  }
</style>
