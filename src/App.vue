<template>
	<v-app>
		<v-content style="overflow-x: hidden;">
			<v-tooltip v-model="$store.state.showTooltips">
				<span>报名成功</span>
			</v-tooltip>
			<Loader v-if="$store.state.noRefreshOrInfinite" v-model="$store.state.isLoading" message="加载中..."></Loader>
			<router-view></router-view>
		</v-content>
	</v-app>
</template>

<script>
	import Loader from '@/components/common/Loader.vue'
	export default {
		name: 'App',
		data: () => ({
			//
		}),
		components: {
			Loader
		},
		updated(){
			// 让tooltips居中
			var tipClass = document.getElementsByClassName('v-tooltip__content menuable__content__active');
			tipClass.forEach(function(e) {
				e.style.cssText = `position:absolute;left:50%;top:20px;z-index:8;transform: translate(-50%, -50%);`
			})
		}
	};
</script>
