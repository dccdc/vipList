<template>
	<div>
		<Header v-if="$store.state.metro" :back="true" title="活动地点"></Header>
		<div id="container"></div>
	</div>
</template>

<script>
	export default {
		data() {
			return{
				locArray:[]
			}
		},
		mounted() {
			this.$bindAppBack();
			metro.setAppTitle('活动地址');
			var location = this.$route.params.location;
			var address =  this.$route.params.address;
			this.locArray = location.split(',');
			// console.log('坐标',this.locArray);
			var map = new AMap.Map('container', {
				zoom: 20, //级别
				center: this.locArray, //中心点坐标
				viewMode: '3D' //使用3D视图
			});
			
			var marker = new AMap.Marker({
				position: new AMap.LngLat(this.locArray[0], this.locArray[1]), // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
				label:{
					content: address,
					offset: new AMap.Pixel(-10, -25)
				}
			});
			// 将创建的点标记添加到已有的地图实例：
			map.add(marker);
			
			
		}
	}
</script>

<style scoped>
	#container {
		width:100%;
		height: 100vh;
	}
	
</style>
