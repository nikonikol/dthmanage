/*
 * @Author: Liudy 
 * @Date: 2020-06-22 12:03:36 
 * @Last Modified by: Liudy
 * @Last Modified time: 2020-07-01 10:21:51
 */
<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>后台管理</el-breadcrumb-item>
      <el-breadcrumb-item>人员管理</el-breadcrumb-item>
      <el-breadcrumb-item>管理员管理</el-breadcrumb-item>
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
        <el-col :span="3">
          <el-button type="success" @click="addDialogVisible = true">添加管理人员</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表展示区域 -->
      <el-table :data="userList" border stripe style="width:100%">
        <el-table-column type="index" label></el-table-column>
        <el-table-column prop="user_name" label="用户名" ></el-table-column>
        <el-table-column prop="user_psd" label="密码"></el-table-column>
        <el-table-column prop="email" label="邮箱" ></el-table-column>
        <el-table-column prop="phone" label="手机号"></el-table-column>
               <el-table-column label="操作" fixed="right" >
               <!-- <el-table-column label="操作" fixed="right" width="200"> -->
          //width="180px"
          <template slot-scope="scope">
            <el-tooltip
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
                @click="showEditDialog(scope.row.user_id)"
              ></el-button>
            </el-tooltip>
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
                @click="deleteReport(scope.row.user_id)"
              ></el-button>
            </el-tooltip>
            <!-- <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top-start"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="deleteReport(scope.row.id)"
              ></el-button>
            </el-tooltip>-->
          </template>
        </el-table-column>
        <!-- <el-table-column prop="workUnit" label="单位" width="200"></el-table-column>
        <el-table-column prop="addr" label="地址" width="350"></el-table-column> -->
        <!-- <el-table-column label="管理权限" prop="type">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.type"
              active-color="#13ce66"
              @change="userStateChanged(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>-->
 
      </el-table>

      <!-- 分页效果 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[1,5,10]"
        :page-size="currentCount"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
      ></el-pagination>
    </el-card>

    <!-- 添加用户 -->
    <el-dialog
      :visible.sync="addDialogVisible"
      :close-on-click-modal="false"
      width="50%"
      @close="resetForm"
      class="mapserver-add"
      title="添加用户"
    >
      <!-- 内容主体区域 -->
      <el-form ref="userFormRef" :model="userForm" :rules="userFormRules" label-width="70px">
        <el-form-item label="账号" prop="user_name">
          <el-input v-model="userForm.user_name"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="user_psd">
          <el-input
            v-model="userForm.user_psd"
            :type="pwdType"
            onkeyup="value=value.replace(/[^\w\.\/]/ig,'')"
          >
            <i slot="suffix" class="el-icon-view" @click="showPwd"></i>
          </el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="userForm.phone" onkeyup="this.value=this.value.replace(/\D/g,'')"></el-input>
        </el-form-item>
        <!-- <el-form-item label="单位" prop="workUnit">
          <el-input v-model="userForm.workUnit"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="addr">
          <el-input v-model="userForm.addr"></el-input>
        </el-form-item> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" plain @click="addDialogVisible = false" size="small">关闭</el-button>
        <el-button @click="resetForm" size="small">重置</el-button>
        <el-button type="primary" plain size="small" class="btn-publish" @click="addUser">添加人员</el-button>
      </span>
    </el-dialog>

    <!-- 编辑对话框 -->
    <el-dialog
      title="修改数据"
      :visible.sync="editDialogVisible"
      :close-on-click-modal="false"
      width="50%"
      @close="resetEdit"
    >
      <el-form ref="editFormRef" :rules="editFormRules" :model="editForm" label-width="70px">
        <el-form-item label="账号" prop="account">
          <el-input :disabled="true" v-model="editForm.user_name"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="editForm.user_psd" :type="pwdType">
            <i slot="suffix" class="el-icon-view" @click="showPwd"></i>
          </el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="editForm.phone"></el-input>
        </el-form-item>
        <!-- <el-form-item label="单位" prop="workUnit">
          <el-input v-model="editForm.workUnit"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="addr">
          <el-input v-model="editForm.addr"></el-input>
        </el-form-item> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editDialogVisible = false">取 消</el-button>
        <!-- <el-button @click="resetEdit">重置</el-button> -->
        <el-button type="primary" @click="confirmEdit()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // 手机号正则验证
    var checkPhone = (rule, value, callback) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (regMobile.test(value)) {
        return callback();
      }
      callback(new Error("请输入合法的手机号"));
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
        query: "",
        pageNum: 1, //当前页数
        pageSize: 2 //当前每页显示多少条数据
      },
      authority: "管理员",
      queryAdmin: [],
      userList: [], //总数据列表
      totalCount: 0, // 总数据条数
      queryData: "",
      currentPage: 1,
      currentCount: 5,
      addDialogVisible: false,
      editDialogVisible: false,
      isSelectHole: false,
      mapType: "请输入人员名称",
      btnStatus: false, //控制删除按钮是否禁用
      // 添加用户的表单数据
      userForm: {
        user_name: "",
        user_psd: "",
        email: "",
        phone: "",
      },
      // 添加表单的验证规则对象
      userFormRules: {
        user_name: [
          {
            required: true,
            message: "请输入账号",
            trigger: "blur"
          }
        ],
        user_psd: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          },
          {
            min: 3,
            max: 20,
            message: "密码长度在1-20字符之间",
            trigger: "blur"
          }
        ],
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
      editForm: {
        user_id: "",
        user_name: "",
        user_psd: "",
        email: "",
        phone: ""
      },
      editFormRules: {
        user_psd: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          },
          {
            min: 5,
            max: 20,
            message: "密码长度在5-20字符之间",
            trigger: "blur"
          }
        ],
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
      pwdType: ''
    };
  },
  watch: {},
  methods: {
    showPwd() {
      this.pwdType === "password"
        ? (this.pwdType = "")
        : (this.pwdType = "password");
      let e = document.getElementsByClassName("el-icon-view")[0];
      this.pwdType == ""
        ? e.setAttribute("style", "color: #409EFF")
        : e.setAttribute("style", "color: #c0c4cc");
    },
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
    showEditDialog(id) {
       console.log(id);
      this.editDialogVisible = true;
      let url = "/manage/admindata";
      this.$http
        .post(url, {
            method: "getAdminById",
            id: id
        })
        .then(res => {
          this.editForm = res.data.list[0];
           console.log(res);
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 确认编辑成功
    confirmEdit() {
      // console.log(data);
      this.editDialogVisible = false;
      // this.$http.post('http://101.37.83.223:8181/AdminServlet',{

      //     method: "updateAdmin",
      //     id: this.editForm.id,
      //     account: this.editForm.account,
      //     password: this.editForm.password

      // }
      // )
      //   .then(res => {
      //     console.log(res);
      //     this.$message({
      //       showClose: true,
      //       type: "success",
      //       message: "修改成功!"
      //     });
      //     this.getUserList();
      //   })
      //   .catch(err => {
      //     console.log(err);
      //     this.$message({
      //       showClose: true,
      //       type: "error",
      //       message: "修改失败!"
      //     });
      //   });
      let url = "/manage/admindata";
      this.$http
        .post(url, {
            method: "updateAdmin",
            user_id: this.editForm.user_id,
            user_name: this.editForm.user_name,
            user_psd: this.editForm.user_psd,
            email: this.editForm.email,
            phone: this.editForm.phone,

        })
        .then(res => {
          this.$message({
            showClose: true,
            type: "success",
            message: "修改成功!"
          });
          this.getUserList();
        })
        .catch(err => {
          console.log(err);
          this.$message({
            showClose: true,
            type: "error",
            message: "修改失败!"
          });
        });
    },

    //删除
    deleteReport(user_id) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let url = "/manage/admindata";
          this.$http
            .post(url, {

                method: "deleteAdmin",
                user_id: user_id
              
            })
            .then(res => {
              this.$message({
                showClose: true,
                type: "success",
                message: "删除成功!"
              });
              this.getUserList();
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

    // 点击按钮添加新用户
    addUser() {
      let url = "/manage/admindata";
      this.$http
        .post(
          url,
          {
              method: "addAdmin",
              user_name: this.userForm.user_name,
              user_psd: this.userForm.user_psd,
              email: this.userForm.email,
              phone: this.userForm.phone,
            
          }
          // { emulateJSON: true }
        )
        .then(res => {
          if (res.status !== 200) {
            this.$message.error("添加失败");
          } else {         
            if(res.data.code==0){
                this.$message.success("账号已经存在");
            }
            else{
               this.$message.success("添加成功");
            }
           
          }
        });
      // .catch(err => {
      //   this.$message.error("添加数据失败");
      // });
      this.addDialogVisible = false;
      //重新获取用户列表数据
      this.getUserList();
    },

    // 通过名称搜索数据
    serachData() {
      if (this.queryData == "") {
        this.getUserList();
      } else {
        let url = "/manage/admindata";
        this.$http
          .post(url, {
              method: "getAdminByAccount",
              user_name: this.queryData
          })
          .then(res => {
            this.userList = res.data.list;
            this.totalCount = res.data.totalCount;
          });
      }
    },

    //获取管理人员列表
    getUserList() {
      let url = "/manage/admindata";
      this.$http
        .get(url, {
          params: {
            method: "getAllAdmins",
            currentPage: this.currentPage,
            currentCount: this.currentCount
          }
        })
        .then(res => {
          // console.log(res.data.list);
          this.userList = res.data.list;
          this.totalCount = res.data.totalCount;
          // for(var i = 0; i <= userList.length; i ++) {
          //   var type = userList[3];
          //   if(type === 1) {
          //   this.authority = "管理员";
          // }else {
          //   this.authority = "超级管理员";
          // }
          // }
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
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
.el-dialog__body {
  padding-bottom: 10px !important;
}
.el-table {
  margin-top: 15px;
  font-size: 12px;
}
</style>
