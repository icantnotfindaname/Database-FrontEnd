<template>
	<div>
		<shelf title="我的订单">
			<div slot="content">
				<div v-loading="loading" element-loading-text="加载中..." v-if="orderList.length" style="min-height: 10vw;">
					<div v-for="(item,i) in orderList" :key="i">
						<div class="gray-sub-title cart-title">
							<div class="first">
								<div>
									<span class="date" v-text="item.createDate"></span>
									<span class="order-id"> 订单号： <a @click="orderDetail(item.orderId)">{{item.orderId}}</a> </span>
								</div>
								<div class="f-bc">
									<span class="price">单价</span>
									<span class="num">数量</span>
								</div>
							</div>
							<div class="last">
								<span class="sub-total">实付金额</span>
								<span class="order-detail"> <a @click="orderDetail(item.orderId)">查看详情 ><em class="icon-font"></em></a> </span>
							</div>
						</div>
						<div class="pr">
							<div class="cart" v-for="(good,j) in item.goodsList" :key="j">
								<div class="cart-l" :class="{bt:j>0}">
									<div class="car-l-l">
										<div class="img-box"><a @click="goodsDetails(good.productId)"><img :src="good.productImg" alt=""></a></div>
										<div class="ellipsis"><a style="color: #626262;" @click="goodsDetails(good.productId)">{{good.productName}}</a></div>
									</div>
									<div class="cart-l-r">
										<div>¥ {{Number(good.salePrice).toFixed(2)}}</div>
										<div class="num">{{good.productNum}}</div>
									</div>
								</div>
								<div class="cart-r">
									<span></span>
									<span></span>
								</div>
							</div>
							<div class="prod-operation pa" style="right: 0;top: 0;">
								<div class="total">¥ {{item.orderTotal}}</div>
								<div v-if="item.orderStatus === '0'">
									<el-button @click="confirmOrder(item.orderId)" type="primary" size="small">确认收货</el-button>
								</div>
								<div class="status" v-if="item.orderStatus !== '0'">
									<div style="margin-top: 20px">已收货</div>
									<el-button @click="writeComment(item.orderId)" style="margin-top: 20px" type="primary" size="medium">评论</el-button>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div v-loading="loading" element-loading-text="加载中..." class="no-info" v-else>
					<div style="padding: 100px 0;text-align: center">
						你还未创建过订单, 去逛逛吧！
					</div>
				</div>
			</div>
		</shelf>
		<div style="float:right">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
			 :page-sizes="[5, 10, 15, 20]" :page-size="pageSize" layout="total, sizes, prev, pager, next" :total="total">
			</el-pagination>
		</div>
	</div>
</template>

<script>
	import Shelf from '@/components/Shelf'
	import {
		getStore
	} from '@/utils/storage'
	export default {
		data() {
			return {
				// 订单状态：0——未收货	1——已收货
				orderList: [],
				userId: '',
				orderStatus: '',
				loading: true,
				currentPage: 1,
				pageSize: 5,
				total: 0
			}
		},

		created() {
			console.log(this.orderList.length)
			this.userId = getStore('id')
			this.getOrderList()
			this.loading = false
		},

		components: {
			Shelf
		},

		methods: {
			message(m) {
				this.$message.error({
					message: m
				})
			},

			handleSizeChange(val) {
				this.pageSize = val
				this.getOrderList()
			},

			handleCurrentChange(val) {
				this.currentPage = val
				this.getOrderList()
			},

			getOrderList() {
				this.$http.get(
						`/server/user/orderList/getOrders?userId=${this.userId}&size=${this.pageSize}&page=${this.currentPage}`
					)
					.then((res) => {
						console.log(res.data);
						if (res.data.success) {
							this.orderList = res.data.orderList
							this.total = res.data.total
						} else {
							console.log("getOrderList fails");
						}
					})
					.catch((error) => {
						console.log(error);
					});
			},

			// TODO
			confirmOrder(orderId) {
				this.$confirm('确定收货?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$http.get(
							`/server/user/orderList/confirm?orderId=${orderId}`
						)
						.then((res) => {
							console.log(res);
							if (res.data.success) {
								this.getOrderList()
								this.$message({
									showClose: true,
									type: 'success',
									message: '成功收货!'
								});
							} else {
								this.$message({
									showClose: true,
									type: 'success',
									message: '确认失败!'
								});
							}
						})
						.catch((error) => {
							console.log(error);
							this.$message({
								showClose: true,
								type: 'error',
								message: '确认失败!'
							});
						});

				}).catch(() => {
					this.$message({
						showClose: true,
						type: 'info',
						message: '取消操作'
					});
				});
			},

			goodsDetails(id) {
				window.open(window.location.origin + '/goodsDetail?productId=' + id)
			},

			orderDetail(orderId) {
				this.$router.push({
					path: 'orderDetail',
					query: {
						orderId: orderId
					}
				})
			},

			// TODO
			writeComment(orderId) {
				this.$prompt('请输入评论', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消'
				}).then(({
					value
				}) => {
					// TODO 上传评论
					this.$http.get(
							`/serveruser/orderList/comment?orderId=${orderId}&comment=${value}`
						)
						.then((res) => {
							console.log(res);
							if (res.data.success) {
								this.$message({
									type: 'success',
									message: '评论成功'
								});
							} else {
								this.$message({
									type: 'error',
									message: '评论失败!'
								});
							}
						})
						.catch((error) => {
							console.log(error);
							this.$message({
								showClose: true,
								type: 'error',
								message: '评论失败!'
							});
						});
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '取消评论'
					});
				});
			}
		}
	}
</script>
<style lang="scss" scoped>
	@import "../../../assets/style/mixin";

	.gray-sub-title {
		height: 38px;
		padding: 0 24px;
		background: #EEE;
		border-top: 1px solid #DBDBDB;
		border-bottom: 1px solid #DBDBDB;
		line-height: 38px;
		font-size: 12px;
		color: #666;
		display: flex;

		span {
			display: inline-block;
			height: 100%;
		}

		.first {
			display: flex;
			justify-content: space-between;
			flex: 1;

			.f-bc {
				>span {
					width: 112px;
					text-align: center;
				}
			}
		}

		.last {
			width: 230px;
			text-align: center;
			display: flex;
			border-left: 1px solid #ccc;

			span {
				flex: 1;
			}
		}
	}

	.bt {
		border-top: 1px solid #EFEFEF;
	}

	.date {
		padding-left: 0px;
	}

	.order-id {
		margin-left: 25px;
	}

	.cart {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 24px;

		&:hover {
			.del-order {
				display: block;
			}
		}

		.del-order {
			display: none;
		}

		.cart-l {
			display: flex;
			align-items: center;
			flex: 1;
			padding: 15px 0;
			justify-content: space-between;
			position: relative;

			&:before {
				position: absolute;
				content: ' ';
				right: -1px;
				top: 0;
				width: 1px;
				background-color: #EFEFEF;
				height: 100%;
			}

			.ellipsis {
				margin-left: 20px;
				width: 220px;
			}

			.img-box {
				border: 1px solid #EBEBEB;
			}

			img {
				display: block;
				@include wh(80px);
			}

			.cart-l-r {
				display: flex;

				>div {
					text-align: center;
					width: 112px;
				}
			}

			.car-l-l {
				display: flex;
				align-items: center;
			}
		}

		.cart-r {
			width: 230px;
			display: flex;

			span {
				text-align: center;
				flex: 1;
			}
		}
	}

	.prod-operation {
		height: 110px;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 254px;

		div {
			width: 100%;
			text-align: center;
		}

		div:last-child {
			padding-right: 24px;
		}
	}
</style>
