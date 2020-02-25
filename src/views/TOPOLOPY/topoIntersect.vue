<template>
  <div class="container">
    <div class="title">
      <h3>相交判断intersectsCoordinate</h3>
      <el-button type="primary" @click="backHome">返回Home</el-button>
      <el-button type="primary" @click="drawLineString">绘制线</el-button>
      <el-button type="primary" @click="drawPolygon">绘制面</el-button>
      <el-button type="primary" @click="isIntersect">拓扑相交判断</el-button>
      <el-button type="primary" @click="clearFeature">清空要素</el-button>
    </div>
    <div id="map">
      <div id="mouse-position"></div>
    </div>
  </div>
</template>

<script>
import "ol/ol.css";
import {Map, View} from 'ol';
import { Tile, Vector as VectorLayer } from "ol/layer";
import { XYZ, Vector as vectorSource } from "ol/source";
import { defaults, MousePosition } from "ol/control";
import { Polygon, LineString } from "ol/geom";
import { GeoJSON } from "ol/format";
import { fromLonLat } from "ol/proj";
import { Style, Fill, Stroke, Circle } from "ol/style";
import { Feature, Overlay } from "ol";
import { Draw } from "ol/interaction";
import {intersects} from 'ol/extent';
import * as turf from "@turf/turf";

export default {
  data() {
    return {
      map: {},
      draw: null,
      polygonSource: null,
      lineSource:null,
      addingImg: require("@/images/img/39-1.gif"),
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

      //实例化一个矢量图层Vector作为绘制层   
      this.polygonSource = new vectorSource({ wrapX: false });
      let polygonLayer = new VectorLayer({
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
      this.map.addLayer(polygonLayer);

      this.lineSource = new vectorSource({ wrapX: false });
      let lineLayer = new VectorLayer({
        source: this.lineSource,
        style: new Style({
          stroke: new Stroke({
            color: "#409EFF",
            width: 2
          })
        })
      });
      this.map.addLayer(lineLayer);
      

    },
    drawLineString() {
      this.map.removeInteraction(this.draw); //移除绘制图形控件
      this.draw = new Draw({
        source: this.lineSource,
        type: "LineString"
      });
      this.map.addInteraction(this.draw);
      
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
      let lines = this.lineSource.getFeatures();
      let geomPolygon0 = this.polygonSource.getFeatures()[0].getGeometry();
      let geomPolygon1 = this.polygonSource.getFeatures()[1].getGeometry();
      if(geomPolygon0 && geomPolygon1){
        let isIn =  geomPolygon1.intersectsExtent(geomPolygon0);
        console.log(isIn);
      }



      // if (lines && geomPolygon ) {
      //   lines.forEach((line) => {
      //     let geomLine=line.getGeometry();
      //     console.log(geomLine);
      //     let isIn =  geomLine.intersectsExtent(geomPolygon);
      //     console.log(geomPolygon);
      //     console.log(isIn);
      //     if(isIn) {
      //       geomLine.setStyle(
      //         new Style({
      //           image: new Circle({
      //             radius: 7,
      //             fill: new Fill({color: "#ffcc33"})
      //           })
      //         })
      //       );
      //     }
      //   });
      // }
    },
    clearFeature(){
      this.map.removeInteraction(this.draw); //移除绘制图形控件
      this.lineSource.clear();
      this.polygonSource.clear();
    },
    backHome() {
      this.$router.replace("/"); //指定跳转地址
    }
  }
};
</script>

<style scoped></style>
