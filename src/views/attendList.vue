<template>
	<div style="height: 100vh;overflow: hidden;">
		<Header v-if="$store.state.metro" :back="true" title="已报名的活动"></Header>
		<div style="height: 100%;position: relative;">
			<refreshInfinite v-if="getToken" :myActivity="myActivity" user_status="ATTEND"></refreshInfinite>
		</div>
	</div>
	
</template>

<script>
	import refreshInfinite from '@/components/refreshInfinite.vue'
	import Axios from "@/api/api.js";
	export default{
		data(){
			return{
				getToken: false,
				myActivity: true
			}
		},
		components:{
			refreshInfinite
		},
		beforeRouteEnter(to, from, next) {
			document.title = to.meta.title;//修改title
			next();
		},
		beforeRouteLeave(to, from, next){
			if(to.name){
				this.$bindAppBack();
			}
			next();
		},
		created(){
			// 获取官方app的token
			window['h5EditorRenderData'] = data => {
			  if (data.code == "200") {
					this.$store.state.token = data.accesstoken;
					this.getToken = true;
			  } 
			}
			
			try {
			  var dataOfGetTk = '{"appid":"2018112000000201","partnerid":"000002","reqsign":"kipKJAvz3gAdIwUCOYEjw9tPcOvJzAbmUclCCKCQWNCzwkO8Xq6C6a5GjobUhnzkX6mqRhQGEiSCv+DSk1Le8lM4IRFpgD3FyQHjaz+Sd5uM2GxnEVIxtxT49x8haEpYUIgpKtI38dEcpDDHcV6VBw3gr3VbHEipARzDC0tFwZc=","timestamp":"2019-08-20 19:10:45"}';
			  metro.getAccessToken(dataOfGetTk, 'h5EditorRenderData');
			} catch (e) {}
			
			// 	根据是否在app中加上头部
			if(metro){
				this.$store.state.metro = false;
			}
			
			
		}
	}
</script>

<style>
</style>
