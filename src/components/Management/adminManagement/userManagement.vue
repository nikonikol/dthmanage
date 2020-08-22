/*
 * @Author: Liudy 
 * @Date: 2020-06-22 12:03:36 
 * @Last Modified by: Liudy
 * @Last Modified time: 2020-07-01 10:16:52
 */
<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>后台管理</el-breadcrumb-item>
      <el-breadcrumb-item>人员管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="10">
        <el-col :span="10">
          <el-input
            :placeholder="mapType"
            clearable
            @clear="getUserList"
            v-model="queryData"
            class="input-with-select"
          >
            <el-button slot="append" icon="el-icon-search" @click="serachData()"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 用户列表展示区域 -->
      <el-table
      style="width:100%"
        :data="userList"
        border
        stripe
        @selection-change="handleSelectionChange"
        ref="multipleTable"
      >
        <!-- <el-table-column type="selection" width="55"></el-table-column> 批量删除 -->
        <el-table-column type="index" label></el-table-column>
        <el-table-column prop="user_name" label="用户名" ></el-table-column>
        <el-table-column prop="user_psd" label="密码" ></el-table-column>
        <!-- <el-table-column prop="realName" label="真实姓名" ></el-table-column> -->
        <el-table-column prop="phone" label="手机号" ></el-table-column>
        <el-table-column prop="email" label="邮箱" ></el-table-column>
        <!-- <el-table-column prop="workUnit" label="工作单位" ></el-table-column>
        <el-table-column prop="addr" label="地址" ></el-table-column> -->
        <!-- <el-table-column label="用户许可权限" prop="type">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.type"
              active-color="#13ce66"
              @change="userStateChanged(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>-->
        <!-- <el-table-column label="操作" fixed="right" width="100"> -->
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- <el-tooltip
              class="item"
              effect="dark"
              content="修改"
              placement="top-start"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditDialog(scope.row.u_id)"
              ></el-button>
            </el-tooltip> -->
            <el-tooltip
              class="item"
              effect="dark"
              content="删除"
              placement="top-start"
              :enterable="false"
            >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                :disabled="btnStatus"
                @click="deleteReport(scope.row.u_id)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 删除提示框 -->
      <!-- <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteReport" >确 定</el-button>
            </span>
      </el-dialog>-->

      <!-- 批量删除按钮 -->
      <!-- <div style="margin-top: 20px">
        <el-button type="danger" icon="el-icon-delete-solid" @click="deleteAll()">批量删除</el-button>
      </div>-->
      <!-- 分页效果 -->
      <el-pagination
        class="pagenation"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[1,5,7,10]"
        :page-size="currentCount"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
      ></el-pagination>
    </el-card>

    <!-- 编辑对话框 -->
    <el-dialog
      title="修改数据"
      :visible.sync="editDialogVisible"
      :close-on-click-modal="false"
      width="50%"
      @close="resetEdit"
    >
      <!-- <el-form ref="editFormRef" :rules="editFormRules" :model="editForm" label-width="100px">
        <el-form-item label="用户名" prop="userName">
          <el-input :disabled="true" v-model="editForm.userName"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="editForm.password"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" prop="realName">
          <el-input v-model="editForm.realName"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="editForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
      </el-form> -->
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmEdit()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  // var id = ;
  data() {
    // 手机号正则验证
    var checkPhone = (rule, value, callback) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      setTimeout(() => {
        // Number.isInteger是es6验证数字是否为整数的方法,但是我实际用的时候输入的数字总是识别成字符串
        // 所以我就在前面加了一个+实现隐式转换

        if (!Number.isInteger(+value)) {
          callback(new Error("请输入数字值"));
        } else {
          if (regMobile.test(value)) {
            callback();
          } else {
            callback(new Error("电话号码格式不正确"));
          }
        }
      }, 100);
    };
    var checkEmail = (rule, value, callback) => {
      const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
      // if (!value) {
      //   return callback(new Error("邮箱不能为空"));
      // }
      setTimeout(() => {
        if (mailReg.test(value)) {
          callback();
        } else {
          callback(new Error("请输入正确的邮箱格式"));
        }
      }, 100);
    };
    return {
      //获取用户数据的参数对象
      queryInfo: {
        queryParams: "",
        currentPage: 1, //当前页数
        currentCount: 5 //当前每页显示多少条数据
      },
      queryAdmin: [],
      userList: [], //总数据列表
      totalCount: 0, // 总数据条数
      queryData: "",
      currentPage: 1,
      currentCount: 5,
      addDialogVisible: false,
      editDialogVisible: false,
      mapType: "请输入用户名称",
      btnStatus: false, //控制删除按钮是否禁用
      // delVisible:false,//删除提示弹框的状态

      // delarr: [], //存放删除的数据
      // multipleSelection: [], //多选的数据

      editForm: {
        id: "",
        userName: "",
        password: "",
        realName: "",
        phone: "",
        email: "",
        workUnit: "",
        addr: ""
      },
      editFormRules: {
        phone: [
          {
            validator: checkPhone,
            trigger: "blur"
          }
        ],
        email: [
          {
            validator: checkEmail,
            trigger: "blur"
          }
        ]
      },
      tempId: 0 //获取用户id
    };
  },
  watch: {},
  methods: {
    // 批量删除
    // toggleSelection(rows) {
    //   if (rows) {
    //     rows.forEach(row => {
    //       this.$refs.multipleTable.toggleRowSelection(row);
    //     });
    //   } else {
    //     this.$refs.multipleTable.clearSelection();
    //   }
    // },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    //批量删除
    // deleteAll() {
    //   const length = this.multipleSelection.length;
    //   for (let i = 0; i < length; i++) {
    //     this.delarr.push(this.multipleSelection[i].id);
    //   }
    // },

    //   监听pagesize的改变
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.currentCount = val;
      this.getUserList();
    },
    //监听页码值的改变
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.getUserList();
    },
    //重置表单
    resetForm() {
      this.$refs.userFormRef.resetFields();
    },
    //重置编辑框
    resetEdit() {
      this.$refs.editFormRef.resetFields();
    },

    //展示编辑框
    // showEditDialog(id) {
    //   this.tempId = id;
    //   // console.log(id);
    //   this.editDialogVisible = true;
    //   this.$http
    //     .get("/QueryById", {
    //         id: id
    //     })
    //     .then(res => {
    //       this.editForm = res.data.list[0];
    //     })
    //     .catch(err => {
    //       console.log(err);
    //     });
    // },
    // // 确认编辑成功
    // confirmEdit() {
    //   this.editDialogVisible = false;
    //   this.$http
    //     .get("/UpdateUserInfo", {
    //       params: {
    //         id: this.tempId,
    //         account: this.editForm.userName,
    //         password: this.editForm.password,
    //         name: this.editForm.realName,
    //         phone: this.editForm.phone,
    //         email: this.editForm.email,
    //         unit: this.editForm.workUnit
    //         // addr: this.editForm.addr
    //       }
    //     })
    //     .then(res => {
    //       this.$message({
    //         showClose: true,
    //         type: "success",
    //         message: "修改成功!"
    //       });
    //       this.getUserList();
    //     })
    //     .catch(err => {
    //       console.log(err);
    //       this.$message({
    //         showClose: true,
    //         type: "error",
    //         message: "修改失败!"
    //       });
    //     });
    // },

    //删除
    deleteReport(id) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http
            .post("/manage/userdata", {
              user_id:id,
              method:"deleteuser"
            })
            .then(res => {
              this.$message({
                showClose: true,
                type: "success",
                message: "删除成功!"
              });
              this.getUserList();
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(() => {
          this.$message({
            showClose: true,
            type: "info",
            message: "已取消删除"
          });
        });
    },

    // 通过名称搜索数据
    serachData() {
      if (this.queryData == "") {
        this.getUserList();
      } else {
        this.$http
          .post("/manage/userdata", {
              method:"QueryByUserName",
              user_name: this.queryData
          })
          .then(res => {
            // console.log(res.data);
            // console.log(this.queryData);

            this.userList = res.data.list;
          });
      }
    },

    //获取用户列表
    getUserList() {
      this.$http
        .post("/manage/userdata", {
            method:"getAllUser",
            currentPage: this.currentPage,
            currentCount: this.currentCount
          
        })
        .then(res => {
          this.userList = res.data.list;
          this.totalCount = res.data.totalCount;
        })
        .catch(err => {
          this.$message.error("请求数据失败");
        });
    }

    //监听switch开关状态的改变  put代表修改请求
    // userStateChanged(userInfo) {
    //   // console.log(userInfo);
    //   this.$http
    //     .put("http://101.37.83.223:8080/CityGeo/UserUpdateServlet", {
    //       id: userInfo.id,
    //       authorited: userInfo.type
    //     })
    //     .then(res => {
    //       this.userList[1] = res.data.type;
    //       console.log(this.userList[1]);
    //     });
    //   if (res.status !== 200) {
    //     userInfo.authorited = !userInfo.authorited;
    //     return this.$message.error("权限更改失败");
    //   }
    //   this.$message.success("权限更改成功");
    // }
  },
  mounted() {
    this.getUserList();
  },
  created() {}
};
</script>

<style scoped>
.el-select .el-input {
  width: 130px !important;
}
.input-with-select {
  background-color: #fff;
}
.el-table {
  margin-top: 15px;
  font-size: 12px;
}
.el-table__fixed-right{
    width: 120px !important;
}
/* .pagenation {
  text-align: right !important;
} */
</style>
