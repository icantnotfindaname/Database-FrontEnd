<template>
  <div class="login">
    <div class="box">
      <span>使用账号 登录官网</span>
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="账号" prop="user">
          <el-input type="text" v-model="ruleForm.user" autocomplete="off" placeholder="请输入学生ID"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pass">
          <el-input type="password" v-model="ruleForm.pass" autocomplete="off" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
          <el-button @click="goback()">返回</el-button>
        </el-form-item>
      </el-form>

      <el-dialog
          title="提示"
          :visible.sync="showdialog"
          width="30%">
          <span>账号或密码错误</span>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="showdialog = false">确 定</el-button>
          </span>
        </el-dialog>
    </div>
  </div>
</template>

<script>
import { setStore, getStore, removeStore } from "@/utils/storage";
export default {
  data() {
    let validateUser = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入学生ID"));
      } else {
        callback();
      }
    };
    let validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };
    return {
      showdialog : false,
      ruleForm: {
        user: "",
        pass: ""
      },
      rules: {
        user: [{ validator: validateUser, trigger: "blur" }],
        pass: [{ validator: validatePass, trigger: "blur" }]
      },
      cart: []
    };
  },
  
  mounted() {
    //缓存当前购物车中的数据
    this.login_addCart();
  },
  methods: {
    goback(){
        this.$router.go(-1);//返回上一层
    },
    
    login_addCart() {
      let cartArr = [];
      let localCart = JSON.parse(getStore("buyCart"));
      console.log(localCart);

      if (localCart && localCart.length) {
        localCart.forEach(item => {
          cartArr.push({
            userId: getStore("id"),
            productId: item.productId,
            productNum: item.productNum
          });
        });
      }
      this.cart = cartArr;
    },
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) 
        {
            //   获取用户名和密码
            // let {user,pass} = this.ruleForm;
            // let res = await this.$http.post("/api/login", this.ruleForm);

            this.$http.get(`/server/api/login?user=${this.ruleForm.user}&pass=${this.ruleForm.pass}`)
            .then((res) => {  

              console.log(res.data)
              if (res.data.success === 1) {

                console.log(res.data)
                let {token} = res.data;
                console.log("登录成功")
                console.log(res.data)
                // token = token.slice(2,-2)
                //持久化 存储

                setStore("token", token);
                setStore("id", this.ruleForm.user);

                console.log(this.cart)

                if (this.cart && this.cart.length) {
                  this.cart.forEach(async item => {
                      
                    // let res = await this.$http.post("/api/addCart", item);
                    // if (res.data.success === true) {
                    //   //.......
                    // }
                    console.log(item)
                    this.$http.get(`/server/api/addCart?userId=${this.ruleForm.user}&productId=${item.productId}&productNum=${item.productNum}`)
                      .then((res) => {
                      
                      console.log(res.data)
                      if(res.data.success == false){
                        console.log("添加失败")
                      }
                      })
                      .catch(function (error) {
                        console.log(error)
                      });

                    removeStore("buyCart");
                  });
                } 
                else {        
                }

                this.goback()
              }
              else{
                //登录失败UI
                console.log('账号或密码错误')
                this.showdialog = true
              }
            })
            .catch(function (error) {
              console.log(error);
            });
        
        
        } 
        else {
          console.log("error submit!!");
          return false;
        }


      });
    }
  }
};
</script>



<style lang="scss" scoped>
.login {
  position: relative;
  overflow: visible;
  background: #ededed;
  .box {
    width: 450px;
    border: 1px solid #dadada;
    border-radius: 10px;
    position: absolute;
    top: 200px;
    left: 50%;
    padding: 50px 50px 50px 10px;
    margin-left: -225px;
    box-shadow: 0 9px 30px -6px rgba(0, 0, 0, 0.2),
      0 18px 20px -10px rgba(0, 0, 0, 0.04),
      0 18px 20px -10px rgba(0, 0, 0, 0.04),
      0 10px 20px -10px rgba(0, 0, 0, 0.04);
    text-align: center;
    form {
      margin-top: 30px;
    }
    span {
      color: #333;
      font-weight: 400;
    }
  }
}
</style>