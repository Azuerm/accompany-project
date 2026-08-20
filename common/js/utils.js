class Utils {
  // class的作用是封装一些常用的函数，方便在其他地方调用

  // 获取用户信息
  getUserInfo() {
    // 调用登录api
    uni.login({
      success: function (res) {
        console.log('登录结果', res)
      }
    })
  }
}
export default new Utils()
// 为什么是new Utils()而不是Utils()呢？因为Utils是一个类，而类需要实例化才能使用，实例化后才能调用类中的方法