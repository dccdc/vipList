<template>
	<v-container style="background-color: white;padding:0;height: 100%;overflow: hidden;">
		<div>

			<v-row style="padding:0 12px">
				<v-col>
					<span class="font-weight-bold">当前积分</span>
				</v-col>
				<v-spacer></v-spacer>
				<v-col class="text-right">
					<span class="text_right">积分说明</span>
				</v-col>
			</v-row>
			<v-row style="height: 55px;padding:0 12px">
				<v-col class="pt-1">
					<span class="font-weight-black display-1 " style="color: #D81E06;">{{data.points}}</span>
				</v-col>
				<v-spacer></v-spacer>
				<v-col class="pt-1">
					<v-select style="width: 80px;float:right;font-size: 12px;" loader-height="20px" :items="items" v-model="selectVal"
					 item-color="error" color="#D81E06" outlined dense></v-select>
				</v-col>
			</v-row>

		</div>
		<div style="height: 100%;position: relative;">
			<scroller ref="myscroller" noDataText="我是有底线的" :on-refresh="refresh" :on-infinite="infinite">
				<!-- content goes here -->
				<v-card flat>
					<v-card-text style="padding: 0 16px;">
						<v-list v-for="(item,index) in pointsList" :key="index" style="padding: 0;" three-line>
							<v-list-item :key="item.title" style="padding:0">
								<v-row>
									<v-col cols="8" style="padding: 0 12px;">
										<v-list-item-content>
											<v-list-item-title class="font-regular body-1 black--text">{{item.reason}}</v-list-item-title>
											<v-list-item-subtitle class="font-regular caption " style="margin-top: 10px;font-size: 10px;">{{item.mer_name}}</v-list-item-subtitle>
											<v-list-item-subtitle class="font-regular caption" style="margin-top: 10px;font-size: 10px;">{{timeFormate(item.point_date)}}</v-list-item-subtitle>
										</v-list-item-content>
									</v-col>
									<v-spacer></v-spacer>
									<v-col class="text-right" style="line-height: 112px;padding: 0 12px;">
										<span class="redText">{{formate(item.point)}}</span>
									</v-col>
								</v-row>
							</v-list-item>
							<v-divider :key="index"></v-divider>
						</v-list>
					</v-card-text>
				</v-card>
			</scroller>
		</div>


	</v-container>
</template>

<script>
	import Axios from "@/api/api.js";
	export default {
		data: () => ({
			items: ['全部', '获取', '使用'],
			selectVal: '全部',
			data: {},
			pointsList: [],
			type: 0,
			page: 1,
			pageSize: 5,
			firstLoading: true
		}),
		created() {},
		watch: {
			selectVal(newVal, oldVal) {
				switch (newVal) {
					case '获取':
						this.type = 1;
						this.page = 0;
						this.getData(null, 1);
						break;
					case '使用':
						this.type = 2;
						this.page = 0;
						this.getData(null, 1);
						break;
					default:
						this.type = 0;
						this.page = 0;
						this.getData(null, 1);
				}
			}
		},
		methods: {
			refresh(done) {
				this.$store.state.noRefreshOrInfinite = false; // 禁止过渡动画
				var page = 1;
				this.page = 1; //当数据不满一页时，刷新时会调用infinite函数，此处重置一下page
				this.getData(done, page);
			},
			infinite(done) { //若列表无数据，且不手动停止加载，则此函数会无限调用
				this.$store.state.noRefreshOrInfinite = false;
				if (this.firstLoading) { //第一次加载时，页码不加1
					this.firstLoading = false;
				} else {
					this.page++;
				}
				this.getData(done, this.page);

			},
			getData(done, page) {
				var that = this;
				var url = '/member/point/overviewPoint';
				var reqData = {
					member_id: 'dd',
					type: this.type,
					page: page,
					pagesize: this.pageSize
				}
				var reqParams = {
					data: JSON.stringify(reqData),
					access_token: this.$store.state.token
				}

				if (done == null) this.$store.state.noRefreshOrInfinite = true; // 恢复过渡动画
				Axios.post(url, reqParams)
					.then(function(response) {
						that.data = JSON.parse(response.data.data);
						var list = that.data.pointDetails; //每一次请求的积分记录数据
						if (page > 1) { //上拉加载拼接数组
							that.pointsList = that.pointsList.concat(list);
						} else { //刷新
							that.pointsList = list;
						}
						if (typeof(done) == "function") {
							done();
						} else { //切换下拉列表时，重置infinite函数
							that.$refs.myscroller.finishInfinite(false);
						}
						//每次请求都是5条数据，小于5说明没有更多数据了
						if (list.length < 5) {
							that.$refs.myscroller.finishInfinite(true);
						}

						// console.log("积分记录:",list.length,'页码',page);

					})
					.catch(function(error) {
						// console.log(error);
					});


			},
		},

	}
</script>

<style scoped>
	.text_right {
		color: rgba(164, 163, 164, 1);
		font-family: PingFangSC-bold;
	}

	.redText {
		color: #D23921;
	}
</style>
