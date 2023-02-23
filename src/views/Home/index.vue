<template>
  <div id="home">
    <!-- <h1>登录后的页面</h1> -->
    <div>
      <el-button type="success" :disabled="disabled" @click="generateUserCode()">生成认证码</el-button>
      <el-button type="primary" @click="dialogVisible = true">验证认证码</el-button>
    </div>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <!-- <span>这是一段信息</span> -->
      <!-- 修改成两个输入框 -->
      <el-form ref="formLabelAlign" :label-position="labelPosition" label-width="80px" :model="formLabelAlign">
        <el-form-item label="认证码">
          <el-input v-model="formLabelAlign.code" placeholder="请输入认证码"></el-input>
        </el-form-item>
        <el-form-item label="密钥">
          <el-input v-model="formLabelAlign.key" placeholder="请输入密钥"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog()">取 消</el-button>
        <el-button type="primary" @click="verifyUserCode()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 展示认证码给用户看 -->
    <div class="code" v-if="showCode">
      <span>您的认证码为</span>
      <h4 id="copy-text">{{ code }}</h4>
      <span>您的数字签名值为</span>
      <h4 style="padding: 10px; 0;">{{ signature }}</h4>
      <!-- <el-link :underline="false" @click="copy()" data-clipboard-target="#copy-text" class="copy-text">复制</el-link> -->
    </div>
  </div>
</template>

<script>
import { updateUserInfo, findUserCode, getUserInfo } from '@/api';
import generateAntiFakeCode from '@/utils/generateAntiFakeCode';
import jsSHA from 'jssha';

export default {
  data() {
    return {
      // 设置禁用
      disabled: false,
      showCode: false,
      code: null,  // 密钥
      userInfo: null,  // 用户信息
      signature: null,  // 数字签名
      dialogVisible: false,
      labelPosition: 'left',
      formLabelAlign: {
        code: null,
        key: null,
      },
    }
  },
  mounted() {
    const { username } = this.$route.params;
    getUserInfo({ username }).then(res => {
      this.userInfo = res.data.result;
      if (this.userInfo.code !== null) {
        this.disabled = true;
      }
    });
  },
  methods: {
    // 关闭对话框之前的操作
    handleClose() { },
    // 生成认证码和数字签名
    generateUserCode() {
      this.$prompt('请输入您的密钥', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({ value }) => {
        console.log('value: ', value);
        // 对防伪认证码进行数字签名
        try {
          // 生成用户的认证码，并更新用户数据
          const code = generateAntiFakeCode();
          this.code = code;
          const key = value; // 密钥
          const signatureLength = 16; // 数字签名值长度
          const sha256HMAC = new jsSHA('SHA-256', 'TEXT');
          sha256HMAC.setHMACKey(key, 'TEXT');
          sha256HMAC.update(code);
          // 数字签名
          const signature = sha256HMAC.getHMAC('HEX').substring(0, signatureLength);
          this.signature = signature;
          const { username } = this.userInfo;
          updateUserInfo({ code, username, signature }).then(res => {
            if (res.data.code === 200) {
              this.$message.success('认证码生成成功！');
              this.showCode = true;
              this.disabled = true;
            } else {
              // this.$message.error('认证码生成失败');
            }
          }).catch(err => {
            console.log(err);
          })
        } catch (error) {
          console.log(error);
        }
      }).catch(() => {
        this.$message('取消生成');
      });

    },

    // 验证认证码和密钥还有数字签名
    verifyUserCode() {
      const { code, key } = this.formLabelAlign;
      const { signature } = this.userInfo;
      // 验证防伪认证码及其数字签名
      function verifyAntiFakeCode(code, signature, key) {
        const signatureLength = 16; // 数字签名值长度

        // 对防伪认证码进行数字签名
        const sha256HMAC = new jsSHA('SHA-256', 'TEXT');
        sha256HMAC.setHMACKey(key, 'TEXT');
        sha256HMAC.update(code);
        const expectedSignature = sha256HMAC.getHMAC('HEX').substring(0, signatureLength);

        return signature === expectedSignature;
      }

      if (verifyAntiFakeCode(code, signature, key)) {
        this.$message.success("验证成功，该认证码正确且未被篡改");
        this.dialogVisible = false;
        this.formLabelAlign = {
          code: null,
          key: null,
        };
      } else {
        this.$message.error("验证失败，请确认输入是否正确或信息已被篡改");
      }
    },

    // 取消对话框输入
    cancelDialog() {
      this.formLabelAlign = {
        code: null,
        key: null,
      };
      this.dialogVisible = false;
    }
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