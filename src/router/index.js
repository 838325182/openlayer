import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import AddMap from '../views/AddMap.vue'
import BingMap from '../views/BingMap.vue'
import AddPoint from '../views/AddPoint.vue'
import AddLine from '../views/AddLine.vue'
import AddLabel from '../views/AddLabel.vue'
import AddXiaoQu from '../views/AddXiaoQu.vue'
import ClickLabel from '../views/ClickLabel.vue'
import GaodeMap from '../views/GaodeMap.vue'
import InitMap from '../views/InitMap.vue'
import ClickChange from '../views/ClickChange.vue'
import StaticMap from '../views/StaticMap.vue'
import MapVector from '../views/MapVector.vue'
import DrawVector from '../views/DrawVector.vue'
import MarkUsePoint from '../views/MarkUsePoint.vue'
import MarkUseOverlay from '../views/MarkUseOverlay.vue'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'


Vue.use(VueRouter)
Vue.use(ElementUI)


const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },{
    path: '/addMap',
    name: 'addMap',
    component: AddMap
  },{
    path: '/bingMap',
    name: 'bingMap',
    component: BingMap
  },{
    path: '/addPoint',
    name: 'addPoint',
    component: AddPoint
  },{
    path: '/addLine',
    name: 'addLine',
    component: AddLine
  },{
    path: '/addLabel',
    name: 'addLabel',
    component: AddLabel
  },{
    path: '/addxiaoqu',
    name: 'addxiaoqu',
    component: AddXiaoQu
  },{
    path: '/clickLabel',
    name: 'clickLabel',
    component: ClickLabel
  },{
    path: '/gaodeMap',
    name: 'gaodeMap',
    component: GaodeMap
  },{
    path: '/initMap',
    name: 'initMap',
    component: InitMap
  },{
    path: '/clickChange',
    name: 'clickChange',
    component: ClickChange
  },{
    path: '/staticMap',
    name: 'staticMap',
    component: StaticMap
  },{
    path: '/mapVector',
    name: 'mapVector',
    component: MapVector
  },{
    path: '/drawVector',
    name: 'drawVector',
    component: DrawVector
  },{
    path: '/markUsePoint',
    name: 'markUsePoint',
    component: MarkUsePoint
  },{
    path: '/markUseOverlay',
    name: 'markUseOverlay',
    component: MarkUseOverlay
  }
  
  
  // {
  //   path: '/about',
  //   name: 'about',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited./* webpackChunkName: "about" */
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
