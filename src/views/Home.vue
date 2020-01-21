<template style="overflow: hidden;">
	<div style="overflow: hidden;">
		<v-container style="height:40px;padding: 0;overflow: hidden;">
			<v-row>
				<v-col cols="12" style="padding-top: 0px;padding-bottom: 0px;">
					<v-text-field placeholder="搜索活动名称" v-model="message" 
					 dense outlined clearable type="text" background-color="#E7E5E5 44%"
					 color="#D63130" style="min-height:0px">
						<template v-slot:prepend-inner>
							<v-icon>mdi-card-search-outline</v-icon>
						</template>
					</v-text-field>
				</v-col>
			</v-row>
		</v-container>

		<v-card style="overflow: hidden;" flat>
			<LyTab  v-model="selectedId"
					:items="items"
					:options="options"
					@change="handleChange"
					></LyTab>
			
			<div class="wrapper" ref="wrapper">
				<div class="bscroll-container">
					<!-- 刷新提示信息 -->
					<div class="top-tip">
					    <span class="refresh-hook">{{pulldownMsg}}</span>
					</div>
					<!-- 内容列表 -->
					<div class="content">
						
								<!-- <v-card flat>
									<v-card-text style="padding-top:0"> -->
										<!-- tab里面的内容-->
										<v-list  v-for="(item, index) in fakeData" :key="index" three-line style="border-radius:0;padding:0">
											
												<hr :key="index" style="border: 3px solid rgba(0, 0, 0, 0.12);" />
												<v-list-item :key="item.title"  @click="toDetailPage">
													<v-list-item-avatar tile style="width:40%;height:80px;margin:8px 8px 8px 0;">
														<v-img class="sub" data-sub="最新" :src="item.avatar" style="border-radius: 0 5px 5px 5px;"></v-img>
													</v-list-item-avatar>
						
													<v-list-item-content>
														<!-- <v-list-item-title v-html="item.title"></v-list-item-title> -->
														<v-list-item-subtitle v-html="item.subtitle"></v-list-item-subtitle>
														<v-list-item-subtitle style="margin-top: 10px;font-size: 10px;">广东广州</v-list-item-subtitle>
														<v-list-item-subtitle>
															<span style="font-size: 10px;">12/23-12/24</span>
															<span style="float:right;color:#D63130;font-weight:bold;font-size: 12px;">免费/￥120</span>
														</v-list-item-subtitle>
													</v-list-item-content>
												</v-list-item>
												<v-divider :key="index+'hr'"></v-divider>
												<v-row :key="index+'bar'" style="padding: 0 16px">
													<v-col style="text-align:right;padding: 8px 12px;">
														<span style="float:left;font-size: 12px;padding-top:5px">公益活动</span>
														<span style="margin-right:10px;color:#D63130;font-size: 12px;">剩余名额XX个</span>
														<v-btn x-small color="#D63130" outlined rounded>立即报名</v-btn>
													</v-col>
												</v-row>
											
										</v-list>
								<!-- 	</v-card-text>
								</v-card> -->
						
					</div>
					<!-- 底部提示信息 -->
					<div class="bottom-tip">
					    <span class="loading-hook">{{pullupMsg}}</span>
					</div>
				</div>
			</div>
			
			<!-- alert提示刷新成功 -->
			<div class="alert-hook" :style="{display: alertHook}">刷新成功</div>
			
		</v-card>
		
	</div>
</template>


