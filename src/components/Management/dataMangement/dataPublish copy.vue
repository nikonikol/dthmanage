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
        <el-row :gutter="10" type="flex">
          <el-col :xs="5" :sm="4" :md="3" :lg="3" :xl="2">
            <span class="requiredItem">资源名称</span>
          </el-col>
          <el-col :xs="3" :sm="4" :md="5" :lg="5" :xl="5">
            <el-input placeholder="资源名称" v-model="postObj.basic_info.NAME"></el-input>
          </el-col>
          <el-col :xs="5" :sm="4" :md="3" :lg="3" :xl="2">
            <span class="requiredItem">影像时间</span>
          </el-col>
          <el-col :xs="3" :sm="4" :md="5" :lg="5" :xl="5">
            <!-- <el-input placeholder="数据时间范围，如：2000年-2020年" v-model="postObj.basic_info.datm_range"></el-input> -->
            <!-- <el-date-picker
              v-model="tempYearRange"
              type="monthrange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始年份"
              end-placeholder="结束年份"
              :picker-options="pickerOptions"
              @change="selectYear"
              format="yyyy 年"
              value-format="yyyy"
            ></el-date-picker> -->

             <el-date-picker
            v-model="tempYearRange"
            type="datetime"
            placeholder="选择日期时间"
            align="right"
            :picker-options="pickerOptions">
           </el-date-picker>

          </el-col>
          <!-- <el-col :xs="5" :sm="4" :md="3" :lg="3" :xl="2">
            <span class="requiredItem">空间位置</span>
          </el-col>
          <el-col :xs="3" :sm="4" :md="5" :lg="5" :xl="5">
            <el-input placeholder="如长江" v-model="postObj.basic_info.sploc"></el-input>
          </el-col> -->
        </el-row>
        <el-row :gutter="10" type="flex">
          <!-- <el-col :xs="5" :sm="4" :md="3" :lg="3" :xl="2">
            <span class="requiredItem">分类体系</span>
          </el-col>
          <el-col :xs="3" :sm="4" :md="5" :lg="5" :xl="5">
            <el-cascader
              ref="daTypes"
              :options="datypeOptions"
              v-model="classvalue"
              :show-all-levels="false"
              clearable
              @change="handleChange"
            ></el-cascader>
          </el-col> -->
          <el-col :xs="5" :sm="4" :md="3" :lg="3" :xl="2">
            <span class="requiredItem">上传者</span>
          </el-col>
          <el-col :xs="3" :sm="4" :md="5" :lg="5" :xl="5">
            <el-input placeholder="上传者姓名" v-model="postObj.basic_info.uper_name"></el-input>
          </el-col>
          <!-- <el-col :xs="5" :sm="4" :md="3" :lg="3" :xl="2">
            <span class="requiredItem">单位</span>
          </el-col> -->
          <!-- <el-col :xs="3" :sm="4" :md="5" :lg="5" :xl="5">
            <el-input placeholder="上传者单位" v-model="postObj.basic_info.uper_place"></el-input>
          </el-col> -->
        </el-row>

        <el-row :gutter="10" type="flex">
          <el-col :xs="5" :sm="4" :md="3" :lg="3" :xl="2">
            <span class="requiredItem">数据摘要</span>
          </el-col>
          <el-col :xs="16" :sm="17" :md="18" :lg="18" :xl="19">
            <el-input
              type="textarea"
              :rows="3"
              placeholder="请输入数据摘要"
              v-model="postObj.basic_info.da_summ"
            ></el-input>
          </el-col>
        </el-row>
        <el-row :gutter="10" type="flex">
          <el-col :xs="5" :sm="4" :md="3" :lg="3" :xl="2">
            <span class="requiredItem">数据坐标范围</span>
          </el-col>
          <el-col :xs="3" :sm="4" :md="5" :lg="5" :xl="4">
            <el-input placeholder="西经" v-model="postObj.basic_info.point1_lon"></el-input>
          </el-col>
          <el-col :xs="3" :sm="4" :md="5" :lg="5" :xl="4">
            <el-input placeholder="南纬" v-model="postObj.basic_info.point1_lat"></el-input>
          </el-col>
          <el-col :xs="3" :sm="4" :md="5" :lg="5" :xl="4">
            <el-input placeholder="东经" v-model="postObj.basic_info.point2_lon"></el-input>
          </el-col>
          <el-col :xs="3" :sm="4" :md="5" :lg="5" :xl="4">
            <el-input placeholder="北纬" v-model="postObj.basic_info.point2_lat"></el-input>
          </el-col>
        </el-row>
      </div>
      <div class="k-header-plain">
        <h2>
          专题数据标签选择
          <span>
            <em>(专题词最多只能设置3个)</em>
          </span>
        </h2>
      </div>
      <!-- 设置数据标签 -->
      <div class="setDataTags">
        <el-row :gutter="10" type="flex">
          <el-col :xs="5" :sm="4" :md="3" :lg="3" :xl="2">
            <span class="requiredItem">专题词</span>
          </el-col>
          <el-col :xs="3" :sm="4" :md="5" :lg="5" :xl="6">
            <el-select
              ref="fuzzySearch"
              v-model="value1"
              multiple
              placeholder="请选择"
              filterable
              default-first-option
              allow-create
            >
              <el-option
                v-for="item in thematicOptions"
                :key="item.id"
                :label="item.v_name"
                :value="item.v_name"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :xs="16" :sm="12" :md="3" :lg="3" :xl="2">
            <span class="requiredItem">学科类别</span>
          </el-col>
          <el-col :xs="8" :sm="12" :md="5" :lg="5" :xl="5">
            <!-- <el-cascader :options="subjectOptions" :show-all-levels="false"></el-cascader> -->
            <el-select placeholder="请选择" v-model="value2" clearable @change="subjectHandle">
              <el-option
                v-for="item in subjectOptions"
                :key="item.id"
                :label="item.v_name"
                :value="item.v_name"
              ></el-option>
            </el-select>
          </el-col>
        </el-row>
        <!-- <el-row>
          <el-col :xs="5" :sm="4" :md="3" :lg="3" :xl="2">
            <span class="requiredItem">其他标签</span>
          </el-col>
          <el-col :xs="3" :sm="4" :md="5" :lg="5" :xl="6">
            <a @click="addOtherLabel" class="otherTagsBox" href="javascript:;">添加其他标签</a>
          </el-col>
        </el-row>-->
      </div>
      <div class="k-header-plain">
        <h2>
          数据描述信息填写
          <span>
            <em>(选填或不填)</em>
          </span>
        </h2>
      </div>
      <!-- 设置数据描述信息 -->
      <div class="setDataInfo">
        <el-row :gutter="10" type="flex">
          <el-col :xs="2" :sm="2" :md="2" :lg="2" :xl="2">
            <span class="requiredItem">数据来源</span>
          </el-col>
          <el-col :xs="9" :sm="9" :md="9" :lg="9" :xl="9">
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入数据来源"
              v-model="postObj.basic_info.da_source"
            ></el-input>
          </el-col>
          <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
            <span class="requiredItem">数据产生或加工方法</span>
          </el-col>
          <el-col :xs="10" :sm="10" :md="10" :lg="10" :xl="10">
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入数据加工方式"
              v-model="postObj.basic_info.da_method"
            ></el-input>
          </el-col>
        </el-row>
        <el-row :gutter="10" type="flex">
          <el-col :xs="2" :sm="2" :md="2" :lg="2" :xl="2">
            <span class="requiredItem">数据质量说明</span>
          </el-col>
          <el-col :xs="9" :sm="9" :md="9" :lg="9" :xl="9">
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入数据质量说明"
              v-model="postObj.basic_info.da_quality"
            ></el-input>
          </el-col>
          <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
            <span class="requiredItem">数据空间投影</span>
          </el-col>
          <el-col :xs="10" :sm="10" :md="10" :lg="10" :xl="10">
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入数据空间投影"
              v-model="postObj.basic_info.da_projection"
            ></el-input>
          </el-col>
        </el-row>
        <el-row :gutter="10" type="flex">
          <el-col :xs="5" :sm="4" :md="3" :lg="3" :xl="2">
            <span class="requiredItem">文献引用方式</span>
          </el-col>
          <el-col :xs="16" :sm="17" :md="18" :lg="18" :xl="9">
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入文献引用方式"
              v-model="postObj.basic_info.da_refer"
            ></el-input>
          </el-col>
        </el-row>
      </div>
      <div class="k-header-plain">
        <h2>
          上传数据
          <span>
            <em></em>
          </span>
        </h2>
      </div>
      <!-- 上传数据文档、缩略图等文件 -->
      <div class="upload_box">
        <el-row :gutter="10" type="flex">
          <el-col :span="5">
            <el-upload
              class="upload-demo"
              accept=".jpg, .jpeg, .png"
              ref="uploadimage"
              action="action"
              :http-request="uploadFile_image"
              :on-preview="handlePreview"
              :on-remove="handleRemove1"
              :on-success="onSuccess"
              :on-error="onError"
              :on-change="getFileList1"
              :before-upload="onBeforeUpload1"
              :limit="count"
              :on-exceed="handleExceed"
              :file-list="fileList"
              multiple
              :auto-upload="false"
            >
              <el-button slot="trigger" size="small" type="primary">上传缩略图</el-button>
              <div slot="tip" class="el-upload__tip" style="color:red">支持文件类型：jpg,png; 支持文件大小：5M以内</div>
            </el-upload>
          </el-col>
          <el-col :span="5">
            <el-upload
              class="upload-demo"
              accept=".zip"
              ref="uploadfile"
              action="action"
              :http-request="uploadFile_file"
              :on-preview="handlePreview"
              :on-remove="handleRemove2"
              :on-success="onSuccess"
              :on-error="onError"
              :on-change="getFileList2"
              :before-upload="onBeforeUpload2"
              :limit="count"
              :on-exceed="handleExceed"
              :file-list="fileList"
              multiple
              :auto-upload="false"
            >
              <el-button slot="trigger" size="small" type="primary">上传数据样例</el-button>
              <div slot="tip" class="el-upload__tip" style="color:red">支持文件类型：zip,rar; 支持文件大小：5M以内</div>
            </el-upload>
          </el-col>
        </el-row>
        <el-row justify="end" type="flex" class="public_box">
          <el-button @click="resFiled()">重置</el-button>
          <el-button @click="publicData()">发布数据</el-button>
        </el-row>
      </div>
    </div>

    <!-- 控制标签，暂时不写 -->
    <el-dialog
      title="添加标签"
      :visible.sync="labelDialogVisible"
      :close-on-click-modal="false"
      width="50%"
      class="labelDialog"
    >
      <el-row :gutter="20">
        <el-col :span="5">
          <span class="requiredItem">选择标签类型</span>
        </el-col>
        <el-col :span="10">
          <el-select v-model="otherLabel" placeholder="请选择" @change="selectOtherData">
            <el-option
              v-for="item in labelOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="5">
          <span class="requiredItem">选择标签</span>
        </el-col>
        <el-col :span="10">
          <el-select
            placeholder="请选择"
            filterable
            default-first-option
            allow-create
            multiple
            v-model="valueBasic"
          >
            <el-option
              v-for="item in labelOptionBasic"
              :key="item.v_id"
              :label="item.v_name"
              :value="item.v_name"
            ></el-option>
          </el-select>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="labelDialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import majar from "./subjectData.js";
