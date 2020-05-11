import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../views/Index.vue'
import ActivityDetails from '../views/activityDetails.vue'
import pointsRecord from '../views/pointsRecord.vue'
import ticketList from '../views/ticketList.vue'
import ticketDetail from '../views/ticketDetail.vue'
import writeOffCode from '../views/write-offCode.vue'
import map from '../views/map.vue'
import attendList from '../views/attendList.vue'
import usedTicket from '../views/usedTicket.vue'

Vue.use(VueRouter)

const routes = [
	{
		path: '/index',
		name: 'index',
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () => import( /* webpackChunkName: "about" */ '../views/Index.vue'),
		meta:{
				keepAlive: true,//需要缓存
		}
	},
	{
		path: '/detailPage',
		name: 'detailPage',
		component: ActivityDetails,
		meta:{
				  keepAlive: true,//需要缓存
				  isBack:false, //用于判断上一个页面是哪个
				  firstEnter:true
		}
	},
	{
		path: '/pointsList',
		name: 'pointsList',
		component: pointsRecord
	},
	{
		path: '/ticketList',
		name: 'ticketList',
		component: ticketList,
		meta:{
				  keepAlive: true,//需要缓存
				  title: '卡券'
		}
	},
	{
		path: '/ticketDetail',
		name: 'ticketDetail',
		component: ticketDetail,
		meta:{
				  keepAlive: true,//需要缓存
				  isBack:false, //用于判断上一个页面是哪个
				  firstEnter:true
		}
	},
	{
		path: '/writeOffCode',
		name: 'writeOffCode',
		component: writeOffCode,
		meta:{
				  keepAlive: true,//需要缓存
				  isBack:false, //用于判断上一个页面是哪个
				  firstEnter:true
		}
	},
	{
		path: '/usedTicket',
		name: 'usedTicket',
		component: usedTicket
	},
	{
		path: '/map',
		name: 'map',
		component: map
	},
	{
		path: '/attendList',
		name: 'attendList',
		component: attendList,
		meta:{
				  title: '我的活动'
		}
	},
	{
		path: '*',
		name: 'index',
		component: Index
	},
]

const router = new VueRouter({
	routes
})

export default router
