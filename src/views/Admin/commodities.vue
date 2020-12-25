<template>
  <div>
    <m-shelf title="商品管理">
      <span slot="right"><m-button text="添加收货地址" style="margin: 0" @btnClick="update()"></m-button></span>
      <div slot="content" style="padding:10px">
          <template>
            <el-table
                :data="commodities"
                style="width: 100%" >
              
                <el-table-column
                label="商品名称"
                prop="productName">
                </el-table-column>

                <el-table-column
                label="价格"
                prop="salePrice">
                </el-table-column>

                 <el-table-column
                label="剩余数量"
                prop="num">
                </el-table-column>

                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button
                        size="mini"
                        @click="detail(scope.row)">详情</el-button>
                        <el-button
                        size="mini"
                        type="danger"
                        @click="del(scope.row)">删除</el-button>
                    </template>
                </el-table-column>

            </el-table>
        </template>

        <!-- <div v-if="addList.length">
        </div> -->
        <!-- <div v-else>
          <div style="padding: 50px 0;text-align: center">
            <div style="font-size: 20px">你还未添加商品</div>
          </div>
        </div> -->


      </div>
    </m-shelf>

    

        <!-- <el-upload
          class="avatar-uploader"
          action="http://up-z2.qiniup.com"
          :data = "uploadkey"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload> -->

  </div>
</template>

<script>
//   import { addressList, addressUpdate, addressAdd, addressDel } from '/api/goods'
  import MButton from '@/components/MButton'
  import MPopup from '@/components/Popup'
  import MShelf from '@/components/Shelf'
  import { mapState, mapMutations } from "vuex";
  import { getStore } from '@/utils/storage'
  
  export default {
    data () {
      return {
        urlList:[],
        popupOpen: false,
        showdialog : false,
        popupTitle: '添加商品',
        msg: {
          productName: '',
          subTitle:'',
          num: '',
          salePrice: '',
          productImageBig:'',
          productImageSmall: []
        },
        userId: '',
        commodities: [
        ],
        imageUrl: '',
        uploadkey : {

          token:'',
          key:''
          
        },
        qiNiu:{
          AK:'Fugm-p3szClQNl_dCczZje4CeQ7MpcE0W-WczSaE',
          SK:'zOLD9xW17NBuRsGsTUwwhPOdYLiblwBS7Vpw3jFo',
          BK:'xmall-commodity'
        }
      }
    },
    computed: {
      ...mapState(["userInfo","id"]),
    },
    methods: {


      //初始化列表
      async init_commodities(){

      this.$http.get(`/server/api/goods/allGoods?page=1&size=999999999&sort=0&priceGt=0&priceLte=999999999`)
      .then( (res) => {
        this.commodities = res.data.data;
      })
      .catch(function (error) {
        console.log(error)
      });

        // try {
        // const res = await this.$http.get(
        //   "/api/goods/userGoods", {user:this.userId}
        // );
        // let data = res.data
        // if(data.success){
        // this.commodities = data.data;
        // console.log(this.commodities)
        // }
        // else{
        //   console.log("获取商品失败")
        // }
      // } 
      // catch (error) {
      //    console.log("获取商品失败")
      // } 

      },

      

      detail(item){
        this.$router.push({
        name: 'goodsDetail',
        query:{
          productId:item.productId
        }
      });
      },

      // 删除
      async del (item) {
        //本地删除
        for(let i = 0;i < this.commodities.length;i++){
          if(this.commodities[i].productId == item.productId){
            this.commodities.splice(i,1)
            break;
          }
        }

       this.$http.get(`/server/api/delgoods?productId=${item.productId}`)
      .then(function (res) {
        if (res.data.success === true) {
          console.log("删除成功")
          }
        else{
            console.log("删除失败")
        }
      })
      .catch(function (error) {
        console.log(error)
      });

      },


    },
    created () {  
      this.userId = getStore('id')
      this.init_commodities()
    },
    components: {
      MButton,
      MPopup,
      MShelf
    }
  }

</script>
<style scoped lang="scss">
 .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
      .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }


  .table-title {
    position: relative;
    z-index: 1;
    line-height: 38px;
    height: 38px;
    padding: 0 0 0 38px;
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
      float: left;
      text-align: center;
      color: #838383;
    }
    .address {
      margin-left: 115px; 
    }
    .tel {
      margin-left: 195px; 
    }
  }

  .address-item {
    display: flex;
    align-items: center;
    height: 115px;
    text-align: center;
    .name {
      width: 106px;
    }
    .address-msg {
      flex: 1;
    }
    .telephone {
      width: 160px;
    }
    .defalut {
      width: 80px;
      > a {
        text-align: center;
        /*display: none;*/
      }
    }
    .operation {
      width: 135px;
      a {
        padding: 10px 5px;
      }
    }
    &:hover {
      .defalut > a {
        display: block;
      }
    }
  }

  .address-item + .address-item {
    border-top: 1px solid #CFCFCF;
  }

  .defalut-address {
    color: #626262;
    display: block;
    pointer-events: none;
    cursor: default;
  }

  .md {
    > div {
      text-align: left;
      margin-bottom: 15px;
      > input {
        width: 100%;
        height: 50px;
        font-size: 18px;
        padding: 10px 20px;
        border: 1px solid #ccc;
        border-radius: 6px;
        box-shadow: 0 3px 5px -4px rgba(0, 0, 0, .4) inset, -1px 0 3px -2px rgba(0, 0, 0, .1) inset;
        line-height: 46px;
      }
    }
  }

  .btn {
    margin: 0;
    width: 100%;
    height: 50px;
    font-size: 14px;
    line-height: 48px
  }
</style>
