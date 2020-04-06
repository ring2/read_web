<template>
  <div>
    <!--面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>读者管理</el-breadcrumb-item>
      <el-breadcrumb-item>读者列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card shadow="hover">
      <div>
        <el-row :gutter="20">
          <el-col :span="8">
            <div style="margin-top: 13px;">
              <el-input
                placeholder="请输入用户名"
                v-model="param.username"
                @keyup.enter.native="getUserListBySearch"
                clearable
                @clear="getUserList"
              >
                <el-button slot="append" icon="el-icon-search" @click="getUserListBySearch"></el-button>
              </el-input>
            </div>
          </el-col>
        </el-row>
        <!--用户列表区域-->
        <el-table :data="userList" style="width: 100%" border stripe>
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column prop="username" label="用户名" width="180"></el-table-column>
          <el-table-column prop="usersex" label="性别" width="180"></el-table-column>
          <el-table-column prop="phone" label="电话号码"></el-table-column>
          <el-table-column prop="credit" label="用户积分"></el-table-column>
          <el-table-column prop="readid" label="阅读id"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="deleteUser(scope.row.userid)"
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
    
  </div>
</template>
<script>
export default {
  data() {
    return {
      param: {
        userid:0,
        username: '',
        pageNum: 1,
        pageSize: 2
      },
      updaterUserForm: {},
      userList: [],
      total: 0,
      showUpdateDialog: false
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    async getUserList() {
      const param = this.param;
      if(param.username==''){
        param.username = ' '
      }
      const { data: res } = await this.$http.get(
        `/user/list/${param.username}/${param.pageNum}/${param.pageSize}`
      );
      if (res.statusCode !== 200) {
        return this.$message.error(res.message);
      }
      console.log(res.data)
      this.userList = res.data.list
      this.total = res.data.total
    },
    getUserListBySearch() {
      this.getUserList()
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
      const {data:res} = await this.$http.delete(`/user/${id}`)
      if (res.statusCode !== 200) {
        return this.$message.error(res.message);
      }
       this.$message({
        type: "success",
        message: "删除用户成功",
        duration: 2000
      });
      this.getUserList()
    },
    updateUserDialog(index, row) {
      this.updaterUserForm = row;
      this.showUpdateDialog = true;
    }
  }
};
</script>
<style scoped>
</style>