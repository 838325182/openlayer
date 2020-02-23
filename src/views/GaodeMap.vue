<template>
  <div class="container">
    <div class="title"> 
      <h3>index加载高德gcj02地图</h3>
      <el-button type="primary" @click="backHome">返回Home</el-button>
    </div>

    <div id="menu">
        <label style="font-weight: bold;">切换图层：</label>
        <select name="changeLayer" id="LayerSelect" >
            <option value="1">高德矢量数据</option>
            <option value="3">高德影像数据</option>
        </select>
    </div>



    <div id="map" class="map"></div>
  </div>
</template>

<script>
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import { Tile as TileLayer } from "ol/layer";
import { XYZ, TileDebug } from "ol/source";

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
      var gaodeSource =new XYZ({
          url:'http://webrd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}'
        });
      var gaodeMapLayer = new TileLayer({
        source: gaodeSource
      });
      var tileNo=new TileLayer({
          source: new TileDebug({
            projection: 'EPSG:4326',
            tileGrid: gaodeSource.getTileGrid()
          })
        });
      
      this.map = new Map({
        layers: [tileNo,gaodeMapLayer],
        
        view: new View({
          center: [104.07, 30.67],
          projection: "EPSG:4326",
          zoom: 12
        }),
        target: "map"
      });
    },
    backHome(){
      this.$router.replace('/')//指定跳转地址
    }
  }
};
//ed66df47a9d2de65ea18e35d27209979
// projection: "EPSG:3857",    //使用这个坐标系
//           center: [104.07, 30.67],
//           zoom: 14
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

 #menu {
            text-align: center;
            width: 100%;
            height: 20px;
            padding: 5px 10px;
            font-size: 14px;
            font-family: "微软雅黑";
            left: 10px;
        }
</style>