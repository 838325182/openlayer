<template>
  <div class="container">
    <div class="title"> 
      <h3>必应地图</h3>
      <el-button type="primary" @click="backHome">返回Home</el-button>
    </div>
    

    <select id="layer-select">
      <option value="Aerial">天线</option>
      <option value="AerialWithLabelsOnDemand" selected>带标签的天线</option>
      <option value="RoadOnDemand">路</option>
      <option value="CanvasDark">道路</option>
      <option value="OrdnanceSurvey">军械调查</option>
    </select>
    <div id="map" class="map" >
      <div id="mouse-position" style="float: left; position: absolute; bottom: 5px; width: 350px; height: 20px; z-index: 2000;">
        </div>
    </div>
  </div>
</template>

<script>
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import BingMaps from 'ol/source/BingMaps';
import { ScaleLine, FullScreen, OverviewMap } from "ol/control";
import { fromLonLat } from "ol/proj";
// ol.coordinate.format

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
      var styles = [
        // "Road","Aerial","AerialWithLabels", "collinsBart",
        // "Road"：卫星拍摄道路影像。
        // "Aerial"：航拍影像。
        // "AerialWithLabels"：道路覆盖航拍影像。
        "RoadOnDemand",
        "Aerial",
        "AerialWithLabelsOnDemand",
        "CanvasDark",
        "OrdnanceSurvey"
      ];
      var layers = [];
      var i, ii;
    
      for (i = 0, ii = styles.length; i < ii; ++i) {
        layers.push(
          new TileLayer({
            visible: false,
            preload: Infinity,
            source: new BingMaps({
              key:"Apdmt4gFG6YoFiq6OpY94fXEd3c4VvYO7qwIvufuc7QK_QHSEzhqvvI3un5zNPOU",
              imagerySet: styles[i],
            //   maxZoom: 19
            })
          })
        );
      }
      
      this.map = new Map({
        layers: layers,
        target:"map",
        view: new View({
           projection:"EPSG:3857",
          center: [1051111, 2811111],
          zoom: 13
        })
      });
      this.map.addControl(new ScaleLine());
      this.map.addControl(new FullScreen());
      //添加缩略图控件
      this.map.addControl(new OverviewMap({
        collapsed: false  
      }));
     
      

      var select = document.getElementById("layer-select");
      function onChange() {
        var style = select.value;
        for (var i = 0, ii = layers.length; i < ii; ++i) {
          layers[i].setVisible(styles[i] === style);
        }
      }
      select.addEventListener("change", onChange);
      onChange();
    },
    backHome(){
      this.$router.replace('/')//指定跳转地址
    }
  }
};
</script>
  
<style>
.container {
  margin: 0px;
  padding: 0px;
  widows: 100%;
  height: 100%;
}

.map {
  width: 100%;
  height: 98%;
}
.title{
position: absolute;/*这里一定要设置*/
z-index: 999999;
margin-top: 10px;
margin-left: 50px;
}
</style>