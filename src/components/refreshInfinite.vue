<template>
	<div style="height: 100%;">
		<scroller ref="myscroller" noDataText="没有更多数据了" :on-refresh="refresh" :on-infinite="infinite">
			<!-- content goes here -->
			<v-list v-for="(item, index) in listData" :key="index" three-line style="border-radius:0;padding: 0">

				<hr :key="index" style="border: 4px solid rgba(199, 195, 195, 0.12);" />
				<v-list-item :key="item.title" @click="toDetailPage(item.code,item.nav_type,item.nav_hreflink)">
					<v-list-item-avatar tile style="width:40%;height:6rem;margin:8px 8px 8px 0;">
						<v-img :id="'sub'+index" :class="item.subclass" data-expireSub="已过期" data-sub="最新"  :src="item.list_img" style="border-radius: 0 5px 5px 5px;"></v-img>
					</v-list-item-avatar>

					<v-list-item-content class="pt-1 pb-1">
						<v-list-item-subtitle class="font-regular body-1 black--text">{{item.title}}</v-list-item-subtitle>
						<v-list-item-subtitle class="font-regular caption mt-3">{{item.address}}</v-list-item-subtitle>
						<v-list-item-subtitle>
							<span class="font-regular caption">{{timeFormatePlus(item.begin_time)}}-{{timeFormatePlus(item.end_time)}}</span>
							<!-- <span class="font-weight-bold caption float-right" style="color:#D63130;">￥120</span> -->
						</v-list-item-subtitle>
					</v-list-item-content>
				</v-list-item>
				<v-divider :key="index+'hr'"></v-divider>
				<v-row :key="index+'bar'" style="padding: 0 16px">
					<v-col style="text-align:right;padding: 8px 12px;">
						<span class="font-regular caption float-left pt-1">{{item.mer_name}}</span>
						<span v-if="item.showPlaces" class="mr-2 caption" style="color:#D63130;">{{item.surplusPlaces}}</span>
						<v-btn small color="#D63130" outlined rounded @click="toDetailPage(item.code,item.nav_type,item.nav_hreflink)">{{item.msg}}</v-btn>
					</v-col>
				</v-row>

			</v-list>
		</scroller>
	</div>

</template>

<script>
	import Axios from "@/api/api.js";
	export default {
		props: ['activityId', 'message', 'myActivity','user_status'],
		data() {
			return {
				tabItemList: [],
				pageSize: 5,
				page: 1,
				firstLoading: true
			}
		},
		watch: {
			message(newVal, oldVal) {
				//配合搜索框，触发刷新
				this.$refs.myscroller.triggerPullToRefresh();
			}
		},
		computed: {
			listData: function(){
				var that = this;
				this.tabItemList.forEach((e,i)=>{
					let count = e.per_limit - e.attend_count;
					if (count > 0) {
						e.surplusPlaces = `剩余名额${count}个`;
					}else{
						e.surplusPlaces = '名额已满'
						e.showPlaces = false;
					}
					// status为DISABLED和名额已满时时，隐藏剩余数量
					if(e.status == 'DISABLED'){
						e.showPlaces = false;
					}else{
						e.showPlaces = true;
					}
					
				
					// 在我的活动列表，活动过期时，加上class
					if(this.myActivity){
						var endTime = new Date(e.end_time) || this.iosformatTimeStamp(e.end_time); //兼容ios转换时间
						var today = new Date();
						var timeInterval = parseInt((today.getTime() - endTime.getTime()) / 1000 / 60 / 60);
						if (timeInterval > 0) {
							e.subclass = 'expireSub';
						}
						// console.log('相差多少小时：', timeInterval);
						// 根据用户使用卡券的状态修改按钮值
						if(e.user_status == 'UNATTEND'){
							e.msg = '未参与'
						}else if(e.user_status == 'ATTEND'){
							e.msg = '已参与'
						}else if(e.user_status == 'CANCEL'){
							e.msg = '已取消'
						}
					}
				});
				return this.tabItemList;
			}
		},
		updated() {
			//三天之内发布的活动为最新
			this.tabItemList.forEach(function(e, index) {
				var sub = document.getElementById('sub' + index);
				var releaseTime = new Date(e.release_time) || this.iosformatTimeStamp(e.release_time); //兼容ios转换时间
				var today = new Date();
				var timeInterval = parseInt((today.getTime() - releaseTime.getTime()) / 1000 / 60 / 60);
				if (timeInterval < 72) {
					sub.className += ' sub';
				}
				// console.log(today.getTime(),releaseTime.getTime());
				// console.log('相差多少小时：', timeInterval);
			})

		},
		methods: {
			refresh(done) {
				this.$store.state.noRefreshOrInfinite = false; // 禁止过渡动画
				var page = 1;
				this.page = 1; //当数据不满一页时，刷新时会调用infinite函数，此处重置一下page
				this.getData(done, page, this.message);
			},
			infinite(done) {
				this.$store.state.noRefreshOrInfinite = false;
				if (this.firstLoading) { //第一次加载时，页码不加1
					this.firstLoading = false;
				} else {
					this.page++;
				}
				this.getData(done, this.page, this.message);
			},
			iosformatTimeStamp: function(time) {
				var timeArray = time.split(' ');
				var dateArray = timeArray[0].split('-');
				var iosDate = dateArray.join('/');
				var iosTime = iosDate + ' ' + timeArray[1];
				return new Date(iosTime);
			},
			toDetailPage: function(code, nav_type, nav_hreflink) {
				this.$store.state.noRefreshOrInfinite = true; // 恢复过渡动画
				if (nav_type == 'page' || nav_type == 'webview') {
					// 打开活动页
					this.$router.push({
						name: 'detailPage',
						params: {
							code: code
						}
					});
				} else if (nav_type == 'hreflink') {
					// 跳到外部链接
					metro.goToDetail("消息详情", nav_hreflink);
				}

			},
			getData(done, page, message) {
				var that = this;
				var url = 'member/activity/list';
				var reqData = {
					page: page,
					pagesize: this.pageSize,
					user_status: this.user_status,
					activity_type_id: this.activityId,
					query_text: message
				}
				var reqParams = {
					data: JSON.stringify(reqData),
					access_token: this.$store.state.token
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
						
						// console.log("活动列表:", list);

					})
					.catch(function(error) {
						// console.log(error);
					});
			}
		},
	}
</script>
