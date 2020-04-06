<template>
  <div>
    <!--面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>书卷管理</el-breadcrumb-item>
      <el-breadcrumb-item>书卷列表</el-breadcrumb-item>
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
          <el-table-column prop="createTime" label="日期" width="180"></el-table-column>
          <el-table-column prop="username" label="用户姓名" width="180"></el-table-column>
          <el-table-column prop="roleName" label="角色姓名"></el-table-column>
          <el-table-column prop="telephone" label="电话号码"></el-table-column>
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
                @click="deleteUser(scope.row.id)"
              ></el-button>
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
export default {
  data() {
    return {
      param: {
        username: "",
        pageNum: "",
        pageSize: ""
      },
      updaterUserForm:{},
      userList: [],
      total:0,
      showUpdateDialog:false
    };
  },
  created() {},
  methods: {
    getUserList() {},
    getUserListBySearch() {},
    handleSizeChange(size) {
      this.param.pageSize = size
      this.getUserList()
    },
    handleCurrentChange(pageNo) {
      this.param.pageNum = pageNo
      this.getUserList()
    },
    async deleteUser(id) {
    },
    updateUserDialog(index, row) {
      this.updaterUserForm = row
      this.showUpdateDialog = true
    },
  }
};
</script>
<style scoped>
</style>