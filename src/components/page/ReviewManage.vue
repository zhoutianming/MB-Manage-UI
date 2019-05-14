<template>
  <div class="table">
    <!-- 留言的评论内容 -->
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-copy"></i> 留言的评论管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" icon="delete" class="handle-del mr10" @click="deleteAll">批量删除</el-button>
        <el-select v-model="selectCate" placeholder="筛选条件" class="handle-select mr10">
          <el-option key="1" label="评论者" value="userName"></el-option>
          <el-option key="2" label="被评论的留言" value="reviewedContent"></el-option>
          <el-option key="3" label="评论内容" value="reviewContent"></el-option>
        </el-select>
        <el-input v-model="selectWord" placeholder="筛选关键词" class="handle-input mr10"></el-input>
        <el-button type="primary" icon="search" @click="search">搜索</el-button>
      </div>
      <el-table 
        :data="reviewData.slice((currentPage-1)*pageSize,currentPage*pageSize)" 
        border 
        class="table" 
        @selection-change="handleSelectionChange"
        :row-key="getRowKeys">
        <el-table-column type="selection" width="55" align="center" reserve-selection="true"></el-table-column>
        <el-table-column prop="userName" label="评论者" width="150"></el-table-column>
        <el-table-column prop="reviewedContent" label="被评论的留言" width="400"></el-table-column>
        <el-table-column prop="reviewContent" label="评论内容" width="415"></el-table-column>
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
          :total="reviewData.length">
        </el-pagination>
      </div>
    </div>
    <!-- 评论的评论内容 -->
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-copy"></i> 评论的评论管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <el-table 
        :data="remarkData" 
        border 
        class="table">
        <el-table-column prop="userName" label="评论者" width="150"></el-table-column>
        <el-table-column prop="reviewedContent" label="被评论的评论" width="400"></el-table-column>
        <el-table-column prop="reviewContent" label="评论内容" width="415"></el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 编辑弹出框 -->
    <el-dialog title="编辑" :visible.sync="editVisible" center style="text-align:center" width="40%">
      <el-form ref="form" :model="currentReview" label-width="80px">
        <el-form-item label="评论内容">
          <el-input 
            v-model="currentReview.reviewContent"
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
    <el-dialog title="提示" :visible.sync="delVisible" width="40%" center>
      <div class="del-dialog-cnt">删除该评论，所有相关评论都将删除，是否确定删除？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteRow">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {getAllMessageReview, getRemarkReview, editReview, deleteReview, deleteSomeReview, selectReview} from '@/api'

export default {
  name: 'basetable',
  data() {
    return {
      rowIndex: -1,
      currentReview: {},
      multipleSelection: [],
      selectCate: '',
      selectWord: '',
      editVisible: false,
      delVisible: false,
      reviewData: [],
      remarkData: [],
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
    // 获取评论数据
    getData() {
      getAllMessageReview().then((response) => {
        this.reviewData = response.data.data
      })
    },
    // 获取评论数据
    getRemarkReview (reviewDataList){
      getRemarkReview(reviewDataList).then((response) => {
        this.remarkData = response.data.data
      })
    },
    search() {
      var reviewData = {}
      this.$set(reviewData, this.selectCate, this.selectWord)
      selectReview(reviewData).then((response) => {
        if(response.data.code === 0){
          this.$message.error('未查到相关数据')
        } 
        this.reviewData = response.data.data
      })
    },
    handleEdit(index, row) {
      this.rowIndex = index
      this.currentReview = row
      this.editVisible = true
    },
    handleDelete(index, row) {
      this.rowIndex = index
      this.currentReview = row
      this.delVisible = true
    },
    handleEdit1(index, row) {
      this.rowIndex = index
      this.currentReview = row
      this.editVisible = true
    },
    handleDelete1(index, row) {
      this.rowIndex = index
      this.currentReview = row
      this.delVisible = true
    },
    deleteAll() {
      if (this.multipleSelection.length === 0) {
        this.$message.error('请勾选要删除的数据行!')
      } else {
        deleteSomeReview(this.multipleSelection).then((response) => {
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
      this.getRemarkReview(val)
    },
    // 保存编辑
    saveEdit() {
      editReview(this.currentReview).then((response) => {
        if (response.data.code === 1) {
          this.editVisible = false
          this.$message.success('修改成功!')
        }
      })
    },
    // 确定删除
    deleteRow(){
      deleteReview(this.currentReview).then((response) => {
        if (response.data.code === 1) {
          this.reviewData.splice(this.rowIndex, 1)
          this.$message.success('删除成功!')
          this.delVisible = false
        }
      })
    },
    getRowKeys(row){
  		return row.reviewId
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
