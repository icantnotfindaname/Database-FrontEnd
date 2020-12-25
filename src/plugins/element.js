import Vue from 'vue'
import { Button,Input,Breadcrumb,BreadcrumbItem,Carousel, CarouselItem, Card, Col, Row, Pagination, InputNumber, Form, FormItem, Dialog, Divider, Tooltip, Tag, Table, TableColumn, Upload, Steps, Step, Message, MessageBox, Loading} from 'element-ui'

Vue.use(Button)
Vue.use(Input)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Carousel)
Vue.use(CarouselItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Pagination)
Vue.use(InputNumber)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Dialog)
Vue.use(Divider)
Vue.use(Tooltip)
Vue.use(Tag)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Upload)
// 步骤条
Vue.use(Steps)
Vue.use(Step)
// 消息提示
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$message = Message;
Vue.prototype.$prompt = MessageBox.prompt;
// 加载
Vue.use(Loading.directive);
Vue.prototype.$loading = Loading.service;