<template>
	<view class="content">
		<view :style="{backgroundImage: 'url('+indexBackgroundImage+')'}" style=" background-size: 100%;background-repeat: no-repeat;width: 750rpx; height: 330rpx;display: flex; flex-direction: column;">
			<view class="status_bar">
				<!-- 这里是状态栏 -->
			</view>
			<view style="display: flex; flex-direction: row; justify-content: space-between; align-items: center; width: 100%;">
				<image @click="xsct" src="../../static/cd.png" mode="aspectFit" style="width: 60rpx; height: 60rpx; margin-left: 20rpx;"></image>
				<image @click="search" src="../../static/ss.png" mode="aspectFit" style="width: 60rpx; height: 60rpx; margin-right: 20rpx;"></image>
			</view>
			<view style="margin-left: 20rpx; color: #FFFFFF; height: 270rpx; display: flex; flex-direction: column; justify-content: space-between;">
				<text class="headText">首页</text>
				<view style="display: flex; flex-direction: column;">
					<text style="font-size: 40rpx; font-family: PingFang-SC-Medium;">{{context}} {{name}}</text>
					<text style="font-size: 30rpx;">让我们听点什么吧！</text>
				</view>
			</view>
		</view>
		<!-- <view style="width: 100%; height: 330rpx;"></view> -->
		<view style="height: 60rpx; width: 750rpx; display: flex; flex-direction: row; justify-content: flex-start; align-items: center;background-color: #FFFFFF;">
			<text style="font-size: 20rpx; margin-left: 20rpx;">我的歌单</text>
		</view>
		<view v-for="(item, index) in dateList" :id="dateList[index].id" :key="index">
			<view @click="gd(dateList[index].id,dateList[index].name,dateList[index].coverImgUrl)" style="margin-left: 20rpx; border-bottom: #eeeeee 1rpx solid; height: 100rpx; width: 750rpx; margin-bottom: 25rpx; display: flex; flex-direction: row; align-items: center;">
				<image :src="dateList[index].coverImgUrl" mode="aspectFit" style="width: 90rpx; height: 90rpx; border-radius: 10rpx;"></image>
				<view style="display: flex; flex-direction: column; justify-content: center; margin-left: 10rpx;">
					<text class="songName">{{dateList[index].name}}</text>
					<view style="display: flex; flex-direction: row;font-size: 22rpx; color: #999999;">
						<text>{{dateList[index].trackCount}}首</text>
						<text v-show="dateList[index].creator.nickname != name">，by {{dateList[index].creator.nickname}}</text>
					</view>
				</view>
			</view>
		</view>
		<uni-drawer :visible="ct">
			<view style="height: 100%; width: 100%; display: flex; flex-direction: column; align-items: center;">
				<view class="status_bar">
					<!-- 这里是状态栏 -->
				</view>
				<view style="display: flex; flex-direction: column; align-items: center;">
					<image v-if="peopleHead == ''" @click="login" src="../../static/wdl.png" mode="aspectFit" style="border-radius: 100%; width: 120rpx; height: 120rpx;"></image>
					<image v-else :src="peopleHead" mode="aspectFit" style="border-radius: 100%; width: 120rpx; height: 120rpx;"></image>
					<text style="font-size: 20rpx; color: #999999; margin-top: 30rpx;">{{theDay}}</text>
					<text v-show="name != ''">{{name}}</text>
				</view>
			</view>
		</uni-drawer>
	</view>
</template>

<script>
	import head from '../../common/headBackground.js';
	import uniDrawer from '@/components/uni-drawer/uni-drawer.vue'
	var day = new Date();
	var hour = day.getHours();
	var month = day.getMonth() + 1; //得到月份
	var date = day.getDate();

	// var weekday=new Array(7)
	// weekday[0]="周日"
	// weekday[1]="周一"
	// weekday[2]="周二"
	// weekday[3]="周三"
	// weekday[4]="周四"
	// weekday[5]="周五"
	// weekday[6]="周六"
	export default {
		components: {
			uniDrawer
		},

		data() {
			return {
				dateList: [],
				name: '',
				peopleHead: '',
				indexBackgroundImage: '',
				ct: false,
				theDay: '',
				context: '早上好',
				weekday: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"]
			}
		},
		onLoad() {
			console.log(hour);
			console.log(month);
			this.theDay = month + '月' + date + '日，' + this.weekday[day.getDay()]
			if (0 <= hour && hour <= 6) {
				this.context = '夜深了'
			} else if (6 <= hour && hour <= 14) {
				this.indexBackgroundImage = head.indexNoonHeadImage
				this.context = '早上好'
			} else if (14 <= hour && hour <= 19) {
				this.indexBackgroundImage = head.indexAfternoonHeadImage
				this.context = '下午好'
			} else if (19 <= hour && hour <= 24) {
				this.context = '晚上好'
			}
		},
		onShow() {
			this.peopleHead = uni.getStorageSync('peopleHead')
			this.name = uni.getStorageSync('userName')
			this.getGd()
		},
		methods: {
			gd(id, name, img) {
				console.log(id, name);
				uni.navigateTo({
					url: 'playList/playList?id=' + id + '&name=' + name + '&img=' + img
				})
			},
			xsct() {
				this.ct = !this.ct
			},
			getGd() {
				var userId = uni.getStorageSync('userId')
				uni.request({
					url: this.websiteUrl + "user/playlist",

					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						"uid": userId
					},
					method: 'POST',
					dataType: 'json',
					success: (res) => {
						var date = res.data
						console.log(date);
						this.dateList = date.playlist
					}
				});
			},
			search() {
				uni.navigateTo({
					url: 'search'
				})
			},
			login() {
				uni.navigateTo({
					url: 'login'
				})
			}
		}
	}
</script>

<style>
	.content {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.status_bar {
		height: var(--status-bar-height);
		width: 100%;
	}

	.songName {
		color: #000000;
		font-size: 30rpx;
	}
</style>
