<template>
  <div :style="images">
    <div class="group" >
      <Group class="vux-1px-l vux-1px-r">
        <XInput
          title="账号"
          placeholder="请输入账号"
          v-model="account"
          :is-type="user_iconType"
          ref="refUser"
          @on-change="keyUser"
          required
        ></XInput>
        <XInput
          title="密码"
          type="password"
          placeholder="请输入密码"
          v-model="password"
          :is-type="pass_iconType"
          ref="refPass"
          @on-change="keyPass"
          required
        ></XInput>
      </Group>
      <XButton
        type="default"
        class="login"
        @click.native="handleLogin"
        :disabled="disabled"
      >登录</XButton>
    </div>
  </div>
</template>

<script>
  import { Group, XInput, XButton } from 'vux'
  import { userLogin } from "../api/api";
  import { setCookie } from "../utils/cookie";

  export default {
    name: "login",
    data() {
      return {
        images: {
          backgroundImage: "url(" + require("../../static/img/img1.jpg") + ") ",
          backgroundRepeat: "no-repeat",
          backgroundSize: "100%",
          width: "100%",
          height: "100%"
        },
        disabled: true,
        account: '',
        password:'',
        user_iconType: function (value) {
          return {
            valid: value.length >= 6,
            msg: '用户名长度不符',
          }
        },
        pass_iconType: function (value) {
          return {
            // 密码可以改用成正则表达式
            valid: value.length >= 6,
            msg: '密码长度不符',
          }
        },
      }
    },
    methods: {
      keyUser () {
        this.disabled = !(this.$refs.refUser.valid === true && this.$refs.refPass.valid === true && this.account !== '' && this.password !== '');
      },
      keyPass () {
        this.disabled = !(this.$refs.refUser.valid === true && this.$refs.refPass.valid === true && this.account !== '' && this.password !== '');
      },
      handleLogin () {
        userLogin({username: this.account, password: this.password}).then(res => {
          if (res.data.code !== 200) {
            // this.$vux.toast.show({
            //   text: 'text',
            // })
            this.$toast(res.data.message);
          } else {
            this.$router.push('/home');
            setCookie('shipId', res.data.data.shipId);
            setCookie('totalShip', res.data.data.totalShip);
          }
        });
      }
    },
    components: {
      Group,
      XInput,
      XButton,
    },
  }
</script>

<style scoped lang="less">
  @toast-content-font-size: orangered;

  .group {
    margin: 0 auto;
    padding-top: 50%;
    width: 80%;
  }
  .login {
    top: 10px;
  }
</style>
