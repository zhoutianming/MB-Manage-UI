<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-copy"></i> 留言管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" icon="delete" class="handle-del mr10" @click="deleteAll">批量删除</el-button>
        <el-select v-model="selectCate" placeholder="筛选条件" class="handle-select mr10" @change="changeDiv">
          <el-option key="1" label="留言者" value="userName"></el-option>
          <el-option key="2" label="留言内容" value="messageContent"></el-option>
          <el-option key="3" label="留言时间" value="time"></el-option>
        </el-select>
        <!-- <el-date-picker v-show="!show" v-model="selectWord" type="datetime" placeholder="请选择日期时间" class="handle-input mr10"></el-date-picker> -->
        <el-date-picker v-show="!show" v-model="selectTime" type="datetimerange" value-format="yyyy-MM-dd HH:mm" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="center" style="margin-right:10px"></el-date-picker>        
        <el-input v-show="show" v-model="selectWord" placeholder="请输入关键词" class="handle-input mr10"></el-input>
        <el-button type="primary" icon="search" @click="search">搜索</el-button>
      </div>
      <el-table 
        :data="messageData.slice((currentPage-1)*pageSize,currentPage*pageSize)" 
        stripe 
        border 
        class="table" 
        ref="multipleTable" 
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="time" label="留言时间" sortable width="150"></el-table-column>
        <el-table-column prop="userName" label="留言者" width="120"></el-table-column>
        <el-table-column prop="messageContent" label="留言内容" width="395"></el-table-column>
        <el-table-column prop="messageImg" label="留言图片" width="300">
          <template slot-scope="scope">
            <a :href="scope.row.messageImg" target="_Blank">{{scope.row.messageImg}}</a>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
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
          :total="messageData.length">
        </el-pagination>
      </div>
    </div>
    <!-- 编辑弹出框 -->
    <el-dialog title="编辑" :visible.sync="editVisible" center style="text-align:center" width="40%">
      <el-form ref="form" :model="currentMessage" label-width="80px">
        <el-form-item label="留言内容">
          <el-input 
            v-model="currentMessage.messageContent"
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 10}"
            placeholder="请输入内容">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false" style="width:30%;margin-right:20px;">取 消</el-button>
        <el-button type="primary" @click="saveEdit" style="width:30%;margin-left:20px;">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 删除提示框 -->
    <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
      <div class="del-dialog-cnt">删除留言，所有该留言数据也将删除，是否确定删除？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteRow">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {getAllMessage, deleteMessageData, deleteSomeMessage, editMessageData, selectMessage} from '@/api'

export default {
  name: 'basetable',
  data() {
    return {
      rowIndex: -1,
      currentMessage: {},
      multipleSelection: [],
      selectCate: '',
      selectWord: '',
      selectTime: [],
      editVisible: false,
      delVisible: false,
      show: true,
      form: {
          name: '',
          date: '',
          address: ''
      },
      messageData: [],
      currentPage: 1,
      pageSize: 10
    }
  },
  created() {
    this.getData()
  },
  methods: {
    // 分页导航
    handleCurrentChange(val) {
      this.currentPage = val
    },
    // 获取留言数据
    getData() {
      var messageVO = {}
      getAllMessage(messageVO).then((response) => {
        this.messageData = response.data.data
      })
    },
    changeDiv () {
      this.selectWord = ''
      if(this.selectCate == 'time'){
        this.show = false
      } else {
        this.show = true
      }
    },
    search() {
      var messageVO = {}
      if(this.selectCate == 'userName' || this.selectCate == 'messageContent') {
        this.$set(messageVO, this.selectCate, this.selectWord)
      } else {
        this.$set(messageVO, 'startTime', this.selectTime[0])
        this.$set(messageVO, 'endTime', this.selectTime[1])
      }
      selectMessage(messageVO).then((response) => {
        if(response.data.code === 0){
            this.$message.error('未查到相关数据')
        } 
        this.messageData = response.data.data
      })
    },
    handleEdit(index, row) {
      this.rowIndex = index;
      this.currentMessage = row
      this.editVisible = true
    },
    handleDelete(index, row) {
      this.rowIndex = index
      this.currentMessage = row
      this.delVisible = true
    },
    deleteAll() {
      var messageVOList = []
      for (var j in this.multipleSelection) {
        var messageVO = {}
        messageVO.messageId = this.multipleSelection[j].messageId
        messageVOList.push(messageVO)
      }
      if (messageVOList.length === 0) {
        this.$message.error('请勾选要删除的数据行!')
      } else {
        deleteSomeMessage(messageVOList).then((response) => {
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
    // 保存编辑
    saveEdit() {
      editMessageData(this.currentMessage).then((response) => {
        if (response.data.code === 1) {
          this.editVisible = false
          this.$message.success('修改成功!')
        }
      })
    },
    // 确定删除
    deleteRow () {
      var messageVO = {}
      messageVO.messageId = this.currentMessage.messageId
      deleteMessageData(messageVO).then((response) => {
        if (response.data.code === 1) {
          this.messageData.splice(this.rowIndex, 1)
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
    }
    .red{
        color: #ff0000;
    }
    .mr10{
        margin-right: 10px;
    }
</style>
