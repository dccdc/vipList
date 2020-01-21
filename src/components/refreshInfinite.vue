<template>
	<div style="height: 100%;" >
		<scroller ref="myscroller" noDataText="我是有底线的" :on-refresh="refresh" :on-infinite="infinite" >
			<!-- content goes here -->
			<v-list   v-for="(item, index) in tabItemList" :key="index" three-line style="border-radius:0;padding: 0">
				
					<hr :key="index" style="border: 4px solid rgba(199, 195, 195, 0.12);" />
					<v-list-item :key="item.title"  @click="toDetailPage(item.code,item.nav_type,item.nav_hreflink)">
						<v-list-item-avatar tile style="width:40%;height:6rem;margin:8px 8px 8px 0;">
							<v-img class="sub" data-sub="最新" :src="item.list_img" style="border-radius: 0 5px 5px 5px;"></v-img>
						</v-list-item-avatar>
									
						<v-list-item-content class="pt-1 pb-1">
							<v-list-item-subtitle class="font-regular body-1 black--text" >{{item.title}}</v-list-item-subtitle>
							<v-list-item-subtitle class="font-regular caption mt-3" >广东广州</v-list-item-subtitle>
							<v-list-item-subtitle>
								<span  class="font-regular caption">{{timeFormatePlus(item.begin_time)}}-{{timeFormatePlus(item.end_time)}}</span>
								<span class="font-weight-bold caption float-right" style="color:#D63130;">￥120</span>
							</v-list-item-subtitle>
						</v-list-item-content>
					</v-list-item>
					<v-divider :key="index+'hr'"></v-divider>
					<v-row :key="index+'bar'" style="padding: 0 16px">
						<v-col style="text-align:right;padding: 8px 12px;">
							<span class="font-regular caption float-left pt-1" >{{item.mer_name}}</span>
							<span class="mr-2 caption" style="color:#D63130;">剩余名额XX个</span>
							<v-btn small color="#D63130" outlined rounded @click="toDetailPage(item.code,item.nav_type,item.nav_hreflink)">立即报名</v-btn>
						</v-col>
					</v-row>
				
			</v-list>
		</scroller>
	</div>
	
</template>

<script>
	import Axios from "@/api/api.js";
	export default{
		props:['activityId','message'],
		data(){
			return{
				tabItemList:[],
				pageSize: 5,
				page: 1,
				firstLoading: true
			}
		},
		watch:{
			message(newVal,oldVal){
				//配合搜索框，触发刷新
				this.$refs.myscroller.triggerPullToRefresh();
			}
		},
		created(){
			
		},
		methods:{
			refresh(done) {
				this.$store.state.noRefreshOrInfinite = false;// 禁止过渡动画
				var page = 1;
				this.page = 1;//当数据不满一页时，刷新时会调用infinite函数，此处重置一下page
				this.getData(done,page,this.message);
			},
			infinite(done) {
				this.$store.state.noRefreshOrInfinite = false;
				if(this.firstLoading){//第一次加载时，页码不加1
					this.firstLoading = false;
				}else{
					this.page++;
				}
				this.getData(done,this.page,this.message);
			},
			toDetailPage: function(code,nav_type,nav_hreflink) {
				this.$store.state.noRefreshOrInfinite = true;// 恢复过渡动画
				if(nav_type == 'page'){
					// 打开app内置的h5
					console.log('打开app内置的h5');
				}else if(nav_type == 'hreflink'){
					// 跳到外部链接
					metro.goToDetail("消息详情", nav_hreflink);
				}else if(nav_type == 'webview'){
					// 打开活动页
					this.$router.push({
						name: 'detailPage',
						params: {code: code}
					});
				}else if(nav_type == 'app'){
					// 直接打开第三方app
					console.log('打开第三方app');
				}
				
			},
			getData(done,page,message){
				var that = this;
				var url = 'member/activity/list';
				var reqData = {
					page: page,
					pagesize: this.pageSize,
					member_id: null,
					activity_type_id: this.activityId,
					query_text: message 
				}
				var reqParams = {
					data: JSON.stringify(reqData),
					access_token: this.token
				}
				
				Axios.post(url, reqParams)
					.then(function(response) {
						//每一次请求的活动列表数据
						var list = JSON.parse(response.data.data).activities; 
						if (page > 1) { //上拉加载拼接数组
							that.tabItemList = that.tabItemList.concat(list);
						} else { //下拉刷新
							that.tabItemList = list;
						}
						if (typeof(done) == "function") {
							done();
						}
						 //每次请求都是5条数据，小于5说明没有更多数据了
						if (list.length < 5) {
							that.$refs.myscroller.finishInfinite(true);
						}
				
						console.log("活动列表:",list);
						
					})
					.catch(function(error) {
						// console.log(error);
					});
			}
		},
	}
</script>
