<template>
  <div class="container">
    <div class="title"> 
      <h3>静态地图</h3>
      <el-button type="primary" @click="backHome">返回Home</el-button>
    </div>

    <div id="map" class="map"></div>
  </div>
</template>

<script>
import "ol/ol.css";

import Feature from "ol/Feature";
import Map from "ol/Map";
import View from "ol/View";
import { Tile as TileLayer, Image, Vector as VectorLayer} from "ol/layer";
import { XYZ, ImageStatic, Vector as SourceVector } from "ol/source";
import { transform } from "ol/proj";
import { Point } from "ol/geom";
import { Icon, Style } from "ol/style";


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
      var center = new transform([104.06667, 30.66667], 'EPSG:4326', 'EPSG:3857');
      var extent = [
            center[0] - 550 * 1000 / 2, 
            center[1] - 344 * 1000 / 2, 
            center[0] + 550 * 1000 / 2, 
            center[1] + 344 * 1000 / 2
      ];
      var pandaBase=require('@/images/img/pandaBase.png');
      var staticSource =new ImageStatic({
          url: pandaBase, // 熊猫基地地图
          imageExtent: extent          //映射到地图的范围
      });
      var staticLayer= new Image({
        source: new ImageStatic({
            url: pandaBase, // 熊猫基地地图
            imageExtent: extent          //映射到地图的范围
        })
      });

      //创建一个用于放置活动图标的layer
        var activityLayer = new VectorLayer({
            source: new SourceVector()
        });
        //创建一个活动图标需要的Feature，并设置位置
        var activity = new Feature({
            geometry: new Point([center[0]- 550*1000/2 + 390 * 1000, center[1]-344*1000/2 + (344 - 145) * 1000])
        });
        //设置Feature的样式，使用小旗帜图标
         var flag_right=require('@/images/label/blueIcon.png');
        activity.setStyle(new Style({
            image: new Icon({
                src: flag_right,
                anchor: [0, 1],
                scale: 0.2
            })
        }));
        //添加活动Feature到layer上，并把layer添加到地图中
        activityLayer.getSource().addFeature(activity);
        // map2.addLayer(activityLayer);


      var tiandituLayer = new TileLayer({
        title: "天地图矢量图层",
        source: new XYZ({
          url:
            "http://t0.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=ed66df47a9d2de65ea18e35d27209979",
          wrapX: false
        })
      });

      var map = new Map({
        layers:[ tiandituLayer,staticLayer,activityLayer ],
        target: 'map',
        view:new View({
            center: center,
            zoom: 8
        })
      });
      this.map = map;
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