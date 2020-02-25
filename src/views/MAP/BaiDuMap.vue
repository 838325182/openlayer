<template>
  <div class="container">
    <div class="title">
      <h3>百度地图</h3>
      <el-button type="primary" @click="backHome">返回Home</el-button><br />
    </div>
    <div id="map" class="map">
      <div id="mouse-position"></div>
    </div>
  </div>
</template>

<script>
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import { Tile } from "ol/layer";
import { XYZ, TileImage } from "ol/source";
import TileGrid from "ol/tilegrid/TileGrid";
import { defaults, MousePosition, FullScreen, OverviewMap, ScaleLine, ZoomSlider, ZoomToExtent } from "ol/control";

import { transform } from "ol/proj";

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
      let resolutions = [];
      let baiduX,baiduY;

      for (let i = 0; i < 19; i++) {
        resolutions[i] = Math.pow(2, 18 - i);
      }
      let tilegrid = new TileGrid({
        origin: [0, 0],
        resolutions: resolutions
      });
      
      let baidu_source = new TileImage({
        projection:"EPSG:3857",
        tileGrid: tilegrid,
        tileUrlFunction: function(tileCoord) {
          if (!tileCoord)  return "";
          let z = tileCoord[0];
          let x = tileCoord[1];
          let y = tileCoord[2];
          // 对编号xy处理
          baiduX = (x<0) ? x : 'M'+(-x);
          baiduY = -y;
          return "http://online3.map.bdimg.com/onlinelabel/?qt=tile&x="+baiduX+"&y="+baiduY+"&z="+z+"&styles=pl&udt=20151021&scaler=1&p=1";
        }
      });

      let baidu_layer = new Tile({
        source: baidu_source
      });

      let map = new Map({
        target: "map",
        layers: [baidu_layer],
        view: new View({
          projection: "EPSG:3857", 
          center: [13531290.967373039, 4675318.865056401],
          zoom: 12
        }),
        // 显示鼠标位置坐标
        controls: defaults().extend([
          new MousePosition({
           // target: document.getElementById("mouse-position")
          }),
            new ScaleLine(),
            new ZoomSlider(),
          new ZoomToExtent()
        ])
      });
    },
    backHome() {
      this.$router.replace("/"); 
    }
  }
};
</script>

<style scoped></style>
