<template>
  <div>
    <!--面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>书卷管理</el-breadcrumb-item>
      <el-breadcrumb-item>书卷列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card shadow="hover">
      <el-button type="primary" @click="updateaddDialog">添加书卷</el-button>
      <div>
        <!--书卷列表区域-->
        <el-table :data="bookTypeList" style="width: 100%" border stripe>
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column prop="btnName" label="书卷名称" width="180"></el-table-column>
          <el-table-column prop="btnNum" label="书卷数量" width="180"></el-table-column>
          <el-table-column prop="btnCredit" label="书卷所需积分" width="180"></el-table-column>
          <el-table-column prop="btnExplain" label="书卷说明" width="180"></el-table-column>
          <el-table-column prop="btnTime" label="书券有效期" width="180">
            <template slot-scope="scope">
              <p>{{scope.row.btnTime | formatDate}}</p>
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
        <el-form-item label="书卷名称">
          <el-input v-model="updaterBookTypeForm.btnName"></el-input>
        </el-form-item>
        <el-form-item label="书卷数量">
          <el-input v-model="updaterBookTypeForm.btnNum"></el-input>
        </el-form-item>
        <el-form-item label="书卷所需积分">
          <el-input v-model="updaterBookTypeForm.btnCredit"></el-input>
        </el-form-item>
        <el-form-item label="书卷说明">
          <el-input v-model="updaterBookTypeForm.btnExplain"></el-input>
        </el-form-item>
        <el-form-item label="书券有效期">
           <el-date-picker type="date" placeholder="选择日期" v-model="updaterBookTypeForm.btnTime" style="width: 100%;"></el-date-picker>
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
        <el-form-item label="书卷名称">
          <el-input v-model="addBookTypeForm.btnName"></el-input>
        </el-form-item>
        <el-form-item label="书卷数量">
          <el-input v-model="addBookTypeForm.btnNum"></el-input>
        </el-form-item>
        <el-form-item label="书卷所需积分">
          <el-input v-model="addBookTypeForm.btnCredit"></el-input>
        </el-form-item>
        <el-form-item label="书卷说明">
          <el-input v-model="addBookTypeForm.btnExplain"></el-input>
        </el-form-item>
        <el-form-item label="书券有效期">
           <el-date-picker type="date" placeholder="选择日期" v-model="addBookTypeForm.btnTime" style="width: 100%;"></el-date-picker>
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
        pageNum: 1,
        pageSize: 2
      },
      updaterBookTypeForm: {},
      addBookTypeForm: {
        btnName: "",
        btnCredit: "",
        btnStatus: "",
        btnTime: "",
        btnNum: "",
        btnExplain: ""
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
      const { data: res } = await this.$http.get(
        `/bookToken/list/${this.param.pageNum}/${this.param.pageSize}`
      );
      if (res.statusCode !== 200) {
        return this.$message.error(res.message);
      }
      this.bookTypeList = res.data.list;
      this.total = res.data.total;
    },
    async updateBookType() {
      const { data: res } = await this.$http.put(
        "/bookToken",
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
        "/bookToken",
        this.addBookTypeForm
      );
      if (res.statusCode !== 200) {
        return this.$message.error(res.message);
      }
      this.$message({
        type: "success",
        message: "添加成功",
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
      const { data: res } = await this.$http.delete(`/bookToken/${id}`);
      if (res.statusCode !== 200) {
        return this.$message.error(res.message);
      }
      this.$message({
        type: "success",
        message: "删除书卷成功",
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