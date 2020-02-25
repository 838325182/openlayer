<template>
  <div class="container">
    <div class="title">
      <h3 style="float: left; ">网络上在线WFS服务地图</h3>
      <div class="block" style="float: left; ">
        <Date ref="childDate"> </Date>
        <ParmCQL ref="childParmCQL"> </ParmCQL>
      </div>
      <el-button type="primary" @click="addWFS" style="float: left; ">加载wfs</el-button>
      <el-button type="primary" @click="backHome" style="float: left; ">返回Home</el-button>
    </div>
    <div id="mapCon">
      <div id="mouse-position"></div>
    </div>
  </div>
</template>

<script>
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import { XYZ, TileWMS } from "ol/source";
import { MousePosition } from "ol/control";
import Date from "@/components/YYYYMMDD.vue"
import ParmCQL from "@/components/ParmCQL.vue"


import GeoJSON from "ol/format/GeoJSON";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { bbox as bboxStrategy } from "ol/loadingstrategy";
import BingMaps from "ol/source/BingMaps";
import VectorSource from "ol/source/Vector";
import { Stroke, Style } from "ol/style";



export default {
  data() {
    return {
      map: {},
      vectorLayer: null
    };
  },
  components: { Date, ParmCQL},
  mounted() {
    this.initmap();
  },
  methods: {
    initmap() {
      this.map = new Map({
        layers: [
          new TileLayer({
            title: "天地图矢量图层",
            source: new XYZ({
              url:
                "http://t0.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=ed66df47a9d2de65ea18e35d27209979",
              wrapX: false
            })
          }),
          new TileLayer({
            title: "天地图矢量注记图层",
            source: new XYZ({
              url:
                "http://t0.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=ed66df47a9d2de65ea18e35d27209979",
              wrapX: false
            })
          })
        ],
        target: "mapCon",
        view: new View({
          ESPG:'3857',
          center: [-8908887.277395891, 5381918.072437216],
          maxZoom: 19,
          zoom: 12
        }),
        controls: [
          new MousePosition({
            target: document.getElementById("mouse-position")
          })
        ]
      });
    },
    getParm() {
      let filter ='1=1';
      let freq=this.$refs.childParmCQL.freq;//频率下拉组件的值
      let indoor=this.$refs.childParmCQL.indoor;

      if (freq) {
        filter=`freq='${freq}'`;
        if (indoor) {
          filter+=` and is_indoor='${indoor}'`;
        }
      }else{
        if (indoor) {
          filter=`is_indoor='${indoor}'`;
        }
      }
      return filter;
    },
    addWFS() {
      let cqlParm=this.getParm();
      let date=this.$refs.childDate.timeValue;//返回日期
      let layerName = "basal_wms_lte_dtsector_" + date + "51d_cellvalue";
      console.log("CQL_FILTER:  "+cqlParm);
      console.log("layerName="+layerName);

      this.map.removeLayer(this.vectorLayer);

      let vectorSource=new VectorSource({
        format: new GeoJSON(),
        url:
        //["https://ahocevar.com/geoserver/wfs?service=WFS&version=1.1.0&request=GetFeature&typename=osm:water_areas&outputFormat=application/json&srsname=EPSG:3857&bbox=-8924518.64968021,5370452.51819444,-8893255.905111572,5393383.626679991,EPSG:3857"],
        function(extent) {
          let wfsUrl=  
          
          'https://ahocevar.com/geoserver/wfs?service=WFS&' +
          'version=1.1.0&request=GetFeature&typename=osm:water_areas&' +
          'outputFormat=application/json&srsname=EPSG:3857&' +
          'bbox=' + extent.join(',') + ',EPSG:3857';
          console.log(wfsUrl);
          return wfsUrl;
        },
        strategy: bboxStrategy
      });

      this.vectorLayer = new VectorLayer({
        source: vectorSource,
        style: new Style({
          stroke: new Stroke({
            color: "rgba(0, 0, 255, 1.0)",
            width: 2
          })
        }),
        zIndex: 1,
        name:'vectorLayer'//这个名字用来移除图层，或者查找土层中数据
      });

      this.map.addLayer(this.vectorLayer);
      
    },
    backHome() {
      this.$router.replace("/"); //指定跳转地址
    }
  }
};
</script>

<style scoped>

</style>
