<template>
  <div>
    <!--面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>问卷调查</el-breadcrumb-item>
      <el-breadcrumb-item>问卷管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card shadow="hover">
      <el-button type="primary" @click="showDialog">发布问卷</el-button>
      <h3>#历史问卷及结果：</h3>
      <div v-for="(item,index) in result" :key="index">
        <h4>{{item.title}}</h4>
        <el-table
          height="150"
          :data="item.answer"
          style="width: 100%"
          :row-class-name="tableRowClassName"
        >
          <el-table-column type="index" width="50" label="#"></el-table-column>
          <el-table-column prop="username" label="用户名" width="180"></el-table-column>
          <el-table-column prop="content" label="回答内容" width="380"></el-table-column>
        </el-table>
      </div>
    </el-card>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <el-form ref="form" :model="newInvestigate" label-width="80px">
        <el-form-item label="问卷标题">
          <el-input v-model="newInvestigate.title"></el-input>
        </el-form-item>
        <el-form-item label="问卷问题">
          <el-input v-model="newInvestigate.question"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="postInvestigate" >发 布</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      result: [],
      dialogVisible: false,
      newInvestigate: {
        title: "",
        question: ""
      }
    };
  },
  created() {
    this.getSituation();
  },
  methods: {
    async getSituation() {
      const { data: res } = await this.$http.get("/investigate/situation");
      if (res.statusCode !== 200) {
        return this.$message.error(res.message);
      }
      this.result = res.data.data;
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 1) {
        return "warning-row";
      } else if (rowIndex === 3) {
        return "success-row";
      }
      return "";
    },
    showDialog() {
        this.dialogVisible = true
    },
    async postInvestigate() {
        const { data: res } = await this.$http.post("/investigate",this.newInvestigate);
      if (res.statusCode !== 200) {
        return this.$message.error(res.message);
      }
      this.getSituation()
      this.dialogVisible = false
      this.$refs.form.resetFields()
      this.$message.success("发布成功!")
    }
  }
};
</script>
<style scoped>
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>