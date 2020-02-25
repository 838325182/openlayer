<template>
  <div class="container">
    <div class="title"> 
      <h3>Label添加标签</h3>
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
import { Tile, Vector as VectorLayer } from "ol/layer";
import { XYZ, Vector as VectorSource } from "ol/source";
import { defaults, MousePosition } from "ol/control";
import { Point } from "ol/geom";
import { Style, Icon } from "ol/style";
import { Feature } from "ol";
import { fromLonLat } from "ol/proj";
// import blueIcon from '../images/label/blueIcon.png'

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
      var beijing = new fromLonLat([116.28, 39.54]);
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
          center: beijing,
          minZoom: 2,
          zoom: 12
        }),
        controls: defaults().extend([
          new MousePosition({
            target: document.getElementById("mouse-position")
          })
        ])
      });
      var blueIcon = require("../../images/label/blueIcon.png");
      //实例化Vector要素，通过矢量图层添加到地图容器中
      var icon = new Feature({
        geometry: new Point(beijing)
      });
      icon.setStyle(
        new Style({
          image: new Icon({
            anchor: [0.5, 60],
            anchorOrigin: "top-right",
            anchorXUnits: "fraction",
            anchorYUnits: "pixels",
            offsetOrigin: "top-right",
            // offset:[0,10],
            //图标缩放比例
            // scale:0.5,
            //透明度
            //opacity: 0.75,
            //图标的url
            src: blueIcon
          })
        })
      );
      //矢量标注的数据源
      var vSource = new VectorSource({
        features: [icon]
      });
      //矢量标注图层
      var vLayer = new VectorLayer({
        source: vSource
      });
      this.map.addLayer(vLayer);
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