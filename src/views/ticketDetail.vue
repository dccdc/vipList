<template>
	<v-container v-if="cardDetail != null" id="bgColorController" style="padding: 0;border: 12px solid;">
		<Header v-if="$store.state.metro" :back="true" title="卡券详情"></Header>
		<div style="border: 1px solid rgba(0, 0, 0, 0.12);padding: 12px;">
			<v-row>
				<v-col cols="2">
					<v-img :src="cardDetail.img"></v-img>
				</v-col>
				<v-col cols="10" class="d-flex align-center">
					<span>{{cardDetail.mer_name}}</span>
				</v-col>
			</v-row>
			<hr style="border: 1px dashed rgba(0, 0, 0, 0.12);">
			<v-row>
				<v-col cols="12" class="d-flex justify-center">
					<span class="font-weight-bold">{{cardDetail.name}}</span>
				</v-col>
				<v-col cols="12" class="d-flex justify-center">
					<span>{{cardDetail.detail}}</span>
				</v-col>
				<v-col cols="12" class="d-flex justify-center">
					<span>有效期：{{cardDetail.usetime}}</span>
				</v-col>
				<!-- 未使用 -->
				<v-col v-if="cardDetail.userstatus == 'NONE' || cardDetail.userstatus == 'GET'" cols="12" class="d-flex justify-center">
					<v-btn id="Btn" large block style="color: white;" @click="clickBtn">{{btnVal}}</v-btn>
				</v-col>
				<v-col v-if="showBtn" cols="12" class="d-flex justify-center">
					<v-icon large @click="toCode()">view_column</v-icon>
					<v-btn text @click="toCode()">点击出现核销码</v-btn>
				</v-col>
				<!-- 已使用和已过期 -->
				<v-col v-if="cardDetail.userstatus == 'USED'" cols="12" class="d-flex justify-center">
					<span class="headline red--text text--darken-3">您已使用该优惠券</span>
				</v-col>
				<v-col v-if="cardDetail.userstatus == 'USED'" cols="12" class="d-flex justify-center">
					<span class="title red--text text--darken-3">核销编码：{{cardDetail.sn}}</span>
				</v-col>

				<v-col cols="12" class="d-flex justify-center">
					<span v-if="cardDetail.get_time" style="color: #877F7F;" class="font-weight-bold">领用时间：{{cardDetail.get_time}}</span>
				</v-col>
				<v-col v-if="cardDetail.userstatus == 'USED'" cols="12" class="d-flex justify-center">
					<span style="color: #877F7F;" class="font-weight-bold">使用时间：{cardDetail.useDate}}</span>
				</v-col>
			</v-row>
			<hr style="border: 1px dashed rgba(0, 0, 0, 0.12);">
			<v-row>
				<v-col cols="12">
					<span class="font-weight-bold">使用须知</span>
				</v-col>
			</v-row>
			<v-row>
				<v-col cols="4" class="pr-0">
					使用时间：
				</v-col>
				<v-col cols="8" class="pl-0">
					<span>{{cardDetail.begin_time}} 至 {{cardDetail.end_time}}</span>
				</v-col>
			</v-row>
			<v-row>
				<v-col cols="4" class="pr-0">
					使用地点：
				</v-col>
				<v-col cols="8" class="pl-0">
					<span>{{cardDetail.address}}</span>
				</v-col>
			</v-row>
			<v-row>
				<v-col cols="4" class="pr-0">
					优惠说明：
				</v-col>
				<v-col cols="8" class="pl-0">
					<span>{{cardDetail.detail}}</span>
				</v-col>
			</v-row>
			<v-row>
				<v-col cols="4" class="pr-0">
					使用说明：
				</v-col>
				<v-col cols="8" class="pl-0">
					<span>{{cardDetail.card_use_info}}</span>
				</v-col>
			</v-row>
		</div>
	</v-container>
</template>

