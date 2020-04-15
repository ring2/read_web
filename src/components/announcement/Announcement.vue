<template>
  <div>
    <!--面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>公告管理</el-breadcrumb-item>
      <el-breadcrumb-item>公告列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card shadow="hover">
      <el-button type="primary" @click="updateaddDialog">发布公告</el-button>
      <div>
        <!--图书类别列表区域-->
        <el-table :data="bookTypeList" style="width: 100%" border stripe>
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column prop="annoTitle" label="公告标题" width="180"></el-table-column>
          <el-table-column prop="annoContent" label="公告内容" width="180"></el-table-column>
          <el-table-column prop="annoPublishtime" label="发布时间" width="180">
            <template slot-scope="scope">
              <p>{{scope.row.annoPublishtime | formatDate}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="annoCancel" label="是否撤销" width="180"></el-table-column>
          <el-table-column prop="annoCanceltime" label="撤销时间" width="180">
            <template slot-scope="scope">
              <p>{{scope.row.annoCanceltime | formatDate}}</p>
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
                @click="deleteBookType(scope.row.id)"
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
    <!--修改公告对话框-->
    <el-dialog
      title="修改公告信息"
      :visible.sync="showUpdateDialog"
      width="30%"
      :before-close="handleUpdateClose"
    >
      <el-form :model="updaterBookTypeForm" ref="updaterBookForm1" label-width="80px">
        <el-form-item label="id" disabled>
          <el-input v-model="updaterBookTypeForm.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="公告名称">
          <el-input v-model="updaterBookTypeForm.annoTitle"></el-input>
        </el-form-item>
        <el-form-item label="公告内容">
          <el-input v-model="updaterBookTypeForm.annoContent"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelUpdateUser">取 消</el-button>
        <el-button type="primary" @click="updateBookType">确 认</el-button>
      </span>
    </el-dialog>
    <!--添加公告对话框-->
    <el-dialog
      title="发布新公告"
      :visible.sync="showaddDialog"
      width="30%"
      :before-close="handleaddClose"
    >
      <el-form :model="addBookTypeForm" ref="addBookForm" label-width="80px">
        <el-form-item label="公告名称">
          <el-input v-model="addBookTypeForm.annoTitle"></el-input>
        </el-form-item>
        <el-form-item label="公告内容">
          <el-input v-model="addBookTypeForm.annoContent"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="canceladdUser">取 消</el-button>
        <el-button type="primary" @click="addBookType">发 布</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import dateFormat from "../../assets/js/Date";
export default {
  data() {
    return {
      param: {
        title:'',
        pageNum: 1,
        pageSize: 2
      },
      updaterBookTypeForm: {},
      addBookTypeForm: {
        annoTitle:'',
        annoContent:'',
      },
      bookTypeList: [],
      total: 0,
      showUpdateDialog: false,
      showaddDialog: false
    };
  },
  filters: {
    formatDate(time) {
      if (time) {
        let date = new Date(time);
        return dateFormat.formatDate(date, "yyyy.MM.dd");
      }
    }
  },
  created() {
    this.getBookTypeList();
  },
  methods: {
    async getBookTypeList() {
      const param = this.param;
      if(param.title==''){
        param.title = ' '
      }
      const { data: res } = await this.$http.get(
        `/announce/list/${this.param.title}/${this.param.pageNum}/${this.param.pageSize}`
      );
      if (res.statusCode !== 200) {
        return this.$message.error(res.message);
      }
      this.bookTypeList = res.data.list;
      this.total = res.data.total;
    },
    async updateBookType() {
      const { data: res } = await this.$http.put(
        "/announce",
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
        "/announce",
        this.addBookTypeForm
      );
      if (res.statusCode !== 200) {
        return this.$message.error(res.message);
      }
      this.$message({
        type: "success",
        message: "发布成功",
        duration: 2000
      });
      this.getBookTypeList();
      this.showaddDialog = false;
    },
    handleSizeChange(size) {
      this.param.pageSize = size;
      this.getBookTypeList();
    },
    handleCurrentChange(pageNo) {
      this.param.pageNum = pageNo;
      this.getBookTypeList();
    },
    async deleteBookType(id) {
      const { data: res } = await this.$http.delete(`/announce/${id}`);
      if (res.statusCode !== 200) {
        return this.$message.error(res.message);
      }
      this.$message({
        type: "success",
        message: "删除公告成功",
        duration: 2000
      });
      this.getBookTypeList();
    },
    updateUserDialog(index, row) {
      this.updaterBookTypeForm = row;
      this.showUpdateDialog = true;
    },
    handleUpdateClose() {
      this.$refs.updaterBookForm1.resetFields();  
      this.showUpdateDialog = false;
    },
    cancelUpdateUser() {
      this.$refs.updaterBookForm1.resetFields();
      this.showUpdateDialog = false;     
    },
    updateaddDialog() {
      this.showaddDialog = true;
    },
    handleaddClose() {
      this.$refs.addBookForm.resetFields();  
      this.showaddDialog = false;
    },
    canceladdUser() {
      this.$refs.addBookForm.resetFields();
      this.showaddDialog = false;     
    }

  }
};
</script>
<style scoped>
</style>