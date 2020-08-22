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

            clearable
          >
          <!--  @focus="jadgeIsSelect" -->
            <el-select
              v-model="selectValue"
              slot="prepend"
              placeholder="请选择"
  
            >
            <!--             @change="selectChange" -->
              <el-option label="产品类型" value="product_type"></el-option>
              <el-option label="数据格式" value="data_type"></el-option>
              <el-option label="数据功能贡献者" value="user_name"></el-option>
              <!-- <el-option label="上传者姓名" value="uper_name"></el-option> -->
            </el-select>
            <el-button slot="append" icon="el-icon-search" @click="searchData()"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 数据列表展示区域 -->
      <el-table :data="BasicDataList" border stripe>
        <el-table-column type="index" label="id"></el-table-column>
        <el-table-column prop="data_name" label="资源名称"></el-table-column>
        <el-table-column prop="product_type" label="产品类型"></el-table-column>
        <el-table-column prop="data_type" label="数据格式"></el-table-column>
        <el-table-column prop="data_time" :formatter="formatTime"  label="上传时间"></el-table-column>
        <el-table-column prop="user_name" label="数据贡献者"></el-table-column>
        <el-table-column prop="is_open" :formatter="formatBoolean"  label="是否公开"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip
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
                @click="showDialog(scope.row.result_url)"
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

    <!-- 图片预览 -->
    <el-dialog title="图片预览" :visible.sync="DialogVisible" :close-on-click-modal="false" width="60%">
     <div class="img">
         <img :src="imgurl" alt="" style="width:100%; ">
     </div>
    
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
      imgurl: ""
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

    //格式转换
    formatBoolean: function (row, column, cellValue) {
                var ret = ''  //你想在页面展示的值
                if (cellValue) {
                    ret = "是"  //根据自己的需求设定
                } else {
                    ret = "否"
                }
                return ret;

    },
    //时间的格式转换
    formatTime: function (row, column, cellValue) {
                 var ret = ''  //你想在页面展示的值
                // if (cellValue) {
                //     ret = "是"  //根据自己的需求设定
                // } else {
                //     ret = "否"
                // }
                  var json_date = new Date(cellValue).toJSON();
                  ret=new Date(new Date(json_date) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '') ;
                return ret;

    },



    // 查询数据
    searchData() {
      this.$http
        .get("/productdata", {
          params: {
            method: "getDataByKey",
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
           this.$message({
            type: "success",
            message: "查询成功"
          });
        })
        .catch(res => {
          this.$message({
            type: "warning",
            message: "请先选择分类体系"
          });
        });
    },
    //删除
    // deleteBasicData(id) {
    //   this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning"
    //   })
    //     .then(() => {
    //       this.$http
    //         .get("/DMServlet", {
    //           params: {
    //             method: "deleteDataById",
    //             id: id
    //           }
    //         })
    //         .then(res => {
    //           if (res.data["删除基础信息表中记录:"]) {
    //             this.$message({
    //               type: "success",
    //               message: "删除成功!"
    //             });
    //             this.getBasicData();
    //           } else {
    //             this.$message.error("删除失败！");
    //           }
    //         });
    //     })
    //     .catch(() => {
    //       this.$message({
    //         type: "info",
    //         message: "已取消删除"
    //       });
    //     });
    // },
    // 获取数据
    getBasicData() {
      this.$http
        .get("/productdata", {
          params: {
            method: "getproductdata",
            currentPage: this.currentPage,
            currentCount: this.currentCount
          }
        })
        .then(res => {
          // for (var i = 0; i < res.data.list.length; i++) {
          //   res.data.list[i].up_time = this.timestampToTime(
          //     res.data.list[i].up_time
          //   );
          // }
          this.BasicDataList = res.data.list;
          this.totalCount = res.data.totalCount;
        });
    },
    //预览
    showDialog(id) {
      console.log(id);
      this.imgurl=id
      // this.$http
      //   .get("/productdata", {
      //     params: {
      //       result_id: id,
      //       method:"getimgbyid"
      //     }
      //   })
      //   .then(res => {
      //     if (res.data.length > 0) {
      //       this.newsContent = res.data[0].news_cont;
      //     }
      //   })
      //   .catch(err => {
      //     this.$message.error("请求数据失败");
      //   });
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
.img{
  padding:0 
}
</style>
