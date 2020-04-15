<template>
  <div>
    <!--面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>阅读排行榜</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card shadow="hover">
      <el-card class="box-card">
        <div slot="header" style="text-align: center;" class="clearfix">
          <span class="title">本月阅读排行前十榜</span>
        </div>
        <div
          v-for="(item,index) in rankList"
          :key="index"
          class="text item"
          style="text-align: left;"
        >{{index+1+'. '+item.bookname }}
        <span style="float:right;">📕：{{item.bookreadnum}}</span></div>
      </el-card>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      rankList: []
    };
  },
  created() {
    this.getReadRank();
  },
  methods: {
    async getReadRank() {
      const { data: res } = await this.$http.get("/rank/read");
      if (res.statusCode !== 200) {
        return this.$message.error(res.message);
      }
      this.rankList = res.data;
    }
  }
};
</script>
<style scoped>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  width: 250px;
  background-color: rgb(41, 238, 222);
}
.title {
  color: lightsalmon;
}
</style>