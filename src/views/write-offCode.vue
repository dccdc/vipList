<template>
	<v-container>
		<div style="border: 1px solid rgba(0, 0, 0, 0.12);padding: 12px;"> 
			<v-row class="d-flex justify-center">
				<v-col cols="4" >
					<v-img src="https://cdn.vuetifyjs.com/images/lists/5.jpg"></v-img>
				</v-col>
				<v-col cols="12" class="d-flex justify-center">
					<span>券提供方</span>
				</v-col>
				<v-col cols="12" class="d-flex justify-center">
					<span>优惠说明，全场商品可用，满XX元，9折</span>
				</v-col>
			</v-row>
			<hr style="border: 1px dashed rgba(0, 0, 0, 0.12);">
			<v-row class="d-flex justify-center">
				<v-col cols="10" style="padding:0">
					<!-- <v-img src="../assets/lineCode.jpg"></v-img> -->
					<svg id="barcode" style="width: 100%;"></svg>
				</v-col>
				<v-col cols="12" class="d-flex justify-center">
					<span class="green--text headline">1234 5678 9012</span>
				</v-col>
				<v-col cols="10" style="padding:0">
					<!-- <v-img src="../assets/code.jpg"></v-img> -->
					
						<canvas id="canvas" class="qrcode"></canvas>
					
				</v-col>
				
			</v-row>
		</div>
	</v-container>
</template>

<script>
	import QRCode from 'qrcode/build/qrcode.min.js'
	export default{
		data(){
			return{
				
			}
		},
		mounted(){
			JsBarcode("#barcode", "1234 5678 9012");
			
			QRCode.toCanvas(document.getElementById('canvas'), '1234 5678 9012', function (error) {
			    if (error) console.error(error)
			    console.log('success!');
			  })
		}
	}
</script>

<style scoped>
	 .qrcode{
	    width:100% !important;
	    height: 18rem !important;
	  }
</style>
