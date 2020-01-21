<template>
	<!-- padding: 0;
	    border: 12px solid;
	    border-color: green; -->
	<v-container>
		<div style="border: 1px solid rgba(0, 0, 0, 0.12);padding: 12px;"> 
			<v-row>
				<v-col cols="2">
					<v-img  src="https://cdn.vuetifyjs.com/images/lists/5.jpg"></v-img>
				</v-col>
				<v-col cols="10">
					<span>券提供方</span>
				</v-col>
			</v-row>
			<hr style="border: 1px dashed rgba(0, 0, 0, 0.12);">
			<v-row>
				<v-col cols="12" class="d-flex justify-center">
					<span class="font-weight-bold">优惠标题</span>
				</v-col>
				<v-col cols="12" class="d-flex justify-center">
					<span>优惠说明，全场商品可用，满XX元，9折</span>
				</v-col>
				<v-col cols="12" class="d-flex justify-center">
					<span>有效期：12/10-12/23</span>
				</v-col>
				<v-col cols="12" class="d-flex justify-center">
					<v-btn large color="#D63130" block style="color: white;" @click="toCode">立即使用</v-btn>
				</v-col>
				<v-col cols="12" class="d-flex justify-center">
					 <v-icon large >view_column</v-icon>
					 <v-btn text >点击出现核销码</v-btn>
				</v-col>
				<v-col cols="12" class="d-flex justify-center">
					<span style="color: #877F7F;" class="font-weight-bold">领用时间：2019/12/12 19:00</span>
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
					<span>2019-12-19 00:00:00 至 2019-12-20 23:59:59</span>
				</v-col>
			</v-row>
			<v-row>
				<v-col cols="4" class="pr-0">
					使用地点：
				</v-col>
				<v-col cols="8" class="pl-0">
					<span>广东省广州市任意XX店铺可使用</span>
				</v-col>
			</v-row>
			<v-row>
				<v-col cols="4" class="pr-0">
					优惠说明：
				</v-col>
				<v-col cols="8" class="pl-0">
					<span>全场商品可用，满XX元，9折</span>
				</v-col>
			</v-row>
			<v-row>
				<v-col cols="4" class="pr-0">
					使用说明：
				</v-col>
				<v-col cols="8" class="pl-0">
					<span>立减券 使用时间: 领券当日起一天内可用</span>
				</v-col>
			</v-row>
		</div>
	</v-container>
</template>

<script>
	export default{
		data(){
			return{
				
			}
		},
		methods:{
			toCode(){
				this.$router.push({
					name: 'writeOffCode',
					params: {}
				})
			}
		}
	}
</script>

