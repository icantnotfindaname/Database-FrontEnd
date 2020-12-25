<template>
  <div class="login">
    <div class="box">
      <span>注册账号</span>
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >

        <el-form-item label="学生ID" prop="user">
          <el-input type="text" v-model="ruleForm.user" autocomplete="off" placeholder="请输入学生ID"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input type="text" v-model="ruleForm.name" autocomplete="off" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-input type="text" v-model="ruleForm.sex" autocomplete="off" placeholder="请输入性别"></el-input>
        </el-form-item>
        <el-form-item label="大学" prop="college">
          <el-input type="text" v-model="ruleForm.college" autocomplete="off" placeholder="请输入大学"></el-input>
        </el-form-item>
        <el-form-item label="专业" prop="major">
          <el-input type="text" v-model="ruleForm.major" autocomplete="off" placeholder="请输入专业"></el-input>
        </el-form-item>
        <el-form-item label="宿舍" prop="Dormitory">
          <el-input type="text" v-model="ruleForm.dormitory" autocomplete="off" placeholder="请输入宿舍"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pass">
          <el-input type="password" v-model="ruleForm.pass" autocomplete="off" placeholder="请输入密码"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">注册</el-button>
          <el-button @click="goback()">返回</el-button>
        </el-form-item>

        <el-dialog
          title="提示"
          :visible.sync="showdialog1"
          width="30%">
          <span>注册成功</span>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="showdialog1 = false;goback()">确 定</el-button>
          </span>
        </el-dialog>

        <el-dialog
          title="提示"
          :visible.sync="showdialog2"
          width="30%">
          <span>账号已被注册</span>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="showdialog2 = false">确 定</el-button>
          </span>
        </el-dialog>

      </el-form>
    </div>
  </div>
</template>

<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
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
    let validateName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入姓名"));
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
    let validateDormitory = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入宿舍"));
      } else {
        callback();
      }
    };
    let validateMajor = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入专业"));
      } else {
        callback();
      }
    };
    let validateCollege = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入大学"));
      } else {
        callback();
      }
    };
    let validateSex = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入性别"));
      } else {
        callback();
      }
    };
    return {
      showdialog1:false,
      showdialog2:false,
      ruleForm: {
        user: "",
        name: "",
        sex:"",
        college: "",
        major: "",
        dormitory:"",
        pass: ""
      },
      rules: {
        user: [{ validator: validateUser, trigger: "blur" }],
        name: [{ validator: validateName, trigger: "blur" }],
        sex: [{ validator: validateSex, trigger: "blur" }],
        college: [{ validator: validateCollege, trigger: "blur" }],
        major: [{ validator: validateMajor, trigger: "blur" }],
        dormitory: [{ validator: validateDormitory, trigger: "blur" }],
        pass: [{ validator: validatePass, trigger: "blur" }]
      },
      cart: []
    };
  },
  
  mounted() {
  },
  methods: {
    
    goback(){
        this.$router.go(-1);//返回上一层
    },

    submitForm(formName) {

      this.$refs[formName].validate(async valid => {
        if (valid) {
          //   获取用户名和密码
            // let {user,name, sex,college,major,dormitory,pass} = this.ruleForm;
            let {user,pass} = this.ruleForm;

            console.log(this.ruleForm)
            this.$http.get(`/server/api/register?user=${this.ruleForm.user}&pass=${this.ruleForm.pass}&\dormitory=${this.ruleForm.dormitory}&college=${this.ruleForm.college}&name=${this.ruleForm.name}&major=${this.ruleForm.major}&sex=${this.ruleForm.sex}`)
                  .then((response) => 
                  {  

                     if (response.data.success) {
                        //注册成功
                        console.log('注册成功')
                        this.showdialog1 = true
                    }
                    else{
                        //注册失败
                        console.log('注册失败')
                        this.showdialog2 = true
                    }

                  })
                  .catch(function (error) {
                    console.log('注册失败')
                    console.log(error);
                    this.showdialog2 = true
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