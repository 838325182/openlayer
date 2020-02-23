<template>
  <div class="container">
    <div class="title">
      <h5>DragRotateAndZoom控件允许用户通过鼠标点击和拖拽来缩放和旋转地图，默认情况下，该控件仅限于按住Shift键时起作用。</h5>
      <el-button type="primary"
                 @click="backHome">返回Home</el-button>
    </div>
    <div id="mapCon">
      <div id="mouse-position">
      </div>
    </div>

    
  </div>
</template>

<script>
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import { Tile as TileLayer } from "ol/layer";
import { XYZ } from "ol/source";
import { defaults, MousePosition } from "ol/control";
import { defaults as defaultsInt, DragRotateAndZoom } from "ol/interaction";

export default {
  data () {
    return {
      map: {}
    };
  },
  mounted () {
    this.initmap()
  },
  methods: {
    initmap () {

      var gaodeMap_vec = new TileLayer({
        title: "高德矢量图层",
        source: new XYZ({
          url: "http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
          wrapX: false
        }),
      });

      var gaodeMap_img = new TileLayer({
        title: "高德影像图层",
        source: new XYZ({
          url: 'http://webst0{1-4}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
          wrapX: false
        }),
      });

      this.map = new Map({
        //将DragRotateAndZoom控件添加到地图
        interactions: defaultsInt().extend([      
          new DragRotateAndZoom()
        ]),
        layers: [gaodeMap_img, gaodeMap_vec],
        target: "mapCon",
        view: new View({
          center: [104.07, 30.67],
          projection: "EPSG:4326",    //使用这个坐标系
          // minZoom: 2,
          zoom: 12
        }),
        controls: defaults().extend([
          new MousePosition({
            target: document.getElementById("mouse-position")
          })
        ])
      });
      
    },
    backHome () {
      this.$router.replace('/')//指定跳转地址
    }
  }
};
</script>

<style scoped>
</style>