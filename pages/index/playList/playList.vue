<template>
	<view>
		<view class="status_bar">
			<!-- 这里是状态栏 -->
		</view>
		<view style="display: flex; flex-direction: column; align-items: center;">
			<view style=" position: fixed; z-index: 2; width: 100%; height: 610rpx; background-color: #101010;">
				<view style=" width: 100%; height: 80rpx; display: flex; flex-direction: row; justify-content: space-between; align-items: center;">
					<image @click="this.back()" src="../../../static/back.png" mode="aspectFit" style="width: 60rpx; margin-left: 20rpx; height: 60rpx;"></image>
					<!-- <text style="width: 350rpx; font-size: 34rpx; font-family: PingFang-SC-Medium; color: #101010;" >{{headTitle}}</text> -->
					<image src="../../../static/sss.png" mode="aspectFit" style="width: 60rpx; height: 60rpx; margin-right: 20rpx;"></image>
				</view>
				<view style="width: 100%; height: 530rpx; display: flex; justify-content: center; align-items: center;">
					<view :style="{backgroundImage: 'url('+albumImage+')'}" style="display: flex; flex-direction: column; justify-content: flex-end; align-items: center; width: 450rpx; height: 450rpx; background-size: 100%; border-radius: 10rpx;">
						<text style="font-weight: bold; color: #FFFFFF; font-size: 28rpx; font-family: PingFang-SC-Medium; margin-bottom: 20rpx;">{{headTitle}}</text>
						<text style="color: #FFFFFF; font-size: 20rpx; font-family: PingFang-SC-Medium; margin-bottom: 10rpx;">{{albumLenth}}</text>
					</view>
				</view>
			</view>
			<view style="background-color: #F2F2F2; width: 100%; height: 610rpx;"></view>
			<view style="border-radius: 30rpx 30rpx 0 0; background-color: #FFFFFF;">
				<view v-for="(item, index) in songList" :id="songList[index].id" :key="index">
					<view style="margin-left: 20rpx; margin-top: 30rpx; height: 100rpx; width: 750rpx; margin-bottom: 25rpx; display: flex; flex-direction: row; align-items: center;">
						<text style="font-size: 20rpx; font-family: PingFang-SC-Regular; margin-right: 10rpx;">{{index+1}}</text>
						<view style="display: flex; flex-direction: column; justify-content: center; margin-left: 10rpx;">

							<text class="songName">{{songList[index].name}}</text>

						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				headTitle: '',
				albumId: '',
				albumImage: '',
				songList: [],
				albumLenth: 0,
				songId: []
			}
		},
		onLoad(e) {
			console.log(e);
			this.headTitle = e.name
			this.albumId = e.id
			this.albumImage = e.img
			this.getMusic();
		},
		methods: {
			getMusic() {
				var that = this
				var userId = uni.getStorageSync('userId')
				uni.request({
					url: this.websiteUrl + "playlist/detail",

					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						"id": this.albumId
					},
					method: 'POST',
					dataType: 'json',
					success: (res) => {
						var date = res.data
						var albumList = res.data.privileges
						this.albumLenth = albumList.length
						let b = this.albumLenth
						for (let i = 0; i < b; i++) {
							// this.getSong(albumList[i].id);
							this.songId.push(albumList[i].id)
						}
						this.getSong();
					}
				});
			},
			getSong(e) {
				var that = this
				var userId = uni.getStorageSync('userId')
				uni.request({
					url: this.websiteUrl + "song/detail",
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						"ids": this.songId
					},
					method: 'POST',
					dataType: 'json',
					success: (res) => {
						this.songList = res.data.songs
						// for (let i = 0; i < b; i++) {
						// 	// this.getSong(albumList[i].id);
						// 	this.songId.push(albumList[i].id)
						// }
					}
				});
			},
		}
	}
</script>

<style>
	.songName {
		color: #000000;
		font-size: 28rpx;
		font-family: PingFang-SC-Medium;
	}
</style>
