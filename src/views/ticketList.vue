<template>
	<div style="height: 100%;overflow: hidden;">
		<Header v-if="$store.state.metro" :back="false" title="卡券"></Header>
		<v-container style="padding: 0 16px;" class="white">
			<v-tabs v-model="tab" color="red" slider-size="3" centered grow>
				<v-tab v-for="(item,index) in tabsData" :key="index">
					<span style="font-size: 16px;font-weight: bold;">{{item.tabTitle}}</span>
				</v-tab>
			</v-tabs>
		</v-container>


		<v-tabs-items v-if="getToken" v-model="tab">
			<v-tab-item v-for="(item,index) in tabsData" :key="index">
				<ticketScroller :key="index" :order="index"></ticketScroller>
			</v-tab-item>
		</v-tabs-items>

	</div>
</template>

<script>
	import ticketScroller from '@/components/ticketScroller.vue'
	export default {
		data() {
			return {
				tab: null,
				getToken: false,
				tabsData: [{
						tabTitle: '未使用'
					},
					{
						tabTitle: '已使用'
					},
					{
						tabTitle: '已失效'
					}
				]
			}
		},
		components: {
			ticketScroller
		},
		beforeRouteEnter(to, from, next) {
			document.title = to.meta.title;//修改title
			//活动跳卡券时，不缓存；其他情况均取缓存页面
			if(from.name == 'detailPage'){
				to.meta.keepAlive = false;
			}else{
				to.meta.keepAlive = true;
			}
			
			next();
		},
		created() {
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
					
			// this.getToken = true;
					
			if (metro) {
				this.$store.state.metro = false;
			}
		}

	}
</script>
<style scoped>
	.v-tab:before {
		background-color: white;
		content: "";
		opacity: 0;
	}
</style>