<script>
	import BScroll from "better-scroll"
	export default {
		data: () => ({
			selectedId: 0,
			items: [
			        {label: '首页'},
			        {label: '推荐'},
			        {label: '分类1'},
			        {label: '分类2'},
			        {label: '分类3'},
			        {label: '分类4'},
			        {label: '分类5'},
			        {label: '分类6'},
			        {label: '分类7'}
			      ],
			options: {
			        activeColor: '#D63130'
			},   
			pulldownMsg: '释放刷新',
			pullupMsg: '加载更多',
			alertHook: 'none',
			pulldown: true,
			boldTextClass: 'boldText',
			message: "",
			tab: null,
			tabsData: [],
			fakeData:[],
			tabIndex: 0
		}),
		created() {
			const that = this;
			setTimeout(()=>{
			    that.getData().then((res)=>{
			        //获取数据
			        that.tabsData = res;
					that.fakeData = that.tabsData[0];
			    })
			},1000);
		},
		mounted() {
			this.initScroll();
			
		},
		methods: {
			handleChange(item,index){  
				this.tabIndex = index;
				this.scroll.refresh();
				this.fakeData = this.tabsData[index];
				// this.initScroll();
			},
			initScroll(){
				const that = this;
				this.$nextTick(() => {
				        this.scroll = new BScroll(this.$refs.wrapper,{click:true});
						// console.log(this.scroll);
						// 比较wrapperHeight和scrollerHeight大小
						// if(this.scroll.scrollerHeight <= this.scroll.wrapperHeight){
						// 	this.pullupMsg = '我是有底线的'
						// }
				        // 滑动过程中事件
				        this.scroll.on('scroll',(pos)=>{
				            if(pos.y > 30){
				                this.pulldownMsg = '释放立即刷新'
				            }
				        });
				        //滑动结束松开事件
				        this.scroll.on('touchEnd',(pos) =>{  //下拉刷新
				            if(pos.y > 30){
				                setTimeout(()=>{
				                    that.getData().then((res)=>{
				                        //刷新数据
				                        that.tabsData = res;
										that.fakeData = res[that.tabIndex];
				                        //恢复刷新提示文本值
				                        that.pulldownMsg = '释放刷新'
				                        //刷新成功后提示
				                        that.refreshalert();
				                        //刷新列表后，重新计算滚动区域高度
				                        that.scroll.refresh();
				                    })
				                },1000)
				            } 
				            else if(pos.y<(this.scroll.maxScrollY - 30)){   //上拉加载
				                this.pullupMsg = 'loading...';
				                setTimeout(()=>{
				                    that.getData().then((res)=>{
				                        //恢复文本值
				                        that.pullupMsg = '加载更多';
										that.fakeData = this.fakeData.concat(res[that.tabIndex])
				                        that.scroll.refresh();
				                    })
				                },1000)
				                
				            }
				        })      
				})
			},
			toDetailPage: function() {
				this.$router.push({
					name: 'detailPage',
					params: {}
				})
			},
			getData:function(){
				return new Promise(resolve => {  //模拟数据请求
				    setTimeout(() => {
				        const arr = [
					 [{
							avatar: "https://cdn.vuetifyjs.com/images/lists/1.jpg",
							title: "Brunch this weekend?",
							subtitle: "<span class='text--primary'>Ali Connors</span> &mdash; I'll be in your neighborhood doing errands this weekend. Do you want to hang out?"
						},
						{
							avatar: "https://cdn.vuetifyjs.com/images/lists/2.jpg",
							title: 'Summer BBQ <span class="grey--text text--lighten-1">4</span>',
							subtitle: "<span class='text--primary'>to Alex, Scott, Jennifer</span> &mdash; Wish I could come, but I'm out of town this weekend."
						},
						{
								avatar: "https://cdn.vuetifyjs.com/images/lists/3.jpg",
								title: "Oui oui",
								subtitle: "<span class='text--primary'>Sandra Adams</span> &mdash; Do you have Paris recommendations? Have you ever been?"
							},
							{
								avatar: "https://cdn.vuetifyjs.com/images/lists/4.jpg",
								title: "Birthday gift",
								subtitle: "<span class='text--primary'>Trevor Hansen</span> &mdash; Have any ideas about what we should get Heidi for her birthday?"
							},
							{
								avatar: "https://cdn.vuetifyjs.com/images/lists/5.jpg",
								title: "Recipe to try",
								subtitle: "<span class='text--primary'>Britta Holt</span> &mdash; We should eat this: Grate, Squash, Corn, and tomatillo Tacos."
							}
					]
				,
				
					[{
							avatar: "https://cdn.vuetifyjs.com/images/lists/3.jpg",
							title: "Oui oui",
							subtitle: "<span class='text--primary'>Sandra Adams</span> &mdash; Do you have Paris recommendations? Have you ever been?"
						},
						{
							avatar: "https://cdn.vuetifyjs.com/images/lists/4.jpg",
							title: "Birthday gift",
							subtitle: "<span class='text--primary'>Trevor Hansen</span> &mdash; Have any ideas about what we should get Heidi for her birthday?"
						},
						{
							avatar: "https://cdn.vuetifyjs.com/images/lists/5.jpg",
							title: "Recipe to try",
							subtitle: "<span class='text--primary'>Britta Holt</span> &mdash; We should eat this: Grate, Squash, Corn, and tomatillo Tacos."
						},
						{
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
				,
				
					[{
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
				,
				
					[{
							avatar: "https://cdn.vuetifyjs.com/images/lists/3.jpg",
							title: "Oui oui",
							subtitle: "<span class='text--primary'>Sandra Adams</span> &mdash; Do you have Paris recommendations? Have you ever been?"
						},
						{
							avatar: "https://cdn.vuetifyjs.com/images/lists/4.jpg",
							title: "Birthday gift",
							subtitle: "<span class='text--primary'>Trevor Hansen</span> &mdash; Have any ideas about what we should get Heidi for her birthday?"
						},
						{
							avatar: "https://cdn.vuetifyjs.com/images/lists/5.jpg",
							title: "Recipe to try",
							subtitle: "<span class='text--primary'>Britta Holt</span> &mdash; We should eat this: Grate, Squash, Corn, and tomatillo Tacos."
						}
					]
				
			];
						
				        resolve(arr)
				    }, 1000)
				})
			},
			refreshalert(){   //刷新成功提示
			    this.alertHook = 'block';
			    setTimeout(()=>{
			        this.alertHook = 'none'
			    },1000)
			}
			
		}

	};
</script>
<style>
	
	.boldText{
		font-weight:bold !important;
	}
	
	.wrapper{
	    width: 100%;
		height: 81vh;
	    /* background-color: snow; */
	    position: relative;
	    overflow: hidden;

	   }
		
		
	   /* 下拉、上拉提示信息 */
	   .top-tip{
	       position: absolute;  
	       top: -40px;  
	       left: 0;
	       z-index: 1;  
	       width: 100%;  
	       height:40px;  
	       line-height:40px;  
	       text-align:center;
	       color: #555;
	   } 
	     
	   .bottom-tip{
	       width: 100%;
	       height: 35px;
	       line-height: 35px;
	       text-align: center;
	       color: #777;
	       background: #f2f2f2;
	       position: absolute;
	       bottom: -35px;
	       left: 0;
	   }
		
		
	   /* 全局提示信息 */
	   .alert-hook{
	       display: none;
	       position: fixed;
	       top: 62px;
	       left: 0;
	       z-index: 2;
	       width: 100%;
	       height: 35px;
	       line-height: 35px;
	       text-align: center;
	       color: #fff;
	       font-size: 12px;
	       background: rgba(7, 17, 27, 0.5);
	   }
	 
		
		   
</style>
