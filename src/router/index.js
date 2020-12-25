import Vue from 'vue'
import VueRouter from 'vue-router'
// import Index from '@/views/Index'
// import Home from '@/views/Home'
// import Login from '@/views/Login'
// import Thanks from '@/views/Thanks'
// import Goods from '@/views/Goods'
// import GoodsDetail from '@/views/GoodsDetail'
// import User from '@/views/User'

// 解决路由命名冲突的方法
const routerPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => error)
}

// 异步组件加载
const Index = () => import('@/views/Index');
const Login = () => import('@/views/Login');
const Goods = () => import('@/views/Goods');
const Register = () => import('@/views/Register');
const GoodsDetail = () => import('@/views/GoodsDetail');
const User = () => import('@/views/User/user.vue');
const Information = () => import('@/views/User/children/information.vue');
const Commodity = () => import('@/views/User/children/commodity.vue');

const CheckOut = () => import('@/views/CheckOut');
const OrderList = () => import('@/views/User/children/OrderList');
const OrderDetail = () => import('@/views/User/children/OrderDetail');

const Admin = () => import('@/views/Admin/admin.vue');
const AdminOrders = () => import('@/views/Admin/orders.vue');
const AdminCommodities = () => import('@/views/Admin/commodities.vue');


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/goods',
    name: 'goods',
    component: Index,
    children:[
      {
        path:'goods',
        component:Goods
      },
      {
        path:'goodsDetail',
        name:'goodsDetail',
        component:GoodsDetail
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
	  path: '/admin',
	  name: 'admin',
	  component: Admin,
      redirect: '/Admin/orders',
	  children: [
		 {path: 'orders', name: '订单管理', component: AdminOrders}, 
		 {path: 'commodities', name: '商品管理', component: AdminCommodities}, 
	  ]
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  },
  {
		path: '/checkout',
		name: 'checkout',
		component: CheckOut
	},
  {
    path:'/user',
    name:'user',
    component:User,
    redirect: '/user/information',
    children: [
      // {path: 'orderList', name: '订单列表', component: OrderList},
      // {path: 'commodityManage', name: '商品管理', component: CommodityManage},
      {path: 'information', name: '账户资料', component: Information},
      {path: 'commodity', name: '商品管理', component: Commodity},

      {path: 'orderList', name: 'orderList', component: OrderList},
			{path: 'orderDetail', name: 'orderDetail', component: OrderDetail}
    ],
    meta:{
      auth:true
    }

  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
