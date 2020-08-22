import Vue from 'vue'
import 'element-ui/lib/theme-chalk/index.css';
import { Col, Row, Button, Menu, MenuItem, MenuItemGroup, Divider, Input, Icon, Tabs, 
    TabPane, Submenu, DatePicker, Checkbox, Pagination, Dialog, Form, FormItem, Message, 
    MessageBox, Steps, Step, Table, TableColumn, Loading, Image, Link, Tooltip, Main, 
    Aside, Container, Header, Breadcrumb, BreadcrumbItem, Card ,Switch, Upload ,Cascader,Select,Option} from 'element-ui'
Vue.use(Col)
Vue.use(Row)
Vue.use(Button)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Divider)
Vue.use(Input)
Vue.use(Icon)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Submenu)
Vue.use(DatePicker)
Vue.use(Checkbox)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Image)
Vue.use(Step)
Vue.use(Steps)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Loading)
Vue.use(Link)
Vue.use(Tooltip)
Vue.use(Main)
Vue.use(Aside)
Vue.use(Container)
Vue.use(Header)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Upload)
Vue.use(Cascader)
Vue.use(Option)
Vue.use(Select)
Vue.use(Switch)
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$alert = MessageBox.alert
