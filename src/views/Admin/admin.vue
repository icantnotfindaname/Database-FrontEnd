<template class = "background">
    <div class="layout-container" >
        <m-header>
            <div slot="nav">
              
            </div>
        </m-header>
        <div class="w">
            <div class="content" >
              
                  <div class="account-sidebar">
                    <div class="avatar gray-box ">
                      <div>
                        <img src="http://qkwb83dxb.hn-bkt.clouddn.com/head.png"> <h5>
                        管理员</h5></div>
                      <div class="box-inner">
                        <ul class="account-nav">
                          <li v-for="(item,i) in nav" :key='i' :class="{current:item.name===title}"
                              @click="tab(item)">
                            <a href="javascript:;">{{item.name}}</a></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div class="account-content">
                    <router-view></router-view>
                  </div>
                
            </div>
        </div>
    </div>
</template>

<script>
import MHeader from "@/common/MHeader";
  export default {
    data () {
      return {
        title: '订单管理',
        nav: [
          {name: '订单管理', path: 'orders'},
          {name: '商品管理', path: 'commodities'},
        ],
        editAvatar: true
      }
    },

    methods: {
      tab (e) {
        this.$router.push({path: '/admin/' + e.path})
      }
    },
    created () {
      let path = this.$route.path.split('/')[2]
      this.nav.forEach(item => {
        if (item.path === path) {
          this.title = item.name
        }
      })
    },
    components: {
      MHeader
    },
    watch: {
      $route (to) {
        let path = to.path.split('/')[2]
        this.nav.forEach(item => {
          if (item.path === path) {
            this.title = item.name
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
@import "../../assets/style/mixin";


  .layout-container{
    min-height: 1000px;
  }

 .w {
    padding-top: 40px;
  }

  .content {
    display: flex;
    height: 100%;
  }

  .account-sidebar {
    width: 210px;
    border-radius: 6px;
    .avatar {
      padding-top: 20px;
      border-radius: 10px;
      text-align: center;
      img {
        width: 168px;
        height: 168px;
      }
      h5 {
        font-size: 18px;
        line-height: 48px;
        font-weight: 700;
      }
    }
    .account-nav {
      padding-top: 15px;
      li {
        position: relative;
        height: 48px;
        border-top: 1px solid #EBEBEB;
        line-height: 48px;
        &:hover {
          a {
            position: relative;
            z-index: 1;
            height: 50px;
            background-color: #98AFEE;
            line-height: 50px;
            color: #FFF;
          }

        }
        a {
          display: block;
        }
        &.current {
          a {
            position: relative;
            z-index: 1;
            height: 50px;
            background-color: #98AFEE;
            line-height: 50px;
            color: #FFF;
          }
        }

      }
    }
  }

  .account-content {
    margin-left: 20px;
    flex: 1;
  }
</style>