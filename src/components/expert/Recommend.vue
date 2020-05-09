<template>
  <div>
    <!--面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>专家中心</el-breadcrumb-item>
      <el-breadcrumb-item>推荐审核</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card shadow="hover">
      <div>
        <el-row :gutter="20">
          <el-col :span="4">
            <div style="margin-top: 13px;">
              <el-button
                :type="isReview==='danger'?'info':'danger'"
                @click="showReviewRecommend"
              >已审核的书籍</el-button>
            </div>
          </el-col>
          <el-col :span="6">
            <div style="margin-top: 13px;">
              <el-button :type="isReview" @click="showNoReviewRecommend">待审核的书籍</el-button>
            </div>
          </el-col>
        </el-row>
        <!--用户列表区域-->
        <div v-show="option">
          <el-table :data="recommendList" :style="option?'width: 100%':'width: 100%'" border stripe>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="username" label="推荐用户" ></el-table-column>
            <el-table-column prop="bookname" label="书籍名称"></el-table-column>
            <el-table-column prop="bookPress" label="出版社"></el-table-column>
            <el-table-column prop="pressTime" label="出版日期">
              <template slot-scope="scope">
                <p>{{scope.row.pressTime | formatDate}}</p>
              </template>
            </el-table-column>
            <el-table-column prop="shortIntro" label="简介"></el-table-column>
            <el-table-column prop="reReason" label="推荐理由"></el-table-column>
            <el-table-column prop="reResult" label="审核结果" v-if="!option">
              <template v-slot="scope">
                <span>{{scope.row.reResult == 0?'不通过':'通过'}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="reOpinion" label="审核意见" v-if="!option"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" v-show="option" @click="read(scope.row)">阅读书籍</el-button>
                <el-button
                  type="primary"
                  size="mini"
                  v-show="!option"
                  @click="updateRecommend1(scope.row)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  size="mini"
                  v-show="!option"
                  @click="delRecommend(scope.row)"
                >删除</el-button>
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
        <!--已审核通过-->
        <div v-show="!option">
          <el-tag class="eltag">审核通过:</el-tag>
          <el-table
            :data="yesRecommendList"
            :style="option?'width: 50%':'width: 100%'"
            border
            stripe
          >
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
            <el-table-column prop="bookreadnum" label="阅读量"></el-table-column>
            <el-table-column prop="reOpinion" label="审核意见"></el-table-column>
          </el-table>
          <!-- <div class="block">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="param.pageNum"
              :page-sizes="[1, 2, 5, 10]"
              :page-size="param.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
            ></el-pagination>
          </div>-->
        </div>
        <!--已审核未通过-->
        <div v-show="!option">
          <el-tag class="eltag">审核未通过:</el-tag>
          <el-table
            :data="noRecommendList"
            :style="option?'width: 50%':'width: 100%'"
            border
            stripe
          >
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="username" label="推荐用户"></el-table-column>
            <el-table-column prop="bookname" label="书名"></el-table-column>
            <el-table-column prop="bookauthor" label="作者"></el-table-column>
            <el-table-column prop="bookPress" label="出版社"></el-table-column>
            <el-table-column prop="pressTime" label="出版日期">
              <template slot-scope="scope">
                <p>{{scope.row.pressTime | formatDate}}</p>
              </template>
            </el-table-column>
            <el-table-column prop="shortIntro" label="简介"></el-table-column>
            <el-table-column prop="reOpinion" label="审核意见"></el-table-column>
            
          </el-table>
          <!-- <div class="block">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="param.pageNum"
              :page-sizes="[1, 2, 5, 10]"
              :page-size="param.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
            ></el-pagination>
          </div>-->
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
        <el-form-item label="推荐用户" disabled>
          <el-input v-model="updateRecommendForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="书籍名称" disabled>
          <el-input v-model="updateRecommendForm.bookname" disabled></el-input>
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
    <!--审核结果填写框-->
    <el-dialog
      title="修改"
      :visible.sync="showUpdateDialog1"
      width="30%"
      :before-close="handleUpdateClose1"
    >
      <el-form :model="updateRecommendForm1" ref="updaterUserForm1" label-width="80px">
        <el-form-item label="审核结果">
          <el-select v-model="updateRecommendForm1.reResult" placeholder="请选择审核结果">
            <el-option label="通过" :value="1"></el-option>
            <el-option label="不通过" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核意见" disabled>
          <el-input type="area" v-model="updateRecommendForm1.reOpinion"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelUpdateUser1">取 消</el-button>
        <el-button type="primary" @click="submitRecommend1">确 认</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import dateFormat from "../../assets/js/Date";
export default {
  data() {
    return {
      option: false,
      isReview: "info",
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
      updateRecommendForm1: {},
      recommendList: [],
      noRecommendList: [],
      yesRecommendList: [],
      total: 0,
      showUpdateDialog: false,
      showUpdateDialog1: false
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
    this.getRecommendList();
    this.getReviewedList();
  },
  methods: {
    async getReviewedList() {
      const user = JSON.parse(window.sessionStorage.getItem("user"));
      const { data: res } = await this.$http.get(
        `/recommend/reviewed/${user.id}`
      );
      if (res.statusCode !== 200) {
        return this.$message.error(res.message);
      }
      this.yesRecommendList = res.data.passBooks;
      this.noRecommendList = res.data.noPassBooks;
    },
    updateRecommend1(row) {
      this.showUpdateDialog1 = true;
      this.updateRecommendForm1 = row;
    },
    async delRecommend() {
      const { data: res } = await this.$http.delete(`/recommend/${id}`);
      if (res.statusCode !== 200) {
        return this.$message.error(res.message);
      }
      this.$message({
        type: "success",
        message: "删除成功",
        duration: 2000
      });
      this.getRecommendList();
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
      this.getReviewedList();
      this.$message({
        type: "success",
        message: "已提交审核意见",
        duration: 2000
      });
      this.getRecommendList();
      this.showUpdateDialog = false;
    },
    async submitRecommend1() {
      const { data: res } = await this.$http.put(
        "/recommend",
        this.updateRecommendForm1
      );
      if (res.statusCode !== 200) {
        return this.$message.error(res.message);
      }
      this.$message({
        type: "success",
        message: "修改成功",
        duration: 2000
      });
      this.getRecommendList();
      this.showUpdateDialog1 = false;
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
    cancelUpdateUser1() {
      this.showUpdateDialog1 = false;
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
      this.isReview = "danger";
      this.option = true;
      this.param.reStatus = 0;
      this.getRecommendList();
    },
    showReviewRecommend() {
      this.isReview = "info";
      this.option = false;
      this.param.reStatus = 1;
      this.getRecommendList();
    },
    async getRecommendList() {
      const param = this.param;
      const user = JSON.parse(window.sessionStorage.getItem("user"));
      const { data: res } = await this.$http.get(
        `/recommend/list/${param.reStatus}/${user.id}/${param.pageNum}/${param.pageSize}`
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
    },
    handleUpdateClose1() {
      this.$refs.updaterUserForm1.resetFields();
      this.showUpdateDialog1 = false;
    }
  }
};
</script>
<style scoped>
.eltag {
  margin-top: 15px;
}
</style>