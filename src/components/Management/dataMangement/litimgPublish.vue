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
 

      <el-table
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
        <el-table-column prop="raster_id" label="数据id"></el-table-column>
        <el-table-column prop="raster_name" label="文件名称"></el-table-column>
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
<!-- 
      <div style="margin: 20px">
        <el-button @click="toggleSelection()">取消选择</el-button>
      </div> -->


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
      // data:[],
      rasterList: [],
      multipleSelection: [],
      currentPage: 1,
      currentCount: 5,
      totalCount: 0, // 总数据条数
    };
  },
  watch: {
   
  },
  created() {

  },
  mounted() {
    this.getDataList()
  },
  methods: {
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
      /**
       * 1.获取
       */
      fileList = JSON.stringify(fileList);
      let satelitestr = this.SateliteOption[this.value1 - 1].satelite;
      let _this = this;
      //上传数据
      this.$http
        .get("/datamanage/publish", {
          params: {
            method: "uploadraster",
            user_id,
            fileList: fileList,
            satelitestr,
            sensor: this.value2,
            reso_time: this.value3,
            reso_space: this.value4,
          },
        })
        .then((res) => {
          console.log(res.data);
          if (res.data.code == 1) {
            this.$message({
              type: "success",
              message: "数据入库成功",
            });
          }
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
    //获取未生成快视图的数据
    getDataList() {
      this.$http
        .get("/rasterdata/getrastertopng", {
          params: {
            currentPage: this.currentPage,
            currentCount: this.currentCount
          },
        })
        .then((res) => {
          this.rasterList = res.data.list;
          this.totalCount = res.data.totalCount;
        });
    },
        //   监听pagesize的改变
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.currentCount = val;
      this.getDataList();
    },
    //监听页码值的改变
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.getDataList();
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
