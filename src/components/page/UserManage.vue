<template>
  <div class="table">
    <!-- 数据管理 -->
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 用户管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container" style="text-align:center">
      <div class="handle-box">
        <div style="float:right;margin-right:29%;text-align:center">
          <el-button type="primary" icon="delete" class="handle-del mr10" @click="deleteAll">批量删除</el-button>
          <el-select v-model="selectCate" placeholder="筛选条件" class="handle-select mr10" @change="changeDiv">
            <el-option key="1" label="用户名" value="userName"></el-option>
            <el-option key="2" label="用户级别" value="type"></el-option>
          </el-select>
          <el-input v-show="!showselect" v-model="selectWord" clearable placeholder="输入关键词" class="handle-input mr10"></el-input>
          <el-select v-show="showselect" v-model="selectWord" placeholder="选择权限" class="handle-input mr10">
            <el-option key="1" label="管理员" value="管理员"></el-option>
            <el-option key="2" label="普通用户" value="普通用户"></el-option>
          </el-select>
          <!-- <el-input  v-model="selectWord" placeholder="选择权限" class="handle-input mr10"></el-input> -->
          <el-button type="primary" icon="search" @click="search">搜索</el-button>
        </div>
      </div>
      <br><br>
      <el-table 
        style="margin-left:22%;width:55%" 
        :data="userDataList.slice((currentPage-1)*pageSize,currentPage*pageSize)" 
        stripe 
        border 
        class="table" 
        ref="multipleTable" 
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="userName" label="用户名" width="150"></el-table-column>
        <el-table-column prop="headImg" label="头像" width="76">
          <template slot-scope="scope">
            <avatar style="margin-top:0px" fullname="userName" :image="scope.row.headImg" :size="50"></avatar>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="权限级别" width="200">
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
            <template slot-scope="scope">
              <el-button style="" type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">权限设置</el-button>
              <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          :total="userDataList.length">
        </el-pagination>
      </div>
    </div>
    <!-- 编辑弹出框 -->
    <el-dialog title="提示" :visible.sync="editVisible" width="500px" center>
      <div class="del-dialog-cnt">是否确定将该用户设为{{userType}}?</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRow">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 删除提示框 -->
    <el-dialog title="提示" :visible.sync="delVisible" width="500px" center>
      <div class="del-dialog-cnt">删除用户，所有该用户的留言数据也将删除，是否确定删除？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteRow">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {queryAllUserData, deleteUserData, editUserType, deleteSomeUser, selectUser} from '@/api'

export default {
  name: 'basetable',
  data() {
    return {
        multipleSelection: [],
        showselect: false,
        selectCate: '',
        selectWord: '',
        editVisible: false,
        delVisible: false,
        rowIndex: -1,
        userType: '',
        currentUser: {},
        userDataList: [],
        currentPage: 1,
        pageSize: 10
    }
  },
  created() {
    this.getData()
  },
  computed: {
  },
  methods: {
    // 分页导航
    handleCurrentChange(val) {
      this.currentPage = val
    },
    // 获取全部用户数据
    getData() {
      queryAllUserData().then((response) => {
        this.userDataList = response.data.data
        for(var i in this.userDataList){
          if(this.userDataList[i].type === 2){
            this.userDataList[i].type = '管理员'
          } else {
            this.userDataList[i].type = '普通用户'
          }
        }
      })
    },
    changeDiv () {
      this.selectWord = ''
      if(this.selectCate == 'type'){
        this.showselect = true
      } else {
        this.showselect = false
      }
    },
    search() {
      var userData = {}
      if(this.selectCate == 'userName') {
        this.$set(userData, this.selectCate, this.selectWord)
      } else {
        if (this.selectWord == '管理员') {
          this.$set(userData, this.selectCate, 2)
        } else {
          this.$set(userData, this.selectCate, 1)
        }
      }
      selectUser(userData).then((response) => {
        this.userDataList = response.data.data
        for(var i in this.userDataList){
          if(this.userDataList[i].type === 2){
            this.userDataList[i].type = '管理员'
          } else {
            this.userDataList[i].type = '普通用户'
          }
        }
      })
    },
    handleEdit(index, row) {
      this.rowIndex = index
      this.currentUser = row
      if(row.type === '普通用户'){
        this.userType = '管理员'
      } else {
        this.userType = '普通用户'
      }
      this.editVisible = true
    },
    handleDelete(index, row) {
      this.rowIndex = index
      this.currentUser = row
      this.delVisible = true
    },
    deleteAll() {
      var userDataList = []
      for (var j in this.multipleSelection) {
        var user = {}
        user.id = this.multipleSelection[j].id
        userDataList.push(user)
      }
      if (userDataList.length === 0) {
        this.$message.error('请勾选要删除的数据行!')
      } else {
        deleteSomeUser(userDataList).then((response) => {
          if (response.data.code === 1) {
            this.$message.success('删除' + this.multipleSelection.length + '行数据成功！!')
            this.getData()
            this.multipleSelection = []
          }
        })
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 确定编辑
    editRow () {
      var userData = {}
      userData.id = this.currentUser.id
      userData.userName = this.currentUser.userName
      editUserType(userData).then((response) => {
        if (response.data.code === 1) {
          this.$message.success('权限修改成功!')
          this.getData()
          this.editVisible = false
        }
      })
    },
    // 确定删除
    deleteRow () {
      var userData = {}
      userData.id = this.currentUser.id
      deleteUserData(userData).then((response) => {
        if (response.data.code === 1) {
          this.userDataList.splice(this.rowIndex, 1)
          this.$message.success('删除成功!')
          this.delVisible = false
        }
      })
    }
  }
}
</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }
    .del-dialog-cnt{
        font-size: 16px;
        text-align: center
    }
    .table{
        width: 100%;
        font-size: 14px;
        text-align: center
    }
    .red{
        color: #ff0000;
    }
    .mr10{
        margin-right: 10px;
    }
</style>
