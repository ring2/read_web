<template>
  <div class="div-home" style="overflow-y: hidden;">
    <el-container class="container-home">
      <!--头部区域-->
      <el-header>
        <div>
          <img
            src="../assets/book.png"
            style="height:60px; width:60px;border-radius:50%;margin-left:12px"
          />
          <span style="width:200px">数字图书管理系统</span>
        </div>
        <el-button
          type="primary"
          @click="aboutMe"
          class="about-me"
          size="mini"
          style="margin-left: 800px;"
          round
        >系统介绍</el-button>
        <el-badge :value="msgTotal">
          <el-button type="info" size="mini" round @click="dialogTableVisible = true">消息中心</el-button>
        </el-badge>
        <el-button type="info" size="mini" @click="goPersonal" round>个人中心</el-button>
        <el-button type="info" size="mini" @click="loginOut" round>退出</el-button>
      </el-header>
      <el-container>
        <!--左边菜单区域-->
        <el-aside :width="isMenuOpen ? '64px' : '200px'">
          <div class="toggle-button" @click="toggleCollapse">|||</div>
          <el-menu
            background-color="#263238"
            text-color="#fff"
            active-text-color="#409EFF"
            unique-opened
            :default-active="adtiveMenu"
            :collapse="isMenuOpen"
            :collapse-transition="false"
            router
          >
            <!--一级菜单-->
            <el-submenu :index="menu.uri + ''" v-for="menu in menuList" :key="menu.id">
              <template slot="title">
                <i :class="menu.icon"></i>
                <span>{{menu.name}}</span>
              </template>
              <!--一级菜单的子菜单-->
              <el-menu-item :index="subMenu.uri" v-for="subMenu in menu.children" :key="subMenu.id">
                <template slot="title">
                  <i :class="subMenu.icon"></i>
                  <span>{{subMenu.name}}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
    <!--关于我的展示-->
    <el-drawer
      title="数字图书管理系统"
      :visible.sync="drawer"
      :direction="direction"
      :before-close="handleClose"
    >
      <span>此系统为数字图书系统，系统分为管理端和用户端；此系统为管理端。</span>
    </el-drawer>
    <el-dialog title="专家修改的书籍：" :visible.sync="dialogTableVisible">
      <el-table :data="msgList">
        <el-table-column type="index" label="#" width="50"></el-table-column>
        <el-table-column property="bookId" label="书籍id" width="150"></el-table-column>
        <el-table-column property="result" label="审核结果" width="200">
          <template slot-scope="scope">{{scope.row.result == 0?"不通过":"通过"}}</template>
        </el-table-column>
        <el-table-column property="opinion" label="审核意见"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="info"  @click="updateRmdMsg(scope.row)">标为已读</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      typeFlag: false,
      dialogTableVisible: false,
      msgTotal: 0,
      msgList: [],
      menuList0: [
        {
          id: 1,
          name: "读者管理",
          uri: "/user",
          icon: "el-icon-s-custom",
          children: [
            {
              id: 2,
              name: "读者列表",
              uri: "/home/user",
              icon: "el-icon-plus"
            }
          ]
        },
        {
          id: 3,
          name: "专家管理",
          uri: "expert",
          icon: "el-icon-s-check",
          children: [
            {
              id: 5,
              name: "专家列表",
              uri: "/home/expert",
              icon: "el-icon-user-solid"
            }
          ]
        },
        {
          id: 4,
          name: "图书管理",
          uri: "/book",
          icon: "el-icon-s-cooperation",
          children: [
            {
              id: 7,
              name: "图书列表",
              uri: "/home/book",
              icon: "el-icon-s-promotion"
            },
            {
              id: 19,
              name: "图书类别管理",
              uri: "/home/bookType",
              icon: "el-icon-menu"
            },
            {
              id: 659,
              name: "已审核书籍",
              uri: "/home/reviewed",
              icon: "el-icon-menu"
            }
          ]
        },
        {
          id: 16,
          name: "公告管理",
          uri: "/announcement",
          icon: "el-icon-s-goods",
          children: [
            {
              id: 17,
              name: "公告列表",
              uri: "/home/announcement",
              icon: "el-icon-s-promotion"
            }
          ]
        },
        // {
        //   id: 22,
        //   name: "借阅管理",
        //   uri: "/borrow",
        //   icon: "el-icon-menu",
        //   children: [
        //     {
        //       id: 37,
        //       name: "借阅情况",
        //       uri: "/home/borrow",
        //       icon: "el-icon-s-custom"
        //     }
        //   ]
        // },
        {
          id: 23,
          name: "书卷管理",
          uri: "/booketoken",
          icon: "el-icon-menu",
          children: [
            {
              id: 36,
              name: "读者书卷管理",
              uri: "/home/booktoken",
              icon: "el-icon-s-custom"
            }
          ]
        },
        {
          id: 213,
          name: "问卷调查",
          uri: "/investigate",
          icon: "el-icon-menu",
          children: [
            {
              id: 36,
              name: "问卷管理",
              uri: "/home/investigate",
              icon: "el-icon-s-custom"
            }
          ]
        },
        {
          id: 24,
          name: "数据统计",
          uri: "/datacount",
          icon: "el-icon-menu",
          children: [
            {
              id: 46,
              name: "阅读排行榜",
              uri: "/home/read_rank",
              icon: "el-icon-s-custom"
            },
            {
              id: 56,
              name: "读者推荐榜",
              uri: "/home/reader_rank",
              icon: "el-icon-s-custom"
            }
          ]
        }
      ],
      menuList1: [
        {
          id: 3,
          name: "专家中心",
          uri: "expert",
          icon: "el-icon-s-check",
          children: [
            {
              id: 6,
              name: "推荐审核",
              uri: "/home/recommend",
              icon: "el-icon-s-unfold"
            }
          ]
        }
      ],
      menuList: [],
      isMenuOpen: false,
      adtiveMenu: "/user",
      drawer: false,
      direction: "ltr"
    };
  },
  beforeDestroy() {
    window.removeEventListener("blur", this.handleWinBlur);
    window.removeEventListener("focus", this.handleWinFocus);
  },
  created() {
    //this.getMenuList()
    window.addEventListener("blur", this.handleWinBlur);
    window.addEventListener("focus", this.handleWinFocus);
  },
  mounted() {
    this.getRmdTotal();
    const userType = window.sessionStorage.getItem("userType");
    if (userType === "管理员") {
      this.menuList = this.menuList0;
    } else {
      this.menuList = this.menuList1;
    }
  },
  methods: {
    async getRmdTotal() {
      const { data: res } = await this.$http.get("/rmd_msg");
      if (res.statusCode !== 200) {
        return this.$message.error("查询失败");
      }
      this.msgList = res.data;
      this.msgTotal = this.msgList.length;
    },
    async updateRmdMsg(obj) {
      this.typeFlag = true;
      const { data: res } = await this.$http.put("/rmd_msg", obj);
      if (res.statusCode !== 200) {
        return this.$message.error("标记失败");
      }
      this.$message.success("标记成功")
      this.getRmdTotal()
    },
    handleWinFocus() {
      document.title = "数字图书后台管理系统";
    },
    handleWinBlur() {
      document.title = "我一定会回来的！";
    },
    loginOut() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    goPersonal() {
      this.$router.push("/home/personal");
    },
    toggleCollapse() {
      var flag = this.isMenuOpen;
      this.isMenuOpen = !flag;
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    aboutMe() {
      this.drawer = true;
    }
  }
};
</script>
<style lang="less" scoped>
.div-home {
  height: 100%;
}
.container-home {
  height: 100%;
}
.el-header {
  background-color: #47aca1;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  font-size: 20px;
  align-items: center;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #263238;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: aliceblue;
}
.toggle-button {
  line-height: 24px;
  color: #fff;
  letter-spacing: 0.2em;
  text-align: center;
  background-color: #263238;
  cursor: pointer;
  font-size: 12px;
}
.el-button {
  background-color: #47aca1;
  border: 1px solid #fff;
}
.item {
  background-color: #47aca1;
  color: #fff;
}
.about-me {
  background-color: #47aca1;
  border: 1px solid #fff;
}
.el-button:hover {
  background-color: #47aca1;
}
</style>
