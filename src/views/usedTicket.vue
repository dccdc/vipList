<template>
	<v-container id="bgColorController" style="padding: 0;border: 12px solid;">
		<Header v-if="$store.state.metro" :back="true" title="卡券详情"></Header>
		<div style="border: 1px solid rgba(0, 0, 0, 0.12);padding: 12px;"> 
			<v-row>
				<v-col cols="2">
					<v-img  :src="infoDetail.img"></v-img>
				</v-col>
				<v-col cols="10"  class="d-flex align-center">
					<span>{{infoDetail.mer_name}}</span>
				</v-col>
			</v-row>
			<hr style="border: 1px dashed rgba(0, 0, 0, 0.12);">
			<v-row>
				<v-col cols="12" class="d-flex justify-center">
					<span class="font-weight-bold">{{infoDetail.name}}</span>
				</v-col>
				<v-col cols="12" class="d-flex justify-center">
					<span>{{infoDetail.detail}}</span>
				</v-col>
				<v-col cols="12" class="d-flex justify-center">
					<span>有效期：{{infoDetail.usetime}}</span>
				</v-col>
				<v-col cols="12" class="d-flex justify-center">
					<span class="headline red--text text--darken-3">您已使用该优惠券</span>
				</v-col>
				<v-col cols="12" class="d-flex justify-center">
					<span class="title red--text text--darken-3">核销编码：{{infoDetail.sn}}</span>
				</v-col>
				<v-col cols="12" class="d-flex justify-center">
					<span style="color: #877F7F;" class="font-weight-bold">领用时间：{{infoDetail.get_time}}</span>
				</v-col>
				<v-col cols="12" class="d-flex justify-center">
					<span style="color: #877F7F;" class="font-weight-bold">使用时间：{{useDate}}</span>
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
					<span>{{infoDetail.begin_time}} 至 {{infoDetail.end_time}}</span>
				</v-col>
			</v-row>
			<v-row>
				<v-col cols="4" class="pr-0">
					使用地点：
				</v-col>
				<v-col cols="8" class="pl-0">
					<span>{{infoDetail.address}}</span>
				</v-col>
			</v-row>
			<v-row>
				<v-col cols="4" class="pr-0">
					优惠说明：
				</v-col>
				<v-col cols="8" class="pl-0">
					<span>{{infoDetail.detail}}</span>
				</v-col>
			</v-row>
			<v-row>
				<v-col cols="4" class="pr-0">
					使用说明：
				</v-col>
				<v-col cols="8" class="pl-0">
					<span>{{infoDetail.card_use_info}}</span>
				</v-col>
			</v-row>
		</div>
	</v-container>
</template>

<script>
	export default{
		data(){
			return{
				infoDetail: null,
				useDate: null
			}
		},
		created() {
			this.$bindAppBack();
			metro.setAppTitle('卡券详情');
			var timer = this.$store.state.timer;
			clearInterval(timer);
			this.infoDetail = this.$route.params.infoDetail;
			this.useDate = this.$route.params.useDate;
			// console.log('核销成功',this.infoDetail,this.useDate);
		},
		mounted() {
			var bg_color = this.infoDetail.bg_color;
			var contrainer = document.getElementById("bgColorController");
			contrainer.style.cssText += "border-color: " + bg_color;
		},
		updated() {
			
		},
		methods:{
			
		}
	}
</script>

