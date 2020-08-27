<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>后台管理</el-breadcrumb-item>
      <el-breadcrumb-item>数据管理</el-breadcrumb-item>
      <el-breadcrumb-item>数据发布</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="datamanagement">
      <span>
        带
        <b style="color:red">*</b>号的栏目，必须填写相应内容
      </span>
      <div class="k-header-plain">
        <h2>
          数据基础信息填写
          <span>
            <em>(提交前请确认用户信息准确无误)</em>
          </span>
        </h2>
      </div>
      <!-- 设置基本元数据信息 -->
      <div class="setBaseInfo">
        <div class="el-row" type="flex" :gutter="10">
          <!-- <el-col :xs="6" :sm="4" :md="3" :lg="3" :xl="2">
            <span style="padding:0 15px"  class="requiredItem">数据名称</span>
          </el-col>
          <el-col  :xs="6" :sm="8" :md="9" :lg="9" :xl="10" >
            <el-input placeholder="资源名称" v-model="postObj.basic_info.NAME"></el-input>
          </el-col>-->
        </div>
        <el-row :gutter="10" type="flex">
          <!-- <el-col :xs="5" :sm="4" :md="4" :lg="2" :xl="2">
            <span  style="padding:0 10px"  class="requiredItem">影像时间</span>
          </el-col>
          <el-col :xs="11" :sm="8" :md="4" :lg="6" :xl="6">
            <el-date-picker
              v-model="datatime"
              type="datetime"
              placeholder="选择日期时间"
              align="right"
              :picker-options="pickerOptions"
            ></el-date-picker>
          </el-col>-->

          <el-col :xs="4" :sm="4" :md="4" :lg="2" :xl="2">
            <span class="requiredItem">卫星数据源</span>
          </el-col>
          <el-col :xs="4" :sm="4" :md="4" :lg="6" :xl="6">
            <el-select
              v-model="value1"
              @change="SateliteHandle"
              placeholder="请选择"
              filterable
              default-first-option
              allow-create
            >
              <el-option
                v-for="item in SateliteOption"
                :key="item.value"
                :label="item.satelite"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-col>

          <el-col :xs="4" :sm="4" :md="4" :lg="2" :xl="2">
            <span class="requiredItem">传感器类型</span>
          </el-col>
          <el-col :xs="4" :sm="4" :md="4" :lg="6" :xl="6">
            <!-- <el-cascader :options="subjectOptions" :show-all-levels="false"></el-cascader> -->
            <el-select placeholder="请选择" v-model="value2" @change="handleChange" clearable>
              <el-option
                v-for="item in SensorOption"
                :key="item.value"
                :label="item.value"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-col>
          <!-- <el-col :xs="4" :sm="4" :md="4" :lg="2" :xl="2">
            <span class="requiredItem">波段</span>
          </el-col>-->
          <!-- <el-col :xs="4" :sm="4" :md="4" :lg="6" :xl="6">
            <el-select placeholder="请选择" v-model="value2" @change="handleChange" clearable>
              <el-option
                v-for="item in SensorOption"
                :key="item.value"
                :label="item.value"
                :value="item.value"
                 
              ></el-option>
            </el-select>
          </el-col>-->
        </el-row>

        <el-row :gutter="10" type="flex">
          <el-col :xs="4" :sm="4" :md="4" :lg="2" :xl="2">
            <span class="requiredItem">空间分辨率</span>
          </el-col>
          <el-col :xs="4" :sm="4" :md="4" :lg="6" :xl="6">
            <!-- <el-cascader :options="subjectOptions" :show-all-levels="false"></el-cascader> -->
            <el-select placeholder="请选择" v-model="value4" @change="handleChange" clearable>
              <el-option
                v-for="item in SpatialResolution"
                :key="item.value"
                :label="item.value"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-col>

          <el-col :xs="4" :sm="4" :md="4" :lg="2" :xl="2">
            <span class="requiredItem">时间分辨率</span>
          </el-col>
          <el-col :xs="4" :sm="4" :md="4" :lg="6" :xl="6">
            <!-- <el-cascader :options="subjectOptions" :show-all-levels="false"></el-cascader> -->
            <el-select placeholder="请选择" v-model="value3" @change="handleChange" clearable>
              <el-option
                v-for="item in TimeResolution"
                :key="item.value"
                :label="item.value"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-col>

          <el-col :xs="4" :sm="4" :md="4" :lg="2" :xl="2">
            <span class="requiredItem">上传者</span>
          </el-col>
          <el-col :xs="4" :sm="4" :md="4" :lg="6" :xl="6">
            <el-input placeholder="上传者姓名" v-model="user_name" :disabled="true"></el-input>
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
        <!-- <el-table-column
            label="日期"
            width="120">
            <template slot-scope="scope">{{ scope.row.date }}</template>
        </el-table-column>-->
        <el-table-column prop="filename" label="文件名称"></el-table-column>
        <el-table-column prop="filepath" label="文件路径"></el-table-column>
      </el-table>
      <div style="margin: 20px">
        <!-- <el-button @click="toggleSelection([tableData[1], tableData[2]])">切换第二、第三行的选中状态</el-button> -->
        <el-button @click="toggleSelection()">取消选择</el-button>
      </div>

      <!-- <p style="text-align: center; margin: 0 0 20px">数据列表</p>
  <div style="text-align: center">
    <el-transfer
      style="text-align: left; display: inline-block"
      v-model="value"
      filterable
      :left-default-checked="[1,2,3]"
      :right-default-checked="[]"
      :render-content="renderFunc"
      :titles="['原始数据', '预上传数据']"
      :button-texts="['到左边', '到右边']"
      :format="{
        noChecked: '${total}',
        hasChecked: '${checked}/${total}'
      }"
      @change="handleTranferChange"
      :data="data">
    
    </el-transfer>
      </div>-->
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
        user_name:window.atob(window.sessionStorage.getItem("token")),
        // data:[],
        ProductList:[],
        value: [1],
        value4: [1],
        renderFunc(h, option) {
          return <span>{ option.key } - { option.label }</span>;
        },
      labelDialogVisible: false,
      postObj: {
        // 基础信息表
        basic_info: {
          NAME: "", //发布的资源名称
          docname: "", //文件名
          up_time: "", //上传时间
          point1_lat: "", //点1的纬度
          point1_lon: "", //点1的经度
          point2_lat: "", //点2的纬度
          point2_lon: "", //点2的经度
          da_size: "", //数据大小
          da_url: "", //数据附件本地地址
          up_id: 1, //上传者账号id
          image: "", //缩略图url
          file_url: "", //数据文档地址
          da_source: "", //数据来源
          // da_projection: "", //数据空间投影
        },
      },
      rasterList:[],
      SensorOption: [],
      TimeResolution: [],
      SpatialResolution: [],
      datatime: "",
      tempYearRange: "",
      // 自定义时间器
      pickerOptions: {
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            },
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            },
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            },
          },
        ],
      },

      SateliteOption: [
        {
          value: "1",
          satelite: "FY-3",
          sensor: [{ value: "MERSI" }],
          Tresolution: [{ value: "小于一天" }],
          Sresolution: [
            { value: "250m" },
            { value: "500m" },
            { value: "1000m" },
          ],
        },
        {
          value: "2",
          satelite: "MODIS",
          sensor: [{ value: "Terra/Aqua" }],
          Tresolution: [{ value: "1天" }],
          Sresolution: [
            { value: "250m" },
            { value: "500m" },
            { value: "1000m" },
          ],
        },
        {
          value: "3",
          satelite: "Landsat7",
          sensor: [{ value: "ETM+" }],
          Tresolution: [{ value: "16天" }],
          Sresolution: [{ value: "15m" }, { value: "30m" }],
          //Bands:[{ value: "band1" },{ value: "band2" },{ value: "band3" },{ value: "band4" },{ value: "band5" },{ value: "band6" },{ value: "band7" },{ value: "band8" },{ value: "band9" },{ value: "band10" },{ value: "band11" }]
        },
        {
          value: "4",
          satelite: "Landsat8",
          sensor: [{ value: "OLI/TIRS" }],
          Tresolution: [{ value: "16天" }],
          Sresolution: [{ value: "15m" }, { value: "30m" }],
        },
        {
          value: "5",
          satelite: "Sentinel1",
          sensor: [{ value: "极地轨道C波段雷达成像系统" }],
          Tresolution: [{ value: "6天" }],
          Sresolution: [{ value: "5m×20m" }],
        },
        {
          value: "6",
          satelite: "Sentinel2",
          sensor: [{ value: "MSI" }],
          Tresolution: [{ value: "5天" }],
          Sresolution: [{ value: "10m" }, { value: "20m" }, { value: "60m" }],
        },
        {
          value: "7",
          satelite: "Himawari-8",
          sensor: [{ value: "无" }],
          Tresolution: [{ value: "10分钟" }],
          Sresolution: [{ value: "500m" }],
        },
      ],
      value1: "", //卫星
      value2: "", //传感器
      value3: "", //时间分辨率
      value4: "", //空间分辨率
      multipleSelection:[],
    };
  },
  watch: {
    value1(val) {
    },
  },
  created() {
    // this.subjectOptions = majar;
  },
  mounted() {
    
    //this.getUserData();
    //this.getPosition();
    //this.postObj.basic_info.up_id = atob(sessionStorage.getItem("token"));
    //this.getTime(1, 0);
  },
  methods: {
        toggleSelection(rows) {
          if (rows) {
            rows.forEach(row => {
              this.$refs.multipleTable.toggleRowSelection(row);
            });
          } else {
            this.$refs.multipleTable.clearSelection();
          }
        },

        handleSelectionChange(val) {
          this.multipleSelection = val;
          console.log(this.multipleSelection);
        },
        
      //   generateData(){
      //   const data = [];
       
      //   for (let i = 0; i < this.rasterList.length; i++) {
      //     console.log(this.rasterList[i].filename);
      //     data.push({
      //       key: i,
      //       label: `备选项 ${ this.rasterList[i].filename }`,
      //       // disabled: i % 4 === 0
      //     });
      //   }
      //   return data;
      // },
    handleChange(value) {
      if(this.value1!=""&&this.value2!=""&&this.value3!=""&&this.value4!=""){

        let satelitestr= this.SateliteOption[this.value1 - 1].satelite;
        this.$http
        .get("/datamanage/publish", {
          params: {
            method: "getrasterlist",
            satelite:satelitestr
          },
        })
        .then((res) => {
          console.log(res.data.list);
          this.rasterList = res.data.list;
          this.rasterList.forEach(element => {
            element.filepath="/rootdata/raster/"+this.SateliteOption[this.value1-1].satelite+"/compress/"+element.filename
          });
        });
      }
    },
    // handleTranferChange(value, direction, movedKeys) {
    //   /**
    //    * 拿到右边的数组
    //    */
    //   let slectList=[]
    //   value=value.sort((a,b)=>{return a-b})
    //   console.log(value,'sort');
    //   value.forEach((element,index) => {
    //     if(element==index){
    //       console.log(element,'ele',index,'index',this.data[index].lable);
    //       slectList.push(this.data[index].label)
    //     }
    //   });
    //     console.log(slectList);
    //     // console.log( direction);
    //     // console.log( movedKeys);
    //     //console.log(this.value);
    // },

    //获取传感器数据
    SateliteHandle(value) {
      this.value2 = "";
      this.value3 = "";
      this.value4 = "";
      this.SensorOption = this.SateliteOption[value - 1].sensor;
      this.SpatialResolution = this.SateliteOption[value - 1].Sresolution;
      this.TimeResolution = this.SateliteOption[value - 1].Tresolution;
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
     
    },
    // 判断是否必选的已选完
    jadgeIsOver() {
      
    },
    // 发布数据
    publicData() {
      // alert(
      //   this.value1 + this.value2 + this.value3 + this.value4 + this.datatime
      // );
      //判断是否必选的已选完。
      let fileList =this.multipleSelection
      if (fileList.length==0){
        this.$message({
          type: "warning",
          message: "请选择上传数据",
        });
        return;
      }
      let fileList=JSON.stringify(this.multipleSelection)
      let satelitestr= this.SateliteOption[this.value1 - 1].satelite;
      //上传数据
       this.$http
        .get("/datamanage/publish", {
          params: {
            method: "uploadraster",
            fileList:fileList,
            satelitestr
          },
        })
        .then((res) => {
           console.log(res.data);
        //   this.rasterList = res.data.list;
        //   this.rasterList.forEach(element => {
        //     element.filepath="/rootdata/"+this.SateliteOption[this.value1-1].satelite+"/"+element.filename
        //   });
        });
     
    },
    //获取用户数据
    // getUserData() {
    //   this.$http
    //     .get("/AdminServlet", {
    //       params: {
    //         method: "getAdminById",
    //         id: window.atob(sessionStorage.getItem("token")),
    //       },
    //     })
    //     .then((res) => {
    //       this.postObj.basic_info.uper_name = res.data.account;
    //       this.postObj.basic_info.uper_place = res.data.workUnit;
    //     });
    // },
    // 添加其他标签

    addOtherLabel() {
      this.labelDialogVisible = true;
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
