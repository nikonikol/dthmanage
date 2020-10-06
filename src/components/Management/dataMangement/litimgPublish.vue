<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>后台管理</el-breadcrumb-item>
      <el-breadcrumb-item>数据管理</el-breadcrumb-item>
      <el-breadcrumb-item>快视图的生成</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="datamanagement">
      <div class="k-header-plain">
        <h2>
          需要生成快视图的数据
          <span>
            <em>(生成一个快视图大约需要一分钟，请预估所需时间)</em>
          </span>
        </h2>
      </div>
      <el-row :gutter="10" type="flex">
        <el-col :xs="4" :sm="4" :md="4" :lg="2" :xl="1">
          <span class="requiredItem">数据类别</span>
        </el-col>
        <el-col :xs="4" :sm="4" :md="4" :lg="6" :xl="6">
          <el-select
            placeholder="请选择数据类别"
            v-model="Classvalue"
            @change="handleClassChange"
            clearable
          >
            <el-option
              v-for="item in classList"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-table
        v-loading="loading"
        ref="multipleTable"
        :data="rasterList"
        tooltip-effect="dark"
        style="width: 100%"
        border:true
        max-height="60%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <!-- <el-table-column
            label="日期"
            width="120">
            <template slot-scope="scope">{{ scope.row.date }}</template>
        </el-table-column>-->
        <el-table-column prop="raster_name" label="数据名称"></el-table-column>
        <el-table-column prop="data_time" label="时间"></el-table-column>
      </el-table>
      <!-- 分页效果 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[1, 5, 10]"
        :page-size="currentCount"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
      ></el-pagination>
      <!-- 
      <div style="margin: 20px">
        <el-button @click="toggleSelection()">取消选择</el-button>
      </div>-->
      <!-- <el-progress type="circle" :percentage="100" status="success"></el-progress> -->
      <div class="row" style="margin: 20px" v-if="showprogress">
        <el-progress
          :text-inside="true"
          :stroke-width="34"
          :percentage="progress"
          :status="status"
        ></el-progress>
        <!-- <el-progress :text-inside="true" :stroke-width="34" :percentage="progress" :status="taskStatue"></el-progress> -->
      </div>

      <!-- 上传数据文档、缩略图等文件 -->
      <div class="upload_box">
        <el-row justify="end" type="flex" class="public_box">
          <el-button @click="toggleSelection()">重置</el-button>
          <el-button @click="publicData()">生成快视图</el-button>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
