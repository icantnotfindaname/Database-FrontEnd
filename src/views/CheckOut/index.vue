<template>
	<div>
		<m-header>
			<div slot="nav"></div>
		</m-header>

		<div class="store-content page-checkout">
			<div class="gray-box">
				<el-card>
					<el-steps :active="activeIndex - 0" finish-status="success" align-center>
						<el-step title="确认信息"></el-step>
						<el-step title="虚拟支付"></el-step>
						<el-step title="完成"></el-step>
					</el-steps>
				</el-card>
				<div v-show="activeIndex == 0">
					<shelf title="收货信息">
						<div slot="content">
							<el-card shadow="always">
								<h3 class="address">
									收货人：{{userName}} 地址：{{address}}
								</h3>
								<el-button class="change-address" type="danger" @click="changeAddress">修改地址</el-button>
							</el-card>
						</div>
					</shelf>
					<shelf title="购物清单">
						<div slot="content">
							<div class="box-inner ui-cart">
								<div>
									<!--标题-->
									<div class="cart-table-title">
										<span class="name">商品信息</span>
										<span class="subtotal">小计</span>
										<span class="num">数量</span>
										<span class="price">单价</span>
									</div>
									<!--列表-->
									<div class="cart-table" v-for="(item,i) in cartList" :key="i">
										<div class="cart-group divide pr" :data-productid="item.productId">
											<div class="cart-top-items">
												<div class="cart-items clearfix">
													<!--图片-->
													<div class="items-thumb fl">
														<img :alt="item.productName" :src="item.productImg">
														<a @click="goodsDetails(item.productId)" :title="item.productName" target="_blank"></a>
													</div>
													<!--信息-->
													<div class="name hide-row fl">
														<div class="name-table">
															<a @click="goodsDetails(item.productId)" :title="item.productName" target="_blank" v-text="item.productName"></a>
															<!-- <ul class="attribute">
								                  <li>白色</li>
								                </ul> -->
														</div>
													</div>
													<!--商品数量-->
													<div>
														<!--总价格-->
														<div class="subtotal" style="font-size: 14px">¥ {{item.salePrice * item.productNum}}</div>
														<!--数量-->
														<div class="item-cols-num">
															<span v-text="item.productNum"></span>
														</div>
														<!--价格-->
														<div class="price">¥ {{item.salePrice}}</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
								<!-- 合计 -->
								<div class="cart-bottom-bg fix-bottom">
									<div class="fix-bottom-inner">
										<div class="shipping">
											<div class="shipping-box" style="padding: 0 40px;">
												<div class="shipping-total shipping-price">
													<h4 class="highlight">应付总额：<em>￥{{checkPrice}}</em>
													</h4>
												</div>
											</div>
											<el-button type="primary" size="medium" @click="submitOrder">去支付
											</el-button>
										</div>
									</div>
								</div>
							</div>
						</div>
					</shelf>
				</div>
				<div v-show="activeIndex == 1">
					<shelf>
						<div slot="content">
							<el-button type="primary" style="display:block;margin:0 auto" @click="pay">付款</el-button>
						</div>
					</shelf>

				</div>
				<div v-show="activeIndex == 3">
					<shelf>
						<div slot="content">
							<el-button type="primary" style="display:block;margin:0 auto" @click="toMyOrder()">完成订单，去我的订单看看吧！</el-button>
						</div>
					</shelf>
				</div>
			</div>
		</div>
	</div>

</template>

