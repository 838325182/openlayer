<template>
  <div class="home">
    <el-row class="tac">
      <el-col :span="12">
        <h5>功能列表</h5>
        <el-menu default-active="2"
                 class="el-menu-vertical-demo"
                 @open="handleOpen"
                 @close="handleClose"
                 background-color="#545c64"
                 text-color="#fff"
                 active-text-color="#ffd04b">
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>地图</span>
            </template>
            <el-menu-item-group>
              <template slot="title">加载地图</template>
              <el-menu-item index="1-1" @click="routerTo('AddMap')">ArcGISMap</el-menu-item>
              <el-menu-item index="1-2" @click="routerTo('bingMap')">BingMap</el-menu-item>
              <el-menu-item index="1-3" @click="routerTo('gaodeMAp')">gaode的map</el-menu-item>
              <el-menu-item index="1-3" @click='routerTo("StaticMap")'>静态地图</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group>
              <template slot="title">控件</template>
              <el-menu-item index="1-2-1" @click='routerTo("dragAndDropFile")'>拖拽加载文件</el-menu-item>
              <el-menu-item index="1-2-2" @click='routerTo("dragRotateAndZoom")'>拖拽缩放和旋转地图</el-menu-item>
            </el-menu-item-group>
          </el-submenu>

          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-document"></i>
              <span>要素</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="2-1"  @click="routerTo('addPoint')">加载点</el-menu-item>
              <el-menu-item index="2-2" @click="routerTo('addLine')">加载线</el-menu-item>
              <el-menu-item index="2-3" @click="routerTo('addLabel')">加载Label</el-menu-item>
              <el-menu-item index="2-4" @click="routerTo('mapVector')">vector</el-menu-item>
              <el-menu-item index="2-5" @click="routerTo('drawVector')">创建矢量Feature</el-menu-item>
              <el-menu-item index="2-6" @click="routerTo('markUsePoint')">point实现文本图片标注</el-menu-item>
              <el-menu-item index="2-6" @click="routerTo('markUseOverlay')">Overlay叠加层实现标注</el-menu-item>
            </el-menu-item-group>
          </el-submenu>

          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-setting"></i>
              <span>事件</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="3-1" :disabled="true"> 点击Label事件</el-menu-item><!--设置不可用-->
              <el-menu-item index="3-2" @click='routerTo("clickChange")'>综合click事件</el-menu-item>
            </el-menu-item-group>
          </el-submenu>

          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-setting"></i>
              <span>项目功能</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="4-1" @click='routerTo("initMap")'>initMap高德</el-menu-item>
              <el-menu-item index="4-2" @click='routerTo("AddXiaoQu")'>加载小区图层</el-menu-item>
              <el-menu-item index="4-3"><router-link to='/AddXiaoQu'>直接路由加载小区图层</router-link></el-menu-item>
            </el-menu-item-group>
          </el-submenu>

        </el-menu>
      </el-col>
    </el-row>

    <br>
    <el-button type="primary"  @click="addMap">addMap</el-button>
    <el-button type="primary" @click="bingMap">BingMap</el-button>

    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
  </div>

</template>

<script>
export default {
  name: "home",
  components: {
    // HelloWorld
  },
  methods: {
    handleOpen (key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath);
    },
    addMap () {
      this.$router.replace('/AddMap')//指定跳转地址
    },
    bingMap () {
      this.$router.replace('/BingMap')
    },
    routerTo(page) {
      this.$router.replace('/'+page)
    }

  }
};
</script>

<style scoped>
.marker {
  width: 20px;
  height: 20px;
  border: 1px solid #088;
  border-radius: 10px;
  background-color: #0ff;
  opacity: 0.5;
}
.address {
  text-decoration: none;
  color: #aa3300;
  font-size: 14px;
  font-weight: bold;
  text-shadow: black 0.1em 0.1em 0.2em;
}

</style>