export default {
  data() {
    return {
      labelDialogVisible: false,
      postObj: {
        // 基础信息表
        basic_info: {
          NAME: "", //发布的资源名称
          sploc: "", //空间位置
          docname: "", //文件名
          up_time: "", //上传时间
          point1_lat: "", //点1的纬度
          point1_lon: "", //点1的经度
          point2_lat: "", //点2的纬度
          point2_lon: "", //点2的经度
          topic_w1: "", //主题词1
          topic_w2: "", //主题词2
          topic_w3: "", //主题词3
          topic_cfi: "", //主题词分类字段简介
          da_summ: "", //数据摘要
          da_size: "", //数据大小
          da_url: "", //数据附件本地地址
          up_id: 1, //上传者账号id
          da_type: -1, //分类外键
          image: "", //缩略图url
          uper_name: "", //上传者姓名
          uper_place: "", //上传者工作单位
          file_url: "", //数据文档地址
          sample_url: "", //样例数据地址
          datm_range: "", //数据时间范围
          da_source: "", //数据来源
          da_method: "", //数据产生或加工方法
          da_projection: "", //数据空间投影
          da_quality: "", //数据质量说明
          da_refer: "" //文献引用方式
        },
        // 数据属性值
        attr_value: []
      },
      tempYearRange: "",
      // 自定义时间器
      pickerOptions: {
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }]
        },
      // pickerOptions: {
      //   shortcuts: [
      //     {
      //       text: "本月",
      //       onClick(picker) {
      //         picker.$emit("pick", [new Date(), new Date()]);
      //       }
      //     },
      //     {
      //       text: "今年至今",
      //       onClick(picker) {
      //         const end = new Date();
      //         const start = new Date(new Date().getFullYear(), 0);
      //         picker.$emit("pick", [start, end]);
      //       }
      //     },
      //     {
      //       text: "最近六个月",
      //       onClick(picker) {
      //         const end = new Date();
      //         const start = new Date();
      //         start.setMonth(start.getMonth() - 6);
      //         picker.$emit("pick", [start, end]);
      //       }
      //     }
      //   ]
      // },
      thematicOptions: [],
      subjectOptions: [],
      value1: [], //专题词
      value2: "", //学科类别
      tempDataThematic: [],
      datypeOptions: [],
      fileData: "",
      fileList: [],
      classvalue: "",
      count: 1,
      fileCount1: 0,
      fileCount2: 0,
      otherLabel: "",
      labelFirstId: "",
      labelOption: [
        {
          value: "3",
          label: "空间位置"
        },
        {
          value: "4",
          label: "数据类型"
        },
        {
          value: "5",
          label: "数据生产方式"
        },
        {
          value: "6",
          label: "空间尺度"
        },
        {
          value: "7",
          label: "时间分辨率"
        },
        {
          value: "8",
          label: "空间分辨率"
        },
        {
          value: "9",
          label: "比例尺"
        },
        {
          value: "10",
          label: "卫星/传感器"
        }
      ],
      labelOptionBasic: [],
      valueBasic: [], //其他标签
      positionList: []
    };
  },
  watch: {
    value1(val) {
      if (val.length > 3) {
        this.$message({
          type: "warning",
          message: "专题词最多只能设置3个"
        });
        this.value1 = [];
        return;
      }
      var tempValue = JSON.parse(JSON.stringify(val));
      var tempValue1 = JSON.parse(JSON.stringify(val));
      this.tempDataThematic = [];
      if (tempValue.length >= 3) {
        this.postObj.basic_info.topic_w1 = tempValue[0];
        this.postObj.basic_info.topic_w2 = tempValue[1];
        this.postObj.basic_info.topic_w3 = tempValue[2];
      } else if (tempValue.length == 1) {
        this.postObj.basic_info.topic_w1 = tempValue[0];
        this.postObj.basic_info.topic_w2 = "";
        this.postObj.basic_info.topic_w3 = "";
      } else if (tempValue.length == 2) {
        this.postObj.basic_info.topic_w1 = tempValue[0];
        this.postObj.basic_info.topic_w2 = tempValue[1];
        this.postObj.basic_info.topic_w3 = "";
      } else if (tempValue.length == 0) {
        this.postObj.basic_info.topic_w1 = "";
        this.postObj.basic_info.topic_w2 = "";
        this.postObj.basic_info.topic_w3 = "";
      }
      for (var i = 0; i < tempValue1.length; i++) {
        if (!this.jadgeIsExist(tempValue1[i])) {
          let tempObj = {};
          tempObj.v_id = -1;
          tempObj.v_name = tempValue1[i];
          tempObj.v_id_k = 1;
          this.tempDataThematic.push(tempObj);
        } else {
          let tempObj = {};
          tempObj.v_id = this.getThematicId(tempValue1[i]);
          tempObj.v_name = tempValue1[i];
          tempObj.v_id_k = 1;
          this.tempDataThematic.push(tempObj);
        }
      }
    }
  },
  created() {
    // this.subjectOptions = majar;
  },
  mounted() {
    this.getClassData();
    this.getThematicData();
    this.getsubjectData();
    this.getUserData();
    this.getPosition();
    this.postObj.basic_info.up_id = atob(sessionStorage.getItem("token"));
    this.getTime(1, 0);
  },
  methods: {
    handleChange(value) {
      // 清除会触发change
      if (value.length == 0) {
        return;
      }
      let thsAreaCode = this.$refs["daTypes"].getCheckedNodes(); //获取选择的节点
      this.postObj.basic_info.da_type = thsAreaCode[0].data.id;
    },
    //获取学科数据
    subjectHandle(value) {
      if (value == "") {
        this.postObj.attr_value = [];
        return;
      }
      var tempObj = this.jadgeIsSubJect();
      if (this.jadgeIsSubJect().flag) {
        this.postObj.attr_value.splice(this.jadgeIsSubJect().index, 1);
        for (var i = 0; i < this.subjectOptions.length; i++) {
          if (this.subjectOptions[i].v_name == value) {
            var tempID = this.subjectOptions[i].v_id;
            break;
          }
        }
        this.postObj.attr_value.push({
          v_id: tempID,
          v_name: value,
          v_id_k: 2
        });
      } else {
        for (var i = 0; i < this.subjectOptions.length; i++) {
          if (this.subjectOptions[i].v_name == value) {
            var tempID = this.subjectOptions[i].v_id;
            break;
          }
        }
        this.postObj.attr_value.push({
          v_id: tempID,
          v_name: value,
          v_id_k: 2
        });
      }
    },
    //判断是否有学科分类
    jadgeIsSubJect() {
      for (var i = 0; i < this.postObj.attr_value.length; i++) {
        if (this.postObj.attr_value[i].v_id_k == 2) {
          return { flag: true, index: i };
        }
      }
      return { flag: false, index: 0 };
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
    // 判断专题词是否重复
    jadgeIsExist(val) {
      let flag = false;
      for (var i = 0; i < this.thematicOptions.length; i++) {
        if (this.thematicOptions[i].v_name == val) {
          flag = true;
          break;
        }
      }
      return flag;
    },
    // 获取专题词id
    getThematicId(val) {
      for (var i = 0; i < this.thematicOptions.length; i++) {
        if (this.thematicOptions[i].v_name == val) {
          return this.thematicOptions[i].v_id;
        }
      }
    },
    // 获取学科类别
    getsubjectData() {
      this.$http
        .get("/ShowDTagServlet", { params: { type: 2, v_id_k: 2 } })
        .then(res => {
          this.subjectOptions = res.data;
        });
    },
    // 获取分类数据
    getClassData() {
      this.$http.get("/CatalogServlet").then(res => {
        for (var i = 0; i < res.data.length; i++) {
          res.data[i].value = res.data[i].label;
          if (res.data[i].children < 1) {
            continue;
          } else {
            for (var j = 0; j < res.data[i].children.length; j++) {
              res.data[i].children[j].value = res.data[i].children[j].label;
            }
          }
        }
        this.datypeOptions = res.data;
      });
    },
    // 获取专题词
    getThematicData() {
      var params = new URLSearchParams();
      params.append("type", 2);
      params.append("v_id_k", 1);
      this.$http.post("/ShowDTagServlet", params).then(res => {
        this.thematicOptions = res.data;
      });
    },
    // 获取文件流数据
    uploadFile_image(file) {
      this.fileData.append("file1", file.file);
    },
    uploadFile_file(file) {
      this.fileData.append("file2", file.file);
    },
    handlePreview() {},
    handleRemove1(file, fileList) {
      this.fileCount1 = 0;
    },
    handleRemove2(file, fileList) {
      this.fileCount2 = 0;
    },
    onSuccess() {
      this.$message.success("文件上传成功");
    },
    onError() {
      this.$message.error("文件上传失败");
    },
    // 获得文件列表个数
    getFileList1(event, file, fileList) {
      this.fileCount1 = file.length;
    },
    // 获取文件列表个数
    getFileList2(event, file, fileList) {
      this.fileCount2 = file.length;
    },
    // 判断上传类型和大小
    onBeforeUpload1(file) {
      var testmsg = file.name.substring(file.name.lastIndexOf(".") + 1);
      var isfileType = false;
      if (testmsg == "jpg" || testmsg == "jpeg" || testmsg == "png") {
        var isfileType = true;
      }
      const isLt2M = file.size / 1024 / 1024 < 5;
      if (!isfileType) {
        this.$message.error("该文件类型不支持");
      }
      if (!isLt2M) {
        this.$message.error("文件大小不能超过 5M!");
      }
      return isfileType && isLt2M;
    },
    onBeforeUpload2(file) {
      this.postObj.basic_info.docname = file.name.substring(
        0,
        file.name.lastIndexOf(".")
      );
      var testmsg = file.name.substring(file.name.lastIndexOf(".") + 1);
      var isfileType = false;
      if (testmsg == "zip") {
        var isfileType = true;
      }
      const isLt2M = file.size / 1024 / 1024 < 5;
      if (file.size / 1024 / 1024 < 1) {
        this.postObj.basic_info.da_size = (file.size / 1024).toFixed(2) + "k";
      } else {
        this.postObj.basic_info.da_size =
          (file.size / 1024 / 1024).toFixed(2) + "M";
      }

      if (!isfileType) {
        this.$message.error("该文件类型不支持");
      }
      if (!isLt2M) {
        this.$message.error("文件大小不能超过 5M!");
      }
      return isfileType && isLt2M;
    },
    handleExceed(files, fileList) {
      if (fileList.length < 1) {
        this.$message.warning("请选择文件");
      }
      this.$message.warning(
        `当前限制选择${this.count} 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },

    //解决select无法失去焦点的bug
    focusSelectValue() {
      // this.$refs.fuzzySearch.$refs.input.blur = () => {
      //   var tempValue = JSON.parse(JSON.stringify(this.value1));
      //   if (tempValue.length >= 3) {
      //     this.postObj.basic_info.topic_w1 = tempValue[0];
      //     this.postObj.basic_info.topic_w2 = tempValue[1];
      //     this.postObj.basic_info.topic_w3 = tempValue[2];
      //   } else if ((tempValue.length = 1)) {
      //     this.postObj.basic_info.topic_w1 = tempValue[0];
      //   } else if ((tempValue.length = 2)) {
      //     this.postObj.basic_info.topic_w1 = tempValue[0];
      //     this.postObj.basic_info.topic_w2 = tempValue[1];
      //   }
      //   console.log(this.postObj);
      // };
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
      this.postObj = {
        // 基础信息表
        basic_info: {
          NAME: "", //发布的资源名称
          sploc: "", //空间位置
          docname: "", //文件名
          up_time: "", //上传时间
          point1_lat: "", //点1的纬度
          point1_lon: "", //点1的经度
          point2_lat: "", //点2的纬度
          point2_lon: "", //点2的经度
          topic_w1: "", //主题词1
          topic_w2: "", //主题词2
          topic_w3: "", //主题词3
          topic_cfi: "", //主题词分类字段简介
          da_summ: "", //数据摘要
          da_size: "", //数据大小
          da_url: "", //数据附件本地地址
          up_id: 1, //上传者账号id
          da_type: -1, //分类外键
          image: "", //缩略图url
          uper_name: "", //上传者姓名
          uper_place: "", //上传者工作单位
          file_url: "", //数据文档地址
          sample_url: "", //样例数据地址
          datm_range: "", //数据时间范围
          da_source: "", //数据来源
          da_method: "", //数据产生或加工方法
          da_projection: "", //数据空间投影
          da_quality: "", //数据质量说明
          da_refer: "" //文献引用方式
        },
        // 数据属性值
        attr_value: []
      };
      this.getTime(1, 0);
      this.value1 = [];
      this.value2 = "";
      this.tempYearRange = "";
      this.classvalue = "";
    },
    // 判断是否必选的已选完
    jadgeIsOver() {
      if (
        this.postObj.basic_info.NAME == "" ||
        this.postObj.basic_info.sploc == "" ||
        this.postObj.basic_info.up_time == "" ||
        this.postObj.basic_info.point1_lat == "" ||
        this.postObj.basic_info.point1_lon == "" ||
        this.postObj.basic_info.point2_lat == "" ||
        this.postObj.basic_info.point2_lon == "" ||
        this.postObj.basic_info.da_summ == "" ||
        this.postObj.basic_info.da_type == "" ||
        this.postObj.basic_info.uper_name == "" ||
        this.postObj.basic_info.uper_place == "" ||
        this.postObj.basic_info.datm_range == "" ||
        this.postObj.attr_value.length == 0
      ) {
        return false;
      } else {
        return true;
      }
    },
    // 发布数据
    publicData() {
      //判断是否必选的已选完。
      if (!this.jadgeIsOver()) {
        this.$message({
          type: "warning",
          message: "有未完成的必选项"
        });
        return;
      }
      if (this.tempDataThematic.length === 0) {
        this.$message({
          type: "warning",
          message: "有未完成的必选项"
        });
        return;
      }
      if (this.fileCount1 + this.fileCount2 < 2) {
        this.$message.warning("请选择完相应的文件");
        return;
      }
      for (var j = 0; j < this.tempDataThematic.length; j++) {
        this.postObj.attr_value.push(this.tempDataThematic[j]);
      }
      var tempPosition = this.jadgeIsPosition(this.postObj.basic_info.sploc);
      if (tempPosition.check) {
        this.postObj.attr_value.push({
          v_id: tempPosition.id,
          v_name: this.postObj.basic_info.sploc,
          v_id_k: 3
        });
      } else {
        this.postObj.attr_value.push({
          v_id: tempPosition.id,
          v_name: this.postObj.basic_info.sploc,
          v_id_k: 3
        });
      }
      this.postObj.basic_info.docname = this.postObj.basic_info.NAME;
      this.fileData = new FormData();
      this.$refs.uploadimage.submit();
      this.$refs.uploadfile.submit();
      var tempData = JSON.stringify(this.postObj);
      this.fileData.append("data", tempData);
      this.$http
        .post("/UpLoadServlet", this.fileData, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then(res => {
          this.$message.success("文件上传成功");
        })
        .catch(err => {
          console.log(err);
          this.$message.error("文件上传失败");
        });
      this.resFiled();
      this.fileList = [];
      this.fileCount1 = 0;
      this.fileCount2 = 0;
    },
    //获取用户数据
    getUserData() {
      this.$http
        .get("/AdminServlet", {
          params: {
            method: "getAdminById",
            id: window.atob(sessionStorage.getItem("token"))
          }
        })
        .then(res => {
          this.postObj.basic_info.uper_name = res.data.account;
          this.postObj.basic_info.uper_place = res.data.workUnit;
        });
    },
    // 添加其他标签
    addOtherLabel() {
      this.labelDialogVisible = true;
    },
    // 其他标签一级联动
    selectOtherData(val) {
      this.labelFirstId = val;
      this.$http
        .get("/ShowDTagServlet", {
          params: {
            type: 2,
            v_id_k: val
          }
        })
        .then(res => {
          this.labelOptionBasic = res.data;
        });
    },
    // 获取所有空间位置
    getPosition() {
      this.$http
        .get("/ShowDTagServlet", {
          params: {
            type: 2,
            v_id_k: 3
          }
        })
        .then(res => {
          this.positionList = res.data;
        });
    },
    // 是否存在空间位置
    jadgeIsPosition(data) {
      for (var i = 0; i < this.positionList.length; i++) {
        if (this.positionList[i].v_name == data) {
          return { check: true, id: this.positionList[i].v_id };
        }
      }
      return { check: false, id: -1 };
    }
  }
};
</script>

<style>
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
