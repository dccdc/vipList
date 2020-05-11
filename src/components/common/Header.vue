<template>
	<header class="header_red">
		<v-row>
			<v-col v-if="back" class="text-center pr-0 zIndex"  cols="2">
				  <v-icon  color="white" @click="backLast">arrow_back</v-icon>
			</v-col>
			<v-col clos="10" class="text-center white--text absoluteCenter">{{title}}</v-col>
		</v-row>
	</header>
</template>

<script>
	// position:absolute;z-index: -1;right: 0;
	export default{
		props:['title','back'],
		methods:{
			backLast:function(){
				this.$router.go(-1)
			}
		}
	}
</script>