<script>
	import MHeader from '@/common/MHeader';
	import Shelf from '@/components/Shelf';
	import {
		getStore,
		removeStore
	} from '@/utils/storage';
	import {
		mapState,
		mapMutations
	} from "vuex";

	export default {
		components: {
			MHeader,
			Shelf
		},
		data() {
			return {
				activeIndex: '0',
				cartList: [],
				num: '',
				productId: '',
				userId: '',
				orderTotal: 0,
				submit: false,
				clearCart: false,
				address: '',
				userName: '',
				paySuccess: false,
				restInfo: ''
			}
		},
		// 获取传入的信息
		created() {
			this.userId = getStore('id');
			this.getAddress();
			// TODO 获取用户收获地址信息
			let query = this.$route.query
			// 从商品详情页面进入，购买单种商品
			if (query.productId && query.num) {
				this.productId = query.productId
				this.num = query.num
				this.getGoodsDetail();
			} else {
				// 从购物车进入同时购买多种商品
				this.clearCart = true
				this.getCartList();
			}
		},
		computed: {
			...mapState(["login"]),
			// 选中的总价格
			checkPrice() {
				let totalPrice = 0
				this.cartList && this.cartList.forEach(item => {
					totalPrice += (item.productNum * item.salePrice)
				})
				this.orderTotal = totalPrice
				return totalPrice
			}
		},
		methods: {
			// TODO
			getGoodsDetail() {
				this.$http.get(
						`/server/checkOut/productDet?productId=${this.$route.query.productId}`
					)
					.then((res) => {
						console.log(res);
						if (res.status === 200) {
							let item = {}
							item.productName = res.data.productName
							item.productId = res.data.productId
							item.productImg = res.data.productImageBig
							item.productNum = this.num
							item.salePrice = res.data.salePrice
							this.cartList.push(item)
						} else {
							console.log("getGoodsDetail fails");
						}
					})
					.catch((error)=> {
						console.log(error);
					});
			},

			//TODO
			getCartList() {
				this.$http.get(
						`/server/api/cartList?userId=${this.userId}`
					)
					.then((res) => {
						console.log(res);
						if (res.data.success) {
							if(res.data.cartList.length > 0){
								for (var i = 0; i < res.data.cartList.length; ++i) {
									let item = {}
									item.productName = res.data.cartList[i].productName
									item.productId = res.data.cartList[i].productId
									item.productImg = res.data.cartList[i].productImageBig
									item.productNum = res.data.cartList[i].productNum
									item.salePrice = res.data.cartList[i].salePrice
									this.cartList.push(item)
								}
							} else {
								this.$message({
									showClose: true,
									type: 'info',
									message: '购物车空空如也！'
								});
							}
							
						} else {
							console.log("getCartList fails")
						}
					})
					.catch((error)=> {
						console.log(error);
					});
			},

			//TODO
			getAddress() {
				this.$http.get(
						`/server/getUserAddress?userId=${this.userId}`
					)
					.then((res) => {
						console.log(res);
						if (res.data.success) {
							this.userName = res.data.userinfo.userName;
							this.address = res.data.userinfo.address;
						} else {
							console.log("getAddress fails");
						}
					})
					.catch((error)=> {
						console.log(error);
					});
			},

			submitOrder() {
				// 跳转下一步
				++this.activeIndex;
			},

			// 虚拟付款成功
			pay() {
				// 再次确定登录状态
				if (this.login) {
					this.$confirm('确定付款?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						// TODO 发送购买请求（清空购物车or购买单种）
						// 失败返回提示
						if (!this.clearCart){
							// 购买单种商品
							this.$http.get(
									`/server/checkOut/buy?userId=${this.userId}&productId=${this.productId}&num=${this.num}`
								)
								.then((res)=> {
									console.log(res);
									if(res.data.success){
										this.paySuccess = true;
										this.paySuccess = true
										// console.log('before' + this.activeIndex)
										this.activeIndex = 3;
										// console.log('after' + this.activeIndex)
									} else{
										this.paySuccess = false
										//TODO
										this.$message({
											showClose: true,
											type: 'info',
											message: '该商品仅剩' + res.data.rest + '件'
										});
										this.$router.push({ path: "/" });
									}
								})
								.catch((error)=> {
									this.paySuccess = false
									console.log(error);
									this.$message({
										showClose: true,
										type: 'error',
										message: '支付失败!'
									});
								});
						} else{
							// 清空购物车
							this.$http.get(
										`/server/checkOut/buyAll?userId=${this.userId}`
									)
									.then((res)=> {
										console.log(res.data)
										if (res.data.success){
											this.paySuccess = true
											console.log('before' + this.activeIndex)
											this.activeIndex = 3;
											console.log('after' + this.activeIndex)
											removeStore("buyCart")
										} else {
											this.paySuccess = false
											// console.log(res.data.rest)
											for (var key in res.data.rest) {
												this.restInfo = this.restInfo + key + "仅剩" + res.data.rest[key]+ "件\n"
											}
											this.$message({
												showClose: true,
												type: 'error',
												message: this.restInfo
											});
											this.$router.push({ path: "/" });
										}
									})
									.catch((error)=> {
										this.paySuccess = false
										console.log(error);
										console.log('index' + this.activeIndex)
										this.$message({
											showClose: true,
											type: 'error',
											message: '支付失败!'
										});
									});
						} 

						if (this.paySuccess) {
							this.$message({
								showClose: true,
								type: 'success',
								message: '支付成功!'
							});
						}
					}).catch(() => {
						this.$message({
							showClose: true,
							type: 'info',
							message: '已取消付款'
						});
					});
				} else {
					this.$router.push({
						path: '/login'
					})
				}
			},

			// 跳转至我的订单
			toMyOrder() {
				this.$router.push({
					path: 'user/orderList',
				})
			},

			// 跳转修改地址
			changeAddress() {
				this.$router.push({
					path: 'user/information',
				})
			},

			goodsDetails(id) {
				window.open(window.location.origin + '/goodsDetail?productId=' + id)
			},
		}
	}
