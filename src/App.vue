<template>
	<v-app>
		<v-content style="overflow-x: hidden;">
			<v-tooltip v-model="$store.state.showTooltips" >
				<span >{{$store.state.tipsText}}</span>
			</v-tooltip>
			
			<Loader v-if="$store.state.noRefreshOrInfinite" v-model="$store.state.isLoading" message="加载中..."></Loader>
			<keep-alive>
				<!-- 需要缓存的组件 -->
				<router-view v-if="$route.meta.keepAlive"></router-view>
			</keep-alive>
			<!-- 不需要缓存的组件 -->
			<router-view v-if="!$route.meta.keepAlive"></router-view>
		</v-content>
	</v-app>
</template>

<script>
	import Loader from '@/components/common/Loader.vue'
	export default {
		name: 'App',
		data: () => ({

		}),
		components: {
			Loader
		},
		updated() {
			// 控制tooltips位置
			var tipClass = document.getElementsByClassName('v-tooltip__content menuable__content__active');
			tipClass.forEach(function(e) {
				e.style.cssText = `position:fixed;left:50%;top:30px;z-index:8;transform: translate(-50%, -50%);`
			})
		}


	};
</script>
