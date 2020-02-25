<template>
  <div class="container">
    <div class="title">
      <h3 style="float: left; ">select方法点击获取geoServeWFS服务的要素信息</h3>

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
import Overlay from "ol/Overlay";
import Select from "ol/interaction/Select";  
import {getCenter} from 'ol/extent'; 
import { Tile , Vector as vectorLayer } from "ol/layer";
import { OSM, Vector as vectorSource, XYZ } from "ol/source";
import { defaults, MousePosition } from "ol/control";
import { GeoJSON } from "ol/format";
import { Style, Stroke } from "ol/style";

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
      let tianditu_vec=  new Tile({
        title: "天地图矢量图层",
        source: new XYZ({
          url:this.GISConfig.tianditu_vec.url,
          wrapX: false
        })
      });
      let xiaoquLayer=new vectorLayer({
        source: new vectorSource({
          format: new GeoJSON({ geometryName: "the_geom" }),
          url:"http://localhost:8081/geoserver/yyc/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=yyc:panel_xiaoqu&maxFeatures=5000&outputFormat=application%2Fjson"
        }),
        style: function(feature, resolution) {
          return new Style({
            stroke: new Stroke({
              color: "blue",
              width: 5
            })
          });
        }
      });
      // ];

      this.map = new Map({
        layers: [ tianditu_vec,xiaoquLayer ],
        target: "mapCon",
        view: new View({
          // projection: "EPSG:4326",    //使用这个坐标系4326 或3857 都可以加载geoserve的服务会自己转换
          // center: [121.628, 38.912],
          projection: "EPSG:3857", //使用这个坐标系
          center: [13538740.967373039, 4705757.865056401],
          zoom: 13
        }),
        controls: defaults().extend([
          new MousePosition({
            target: document.getElementById("mouse-position")
          })
        ])
      });


      var popupLayer = new Overlay({
        element: document.getElementById("popupDiv"),
        autoPan: true,
        autoPanMargin: 100,
        positioning: "center-right"
      });
      this.map.addOverlay(popupLayer);

      var selectSingleClick = new Select();
      this.map.addInteraction(selectSingleClick);

      selectSingleClick.on("select", function(e) {
        var features = e.target.getFeatures().getArray();
        var element = popupLayer.getElement();//<div>元素
        if (features.length == 1){
          var feature = features[0];
          // console.log( features[0].values_ );
          var type = feature.getGeometry().getType();
          console.log( type );
          var property = feature.getProperties();
          console.log( property );
          var coordinate = new getCenter(feature.getGeometry().getExtent());
          popupLayer.setPosition(coordinate);
          console.log( coordinate );
          // $("#popupDiv").html();
          $("#popupContent").empty();
          $("#popupContent").append(
            `小区名字：<span><a href='${property.url}' target='_blank'>${property.mingzi}</a></span><br/>
            房价：${property.avg}<br/>
            所在区：${property.area}<br/>
            年代：${property["年代"]}<br/>
            户数：${property["户数"]}<br/>
            栋数：${property["栋数_1"]}<br/>
            lon:${coordinate[0]}<br/>
            lat:${coordinate[1]}<br/> `
          );
        } else{
          return;
        }
      });

      $("#closeOverlay").on("click", function(e) {
        popupLayer.setPosition(undefined);
      });
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
