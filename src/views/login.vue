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
        style="border-radius: 99px"
        :gradients="['#64bcd5', '#364a9b']"
        @click.native="handleLogin"
        :disabled="disabled"
        v-model="data"
      >开 始 使 用</XButton>
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
        data: '',
        images: {
          backgroundImage: "url(" + require("../../static/img/login/back.png") + ") ",
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
            // this.$toast();
            this.$toast(res.data.message);
          } else {//当登录成功的时候，还需要将store中的变量初始化一下。
           /* this.$store.commit('curr_state',new Array(res.data.data.totalShip));
            this.$store.commit('curr_lat',new Array(res.data.data.totalShip));
            this.$store.commit('curr_lng',new Array(res.data.data.totalShip));
            this.$store.commit('curr_yaw',new Array(res.data.data.totalShip));
            this.$store.commit('curr_percen',new Array(res.data.data.totalShip));
            this.$store.commit('rame_time',new Array(res.data.data.totalShip));
            this.$store.commit('curr_battle',new Array(res.data.data.totalShip));
            this.$store.commit('curr_speed',new Array(res.data.data.totalShip));*/

            setCookie('AppCookieToken', res.data.data.token);
            this.$store.commit('cookie', true);
            this.$router.push('/home');

            setCookie('account',this.account);
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

<style lang="less">
  @toast-content-font-size: orangered;

  .group {
    margin: 0 auto;
    padding-top: 50%;
    width: 80%;
  }
  .login {
    top: 25px;
  }
  .group .weui-cells {
    margin-top: 0.5em;
    font-size: 15px;
  }
</style>
