<template>
	<v-container v-if="activity != null">
		<v-row>
			<v-col cols="12" class="spacing backgroundDiv">

			</v-col>
		</v-row>
		<v-row>
			<v-col cols="12" class="floatImg">
				<v-img :src="activity.img" height=200 style="border-radius: 5px;box-shadow:rgb(189, 184, 184) 1px 8px 11px "></v-img>
			</v-col>
		</v-row>
		<v-row style="margin-top: 70px;" class="white">
			<v-col class="spacing"><span class="title font-weight-bold">{{activity.title}}</span></v-col>
		</v-row>
		<v-row class="white">
			<v-col class="overline text_one spacing">
				<span>浏览</span>
				<span class="ml-2">300次</span>
			</v-col>
		</v-row>
		<v-row class="white">
			<v-col class="title font-weight-bold red--text text--darken-2 spacing">
				<span>￥120</span>
			</v-col>
		</v-row>
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
		<v-row class="white">
			<v-col cols="12" class="subtitle-1 font-weight-bold">
				<span>完成任务后参加活动</span>
			</v-col>
			<v-col cols="6" class="pb-0 body-2"><span>完成开通乘车码</span></v-col>
			<v-col cols="6" style="text-align: end;" class="pb-0 body-2">
				<span v-if="activity.conditions == null || activity.conditions.status == 'MATCH'" class="text_finish">已完成</span>
				<v-btn v-else small outlined rounded color="#d63130">去完成</v-btn>
			</v-col>
		</v-row>
		<!-- <v-divider></v-divider> -->
		<v-row class="white">
			<v-col cols="9" class="spacing body-2"><span>完成调研问卷的填报</span></v-col>
			<v-col cols="3" style="text-align: end;" class="spacing body-2"><span class="text_finish">已完成</span></v-col>
		</v-row>
		<v-divider style="border: 4px solid rgba(199, 195, 195, 0.12);"></v-divider>
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
					<v-btn small outlined rounded color="#d63130" style="margin-left: 16px;">主办方网页</v-btn>
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
				<v-col cols="12" style="text-align: center;" class="spacing">
					<v-btn id='unAttend' :disabled="disabled" v-show="activity.user_status == 'UNATTEND'" @click="attendActivity"
					 medium rounded color="#d63130" width="60%" style="color: white;">立即参与</v-btn>
					<div id='attend' v-show="activity.user_status == 'ATTEND'">
						<span class="red--text subtitle-1">您已参与本活动</span>
						<span v-if="activity.rewardUrl" class="red--text subtitle-1">,请领取您的奖励</span>
						<v-btn v-if="activity.rewardUrl" medium rounded color="#d63130" width="30%" class="white--text ml-2">领取奖励</v-btn>
					</div>

				</v-col>
			</v-row>
		</v-footer>

	</v-container>
</template>
<script>
	import Axios from "@/api/api.js";
	export default {
		data: () => ({
			code: '',
			activity: null,
			disabled: true
		}),
		created() {
			// 开启app分享功能
			// if(metro){
			// 	metro.shareHtml();
			// }



			this.code = this.$route.params.code;
			// console.log('活动业务编码', this.code);
			this.getData();

		},
		updated() {
			// 判断参与活动的资格,条件为空则启动参与按钮
			if (this.activity.conditions == null || this.activity.conditions.length == 0 || this.activity.conditions.status ==
				'MATCH') {
				this.disabled = false;
			} else {
				this.disabled = true;
			}

		},
		methods: {
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
					access_token: this.token
				}
				// this.$store.state.noRefreshOrInfinite = false;// 禁止过渡动画
				Axios.post(url, reqParams)
					.then(function(response) {
						var button = document.getElementById('unAttend');
						var span = document.getElementById('attend');
						button.style.display = 'none';
						span.style.display = 'block';
						// 激活提示工具
						that.$store.state.showTooltips = true;
						//跳到已参加的活动页面
						that.$router.push({
							name: 'attendList',
							params: {}
						})
					})
					.catch(function(error) {
						// console.log(error);
					});
			},
			toMap() {
				this.$router.push({
					name: 'map',
					params: {}
				}, )
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
					access_token: this.token
				}

				Axios.post(url, reqParams)
					.then(function(response) {
						var list = JSON.parse(response.data.data);
						that.activity = list;


						console.log("活动详情", list);

					})
					.catch(function(error) {
						// console.log(error);
					});
			},
		}
	}
</script>

<style scoped>
	.floatImg {
		position: absolute;
		top: 0;
	}

	.backgroundDiv {
		height: 130px;
		background-color: #eeeeee;
	}

	.spacing {
		padding: 6px 12px;
	}

	/* .title {
		font-family: PingFangSC-regular;
		font-size: 26px;
	} */

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
