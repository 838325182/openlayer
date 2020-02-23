<template>
  <div class="container">
    <div class="title">
      <h3>Overlay叠加层实现标注</h3>
      <el-button type="primary" @click="backHome">返回Home</el-button>
    </div>
    <div id="mapCon" style="width: 100%; height: 90%; position: absolute;">
      <div
        id="mouse-position"
        style="float: left; position: absolute; bottom: 5px; width: 350px; height: 20px; z-index: 2000;"
      ></div>
    </div>
    <div id="label" style="display: none;">
      <div id="marker" class="marker" title="Marker">
        <a class="address" id="address" target="_blank" href="http://www.openlayers.org/">标注点</a>
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
import { Style, Icon, Text, Fill, Stroke } from "ol/style";
import { Feature, Overlay } from "ol";
import { fromLonLat as FromLonLat } from "ol/proj";
// import { Overlay } from "ol/Overlay";

import blueIcon from "../images/label/blueIcon.png";

export default {
  data() {
    return {
      map: {}
    };
  },
  mounted() {
    this.initmap();
    // this.createLabelStyle();
  },
  methods: {
    //async
    initmap() {
      var beijing = new FromLonLat([116.28, 39.54]);
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

      //实例化overlay标注，添加到地图容器中
      //这样就实现了预先添加标注
      var markerOverlay = new Overlay({
        position: beijing,
        positioning: "center-center",
        element: document.getElementById("marker"),
        stopEvent: false
      });
      markerOverlay.getElement().title = "北京市";
      this.map.addOverlay(markerOverlay);

      var textOverlay = new Overlay({
        position: beijing,
        element: document.getElementById("address"),
        positioning: "left-top"
      });
      textOverlay.getElement().innerText = markerOverlay.getElement().title;
      this.map.addOverlay(textOverlay);

      //为地图容器添加单击事件监听
      this.map.on('click',  (evt)=> {
        this.addOverlayLabel(evt.coordinate,this.map);
      });

      
    },
     addOverlayLabel(coordinate,map) {
        //新增div元素
        var elementDiv = document.createElement("div");
        elementDiv.className = "marker";////////*******************这里没作用
        elementDiv.title = "new标注点";
        // 获取id为label的元素
        var overlay = document.getElementById("label");
        // 为ID为label的div层添加div子节点
        overlay.appendChild(elementDiv);
        //新增a元素
        var elementA = document.createElement("a");
        elementA.className = "address";////////*******************这里没作用
        elementA.href = "#";
        //设置文本
        elementA.textContent = elementDiv.title;
        // 新建的div元素添加a子节点
        elementDiv.appendChild(elementA);

        //实例化图文标注（图形+文本），添加到地图容器中
        var newMarker = new Overlay({
          position: coordinate,
          positioning: "center-center",
          element: elementDiv,
          stopEvent: false
        });
        map.addOverlay(newMarker);
      
        var newText = new Overlay({
          position: coordinate,
          element: elementA
        });
        map.addOverlay(newText);
      },
    backHome() {
      this.$router.replace("/"); //指定跳转地址
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
.title {
  position: absolute; /*这里一定要设置*/
  z-index: 999999;
  margin-top: 10px;
  margin-left: 50px;
}
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