// import majar from "./subjectData.js";
export default {
  data() {
    return {
      user_name: window.atob(window.sessionStorage.getItem("token")),
      rasterList: [],
      multipleSelection: [], //存选择的原始图像
      currentPage: 1,
      currentCount: 5,
      totalCount: 0, // 总数据条数
      classList: [
        { name: "标准产品的快视图生成" },
        { name: "原始影像的快视图生成" },
      ],
      Classvalue: "",
      loading: false,
      progress: 0,
      taskStatue: "",
      showprogress: false,
      status:""
    };
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    //处理分类的变化
    handleClassChange(value) {
      this.rasterList = [];
      this.totalCount = 0;
      if (value == "标准产品的快视图生成") {
        this.getproductList();
      } else if (value == "原始影像的快视图生成") {
        this.getrasterList();
      }
    },
    //取消选择
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    //监测选项的变化
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log("选择的原始影像数据为:");
      console.log(this.multipleSelection);
    },
    // 获取当前时间
    getTime(index, timeData) {
      if (index == 1) {
        var now = new Date();
      } else {
        var now = new Date(timeData);
      }
      var year = now.getFullYear();
      var month = now.getMonth() + 1;
      var date = now.getDate();
      var hour = now.getHours();
      var minu = now.getMinutes();
      var sec = now.getSeconds();
      if (month < 10) month = "0" + month;
      if (date < 10) date = "0" + date;
      if (hour < 10) hour = "0" + hour;
      if (minu < 10) minu = "0" + minu;
      if (sec < 10) sec = "0" + sec;
      var time = "";

      time = year + "-" + month + "-" + date;

      this.postObj.basic_info.up_time = time;
    },
    // 格式化时间范围
    selectYear(val) {
      if (!val) {
        this.postObj.basic_info.datm_range = "";
        return;
      }
      this.postObj.basic_info.datm_range = "";
      for (var i = 0; i < val.length; i++) {
        val[i] = val[i] + "年";
      }
      this.postObj.basic_info.datm_range = val.join("-");
    },
    // 重置数据
    resFiled() {
      rasterList = [];
    },
    // 发布数据
    publicData() {
      //判断是否必选的已选完。
      let fileList = this.multipleSelection;
      let user_id = window.atob(window.sessionStorage.getItem("user_id"));
      if (fileList.length == 0) {
        this.$message({
          type: "warning",
          message: "请选择处理数据",
        });
        return;
      }
      fileList = JSON.stringify(fileList);
      let _this = this;
      this.loading = true;
      //上传数据
      this.$http
        .post("/getquickimg", {
          rasterList: fileList,
        })
        .then((res) => {
          this.loading = false;
          this.showprogress = true;
          console.log(res.data);
          let { jobId, progress } = res.data;
          console.log("收到回调");
          console.log(jobId, progress);
          this.taskStatue = "";
          var statusURL = window.imgBaseUrl + "/ese/jobs/" + jobId + "/status";
          this.poll(statusURL);
          // if (res.data.code == 1) {
          //   this.$message({
          //     type: "success",
          //     message: "快视图生成成功",
          //   });
          // }
          //   this.rasterList = res.data.list;
          //   this.rasterList.forEach(element => {
          //     element.filepath="/rootdata/"+this.SateliteOption[this.value1-1].satelite+"/"+element.filename
          //   });
        })
        .catch((response) => {
          _this.$alert(response, "请求错误", {
            confirmButtonText: "确定",
          });
        });
    },
    poll(statusURL) {
      let _this = this;
      function getStatus(statusURL) {
        _this.$http
          .get(statusURL)
          .then((response) => {
            let json = response.data;
            if (
              json.jobStatus === "esriJobSubmitted" ||
              json.jobProgress == 0 ||
              json.jobStatus === "esriJobExecuting"
            ) {
              _this.progress = json.jobProgress;
              console.log("---------------", _this.progress);
              setTimeout(getStatus(statusURL), 1000);
            } else if (json.jobStatus === "esriJobSucceeded") {
              //_this.taskStatue = "success";
              console.log(json.results);
              console.log("取出数据的长度：");
              console.log(_this.multipleSelection.length);

              // console.log(json.results[0]);

              // 拿到task的输出参数 数据入库
              let litimgurl_arr = [];
              let litimgurl_arr2 = [];
              for (let i = 0; i < _this.multipleSelection.length; i++) {
                let str =
                  "json.results[0].value.elements.out_opt" +
                  i +
                  ".dehydratedForm";
                console.log(eval(str).elements.LocalPngFileURL.dehydratedForm);
                console.log(eval(str).elements.MapExtent.dehydratedForm[0][0]);
                let url = eval(str).elements.LocalPngFileURL.dehydratedForm;
                let maxplat = eval(str).elements.MapExtent.dehydratedForm[0][0];
                let maxplon = eval(str).elements.MapExtent.dehydratedForm[0][1];
                let minplat = eval(str).elements.MapExtent.dehydratedForm[1][0];
                let minplon = eval(str).elements.MapExtent.dehydratedForm[1][1];
                //如果选择标准产品就会报错
                // let { raster_id } = _this.multipleSelection;
                // console.log("获取raster_id：");
                let raster_id = _this.multipleSelection[i].raster_id;
                let result_id = _this.multipleSelection[i].raster_id;
                // let { raster_id } = _this.multipleSelection;

                let obj = {
                  url,
                  maxplat,
                  maxplon,
                  minplat,
                  minplon,
                  raster_id,
                };
                litimgurl_arr.push(obj);
                let obj2 = {
                  url,
                  maxplat,
                  maxplon,
                  minplat,
                  minplon,
                  result_id,
                };
                litimgurl_arr2.push(obj2);
              }
              litimgurl_arr = JSON.stringify(litimgurl_arr);
              litimgurl_arr2 = JSON.stringify(litimgurl_arr2);
              if (_this.Classvalue == "原始影像的快视图生成") {
                _this.$http
                  .post("/keepOriginal_image_logs", {
                    litimgurl_arr,
                  })
                  .then((res) => {
                    _this.$message({
                      type: "success",
                      message: "数据已入库",
                    });
                  });
                  _this.status="success"
              } else if (_this.Classvalue == "标准产品的快视图生成") {
                _this.$http
                  .post("/keepProduct_image_logs", {
                    litimgurl_arr2,
                  })
                  .then((res) => {
                    _this.$message({
                      type: "success",
                      message: "数据已入库",
                    });
                  });
                  _this.status="success"
              }
              // console.log("执行成功..............................");
            } else {
              console.log("执行失败........................");
              console.log("执行失败", response.data);
              this.$message({
                type: "warning",
                message: "抱歉，执行任务出错",
              });
              _this.status="exception"
              /**
               * 执行失败，记录入库，产品不入库
               */
              let mothod, productType, JobId, task_log, t_user_id, is_success;
              mothod = "failed";
              litimg_url =
                json.results[0].value.elements.PngFileURL.dehydratedForm;
              productType = 0;
              JobId = json.jobId;
              is_success = 0;
              task_log = "水域面积提取执行失败";
              t_user_id = 1;

              //http://localhost:8086/keep_logs
              _this.$http
                .post("/keep_logs", {
                  mothod,
                  productType,
                  JobId,
                  task_log,
                  t_user_id,
                  is_success,
                })
                .then((res) => {
                  //  this.$message({
                  //     type: "success",
                  //     message: "数据已入库",
                  //   });
                });
            }
          })
          .catch((response) => {
            _this.$alert(response, "请求错误", {
              confirmButtonText: "确定",
            });
          });
      }

      getStatus(statusURL);
    },
    //获取未生成快视图的数据
    getrasterList() {
      this.$http
        .get("/rasterdata/getrastertopng", {
          params: {
            method: "getraster",
            currentPage: this.currentPage,
            currentCount: this.currentCount,
          },
        })
        .then((res) => {
          this.rasterList = res.data.list;
          this.totalCount = res.data.totalCount;
        });
    },
    getproductList() {
      this.$http
        .get("/rasterdata/getrastertopng", {
          params: {
            method: "getproduct",
            currentPage: this.currentPage,
            currentCount: this.currentCount,
          },
        })
        .then((res) => {
          console.log(
            res.data.list,
            "-----------------------------------------------"
          );
          //重新组织一下数据
          let rasterList = [];
          res.data.list.forEach((element) => {
            let obj = {
              raster_name: element.data_name,
              data_time: element.data_time,
              raster_url: element.result_url,
              raster_id: element.result_id,
            };
            rasterList.push(obj);
          });
          this.rasterList = rasterList;
          this.totalCount = res.data.totalCount;
        });
    },
    //   监听pagesize的改变
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.currentCount = val;
      if (this.Classvalue == "标准产品的快视图生成") {
        this.getproductList();
      } else if (this.Classvalue == "原始影像的快视图生成") {
        this.getrasterList();
      }
    },
    //监听页码值的改变
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.currentPage = val;
      if (this.Classvalue == "标准产品的快视图生成") {
        this.getproductList();
      } else if (this.Classvalue == "原始影像的快视图生成") {
        this.getrasterList();
      }
    },
  },
};
</script>

