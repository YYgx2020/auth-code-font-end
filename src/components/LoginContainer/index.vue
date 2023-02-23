<template>
  <div class="login-container" v-if="isShow">
    <h2 class="title">欢迎登录</h2>
    <el-form ref="formLabelAlign" :label-position="labelPosition" :rules="rules" label-width="80px" :model="formLabelAlign">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="formLabelAlign.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="formLabelAlign.password" placeholder="请输入密码"></el-input>
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="handleLogin('formLabelAlign')">登录</el-button>
    <!-- <el-button @click="handleRegister()">注册</el-button> -->
    <div class="register-tip">
      <el-link @click="handleRegister()" :underline="false">没有账号？注册一个</el-link>
    </div>
  </div>
</template>

<script>
import { login } from '@/api';
import bus from '@/utils/bus';
export default {
  name: 'LoginContainer',
  data() {
    return {
      isShow: true,
      labelPosition: 'left',
      formLabelAlign: {
        username: '',
        password: '',
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
        ]
      }
    }
  },
  mounted() {
    bus.$on('change_register', res => {
      if (res) {
        this.isShow = true;
      }
    })
  },
  methods: {
    handleLogin(formLabelAlign) {
      this.$refs[formLabelAlign].validate((valid) => {
        if (valid) {
          const {username, password} = this.formLabelAlign;
          login({username, password}).then(res => {
            // 保存用户信息
            localStorage.setItem('userInfo', JSON.stringify(res.data.result));
            this.$message.success(res.data.message);
            this.$router.replace({
              name: 'home',
              params: {
                username,
              }
            });
          }).catch(err => {
          })
        } else {
          return false;
        }
      });
    },
    handleRegister() {
      bus.$emit('change_login', true);
      this.isShow = false;
    }
  }
}
</script>

<style lang="css" scoped>
.login-container {
  width: 400px;
  height: 360px;
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  box-sizing: border-box;
}

.title {
  margin-bottom: 20px;
}

.el-button {
  width: 100%;
  border-radius: 20px;
}

.register-tip {
  margin-top: 20px;
}
</style>