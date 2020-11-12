<template>
  <div class="login-container">
    <div
      v-if="ifIE"
      class="login-form"
      style="text-align: center"
    >
      您使用的是IE系列浏览器,无法使用本网站,请使用谷歌Chrome或火狐Firefox浏览器
    </div>
    <el-form
      v-else
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      autocomplete="on"
      label-position="left"
    >
      <div
        class="title-container"
        style="display: flex;align-items: center;"
      >
        <h3 class="title">
          {{ $t('login.title') }}
        </h3>
<!--        <el-tooltip-->
<!--          class="item"-->
<!--          effect="dark"-->
<!--          :content="!dingdingImg?'用户名登陆':'扫码登陆'"-->
<!--          placement="top-start"-->
<!--        >-->
<!--          <svg-icon-->
<!--            :name="!dingdingImg? 'user':'scan'"-->
<!--            style="color: #4AB7BD"-->
<!--            @click="changeLoginType"-->
<!--          />-->
<!--        </el-tooltip>-->
      </div>

      <div
        v-show="dingdingImg"
        style="text-align: center;"
      >
        <img
          style="width: 200px"
          :src="qrcode.img"
        >
      </div>
      <div
        v-show="!dingdingImg"
      >
        <el-form-item
          prop="username"
        >
          <span class="svg-container">
            <svg-icon name="user" />
          </span>
          <el-input
            ref="username"
            v-model="loginForm.username"
            :placeholder="$t('login.username')"
            name="username"
            type="text"
            autocomplete="on"
          />
        </el-form-item>

        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon name="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            :placeholder="$t('login.password')"
            name="password"
            autocomplete="on"
            @keyup.enter.native="handleLogin"
          />
          <span
            class="show-pwd"
            @click="showPwd"
          >
            <svg-icon :name="passwordType === 'password' ? 'eye-off' : 'eye-on'" />
          </span>
        </el-form-item>
        <!--        <el-form-item prop="captcha">-->
        <!--          <span class="svg-container">-->
        <!--            <svg-icon name="yzm" />-->
        <!--          </span>-->
        <!--          <el-input-->
        <!--            v-model="loginForm.captcha"-->
        <!--            placeholder="验证码"-->
        <!--            type="text"-->
        <!--            autocomplete="on"-->
        <!--            @keyup.enter.native="handleLogin"-->
        <!--          />-->

        <!--          <span-->
        <!--            class="show-pwd"-->
        <!--          >-->
        <!--            <img-->
        <!--              style="width: 100px"-->
        <!--              :src="captcha"-->
        <!--              @click="getCaptcha"-->
        <!--            >-->
        <!--          </span>-->
        <!--        </el-form-item>-->
        <el-form-item
          v-show="false"
          prop="c_id"
        >
          <el-input
            v-model="loginForm.c_id"
            type="text"
          />
        </el-form-item>
        <div>
          <el-button
            v-loading="loading"
            :loading="loading"
            type="success"
            :disabled="ifIE"
            style="width:45%; margin-bottom:30px;"
            @click.native.prevent="handleReg"
          >
            注册
          </el-button>
          <el-button
            v-loading="loading"
            :loading="loading"
            type="primary"
            :disabled="ifIE"
            style="width:45%; margin-bottom:30px;"
            @click.native.prevent="handleLogin"
          >
            {{ $t('login.logIn') }}
          </el-button>
        </div>
      </div>

      <div
        v-if="ifIE"
        style="text-align: center"
      >
        您使用的是IE系列浏览器,无法使用本网站,请使用谷歌Chrome或火狐Firefox浏览器
      </div>
    </el-form>

    <el-dialog
      :title="$t('login.thirdparty')"
      :visible.sync="showDialog"
    >
      {{ $t('login.thirdpartyTips') }}
      <br>
      <br>
      <br>
      <social-sign />
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { Route } from 'vue-router'
import { Form as ElForm, Input } from 'element-ui'
import { UserModule } from '@/store/modules/user'
import { isValidUsername } from '@/utils/validate'
import LangSelect from '@/components/LangSelect/index.vue'
import { goHome, setAllDict, setToken } from '@/utils/auth'
import request from '@/utils/request.ts'
import { getAllDict } from '@/api/system/dictionary'
import { Dictionary } from 'vue-router/types/router'
import { register } from '@/api/users'

@Component({
  name: 'Login',
  components: {
    LangSelect
  }
})
export default class extends Vue {
  private validateUsername = (rule: any, value: string, callback: Function) => {
    if (!isValidUsername(value)) {
      callback(new Error('请输入正确的用户名'))
    } else {
      callback()
    }
  }
  private dingdingImg:boolean = false
  private validatePassword = (rule: any, value: string, callback: Function) => {
    if (value.length < 3) {
      callback(new Error('密码不能小于5位'))
    } else {
      callback()
    }
  }
  private loginForm = {
    username: '',
    password: '',
    captcha: '',
    c_id: ''
  }
  private loginRules = {
    username: [{ validator: this.validateUsername, trigger: 'blur' }],
    password: [{ validator: this.validatePassword, trigger: 'blur' }]
  }
  private passwordType = 'password'
  private loading = false
  private showDialog = false
  private redirect?: string
  private otherQuery: Dictionary<string> = {}
  private ifIE:boolean = false
  private captcha:string = ''
  private cId:string = ''
  private qrcode:{img:string, uuid:string} = { img: '', uuid: '' }
  private qrcodeInterval:any = null

