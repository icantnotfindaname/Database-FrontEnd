import Vue from 'vue'
import Vuex from 'vuex'
import {setStore} from '@/utils/storage'
import { getStore } from '../utils/storage'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    login:false,
    userInfo:null,
    cartList:[],
    showCart:false
  },
  mutations: {
    INITBUYCART(state){
      let initCart = getStore('buyCart');
      if(initCart){
        state.cartList = JSON.parse(initCart);
      }
    },

    INITUSRINFO(state){
      let initInfo = getStore("userInfo")
      if(initInfo){
        state.userInfo = initInfo;
      }
    },

    SHOWCART(state,{showCart}){
      state.showCart = showCart
    },
    ISLOGIN(state,info){
      state.userInfo = info;
      state.login = true;
      setStore('userInfo',info)
      this.INITUSRINFO
    },

    DELCART(state,productId){
      let cart = state.cartList;
      state.cartList = cart.filter(item => item.productId != productId);
      setStore('buyCart', cart)      
    },

    ADDCART(state,{productId,salePrice,productName,productImageBig,productNum=1,}){
      let cart = state.cartList;
      let goods = {
        productId,
        salePrice,
        productName,
        productImageBig
      }
      let flag = true;
      if(cart.length){
        cart.forEach(item=>{
          if(item.productId === productId && item.productNum >= 0){
            flag = false;
            item.productNum += productNum;
          }
        })
      }
      if(!cart.length||flag){
        goods.productNum = productNum;
        cart.push(goods);
      }
      state.cartList = cart;
      setStore('buyCart', cart)
    },


    UPDATEINFO(state,{name,sex,college,major,dormitory,uploadkey}){
      state.userInfo = {name,sex,college,major,dormitory,uploadkey}
    }

  },
  actions: {
  },
  modules: {
  }
})
