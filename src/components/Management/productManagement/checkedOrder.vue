<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>后台管理</el-breadcrumb-item>
      <el-breadcrumb-item>专题数据管理</el-breadcrumb-item>
      <el-breadcrumb-item>专题数据发布审核</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-table
        :data="tableData"
        style="width: 100%"
        border
        stripe
        height="500px"
      >
        <el-table-column
          prop="data_name"
          align="center"
          label="影像名称"
        ></el-table-column>
        <el-table-column prop="litimg_url" align="center" label="影像预览">
          <template slot-scope="scope">
            <el-button
              @click="lookImg(scope.row.litimg_url)"
              type="primary"
              icon="el-icon-picture-outline"
              size="mini"
            ></el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="user_name"
          align="center"
          label="上传用户"
        ></el-table-column>
        <el-table-column
          prop="post_time"
          align="center"
          label="上传时间"
        ></el-table-column>
        <el-table-column prop="result_check" align="center" label="审核意见">
          <template slot-scope="scope">
            <el-select
              @change="changeSelect(scope.row.result_id)"
              v-model="state[scope.row.result_id]"
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column align="center" label="备注说明">
          <template slot-scope="scope">
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
              @change="changeWrite(scope.row.result_id)"
              v-model="state2[scope.row.result_id]"
              maxlength="30"
              show-word-limit
              clearable
            >
            </el-input>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button @click="keep(scope.row.result_id)" type="primary"
              >保存</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 原图查看 -->
    <el-dialog
      title="原图查看"
      :append-to-body="true"
      :visible.sync="dialogVisible"
      :close-on-click-modal="true"
      width="60%"
    >
      <div class="img">
        <img :src="imgurl" alt style="width: 100%" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  // let legend_url = imgurl.split(".png")[0]+"_legend.png"
  data() {
    return {
      dialogVisible: false, //查看影像框，默认隐藏
      tableData: [], //接受返回的数据
      Url: "", //影像快视图地址
      options: [
        {
          value: "1",
          label: "通过",
        },
        {
          value: "0",
          label: "不通过",
        },
      ],
      state: {}, //捕捉下拉框状态
      state2: {}, //捕捉下拉框状态
      value: "", //获取选项状态
      imgurl: "",
      describe: "", //数据库属性
      check_message: "", //备注
      result_check: "",
    };
  },
  created() {},
  mounted() {
    this.getChecklist();
    this.tableData.forEach((item) => {
      this.$set(this.state, item.id, ""); // 父、  子、  子的赋值
    });
    this.tableData.forEach((item) => {
      this.$set(this.state2, item.id, ""); // 父、  子、  子的赋值
    });
  },
  methods: {
    // 时间格式化
    timestampToTime(timestamp) {
      var date = new Date(timestamp);
      var Y = date.getFullYear() + "-";
      var M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      var D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      return Y + M + D;
    },

    //获取选中的审核结果值
    changeSelect(id) {
      console.log(id, this.state[id]);
    },
    //获取每行备注的值
    changeWrite(id) {
      console.log(id, this.state2[id]);
    },

    //保存编辑后提交数据库
    keep(id) {
      let user_name = window.atob(sessionStorage.getItem("token"));
      console.log("在此处获取要传递的值：");
      console.log(this.state[id], this.state2[id]);
      console.log("影像的id" + id);
      //提交之前判断是否选项都有值

      if (
        typeof this.state[id] == "undefined" ||
        this.state[id] == null ||
        this.state[id] == ""
      ) {
        this.$message({
          type: "warning",
          message: "没有选择审核意见，请选择",
        });
        return;
      } else if (
        typeof this.state2[id] == "undefined" ||
        this.state2[id] == null ||
        this.state2[id] == ""
      ) {
        this.$message({
          type: "warning",
          message: "备注说明为必填项，请输入",
        });
        return;
      } else {
        this.$http
          .post("/updatechecklist", {
            id: id, //影像id
            username: user_name, //管理员名
            resultcheck: this.state[id], //审核结果
            message: this.state2[id], //备注内容
            check: 1, //处理完标志位
          })
          .then((res) => {
            this.$message({
              type: "success",
              message: "保存成功，数据已入库",
            });
            this.getChecklist(); //刷新列表
          })
          .catch((response) => {
            this.$alert(response, "请求错误", {
              confirmButtonText: "确定",
            });
          });
      }
    },

    handleSizeChange(val) {},
    handleCurrentChange(val) {},
    // 审核信息
    handleValue(val, userId, dataId) {
      if (val) {
        this.isState = "关闭权限";
        this.idDisabled = true;
        this.$http
          .get("/updateConfOrder", {
            params: {
              u_id: userId,
              data_id: dataId,
              orderStatus: 2,
            },
          })
          .then((res) => {
            this.getOrderData();
            this.$message({
              type: "success",
              message: "审核通过",
            });
          });
      }
    },
    previewDialog(item) {
      this.dialogVisible = true;
      this.tempPurposeData = item;
    },
    imageDialog(item) {
      this.imagedialogVisible = true;
      this.tempImageUrl = item.proofUrl;
    },
    // getOrderData() {
    //   this.$http
    //     .get("/ShowDAimServlet", {
    //       params: {
    //         status: 2,
    //       },
    //     })
    //     .then((res) => {
    //       for (var i = 0; i < res.data.length; i++) {
    //         var tempTotalData = Object.assign(
    //           res.data[i].user,
    //           res.data[i].downaim,
    //           res.data[i].basicInfo
    //         );
    //         tempTotalData.orderCode = res.data[i].orderCode;
    //         this.tableData.push(tempTotalData);
    //       }
    //     });
    // },

    //获取数据，加载列表
    //获取数据库中数据
    getChecklist() {
      // console.log(user_name);
      this.$http
        .get("/checklistdata", {
          params: {},
        })
        .then((res) => {
          for (var i = 0; i < res.data.list.length; i++) {
            res.data.list[i].data_time = this.timestampToTime(
              res.data.list[i].data_time
            );
          }
          // console.log(res);
          this.tableData = res.data.list;
          console.log(res.data.list);
          // this.totalCount = res.data.totalCount;
          // this.$message({
          //   type: "success",
          //   message: "数据更新成功",
          // });
        });
      // .catch((res) => {
      //   // this.$message({
      //   //   type: "warning",
      //   //   message: "请先选择分类体系",
      //   // });
      // });
    },

    //原图查看
    lookImg(url) {
      console.log("图片地址为：");
      console.log(url);
      this.dialogVisible = true;
      this.imgurl = url;
    },
  },
};
</script>

<style scoped>
.purpose_note {
  list-style: none;
  margin: 0px;
  padding: 0px;
  font-size: 14px;
}
.purpose_note label {
  padding-left: 20px;
}
.el-row {
  padding: 15px;
}
</style>

