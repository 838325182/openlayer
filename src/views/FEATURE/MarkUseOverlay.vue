<template>
  <div class="container">
    <div class="title">
      <h3>Overlay叠加层实现标注</h3>
      <el-button type="primary" @click="backHome">返回Home</el-button>
    </div>
    <div id="mapCon">
      <div id="mouse-position"></div>
    </div>
    <div id="label" style="display: none;">
      <div id="marker" class="marker" title="Marker">
        <a
          class="address"
          id="address"
          target="_blank"
          href="http://www.openlayers.org/"
          >标注点</a
        >
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

import blueIcon from "../../images/label/blueIcon.png";

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
      this.map = new Map({
        layers: [
          new Tile({
            title: "天地图矢量图层",
            source: new XYZ({
              url: this.GISConfig.tianditu_vec.url,
              wrapX: false
            })
          }),
          new Tile({
            title: "天地图矢量注记图层",
            source: new XYZ({
              url: this.GISConfig.tianditu_cva.url,
              wrapX: false
            })
          })
        ],
        target: "mapCon",
        view: new View({
          center: new FromLonLat(this.GISConfig.sichuan),
          minZoom: 2,
          zoom: 5
        }),
        controls: defaults().extend([
          new MousePosition({
            target: document.getElementById("mouse-position")
          })
        ])
      });

      
      const addOverlayLabel =(coordinate, map, markText)=> {
        var elementDiv = document.createElement("div");
        elementDiv.className = "marker"; ////////*******************这里没作用
        elementDiv.title = markText;
        var overlay = document.getElementById("label");
        overlay.appendChild(elementDiv);

        var elementA = document.createElement("a");
        elementA.className = "address"; ////////*******************这里没作用
        elementA.href = "#";
        elementA.textContent =markText;
        elementDiv.appendChild(elementA);

        var newMarkerOverlay = new Overlay({
          position: coordinate,
          positioning: "center-center",
          element: elementDiv,
          stopEvent: false
        });
        map.addOverlay(newMarkerOverlay);

        var newTextOverlay = new Overlay({
          position: coordinate,
          element: elementA
        });
        map.addOverlay(newTextOverlay);
      };

      
      addOverlayLabel(this.GISConfig.sichuan, this.map, "成都市");
      //为地图容器添加单击事件监听
      this.map.on("click", evt => {
        let text = "null";
        addOverlayLabel(evt.coordinate, this.map, text);
      });
    },

    backHome() {
      this.$router.replace("/"); //指定跳转地址
    }
  }
};
</script>

<style scoped>
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
  background-color: rgb(238, 255, 0);
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
