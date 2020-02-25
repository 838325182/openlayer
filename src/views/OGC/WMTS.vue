<template>
  <div class="container">
    <div class="title">
      <h3 style="float: left; ">测试sld</h3>
      <div class="block" style="float: left; ">
        
        <Date ref="childDate"> </Date>
        <ParmCQL ref="childParmCQL"> </ParmCQL>
        
      </div>
      <el-button type="primary" @click="addXiaoquWMS" style="float: left; ">加载小区WMS</el-button>
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
import { Tile } from "ol/layer";
import { XYZ, TileWMS } from "ol/source";
import { MousePosition } from "ol/control";
import { fromLonLat } from "ol/proj";
import TileLayer from "ol/layer/Tile";
import Date from "@/components/YYYYMMDD.vue"
import ParmCQL from "@/components/ParmCQL.vue"

export default {
  data() {
    return {
      map: {},
      xiaoquWMS: null
    };
  },
  components: { Date, ParmCQL},
  mounted() {
    this.initmap();
  },
  methods: {
    initmap() {
      let sichaun = new fromLonLat([104.07, 30.67]);

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
          center: sichaun,
          minZoom: 1,
          zoom: 13
        }),
        controls: [
          new MousePosition({
            target: document.getElementById("mouse-position")
          })
        ]
      });
    },
    getCQLParm(){
      let filter ='1=1';
      // if (cityCode) {
      //   filter = "cityId='" + cityCode + "'";
      // }
      let freq=this.$refs.childParmCQL.freq;
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
    addXiaoquWMS() {
      let date=this.$refs.childDate.timeValue;//返回日期
      let provinceCode='51';//返回省份
      let cqlParm=this.getCQLParm();//返回地区频率参数
      //volte_wms_lte_dtvoltetac_2019111151d_20_20191113183003_(-180, -90,180,90)_cellvalue.csv
      // let layerName = "basal_wms_lte_dtsector_" + date + provinceCode + "d_cellvalue";//2.6
      let layerName = "basal_wms_lte_dtsector_" + date + provinceCode + "d_cellvalue";//1.106

      if(!date){
        console.log("未选择日期");
        return 
      }
      console.log("layerName="+layerName);
      console.log("cqlParm="+cqlParm);
      this.map.removeLayer(this.xiaoquWMS);
      let sourceWMS=new TileWMS({
        urls: ["https://172.18.2.6:26180/webgis/wms"],
        params: {
          LAYERS: layerName,
          TILED: true,
         CQL_FILTER: cqlParm
        }
      });
        
      this.xiaoquWMS = new TileLayer({
        source: sourceWMS ,
        zIndex: 2,
       // maxResolution: 20,
        name: "xiaoqu_tileWMS"//这个名字用来移除图层，或者查找土层中数据
      });
      
      this.map.addLayer(this.xiaoquWMS);
    },
    backHome() {
      this.$router.replace("/"); //指定跳转地址
    }
  }
};
</script>

<style scoped>

</style>
