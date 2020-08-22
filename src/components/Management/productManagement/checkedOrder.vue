<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>后台管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单审核</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-table :data="tableData" style="width: 100%" border stripe height="500px">
        <!-- <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <span>应用说明：</span>
              <br />
              <p>{{props.row.note}}</p>
            </el-form>
          </template>
        </el-table-column> -->
        <el-table-column prop="orderCode" label="订单编号" width="180"></el-table-column>
         <el-table-column prop="userName" label="上传用户" width="180"></el-table-column>
        <el-table-column prop="name" label="数据名称"></el-table-column>
        <el-table-column prop="datm_range" label="时间范围"></el-table-column>
        <el-table-column prop="da_size" label="时间大小"></el-table-column>
        <!-- <el-table-column label="操作">
          <template slot-scope="slotScope">
            <el-tooltip class="item" effect="dark" content="查看用户使用目的" placement="top-start">
              <el-button
                icon="el-icon-tickets"
                type="info"
                @click="previewDialog(slotScope.row)"
                size="mini"
              ></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="预览证明材料" placement="top-start">
              <el-button
                icon="el-icon-picture"
                type="primary"
                @click="imageDialog(slotScope.row)"
                size="mini"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column> -->
      </el-table>
    </el-card>
    <el-dialog title="用户使用目的预览" :visible.sync="dialogVisible" width="40%">
      <!-- 类型为1时显示: 科研项目 -->
      <template v-if="tempPurposeData.useType == 1">
        <el-row>
          <el-col :span="4">
            <span>课题级别：</span>
          </el-col>
          <el-col :span="8">
            <span>{{tempPurposeData.projLevel}}</span>
          </el-col>
          <el-col :span="4">
            <span>项目结束时间：</span>
          </el-col>
          <el-col :span="8">
            <span>{{tempPurposeData.projEndTime}}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <span>项目名称：</span>
          </el-col>
          <el-col :span="8">
            <span>{{tempPurposeData.projName}}</span>
          </el-col>
          <el-col :span="4">
            <span>项目负责人：</span>
          </el-col>
          <el-col :span="8">
            <span>{{tempPurposeData.projAdmin}}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <span>项目编号：</span>
          </el-col>
          <el-col :span="8">
            <span>{{tempPurposeData.projCode}}</span>
          </el-col>
          <el-col :span="4">
            <span>项目承担单位</span>
          </el-col>
          <el-col :span="8">{{tempPurposeData.projWorkUnit}}</el-col>
        </el-row>
      </template>
      <!-- 类型为2时显示: 论文 -->
      <template v-if="tableData.useType == 2">
        <el-row>
          <el-col :span="4">
            <span>课题级别：</span>
          </el-col>
          <el-col :span="8">
            <span>{{tempPurposeData.projLevel}}</span>
          </el-col>
          <el-col :span="4">
            <span>预计毕业时间：</span>
          </el-col>
          <el-col :span="8">
            <span>{{tempPurposeData.endTime}}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <span>论文名称：</span>
          </el-col>
          <el-col :span="8">
            <span>{{tempPurposeData.title}}</span>
          </el-col>
          <el-col :span="4">
            <span>学校信息:</span>
          </el-col>
          <el-col :span="8">
            <span>{{tempPurposeData.schoolName}}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <span>导师姓名:</span>
          </el-col>
          <el-col :span="8">
            <span>{{tempPurposeData.teacherName}}</span>
          </el-col>
          <el-col :span="4">
            <span>导师电话</span>
          </el-col>
          <el-col :span="8">{{tempPurposeData.teacherPhone}}</el-col>
        </el-row>
      </template>
      <!-- 类型为3时显示:其他用途 -->
      <template v-if="tableData.useType == 3">
        <el-row>
          <el-col :span="4">
            <span>课题级别：</span>
          </el-col>
          <el-col :span="8">
            <span>{{tempPurposeData.projLevel}}</span>
          </el-col>
          <el-col :span="4">
            <span>项目结束时间：</span>
          </el-col>
          <el-col :span="8">
            <span>{{tempPurposeData.projEndTime}}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <span>项目名称：</span>
          </el-col>
          <el-col :span="8">
            <span>{{tempPurposeData.projName}}</span>
          </el-col>
          <el-col :span="4">
            <span>项目负责人：</span>
          </el-col>
          <el-col :span="8">
            <span>{{tempPurposeData.projAdmin}}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <span>项目编号：</span>
          </el-col>
          <el-col :span="8">
            <span>{{tempPurposeData.projCode}}</span>
          </el-col>
          <el-col :span="4">
            <span>项目承担单位</span>
          </el-col>
          <el-col :span="8">{{tempPurposeData.projWorkUnit}}</el-col>
        </el-row>
      </template>
    </el-dialog>

    <!-- 预览图片 -->
    <el-dialog title="用户使用目的预览" :visible.sync="imagedialogVisible" width="25%">
      <el-image style="width: 100%; height: 400px" :src="tempImageUrl"></el-image>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      isState: "打开权限",
      dialogVisible: false,
      imagedialogVisible: false,
      currentPage: 1,
      idDisabled: false,
      tempPurposeData: {},
      tempImageUrl:
        "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
    };
  },
  created() {},
  mounted() {
    this.getOrderData();
  },
  methods: {
    handleSizeChange(val) {
    },
    handleCurrentChange(val) {
    },
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
              orderStatus: 2
            }
          })
          .then(res => {
            this.getOrderData();
            this.$message({
              type: "success",
              message: "审核通过"
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
    getOrderData() {
      this.$http
        .get("/ShowDAimServlet", {
          params: {
            status: 2
          }
        })
        .then(res => {
          for (var i = 0; i < res.data.length; i++) {
            var tempTotalData = Object.assign(
              res.data[i].user,
              res.data[i].downaim,
              res.data[i].basicInfo
            );
            tempTotalData.orderCode = res.data[i].orderCode;
            this.tableData.push(tempTotalData);
          }
        });
    }
  }
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

