<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>后台管理</el-breadcrumb-item>
      <el-breadcrumb-item>数据管理</el-breadcrumb-item>
      <el-breadcrumb-item>标准产品入库</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="datamanagement">
      <!-- <span>
        带
        <b style="color:red">*</b>号的栏目，必须填写相应内容
      </span>-->
      <div class="k-header-plain">
        <h2>
          标准产品
          <span>
            <em>(请选择要查询的产品)</em>
          </span>
        </h2>
      </div>
      <!-- 设置基本元数据信息 -->
      <div class="setBaseInfo">
        <div class="el-row" type="flex" :gutter="10"></div>
        <el-row :gutter="10" type="flex">
          <el-col :xs="4" :sm="4" :md="4" :lg="2" :xl="2">
            <span class="requiredItem">产品名称</span>
          </el-col>
          <el-col :xs="4" :sm="4" :md="4" :lg="6" :xl="6">
            <el-select
              v-model="productvalue"
              @change="productNameHandle"
              placeholder="请选择"
              filterable
              default-first-option
              allow-create
            >
              <el-option
                v-for="item in ProductList"
                :key="item.filename"
                :label="item.filename"
                :value="item.filename"
              ></el-option>
            </el-select>
          </el-col>

          <el-col :xs="4" :sm="4" :md="4" :lg="2" :xl="2">
            <span class="requiredItem">产品分类</span>
          </el-col>
          <el-col :xs="4" :sm="4" :md="4" :lg="6" :xl="6">
            <el-select placeholder="请选择" v-model="Classvalue" @change="handleClassChange" clearable>
              <el-option
                v-for="item in classList"
                :key="item.filename"
                :label="item.filename"
                :value="item.filename"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :xs="4" :sm="4" :md="4" :lg="2" :xl="2">
            <span class="requiredItem">时间（可选）</span>
          </el-col>
          <el-col :xs="4" :sm="4" :md="4" :lg="6" :xl="6">
            <el-select placeholder="请选择" v-model="Timevalue" @change="handleTimeChange" clearable>
              <el-option
                v-for="item in timeDataList"
                :key="item.filename"
                :label="item.filename"
                :value="item.filename"
              ></el-option>
            </el-select>
          </el-col>
        </el-row>
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
        <el-table-column prop="filename" label="文件名称"></el-table-column>
        <el-table-column prop="path" label="文件路径"></el-table-column>
      </el-table>
      <div style="margin: 20px">
        <el-button @click="toggleSelection()">取消选择</el-button>
      </div>

      <!-- 上传数据文档、缩略图等文件 -->
      <div class="upload_box">
        <el-row justify="end" type="flex" class="public_box">
          <el-button @click="resFiled()">重置</el-button>
          <el-button @click="publicData()">发布数据</el-button>
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
      classList: "",
      user_name: window.atob(window.sessionStorage.getItem("token")),
      ProductList: [],
      labelDialogVisible: false,
      rasterList: [],
      productvalue: "", //产品名称
      Classvalue: "", //产品类别
      Timevalue: "", //时间文件夹
      value4: "", //空间分辨率
      multipleSelection: [],
      timeDataList:[],
    };
  },
  watch: {
    productvalue(val) {},
  },
  created() {},
  mounted() {
    //获取文件列表，三级目录
    this.getProductList();
  },
  methods: {
    //
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
    //产品类别的变化 
     /**
       * 继续请求服务器
       * 请求三级目录的值或者直接得到数据列表
       */
    handleClassChange(value) {
      //alert(this.productvalue)
      // if(value==""){
      //   alert("return")
      //   return
      // }
        this.$http
        .post("/product/publish", {
          method: "getProductortimeList",
          productName:this.productvalue,
          className: value,
        })
        .then((res) => {
          console.log(res.data);
          // this.ProductList= res.data.list;
           let istimedata= res.data.istimedata;
          if(istimedata){
            //给第三级目录赋值
            this.timeDataList=res.data.timedataList
          }
          else{
            this.rasterList=res.data.productList
          }
        })
        .catch((response) => {
          this.$alert(response, "请求错误", {
            confirmButtonText: "确定",
          });
        });
    },
    handleTimeChange(value) {
      //alert(this.productvalue)
        this.$http
        .post("/product/publish", {
          method: "getProductList",
          productName:this.productvalue,
          className: this.Classvalue,
          Timevalue: value
        })
        .then((res) => {
          console.log(res.data);
          // this.ProductList= res.data.list;
           let istimedata= res.data.istimedata;
          if(istimedata){
            //给第三级目录赋值
            this.timeDataList=res.data.timedataList
          }
          else{
            this.rasterList=res.data.productList
          }
        })
        .catch((response) => {
          this.$alert(response, "请求错误", {
            confirmButtonText: "确定",
          });
        });
    },
      /**
       * 继续请求服务器
       * 得到二级目录的值
       */
    productNameHandle(value) {
      //清空其他选项
      this.Classvalue=""
      this.Timevalue=""
      this.rasterList=[]
      this.$http
        .post("/product/publish", {
          method: "getProductClassList",
          productName: value,
        })
        .then((res) => {
          console.log(res.data);
          this.classList = res.data.classList;
          // this.ProductList= res.data.list;
          // let istimedata= res.data.istimedata;
          // if(istimedata){

          // }
          // else{
          //   this.rasterList=res.data.productList
          // }
        })
        .catch((response) => {
          this.$alert(response, "请求错误", {
            confirmButtonText: "确定",
          });
        });
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
    // 重置数据
    resFiled() {
      this.productvalue = "";
      this.value2 = "";
      this.value3 = "";
      this.value4 = "";
      rasterList = [];
    },

    // 发布数据
    publicData() {
      //判断是否必选的已选完。
      let productsList = this.multipleSelection;
      let user_id = window.atob(window.sessionStorage.getItem("user_id"));
      if (productsList.length == 0) {
        this.$message({
          type: "warning",
          message: "请选择上传数据",
        });
        return;
      }
      productsList = JSON.stringify(productsList);
      // let _this = this;
      //上传数据
      this.$http
        .post("/product/publish", {
            method: "uploadproduct",
            user_id,
            productsList: productsList
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
          this.$alert(response, "请求错误", {
            confirmButtonText: "确定",
          });
        });
    },

    getProductList() {
      //给ProductList赋值
      this.$http
        .post("/product/publish", {
          method: "getProductNameList",
        })
        .then((res) => {
          this.ProductList = res.data.list;
        })
        .catch((response) => {
          this.$alert(response, "请求错误", {
            confirmButtonText: "确定",
          });
        });
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
