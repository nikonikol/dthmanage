<template>
  <div class="dataList_box">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>后台管理</el-breadcrumb-item>
      <el-breadcrumb-item>数据管理</el-breadcrumb-item>
      <el-breadcrumb-item>数据列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="10">
        <el-col :span="8">
          <el-input
            :placeholder="taggleContentTips"
            v-model="key"
            class="input-with-select"
            @clear="getBasicData()"
            @focus="jadgeIsSelect"
            clearable
          >
            <el-select
              v-model="selectValue"
              slot="prepend"
              placeholder="请选择"
              @change="selectChange"
            >
              <el-option label="资源名称" value="NAME"></el-option>
              <el-option label="空间位置" value="sploc"></el-option>
              <el-option label="主题词" value="topic_w1"></el-option>
              <el-option label="上传者姓名" value="uper_name"></el-option>
            </el-select>
            <el-button slot="append" icon="el-icon-search" @click="searchData()"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 数据列表展示区域 -->
      <el-table :data="BasicDataList" border stripe>
        <el-table-column type="index" label="id"></el-table-column>
        <el-table-column prop="name" label="资源名称"></el-table-column>
        <el-table-column prop="sploc" label="空间位置"></el-table-column>
        <el-table-column prop="da_size" label="数据大小"></el-table-column>
        <el-table-column prop="up_time" label="上传时间"></el-table-column>
        <el-table-column prop="uper_name" label="数据贡献者"></el-table-column>
        <el-table-column prop="uper_place" label="工作单位"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- <el-tooltip
              class="item"
              effect="dark"
              content="预览"
              placement="top-start"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-search"
                size="mini"
                @click="showDialog(scope.row.id)"
              ></el-button>
            </el-tooltip>-->
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
                :disabled="false"
                @click="deleteBasicData(scope.row.id)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页效果 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5,6,7,8,9,10]"
        :page-size="currentCount"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
      ></el-pagination>
    </el-card>

    <!-- 新闻查看 -->
    <el-dialog title="新闻预览" :visible.sync="DialogVisible" :close-on-click-modal="false" width="60%">
      <div v-html="newsContent"></div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      key: "",
      BasicDataList: [], //总数据列表
      totalCount: 0, // 总数据条数
      currentPage: 1,
      currentCount: 6,
      DialogVisible: false,
      taggleContentTips: "请先选择查询条件",
      selectValue: "",
      newsContent: ""
    };
  },
  watch: {},
  methods: {
    handleSizeChange(val) {
      this.currentCount = val;
      this.getBasicData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getBasicData();
    },
    //判断是否选择查询类别
    jadgeIsSelect() {
      if (this.selectValue == "") {
        this.$message({
          type: "warning",
          message: "请先选择分类体系"
        });
        return;
      }
    },
    // 下拉选择
    selectChange(val) {
      if (val == "NAME") {
        this.taggleContentTips = "请输入资源名称";
      } else if (val == "sploc") {
        this.taggleContentTips = "请输入空间位置";
      } else if (val == "topic_w1") {
        this.taggleContentTips = "请输入专题词";
      } else if (val == "uper_name") {
        this.taggleContentTips = "请输入上传者姓名";
      }
    },
    // 查询数据
    searchData() {
      this.$http
        .get("/DMServlet", {
          params: {
            method: "showDataByKey",
            value: this.key,
            key: this.selectValue
          }
        })
        .then(res => {
          for (var i = 0; i < res.data.list.length; i++) {
            res.data.list[i].up_time = this.timestampToTime(
              res.data.list[i].up_time
            );
          }
          this.BasicDataList = res.data.list;
          this.totalCount = res.data.totalCount;
        })
        .catch(res => {
          this.$message({
            type: "warning",
            message: "请先选择分类体系"
          });
        });
    },
    //删除
    deleteBasicData(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http
            .get("/DMServlet", {
              params: {
                method: "deleteDataById",
                id: id
              }
            })
            .then(res => {
              if (res.data["删除基础信息表中记录:"]) {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                this.getBasicData();
              } else {
                this.$message.error("删除失败！");
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 获取数据
    getBasicData() {
      this.$http
        .get("/DMServlet", {
          params: {
            method: "showDataByKey",
            currentPage: this.currentPage,
            currentCount: this.currentCount
          }
        })
        .then(res => {
          for (var i = 0; i < res.data.list.length; i++) {
            res.data.list[i].up_time = this.timestampToTime(
              res.data.list[i].up_time
            );
          }
          this.BasicDataList = res.data.list;
          this.totalCount = res.data.totalCount;
        });
    },
    //预览
    showDialog(id) {
      this.$http
        .get("/newsContent", {
          params: {
            id: id
          }
        })
        .then(res => {
          if (res.data.length > 0) {
            this.newsContent = res.data[0].news_cont;
          }
        })
        .catch(err => {
          this.$message.error("请求数据失败");
        });
      this.DialogVisible = true;
    },
    deleteImage(html) {
      let nowimgs = this.getSrc(html);
      let merge = nowimgs.filter(function(v, i, arr) {
        return arr.indexOf(v) === arr.lastIndexOf(v);
      });
      for (let x in merge) {
        let colds = merge[x].split("/");
        let imgName = colds[i - 1];
        this.$http
          .get("/NewsServlet", {
            params: {
              method: "deletePictures",
              picNames: imgName
            }
          })
          .then(res => {});
      }
    },
    getSrc(html) {
      var imgReg = /<img.*?(?:>|\/>)/gi;
      // 匹配src属性
      var srcReg = /src=[\\"]?([^\\"]*)[\\"]?/i;
      var arr = html.match(imgReg);
      let imgs = [];
      if (arr) {
        for (let i = 0; i < arr.length; i++) {
          var src = arr[i].match(srcReg)[1];
          imgs.push(src);
        }
      }
      return imgs;
    },
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
    }
  },
  mounted() {
    this.getBasicData();
  },
  created() {}
};
</script>
<style >
.el-select .el-input__inner {
  width: 120px !important;
}
</style>
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
