import Vue from 'vue'
import App from './App'
Vue.prototype.websiteUrl = 'http://localhost:3000/';

Vue.prototype.back = function(obj) {
	uni.navigateBack({

	})
}
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()
