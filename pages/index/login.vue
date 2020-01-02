<template>
	<view>
		<view style="width: 550rpx; height: 600rpx; border: #778899 3rpx solid; display: flex; flex-direction: column; align-items: center; justify-content: space-around;">
			<image src="../../static/wdl.png" mode="aspectFit" style="width: 120rpx; margin-top: 50rpx; height: 120rpx; border-radius: 100%;"></image>
			<view style="display: flex; flex-direction: column; ">
				<input type="text" v-model="name" placeholder="请输入手机号或邮箱号" style="font-size: 24rpx; color: #778899; display: flex; flex-direction: row; justify-content: center; align-items: center; text-align: center; border-bottom: #C0C0C0 1rpx solid; width: 350rpx;" />
				<input type="text" v-model="password" password="true" style="font-size: 24rpx; color: #778899; display: flex; flex-direction: row; justify-content: center; align-items: center; text-align: center; border-bottom: #C0C0C0 1rpx solid; width: 350rpx;margin-top: 80rpx;" />
			</view>
			<button @click="login" type="primary" style="width: 200rpx; height: 50rpx; font-size: 28rpx; border-radius: 40rpx; background-color: #000000; color: #FFFFFF; display: flex; justify-content: center; align-items: center;">登录</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				name: '',
				password: '',
				jiekou: '',
			}
		},
		methods: {
			login() {
				if (this.name.indexOf("@") != -1) {
					console.log('邮箱');
					this.jiekou = 'login'
				} else {
					console.log('电话');
					this.jiekou = 'login/cellphone'
				}
				uni.request({
					url: this.websiteUrl + this.jiekou,

					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						"phone": this.name,
						// "email": this.name,
						"password": this.password
					},
					method: 'POST',
					dataType: 'json',
					success: (res) => {
						var data = res.data
						if (data.code == 200) {
							console.log(data.token);
							console.log(data.profile.avatarUrl);
							uni.setStorageSync('cookie', data.token);
							uni.setStorageSync('userId', data.profile.userId);
							uni.setStorageSync('userName', data.profile.nickname);
							uni.setStorageSync('peopleHead', data.profile.avatarUrl);
							uni.showToast({
								icon: 'none',
								title: '登录成功！'
							})
							setTimeout(function() {
								uni.navigateBack({

								})
							}, 1000);
						} else {
							uni.showToast({
								icon: 'none',
								title: data.message
							})
						}
					}
				});
			}
		}
	}
</script>

<style>
	page {
		background: linear-gradient(180deg, rgb(255, 255, 255), rgb(192, 192, 192));
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
	}
</style>
