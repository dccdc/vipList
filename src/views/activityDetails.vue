<template>
	<div>
		<Header v-if="$store.state.metro" :back="true" title="活动详情"></Header>
		<v-container v-if="activity != null" style="margin-bottom: 50px;">
			<v-row>
				<v-col cols="12">
					<v-img :src="activity.img" height=200 style="border-radius: 5px;box-shadow:rgb(189, 184, 184) 1px 8px 11px "></v-img>
				</v-col>
			</v-row>
			<v-row class="white">
				<v-col class="spacing"><span class="title font-weight-bold">{{activity.title}}</span></v-col>
			</v-row>
			<v-row class="white">
				<v-col class="overline text_one spacing">
					<span>已参与</span>
					<span class="ml-2">{{activity.attend_count}}人</span>
				</v-col>
			</v-row>
			<!-- <v-row class="white">
				<v-col class="title font-weight-bold red--text text--darken-2 spacing">
					<span>￥120</span>
				</v-col>
			</v-row> -->
			<v-row class="white">
				<v-col cols="1" class="pb-0">
					<v-icon>schedule</v-icon>
				</v-col>
				<v-col cols="11" class="pb-0">
					<span class="body-2">{{dateFormate(activity.begin_time)}} - {{dateFormate(activity.end_time)}}</span>
				</v-col>
			</v-row>
			<v-row class="white" @click="toMap">
				<v-col cols="1">
					<v-icon>room</v-icon>
					<!-- <i class="iconfont icon-location"></i> -->
				</v-col>
				<v-col cols="10">
					<span class="body-2">{{activity.address}}</span>
				</v-col>
				<v-col cols="1" class="d-flex flex-column justify-center">
					<v-icon>keyboard_arrow_right</v-icon>
					<!-- <i class="iconfont icon-arrow-right"></i> -->
				</v-col>
			</v-row>
			<v-divider style="border: 4px solid rgba(199, 195, 195, 0.12);"></v-divider>
			<v-row class="white" v-if="showTask">
				<v-col cols="12" class="subtitle-1 font-weight-bold">
					<span>完成任务后参加活动</span>
				</v-col>
			</v-row>
			<v-row v-show="showTask" class="white" v-for="(item,index) in activity.conditions" :key="index">
				<v-col cols="6" class="pt-1 pb-1 body-2 d-flex align-center"><span>{{item.title}}</span></v-col>
				<v-col cols="6" style="text-align: end;" class="pt-1 pb-1 body-2">
					<span v-if="item.status == 'MATCH'" class="text_finish">已完成</span>
					<v-btn v-else small outlined rounded color="#d63130" @click="toFinish(item.url,item.nav_type)">去完成</v-btn>
				</v-col>
			</v-row>

			<v-divider v-show="showTask" style="border: 4px solid rgba(199, 195, 195, 0.12);"></v-divider>
			<v-list>
				<p class="subtitle-1 font-weight-bold">活动发布方</p>
				<v-list-item>
					<v-list-item-avatar>
						<v-img :src="activity.mer_icon_url"></v-img>
					</v-list-item-avatar>

					<v-list-item-content>
						<v-list-item-title class="body-2">{{activity.mer_name}}</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
				<v-row>
					<v-col style="text-align: start;" class="spacing">
						<v-btn small outlined rounded color="#d63130" style="margin-left: 16px;" @click="toHomePage">主办方网页</v-btn>
					</v-col>
				</v-row>
				<v-divider style="border: 4px solid rgba(199, 195, 195, 0.12);"></v-divider>
				<v-row>
					<v-col style="padding-bottom: 48px;">
						<p class="subtitle-1 font-weight-bold">活动介绍</p>
						<span class="body-2" v-html="activity.detail"></span>
					</v-col>
				</v-row>
			</v-list>
			<v-footer fixed style="border-top: 1px solid #aba3a33d;background-color: white;">
				<v-row>
					<v-col cols="12" style="text-align: center;padding:0">
						<v-btn v-if="showBtn" :disabled="disabled" @click="attendActivity" medium rounded color="#d63130" width="60%"
						 style="color: white;">{{activity.msg}}</v-btn>
						<div v-if="showDiv" class="d-flex justify-space-around">
							<span style="line-height: 40px">
								<span class="red--text subtitle-1">您已参与本活动</span>
								<span v-if="activity.reward_url" class="red--text subtitle-1">,请领取奖励</span>
							</span>
							<v-btn v-if="activity.reward_url" @click="toCard(activity.reward_url)" medium rounded color="#d63130" width="30%"
							 class="white--text  ">领取奖励</v-btn>
						</div>

					</v-col>
				</v-row>
			</v-footer>
		</v-container>

	</div>
