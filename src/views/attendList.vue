<template>
	<div style="height: 100vh;overflow: hidden;">
		<v-container>
			<v-row>
				<!-- <v-col cols="12">
					待参加的活动
				</v-col> -->
			</v-row>
		</v-container>
		<div style="height: 100%;position: relative;">
			<refreshInfinite  :activityId="1" ></refreshInfinite>
		</div>
	</div>
	
</template>

<script>
	import refreshInfinite from '@/components/refreshInfinite.vue'
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
		components:{
			refreshInfinite
		},
		watch:{
			message(newVal,oldVal){
				//配合搜索框，触发刷新
				this.$refs.myscroller.triggerPullToRefresh();
			}
		},
		created(){
			setTimeout(()=>{
				this.$store.state.showTooltips = false;
			},1000)
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
			toDetailPage: function(code) {
				this.$store.state.noRefreshOrInfinite = true;// 恢复过渡动画
				this.$router.push({
					name: 'detailPage',
					params: {code: code}
				})
			},
			getData(done,page,message){
				var that = this;
				var url = 'member/activity/list';
				var reqData = {
					page: page,
					pagesize: this.pageSize,
					member_id: null,
					activity_type_id: 1,
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
				
						// console.log("活动列表:",list);
						
					})
					.catch(function(error) {
						// console.log(error);
					});
			}
		},
	}
</script>

<style>
</style>
