<template>
  <div id="home">
    <!-- <h1>登录后的页面</h1> -->
    <div>
      <el-button type="success" :disabled="disabled" @click="generateUserCode()">生成认证码</el-button>
      <el-button type="primary" @click="verifyUserCode()">验证认证码</el-button>
    </div>
    <!-- 展示认证码给用户看 -->
    <div class="code" v-if="showCode">
      <span>您的认证码为</span>
      <h4 id="copy-text">{{ code }}</h4>
      <el-link :underline="false" @click="copy()" data-clipboard-target="#copy-text" class="copy-text">复制</el-link>
    </div>
  </div>
</template>

<script>
import { updateUserInfo, findUserCode } from '@/api';
import generateAntiFakeCode from '@/utils/generateAntiFakeCode';
export default {
  data() {
    return {
      // 设置禁用
      disabled: false,
      showCode: false,
      code: null,
      userInfo: null,
    }
  },
  mounted() {
    // 获取用户信息
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (this.userInfo.code !== null) {
      this.disabled = true;
    }
  },
  methods: {
    generateUserCode() {
      // 生成用户的认证码，并更新用户数据
      const code = generateAntiFakeCode();
      this.code = code;
      console.log('code: ', code);
      const { username } = this.userInfo;
      // 发送请求更新用户的认证码，更新成功之后回显给用户看
      updateUserInfo({ code, username }).then(res => {
        if (res.data.code === 200) {
          this.$message.success('认证码生成成功！');
          this.showCode = true;
          this.disabled = true;
        } else {
          this.$message.error('认证码生成失败');
        }
      }).catch(err => {
        this.$message.error('认证码生成失败');
      })
    },

    verifyUserCode() {
      this.$prompt('请输入防伪认证码', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({ value }) => {
        /* 
          1. 如果当前用户的个人信息中存在防伪认证码，则直接跟用户个人信息中的 code 进行对比
            - 对比成功则提示：认证码验证成功，该认证码属于用户：XXX（用户名）
            - 对比失败则去数据库中查询
              - 不存在数据库中则提示：认证码错误，请确认防伪认证码是否输入正确
              - 存在于数据中，但绑定为其他用户则提示：
                该认证码为其他用户所有，请确认防伪认证码是否输入正确 
        */
        if (this.userInfo.code === value) {
          this.$message.success(`认证码验证成功，该认证码属于用户：${this.userInfo.username}`);
        } else {
          // 去数据库中查询
          findUserCode({ code: value }).then(res => {
            if (res.data.code === 200) {
              this.$message({
                message: '该认证码为其他用户所有，请确认防伪认证码是否输入正确',
                type: 'warning'
              });
            } else {
              // this.$message.error('认证码错误，请确认防伪认证码是否输入正确');
            }
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        });
      });
    },
  },

  copy() {
    console.log('复制');
    const clipboard = new this.clipboard('.copy-text');
    clipboard.on('success', e => {
      e.clearSelection(); //选中时不显示选中的背景色
      this.$message.success('认证码复制成功')
    });
    clipboard.on('error', () => {
      // alert('复制失败');
      this.$message.error('认证码复制失败')
    });
  }
}

</script>

<style lang="css" scoped>
#home {
  width: 100vh;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.code {
  margin-top: 30px;
}

#copy-text {
  padding: 10px 0px;
}
</style>