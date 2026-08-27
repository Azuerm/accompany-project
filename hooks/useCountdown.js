import { ref } from 'vue'

// 订单倒计时组合式函数，供订单列表页和订单详情页共用
export function useCountdown() {
  // 倒计时数据 { key: 剩余毫秒数 }
  const countdownMap = ref({})
  // 定时器引用
  let countdownTimer = null

  // 启动倒计时
  // items: [{ key, remain }]，remain为剩余毫秒数；onExpire: 有订单到期时的回调
  const startCountdown = (items, onExpire) => {
    // 清除上一次的定时器，避免重复轮转产生多个回调
    stopCountdown()
    // 为每个倒计时项设置初始值
    const map = {}
    items.forEach(({ key, remain }) => {
      if (remain > 0) {
        map[key] = remain
      }
    })
    countdownMap.value = map
    // 没有待倒计时的订单则不启动定时器
    if (!Object.keys(map).length) return
    // 每秒递减
    countdownTimer = setInterval(() => {
      let expired = false
      for (const key in countdownMap.value) {
        if (countdownMap.value[key] > 1000) {
          countdownMap.value[key] -= 1000
        } else if (countdownMap.value[key] > 0) {
          countdownMap.value[key] = 0
          expired = true // 标记有订单刚好到期
        }
      }
      // 有订单到期时先停止定时器再触发回调（回调里一般会重新请求数据）
      if (expired) {
        stopCountdown()
        if (onExpire && typeof onExpire === 'function') {
          onExpire()
        }
      }
    }, 1000)
  }

  // 停止倒计时
  const stopCountdown = () => {
    if (countdownTimer) {
      clearInterval(countdownTimer)
      countdownTimer = null
    }
  }

  // 格式化时间:时分秒
  const formatCountdown = (ms) => {
    const totalSeconds = Math.floor((ms || 0) / 1000)
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0')
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0')
    const seconds = String(totalSeconds % 60).padStart(2, '0')
    return `${hours}:${minutes}:${seconds}`
  }

  return {
    countdownMap,
    startCountdown,
    stopCountdown,
    formatCountdown
  }
}
