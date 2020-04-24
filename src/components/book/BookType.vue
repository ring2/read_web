<template>
  <div>
    <!--面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>图书管理</el-breadcrumb-item>
      <el-breadcrumb-item>图书类别管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card shadow="hover">
      <el-button type="primary" @click="updateaddDialog">添加图书类别</el-button>
      <div>
        <!--图书类别列表区域-->
        <el-table :data="bookTypeList" style="width: 40%" border stripe>
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column prop="btName" label="类别名称" width="180"></el-table-column>
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
                @click="deleteBookType1(scope.row.id)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="block">
          <el-pagination
            @size-change="handleSizeChange1"
            @current-change="handleCurrentChange1"
            :current-page="param.pageNum"
            :page-sizes="[1, 2, 5, 10]"
            :page-size="param.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </el-card>
    <!--修改图书类别对话框-->
    <el-dialog
      title="修改类别名称"
      :visible.sync="showUpdateDialog"
      width="30%"
      :before-close="handleUpdateClose"
    >
      <el-form :model="updaterBookTypeForm" ref="updaterBookForm" label-width="80px">
        <el-form-item label="id" disabled>
          <el-input v-model="updaterBookTypeForm.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="类别名称">
          <el-input v-model="updaterBookTypeForm.btName"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelUpdateUser">取 消</el-button>
        <el-button type="primary" @click="updateBookType">确 认</el-button>
      </span>
    </el-dialog>
    <!--添加图书类别对话框-->
    <el-dialog
      title="添加类别名称"
      :visible.sync="showaddDialog"
      width="30%"
      :before-close="handleaddClose"
    >
      <el-form :model="addBookTypeForm" ref="addBookForm" label-width="80px">
        <el-form-item label="类别名称">
          <el-input v-model="addBookTypeForm.btName"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="canceladdUser">取 消</el-button>
        <el-button type="primary" @click="addBookType">确 认</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      param: {
        pageNum: 1,
        pageSize: 2
      },
      updaterBookTypeForm: {},
      addBookTypeForm: {
        btName:''
      },
      bookTypeList: [],
      total: 0,
      showUpdateDialog: false,
      showaddDialog: false
    };
  },
  created() {
    this.getBookTypeList();
  },
  methods: {
    async getBookTypeList() {
      const { data: res } = await this.$http.get(
        `/book/book_type/${this.param.pageNum}/${this.param.pageSize}`
      );
      if (res.statusCode !== 200) {
        return this.$message.error(res.message);
      }
      this.bookTypeList = res.data.list;
      this.total = res.data.total;
    },
    async updateBookType() {
      const { data: res } = await this.$http.put(
        "/book/book_type",
        this.updaterBookTypeForm
      );
      if (res.statusCode !== 200) {
        return this.$message.error(res.message);
      }
      this.$message({
        type: "success",
        message: "更新成功",
        duration: 2000
      });
      this.getBookTypeList();
      this.showUpdateDialog = false;
    },
    async addBookType() {
      const { data: res } = await this.$http.post(
        "/book/book_type",
        this.addBookTypeForm
      );
      if (res.statusCode !== 200) {
        return this.$message.error(res.message);
      }
      this.$message({
        type: "success",
        message: "新增成功",
        duration: 2000
      });
      this.getBookTypeList();
      this.showaddDialog = false;
    },
    handleSizeChange1(size) {
      this.param.pageSize = size;
      this.getBookTypeList();
    },
    handleCurrentChange1(pageNo) {
      this.param.pageNum = pageNo;
      this.getBookTypeList();
    },
    async deleteBookType1(id) {
      const { data: res } = await this.$http.delete(`/book/book_type/${id}`);
      if (res.statusCode !== 200) {
        return this.$message.error(res.message);
      }
      this.$message({
        type: "success",
        message: "删除图书类别成功",
        duration: 2000
      });
      this.getBookTypeList();
    },
    updateUserDialog(index, row) {
      this.updaterBookTypeForm = row;
      this.showUpdateDialog = true;
    },
    handleUpdateClose() {
      this.$refs.updaterBookForm.resetFields;  
      this.showUpdateDialog = false;
    },
    cancelUpdateUser() {
      this.$refs.updaterBookForm.resetFields;
      this.showUpdateDialog = false;     
    },
    updateaddDialog() {
      this.showaddDialog = true;
    },
    handleaddClose() {
      this.$refs.addBookTypeForm.resetFields;  
      this.showaddDialog = false;
    },
    canceladdUser() {
      this.$refs.addBookTypeForm.resetFields;
      this.showaddDialog = false;     
    }

  }
};
</script>
<style scoped>
</style>