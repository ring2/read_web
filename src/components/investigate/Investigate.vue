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
      <el-row>
        <h3 style="text-align:center;">#历史问卷及结果：</h3>
        <el-col :span="12">
          <div v-for="(item,index) in result" :key="index">
            <h4>{{item.title}}</h4>
            <el-table
              height="150"
              :data="item.answer"
              style="width: 85%"
              :row-class-name="tableRowClassName"
            >
              <el-table-column type="index" width="50" label="#"></el-table-column>
              <el-table-column prop="username" label="用户名" width="180"></el-table-column>
              <el-table-column prop="content" label="回答内容" width="300"></el-table-column>
            </el-table>
          </div>
        </el-col>

        <el-col :span="12">
          <div v-for="(item,index) in result1" :key="index">
              <h4>{{item.question}}</h4>
              <span>🔍：该问卷一共{{item.peopleNum}}人参与，平均分：{{item.avg}},最高分：{{item.max}},最低分：{{item.min}}</span>
          </div>
        </el-col>
      </el-row>
    </el-card>
    <el-dialog title="发布问卷" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <el-form ref="form" :model="newInvestigate" label-width="80px">
        <el-form-item label="问卷标题">
          <el-input v-model="newInvestigate.title"></el-input>
        </el-form-item>
        <el-form-item label="问卷问题">
          <el-input v-model="newInvestigate.question"></el-input>
        </el-form-item>
        <el-form-item label="问题类型">
          <el-radio-group v-model="newInvestigate.questionType">
            <el-radio label="问答题"></el-radio>
            <el-radio label="单选题(1-5分进行选择）"></el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose1">取 消</el-button>
        <el-button type="primary" @click="postInvestigate">发 布</el-button>
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
        question: "",
        questionType: "问答题"
      },
      result1:[]
    };
  },
  created() {
    this.getSituation();
    this.getSituation1();
  },
  methods: {
    handleClose1() {
      this.dialogVisible = false;
      this.newInvestigate = {
        title: "",
        question: "",
        questionType: "问答题"
      };
    },
    async getSituation() {
      const { data: res } = await this.$http.get("/investigate/situation");
      if (res.statusCode !== 200) {
        return this.$message.error(res.message);
      }
      this.result = res.data.data;
    },
    async getSituation1() {
      const { data: res } = await this.$http.get("/investigate/situation1");
      if (res.statusCode !== 200) {
        return this.$message.error(res.message);
      }
      this.result1 = res.data;
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
      this.dialogVisible = true;
    },
    async postInvestigate() {
      const { data: res } = await this.$http.post(
        "/investigate",
        this.newInvestigate
      );
      if (res.statusCode !== 200) {
        return this.$message.error(res.message);
      }
      this.getSituation();
      this.dialogVisible = false;
      this.$refs.form.resetFields();
      this.$message.success("发布成功!");
    },
    handleClose() {
      this.dialogVisible = false;
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