import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Index from '../views/Index.vue'
import ActivityDetails from '../views/activityDetails.vue'
import pointsRecord from '../views/pointsRecord.vue'
import ticketList from '../views/ticketList.vue'
import ticketDetail from '../views/ticketDetail.vue'
import writeOffCode from '../views/write-offCode.vue'
import map from '../views/map.vue'
import attendList from '../views/attendList.vue'

Vue.use(VueRouter)

const routes = [
	{
		path: '/index',
		name: 'index',
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () => import( /* webpackChunkName: "about" */ '../views/Index.vue')
	},
	{
		path: '/home',
		name: 'home',
		component: Home
	},
	{
		path: '/detailPage',
		name: 'detailPage',
		component: ActivityDetails
	},
	{
		path: '/pointsList',
		name: 'pointsList',
		component: pointsRecord
	},
	{
		path: '/ticketList',
		name: 'ticketList',
		component: ticketList
	},
	{
		path: '/ticketDetail',
		name: 'ticketDetail',
		component: ticketDetail
	},
	{
		path: '/writeOffCode',
		name: 'writeOffCode',
		component: writeOffCode
	},
	{
		path: '/map',
		name: 'map',
		component: map
	},
	{
		path: '/attendList',
		name: 'attendList',
		component: attendList
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
