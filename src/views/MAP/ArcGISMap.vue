<template>
  <div class="container">
    <div class="title"> 
      <h3>加载地图</h3>
      <el-button type="primary" @click="backHome">返回Home</el-button>
    </div>
    <div id="map" class="map"></div>
  </div>
</template>

<script>
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import { Tile as TileLayer, Image as ImageLayer } from "ol/layer";
import { OSM, ImageArcGISRest } from "ol/source";
import { defaults, MousePosition, FullScreen, OverviewMap, ScaleLine, ZoomSlider, ZoomToExtent } from "ol/control";
export default {
    data(){
        return{
            map:{}
        }
    },
  mounted() {
    this.initmap();
  },
  methods: {
    initmap() {

      var layers = [
        new TileLayer({
          source: new OSM()
        }),
        new ImageLayer({
          source: new ImageArcGISRest({
            ratio: 1,
            params: {},
            url: 'https://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Specialty/ESRI_StateCityHighway_USA/MapServer'
          })
        })
      ];
      this.map = new Map({
        layers: layers,
        target: "map",
        view: new View({
          projection: "EPSG:4326",    //使用这个坐标系
          center: [105.22, 28.23],
          zoom: 10
        }),
        controls: defaults().extend([
          new MousePosition({ }),
          new FullScreen(),
            new OverviewMap(),
            // new ScaleLine(),
            new ZoomSlider(),
            new ZoomToExtent()

            

        ])
      });
    },
    backHome(){
      this.$router.replace('/')//指定跳转地址
    }
  }
};
//ed66df47a9d2de65ea18e35d27209979
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

.map, #map {
  width: 100%;
  height: 100%;
}
</style>