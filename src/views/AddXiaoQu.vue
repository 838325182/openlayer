<template>
  <div class="container">
    <div class="title"> 
      <h3>加载WMS服务地图</h3>
      <el-button type="primary" @click="backHome">返回Home</el-button>
    </div>
    <div id="mapCon" style="width: 100%; height: 90%; position: absolute;">
        <div id="mouse-position" style="float: left; position: absolute; bottom: 5px; width: 350px; height: 20px; z-index: 2000;">
        </div>
    </div>
  </div>
</template>

<script>
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import { Tile } from "ol/layer";
import { XYZ, TileWMS } from "ol/source";
import { MousePosition } from "ol/control";
import { fromLonLat } from "ol/proj";
import TileLayer from "ol/layer/Tile";

export default {
  data() {
    return {
      map: {}
    };
  },
  mounted() {
    this.initmap();
    this.addAllSectorLayer('2019-10-21','510000',null);
  },
  methods: {
    initmap() {
      var sichaun = new fromLonLat([104.07, 30.67]);

      //实例化Map对象加载地图,默认底图加载天地图
      this.map = new Map({
        layers: [
          new Tile({
            title: "天地图矢量图层",
            source: new XYZ({
              url:
                "http://t0.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=ed66df47a9d2de65ea18e35d27209979",
              wrapX: false
            })
          }),
          new Tile({
            title: "天地图矢量注记图层",
            source: new XYZ({
              url:
                "http://t0.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=ed66df47a9d2de65ea18e35d27209979",
              wrapX: false
            })
          })
        ],
        //地图容器div的ID
        target: "mapCon",
        view: new View({
          //地图初始中心点
          center: sichaun,
          minZoom: 2,
          zoom: 13
        }),
        controls: [
          new MousePosition({
            target: document.getElementById("mouse-position")
          })
        ]
      });
    },
    addAllSectorLayer(date, provinceCode, cityCode) {
      let pid = ("" + provinceCode).slice(0, 2);
      let time = date && date.replace(/-/g, "");
      let filter = "1=1";
      if (cityCode) {
        filter = "cityId='" + cityCode + "'";
      }
      let layerName = "basal_wms_lte_dtsector_" + time + pid + "d_cellvalue";
      console.log(layerName);
      let layer = new TileLayer({
        source: new TileWMS({
          urls: ["https://172.18.2.106:26180/webgis/wms"],
          params: {
            LAYERS: layerName,
            TILED: true,  //切片
            CQL_FILTER: filter
          }
        }),
        zIndex: 1,
        maxResolution: 20,
        name: "allSectorLayer"
      });
      this.map.addLayer(layer);
    },
    backHome(){
      this.$router.replace('/')//指定跳转地址
    }
  }
};
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
</style>  