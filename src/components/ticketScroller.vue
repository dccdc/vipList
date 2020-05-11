<template>
	<div style="height: 100vh;">
		<scroller  ref="myscroller" noDataText="没有更多数据了" :on-refresh="refresh" :on-infinite="infinite">
			<!-- content goes here -->
			<v-list v-for="(item, index) in content" :key="index" three-line style="border-radius:0;padding:0" :disabled="disabled">

				<hr :key="index" style="border: 4px solid rgba(199, 195, 195, 0.12);" />
				<v-list-item :key="item.title" @click="toDetailPage(item.app_card_code,item.bg_color, item.nav_type, item.nav_hreflink, item.user_card_sn)">
					<v-list-item-avatar tile style="width:40%;height:6rem;margin:8px 8px 8px 0;">
						<v-img  data-sub="最新" :src="item.list_img" style="border-radius: 0 5px 5px 5px;"></v-img>
					</v-list-item-avatar>

					<v-list-item-content class="pt-1 pb-1">
						<v-list-item-subtitle  class="font-regular body-1 black--text" v-html="item.name"></v-list-item-subtitle>
						<v-list-item-subtitle  class="font-regular body-1 black--text" style="visibility: hidden;">为了满足list的3行</v-list-item-subtitle>
						<v-list-item-subtitle >
							<span class="font-regular caption ">有效期至 {{timeFormatePlus(item.end_time)}}</span>
							<span v-if="order == 1" class="font-regular caption singleText " >使用时间 {{timeFormatePlus(item.use_time)}}</span>
							<span v-if="order == 2" class="font-regular caption singleText " >失效时间 {{timeFormatePlus(item.end_time)}}</span>
						</v-list-item-subtitle>

					</v-list-item-content>
				</v-list-item>
				<v-divider :key="index+'hr'"></v-divider>
				<!-- 已失效 -->
				<v-row v-if="order == 2" :key="index+'bar'" style="padding: 0 16px">
					<v-col cols="12" class="d-flex align-center">
						<span class="hideText  caption">{{item.mer_name}}</span>
					</v-col>
				</v-row>
				<!-- 其他情况 -->
				<v-row v-else :key="index+'bar'" style="padding: 0 16px">
					<v-col cols="8" class="d-flex align-center">
						<span class="hideText  caption">{{item.mer_name}}</span>
					</v-col>
					<v-col cols="4" class="d-flex align-center justify-end">
						<v-btn @click="toDetailPage(item.app_card_code,item.bg_color, item.nav_type, item.nav_hreflink,item.user_card_sn)" small color="#D63130" outlined rounded>{{btnVal}}</v-btn>
					</v-col>
				</v-row>
				

			</v-list>
		</scroller>
	</div>

</template>

<script>
	import Axios from "@/api/api.js";
	export default {
		props: ['order'],
		data() {
			return {
				content: null,
				btnVal:null,
				page: 1,
				pageSize: 5,
				firstLoading: true,
				disabled: false
			}
		},
		created() {
			// 渲染不同状态的按钮
			if(this.order == 0){
				this.btnVal = '立即使用';
			}else if(this.order == 1){
				this.btnVal = '查看详情';
			}else if(this.order == 2){
				// 禁用已失效卡券
				this.disabled = true;
			}
			
		},
		updated() {
			
		},
		methods: {
			refresh(done) {
				
				this.$store.state.noRefreshOrInfinite = false; // 禁止过渡动画
				var page = 1;
				this.page = 1; //当数据不满一页时，刷新时会调用infinite函数，此处重置一下page
				// 渲染不同状态的卡券
				if(this.order == 0){
					this.getData(done, page,'GET');
				}else if(this.order == 1){
					this.getData(done, page,'USED');
				}else if(this.order == 2){
					this.getData(done, page,'CANCELLED');
				}
			},
			infinite(done) {
				
				this.$store.state.noRefreshOrInfinite = false;
				if (this.firstLoading) { //第一次加载时，页码不加1
					this.firstLoading = false;
				} else {
					this.page++;
				}
				// 渲染不同状态的卡券
				if(this.order == 0){
					this.getData(done, this.page,'GET');
				}else if(this.order == 1){
					this.getData(done, this.page,'USED');
				}else if(this.order == 2){
					this.getData(done, this.page,'CANCELLED');
				}
			},
			toDetailPage: function(app_card_code, bg_color, nav_type, nav_hreflink,user_card_sn) {
				this.$store.state.noRefreshOrInfinite = true; // 恢复过渡动画
		
				if (nav_type == 'page' || nav_type == 'webview') {
					// 打开卡券页
					this.$router.push({
						name: 'ticketDetail',
						params: {
							bg_color: bg_color,
							code: app_card_code,
							user_card_sn: user_card_sn
						}
					});
				} else if (nav_type == 'hreflink') {
					// 跳到外部链接
					metro.goToDetail("消息详情", nav_hreflink);
				}
				
			},
			getData(done, page,cardStatus){
				var that = this;
				var url = 'member/card/list';
				var reqData = {
					page: page,
					pagesize: this.pageSize,
					userstatus: cardStatus
				}
				var reqParams = {
					data: JSON.stringify(reqData),
					access_token: this.$store.state.token
				}
				Axios.post(url, reqParams)
					.then(function(response) {
						//每一次请求的卡券列表数据
						var list = JSON.parse(response.data.data).cards;
						if (page > 1) { //上拉加载拼接数组
							that.content = that.content.concat(list);
						} else { //下拉刷新
							that.content = list;
						}
						if (typeof(done) == "function") {
							done();
						}
						//每次请求都是5条数据，小于5说明没有更多数据了
						if (list.length < 5) {
							that.$refs.myscroller.finishInfinite(true);
						}
						
						// console.log("卡券列表:", list);
					})
					.catch(function(error) {
						// console.log(error);
					});
			}
				
		},
	}
</script>
<style scoped>
	.hideText {
		font-size: 13px;
		display: -webkit-box;/*将对象作为弹性伸缩盒子模型显示 */
		-webkit-box-orient: vertical;/*设置或检索伸缩盒对象的子元素的排列方式*/
		-webkit-line-clamp: 2; /* 用来限制在一个块元素显示的文本的行数, 为了实现该效果，它需要组合其他的WebKit属性*/
		overflow: hidden;
		text-overflow: ellipsis;/* 溢出隐藏文本 */
	}
	.singleText{
		display: -webkit-box;/*将对象作为弹性伸缩盒子模型显示 */
		-webkit-box-orient: vertical;/*设置或检索伸缩盒对象的子元素的排列方式*/
		-webkit-line-clamp: 1; /* 用来限制在一个块元素显示的文本的行数, 为了实现该效果，它需要组合其他的WebKit属性*/
		overflow: hidden;
		text-overflow: ellipsis;/* 溢出隐藏文本 */
	}
</style>
