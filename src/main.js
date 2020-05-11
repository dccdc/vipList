import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import LyTab from './plugins/LyTab.js';
import scroller from './plugins/vue-scroller.js';
import Header from '@/components/common/Header.vue'


import '@/assets/global.css' //引入全局css样式
// 全局注册组件
Vue.component('Header', Header);

Vue.config.productionTip = false

// 全局变量需要将变量设置为引用，直接赋值只是给每个组件增加了属性，这个属性值并不具有全局性
Vue.prototype.$var = {
	name: ''
}
//全局函数，格式化时间
Vue.prototype.timeFormate = function(params) {
	var date = null;
	if (params) {
		date = new Date(params);
	} else {
		date = new Date();
	}
	var year = date.getFullYear() + '-';
	var month = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
	var day = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
	var hour = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
	var minute = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
	var second = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
	return year + month + day + hour + minute + second;
}
Vue.prototype.timeFormatePlus = function(params) {
	var dateArray = params.split(' ');
	var dayArray = dateArray[0].split('-');
	return dayArray[1] + '/' + dayArray[2];
}
Vue.prototype.dateFormate = function(params) {
	var dateArray = params.split(' ');
	var dayArray = dateArray[0].split('-');
	var hourArray = dateArray[1].split(':');
	return dayArray[1] + '/' + dayArray[2] + ' ' + hourArray[0] + ':' + hourArray[1];
}

Vue.prototype.formate = function(number) {
	if (number > 0)
		number = '+' + number;
	return number;
}
Vue.prototype.$bindAppBack = function() {
	window['metroBack'] = data => {
		this.$router.go(-1);
	}
	try {
		metro.bindBack();
	} catch (e) {

	}
}
new Vue({
	router,
	store,
	vuetify,
	LyTab,
	scroller,
	render: h => h(App)
}).$mount('#app')