</template>
<script>
	import Axios from "@/api/api.js";
	export default {
		data: () => ({
			code: '',
			activity: null,
			disabled: true,
			showTask: true,
			showBtn: false,
			showDiv: false
		}),
		beforeRouteEnter(to, from, next) {
			if (from.name == "ticketDetail" || from.name == "map" ||
				from.name == "attendList" || from.name == "ticketList") {
				to.meta.isBack = true;
			}

			next(vm => {
				// access to component instance via `vm`
				// 此时还不能使用this，但vm相当于this
				vm.$bindAppBack(); // 绑定app的返回
				metro.setAppTitle('活动详情');
			});
		},
		activated() {
			if (!this.$route.meta.isBack && !this.$route.meta.firstEnter) {
				// 前进但非第一次进入时

				this.code = this.$route.params.code;
				this.getData();


			}
			this.$route.meta.isBack = false;
			this.$route.meta.firstEnter = false;
		},
		created() {
			// 开启app分享功能
			// if(metro){
			// 	metro.shareHtml();
			// }

			// 第一次进入时
			this.code = this.$route.params.code;
			this.getData();


		},
		updated() {

		},
		methods: {
			toHomePage: function() {
				metro.goToDetail('', this.activity.homepage);
			},
			toFinish(url, type) {
				metro.goToDetail('', url);
				// if (type == 'native') {
				// 	metro.goToDetail('', url);
				// } else if (type == 'webview') {
				// 	metro.goToDetail('', url);
				// } else if (type == 'app') {
				// 	metro.goToDetail('', url);
				// }
			},
			attendActivity() {
				var that = this;
				var url = 'member/activity/attend';
				var reqData = {
					mer_id: this.activity.mer_id,
					member_id: null,
					code: this.code,
					attend_time: null,
					extend_data: null
				}
				var reqParams = {
					data: JSON.stringify(reqData),
					access_token: this.$store.state.token
				}
				// this.$store.state.noRefreshOrInfinite = false;// 禁止过渡动画
				Axios.post(url, reqParams)
					.then(function(response) {
						// 激活提示工具
						that.$store.state.showTooltips = true;
						if (response.data.code == 'OK') {
							that.showBtn = false;
							that.showDiv = true;
							that.$store.state.tipsText = '报名成功';
							//如果没有奖励，则跳到已参加的活动页面
							if (!that.activity.reward_url) {
								that.$router.push({
									name: 'attendList',
									params: {

									}
								})
							}

						} else {
							that.$store.state.tipsText = response.data.msg;
						}
						setTimeout(() => {
							that.$store.state.showTooltips = false;
						}, 1000)
					})
					.catch(function(error) {
						// console.log(error);
					});
			},
			toMap() {
				var location = this.activity.address_pos;
				var address = this.activity.address;
				this.$router.push({
					name: 'map',
					params: {
						location: location,
						address: address
					}
				})
			},
			getUrlValue(url, kValue) {
				var reg = /([^?&=]+)=([^?&=]+)/g,
					obj = {},
					str = url;
				url.replace(reg, function() {
					obj[arguments[1]] = arguments[2];
				})
				for (var keyName in obj) {
					if (keyName == kValue) {
						return obj[keyName];
						// break;
					}
				}
			},
			toCard(reward_url) {
				var app_card_code = this.getUrlValue(reward_url, 'app_card_code');
				var that = this;
				var url = 'member/card/mer/detail';
				var reqData = {
					app_card_code: app_card_code,
					code: this.code,
					mer_id: this.activity.mer_id,
					page: 1,
					pagesize: 5
				}
				var reqParams = {
					data: JSON.stringify(reqData),
					access_token: this.$store.state.token
				}

				Axios.post(url, reqParams)
					.then(function(response) {
						if (response.data.code == 'OK') {
							var list = JSON.parse(response.data.data);
							// console.log('卡券使用情况',list);
							if (list.totalcount > 1) { //多张卡券跳列表
								that.$router.push({
									name: 'ticketList',
									params: {}
								});
							} else if (list.totalcount <= 1) { //1张卡券或未领用卡券跳详情
								var item;
								var length = list.items.length;
								if (length == 1) {
									item = list.items[0];
								}
								that.$router.push({
									name: 'ticketDetail',
									params: {
										code: app_card_code,
										user_card_sn: length == 1 ? item.user_card_sn : null
									}
								});
							}
						}

					})
					.catch(function(error) {
						// console.log(error);
					});

			},
			getData() {
				var that = this;
				var url = 'member/activity/get';
				var reqData = {
					// member_id: null,
					code: this.code
				}
				var reqParams = {
					data: JSON.stringify(reqData),
					access_token: this.$store.state.token
				}

				Axios.post(url, reqParams)
					.then(function(response) {
						var list = JSON.parse(response.data.data);
						that.activity = list;
						// 判断活动是否关闭
						if (that.activity.status == 'ENABLED') {
							// 判断参与活动的资格,满足条件则启动参与按钮,隐藏任务
							if (that.activity.conditions.length == 0 ||
								that.activity.conditions.status == 'MATCH') {
								that.disabled = false;
								that.showTask = false;
							} else {
								that.disabled = true;
								that.showTask = true;
							}
						} else {
							that.disabled = true;
							that.showTask = false;
						}
						// 判断按钮
						if (that.activity.user_status == 'UNATTEND') {
							that.showBtn = true;
							that.showDiv = false;
						} else {
							that.showDiv = true;
							that.showBtn = false;
						}


						// console.log("活动详情", that.showBtn,that.showDiv);

					})
					.catch(function(error) {
						// console.log(error);
					});
			},
		}
	}
</script>

<style scoped>
	.spacing {
		padding: 6px 12px;
	}


	.text_one {
		color: rgba(135, 127, 127, 1);
	}

	.text_two {
		color: rgba(214, 49, 48, 1);
		font-size: 20px;
		font-family: PingFangSC-bold;
	}

	.text_time {
		color: rgba(135, 127, 127, 1);
		font-size: 12px;
		font-family: PingFangSC-bold;
	}

	.text_three {
		color: rgba(16, 16, 16, 1);
		font-size: 20px;
		font-family: PingFangSC-bold;
	}

	.text_finish {
		color: rgba(214, 49, 48, 1);
		font-size: 12px;
		font-family: PingFangSC-bold;
		margin-right: 14px;
	}

	.text_p {
		color: rgba(16, 16, 16, 1);
		font-size: 20px;
		font-family: PingFangSC-bold;
	}

	.text_card {
		color: rgba(16, 16, 16, 1);
		font-size: 14px;
		font-family: PingFangSC-bold;
	}
</style>
