<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div class="img-header">
        <img src="../../assets/logo.png" alt />
        <span class="span-title">
          洞庭湖数据管理平台
        </span>
      </div>
      <!-- <el-button type="info" @click="logOut">首页</el-button> -->
    </el-header>
    <!-- 页面主体 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="iscollapse ? '80px':'250px'">
        <div class="toggle-buttom" @click="toggleCollapse">|||</div>
        <div class="leftBox">
          <el-menu
            background-color="#333744"
            text-color="#fff"
            active-text-color="#409EFF"
            :collapse="iscollapse"
            :collapse-transition="false"
            router
            unique-opened
            :default-active="selectItem"
          >
            <el-submenu v-for="(item,i) in listData" :key="i" :index="item.id" class="submenuMbox">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{item.name}}</span>
              </template>
              <el-menu-item
                :index="'/'+item1.id"
                v-for="(item1,j) in item.data"
                :key="j"
                class="item-hover"
                @click="saveName(item1.id)"
              >
                <template slot="title">
                  <i class="el-icon-document-checked"></i>
                  <span>{{item1.name}}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </div>
      </el-aside>
      <!-- 内容主体 -->
      <el-main>
        <!-- 路由展位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      iscollapse: false,
      listData: [
        {
          id: "adminManagement",
          name: "人员管理",
          data: [
            { id: "administrator", name: "管理员管理" },
            { id: "userManagement", name: "用户管理" }
          ]
        },
        {
          id: "dataManagement",
          name: "基础数据管理",
          data: [
            { id: "dataPublish", name: "遥感影像数据入库" },
            { id: "litimgPublish", name: "遥感影像数据快视图生成" },
            { id: "productPublish", name: "标准数据产品入库" },
            { id: "envirPublish", name: "基础环境数据发布" },
            { id: "dataList", name: "数据列表" }
          ]
        },
        {
          id: "order",
          name: "专题数据管理",
          data: [
            { id: "productdata", name: "专题数据" },
            { id: "checkedOrder", name: "专题数据发布审核" }
          ]
        },
        {
          id: "task",
          name: "任务日志",
          data: [
            { id: "GSFtasklog", name: "任务日志详情" },
            { id: "tasklog", name: "任务日志列表" }
          ]
        }
      ],
      selectItem: "administrator"
    };
    // 怎么保证每一项都有自己对应的图标
    // 我们可以在数据中定义一个子图图标的对象，对象以键值对的形式，属性是id，值是类名
    // 我们在循环的时候，可以绑定属性的形式进行循环赋值。
  },
  methods: {
    logOut() {
      this.$router.push("/");
      window.sessionStorage.setItem("item", "/dataCheck");
    },
    toggleCollapse() {
      this.iscollapse = !this.iscollapse;
    },
    // 保证侧边栏的激活状态。点击当前的litm，就激活。通过传递参数的方式赋值给ui属性
    saveName(data) {
      this.selectItem = "/" + data;
      window.sessionStorage.setItem("item", this.selectItem);
    },
    loadItemColor() {
      var selectData = window.sessionStorage.getItem("item");
      if (selectData == null || selectData === "") {
        this.selectItem = "/administrator";
        return;
      }
      this.selectItem = selectData;
    }
  },
  created() {
    this.loadItemColor();
  }
};
</script>
<style >
</style>
<style scoped>
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 30px;
  letter-spacing: 0.2em;
}
.el-aside {
  background-color: #333744;
}
.el-menu {
  border-right: none;
}
.el-main {
  background-color: #eaedf1;
}

.home-container {
  height: 100%;
}
.img-header {
  height: 100%;
  display: flex;
  /* 这个使用与flex弹性布局 */
  align-items: center;
}
img {
  height: 60px;
}

.toggle-buttom {
  height: 30px;
  background-color: #4a5064;
  color: #fff;
  line-height: 26px;
  font-size: 20px;
  text-align: right;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>


