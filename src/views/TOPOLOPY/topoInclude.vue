<template>
  <div class="container">
    <div
      id="preview"
      style="display: none; text-align: center; padding-top: 250px; font-weight: bold; "
    >
      <img v-bind:src="addingImg" /><br />
      <br />
      <span>正在进行拓扑分析，请稍候</span>
    </div>
    <div class="title">
      <h3>openlayer拓扑包含containsXY或intersectsCoordinate</h3>
      <el-button type="primary" @click="backHome">返回Home</el-button>
      <el-button type="primary" @click="drawPolygon">绘制面</el-button>
      <el-button type="primary" @click="isIntersect">拓扑包含判断</el-button>
      <el-button type="primary" @click="clearPolygon">重画面</el-button>
    </div>
    <div id="map">
      <div id="mouse-position"></div>
    </div>
  </div>
</template>

<script>
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import { Tile, Vector as VectorLayer } from "ol/layer";
import { XYZ, Vector as vectorSource } from "ol/source";
import { defaults, MousePosition } from "ol/control";
import { Point, Polygon } from "ol/geom";
import { GeoJSON } from "ol/format";
import { fromLonLat } from "ol/proj";
import { Style, Fill, Stroke, Circle } from "ol/style";
import { Feature, Overlay } from "ol";
import { Draw } from "ol/interaction";

export default {
  data() {
    return {
      map: {},
      drawLayer: null,
      draw: null,
      polygonSource: null,
      addingImg: require("@/images/img/39-1.gif"),
      pointLayer: null
    };
  },
  mounted() {
    this.initmap();
  },
  methods: {
    initmap() {
      // let dalian = new fromLonLat( this.GISConfig.dalian );
      let dalian = [104.6727778, 31.2897222]; // this.GISConfig.dalian;
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
        target: "map",
        view: new View({
          center: dalian,
          projection: "EPSG:4326",
          minZoom: 2,
          zoom: 8
        }),
        controls: defaults().extend([
          new MousePosition({
            target: document.getElementById("mouse-position")
          })
        ])
      });

      this.pointLayer = new VectorLayer({
        source: new vectorSource({
          format: new GeoJSON({ geometryName: "the_geom" }),
          // url:"http://localhost:8081/geoserver/yyc/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=yyc:pointdalianxiaoqu&maxFeatures=5000&outputFormat=application%2Fjson",
          url:
            "http://localhost:8081/geoserver/yyc/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=yyc:nbplot2&maxFeatures=5000&outputFormat=application%2Fjson"
        }),
        style: new Style({
          fill: new Fill({
            color: "rgba(255, 255, 255, 0.2)"
          }),
          stroke: new Stroke({
            color: "#409eff",
            width: 2
          }),
          image: new Circle({
            radius: 6,
            fill: new Fill({ color: "#409eff" })
          })
        })
      });
      this.map.addLayer(this.pointLayer);

      //实例化一个矢量图层Vector作为绘制层   drawLayer
      this.polygonSource = new vectorSource({ wrapX: false });
      this.polygonLayer = new VectorLayer({
        source: this.polygonSource,
        style: new Style({
          fill: new Fill({
            color: "rgba(64, 155, 255, 0.1)"
          }),
          stroke: new Stroke({
            color: "#409EFF",
            width: 2
          }),
          image: new Circle({
            radius: 5,
            stroke: new Stroke({
              color: "red"
            }),
            fill: new Fill({
              color: "rgba(255, 255, 255, 0.2)"
            })
          })
        })
      });
      this.map.addLayer(this.polygonLayer);
      
    },
    drawPolygon() {
      this.map.removeInteraction(this.draw); //移除绘制图形控件
      this.draw = new Draw({
        source: this.polygonSource,
        type: "Polygon"
      });
      this.map.addInteraction(this.draw);
    },
    isIntersect() {
      this.map.removeInteraction(this.draw);
      let points = this.pointLayer.getSource().getFeatures();
      let polygon = this.polygonSource.getFeatures()[0].getGeometry();
      if (points && polygon ) {
        points.forEach((point) => {
          let pointCoordinate=point.getGeometry().flatCoordinates;
          // let isIn = polygon.intersectsCoordinate(pointCoordinate);
          let isIn = polygon.containsXY(pointCoordinate[0],pointCoordinate[1]);
          if(isIn) {
            point.setStyle(
              new Style({
                image: new Circle({
                  radius: 7,
                  fill: new Fill({color: "#ffcc33"})
                })
              })
            );
          }
        });
      }
    },
    clearPolygon(){
      this.map.removeInteraction(this.draw); //移除绘制图形控件
      let points = this.pointLayer.getSource().getFeatures();
      points.forEach((point) => {
        point.setStyle(
          new Style({
            image: new Circle({
              radius: 6,
                fill: new Fill({ color: "#409eff" })
            })
          })
        )
      });
      this.polygonSource.clear();
    },
    // stopPressBar() {
    //   //停止进度条
    //   document.getElementById("preview").style.display = "none";
    // },
    // startPressBar() {
    //   //开始进度条动画
    //   document.getElementById("preview").style.display = "";
    // },
    backHome() {
      this.$router.replace("/"); //指定跳转地址
    }
  }
};
</script>

<style scoped></style>
