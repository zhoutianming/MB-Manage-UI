<template>
  <div class="wrapper">
    <div class="header">
      <!-- 折叠按钮 -->
      <div class="collapse-btn" @click="collapseChage">
        <i class="el-icon-menu"></i>
      </div>
      <div class="logo">后台管理系统</div>
      <div class="header-right">
        <div class="header-user-con">
          <!-- 用户头像 -->
          <avatar style="margin-top:0px" :image="user.headImg" :size="40"></avatar>
          <!-- 用户名下拉菜单 -->
          <el-dropdown class="user-name" trigger="click" @command="handleCommand">
            <span class="el-dropdown-link">
              {{user.userName}} <i class="el-icon-caret-bottom"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item  command="loginout">退出登录</el-dropdown-item>
              <el-dropdown-item  command="editPassword">修改密码</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
    <v-sidebar></v-sidebar>
    <div class="content-box" :class="{'content-collapse':collapse}">
      <div class="content">
        <transition name="move" mode="out-in">
          <router-view></router-view>
        </transition>
      </div>
    </div>
    <el-dialog
      title="修改密码"
      :visible.sync="dialogVisible"
      :show-close="false"
      width="23%"
      center>
      <div style="">
        <el-input style="width:100%" type="password" placeholder="请输入旧密码" v-model="oldPassword" clearable></el-input>
        <br><br>
        <el-input style="width:100%" type="password" placeholder="请输入新密码"  v-model="newPassword1" clearable></el-input>
        <br><br>
        <el-input style="width:100%" type="password" placeholder="请再次输入新密码"  v-model="newPassword2" clearable></el-input>
        <hr style="margin-top:20px;width:99%;margin-bottom:-27px;">
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" style="width:45%">取 消</el-button>
        <el-button type="primary" @click="editPassword" style="background:#2886ff;width:45%">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import vSidebar from './Sidebar.vue'
import bus from './bus'
import {editPassword} from '@/api'

export default {
  components:{
    vSidebar
  },
  data(){
    return {
      tagsList: [],
      collapse: false,
      fullscreen: false,
      name: 'linxin',
      message: 2,
      dialogVisible: false,
      oldPassword: '',
      newPassword1: '',
      newPassword2: ''
    }
  },
  computed:{
    user () {
      return this.$store.getters.getUserData
    }
  },
  created(){
    bus.$on('collapse', msg => {
      this.collapse = msg;
    })
    // 只有在标签页列表里的页面才使用keep-alive，即关闭标签之后就不保存到内存中了。
    bus.$on('tags', msg => {
      let arr = [];
      for(let i = 0, len = msg.length; i < len; i ++){
        msg[i].name && arr.push(msg[i].name);
      }
      this.tagsList = arr;
    })
  },
  methods:{
    // 用户名下拉菜单选择事件
    handleCommand(command) {
      if(command == 'loginout'){
        localStorage.clear()
        this.$router.push('/login')
      }
      if(command == 'editPassword'){
        this.dialogVisible = true
      }
    },
    // 修改密码
    editPassword () {
      if (this.oldPassword === '') {
        this.$message({
          message: '请输入旧密码',
          type: 'error',
          center: true
        })
      } else if (this.newPassword1 === '') {
        this.$message({
          message: '请输入新密码',
          type: 'error',
          center: true
        })
      } else if (this.oldPassword === this.newPassword1) {
        this.$message({
          message: '输入的新旧密码相同!',
          type: 'warn',
          center: true
        })
      } else if (this.newPassword1 !== this.newPassword2) {
        this.$message({
          message: '请核对两次新密码',
          type: 'erorr',
          center: true
        })
      } else {
        var userVO = {}
        userVO.name = this.user.userName
        userVO.oldPassword = this.oldPassword
        userVO.newPassword = this.newPassword1
        editPassword(userVO).then(response => {
          if (response.data.code === 2) {
            this.$message({
              message: '输入的旧密码错误',
              type: 'error',
              center: true
            })
          } else if (response.data.code === 1) {
            this.$message({
              message: '修改成功',
              type: 'success',
              center: true
            })
            this.dialogVisible = false
          }
        })
      }
    },
    // 侧边栏折叠
    collapseChage(){
      this.collapse = !this.collapse;
      bus.$emit('collapse', this.collapse);
    }
  },
  mounted(){
    if(document.body.clientWidth < 1500){
      this.collapseChage()
    }
  }
}
</script>

<style scoped>
.header {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 70px;
  font-size: 22px;
  color: #fff;
}
.collapse-btn{
  float: left;
  padding: 0 21px;
  cursor: pointer;
  line-height: 70px;
}
.header .logo{
  float: left;
  width:250px;
  line-height: 70px;
}
.header-right{
  float: right;
  padding-right: 17px;
}
.header-user-con{
  display: flex;
  height: 70px;
  align-items: center;
}
.btn-fullscreen{
  transform: rotate(45deg);
  margin-right: 5px;
  font-size: 24px;
}
.btn-bell, .btn-fullscreen{
  position: relative;
  width: 30px;
  height: 30px;
  text-align: center;
  border-radius: 15px;
  cursor: pointer;
}
.btn-bell-badge{
  position: absolute;
  right: 0;
  top: -2px;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background: #f56c6c;
  color: #fff;
}
.btn-bell .el-icon-bell{
  color: #fff;
}
.user-name{
  margin-left: 10px;
}
.user-avator{
  margin-left: 20px;
}
.user-avator img{
  display: block;
  width:40px;
  height:40px;
  border-radius: 50%;
}
.el-dropdown-link{
  color: #fff;
  cursor: pointer;
}
.el-dropdown-menu__item{
  text-align: center;
}
</style>
