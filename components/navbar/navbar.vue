<template>
	<view>
		navbar页面
    <view>name内容--{{ name }}</view>
    <view>content内容--{{ content }}</view>
    <slot></slot>
    <button @click="handleChangeContent">修改content</button>
	</view>
</template>

<script setup>
	import { defineProps, defineEmits } from 'vue'
  // defineProps(['name', 'content'])
  defineProps({
    name: String,
    content: {
      default: () => {
        return '默认内容'
      }
    }
  })
  const emit = defineEmits(['changeDetailsContent'])
  const handleChangeContent = () => {
    emit('changeDetailsContent', '修改后的内容----')
  }
</script>

<style>

</style>