  @Watch('$route', { immediate: true })
  private onRouteChange(route: Route) {
    // TODO: remove the "as Dictionary<string>" hack after v4 release for vue-router
    // See https://github.com/vuejs/vue-router/pull/2050 for details
    const query = route.query as Dictionary<string>
    if (query) {
      this.redirect = query.redirect
      this.otherQuery = this.getOtherQuery(query)
    }
  }
  private getQRcode() {
    request({
      url: `/user/login_by_qrcode`,
      method: 'get'
    }).then((res:any) => {
      this.qrcode = res.data
    })
  }
  changeLoginType() {
    this.dingdingImg = !this.dingdingImg
    if (!this.dingdingImg) {
      clearInterval(this.qrcodeInterval)
      this.qrcodeInterval = null
    }
    if (this.dingdingImg && !this.qrcodeInterval) {
      this.loginQRcode()
      this.qrcodeInterval = setInterval(() => {
        this.loginQRcode()
      }, 3000)
    }
  }
  private loginQRcode() {
    request({
      url: `/user/login_by_qrcode`,
      method: 'post',
      data: { uuid: this.qrcode.uuid }
    }).then((res:any) => {
      console.log(res)
      if (res.code === 293) {
        this.getQRcode()
      } else if (res.code === 200) {
        clearInterval(this.qrcodeInterval)
        setToken(res.data.token)
        getAllDict().then((ad) => {
          setAllDict('SYSTEM_DICTIONARY', ad.data)
          goHome()
        })
      }
    })
  }

  private getCaptcha() {
    request({
      url: `/tools/captcha`,
      method: 'get'
    }).then((res:any) => {
      this.captcha = res.data.captcha
      this.loginForm.c_id = res.data.c_id
    })
  }
  private checkBrowser() {
    var sBrowser; var sUsrAg = navigator.userAgent
    if (sUsrAg.indexOf('Firefox') > -1) {
      sBrowser = 'Mozilla Firefox'
      // "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:61.0) Gecko/20100101 Firefox/61.0"
    } else if (sUsrAg.indexOf('Opera') > -1 || sUsrAg.indexOf('OPR') > -1) {
      sBrowser = 'Opera'
      // "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 OPR/57.0.3098.106"
    } else if (sUsrAg.indexOf('Trident') > -1) {
      sBrowser = 'Microsoft Internet Explorer'
      this.ifIE = true
      // "Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; Zoom 3.6.0; wbx 1.0.0; rv:11.0) like Gecko"
    } else if (sUsrAg.indexOf('Edge') > -1) {
      sBrowser = 'Microsoft Edge'
      this.ifIE = true
      // "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299"
    } else if (sUsrAg.indexOf('Chrome') > -1) {
      sBrowser = 'Google Chrome or Chromium'
      // "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/66.0.3359.181 Chrome/66.0.3359.181 Safari/537.36"
    } else if (sUsrAg.indexOf('Safari') > -1) {
      sBrowser = 'Apple Safari'
      // "Mozilla/5.0 (iPhone; CPU iPhone OS 11_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.0 Mobile/15E148 Safari/604.1 980x1306"
    } else {
      sBrowser = 'unknown'
    }
  }

  mounted() {
    if (this.loginForm.username === '') {
      (this.$refs.username as Input).focus()
    } else if (this.loginForm.password === '') {
      (this.$refs.password as Input).focus()
    }
    this.checkBrowser()
    // this.getCaptcha()
    if (this.dingdingImg) {
      this.getQRcode()
      this.qrcodeInterval = setInterval(() => {
        this.loginQRcode()
      }, 3000)
    }
  }
  destroyed(): void {
    clearInterval(this.qrcodeInterval)
  }

  private showPwd() {
    if (this.passwordType === 'password') {
      this.passwordType = ''
    } else {
      this.passwordType = 'password'
    }
    this.$nextTick(() => {
      (this.$refs.password as Input).focus()
    })
  }

  public $refs!:any

  private handleReg() {
    this.$refs.loginForm.validate((valid: boolean) => {
      if (valid) {
        this.loading = true
        register(this.loginForm).then((res:any) => {
          console.log(res)
          this.$message.success('注册成功!')
        }).finally(() => {
          this.loading = false
        })
      } else {
        return false
      }
    })
  }

  private handleLogin() {
    this.$refs.loginForm.validate((valid: boolean) => {
      if (valid) {
        this.loading = true
        UserModule.Login(this.loginForm)
        this.loading = false
      } else {
        return false
      }
    })
  }

  private getOtherQuery(query: Dictionary<string>) {
    return Object.keys(query).reduce((acc, cur) => {
      if (cur !== 'redirect') {
        acc[cur] = query[cur]
      }
      return acc
    }, {} as Dictionary<string>)
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
// References: https://www.zhangxinxu.com/wordpress/2018/01/css-caret-color-first-line/
@supports (-webkit-mask: none) and (not (cater-color: $loginCursorColor)) {
  .login-container .el-input {
    input { color: $loginCursorColor; }
    input::first-line { color: $lightGray; }
  }
}

.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      height: 47px;
      background: transparent;
      border: 0px;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $lightGray;
      caret-color: $loginCursorColor;
      -webkit-appearance: none;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $loginBg inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
.login-container {
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-color: $loginBg;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $darkGray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $lightGray;
      margin: 40px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }

    .set-language {
      color: #fff;
      position: absolute;
      top: 3px;
      font-size: 18px;
      right: 0px;
      cursor: pointer;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $darkGray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
