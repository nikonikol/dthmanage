import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login/Login.vue'
import ManagementIndex from '../components/Management/Management_index.vue'
import DataPublish from '../components/Management/dataMangement/DataPublish.vue'
import administrator from '../components/Management/adminManagement/administrator.vue'
import userManagement from '../components/Management/adminManagement/userManagement.vue'
import productdata from '../components/Management/productManagement/productdata.vue'
import GSFtasklog from '../components/Management/tasklog/GSFtasklog.vue'
import tasklog from '../components/Management/tasklog/tasklog.vue'
import checkedOrder from '../components/Management/productManagement/checkedOrder.vue'
import dataList from '../components/Management/dataMangement/dataList.vue'
import litimgPublish from '../components/Management/dataMangement/litimgPublish.vue'
import productPublish from '../components/Management/dataMangement/productPublish.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: "/managementindex",
      redirect: "/administrator",
      component: ManagementIndex,
      meta: { requireAuth: true },
      children: [
        {
          path: "/dataPublish",
          component: DataPublish,
          meta: { requireAuth: true }
        },
        {
          path: "/litimgPublish",
          component: litimgPublish,
          meta: { requireAuth: true }
        },
        {
          path: "/productPublish",
          component: productPublish,
          meta: { requireAuth: true }
        },
        {
          path: "/dataList",
          component: dataList,
          meta: { requireAuth: true }
        },
        {
          path: "/administrator",
          component: administrator
          ,
          meta: { requireAuth: true }
        },
        {
          path: "/userManagement",
          component: userManagement,
          meta: { requireAuth: true }
        },
        {
          path: "/productdata",
          component: productdata,
          meta: { requireAuth: true }
        },
        {
          path: "/checkedOrder",
          component: checkedOrder,
          meta: { requireAuth: true }
        },
        {
          path: "/GSFtasklog",
          component: GSFtasklog,
          meta: { requireAuth: true }
        }, {
          path: "/tasklog",
          component: tasklog,
          meta: { requireAuth: true }
        }
      ]
    }
  ]
})
router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
    if (sessionStorage.getItem('token')) {
      next()
    } else {
      next({
        path: "/"
      })
    }
  } else {
    next();
  }
})
export default router