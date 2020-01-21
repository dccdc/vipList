<template>
	<div>
		<v-container style="padding: 0 16px;" class="white">
			<v-tabs v-model="tab" color="red" slider-size="3" centered grow>
				<v-tab v-for="(item,index) in tabsData" :key="index">
					<span style="font-size: 16px;font-weight: bold;">{{item.tabTitle}}</span>
				</v-tab>
			</v-tabs>
		</v-container>


		<v-tabs-items v-model="tab">
			<v-tab-item v-for="(item,index) in tabsData" :key="index">
				<ticketScroller :key="index" :content="item.tabContent"></ticketScroller>
			</v-tab-item>
		</v-tabs-items>

	</div>
</template>

<script>
	import ticketScroller from '@/components/ticketScroller.vue'
	export default {
		data() {
			return {
				tab: null,
				tabsData: [{
						tabTitle: '未使用',
						tabContent: [{
								avatar: "https://cdn.vuetifyjs.com/images/lists/1.jpg",
								title: "Brunch this weekend?",
								subtitle: "<span class='text--primary'>Ali Connors</span> &mdash; I'll be in your neighborhood doing errands this weekend. Do you want to hang out?"
							},
							{
								avatar: "https://cdn.vuetifyjs.com/images/lists/2.jpg",
								title: 'Summer BBQ <span class="grey--text text--lighten-1">4</span>',
								subtitle: "<span class='text--primary'>to Alex, Scott, Jennifer</span> &mdash; Wish I could come, but I'm out of town this weekend."
							}
						]
					},
					{
						tabTitle: '已使用',
						tabContent: [{
								avatar: "https://cdn.vuetifyjs.com/images/lists/3.jpg",
								title: "Oui oui",
								subtitle: "<span class='text--primary'>Sandra Adams</span> &mdash; Do you have Paris recommendations? Have you ever been?"
							},
							{
								avatar: "https://cdn.vuetifyjs.com/images/lists/4.jpg",
								title: "Birthday gift",
								subtitle: "<span class='text--primary'>Trevor Hansen</span> &mdash; Have any ideas about what we should get Heidi for her birthday?"
							}
						]
					},
					{
						tabTitle: '已失效',
						tabContent: [{
							avatar: "https://cdn.vuetifyjs.com/images/lists/5.jpg",
							title: "Recipe to try",
							subtitle: "<span class='text--primary'>Britta Holt</span> &mdash; We should eat this: Grate, Squash, Corn, and tomatillo Tacos."
						}]
					}
				]
			}
		},
		components: {
			ticketScroller
		}
	}
</script>
