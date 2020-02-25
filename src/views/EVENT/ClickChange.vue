<template>
  <div class="container">
    <div class="title"> 
      <h3>点击按钮调整地图</h3>
      <el-button type="primary" @click="backHome">返回Home</el-button>
      <el-button type="primary" @click="zoom_out">单击放大</el-button>
      <el-button type="primary" @click="zoom_in">单击缩小</el-button>
      <el-button type="primary" @click="panto">平移到【北京】</el-button>
      <el-button type="primary" @click="restore">复位</el-button>
      <el-button type="primary" @click="mapInfo">当前地图信息</el-button>
      <el-button type="primary" @click="exportPng">导出图片</el-button>
    </div>

    <div id="map" class="map" style="width: 100%; height: 90%; position: absolute;"
        :style="{backgroundImage:'url(' + bgImg + ')',
        backgroundRepeat:'repeat'}"></div>
  </div>
</template>

<script>
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import { Tile as TileLayer} from "ol/layer";
import {XYZ} from "ol/source";
import { fromLonLat } from "ol/proj";
import { defaults } from "ol/control";

export default {
  data() {
    return {
      map: {},
      bgImg:require("@/images/MapGIS.png")
    };
  },
  mounted() {
    this.initmap();
  },
  methods: {
    initmap() {
      // bddab7f5ea24d221498b6a551b68b0f7
      var TiandiMap_vec = new TileLayer({
        title: "天地图矢量图层",
        source: new XYZ({
          url: "http://t0.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=bddab7f5ea24d221498b6a551b68b0f7",
          wrapX: false,
          crossOrigin: "Anonymous"
        })
      });
      var Tianditu_cva = new TileLayer({
        title: "天地图矢量注记图层",
        source: new XYZ({
          url: "http://t0.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=bddab7f5ea24d221498b6a551b68b0f7",
          wrapX: false,
          crossOrigin: "Anonymous"
        })
      });
      //实例化Map对象加载地图
      var map = new Map({
        target: 'map',
        layers: [TiandiMap_vec, Tianditu_cva],
        controls:new defaults({
                attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
                    collapsible: false
                })
            }),
        view: new View({
          center: [11586149.59, 3588927.25],
          projection: "EPSG:3857",
          zoom: 10,
          // minZoom: 1,
          maxZoom: 20
          //设置旋转角度
          //rotation: Math.PI / 6
        })
      });
      this.map=map;
      //地图视图的初始参数
      // var view = map.getView();
      // var zoom = view.getZoom();
      // var center = view.getCenter();
      // var rotation = view.getRotation();

      var mapDiv = document.getElementById('map');
      //通过style的填充背景图属性设置背景
      var img= require("@/images/MapGIS.png");
      mapDiv.style.backgroundImage = img;

    },
    zoom_out(){//放大
      let view=this.map.getView();
      let zoom=view.getZoom();
      view.setZoom(zoom+1); 
    },
    zoom_in() {
      let view=this.map.getView();
      let zoom=view.getZoom();
      view.setZoom(zoom-1); 
    },
    panto() {
      var view = this.map.getView();
      var beijing = new fromLonLat([116.3, 39.9]);
      //平移地图
      view.setCenter(beijing);
      view.setZoom(15);

    },
    restore() {
      var view = this.map.getView();
      var zoom = view.getZoom();
      var center = view.getCenter();

      view.setCenter([11586149.59, 3588927.25]);
      //初始旋转角度 0
      view.setRotation(0);
      view.setZoom(15);

    },
    mapInfo() {
      var view = this.map.getView();
      var zoom = view.getZoom();
      var center = view.getCenter();
      var rotation = view.getRotation();
      var curResolution = view.getResolution();
      //获取地图范围
      var ex = view.calculateExtent(this.map.getSize());
      var str = ex[0] + "," + ex[1] + "," + ex[2] + "," + ex[3];
      //获取当前地图容器div的大小
      var viewSize = this.map.getSize();
      var strSC=" 宽：" + viewSize[0] + "高：" + viewSize[1];
      console.log(`分辨率${curResolution};地图范围${str};视窗(当前div)范围${ strSC }`);

    },
    exportPng() {
      this.map.once('postcompose', function (event) {
        var canvas = event.context.canvas;
        canvas.toBlob(function (blob) {
            saveAs(blob, 'map.png');
        });
      });
      this.map.renderSync();
    },
    backHome() {
      this.$router.replace("/"); //指定跳转地址
    }
  }
};
//ed66df47a9d2de65ea18e35d27209979
// projection: "EPSG:3857",    //使用这个坐标系
//           center: [104.07, 30.67],
//           zoom: 14
</script>

<style scoped>
.container {
  margin: 0px;
  padding: 0px;
  widows: 100%;
  height: 100%;
}
.title {
  position: absolute; /*这里一定要设置*/
  z-index: 999999;
  margin-top: 10px;
  margin-left: 50px;
}
</style>