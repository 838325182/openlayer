<template>
  <div class="container">
    <div class="title">
      <h3>index加载高德gcj02地图+经纬网编码</h3>
      <el-button type="primary" @click="backHome">返回Home</el-button>
      <div id="menu">
        <label style="font-weight: bold;">切换图层：</label>
        <select name="changeLayer" id="LayerSelect" style="font-size:19px; " >
          <option value="gaodeMap_vec">高德矢量数据</option>
          <option value="gaodeMap_img">高德影像数据</option>
          <option value="graticules">经纬网编码</option>
        </select>
      </div>
    </div>
    <div id="map" class="map" style="width:50%; float:left;    position: relative;"></div>
    <div id="map2" class="map" style="width:49%; float:right;    position: relative;"></div>
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
      map: {},
      map2:{},
    };
  },
  mounted() {
    this.initmap();
  },
  methods: {
    initmap() {
      let gaodeMap_vec = new TileLayer({
        title: "高德矢量图层",
        source: new XYZ({
          url:
            "http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
          wrapX: false
        })
      });
      let map2_vec = new TileLayer({
        title: "高德矢量图层",
        source: new XYZ({
          url:
            "http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
          wrapX: false
        })
      });
      let gaodeMap_img = new TileLayer({
        title: "高德影像图层",
        source: new XYZ({
          url:
            "http://webst0{1-4}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}",
          wrapX: false
        })
      });

      let graticules = new TileLayer({
        title: "高德经纬网",
        source: new TileDebug({
          projection: "EPSG:4326",
          tileGrid: gaodeMap_vec.getSource().getTileGrid()
        })
      });
      let view=new View({
          center: [104.07, 30.67],
          projection: "EPSG:4326",
          zoom: 12
        });
      this.map = new Map({
        layers: [gaodeMap_img],
        view: view,
        target: "map"
      });

      this.map2 = new Map({
        layers: [map2_vec],
        view: view,
        target: "map2"
      });
      const _this=this;

      $("#LayerSelect").change(function(){
        let value=$("#LayerSelect").val();
        _this.map.getLayers().clear();
        // _this.map2.addLayer(gaodeMap_vec);
        if(value=="gaodeMap_vec"){
          _this.map.addLayer(gaodeMap_vec);
        }else if(value=="gaodeMap_img"){
          _this.map.addLayer(gaodeMap_img);
        }else if(value=="graticules"){
          _this.map.addLayer(graticules);
        }else{
          return;
        }

        
      })

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

#menu {
  position:absolute;

  text-align: center;
  height: 60px;
  padding: 5px 10px;
  font-size: 19px;
  font-family: "微软雅黑";
}
</style>
