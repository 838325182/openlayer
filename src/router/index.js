import Vue from 'vue'
import VueRouter from 'vue-router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'


Vue.use(VueRouter)
Vue.use(ElementUI)


const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import ('../views/Home.vue')
  },{
    path: '/turf',
    name: 'turf',
    component: () => import ('../views/TOPOLOPY/turf.vue')
  },{
    path: '/topoInclude',
    name: 'topoInclude',
    component: () => import ('../views/TOPOLOPY/topoInclude.vue')
  },{
    path: '/topoIntersect',
    name: 'topoIntersect',
    component: () => import ('../views/TOPOLOPY/topoIntersect.vue')
  },{
    path: '/echart',
    name: 'echart',
    component: () => import ('../views/ECHARTS/echart.vue')
  },{
    path: '/geoServeWFS',
    name: 'geoServeWFS',
    component: () => import ('../views/OGC/geoServeWFS.vue')
  },{
    path: '/geoserveWMS',
    name: 'geoserveWMS',
    component: () => import ('../views/OGC/geoserveWMS.vue')
  },{
    path: '/geoserveLayergroup',
    name: 'geoserveLayergroup',
    component: () => import ('../views/OGC/geoserveLayergroup.vue')
  },{
    path: '/WFS',
    name: 'WFS',
    component: () => import ('../views/OGC/WFS.vue')
  },{
    path: '/WMS',
    name: 'WMS',
    component: () => import ('../views/OGC/WMS.vue')
  },{
    path: '/WMTS',
    name: 'WMTS',
    component: () => import ('../views/OGC/WMTS.vue')
  },{
    path: '/addMap',
    name: 'addMap',
    component: () => import ('../views/MAP/ArcGISMap.vue')
  },{
    path: '/BaiDuMap',
    name: 'BaiDuMap',
    component: () => import ('../views/MAP/BaiDuMap.vue')
  },{
    path: '/bingMap',
    name: 'bingMap',
    component: () => import ('../views/MAP/BingMap.vue')
  },{
    path: '/staticMap',
    name: 'staticMap',
    component: () => import ('../views/MAP/StaticMap.vue')
  },{
    path: '/gaodeMap',
    name: 'gaodeMap',
    component: () => import ('../views/MAP/GaodeMap.vue')
  },{
    path: '/dragAndDropFile',
    name: 'dragAndDropFile',
    component: () => import ('../views/MAP/DragAndDropFile.vue')
  },{
    path: '/dragRotateAndZoom',
    name: 'dragRotateAndZoom',
    component: () => import ('../views/MAP/DragRotateAndZoom.vue')
  },

  {
    path: '/addPoint',
    name: 'addPoint',
    component: () => import ('../views/FEATURE/AddPoint.vue')
  },{
    path: '/addLine',
    name: 'addLine',
    component: () => import ('../views/FEATURE/AddLine.vue')
  },{
    path: '/addLabel',
    name: 'addLabel',
    component: () => import ('../views/FEATURE/AddLabel.vue')
  },{
    path: '/mapVector',
    name: 'mapVector',
    component: () => import ('../views/FEATURE/MapVector.vue')
  },{
    path: '/drawVector',
    name: 'drawVector',
    component: () => import ('../views/FEATURE/DrawVector.vue')
  },{
    path: '/markUsePoint',
    name: 'markUsePoint',
    component: () => import ('../views/FEATURE/MarkUsePoint.vue')
  },{
    path: '/markUseOverlay',
    name: 'markUseOverlay',
    component: () => import ('../views/FEATURE/MarkUseOverlay.vue')
  },
  {
    path: '/clickLabel',
    name: 'clickLabel',
    component: () => import ('../views/EVENT/ClickLabel.vue')
  },{
    path: '/clickChange',
    name: 'clickChange',
    component: () => import ('../views/EVENT/ClickChange.vue')
  }

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
