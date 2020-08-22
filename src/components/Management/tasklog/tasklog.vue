<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>后台管理</el-breadcrumb-item>
      <el-breadcrumb-item>任务日志</el-breadcrumb-item>
      <el-breadcrumb-item>日志列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <!-- <el-row :gutter="10">
        <el-col :span="8">
          <el-input
            placeholder="请输入新闻标题关键字"
            clearable
            @clear="getNewsData()"
            v-model="key"
            class="input-with-select"
          >
            <el-button slot="append" icon="el-icon-search" @click="getNewsData()"></el-button>
          </el-input>
        </el-col>
      </el-row> -->

      <!-- 新闻列表展示区域 -->
      <el-table :data="logList" border stripe>
        <el-table-column prop="data_name" label="任务名称"></el-table-column>
        <el-table-column prop="user_name" label="提交者昵称"></el-table-column>
        <el-table-column prop="data_time" label="完成时间"></el-table-column>
        <el-table-column prop="data_type" label="数据类型"></el-table-column>
        <el-table-column prop="is_open" label="是否公开"></el-table-column>
        <el-table-column prop="is_success" label="是否成功"></el-table-column>
        <el-table-column prop="task_log" label="任务日志"></el-table-column>
        <!-- <el-table-column label="操作">
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
                @click="showDialog(scope.row.id)"
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
                :disabled=false
                @click="deleteNews(scope.row.id,scope.row.news_cont)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column> -->
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
     <el-dialog
      title="新闻预览"
      :visible.sync="DialogVisible"
      :close-on-click-modal="false"
      width="60%"
    >
      <div v-html="newsContent">
        
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      key:'',
      logList: [], //总数据列表
      totalCount: 0, // 总数据条数
      currentPage: 1,
      currentCount: 6,
      DialogVisible:false,
      newsContent:''
    };
  },
  watch: {},
  methods: {
    handleSizeChange(val) {
      this.currentCount = val;
      this.getNewsData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getNewsData();
    },

    //删除
    deleteNews(id,html) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.get("/NewsServlet", {
            params: {
              method:'updateNews',
              id:id
            }
          })
          .then(res => {
            if(res.data === 1){
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.getNewsData();
              this.deleteImage(html);
            }else{
              this.$message.error("删除接口异常！");
            }
          })


        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
      });
    },
    getNewsData() {
      let _this=this;
      this.$http
        .get("/productdata", {
          params: {
            method: "getproductlog",
            user_id:"all",
            currentPage: _this.currentPage,
            currentCount: _this.currentCount
          }
        })
        .then(res => {
          // for(let i=0;i<res.data.list.length;i++){
          //   res.data.list[i].dATE=_this.timestampToTime(res.data.list[i].dATE);
          // }
          this.logList = res.data.list;
          this.totalCount = res.data.totalCount;

        })
        .catch(err => {
          this.$message.error("请求数据失败");
        });
    },
    //预览
    showDialog(id){
      this.$http
        .get("/newsContent", {
          params: {
            id:id
          }
        })
        .then(res => {
          if(res.data.length>0){
            this.newsContent=res.data[0].news_cont;
          }
        })
        .catch(err => {
          this.$message.error("请求数据失败");
        });
      this.DialogVisible=true;
    },
    deleteImage(html){
      let nowimgs = this.getSrc(html)
      let merge = nowimgs.filter(function (v, i, arr) {
        return arr.indexOf(v) === arr.lastIndexOf(v)
      })
      for (let x in merge) {
        let colds = merge[x].split('/')
        let imgName=colds[colds.length-1];
        this.$http.get("/NewsServlet", {
          params: {
            method:'deletePictures',
            picNames:imgName
          }
        })
        .then(res => {
          
        })
      }
      
    },
    getSrc (html) {
      var imgReg = /<img.*?(?:>|\/>)/gi
      // 匹配src属性
      var srcReg = /src=[\\"]?([^\\"]*)[\\"]?/i
      var arr = html.match(imgReg)
      let imgs = []
      if (arr) {
        for (let i = 0; i < arr.length; i++) {
          var src = arr[i].match(srcReg)[1]
          imgs.push(src)
        }
      }
      return imgs
    },
    timestampToTime(timestamp){
        var date = new Date(timestamp);
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        var D = date.getDate()<10 ? '0'+date.getDate() : date.getDate();
        return Y+M+D;
    }
  },
  mounted() {
    this.getNewsData();
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
