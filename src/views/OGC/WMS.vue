<template>
  <div class="container">
    <div class="title">
      <h3 style="float: left; ">webgis服务器WMS服务地图</h3>
      <div class="block" style="float: left; ">
        
        <Date ref="childDate"> </Date>
        <ParmCQL ref="childParmCQL"> </ParmCQL>
        
      </div>
      <el-button type="primary" @click="addXiaoquWMS" style="float: left; ">加载小区WMS</el-button>
      <el-button type="primary" @click="backHome" style="float: left; ">返回Home</el-button>
      
    </div>
    <div id="mapCon">

      <div id="popupDiv">
        <div id='popupTitle'>小区信息<a id='closeOverlay'></a></div>
        <div id='popupContent' ></div>
      </div>

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

import Overlay from "ol/Overlay";
import { GeoJSON } from "ol/format";

export default {
  data() {
    return {
      map: {},
      xiaoquWMS: null,
      sourceWMS :null
    };
  },
  components: { Date, ParmCQL},
  mounted() {
    this.initmap();
  },
  methods: {
    initmap() {
      const _this=this;
      let sichaun = new fromLonLat([104.07, 30.67]);

      //实例化Map对象加载地图,默认底图加载天地图
      this.map = new Map({
        layers: [
          new Tile({  
            title: "天地图矢量图层",
            source: new XYZ({
              url:this.GISConfig.tianditu_vec.url,
              wrapX: false
            })
          }),
          new Tile({
            title: "天地图矢量注记图层",
            source: new XYZ({
              url:this.GISConfig.tianditu_cva.url,
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

      var popupLayer = new Overlay({
        element: document.getElementById("popupDiv"),
        autoPan: true,
        autoPanMargin: 100,
        positioning: "center-right"
      });
      this.map.addOverlay(popupLayer);

      $("#closeOverlay").on("click", function(e) {
        popupLayer.setPosition(undefined);
      });


      this.map.on('singleclick', function(evt) {
        let featureUrl=null;
        let view = evt.map.getView();
        let layers=evt.map.getLayers().getArray();
        
        for(var i=0; i<layers.length;i++){
          if(layers[i].getProperties()['name'] && layers[i].getProperties()['name']=="xiaoqu_tileWMS"){
            let source=layers[i].getSource();
            featureUrl = _this.sourceWMS.getFeatureInfoUrl(
              evt.coordinate, 
              view.getResolution(), 
              view.getProjection(),
              {'INFO_FORMAT': 'application/json'}
            );
          }
        }
        if (featureUrl) {
          var format = new GeoJSON();
            _this.$axios.get(featureUrl).then(res=>{
              console.log(res.data)
              if (res.data.features) {
                var result = format.readFeatures(res.data)
                var feature = result[0];
                if (feature) {
                  console.log(feature)
                  let property=feature.getProperties();
                  $("#popupContent").empty();
                  $("#popupContent").append(
                    `lc_name:${property.lc_name}<br/>
                    is_indoor:${property.is_indoor}<br/>
                    ant_azimuth:${property.ant_azimuth}<br/>
                    cell_key:${property["cell_key"]}<br/>
                    cityId:${property["cityId"]}<br/>
                    districtId:${property["districtId"]}<br/>
                    freq:${property["freq"]}<br/>
                    lon:${property["longitude"]}<br/>
                    lat:${property["latitude"]}<br/> `
                  );
                  let coordinate = new fromLonLat([property.longitude,property.latitude]);
                  popupLayer.setPosition(coordinate);
                } 
              }
            })
            // .catch(error=>{
            //   console.log("请求该要素信息结束");
            // })
        }
      });


    },
    getCQLParm(){
      let filter ='1=1';
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
      
      this.map.removeLayer(this.xiaoquWMS);
      this.sourceWMS=new TileWMS({
        urls: ["https://172.18.2.39:26180/webgis/wms"],
        params: {
          LAYERS: "nbiot_wms_lte_nbplot_2019121151d_cellvalue",//layerName,
          TILED: true,
        //  CQL_FILTER: cqlParm
        }
      });
        
      this.xiaoquWMS = new TileLayer({
        source: this.sourceWMS ,
        zIndex: 2,
      //  maxResolution: 20,
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
#popupDiv{
  position: absolute;
  width: 200px;
  border-radius: 6px;
  background: #e4df25;
  padding: 10px;
}
#popupTitle{
  text-align:center;
  height: 25px;
  line-height:25px;
  margin-bottom: 3px;
  border-bottom: 2px solid #c64af9;
}

#popupContent:after, #popupContent:before {
    top: 100%;
    border: solid transparent;
    content: " ";
    height: 0;
    width: 0;
    position: absolute;
    /* pointer-events: none; */
    left:115px;
}

#popupContent:after {
    border-top-color: white;
    border-width: 10px;
    margin-left: -10px;
}

#popupContent:before {
    border-top-color: #cccccc;
    border-width: 10px;
    margin-left: -10px;
}

#closeOverlay:after {
  float: right;
  margin-right: 15px;
  color: #7a00ff;
    content: "✖";
    cursor:pointer;
}

#popupContent a{
  color:blue;
  float: right;
  margin-right: 10px;
  text-decoration: underline;
}
</style>
