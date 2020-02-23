<template>
  <div class="container">
    <div class="title"> 
      <h3>index加载高德gcj02地图</h3>
      <el-button type="primary" @click="backHome">返回Home</el-button>
    </div>

    <div id="map" class="map"></div>
  </div>
</template>

<script>
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import { Tile as TileLayer} from "ol/layer";
import {XYZ} from "ol/source";

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
      var gaodeMap_vec=new TileLayer({
        title: "高德矢量图层",
        source: new XYZ({
          url:"http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
          wrapX: false
        }),
      });

      var gaodeMap_img=new TileLayer({
        title: "高德影像图层",
        source: new XYZ({
          url:'http://webst0{1-4}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
          wrapX: false
        }),
      });

      this.map = new Map({
        // layers: [
        //   new TileLayer({
        //     // title: "高德矢量图层",
        //     source: new XYZ({
        //       url:'http://webst0{1-4}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
        //       wrapX: false
        //     })
        //   })
        // ],
        layers: [gaodeMap_img,gaodeMap_vec],
        view: new View({
          center: [104.07, 30.67],
          projection: "EPSG:4326",
          zoom: 12
        }),
        target: "map"
      });
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