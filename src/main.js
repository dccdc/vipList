import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import LyTab from './plugins/LyTab.js';
import scroller from './plugins/vue-scroller.js';

import '@/assets/global.css'//引入全局css样式

Vue.config.productionTip = false
Vue.prototype.token =
	'eyJhbGciOiJIUzI1NiJ9.eyJpc3N1ZXIiOiJBY2NvdW50cyBKV1QgSXNzdWVyIDAuMSIsInBhcnRuZXJpZCI6IjAwMDAwMiIsImFwcGlkIjoiMjAxODExMjAwMDAwMDIwMSIsInN1YiI6IjA5ZDUyMWFmLTE4ZDItNDJmMi04NWExLTdmNzQ5ZWU3NmFkMCIsImV4cCI6MTU4MDA4MDUxMH0.YIapIOFOBqm87OrOq6W6Eb9fhdvSf-B891aY2rE3_eA'
//全局函数，格式化时间
Vue.prototype.timeFormate = function(params) {
	var date = new Date(params);
	var year = date.getFullYear() + '-';
	var month = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
	var day =  (date.getDate() < 10 ? '0'+date.getDate() : date.getDate())+ ' ';
	var hour = (date.getHours() < 10 ? '0'+date.getHours() : date.getHours())+ ':';
	var minute = (date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes()) + ':';
	var second = (date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds());
	return year+month+day+hour+minute+second;
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

Vue.prototype.formate = function(number){
		if(number > 0)
			number = '+' + number;
		return number;
}
new Vue({
	router,
	store,
	vuetify,
	LyTab,
	scroller,
	render: h => h(App)
}).$mount('#app')
