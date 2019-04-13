<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">后台管理系统</div>
      <el-form label-width="0px" class="ms-content">
        <el-form-item prop="username">
          <el-input v-model="userName" placeholder="账户名">
            <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" placeholder="密码" v-model="password">
            <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
          </el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="adminLogin">登录</el-button>
        </div>
        <p class="login-tips">Tips : 管理员登录</p>
      </el-form>
    </div>
  </div>
</template>

<script>
import {login} from '@/api'

export default {
  data: function(){
    return {
      userName: '',
      password: ''
    }
  },
  methods: {
    adminLogin () {
      if (this.userName === '' || this.password === '') {
        this.$message({
          message: '请输入管理账号或密码',
          type: 'warning',
          center: true
        })
      } else {
        var userVo = {
          'name': this.userName,
          'password': this.password
        }
        /* 接口请求 */
        login(userVo).then((response) => {
          /* 接口的传值是(-1,该用户不存在),(-2,密码输入错误),(1,登录成功) */
          if (response.data.code === -1) {
            this.$message({
              message: '该账号不存在!',
              type: 'error',
              center: true
            })
          } else if (response.data.code === -2) {
            this.$message({
              message: '密码输入错误!',
              type: 'error',
              center: true
            })
          } else if (response.data.code === 1) {
            this.$message({
              message: '非管理账户!',
              type: 'error',
              center: true
            })
          } else {
            this.$message({
              message: '登录成功!',
              type: 'success',
              center: true
            })
            localStorage.setItem('userName', this.userName)
            this.$store.commit('setUserData', response.data.data)
            setTimeout(function () {
              this.$router.push({path: '/user'})
            }.bind(this), 500)
            this.userName = ''
            this.password = ''
          }
        })
      }
    },
  }
}
</script>

<style scoped>
.login-wrap{
  position: relative;
  width:100%;
  height:100%;
  background-image: url(../../assets/img/login-bg.jpg);
  background-size: 100%;
}
.ms-title{
  width:100%;
  line-height: 50px;
  text-align: center;
  font-size:20px;
  color: #fff;
  border-bottom: 1px solid #ddd;
  background: #c5d2c5
}
.ms-login{
  position: absolute;
  left:50%;
  top:50%;
  width:350px;
  margin:-190px 0 0 -175px;
  border-radius: 5px;
  background: rgba(255,255,255, 0.3);
  overflow: hidden;
}
.ms-content{
  padding: 30px 30px;
}
.login-btn{
  text-align: center;
}
.login-btn button{
  width:100%;
  height:36px;
  margin-bottom: 10px;
}
.login-tips{
  font-size:12px;
  line-height:30px;
  color:#fff;
}
</style>