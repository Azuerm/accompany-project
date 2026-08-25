<template>
  <view class="container">
    <!-- 触发器 -->
    <picker 
      mode="multiSelector" 
      @change="bindMultiPickerChange" 
      @columnchange="bindMultiPickerColumnChange" 
      :value="multiIndex" 
      :range="multiArray"
      range-key="label"
    >
      <view class="picker-display">
        <!-- 显示选中的时间，或者默认占位符 -->
        <text :class="{ 'placeholder': !selectedTimeStr }">
          {{ selectedTimeStr || (textType == 'consult_time' ? '请选择就诊时间' : '请选择期待服务时间') }}
        </text>
        <image
          src="@/static/resource/service_right.png"
        />
      </view>
    </picker>
  </view>
</template>

<script setup>
import { ref, onMounted, defineProps, defineEmits } from 'vue';
const { textType } = defineProps({
  textType: {
    type: String
  }
})
// --- 状态定义 ---
const multiArray = ref([[], []]); // [日期数组, 时间数组]
const multiIndex = ref([0, 0]);   // 当前选中的索引 [日期索引, 时间索引]
const selectedTimeStr = ref('');  // 最终显示的字符串

// 配置项
const config = {
  daysToShow: 7,      // 往后推几天
  startHour: 8,       // 开始时间 8:00
  endHour: 20,        // 结束时间 20:00
  interval: 30        // 时间间隔（分钟）
};

onMounted(() => {
  initPickerData();
});
// 返回时间戳格式给服务页面
const emit = defineEmits(['timestampChange']);
// --- 初始化数据 ---
const initPickerData = () => {
  const dateList = [];
  const now = new Date();
  
  // 1. 生成日期列 (例如：8月24日(今天), 8月25日(明天)...)
  for (let i = 0; i < config.daysToShow; i++) {
    const tempDate = new Date(now);
    tempDate.setDate(now.getDate() + i);
    
    const month = tempDate.getMonth() + 1;
    const day = tempDate.getDate();
    const weekDay = getWeekDay(tempDate.getDay());
    
    let label = `${month}月${day}日`;
    if (i === 0) label += '(今天)';
    else if (i === 1) label += '(明天)';
    else label += `(${weekDay})`;
    
    // 存入对象，方便后续获取具体时间戳进行判断
    dateList.push({
      label: label,
      fullDate: tempDate, // 保存完整日期对象用于比较
      isToday: i === 0
    });
  }
  
  multiArray.value[0] = dateList;
  
  // 2. 初始化时间列 (默认根据“今天”的情况生成)
  updateTimeColumn(0); 
};

// --- 核心逻辑：更新时间列 ---
// index: 当前选中的日期在日期列中的索引
const updateTimeColumn = (dateIndex) => {
  const timeList = [];
  const selectedDateObj = multiArray.value[0][dateIndex].fullDate;
  const now = new Date();
  
  // 判断选中的日期是否是今天
  const isSameDay = selectedDateObj.toDateString() === now.toDateString();
  
  // 生成所有可能的时间点
  for (let h = config.startHour; h <= config.endHour; h++) {
    for (let m = 0; m < 60; m += config.interval) {
      // 格式化时间 HH:mm
      const timeStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
      
      // 如果是今天，需要过滤掉已经过去的时间
      if (isSameDay) {
        const currentHour = now.getHours();
        const currentMin = now.getMinutes();
        
        // 如果 生成的小时 < 当前小时，跳过
        if (h < currentHour) continue;
        // 如果 小时相同 但 分钟 <= 当前分钟，跳过
        if (h === currentHour && m <= currentMin) continue;
      }
      
      timeList.push({label: timeStr});
    }
  }
  
  // 更新 picker 的第二列数据
  // 注意：这里使用 splice 或者直接赋值整个数组来触发响应式更新
  const newArray = [...multiArray.value];
  newArray[1] = timeList.length > 0 ? timeList : ['无可选时间'];
  multiArray.value = newArray;
  
  // 重置时间索引为 0
  const newIndex = [...multiIndex.value];
  newIndex[1] = 0;
  multiIndex.value = newIndex;
};

// --- 事件处理 ---

// 1. 滚动列时触发 (关键：滑动日期列，要重新计算时间列)
const bindMultiPickerColumnChange = (e) => {
  const { column, value } = e.detail;
  
  // 更新当前索引
  const newIndex = [...multiIndex.value];
  newIndex[column] = value;
  multiIndex.value = newIndex;
  
  // 如果变动的是第一列（日期列），则刷新第二列（时间列）
  if (column === 0) {
    updateTimeColumn(value);
  }
};

// 2. 点击确定时触发
const bindMultiPickerChange = (e) => {
  const val = e.detail.value; // [日期索引, 时间索引]
  
  // 边界检查
  if (!multiArray.value[1] || multiArray.value[1][val[1]] === '无可选时间') {
    uni.showToast({ title: '该时间段不可选', icon: 'none' });
    return;
  }
  
  const dateObj = multiArray.value[0][val[0]];
  const timeStr = multiArray.value[1][val[1]].label;
  
  // 组合最终结果：8月24日(今天) 15:18
  selectedTimeStr.value = `${dateObj.label} ${timeStr}`;selectedTimeStr
  
  console.log('最终选中时间:', selectedTimeStr.value);

  // 组合完整日期功能 -》 时间戳
  const [hours, minutes] = timeStr.split(':')
  const fullDate = new Date(dateObj.fullDate)
  fullDate.setHours(hours, minutes, 0, 0)
  const timestamp = fullDate.getTime()
  emit('timestampChange', timestamp)
};

// 辅助函数：获取星期几
const getWeekDay = (dayIndex) => {
  const weeks = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  return weeks[dayIndex];
};
</script>

<style scoped>
.picker-display {
  display: flex;
  /* justify-content: space-between;
  align-items: center;
  padding: 20rpx;
  background-color: #fff; */
}
.picker-display image {
  width: 36rpx;
  height: 36rpx;
  vertical-align: middle;
}
.placeholder {
  color: #999;
}

</style>