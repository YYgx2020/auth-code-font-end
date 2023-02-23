<template>
  <div class="register-container" v-if="isShow">
    <h2 class="title">欢迎注册</h2>
    <el-form ref="formLabelAlign" :label-position="labelPosition" :rules="rules" label-width="80px"
      :model="formLabelAlign">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="formLabelAlign.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="formLabelAlign.password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="password_again">
        <el-input type="password" v-model="formLabelAlign.password_again" placeholder="请确认密码"></el-input>
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="handleRegister('formLabelAlign')">注册</el-button>
    <!-- <el-button @click="handleRegister()">注册</el-button> -->
    <div class="register-tip">
      <el-link @click="handleLogin()" :underline="false">已有账号？返回登录</el-link>
    </div>
  </div>
</template>

<script>
import { register } from '@/api';
import bus from '@/utils/bus';
export default {
  name: 'RegisterContainer',
  data() {
    return {
      isShow: false,
      labelPosition: 'left',
      formLabelAlign: {
        username: '',
        password: '',
        password_again: '',
      },
      rules: {
        username: [
          { required: true, message: '请设置用户名', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
        ],
        password_again: [
          { required: true, message: '请重新密码', trigger: 'blur' },
        ]
      }

    }
  },
  mounted() {
    bus.$on('change_login', res => {
      if (res) {
        this.isShow = true;
      }
    })
  },
  methods: {
    handleRegister(formLabelAlign) {
      this.$refs[formLabelAlign].validate((valid) => {
        if (valid) {
          const { username, password, password_again } = this.formLabelAlign;
          if (password !== password_again) {
            this.$message.error('两次输入的密码不一致');
            return;
          }
          // 开始注册
          register({username, password}).then(res => {
            this.$message.success('用户注册成功！正在跳转至首页');
            this.$router.replace({
              name: 'home',
              params: {
                username,
              }
            })
          }).catch(err => {
          })
        } else {
          return false;
        }
      });
    },
    handleLogin() {
      // this.isShow = false;
      bus.$emit('change_register', true);
      this.isShow = false;
    }
  }
}
</script>

<style lang="css" scoped>
.register-container {
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