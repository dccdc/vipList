<template>
	<div id="container"></div>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		mounted() {
			var map = new AMap.Map('container', {
				zoom: 11, //级别
				center: [116.397428, 39.90923], //中心点坐标
				viewMode: '3D' //使用3D视图
			});
			
			var marker = new AMap.Marker({
				position: new AMap.LngLat(116.39, 39.9), // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
				label:{
					content: "北京欢迎您",
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
		width: 100%;
		height: 100%;
	}
	
</style>
