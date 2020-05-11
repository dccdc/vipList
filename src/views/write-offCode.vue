<template>
	<v-container  :style="styleObject">
		<Header v-if="$store.state.metro" :back="true" title="核销码"></Header>
		<div style="padding: 12px;">
			<v-row class="d-flex justify-center">
				<v-col cols="4">
					<v-img :src="img"></v-img>
				</v-col>
				<v-col cols="12" class="d-flex justify-center">
					<span>{{data.mer_name}}</span>
				</v-col>
				<v-col cols="12" class="d-flex justify-center">
					<span>{{data.name}}</span>
				</v-col>
			</v-row>
			<hr style="border: 1px dashed rgba(0, 0, 0, 0.12);">
			<v-row class="d-flex justify-center">
				<v-col cols="12" class="d-flex justify-center">
					<span class="green--text headline">{{data.sn}}</span>
				</v-col>
				<v-col v-if="data.code_type == 'CODE_TYPE_BARCODE'" cols="10" style="padding:0">
					<svg id="barcode" style="width: 100%;"></svg>
				</v-col>
				<v-col v-if="data.code_type == 'CODE_TYPE_QRCODE'" cols="10" style="padding:0">
					<canvas id="canvas" class="qrcode"></canvas>
				</v-col>
				<v-col cols="12" class="d-flex justify-center">
					<span class="body-2">请向收银员出示该核销码</span>
				</v-col>
			</v-row>
		</div>
	</v-container>
</template>

<script>
	import QRCode from 'qrcode/build/qrcode.min.js'
	import Axios from "@/api/api.js";
	export default {
		data() {
			return {
				data: null,
				codeStatus: null,
				app_card_code: null,
				img: null
			}
		},
		beforeRouteEnter(to, from, next) {
			// // 后退开启缓存功能
			if (from.name == "usedTicket") {
				to.meta.keepAlive = true;
				to.meta.isBack = true;
			}
			// 前进关闭缓存功能
			if(from.name == "ticketDetail"){
				to.meta.keepAlive = false;
			}
			// 返回至该页面时，因为使用keep-alive缓存，后退钩子函数都不执行，
			// 只能再切换路由时绑定app的返回
			// 其实后退会执行activated，忘了自己写了if判断，进不去if里面，导致无法调用
			next(vm => {
				// access to component instance via `vm`
				// 此时还不能使用this，但vm相当于this
				vm.$bindAppBack();// 绑定app的返回
				metro.setAppTitle('核销码');
			});
			next();
		},
		// activated() {
		// 	if (!this.$route.meta.isBack && !this.$route.meta.firstEnter) {
		// 		// 前进但非第一次进入时
				
		// 		this.data = this.$route.params.qrCodeData;
		// 		this.app_card_code = this.$route.params.code;
		// 		this.showCode();
				
				
		// 	}
		// 	this.$route.meta.isBack = false;
		// 	this.$route.meta.firstEnter = false;
		// },
		created() {
			// 第一次进入时
			this.data = this.$route.params.qrCodeData;
			this.app_card_code = this.$route.params.code;
			this.img = this.$route.params.img;
			// console.log(1,this.data,this.app_card_code);
		},
		mounted() {
			this.showCode();
		},
		computed: {//使用计算属性修改样式
		  styleObject: function () {
		    return {
		      padding: 0,
		      border: '12px solid',
		      'border-color': this.data.bg_color,
			  height: '100vh'
		    }
		  }
		},
		methods: {
			showCode:function(){
				this.$store.state.noRefreshOrInfinite = false; // 禁止过渡动画
				this.$store.state.timer = setInterval(this.onCodeStatus, 1000);
					
				if (this.data.code_type == 'CODE_TYPE_BARCODE') {
					JsBarcode("#barcode", this.data.sn, {
						displayValue: false
					});
				} else if (this.data.code_type == 'CODE_TYPE_QRCODE') {
					var opts = {
						errorCorrectionLevel: 'H',
						type: 'image/jpeg',
						quality: 0.3,
						margin: 1,
					}
					QRCode.toCanvas(document.getElementById('canvas'), this.data.sn, opts, function(error) {
						// if (error) console.error(error)
						// console.log('success!');
					})
				}
				
			},
			onCodeStatus: function() {
				var that = this;
				var url = 'member/card/info';
				var reqData = {
					// member_id: null,
					app_card_code: this.app_card_code
				}
				var reqParams = {
					data: JSON.stringify(reqData),
					access_token: this.$store.state.token
				}

				Axios.post(url, reqParams)
					.then(function(response) {
						var list = JSON.parse(response.data.data);
						that.codeStatus = list.userstatus;
						if (that.codeStatus == 'USED' || that.codeStatus == 'CANCELLED') {
							var useDate = that.timeFormate();
							that.$router.push({
								name: 'usedTicket',
								params: {
									infoDetail: list,
									useDate: useDate
								}
							})
						}
						// console.log("监听卡券详情", list);

					})
					.catch(function(error) {
						// console.log(error);
					});
			},
		}
	}
</script>

<style scoped>
	.qrcode {
		width: 100% !important;
		height: 16rem !important;
	}
</style>
