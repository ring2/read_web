<template>
  <div>
    <!--面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>图书管理</el-breadcrumb-item>
      <el-breadcrumb-item>图书列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card shadow="hover">
      <div>
        <el-row :gutter="20">
          <el-col :span="8">
            <div style="margin-top: 13px;">
              <el-input
                placeholder="请输入书名"
                v-model="param.bookname"
                @keyup.enter.native="getBookListBySearch"
                clearable
                @clear="getBookList"
              >
                <el-button slot="append" icon="el-icon-search" @click="getBookListBySearch"></el-button>
              </el-input>
            </div>
          </el-col>
        </el-row>
        <!--图书列表区域-->
        <el-table :data="bookList" style="width: 100%" border stripe>
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column prop="bookname" label="书籍名称" width="180"></el-table-column>
          <el-table-column prop="bookauthor" label="作者" width="180"></el-table-column>
          <el-table-column prop="bookreadnum" label="阅读数量"></el-table-column>
          <el-table-column prop="bookcredit" label="兑换积分"></el-table-column>
          <el-table-column prop="btname" label="书籍类别"></el-table-column>
          <el-table-column prop="bookShelves" label="是否上架">
             <template v-slot="scope">
              <span>{{scope.row.bookShelves == 0?'未上架':'已上架'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="updateUserDialog(scope.$index, scope.row)"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="deleteBook(scope.row.id)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="param.pageNum"
            :page-sizes="[1, 2, 5, 10]"
            :page-size="param.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </el-card>
    <!--修改图书对话框-->
    <el-dialog
      title="设置专家类别"
      :visible.sync="showUpdateDialog"
      width="30%"
      :before-close="handleUpdateClose"
    >
      <el-form :model="updaterBookForm" ref="updaterUserForm" label-width="80px">
        <el-form-item label="书籍名称">
          <el-input v-model="updaterBookForm.bookname" ></el-input>
        </el-form-item>
        <el-form-item label="作者">
          <el-input v-model="updaterBookForm.bookauthor" ></el-input>
        </el-form-item>
        <el-form-item label="阅读数量">
          <el-input v-model="updaterBookForm.bookreadnum" ></el-input>
        </el-form-item>
        <el-form-item label="兑换积分">
          <el-input v-model="updaterBookForm.bookcredit" ></el-input>
        </el-form-item>
        <el-form-item label="书籍类别">
            <el-select v-model="updaterBookForm.bookTypeId" placeholder="请选择书籍类别">
            <el-option
              v-for="(item,index) in bookTypeList"
              :key="index"
              :label="item.btName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelUpdateUser">取 消</el-button>
        <el-button type="primary" @click="updateBook">确 认</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      param: {
        id:0,
        bookname: '',
        pageNum: 1,
        pageSize: 2
      },
      updaterBookForm: {},
      bookList: [],
      total: 0,
      showUpdateDialog: false,
      bookTypeList:[]
    };
  },
  created() {
    this.getBookList();
    this.getBookType()
  },
  methods: {
    async updateBook() {
      const { data: res } = await this.$http.put('/book',this.updaterBookForm)
      if (res.statusCode !== 200) {
        return this.$message.error(res.message);
      }
      this.getBookList()
       this.$message({
        type: "success",
        message: "更新书籍成功",
        duration: 2000
      });
      this.showUpdateDialog = false
    },
    async getBookType() {
      const { data: res } = await this.$http.get('/book/book_type')
      if (res.statusCode !== 200) {
        return this.$message.error(res.message);
      }
      this.bookTypeList = res.data
    },
    async getBookList() {
      const param = this.param;
      if(param.bookname==''){
        param.bookname = ' '
      }
      const { data: res } = await this.$http.get(
        `/book/list/${param.bookname}/${param.pageNum}/${param.pageSize}`
      );
      if (res.statusCode !== 200) {
        return this.$message.error(res.message);
      }
      console.log(res.data)
      this.bookList = res.data.list
      this.total = res.data.total
    },
    getBookListBySearch() {
      this.getBookList()
    },
    handleSizeChange(size) {
      this.param.pageSize = size;
      this.getBookList();
    },
    handleCurrentChange(pageNo) {
      this.param.pageNum = pageNo;
      this.getBookList();
    },
    async deleteBook(id) {
      const {data:res} = await this.$http.delete(`/book/${id}`)
      if (res.statusCode !== 200) {
        return this.$message.error(res.message);
      }
       this.$message({
        type: "success",
        message: "删除书籍成功",
        duration: 2000
      });
      this.getBookList()
    },
    updateUserDialog(index, row) {
      this.updaterBookForm = row;
      this.showUpdateDialog = true;
    },
    cancelUpdateUser() {
      this.showUpdateDialog = false;
    },
    handleUpdateClose() {
      this.$refs.updaterUserForm.resetFields();
      this.showUpdateDialog = false;
    }
  
  }
};
</script>
<style scoped>
</style>