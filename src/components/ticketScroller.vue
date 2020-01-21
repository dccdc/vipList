<template>
	<div style="height: 93vh;">
		<scroller :on-refresh="refresh" :on-infinite="infinite">
			<!-- content goes here -->
			<v-list v-for="(item, index) in content" :key="index" three-line style="border-radius:0;padding:0">

				<hr :key="index" style="border: 4px solid rgba(199, 195, 195, 0.12);" />
				<v-list-item :key="item.title" @click="toDetailPage">
					<v-list-item-avatar tile style="width:40%;height:80px;margin:8px 8px 8px 0;">
						<v-img class="sub" data-sub="最新" :src="item.avatar" style="border-radius: 0 5px 5px 5px;"></v-img>
					</v-list-item-avatar>

					<v-list-item-content>
						<!-- <v-list-item-title v-html="item.title"></v-list-item-title> -->
						<v-list-item-subtitle v-html="item.subtitle"></v-list-item-subtitle>
						<v-list-item-subtitle style="margin-top: 10px;font-size: 12px;">有效期至12/23</v-list-item-subtitle>

					</v-list-item-content>
				</v-list-item>
				<v-divider :key="index+'hr'"></v-divider>
				<v-row :key="index+'bar'" style="padding: 0 16px">
					<v-col cols="8" class="d-flex align-center">
						<!-- <span style="float:left;font-size: 12px;padding-top:5px">公益活动</span>
							<span style="margin-right:10px;color:#D63130;font-size: 12px;">剩余名额XX个</span> -->
						<span class="hideText">券的使用说明,最多两行</span>
					</v-col>
					<v-col cols="4" class="d-flex align-center">
						<v-btn small color="#D63130" outlined rounded>立即使用</v-btn>
					</v-col>
				</v-row>

			</v-list>
		</scroller>
	</div>

</template>

<script>
	export default {
		props: ['content'],
		data() {
			return {

			}
		},
		methods: {
			refresh(done) {
				setTimeout(() => {
					let start = this.top - 1

					for (let i = start; i > start - 10; i--) {
						this.items.splice(0, 0, i + ' - keep walking, be 2 with you.')
					}

					this.top = this.top - 10;

					done()
				}, 1500)
			},
			infinite(done) {
				// console.log('infinite called..')

				setTimeout(() => {
					let start = this.bottom + 1

					for (let i = start; i < start + 10; i++) {
						this.items.push(i + ' - keep walking, be 2 with you.')
					}

					this.bottom = this.bottom + 10

					done()
				}, 1500)
			},
			toDetailPage: function() {
				this.$router.push({
					name: 'ticketDetail',
					params: {}
				})
			},
		},
	}
</script>
<style scoped>
	.hideText {
		font-size: 13px;
		display: -webkit-box;/*将对象作为弹性伸缩盒子模型显示 */
		-webkit-box-orient: vertical;/*设置或检索伸缩盒对象的子元素的排列方式*/
		-webkit-line-clamp: 2; /* 用来限制在一个块元素显示的文本的行数, 为了实现该效果，它需要组合其他的WebKit属性*/
		overflow: hidden;
		text-overflow: ellipsis;/* 溢出隐藏文本 */
	}
</style>