<style>
.el-transfer-panel {
  width: 500px;
  height: 600px;
}
.el-transfer-panel__list.is-filterable {
  height: 400px;
}

.transfer-footer {
  margin-left: 20px;
  padding: 6px 5px;
}
.uploadfiles .el-upload-dragger {
  width: 360px !important;
  height: 40px !important;
  line-height: 40px !important;
}
.uploadfiles .el-upload-list {
  float: right;
}
.uploadfiles .el-form-item__label {
  /* margin: 5px 20px; */
  height: 40px;
  line-height: 40px;
  text-align: center;
}
.uploadfiles .el-form-item {
  margin-bottom: 10px;
}
.setBaseInfo span,
.setDataTags .grid-content {
  border-radius: 4px;
  min-height: 36px;
}
</style>
<style scoped>
.datamanagement {
  width: 100%;
  height: 100%;
  background-color: #fff;
}
.requiredItem {
  float: right;
  line-height: 40px;
}
.setBaseInfo .requiredItem::before,
.setDataTags .requiredItem::before {
  content: "*";
  color: #f56c6c;
  margin-right: 4px;
}
.el-row {
  margin-top: 10px !important;
  margin-left: 20px !important;
}
.k-header-plain {
  margin-top: 10px;
  display: block;
  height: 30px;
  line-height: 30px;
  background: #f5f5f5;
  /* padding: 4px; */
}
.k-header-plain h2 {
  color: #666;
  font: 14px 微软雅黑;
  float: left;
  padding: 4px;
  margin: 0px;
}
em {
  color: #f70;
  margin-left: 20px;
  font-size: 12px;
}
.el-select {
  width: 100% !important;
}
.setDataTags .el-cascader,
.setBaseInfo .el-cascader {
  width: 100% !important;
}
.upload_box {
  margin-top: 20px !important;
  padding-bottom: 40px;
  padding-right: 40px;
}
.public_box {
  padding-right: 50px;
}
.otherTagsBox {
  display: inline-block;
  height: 40px;
  padding-top: 10px;
  font-size: 14px;
  padding-left: 5px;
  color: red;
  vertical-align: middle;
}
.setBaseInfo,
.setDataInfo,
.setDataTags {
  padding-right: 20px;
}
span {
  /* font-size: 14px; */
  font-size: 0.6em;
}
</style>
