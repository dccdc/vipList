<template>
	<div style="height: 100%;overflow: hidden;">
		<Header v-if="$store.state.metro" :back="false" title="活动列表"></Header>
		<v-container class="pb-0 white" >
			<v-row style="height:2.5rem">
				<v-col cols="12" style="padding-top: 0px;padding-bottom: 0px;">
					<v-text-field @keydown="search" placeholder="搜索活动名称" v-model="message" dense outlined clearable type="search"
					 color="#D63130">
						<template v-slot:prepend-inner>
							<v-icon>search</v-icon>
						</template>
					</v-text-field>
				</v-col>
			</v-row>
			<!-- 通过v-model实现tab与tab-item绑定 -->
			<v-tabs @change="tabChange" v-model="tab" color="red" active-class="titleTab" grow>
				<v-tab v-for="(item,index) in tabTitleData" :key="index">
					{{item.activity_type_name}}
				</v-tab>
			</v-tabs>
		</v-container>
		<!-- touch-action: none阻止滑动报错 -->
		<div style="height: 95%;">
			<v-tabs-items v-if="getToken" @change="tabItemChange" v-model="tab" style="height: 100%;touch-action: none">
				<v-tab-item v-for="(item,index) in tabTitleData" :key="index">
					<refreshInfinite  v-if="reset" :key="index" :activityId="item.activity_type_id" :message="query_text"></refreshInfinite>
				</v-tab-item>
			</v-tabs-items>
		</div>


	</div>
</template>

<script>
	import refreshInfinite from '@/components/refreshInfinite.vue'
	import Axios from "@/api/api.js";
	export default {
		data() {
			return {
				message: null,
				tab: null,
				pageSize: 5,
				tabTitleData: [],
				query_text: '',
				reset: true,
				getToken: false
				
			}
		},
		components: {
			refreshInfinite
		},
		watch:{
			message(newVal, oldVal){
				// 清空搜索框时，重置查询条件
				if(newVal == null){
					this.query_text = null;
				}
			}
		},
		methods: {
			search(e) {//按下键盘时触发
				//回车时 ，重新查询
				if (e.key == 'Enter') {
					this.query_text = this.message;
				}
				// 删除至条件为空时，执行查询操作
				if(e.key == 'Backspace' && this.message.length == 1){
					this.query_text = null;
				}
			},
			tabChange(e) {
				// this.query_text = null //重置查询框
				// 销毁并重置组件，销毁后将无法取到缓存页面，若不销毁组件，上拉回弹会失效
				this.reset = false
				this.$nextTick(() => {
					this.reset = true
				})
				// console.log('点击监听tab',e);
			},
			tabItemChange(e) {
				// this.query_text = null
				// 销毁并重置
				this.reset = false
				this.$nextTick(() => {
				this.reset = true
				})
				// console.log('滑动监听tabItem',e);
			},
			getTabs() {
				var that = this;
				var url = 'member/activity/typelist';

				var reqParams = {
					data: JSON.stringify({}),
					access_token: this.$store.state.token
				};

				Axios.post(url, reqParams)
					.then(function(response) {
						var list = JSON.parse(response.data.data);
						that.tabTitleData = list.activity_types;

						// console.log("tab类别:",list);

					})
					.catch(function(error) {
						// console.log(error);
					});
			}
		},
		created() {
			// 获取官方app的token
			window['h5EditorRenderData'] = data => {
			  if (data.code == "200") {
					this.$store.state.token = data.accesstoken;
					this.getToken = true;
					this.getTabs();
			  } 
			}
			
			try {
			  var dataOfGetTk = '{"appid":"2018112000000201","partnerid":"000002","reqsign":"kipKJAvz3gAdIwUCOYEjw9tPcOvJzAbmUclCCKCQWNCzwkO8Xq6C6a5GjobUhnzkX6mqRhQGEiSCv+DSk1Le8lM4IRFpgD3FyQHjaz+Sd5uM2GxnEVIxtxT49x8haEpYUIgpKtI38dEcpDDHcV6VBw3gr3VbHEipARzDC0tFwZc=","timestamp":"2019-08-20 19:10:45"}';
			  metro.getAccessToken(dataOfGetTk, 'h5EditorRenderData');
			} catch (e) {}
			
			// this.getToken = true;
			// this.getTabs();
			
			// 	根据是否在app中加上头部
			if(metro){
				this.$store.state.metro = false;
			}
			
		},
		updated() { //在mounted后面，待dom生成完毕后，修改框架样式
			//去掉tab头部的空白部分
			var arrayClass = document.getElementsByClassName('v-slide-group__prev v-slide-group__prev--disabled');
			arrayClass.forEach(function(e) {
				// e.className += ' space'
				e.style.cssText = "display:none"
			})
			//修改tab的样式
			var tabClass = document.getElementsByClassName('v-tab');
			tabClass.forEach(function(e) {
				e.style.cssText = `min-width: 60px;padding:0 5px;
				font-size: 16px;font-weight: bold;`
			})
		}
	}
</script>
<style scoped>
	.titleTab {
		font-weight: bold;
		font-size: 20px !important;
	}

	.v-tab:before {
		background-color: white;/* 去掉tab头部的背景色 */
		content: "";
		opacity: 0;

	}
</style>
