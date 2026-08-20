<script>
 import Utils from './common/js/utils.js'
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
    globalData: {
      // 全局变量，用于在其他页面中调用
      utils: Utils
    }
	}
</script>

<style>
	/*每个页面公共css */
	@import './app.css';
</style>
