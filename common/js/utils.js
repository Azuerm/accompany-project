class Utils {
  // class的作用是封装一些常用的函数，方便在其他地方调用
  constructor() {
    // constructor的作用是：初始化类的属性，一般用于设置默认值
    this.baseUrl = 'http://159.75.169.224:7300/pz' // 基础url
  }
  // 获取用户信息
  getUserInfo() {
    // 调用登录api
    uni.login({
      success: (res) => {
        console.log('登录结果', res)
        this.request({
          url: '/auth/wxLogin',
          data: {
            code: res.code
          },
          success: res => {
            console.log('登录成功', res)
          }
        })
      },
      fail: (err) => {
        console.log('登录失败', err)
      }
    })
  }
  // 请求封装
  request(options = {
    showLoading: false,
  }) {
    // 判断url是否存在，
    if (!options.url) {
      return false
    }
    // 判断是否显示loading
    if (options.showLoading) {
      this.showLoading()
    }
    // 发起请求
    uni.request({
      // url是请求路径(http://159.75.169.224:7300/pz/auth/wxLogin)：基础url + 请求路径(例如：/login)
      url: this.baseUrl + options.url,
      data: options.data ? options.data : {},
      header: options.header ? options.header : {},
      method: options.method ? options.method : 'GET',
      success: (response) => {
        uni.hideLoading()
        // 后端返回的数据异常
        if (response.data.code !== 10000) {
          // 把失败的结果返回出去
          if (options.fail && typeof options.fail === 'function'){
            options.fail(response.data)
          }
        } 
        // 后端返回的数据正常
        else{
          // 把成功的结果返回出去
          if (options.success && typeof options.success === 'function'){
            options.success(response.data)
          }
        }
      },
      fail: (response) => {
        uni.hideLoading()
        console.log('请求失败', response)
      }
    })
  }
  // 创建加载的loading效果：避免重复显示loading效果
  showLoading() {
    // 从本地缓存中查看是否显示loading效果
    const isShowLoading = uni.getStorageSync('isShowLoading')

    // 1 如果已经显示loading效果，就先隐藏loading效果
    if (isShowLoading) {
      // 已经显示loading效果
      uni.hideLoading()
      uni.setStorageSync('isShowLoading', false)
    } 
    // 2 如果没有显示loading效果，就显示loading效果
    uni.showLoading({
      title: '加载中...',
      complete: function() {
        // 无论请求成功还是失败，都显示loading效果
        uni.setStorageSync('isShowLoading', true)
      },
      fail: function() {
        // 请求失败时，就不显示loading效果
        uni.setStorageSync('isShowLoading', false)
      }
    })
  }
}
export default new Utils()
// 为什么是new Utils()而不是Utils()呢？因为Utils是一个类，而类需要实例化才能使用，实例化后才能调用类中的方法