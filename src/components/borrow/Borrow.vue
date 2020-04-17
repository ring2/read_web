<template>
  <div>
    <!--面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>借阅管理</el-breadcrumb-item>
      <el-breadcrumb-item>读者借阅列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card shadow="hover">
      <div>
        <el-form ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="筛选条件" prop="resource">
            <el-radio-group v-model="param.condition">
              <el-radio label="借阅中"></el-radio>
              <el-radio label="按期归还"></el-radio>
              <el-radio label="超期归还"></el-radio>
              <el-radio label="未归还"></el-radio>
            </el-radio-group>
          </el-form-item>
          <span>
            <el-button type="primary" size="mini" @click="getBorrowList" style="margin-left:50px">筛选</el-button>
          </span>
        </el-form>

        <!--用户列表区域-->
        <el-table :data="borrowList" style="width: 100%" border stripe>
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column prop="bwBookid" label="图书编号" width="180"></el-table-column>
          <el-table-column prop="bwReaderid" label="读者编号" width="180"></el-table-column>
          <el-table-column prop="bwOuttime" label="借出日期">
            <template slot-scope="scope">
              <p>{{scope.row.bwOuttime | formatDate}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="bwEndtime" label="到期日期">
            <template slot-scope="scope">
              <p>{{scope.row.bwEndtime | formatDate}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="bwBacktime" label="归还日期">
            <template slot-scope="scope">
              <p>{{scope.row.bwBacktime | formatDate}}</p>
            </template>
          </el-table-column>
        </el-table>
        <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="param.pageNo"
            :page-sizes="[1, 2, 5, 10]"
            :page-size="param.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
import dateFormat from "../../assets/js/Date";
export default {
  data() {
    return {
      param: {
        condition: "借阅中",
        pageNum: 1,
        pageSize: 2
      },
      updaterUserForm: {},
      borrowList: [],
      total: 0,
      showUpdateDialog: false
    };
  },
  created() {
    this.getBorrowList();
  },
  filters: {
    formatDate(time) {
      if (time) {
        let date = new Date(time);
        return dateFormat.formatDate(date, "yyyy.MM.dd");
      }
    }
  },
  methods: {
    noticeUser() {
      this.$message({
        type: "info",
        message: "功能正在努力开发中",
        duration: 2000
      });
    },
    async getBorrowList() {
      const param = this.param;
      const { data: res } = await this.$http.get(
        `/borrow/borrow_situation/${param.condition}/${param.pageNum}/${param.pageSize}`
      );
      if (res.statusCode !== 200) {
        return this.$message.error(res.message);
      }
      this.borrowList = res.data.list;
      this.total = res.data.total;
    },
    handleSizeChange(size) {
      this.param.pageSize = size;
      this.getBorrowList();
    },
    handleCurrentChange(pageNo) {
      this.param.pageNum = pageNo;
      this.getBorrowList();
    },
    async deleteUser(id) {},
    updateUserDialog(index, row) {
      this.updaterUserForm = row;
      this.showUpdateDialog = true;
    }
  }
};
</script>
<style scoped>
</style>