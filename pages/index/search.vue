<template>
	<view>
		<view class="status_bar">
			<!-- 这里是状态栏 -->
		</view>
		<view style="display: flex; flex-direction: column;" >
			<view class="gdView" style="height: 336rpx; position: absolute; z-index: 2; width: 750rpx;">
				<view @click="this.back()" style=" width: 80rpx; height: 80rpx; display: flex; justify-content: center; align-items: center;">
					<image src="../../static/gb.png" mode="aspectFit" style="width: 30rpx; height: 30rpx;"></image>
				</view>
				<text style="margin-left: 20rpx;" class="headText">搜索</text>
				<view style="width: 100%; height: 100rpx; display: flex; flex-direction: row;justify-content: space-between;">
					<view style="width: 600rpx; height: 100rpx; display: flex; align-items: center; height: 100rpx; margin-left: 20rpx;">
						<input @confirm="doSearch" type="text" placeholder="找点想听的吧" placeholder-style="font-size: 28rpx;" v-model="name"
						 style="" />
					</view>
					<view style=" width: 100rpx; height: 100rpx; display: flex; justify-content: center; align-items: center;">
						<image src="../../static/wyyyy.png" mode="aspectFit" style="width: 45rpx; height: 45rpx;"></image>
					</view>
				</view>
				<view v-show="!isShowKeywordList">
					<wuc-tab :textFlex="true" tabStyle="color: #999999; font-size: 28rpx;" :tab-list="tabList" :tabCur.sync="TabCur"
					 @change="tabChange"></wuc-tab>
				</view>
			</view>
			<view style="width: 750rpx; height: 336rpx;"></view>
			<scroll-view class="keywordBox" v-show="isShowKeywordList" scroll-y>
				<view class="keyword-block">
					<view class="keyword-list-header">
						<view>历史搜索</view>
						<view>
							<image @tap="oldDelete" src="../../static/delete.png"></image>
						</view>
					</view>
					<view class="keyword" v-if="oldKeywordList.length>0">
						<view v-bind:key="key" v-for="key in oldKeywordList" @tap="goSearch(key)">{{key}}</view>
					</view>
				</view>
			</scroll-view>
			<swiper v-show="!isShowKeywordList" :style="{height:swiperViewHeight}" :current="TabCur" duration="300" @change="swiperChange">
				<swiper-item scroll-y v-for="(item,index) in tabList" :key="index">
					<view v-for="(item, index) in dateList" :key="index">
						<view style="border-bottom: #000000 2rpx solid; height: 100rpx; width: 100%; margin-bottom: 25rpx; display: flex; flex-direction: row;">
							<view style="display: flex; flex-direction: column; justify-content: center;">
								<text class="songName">{{dateList[index].name}}</text>
								<view style="color: #888888;font-size: 20rpx;">
									<text>{{dateList[index].artists[0].name}} | {{dateList[index].album.name}}</text>
								</view>
							</view>
						</view>
					</view>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
	import WucTab from '@/components/wuc-tab/wuc-tab.vue';
	var gdView = 0
	export default {
		components: {
			WucTab
		},
		data() {
			return {
				phoneHeight: '667px',
				swiperViewHeight: '300px',
				name: '',
				dateList: [],
				oldKeywordList: [],
				// isShowKeywordList: false,
				isShowKeywordList: true,
				TabCur: 0,
				tabList: [{
					name: '单曲'
				}, {
					name: '专辑'
				}],
			}
		},
		onReady() {
			var that = this
			let view = uni.createSelectorQuery().in(this).select(".gdView");
			view.fields({
				size: true,
				scrollOffset: true
			}, data => {
				gdView = data.height
			}).exec();
			setTimeout(function() {
				uni.getSystemInfo({
					success: function(res) {
						console.log(res.windowHeight);
						console.log(res.windowHeight - 56);
						that.phoneHeight = res.windowHeight - 56 + 'px'
						console.log(that.phoneHeight);
						that.swiperViewHeight = res.windowHeight - 56 - gdView + 'px'
						console.log(that.phoneHeight);
						console.log(that.swiperViewHeight);
					}
				});
			}, 500);
		},
		onLoad() {
			this.loadOldKeyword();
			// this.search()
		},
		methods: {
			//滑动切换Tabs
			swiperChange(e) {
				this.TabCur = e.detail.current
			},
			//点击切换Tabs
			tabChange(index) {
				this.TabCur = index;
			},
			//输入搜索
			doSearch(key) {
				this.isShowKeywordList = false
				this.saveKeyword(this.name); //保存为历史
				this.search(this.name)
				this.name = '' //保存后重置
			},
			//历史搜索
			goSearch(e) {
				this.isShowKeywordList = false
				this.saveKeyword(e); //保存为历史
				this.search(e)
			},
			//执行搜索
			search(e) {
				console.log(e);
				uni.request({
					url: this.websiteUrl + "search",

					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						"keywords": e
					},
					method: 'POST',
					dataType: 'json',
					success: (res) => {
						var date = res.data.result
						this.dateList = date.songs
					}
				});
			},
			//加载历史搜索
			loadOldKeyword() {
				uni.getStorage({
					key: 'OldKeys',
					success: (res) => {
						var OldKeys = JSON.parse(res.data);
						this.oldKeywordList = OldKeys;
					}
				});
			},
			//清除历史搜索
			oldDelete() {
				uni.showModal({
					content: '确定清除历史搜索记录？',
					success: (res) => {
						if (res.confirm) {
							console.log('用户点击确定');
							this.oldKeywordList = [];
							uni.removeStorage({
								key: 'OldKeys'
							});
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			//保存关键字到历史记录
			saveKeyword(keyword) {
				uni.getStorage({
					key: 'OldKeys',
					success: (res) => {
						// console.log(res.data);
						var OldKeys = JSON.parse(res.data);
						var findIndex = OldKeys.indexOf(keyword);
						if (findIndex == -1) {
							OldKeys.unshift(keyword);
						} else {
							OldKeys.splice(findIndex, 1);
							OldKeys.unshift(keyword);
						}
						//最多10个纪录
						OldKeys.length > 10 && OldKeys.pop();
						uni.setStorage({
							key: 'OldKeys',
							data: JSON.stringify(OldKeys)
						});
						this.oldKeywordList = OldKeys; //更新历史搜索
					},
					fail: (e) => {
						var OldKeys = [keyword];
						uni.setStorage({
							key: 'OldKeys',
							data: JSON.stringify(OldKeys)
						});
						this.oldKeywordList = OldKeys; //更新历史搜索
					}
				});
			}
		}
	}
</script>

<style>
	.status_bar {
		height: var(--status-bar-height);
		width: 100%;
	}

	.keywordBox {
		height: calc(100vh - 155px);
		border-radius: 10px 10px 0 0;
		background-color: #fff;
	}

	.keywordBox .keyword-block {
		padding: 5px 0;
	}

	.keywordBox .keyword-block .keyword-list-header {
		width: 94%;
		padding: 5px 3%;
		font-size: 13.5px;
		color: #333;
		display: flex;
		justify-content: space-between;
	}

	.keywordBox .keyword-block .keyword-list-header image {
		width: 20px;
		height: 20px;
	}

	.keywordBox .keyword-block .keyword {
		width: 94%;
		padding: 3px 3%;
		display: flex;
		flex-flow: wrap;
		justify-content: flex-start;
	}

	.keywordBox .keyword-block .hideHotTis {
		display: flex;
		justify-content: center;
		font-size: 14px;
		color: #6b6b6b;
	}

	.keywordBox .keyword-block .keyword>view {
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 30px;
		padding: 0 10px;
		margin: 5px 10px 5px 0;
		height: 30px;
		font-size: 14px;
		background-color: rgb(242, 242, 242);
		color: #6b6b6b;
	}

	.songName {
		color: #000000;
		font-size: 30rpx;
	}
</style>
