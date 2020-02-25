<template>
  <div class="container">
    <div class="title"> 
      <h3>地图矢量Vector</h3>
      <el-button type="primary" @click="backHome">返回Home</el-button>
    </div>

    <div id="map" class="map"></div>
  </div>
</template>

<script>
import "ol/ol.css";

import Feature from "ol/Feature";
import Map from "ol/Map";
import View from "ol/View";
import { Tile as TileLayer, Image, Vector as VectorLayer} from "ol/layer";
import { XYZ, ImageStatic, Vector as SourceVector } from "ol/source";
import { transform } from "ol/proj";
import { Point } from "ol/geom";
import { Icon, Style } from "ol/style";


export default {
  data() {
    return {
      map: {}
    };
  },
  mounted() {
    this.initmap();
  },
  methods: {
    initmap() {
      var center = new transform([104.06667, 30.66667], 'EPSG:4326', 'EPSG:3857');
      var tiandituLayer = new TileLayer({
        title: "天地图矢量图层",
        source: new XYZ({
          url:
            "http://t0.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=ed66df47a9d2de65ea18e35d27209979",
          wrapX: false
        })
      });
      var Tianditu_cva = new TileLayer({
        title: "天地图矢量注记图层",
        source: new XYZ({
          url: "http://t0.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=bddab7f5ea24d221498b6a551b68b0f7",
          wrapX: false
        })
      });

      var map = new Map({
        layers:[ tiandituLayer,Tianditu_cva ],
        target: 'map',
        view:new View({
            center: center,
            zoom: 12
        })
      });
      this.map = map;
    },
    backHome(){
      this.$router.replace('/')//指定跳转地址
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
.title{
position: absolute;/*这里一定要设置*/
z-index: 999999;
margin-top: 10px;
margin-left: 50px;
}

 #menu {
            text-align: center;
            width: 100%;
            height: 20px;
            padding: 5px 10px;
            font-size: 14px;
            font-family: "微软雅黑";
            left: 10px;
        }
</style>