<template>

  <div>
    <m-shelf title="个人资料">
        <div  slot='content'>
          <div> 
            <div class="holder h_top" >
              <el-tag class="tag" type="info" size="medium ">姓名</el-tag>
              <el-tooltip class="item" effect="light" content="点击编辑" placement="right">
                  <div class = 'editable' id="name" ref="name" @click="check" >{{textForm.name}}</div>    
              </el-tooltip>
            </div>

            <el-divider ></el-divider>
            <div class="holder" >
              <el-tag class="tag" type="info" size="medium ">性别</el-tag>
              <el-tooltip class="item"  effect="light" content="点击编辑" placement="right">
                  <div class = 'editable' id="sex" ref="sex" @click="check">{{textForm.sex}}</div>    
              </el-tooltip>
            </div>
            <el-divider ></el-divider>
            <div class="holder" >
              <el-tag class="tag" type="info" size="medium ">大学</el-tag>
              <el-tooltip class="item"  effect="light" content="点击编辑" placement="right">
                  <div class = 'editable' id="college" ref="college" @click="check">{{textForm.college}}</div>    
              </el-tooltip>
            </div>
            <el-divider ></el-divider>
            <div class="holder" >
              <el-tag class="tag" type="info" size="medium ">专业</el-tag>
              <el-tooltip class="item" effect="light" content="点击编辑" placement="right">
                  <div class = 'editable' id="major" ref="major" @click="check">{{textForm.major}}</div>    
              </el-tooltip>
            </div>
            <el-divider ></el-divider>
            <div class="holder h_bottom" >
              <el-tag class="tag" type="info" size="medium ">宿舍</el-tag>
              <el-tooltip class="item"  effect="light" content="点击编辑" placement="right">
                  <div class = 'editable' id="dormitory" ref="dormitory" @click="check">{{textForm.dormitory}}</div>    
              </el-tooltip>
            </div>
            <div v-show="show_button">
              <el-divider ></el-divider>
            </div>
            <div class="button_bar" v-show="show_button">
              <el-button type="success" @click="submit_change">保存</el-button>
              <el-button type="danger" @click="cancel">取消</el-button>
            </div>  
            
            <!-- <span>男</span>
            <el-divider></el-divider>
            <span>华南理工大学</span>
            <el-divider direction="vertical"></el-divider>
            <span>计算机科学与技术</span>
            <el-divider direction="vertical"></el-divider>
            <span>C12 504</span> -->
          </div>
        </div>
    </m-shelf>
  </div>
</template>


<script>
//   import { addressList, addressUpdate, addressAdd, addressDel } from '/api/goods'
  import {setStore} from '@/utils/storage'
  import { mapState, mapMutations } from "vuex";
  import MButton from '@/components/MButton'
  import MPopup from '@/components/Popup'
  import MShelf from '@/components/Shelf'
  import { getStore } from '@/utils/storage'
  export default {
    data () {
      return {
        show_button : false,
        textForm: {
            id:"",
            name: "",
            sex:"",
            college: "",
            major: "",
            dormitory:"",
        },
      }
    },
    computed: {
      ...mapState(["userInfo","id"]),
    },
    methods: {
      resetText(){
        document.getElementById("name").innerHTML = this.textForm.name
        document.getElementById("sex").innerHTML = this.textForm.sex
        document.getElementById("college").innerHTML = this.textForm.college
        document.getElementById("major").innerHTML = this.textForm.major
        document.getElementById("dormitory").innerHTML = this.textForm.dormitory
      },
      initForm(){
        this.textForm.id = this.userInfo.id
        this.textForm.name = this.userInfo.name
        this.textForm.sex = this.userInfo.sex
        this.textForm.college = this.userInfo.college
        this.textForm.major = this.userInfo.major
        this.textForm.dormitory = this.userInfo.dormitory
      },
      async submit_change(){
        this.textForm.name = document.getElementById("name").innerText
        this.textForm.sex = document.getElementById("sex").innerText
        this.textForm.college = document.getElementById("college").innerText
        this.textForm.major = document.getElementById("major").innerText
        this.textForm.dormitory = document.getElementById("dormitory").innerText

        console.log(this.textForm)
        setStore("userInfo",this.textForm)
            console.log(this.textForm)
            this.$http.get(`/server/api/userInfo?id=${this.textForm.id}&name=${this.textForm.name}&sex=${this.textForm.sex}&college=${this.textForm.college}
                            &major=${this.textForm.major}&dormitory=${this.textForm.dormitory}`)
            .then(function (res) {
            if(res.data.success == false){
              console.log("修改失败")
            }
            })
            .catch(function (error) {
              console.log(error)
            });

        let res = await this.$http.post("/api/userInfo", this.textForm);
        this.show_button = false
      },
      check() {
        this.$refs.name.contentEditable = true
        this.$refs.sex.contentEditable = true
        this.$refs.college.contentEditable = true
        this.$refs.major.contentEditable = true
        this.$refs.dormitory.contentEditable = true
        this.show_button = true
      },
      cancel(){
        this.$refs.name.contentEditable = false
        this.$refs.sex.contentEditable = false
        this.$refs.college.contentEditable = false
        this.$refs.major.contentEditable = false
        this.$refs.dormitory.contentEditable = false
        this.show_button = false
        this.resetText()
      },
    },


    created () {
      this.userId = getStore('id')
      this.initForm()
    },

    components: {
      MButton,
      MPopup,
      MShelf
    }
  }
</script>

<style scoped lang="scss">
  .button_bar{
    margin-left: 420px;
    margin-bottom: 20px;
  }

  .h_top{
    margin-top: 20px;
  }
  .h_bottom{
    margin-bottom: 20px;
  }
  .tag{
    display: inline-block;
    top:10px;
    // margin-top:50%;
    // margin-bottom:50%;
    margin-left: 30px;
    margin-right: 40px;

  }
  .editable{
    display: inline-block;
    margin-top: 10px;
    margin-bottom: 10px;
    margin-right: 30px;
    line-height: 30px;
    height: 30px;
    font-size: 18px;
    
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
