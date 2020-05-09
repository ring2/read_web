<template>
  <div>
    <!--面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>专家管理</el-breadcrumb-item>
      <el-breadcrumb-item>专家列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card shadow="hover">
      <div>
        <el-row :gutter="20">
          <el-col :span="4">
            <div style="margin-top: 13px;">
              <el-button :type="isReview==='info'?'success':'info'" @click="showReviewExpert">已审核的专家</el-button>
            </div>
          </el-col>
          <el-col :span="6">
            <div style="margin-top: 13px;">
              <el-button :type="isReview" @click="showNoReviewExpert">未审核的专家</el-button>
            </div>
          </el-col>
        </el-row>
        <!--用户列表区域-->
        <el-table :data="expertList" style="width: 100%" border stripe>
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column prop="exUsername" label="用户名" width="180"></el-table-column>
          <el-table-column prop="exName" label="姓名" width="180"></el-table-column>
          <el-table-column prop="exIdentity" label="身份证号"></el-table-column>
          <el-table-column prop="expertType" label="专家类别"></el-table-column>
          <el-table-column prop="companyAddress" label="工作单位"></el-table-column>
          <el-table-column prop="jobTitle" label="职称"></el-table-column>
          <el-table-column v-if="!option" prop="isReview" label="审核结果">
            <template slot-scope="scope">
              {{scope.row.isReview == 1?'审核通过':'审核未通过'}}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="220">
            <template slot-scope="scope">
              <el-button
                type="danger"
                size="mini"
                v-show="!option"
                @click="deleteExpert(scope.row)"
              >删除</el-button>
              <el-button type="primary" size="mini" v-show="option" @click="pass(scope.row)">通过审核</el-button>
              <el-button type="primary" size="mini" v-show="option" @click="noPass(scope.row)">审核不通过</el-button>
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
    <!--修改专家对话框-->
    <el-dialog
      title="设置专家类别"
      :visible.sync="showUpdateDialog"
      width="30%"
      :before-close="handleUpdateClose"
    >
      <el-form :model="updaterExpertForm" ref="updaterUserForm" label-width="80px">
        <el-form-item label="姓名" disabled>
          <el-input v-model="updaterExpertForm.exName" disabled></el-input>
        </el-form-item>
        <el-form-item label="专家类别">
          <el-select v-model="updaterExpertForm.exTypeId" placeholder="请选择专家类别">
            <el-option
              v-for="(item,index) in expertTypeList"
              :key="index"
              :label="item.etName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelUpdateUser">取 消</el-button>
        <el-button type="primary" @click="updateExpert">确 认</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      option: false,
      isReview: "success",
      param: {
        type: 1,
        pageNum: 1,
        pageSize: 2
      },
      updaterExpertForm: {
        id: 0,
        exName: "",
        exTypeId: "",
        isReview: ""
      },
      expertList: [],
      total: 0,
      showUpdateDialog: false,
      expertTypeList: []
    };
  },
  created() {
    this.getUserList();
    this.getExpertType();
  },
  methods: {
    async deleteExpert(expert) {
      const {data:res} = await this.$http.delete(`/expert/${expert.id}`)
      if (res.statusCode !== 200) {
        return this.$message.error(res.message)
      }
      this.$message.success("删除成功")
      this.getUserList();
    },
    async updateExpert() {
      const { data: res } = await this.$http.put(
        "/expert",
        this.updaterExpertForm
      );
      if (res.statusCode !== 200) {
        return this.$message.error(res.message);
      }
      this.$message({
        type: "success",
        message: "设置成功",
        duration: 2000
      });
      this.getUserList();
      this.showUpdateDialog = false;
    },
    cancelUpdateUser() {
      this.showUpdateDialog = false;
    },
    async getExpertType() {
      const { data: res } = await this.$http.get("/expert/expert_type");
      if (res.statusCode !== 200) {
        return this.$message.error(res.message);
      }
      this.expertTypeList = res.data;
    },
    pass(row) {
      this.updaterExpertForm = row;
      this.updaterExpertForm.isReview = 1;
      this.updateExpert();
      this.getUserList();
    },
    noPass(row) {
      this.updaterExpertForm = row;
      this.updaterExpertForm.isReview = 1;
      this.updateExpert();
      this.getUserList();
    },
    showNoReviewExpert() {
      this.isReview = "info";
      this.option = true;
      this.param.type = 3;
      this.getUserList();
    },
    showReviewExpert() {
      this.isReview = "success";
      this.option = false;
      this.param.type = 1;
      this.getUserList();
    },
    async getUserList() {
      const param = this.param;
      const { data: res } = await this.$http.get(
        `/expert/list/${param.type}/${param.pageNum}/${param.pageSize}`
      );
      if (res.statusCode !== 200) {
        return this.$message.error(res.message);
      }
      console.log(res.data);
      this.expertList = res.data.list;
      this.total = res.data.total;
    },
    handleSizeChange(size) {
      this.param.pageSize = size;
      this.getUserList();
    },
    handleCurrentChange(pageNo) {
      this.param.pageNum = pageNo;
      this.getUserList();
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
      this.getUserList();
    },
    updateUserDialog(row) {
      this.updaterExpertForm = row;
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