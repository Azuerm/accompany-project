<template>
	<view class="content">
		<image class="logo" src="/static/logo.png"></image>
		<view class="text-area">
			<text class="title">{{title}}</text>
		</view>
    <button @click="changeNumber">添加</button>
    <view>水果总数：{{ totalNumber }}</view>
    <view v-for="item in list" :key="item.name">
      <text>{{ item.name }}</text>
      <text>{{ item.number }}</text>
    </view>
    <!-- <mycomponent />全局组件 -->
    <!-- <myComponent /> 自定义组件 -->
    <navbar />
	</view>
</template>

<script setup>
	// import myComponent from '../../myComponents/component.vue'
  import { ref, reactive, computed } from 'vue'
  import { onLoad} from '@dcloudio/uni-app'
  const title = ref('Hello')
  const list = reactive([
    { name: '苹果', number: 1},
    { name: '香蕉', number: 2},
    { name: '橙子', number: 3},
    { name: '葡萄', number: 4},
  ])
  const changeNumber = () => {
    list.forEach(item => {
      item.number++;
    })
  }
  const totalNumber = computed(() => {
    return list.reduce((total, cur) => total + cur.number, 0)
  })
  onLoad(() => {
    console.log('页面级生命周期onLoad，title.value', title.value);
  })
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>