<script>
	import Axios from "@/api/api.js";
	export default {
		data() {
			return {
				code: null,
				user_card_sn: null,
				cardDetail: null,
				qrCodeData: null,
				btnVal: '',
				showBtn: false
			}
		},
		beforeRouteEnter(to, from, next) {
			if (from.name == "writeOffCode") {
				to.meta.isBack = true;
			}
			// 切换路由时绑定app的返回
			next(vm => {
				// access to component instance via `vm`
				// 此时还不能使用this，但vm相当于this
				vm.$bindAppBack(); // 绑定app的返回
				metro.setAppTitle('卡券详情');
				// 销毁定时器
				var timer = vm.$store.state.timer;
				if (timer) {
					clearInterval(timer);
				}
			});

		},
		activated() {
			if (!this.$route.meta.isBack && !this.$route.meta.firstEnter) {
				// 前进但非第一次进入时
				this.code = this.$route.params.code;
				this.user_card_sn = this.$route.params.user_card_sn;
				this.getData();
				if (this.user_card_sn) {
					this.getCodeData(); //获取卡券码
				}
			}

			this.$route.meta.isBack = false;
			this.$route.meta.firstEnter = false;
		},
		created() {
			// 第一次进入时
			this.code = this.$route.params.code;
			this.user_card_sn = this.$route.params.user_card_sn;
			this.getData();
			if (this.user_card_sn) { //已领券，获取卡券码
				this.getCodeData();
			}
		},
		mounted() {

		},
		updated() {
			var bg_color = this.$route.params.bg_color;
			if (!bg_color) bg_color = this.cardDetail.bg_color;
			var contrainer = document.getElementById("bgColorController");
			var Btn = document.getElementById("Btn");
			contrainer.style.cssText += "border-color: " + bg_color;
			Btn.style.cssText += "background-color: " + bg_color;

		},
		computed: {
			// getTime: function() {
			// 	//领用券后
			// 	if (this.cardDetail.get_time) {
			// 		return this.cardDetail.get_time;
			// 	} else {
			// 		return this.getTimeNow();
			// 	}
			// }
			
		},
		methods: {
			getData: function() {
				var that = this;
				var url = 'member/card/info';
				var reqData = {
					// member_id: null,
					app_card_code: this.code,
					user_card_sn: this.user_card_sn //用户领券后的编码
				}
				var reqParams = {
					data: JSON.stringify(reqData),
					access_token: this.$store.state.token
				}

				Axios.post(url, reqParams)
					.then(function(response) {
						var list = JSON.parse(response.data.data);
						that.cardDetail = list;
						if (that.cardDetail.userstatus == 'NONE') {
							that.btnVal = '立即领用'
							that.showBtn = false
						} else if (that.cardDetail.userstatus == 'GET') {
							that.btnVal = '立即使用'
							that.showBtn = true
						}
						// console.log("卡券详情", list);
						return response;
					}).then(function(callback) {
						// console.log('hello promise',JSON.parse(callback.data.data));
					})
					.catch(function(error) {
						// console.log(error);
					});
			},
			getTimeNow() {
				var myDate = new Date();
				var year = myDate.getFullYear();
				var month = myDate.getMonth() + 1;
				var day = myDate.getDate();
				var hour = myDate.getHours();
				var minute = myDate.getMinutes();
				var second = myDate.getSeconds();
				var time = year + '-' + (month < 10 ? '0' + month : month) +
					'-' + (day < 10 ? '0' + day : day) + ' ' +
					(hour < 10 ? '0' + hour : hour) + ":" + 
					(minute < 10 ? '0' + minute : minute) + ":" + 
					(second < 10 ? '0' + second : second);
					return time;
			},
			getCodeData() { //二维码初始时，需要等待接口返回数据，此时会报错，所以进入二维码页面前就请求数据
				var that = this;
				var url = 'member/card/showqrcode';
				var reqData = {
					// member_id: null,
					user_card_sn: this.user_card_sn
				}
				var reqParams = {
					data: JSON.stringify(reqData),
					access_token: this.$store.state.token
				}

				Axios.post(url, reqParams)
					.then(function(response) {
						var list = JSON.parse(response.data.data);
						that.qrCodeData = list;

						// console.log("核销码", list);

					})
					.catch(function(error) {
						// console.log(error);
					});
			},
			toCode() {
				this.$router.push({
					name: 'writeOffCode',
					params: {
						qrCodeData: this.qrCodeData,
						code: this.code,
						img: this.cardDetail.img
					}
				})
			},
			clickBtn() {
				if (this.btnVal == '立即领用') {
					this.getCard()
				} else {
					this.toCode();
				}

			},
			getCard() {
				var that = this;
				var url = 'member/card/get';
				var reqData = {
					// member_id: null,
					app_card_code: this.code
				}
				var reqParams = {
					data: JSON.stringify(reqData),
					access_token: this.$store.state.token
				}

				Axios.post(url, reqParams)
					.then(function(response) {
						that.$store.state.showTooltips = true;
						if (response.data.code == 'OK') {
							that.$store.state.tipsText = '领券成功';
							// 操作按钮显示
							that.btnVal = '立即使用';
							that.showBtn = true;

						} else {
							that.$store.state.tipsText = response.data.msg;
						}
						setTimeout(() => {
							that.$store.state.showTooltips = false;
						}, 1000)
						return JSON.parse(response.data.data).user_card_sn;
					})
					.then(user_card_sn => {
						that.user_card_sn = user_card_sn;
						that.getCodeData(); //领券后，获取卡券码
					})
					.catch(function(error) {

					});
			}
		}
	}
</script>
