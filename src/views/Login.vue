<template>

  <div >
    <el-container>
      <el-header>
        <img  class="mlogo" src="https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg"/>
      </el-header>

      <el-main>
<!--        分割线-->
<!--        <span class="fengeXian">心有猛虎 细嗅蔷薇</span>-->
        <el-divider><i class="el-icon-user-solid"></i></el-divider>
<!--        验证表单-->
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="twoHang-ruleForm">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="ruleForm.username"></el-input>
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input v-model="ruleForm.password" type="password"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">登入</el-button>
            <el-button @click="resetForm('ruleForm')">重置用户名与密码</el-button>
          </el-form-item>

        </el-form>      </el-main>
    </el-container>
  </div>
</template>

//样式
<script>
export default {
  name: "Login",
  data() {
    return {
      ruleForm: {
        //默认将用户与密码先放上去方便测试
        username: 'renyujie',
        password: '123456',
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'change' },
          {min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur'}
        ]
      }
    };
  },
  methods: {
    submitForm: function (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // alert('submit!');
          //先保存请求地址(整个vue(单页面)的地址)
          const _this = this;
          //  这里开始运用类似ajax的axios做post请求（data()中的ruleForm信息,即用户名和密码），将表单数据post到后台，同时获得后台返回的jwttoken信息
          this.$axios.post("/login", this.ruleForm).then(res => {
            // console.log(res)
            // console.log(res.headers)
            const jwt = res.headers['authorization'];
            const userInfo = res.data.data;
            //同时到提交store(全局信息),commit会调用SET_XX把信息存储在对应的localStorage或sessionStorage
            _this.$store.commit("SET_TOKEN", jwt);
            _this.$store.commit("SET_USERINFO", userInfo);
            console.log("UserInfo:::::"+_this.$store.getters.getUser);
            console.log("Token:::::::"+_this.$store.getters.getToken);
            //路由到博客主界面
            _this.$router.push('/blogs');
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
}
</script>

<style scoped>

  .el-header, .el-footer {
    background-color: linen;
    color: #666;
    text-align: center;
    line-height: 60px;
  }

  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
  }

  .el-main {
    /*background-color: #E9EEF3;*/
    color: #333;
    text-align: center;
    line-height: 160px;
  }

  body > .el-container {
    margin-bottom: 40px;
  }

  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }

  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }
  .mlogo {
    height: 92%;
    margin-bottom: 7px;
    margin-top: 2px;
  }
  .twoHang-ruleForm {
    max-width: 500px;
    margin: 0 auto;
  }



</style>