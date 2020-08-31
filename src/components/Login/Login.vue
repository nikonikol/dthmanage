<template>
  <div class="login-container">
    <el-form
      :model="ruleForm2"
      :rules="rules2"
      status-icon
      ref="ruleForm2"
      label-position="left"
      label-width="0px"
      class="demo-ruleForm login-page"
    >
      <h3 class="title">系统登录</h3>
      <el-form-item prop="username">
        <el-input type="text" v-model="ruleForm2.username" auto-complete="off" placeholder="用户名"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" v-model="ruleForm2.password" auto-complete="off" placeholder="密码"></el-input>
      </el-form-item>
      <!-- <el-checkbox v-model="checked" class="rememberme">记住密码</el-checkbox> -->
      <el-form-item style="width:100%;">
        <el-button type="primary" style="width:100%;" @click="handleSubmit" :loading="logining">登录</el-button>
      </el-form-item>
      <!-- <el-form-item style="width:100%;">
                <el-button type="primary" style="width:100%;" @click="gohome">返回首页</el-button>
      </el-form-item>-->
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      logining: false,
      ruleForm2: {
        username: "",
        password: ''
      },
      rules2: {
        username: [{ required: true, message: "请输入账号", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      },
      checked: false
    };
  },
  methods: {
    handleSubmit(event) {
      this.$refs.ruleForm2.validate(valid => {
        if (valid) {
          account: this.ruleForm2.username;
          password: this.ruleForm2.password;

          this.$http
            .post("/login", {
                role: 1,
                account: this.ruleForm2.username,
                password: this.ruleForm2.password
            })
            .then(res => {
              if (res.data.error_code==1) {
                this.$message({
                  type: "success",
                  message: "登录成功"
                });
                window.sessionStorage.setItem("token", window.btoa(res.data.message[0].user_name));
                window.sessionStorage.setItem("user_id", window.btoa(res.data.message[0].user_id));
                this.$router.push({ path: "/administrator" });
              } else {
                this.$message({
                  type: "error",
                  message: "用户名或密码错误"
                });
              }
            })
            .catch(err => {
              this.$message({
                type: "error",
                message: "登录失败"
              });
            });
        } else {
          console.log("error submit!");
          return false;
        }
      });
    },
    gohome() {
      this.$router.push({ path: "./" });
    }
    /**
     * 拼接对象为请求字符串
     * @param {Object} obj - 待拼接的对象
     * @returns {string} - 拼接成的请求字符串
     * @param 使用方法 const obj = {a: 1,b: 'request',c: true,} const finalUrl = `${baseUrl}?${encodeSearchParams(obj)}`
     */
  },
  mounted() {
    window.sessionStorage.clear();
    console.log(sessionStorage.getItem("token"));
  }
};
</script>

<style scoped>
.login-container {
  width: 100%;
  height: 100%;
}
.login-page {
  -webkit-border-radius: 5px;
  border-radius: 5px;
  margin: 180px auto;
  width: 350px;
  padding: 35px 35px 15px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}
.login-page .title {
  font-size: 26px;
  line-height: 50px;
  font-weight: bold;
  margin: 10px;
  text-align: center;
}

label.el-checkbox.rememberme {
  margin: 0px 0px 15px;
  text-align: left;
}
</style>