<template>
  <div>
    <!--面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>图书管理</el-breadcrumb-item>
      <el-breadcrumb-item>图书列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card shadow="hover">
      <div>
        <el-row :gutter="20">
          <el-col :span="8">
            <div style="margin-top: 5px;">
              <el-input
                placeholder="请输入书名"
                v-model="param.bookname"
                @keyup.enter.native="getBookListBySearch"
                clearable
                @clear="getBookList"
              >
                <el-button slot="append" icon="el-icon-search" @click="getBookListBySearch"></el-button>
              </el-input>
            </div>
          </el-col>
          <el-col :span="2">
            <el-button type="primary" style="margin-top: 5px;" @click="addBookDialog()">添加图书</el-button>
          </el-col>
          <el-col :span="2">
            <el-button type="primary" style="margin-top: 5px;" @click="dialogTableVisible11=true">书籍分类</el-button>
          </el-col>
          <el-col :span="2">
            <el-button type="primary" style="margin-top: 5px;" @click="showaddDialog11=true">添加分类</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="2">
            <p>根据分类查询:</p>
          </el-col>
          <ul>
            <el-col :span="2" v-for="(item,index) in bookTypeList" :key="index">
              <li>
                <a
                  href="www.baidu.com"
                  style="text-decoration:none;margin-left:20px;"
                  @click.prevent="selBookByType(item.id)"
                >{{item.btName}}</a>
              </li>
            </el-col>
          </ul>
        </el-row>
        <el-row>
          <el-col :span="2">是否收费:</el-col>
          <el-col :span="4">
            <el-radio-group v-model="param.isCharge" @change="selBookByType(param.bookTypeId)">
              <el-radio label="收费"></el-radio>
              <el-radio label="免费"></el-radio>
            </el-radio-group>
          </el-col>
        </el-row>
        <!--图书列表区域-->
        <el-table :data="bookList" style="width: 100%" border stripe>
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column prop="bookname" label="书籍名称" width="180"></el-table-column>
          <el-table-column prop="bookauthor" label="作者" width="180"></el-table-column>
          <el-table-column prop="bookreadnum" label="阅读数量"></el-table-column>
          <el-table-column prop="isCharge" label="是否收费">
            <template v-slot="scope">
              <span>{{scope.row.isCharge == 1?'收费':'免费'}}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="!selFlag" prop="btname" label="书籍类别"></el-table-column>
          <span v-if="selFlag">
            <el-table-column prop="bookTypeId" label="书籍类别">
              <template v-slot="scope">
                <span v-for="(item,index) in bookTypeList" :key="index">
                  <span v-if="item.id == scope.row.bookTypeId">{{item.btName}}</span>
                </span>
              </template>
            </el-table-column>
          </span>

          <el-table-column prop="bookShelves" label="是否上架">
            <template v-slot="scope">
              <span>{{scope.row.bookShelves == 0?'未上架':'已上架'}}</span>
            </template>
          </el-table-column>
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
                @click="deleteBook(scope.row.id)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="block">
          <el-pagination
            @size-change="handleSizeChange1"
            @current-change="handleCurrentChange1"
            :current-page="param.pageNum"
            :page-sizes="[1, 2, 5, 6]"
            :page-size="param.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </el-card>
    <!--修改图书对话框-->
    <el-dialog
      title="修改图书"
      :visible.sync="showUpdateDialog"
      width="30%"
      :before-close="handleUpdateClose"
    >
      <el-form :model="updaterBookForm" ref="updaterUserForm" label-width="80px">
        <el-form-item label="书籍名称">
          <el-input v-model="updaterBookForm.bookname"></el-input>
        </el-form-item>
        <el-form-item label="作者">
          <el-input v-model="updaterBookForm.bookauthor"></el-input>
        </el-form-item>
        <el-form-item label="上传图书资源">
          <el-upload
            class="upload-demo"
            action="http://localhost:8081/bookResource/upload"
            :file-list="fileList"
            :on-success="uploadSuccessUpdate"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="阅读数量">
          <el-input v-model="updaterBookForm.bookreadnum"></el-input>
        </el-form-item>
        <el-form-item label="书籍类别">
          <el-select v-model="updaterBookForm.bookTypeId" placeholder="请选择书籍类别">
            <el-option
              v-for="(item,index) in bookTypeList"
              :key="index"
              :label="item.btName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否收费">
          <el-select v-model="updaterBookForm.isCharge" placeholder="收费否">
            <el-option label="免费" :value="0"></el-option>
            <el-option label="收费" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="绑定书卷" v-show="updaterBookForm.isCharge==1">
          <el-select v-model="updaterBookForm.bookTokenId" placeholder="请选择书卷">
            <el-option
              v-for="(item,index) in bookTokenList"
              :key="index"
              :label="item.btnName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelUpdateUser">取 消</el-button>
        <el-button type="primary" @click="updateBook">确 认</el-button>
      </span>
    </el-dialog>
    <!--新增图书对话框-->
    <el-dialog
      title="新增图书"
      :visible.sync="showAddDialog"
      width="30%"
      :before-close="handleAddClose"
    >
      <el-form :model="addBookForm" ref="addBook" label-width="100px">
        <el-form-item label="书籍名称">
          <el-input v-model="addBookForm.bookname"></el-input>
        </el-form-item>
        <el-form-item label="作者">
          <el-input v-model="addBookForm.bookauthor"></el-input>
        </el-form-item>
        <el-form-item label="上传图书资源">
          <el-upload
            class="upload-demo"
            action="http://localhost:8081/bookResource/upload"
            :file-list="fileList"
            :on-success="uploadSuccess"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="书籍类别">
          <el-select v-model="addBookForm.bookTypeId" placeholder="请选择书籍类别">
            <el-option
              v-for="(item,index) in bookTypeList"
              :key="index"
              :label="item.btName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否收费">
          <el-select v-model="addBookForm.isCharge" placeholder="收费否">
            <el-option label="免费" :value="0"></el-option>
            <el-option label="收费" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="绑定书卷" v-show="addBookForm.isCharge==1">
          <el-select v-model="addBookForm.bookTokenId" placeholder="请选择书卷">
            <el-option
              v-for="(item,index) in bookTokenList"
              :key="index"
              :label="item.btnName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelAddBook">取 消</el-button>
        <el-button type="primary" @click="submitAddBook">确 认</el-button>
      </span>
    </el-dialog>
    <!--图书类别-->
    <el-dialog title="书籍类别列表" :visible.sync="dialogTableVisible11">
      <!--图书类别列表区域-->
        <el-table :data="bookTypeList1" style="width: 60%" border stripe>
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column prop="btName" label="类别名称" width="180"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="updateUserDialog11(scope.$index, scope.row)"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="deleteBookType1(scope.row.id)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="block">
          <el-pagination
            @size-change="handleSizeChange1"
            @current-change="handleCurrentChange1"
            :current-page="param1.pageNum"
            :page-sizes="[1, 2, 5, 10]"
            :page-size="param1.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
    </el-dialog>
        <!--添加图书类别对话框-->
    <el-dialog
      title="添加类别名称"
      :visible.sync="showaddDialog11"
      width="30%"
      :before-close="handleaddClose11"
    >
      <el-form :model="addBookTypeForm" ref="addBookTypeForm" label-width="80px">
        <el-form-item label="类别名称">
          <el-input v-model="addBookTypeForm.btName"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="canceladdUser11">取 消</el-button>
        <el-button type="primary" @click="addBookType">确 认</el-button>
      </span>
    </el-dialog>
    <!--修改图书类别对话框-->
    <el-dialog
      title="修改类别名称"
      :visible.sync="showUpdateDialog11"
      width="30%"
      :before-close="handleUpdateClose11"
    >
      <el-form :model="updaterBookTypeForm" ref="updaterBookForm" label-width="80px">
        <el-form-item label="id" disabled>
          <el-input v-model="updaterBookTypeForm.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="类别名称">
          <el-input v-model="updaterBookTypeForm.btName"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelUpdateUser11">取 消</el-button>
        <el-button type="primary" @click="updateBookType">确 认</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      updaterBookTypeForm:{},
      showUpdateDialog11:false,
      dialogTableVisible11:false,
      addBookTypeForm: {
        btName: ""
      },
      bookTypeList1: [],
      total: 0,
      fileList: [],
      selFlag: false,
      param: {
        id: 0,
        bookname: "",
        pageNum: 1,
        pageSize: 5,
        isCharge: "",
        bookTypeId: ""
      },
      param1: {
        pageNum: 1,
        pageSize: 2
      },
      addBookForm: {
        bookname: "",
        bookauthor: "",
        bookTypeId: "",
        bookUrl: "",
        bookTokenId: "",
        isCharge: 0,
        bookResourceId: ""
      },
      updaterBookForm: {
        bookUrl: "",
        bookResourceId: "",
        isCharge: 0
      },
      bookList: [],
      total: 0,
      showUpdateDialog: false,
      showAddDialog: false,
      showaddDialog11:false,
      bookTypeList: [],
      bookTokenList: []
    };
  },
  created() {
    this.getBookList();
    this.getBookType();
    this.getBookTokenList();
    this.getBookTypeList();
  },
  methods: {
    async getBookTokenList() {
      const param = this.param;
      const { data: res } = await this.$http.get(`/bookToken/list/1/10`);
      if (res.statusCode !== 200) {
        return this.$message.error(res.message);
      }
      this.bookTokenList = res.data.list;
    },
    uploadSuccess(response, file, fileList) {
      this.addBookForm.bookUrl = response.data.url;
      this.addBookForm.bookResourceId = response.data.resourceId;
    },
    uploadSuccessUpdate(response, file, fileList) {
      this.updaterBookForm.bookUrl = response.data.url;
      this.updaterBookForm.bookResourceId = response.data.resourceId;
    },
    async selBookByType(id) {
      this.selFlag = true;
      if (id) {
        this.param.bookTypeId = id;
      }

      const { data: res } = await this.$http.get("/book/book_by_type", {
        params: this.param
      });
      if (res.statusCode !== 200) {
        return this.$message.error(res.message);
      }
      this.bookList = res.data.list;
    },
    async submitAddBook() {
      const { data: res } = await this.$http.post(
        "/book/add_book",
        this.addBookForm
      );
      if (res.statusCode !== 200) {
        return this.$message.error(res.message);
      }
      this.getBookList();
      this.showAddDialog = false;
    },
    async updateBook() {
      const { data: res } = await this.$http.put("/book", this.updaterBookForm);
      if (res.statusCode !== 200) {
        return this.$message.error(res.message);
      }
      this.getBookList();
      this.$message({
        type: "success",
        message: "更新书籍成功",
        duration: 2000
      });
      this.showUpdateDialog = false;
    },
    async getBookType() {
      const { data: res } = await this.$http.get("/book/book_type");
      if (res.statusCode !== 200) {
        return this.$message.error(res.message);
      }
      this.bookTypeList = res.data;
    },
    async getBookList() {
      this.selFlag = false;
      const param = this.param;
      if (param.bookname == "") {
        param.bookname = " ";
      }
      const { data: res } = await this.$http.get(
        `/book/list/${param.bookname}/${param.pageNum}/${param.pageSize}`
      );
      if (res.statusCode !== 200) {
        return this.$message.error(res.message);
      }
      this.bookList = res.data.list;
      this.total = res.data.total;
    },
    getBookListBySearch() {
      this.getBookList();
    },
    handleSizeChange(size) {
      this.param.pageSize = size;
      if (this.selFlag) {
        this.selBookByType();
      } else {
        this.getBookList();
      }
    },
    handleCurrentChange(pageNo) {
      this.param.pageNum = pageNo;
      if (this.selFlag) {
        this.selBookByType();
      } else {
        this.getBookList();
      }
    },
    async deleteBook(id) {
      const { data: res } = await this.$http.delete(`/book/${id}`);
      if (res.statusCode !== 200) {
        return this.$message.error(res.message);
      }
      this.$message({
        type: "success",
        message: "删除书籍成功",
        duration: 2000
      });
      this.getBookList();
    },
    updateUserDialog(index, row) {
      this.updaterBookForm = row;
      this.showUpdateDialog = true;
    },
    addBookDialog() {
      this.showAddDialog = true;
    },
    cancelUpdateUser() {
      this.showUpdateDialog = false;
    },
    cancelAddBook() {
      this.showAddDialog = false;
    },
    handleUpdateClose() {
      this.$refs.updaterUserForm.resetFields();
      this.showUpdateDialog = false;
    },
    handleAddClose() {
      this.$refs.addBook.resetFields();
      this.showAddDialog = false;
    },
    // bookType
    async getBookTypeList() {
      const { data: res } = await this.$http.get(
        `/book/book_type/${this.param1.pageNum}/${this.param1.pageSize}`
      );
      if (res.statusCode !== 200) {
        return this.$message.error(res.message);
      }
      this.bookTypeList1 = res.data.list;
      this.total = res.data.total;
    },
    async updateBookType() {
      const { data: res } = await this.$http.put(
        "/book/book_type",
        this.updaterBookTypeForm
      );
      if (res.statusCode !== 200) {
        return this.$message.error(res.message);
      }
      this.$message({
        type: "success",
        message: "更新成功",
        duration: 2000
      });
      this.getBookTypeList();
      this.showUpdateDialog11 = false;
    },
    async addBookType() {
      const { data: res } = await this.$http.post(
        "/book/book_type",
        this.addBookTypeForm
      );
      if (res.statusCode !== 200) {
        return this.$message.error(res.message);
      }
      this.$message({
        type: "success",
        message: "新增成功",
        duration: 2000
      });
      this.getBookTypeList();
      this.showaddDialog11 = false;
    },
    handleSizeChange1(size) {
      this.param1.pageSize = size;
      this.getBookTypeList();
    },
    handleCurrentChange1(pageNo) {
      this.param1.pageNum = pageNo;
      this.getBookTypeList();
    },
    async deleteBookType1(id) {
      const { data: res } = await this.$http.delete(`/book/book_type/${id}`);
      if (res.statusCode !== 200) {
        return this.$message.error(res.message);
      }
      this.$message({
        type: "success",
        message: "删除图书类别成功",
        duration: 2000
      });
      this.getBookTypeList();
    },
    updateUserDialog11(index, row) {
      this.updaterBookTypeForm = row;
      this.showUpdateDialog11 = true;
    },
    handleUpdateClose11() {
      this.$refs.updaterBookForm.resetFields;  
      this.showUpdateDialog11 = false;
    },
    cancelUpdateUser11() {
      this.$refs.updaterBookForm.resetFields;
      this.showUpdateDialog11 = false;     
    },
    updateaddDialog11() {
      this.showaddDialog11 = true;
    },
    handleaddClose11() {
      this.$refs.addBookTypeForm.resetFields;  
      this.showaddDialog11 = false;
    },
    canceladdUser11() {
      this.$refs.addBookTypeForm.resetFields;
      this.showaddDialog11 = false;     
    }
  }
};
</script>
<style scoped>
a {
  color: deepskyblue;
}
li {
  float: left;
  list-style: none;
}
</style>