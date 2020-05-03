<template>
  <div>
    <!--面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>专家管理</el-breadcrumb-item>
      <el-breadcrumb-item>图书推荐管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card shadow="hover">
      <div>
        <el-row :gutter="20">
          <el-col :span="4">
            <div style="margin-top: 13px;">
              <el-button :type="showReviewed?'danger':'info'" @click="showReviewed = true">已审核书籍</el-button>
            </div>
          </el-col>
          <el-col :span="4">
            <div style="margin-top: 13px;">
              <el-button :type="!showReviewed?'danger':'info'" @click="showReviewed = false">未审核书籍</el-button>
            </div>
          </el-col>
        </el-row>
        <!--已审核书籍区域-->
        <div v-show="showReviewed">
          <el-table :data="recommendList" style="width: 100%" border stripe>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="username" label="推荐用户" width="180"></el-table-column>
            <el-table-column prop="bookname" label="书籍名称" width="180"></el-table-column>
            <el-table-column prop="reResult" label="审核结果">
              <template v-slot="scope">
                <span>{{scope.row.reResult == 0?'不通过':'通过'}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="exName" label="专家姓名"></el-table-column>
            <el-table-column prop="reOpinion" label="审核意见"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" v-show="!option" @click="pass(scope.row)">上架</el-button>
                <el-button type="primary" size="mini" v-show="!option" @click="noPass(scope.row)">下架</el-button>
                <el-button type="primary" size="mini" v-show="option" @click="read(scope.row)">阅读书籍</el-button>
                <el-button
                  type="primary"
                  size="mini"
                  v-show="option"
                  @click="reviewResult(scope.row)"
                >评判</el-button>
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
        <!--未审核书籍区域-->
        <div v-show="!showReviewed">
          <el-table :data="noReviewedList" border stripe>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="username" label="用户名"></el-table-column>
            <el-table-column prop="bookname" label="书名"></el-table-column>
            <el-table-column prop="bookauthor" label="作者"></el-table-column>
            <el-table-column prop="bookPress" label="出版社"></el-table-column>
            <el-table-column prop="pressTime" label="出版日期">
              <template slot-scope="scope">
              <p>{{scope.row.pressTime | formatDate}}</p>
            </template>
            </el-table-column>
            <el-table-column prop="shortIntro" label="简介"></el-table-column>
            <el-table-column prop="btName" label="类别"></el-table-column>
            <el-table-column prop="reReason" label="推荐理由"></el-table-column>
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
      </div>
    </el-card>
    <!--审核结果填写框-->
    <el-dialog
      title="审核结果及意见填写"
      :visible.sync="showUpdateDialog"
      width="30%"
      :before-close="handleUpdateClose"
    >
      <el-form :model="updateRecommendForm" ref="updaterUserForm" label-width="80px">
        <el-form-item label="读者id" disabled>
          <el-input v-model="updateRecommendForm.reReaderid" disabled></el-input>
        </el-form-item>
        <el-form-item label="书籍id" disabled>
          <el-input v-model="updateRecommendForm.reBookid" disabled></el-input>
        </el-form-item>
        <el-form-item label="审核结果">
          <el-select v-model="updateRecommendForm.reResult" placeholder="请选择审核结果">
            <el-option label="通过" :value="1"></el-option>
            <el-option label="不通过" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核意见" disabled>
          <el-input type="area" v-model="updateRecommendForm.reOpinion"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelUpdateUser">取 消</el-button>
        <el-button type="primary" @click="submitRecommend">确 认</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import dateFormat from "../../assets/js/Date";
export default {
  data() {
    return {
      noReviewedList:[],
      showReviewed: true,
      option: false,
      isReview: "success",
      param: {
        reStatus: 1,
        pageNum: 1,
        pageSize: 2
      },
      updateRecommendForm: {
        id: 0,
        reReaderid: "",
        reBookid: "",
        reResult: "",
        reExpertId: "",
        reOpinion: "",
        reStatus: "",
        type: 0
      },
      recommendList: [],
      total: 0,
      showUpdateDialog: false
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
    this.getRecommendList()
    this.getNoReviewed()
    
  },
  methods: {
    async getNoReviewed() {
      const {data:res} = await this.$http.get('/book/no_reviewed')
      if (res.statusCode !== 200) {
        return this.$message.error(res.message);
      }
      this.noReviewedList = res.data;
    },
    async submitRecommend() {
      this.updateRecommendForm.reStatus = 1;
      this.updateRecommendForm.reExpertId = JSON.parse(
        window.sessionStorage.getItem("user")
      ).id;
      const { data: res } = await this.$http.put(
        "/recommend",
        this.updateRecommendForm
      );
      if (res.statusCode !== 200) {
        return this.$message.error(res.message);
      }
      this.$message({
        type: "success",
        message: "已提交审核意见",
        duration: 2000
      });
      this.getRecommendList();
      this.showUpdateDialog = false;
    },
    async updateRecommend() {
      const { data: res } = await this.$http.put(
        `/book/book_shelves/${this.updateRecommendForm.id}/${this.updateRecommendForm.type}`
      );
      if (res.statusCode !== 200) {
        return this.$message.error(res.message);
      }
      this.$message({
        type: "success",
        message: "设置成功",
        duration: 2000
      });
      this.getRecommendList();
      this.showUpdateDialog = false;
    },
    cancelUpdateUser() {
      this.showUpdateDialog = false;
    },
    reviewResult(row) {
      this.showUpdateDialog = true;
      this.updateRecommendForm = row;
    },
    async read(row) {
      const { data: res } = await this.$http.get(`/book/${row.reBookid}`);
      if (res.statusCode !== 200) {
        return this.$message.error(res.message);
      }
      const url = res.data.bookUrl;
      console.log(res);
      window.open(url);
    },
    pass(row) {
      this.updateRecommendForm = row;
      this.updateRecommendForm.type = 0;
      this.updateRecommend();
      this.getRecommendList();
    },
    noPass(row) {
      this.updateRecommendForm = row;
      this.updateRecommendForm.type = 1;
      this.updateRecommend();
      this.getRecommendList();
    },
    showNoReviewRecommend() {
      this.isReview = "info";
      this.option = true;
      this.param.reStatus = 0;
      this.getRecommendList();
    },
    showReviewRecommend() {
      this.isReview = "success";
      this.option = false;
      this.param.reStatus = 1;
      this.getRecommendList();
    },
    async getRecommendList() {
      const param = this.param;
      const { data: res } = await this.$http.get(
        `/recommend/list/${param.reStatus}/${param.pageNum}/${param.pageSize}`
      );
      if (res.statusCode !== 200) {
        return this.$message.error(res.message);
      }
      this.recommendList = res.data.list;
      this.total = res.data.total;
    },
    handleSizeChange(size) {
      this.param.pageSize = size;
      this.getRecommendList();
    },
    handleCurrentChange(pageNo) {
      this.param.pageNum = pageNo;
      this.getRecommendList();
    },
    async deleteUser(id) {
      const { data: res } = await this.$http.delete(`/expert/${id}`);
      if (res.statusCode !== 200) {
        return this.$message.error(res.message);
      }
      this.$message({
        type: "success",
        message: "删除用户成功",
        duration: 2000
      });
      this.getRecommendList();
    },
    updateUserDialog(row) {
      this.updateRecommendForm = row;
      this.showUpdateDialog = true;
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