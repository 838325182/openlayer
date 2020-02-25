<template>
  <div class="container">
    <div class="title">
      <h3>point实现文本图片标注</h3>
      <el-button type="primary" @click="backHome">返回Home</el-button>
    </div>
    <div id="mapCon" style="width: 100%; height: 90%; position: absolute;">
      <div
        id="mouse-position"
        style="float: left; position: absolute; bottom: 5px; width: 350px; height: 20px; z-index: 2000;"
      ></div>
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
import { Feature } from "ol";
import { fromLonLat } from "ol/proj";
import blueIcon from "../../images/label/blueIcon.png";
import { feature } from "@turf/turf";

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
      const _this = this;
      let iconFeature = new Feature({
        geometry: new Point(beijing),
        name: "北京市",
        population: 2115
      });
      iconFeature.setStyle(_this.createLabelStyle(iconFeature));

      let vLayer = new VectorLayer({
        source: new VectorSource({
          features: [iconFeature]
        }),
      });
      this.map.addLayer(vLayer);

      this.map.on("click", function(evt) {
        var newFeature = new Feature({
          geometry: new Point(evt.coordinate),
          name: "标注点"
        });
        let style = _this.createLabelStyle(newFeature);
        style.getImage().setScale(_this.map.getView().getZoom() / 10);
        newFeature.setStyle(style);
        vLayer.getSource().addFeature(newFeature);
      });
      this.map.getView().on("change:resolution", function() {
        let features = vLayer.getSource().getFeatures();
        features.forEach(feature => {
          let style = feature.getStyle();
          style.getImage().setScale(this.getZoom() / 10);
          feature.setStyle(style);
        });
      });
    },

    createLabelStyle(feature) {
      return new Style({
        image: new Icon({
          anchor: [0.5, 60],
          anchorOrigin: "top-right",
          anchorXUnits: "fraction",
          anchorYUnits: "pixels",
          offsetOrigin: "top-right",
          opacity: 0.75,
          src: blueIcon,
        }),
        text: new Text({
          textAlign: "center",
          textBaseline: "middle",
          font: "normal 14px 微软雅黑",
          text: feature.get("name"),
          fill: new Fill({
            color: "#000"
          }),
          stroke: new Stroke({
            color: "#F00",
            width: 2
          })
        })
      });
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
</style>
