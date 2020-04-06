<template>
  <div>
    <!--面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>个人中心</el-breadcrumb-item>
    </el-breadcrumb>
    <!--管理员登录时展示-->
    <el-card v-if="showFlag" class="box-card">
      <el-form :disabled="disableFlag" ref="form2" :model="adminFrom" label-width="80px">
        <el-form-item label="账号名称">
          <el-input v-model="adminFrom.adminName" disabled class="form-input"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="adminFrom.adminPwd" class="form-input" type="password" show-password>></el-input>
        </el-form-item>
        <el-form-item label="新密码" v-show="passwordFlag">
          <el-input v-model="adminFrom.newPwd" class="form-input" type="password" show-password>></el-input>
        </el-form-item>
        <el-form-item label="确认密码" v-show="passwordFlag">
          <el-input v-model="adminFrom.confimPwd" class="form-input" type="password" show-password>></el-input>
        </el-form-item>
      </el-form>
      <el-button v-show="!passwordFlag" @click="updatePwd" type="primary">修改密码</el-button>
      <el-button v-show="passwordFlag" @click="submitFrom" type="primary">提交修改</el-button>
      <el-button v-show="passwordFlag" @click="cancelUpdate" type="primary">取消</el-button>
    </el-card>
    <!--专家登录时展示-->
    <el-card v-if="!showFlag" class="box-card">
      <div v-show="one">
        <el-form disabled="" ref="form" :model="expert" label-width="80px">
          <el-form-item label="账号名称">
            <el-input v-model="expert.exUsername" disabled class="form-input"></el-input>
          </el-form-item>
          <el-form-item label="账号密码">
            <el-input v-model="expert.exPwd"  class="form-input"></el-input>
          </el-form-item>
          <el-form-item label="姓名">
            <el-input v-model="expert.exName"  class="form-input"></el-input>
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="expert.exPhone"  class="form-input"></el-input>
          </el-form-item>
          <el-form-item label="地址">
            <el-input v-model="expert.exAddr"  class="form-input">></el-input>
          </el-form-item>
          <el-form-item label="身份证号">
            <el-input v-model="expert.exIdentity" class="form-input" >></el-input>
          </el-form-item>
          <el-form-item label="新密码" v-show="passwordFlag">
            <el-input v-model="expert.newPwd" class="form-input" type="password" show-password>></el-input>
          </el-form-item>
          <el-form-item label="确认密码" v-show="passwordFlag">
            <el-input v-model="expert.confimPwd" class="form-input" type="password" show-password>></el-input>
          </el-form-item>
        </el-form>
      </div>
      <!--修改密码-->
      <div v-show="!one">
        <el-form ref="form1" :model="expert" label-width="80px">
          <el-form-item label="账号名称">
            <el-input v-model="expert.exUsername" disabled class="form-input"></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="expert.exPwd" disabled="" class="form-input" type="password" show-password>></el-input>
          </el-form-item>
          <el-form-item label="新密码" v-show="!one">
            <el-input v-model="expert.newPwd" class="form-input" type="password" show-password>></el-input>
          </el-form-item>
          <el-form-item label="确认密码" v-show="!one">
            <el-input v-model="expert.confimPwd" class="form-input" type="password" show-password>></el-input>
          </el-form-item>
        </el-form>
        <el-button v-show="!one" @click="submitExpert" type="primary">提交修改</el-button>
        <el-button v-show="!one" @click="cancelUpdate1" type="primary">取消</el-button>
      </div>
      <el-button v-show="one" @click="updatePwd1" type="primary">修改密码</el-button>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      one: true,
      flagOne: true,
      passwordFlag: false,
      adminFrom: {
        adminName: "",
        adminPwd: "",
        newPwd: "",
        confimPwd: ""
      },
      showNewPwd: false,
      disableFlag: true,
      userType: "123",
      expert: {
        exUsername: "",
        exPwd: "",
        exName: "",
        exPhone: "",
        exAddr: "",
        exIdentity: "",
        newPwd: "",
        confimPwd: ""
      },
      showFlag: true
    };
  },
  mounted() {
    this.userType = window.sessionStorage.getItem("userType");
    console.log(window.sessionStorage.getItem("user"));
    if (this.userType === "管理员") {
      this.adminFrom = JSON.parse(window.sessionStorage.getItem("user"));
    } else {
      this.expert = JSON.parse(window.sessionStorage.getItem("user"));
      this.showFlag = false;
    }
  },
  methods: {
    cancelUpdate1() {
      this.one = true
    },
    updateExpert() {
      this.flagOne = false;
      this.disableFlag = false;
    },
    async submitExpert() {
      const { data: res } = await this.$http.put("/expert/update_pwd", this.expert);
      if (res.statusCode !== 200) {
        return this.$message.error(res.message);
      }
      this.$message({
        type: "success",
        message: "修改密码成功",
        duration: 2000
      });
      this.one = true
      this.getExpert();
    },
    updatePwd() {
      this.passwordFlag = true;
      this.disableFlag = false;
    },
    updatePwd1() {
      this.one = false
    },
    async getExpert() {
      const { data: res } = await this.$http.get(`/expert/${this.expert.id}`);
      if (res.statusCode !== 200) {
        return this.$message.error(res.message);
      }
      this.expert = res.data;
    },
    async getAdmin() {
      const { data: res } = await this.$http.get(
        `/admin/${this.adminFrom.adminName}/${this.adminFrom.adminPwd}`
      );
      if (res.statusCode !== 200) {
        return this.$message.error(res.message);
      }
      this.adminFrom = res.data;
      console.log("查询用户失败");
    },
    async submitFrom() {
      if (this.adminFrom.newPwd !== this.adminFrom.confimPwd) {
        return this.$message({
          type: "error",
          message: "两次密码不一致",
          duration: 2000
        });
      }
      const { data: res } = await this.$http.put(
        "/admin/update_pwd",
        this.adminFrom
      );
      if (res.statusCode !== 200) {
        return this.$message.error(res.message);
      }
      this.$message({
        type: "success",
        message: "修改密码成功",
        duration: 2000
      });
      this.adminFrom.adminPwd = this.adminFrom.newPwd;
      this.passwordFlag = false;
      this.disableFlag = true;
    },
    cancelUpdate() {
      this.passwordFlag = false;
      this.disableFlag = true;
    }
  }
};
</script>
<style scoped>
.form-input {
  width: 300px;
}
</style>