</script>

<style lang="scss" scoped>
	.address {
		line-height: 1.2;
		font-size: 16px;
		color: #393939;
		margin: 30px;
		padding: 0 14px;
		float: left;
		overflow: hidden;
	}

	.change-address {
		float: right;
		margin: 30px;
	}

	.store-content {
		clear: both;
		width: 1220px;
		min-height: 1000px;
		margin: 0 auto;

		.gray-box {
			position: relative;
			overflow: hidden;
			background: #fff;
			border-radius: 8px;
			border: 1px solid #dcdcdc;
			border-color: rgba(0, 0, 0, .14);
			box-shadow: 0 3px 8px -6px rgba(0, 0, 0, .1);
		}
	}

	.page-order {
		padding-top: 40px;
	}

	.ui-cart {
		img {
			width: 80px;
			height: 80px;
		}

		.cart-table-title {
			position: relative;
			z-index: 1;
			line-height: 38px;
			height: 38px;
			padding: 0 0 0 30px;
			font-size: 12px;
			background: #eee;
			border-bottom: 1px solid #dbdbdb;
			border-bottom-color: rgba(0, 0, 0, .08);

			.name {
				float: left;
				text-align: left;
			}

			span {
				width: 137px;
				float: right;
				text-align: center;
				color: #838383;
			}
		}

		.cart-group.divide {
			.cart-items {
				border-top: 1px dashed #eee;
			}
		}

		.cart-items {
			position: relative;
			height: 140px;
			margin-left: 74px;

			.subtotal {
				font-weight: 700;
			}

			.item-cols-num,
			.price,
			.subtotal {
				overflow: hidden;
				float: right;
				width: 137px;
				text-align: center;
				color: #666;
				line-height: 140px;
			}

			/*数量*/
			.subtotal,
			.item-cols-num {
				padding-top: 50px;
				line-height: 40px;
			}

			.select {
				width: 112px;
				height: 40px;
				padding-top: 4px;
				margin: 0 auto;
				line-height: 40px;

				.down {
					background-position: 0 -60px;
				}

				.down.down-disabled:hover {
					background-position: 0 -300px;
					cursor: not-allowed;
				}

				.num {
					position: relative;
					overflow: hidden;
					display: inline-block;
					width: 36px;
					height: 18px;
					margin: 7px 0 0;
					border: none;
					border-radius: 3px;
					line-height: 18px;
					text-align: center;
					font-size: 14px;
					transition: all .2s ease-out;
				}
			}

		}

		.down.down-disabled {
			background-position: 0 -300px;
			cursor: not-allowed;
		}
	}

	.cart-group.divide .cart-top-items:first-child .cart-items {
		border-top: none;
	}

	.items-choose {
		position: absolute;
		left: -74px;
		top: 0;
		width: 74px;
		height: 20px;
		padding: 60px 0 0 31px;
		font-size: 12px;
		color: #999;
	}

	.items-thumb {
		position: relative;
		margin-top: 30px;
		overflow: hidden;
		width: 80px;
		height: 80px;
	}

	.cart-items .items-thumb>a,
	.ui-cart .cart-items .items-thumb>i {
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		border: 1px solid #fff;
		border-radius: 3px;
		border: 0 solid rgba(255, 255, 255, .1);
		box-shadow: inset 0 0 0 1px rgba(0, 0, 0, .06);
	}

	.name {
		width: 380px;
		margin-left: 20px;
		color: #323232;
		display: table;

		a {
			color: #333;
			font-size: 16px;
		}
	}

	.name-table {
		display: table-cell;
		vertical-align: middle;
		height: 140px;
	}

	.fix-bottom {
		padding: 22px 29px 19px 30px;
		height: 90px;
		width: 100%;
		z-index: 1;
		background-position: center;
		background: #fdfdfd;
		background: -webkit-linear-gradient(#fdfdfd, #f9f9f9);
		background: linear-gradient(#fdfdfd, #f9f9f9);
		border-top: 1px solid #e9e9e9;
		box-shadow: 0 -3px 8px rgba(0, 0, 0, .04);

		.cart-bottom-bg {
			height: 80px;
			border-top: 1px solid #D9D9D9;
			border-radius: 0 0 8px 8px;
		}

		.fix-bottom-inner {
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: flex-end;
		}

		.shipping {
			display: flex;
			align-items: center;
		}

		em {
			display: inline-block;
			position: relative;
			top: 3px;
			margin-top: -4px;
			font-size: 24px;
			color: #d44d44;
			font-weight: 700;
		}
	}

	.attribute,
	.name p {
		color: #999;
		font-size: 12px;
		padding-top: 4px;
		line-height: 17px;
	}
</style>
